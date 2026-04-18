"""
Vocabulary Router — Spaced Repetition Flashcard System

Endpoints:
  GET  /words?level=B2         → fetch all words for a CEFR level
  GET  /due?level=B2&user_id=  → get today's due cards
  POST /start-session          → initialize progress rows for new words
  POST /result                 → save "knew it" / "still learning" result
  GET  /buckets?user_id=       → get bucket counts for progress dashboard
  POST /scenario               → generate a fresh Groq-powered scenario
"""

import uuid
from datetime import date, timedelta, datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from sqlalchemy import select, func, case, and_
from sqlalchemy.ext.asyncio import AsyncSession

from db.database import get_db
from models.vocabulary import VocabularyWord, UserVocabProgress, VocabBucket
from models.user import User
from services.groq_service import generate_vocabulary_scenario, get_word_origin_story
from services.auth_service import get_current_user
from services import redis_service
import json

router = APIRouter()

# ─── Spaced Repetition Schedule ───────────────────────────────────
# Defines how far into the future a card is pushed when the user gets it right.
BUCKET_SCHEDULE = {
    VocabBucket.LEARNING:  {"next_bucket": VocabBucket.REVIEWING, "days": 1},
    VocabBucket.REVIEWING: {"next_bucket": VocabBucket.STRONG,    "days": 3},
    VocabBucket.STRONG:    {"next_bucket": VocabBucket.MASTERED,  "days": 7},
    VocabBucket.MASTERED:  {"next_bucket": VocabBucket.MASTERED,  "days": 30},
}


# ─── Pydantic Schemas ────────────────────────────────────────────

class StartSessionRequest(BaseModel):
    level: str         # B1 / B2 / C1 / C2
    limit: int = 10    # How many new words per session

class ResultRequest(BaseModel):
    word_id: int
    result: str        # "knew_it" or "still_learning"

class ScenarioRequest(BaseModel):
    word: str
    meaning: str
    level: str = "B1"


# ─── GET /words ───────────────────────────────────────────────────

