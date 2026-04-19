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
    Fetches new words for the requested level that the user hasn't seen yet.
    
    Batch Progression Logic (10 batches of 50 words = 500 words per level):
    - Users learn words in batches of 50
    - Batch only advances when:
      1. All 50 words in current batch have been seen
      2. AND all spaced revision words are completed (due_count = 0)
    - Words never repeat - once seen, they stay in the user's progress
    """
    level = request.level.upper()
    user_uuid = user.id
    today = date.today()
    
    # Constants
    WORDS_PER_BATCH = 50
    TOTAL_BATCHES = 10  # Fixed: 10 batches per level (500 words total)
    TARGET_WORDS_PER_LEVEL = WORDS_PER_BATCH * TOTAL_BATCHES  # 500

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

    # 2. Check if there are any words due for revision (spaced revision pending)
    due_count_result = await db.execute(
        select(func.count(UserVocabProgress.id))
        .join(VocabularyWord, UserVocabProgress.word_id == VocabularyWord.id)
        .where(
            and_(
                UserVocabProgress.user_id == user_uuid,
                VocabularyWord.level == level,
                UserVocabProgress.next_review <= today,
            )
        )
    )
    due_count = due_count_result.scalar() or 0

    # 3. Calculate current batch info
    words_seen = len(existing_word_ids)
    completed_batches = words_seen // WORDS_PER_BATCH  # Fully completed batches
    words_in_current_batch = words_seen % WORDS_PER_BATCH
    
    # Current batch number (1-indexed)
    # If words_in_current_batch > 0, user is in the middle of a batch
    # If words_in_current_batch == 0 and words_seen > 0, user completed a batch
    if words_in_current_batch > 0:
        current_batch = completed_batches + 1
    elif words_seen > 0:
        # Batch complete - check if can advance
        if due_count == 0:
            # Can advance to next batch
            current_batch = min(completed_batches + 1, TOTAL_BATCHES)
        else:
            # Stuck on current batch until revision complete
            current_batch = completed_batches
    else:
        # Fresh start
        current_batch = 1

    # 4. Determine if user can get new words
    # Block new words if:
    # - Current batch is complete (50 words seen) BUT has pending revision
    batch_complete = words_in_current_batch == 0 and words_seen > 0
    next_batch_locked = batch_complete and due_count > 0
    
    words_to_fetch = 0
    if not next_batch_locked:
        if words_in_current_batch > 0:
            # Continue current batch - fetch remaining words up to 50
            remaining_in_batch = WORDS_PER_BATCH - words_in_current_batch
            words_to_fetch = min(request.limit, remaining_in_batch)
        else:
            # Fresh start or batch complete with no due words - fetch new batch
            words_to_fetch = min(request.limit, WORDS_PER_BATCH)

    # 5. Grab new words the user hasn't seen
    new_words = []
    if words_to_fetch > 0:
        new_words_result = await db.execute(
            select(VocabularyWord)
            .where(
                and_(
                    VocabularyWord.level == level,
                    VocabularyWord.id.notin_(existing_word_ids) if existing_word_ids else True,
                )
            )
            .order_by(VocabularyWord.id)
            .limit(words_to_fetch)
        )
        new_words = new_words_result.scalars().all()

    # 6. Get actual words available in DB for this level
    total_words_result = await db.execute(
        select(func.count(VocabularyWord.id))
        .where(VocabularyWord.level == level)
    )
    total_words_in_db = total_words_result.scalar() or 0

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
            "level": word.level,
        })

    # Calculate if level is fully complete (all 500 words done and no pending revision)
    level_complete = words_seen >= TARGET_WORDS_PER_LEVEL and due_count == 0
    
    # Also check if we've run out of words in DB (need more words generated)
    words_exhausted = len(new_words) == 0 and words_to_fetch > 0

    return {
        "level": level,
        "session_size": len(cards),
        "due_count": due_count,
        "new_count": len(cards),
        "cards": cards,
        "batch_info": {
            "current_batch": current_batch,
            "total_batches": TOTAL_BATCHES,  # Always 10
            "words_seen_total": words_seen,
            "words_in_current_batch": words_in_current_batch,
            "words_per_batch": WORDS_PER_BATCH,
            "target_words_per_level": TARGET_WORDS_PER_LEVEL,
            "actual_words_in_db": total_words_in_db,
            "level_complete": level_complete,
            "next_batch_locked": next_batch_locked,
            "words_exhausted": words_exhausted,
            "revision_pending": due_count,
        },
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
    Returns new_count, due_count, and batch progress for each CEFR level.
    Always shows X/10 batches (500 words target per level).
    """
    user_uuid = user.id
    today = date.today()
    
    # Constants - Fixed for all levels
    WORDS_PER_BATCH = 50
    TOTAL_BATCHES = 10  # Always 10 batches per level
    TARGET_WORDS_PER_LEVEL = 500

    levels_stats = {}
    for level in ["B1", "B2", "C1", "C2"]:
        levels_stats[level] = {
            "new": 0, 
            "due": 0, 
            "total": 0,  # Actual words in DB
            "seen": 0,
            "current_batch": 1, 
            "total_batches": TOTAL_BATCHES,  # Always 10
            "target_words": TARGET_WORDS_PER_LEVEL,
            "next_batch_locked": False
        }

    # Get actual total words per level in DB
    total_result = await db.execute(
        select(VocabularyWord.level, func.count(VocabularyWord.id))
        .group_by(VocabularyWord.level)
    )
    for level, count in total_result.all():
        if level in levels_stats:
            levels_stats[level]["total"] = count

    # Get user progress per level
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
            seen = started or 0
            due_count = int(due) if due is not None else 0
            levels_stats[level]["seen"] = seen
            levels_stats[level]["due"] = due_count
            
            # Calculate current batch (1-indexed)
            completed_batches = seen // WORDS_PER_BATCH
            words_in_current_batch = seen % WORDS_PER_BATCH
            
            # Determine current batch number
            if words_in_current_batch > 0:
                # In the middle of a batch
                current_batch = completed_batches + 1
            elif seen > 0:
                # Completed a full batch
                if due_count == 0:
                    # Can move to next batch
                    current_batch = min(completed_batches + 1, TOTAL_BATCHES)
                else:
                    # Locked - must complete revision first
                    current_batch = completed_batches
                    levels_stats[level]["next_batch_locked"] = True
            else:
                # No progress yet
                current_batch = 1
            
            levels_stats[level]["current_batch"] = current_batch
            
            # Calculate new words available in current batch
            if levels_stats[level]["next_batch_locked"]:
                # Batch locked - no new words until revision complete
                levels_stats[level]["new"] = 0
            else:
                # Calculate remaining words in current batch
                remaining_in_batch = WORDS_PER_BATCH - words_in_current_batch if words_in_current_batch > 0 else WORDS_PER_BATCH
                # Cap by actual words available in DB
                available_in_db = levels_stats[level]["total"] - seen
                levels_stats[level]["new"] = min(remaining_in_batch, max(0, available_in_db))

    # For levels with no progress yet, show first batch available
    for level in levels_stats:
        if levels_stats[level]["seen"] == 0:
            levels_stats[level]["new"] = min(WORDS_PER_BATCH, levels_stats[level]["total"])
            levels_stats[level]["current_batch"] = 1

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