@router.get("/words")
async def get_words_by_level(
    level: str = Query(..., description="CEFR level: B1, B2, C1, or C2"),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns all vocabulary words for a given CEFR level.
    """
    level = level.upper()
    if level not in ("B1", "B2", "C1", "C2"):
        raise HTTPException(status_code=400, detail="Level must be B1, B2, C1, or C2")

    result = await db.execute(
        select(VocabularyWord)
        .where(VocabularyWord.level == level)
        .order_by(VocabularyWord.id)
    )
    words = result.scalars().all()

    return {
        "level": level,
        "count": len(words),
        "words": [
            {
                "id": w.id,
                "word": w.word,
                "phonetic": w.phonetic,
                "level": w.level,
                "meaning": w.meaning,
                "roots": w.roots,
                "example_sentence": w.example_sentence,
            }
            for w in words
        ]
    }


# ─── GET /due ─────────────────────────────────────────────────────

@router.get("/due")
async def get_due_cards(
    level: str = Query(...),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Returns cards that are due for review today (next_review <= today).
    These are cards the user has already started learning.
    """
    level = level.upper()
    user_uuid = user.id
    today = date.today()

    result = await db.execute(
        select(UserVocabProgress, VocabularyWord)
        .join(VocabularyWord, UserVocabProgress.word_id == VocabularyWord.id)
        .where(
            and_(
                UserVocabProgress.user_id == user_uuid,
                VocabularyWord.level == level,
                UserVocabProgress.next_review <= today,
            )
        )
        .order_by(UserVocabProgress.next_review.asc())
        .limit(limit)
    )
    rows = result.all()

    return {
        "level": level,
        "due_count": len(rows),
        "cards": [
            {
                "word_id": word.id,
                "word": word.word,
                "phonetic": word.phonetic,
                "meaning": word.meaning,
                "roots": word.roots,
                "example_sentence": word.example_sentence,
                "bucket": progress.bucket.value,
                "correct_streak": progress.correct_streak,
                "total_attempts": progress.total_attempts,
            }
            for progress, word in rows
        ]
    }


# ─── POST /start-session ─────────────────────────────────────────

@router.post("/start-session")
async def start_session(
    request: StartSessionRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Fetches ONLY completely new words for the requested level that the user hasn't seen yet.
    """
    level = request.level.upper()
    user_uuid = user.id
    today = date.today()

    # 1. Get all word IDs this user already has progress for at this level
    existing_result = await db.execute(
        select(UserVocabProgress.word_id)
        .join(VocabularyWord, UserVocabProgress.word_id == VocabularyWord.id)
        .where(
            and_(
                UserVocabProgress.user_id == user_uuid,
                VocabularyWord.level == level,
            )
        )
    )
    existing_word_ids = set(existing_result.scalars().all())

    # 2. Grab new words the user hasn't seen
    new_words_result = await db.execute(
        select(VocabularyWord)
        .where(
            and_(
                VocabularyWord.level == level,
                VocabularyWord.id.notin_(existing_word_ids) if existing_word_ids else True,
            )
        )
        .order_by(VocabularyWord.id)
        .limit(request.limit)
    )
    new_words = new_words_result.scalars().all()

    cards = []
    for word in new_words:
        cards.append({
            "word_id": word.id,
            "word": word.word,
            "phonetic": word.phonetic,
            "meaning": word.meaning,
            "roots": word.roots,
            "example_sentence": word.example_sentence,
            "bucket": "learning",
            "correct_streak": 0,
            "total_attempts": 0,
            "is_new": True,
        })

    return {
        "level": level,
        "session_size": len(cards),
        "due_count": 0,
        "new_count": len(cards),
        "cards": cards,
    }

# ─── GET /revision ───────────────────────────────────────────────

@router.get("/revision")
async def get_revision_session(
    level: str = Query(..., description="CEFR level to revise"),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Fetches cards due for revision for a specific level (next_review <= today).
    """
    level = level.upper()
    user_uuid = user.id
    today = date.today()

    result = await db.execute(
        select(UserVocabProgress, VocabularyWord)
        .join(VocabularyWord, UserVocabProgress.word_id == VocabularyWord.id)
        .where(
            and_(
                UserVocabProgress.user_id == user_uuid,
                VocabularyWord.level == level,
                UserVocabProgress.next_review <= today,
            )
        )
        .order_by(UserVocabProgress.next_review.asc())
        .limit(limit)
    )
    rows = result.all()

    cards = []
    for progress, word in rows:
        cards.append({
            "word_id": word.id,
            "word": word.word,
            "phonetic": word.phonetic,
            "meaning": word.meaning,
            "roots": word.roots,
            "example_sentence": word.example_sentence,
            "bucket": progress.bucket.value,
            "correct_streak": progress.correct_streak,
            "total_attempts": progress.total_attempts,
            "is_new": False,
        })

    return {
        "level": level,
        "session_size": len(cards),
        "due_count": len(cards),
        "new_count": 0,
        "cards": cards,
    }


# ─── POST /result ─────────────────────────────────────────────────

@router.post("/result")
async def save_result(
    request: ResultRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Saves the user's flashcard result and updates the spaced repetition state.

    result = "knew_it"       → promote to next bucket, schedule future review
    result = "still_learning" → reset to learning bucket, review tomorrow
    """
    user_uuid = user.id

    if request.result not in ("knew_it", "still_learning"):
        raise HTTPException(status_code=400, detail="Result must be 'knew_it' or 'still_learning'")

    # Find the user's progress for this word
    result = await db.execute(
        select(UserVocabProgress)
        .where(
            and_(
                UserVocabProgress.user_id == user_uuid,
                UserVocabProgress.word_id == request.word_id,
            )
        )
    )
    progress = result.scalar_one_or_none()

    if not progress:
        # User is answering this new word for the very first time
        progress = UserVocabProgress(
            user_id=user_uuid,
            word_id=request.word_id,
            bucket=VocabBucket.LEARNING,
            correct_streak=0,
            next_review=date.today(),
            total_attempts=0,
            last_seen=datetime.utcnow()
        )
        db.add(progress)
    else:
        # Update based on result
        progress.total_attempts += 1
        progress.last_seen = datetime.utcnow()

    if request.result == "knew_it":
        # Promote to next bucket
        schedule = BUCKET_SCHEDULE[progress.bucket]
        progress.bucket = schedule["next_bucket"]
        progress.correct_streak += 1
        progress.next_review = date.today() + timedelta(days=schedule["days"])
    else:
        # Reset to learning
        progress.bucket = VocabBucket.LEARNING
        progress.correct_streak = 0
        progress.next_review = date.today() # Stays available for immediate revision

    await db.commit()
    await db.refresh(progress)

    return {
        "word_id": request.word_id,
        "new_bucket": progress.bucket.value,
        "correct_streak": progress.correct_streak,
        "next_review": progress.next_review.isoformat(),
        "total_attempts": progress.total_attempts,
    }


# ─── GET /buckets ─────────────────────────────────────────────────

@router.get("/buckets")
async def get_bucket_counts(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Returns the count of words in each bucket for the user's progress dashboard.
    Also returns the total words available and percentage mastered.
    """
    user_uuid = user.id

    # Bucket counts
    result = await db.execute(
        select(
            UserVocabProgress.bucket,
            func.count(UserVocabProgress.id).label("count")
        )
        .where(UserVocabProgress.user_id == user_uuid)
        .group_by(UserVocabProgress.bucket)
    )
    rows = result.all()

    buckets = {
        "learning": 0,
        "reviewing": 0,
        "strong": 0,
        "mastered": 0,
    }
    total_started = 0
    for bucket, count in rows:
        buckets[bucket.value] = count
        total_started += count

    # Total words in the bank
    total_result = await db.execute(select(func.count(VocabularyWord.id)))
    total_words = total_result.scalar()

    # Per-level breakdown
    level_result = await db.execute(
        select(
            VocabularyWord.level,
            func.count(VocabularyWord.id).label("total"),
            func.count(
                case(
                    (
                        and_(
                            UserVocabProgress.user_id == user_uuid,
                            UserVocabProgress.bucket == VocabBucket.MASTERED,
                        ),
                        UserVocabProgress.id
                    ),
                    else_=None
                )
            ).label("mastered")
        )
        .outerjoin(
            UserVocabProgress,
            and_(
                VocabularyWord.id == UserVocabProgress.word_id,
                UserVocabProgress.user_id == user_uuid,
            )
        )
        .group_by(VocabularyWord.level)
    )
    level_rows = level_result.all()

    levels = {}
    for level, total, mastered in level_rows:
        levels[level] = {
            "total": total,
            "mastered": mastered,
            "percentage": round((mastered / total) * 100, 1) if total > 0 else 0
        }

    return {
        "buckets": buckets,
        "total_started": total_started,
        "total_words": total_words,
        "mastered_percentage": round((buckets["mastered"] / total_started) * 100, 1) if total_started > 0 else 0,
        "levels": levels,
    }


# ─── GET /level-stats ─────────────────────────────────────────

@router.get("/level-stats")
async def get_level_stats(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Returns new_count and due_count for each CEFR level.
    """
    user_uuid = user.id
    today = date.today()

    levels_stats = {}
    for level in ["B1", "B2", "C1", "C2"]:
        levels_stats[level] = {"new": 0, "due": 0, "total": 0}

    total_result = await db.execute(select(VocabularyWord.level, func.count(VocabularyWord.id)).group_by(VocabularyWord.level))
    for level, count in total_result.all():
        if level in levels_stats:
            levels_stats[level]["total"] = count
            levels_stats[level]["new"] = count

    progress_result = await db.execute(
        select(
            VocabularyWord.level,
            func.count(UserVocabProgress.id).label("started"),
            func.sum(case((UserVocabProgress.next_review <= today, 1), else_=0)).label("due")
        )
        .join(VocabularyWord, UserVocabProgress.word_id == VocabularyWord.id)
        .where(UserVocabProgress.user_id == user_uuid)
        .group_by(VocabularyWord.level)
    )
    for level, started, due in progress_result.all():
        if level in levels_stats:
            levels_stats[level]["due"] = int(due) if due is not None else 0
            levels_stats[level]["new"] = levels_stats[level]["total"] - started

    return levels_stats

# ─── POST /scenario ───────────────────────────────────────────────

@router.post("/scenario")
async def generate_scenario(request: ScenarioRequest):
    """
    Calls Groq to generate a fresh, contextual scenario sentence using the word.
    This is called on-demand when the user taps "Refresh scenario" on a card.
    """
    try:
        scenario = await generate_vocabulary_scenario(
            word=request.word,
            meaning=request.meaning,
            user_level=request.level
        )
        return {"scenario": scenario}
    except Exception as e:
        return {"scenario": f"Could not generate scenario: {str(e)}"}

# ─── GET /daily-origin ───────────────────────────────────────────

@router.get("/daily-origin")
async def get_daily_origin():
    """
    Fetches the daily word origin story.
    Caches the result for 24 hours to ensure consistency for all users.
    """
    today_str = date.today().isoformat()
    cache_key = f"daily_word_origin:{today_str}"
    
    # Try to get from cache
    cached = await redis_service.get_cached_response(cache_key)
    if cached:
        try:
            return json.loads(cached)
        except:
            pass
            
    # Generate new one if not cached
    story = await get_word_origin_story()
    story_data = story.model_dump()
    
    # Cache it for 24 hours (86400 seconds)
    await redis_service.set_cached_response(cache_key, json.dumps(story_data), expire_seconds=86400)
    
    return story_data