# ─── GET /admin/status ────────────────────────────────────────────

@router.get("/admin/status")
async def get_vocabulary_status(db: AsyncSession = Depends(get_db)):
    """
    Admin endpoint to check vocabulary word counts per level.
    """
    result = await db.execute(
        select(VocabularyWord.level, func.count(VocabularyWord.id))
        .group_by(VocabularyWord.level)
        .order_by(VocabularyWord.level)
    )
    
    counts = {}
    total = 0
    for level, count in result.all():
        counts[level] = {
            "count": count,
            "batches": (count + 49) // 50,
            "target": 500,
            "progress_percent": round((count / 500) * 100, 1)
        }
        total += count
    
    return {
        "levels": counts,
        "total_words": total,
        "target_total": 2000,
        "overall_progress_percent": round((total / 2000) * 100, 1)
    }


# ─── POST /admin/generate-words ───────────────────────────────────

class GenerateWordsRequest(BaseModel):
    level: str
    count: int = 50
    category: str = "general"

@router.post("/admin/generate-words")
async def generate_vocabulary_words(
    request: GenerateWordsRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Admin endpoint to generate and add new vocabulary words using Groq AI.
    Generates words in batches to avoid timeouts.
    """
    from services.groq_service import client
    
    level = request.level.upper()
    if level not in ("B1", "B2", "C1", "C2"):
        raise HTTPException(status_code=400, detail="Level must be B1, B2, C1, or C2")
    
    # Get existing words to avoid duplicates
    existing_result = await db.execute(
        select(VocabularyWord.word)
        .where(VocabularyWord.level == level)
    )
    existing_words = set(w.lower() for w in existing_result.scalars().all())
    
    level_descriptions = {
        "B1": "Intermediate level - common vocabulary for everyday situations, work, and travel",
        "B2": "Upper-Intermediate level - more nuanced vocabulary for complex discussions",
        "C1": "Advanced level - sophisticated vocabulary for academic and business topics",
        "C2": "Mastery level - rare, literary vocabulary for native-like fluency"
    }
    
    prompt = f"""Generate exactly {request.count} English vocabulary words for {level} level ({level_descriptions[level]}).
Category: {request.category}

Do NOT include these existing words: {list(existing_words)[:30]}

For each word provide:
- word: The vocabulary word
- phonetic: Pronunciation guide (e.g., "uh-KOM-plish")
- meaning: Clear definition (1-2 sentences)
- roots: Array of etymology with language origin
- example_sentence: Real-world example in Indian professional context

Return ONLY a valid JSON object with "words" array containing exactly {request.count} word objects."""

    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a vocabulary expert. Return ONLY valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.8,
            max_tokens=8000
        )
        
        content = response.choices[0].message.content
        data = json.loads(content)
        
        words_list = data.get('words', data) if isinstance(data, dict) else data
        if not isinstance(words_list, list):
            for key, val in data.items():
                if isinstance(val, list):
                    words_list = val
                    break
        
        added = 0
        duplicates = 0
        
        for word_data in words_list:
            word_lower = word_data.get('word', '').lower()
            if word_lower in existing_words:
                duplicates += 1
                continue
            
            word = VocabularyWord(
                word=word_data.get('word', ''),
                phonetic=word_data.get('phonetic', ''),
                level=level,
                meaning=word_data.get('meaning', ''),
                roots=word_data.get('roots', []),
                example_sentence=word_data.get('example_sentence', '')
            )
            db.add(word)
            existing_words.add(word_lower)
            added += 1
        
        await db.commit()
        
        return {
            "success": True,
            "level": level,
            "requested": request.count,
            "added": added,
            "duplicates_skipped": duplicates,
            "message": f"Successfully added {added} new words to {level}"
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "Failed to generate vocabulary words"
        }
