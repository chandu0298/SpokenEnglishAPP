"""
Seed vocabulary words to database.
Can seed from existing data or generate new words.

Usage:
  python -m db.seed_vocabulary_full
"""

import asyncio
import os
import sys
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import select, func
from db.database import engine, AsyncSessionLocal
from models.vocabulary import VocabularyWord

# Import existing seed data
from db.vocabulary_seed import VOCABULARY_WORDS as EXISTING_WORDS


async def get_current_word_count():
    """Get current word counts per level."""
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(VocabularyWord.level, func.count(VocabularyWord.id))
            .group_by(VocabularyWord.level)
        )
        counts = {row[0]: row[1] for row in result.all()}
        return counts


async def seed_vocabulary(words_data: list, skip_existing: bool = True):
    """Seed vocabulary words to database."""
    async with AsyncSessionLocal() as db:
        added = 0
        skipped = 0
        
        for word_data in words_data:
            # Check if word already exists at this level
            if skip_existing:
                existing = await db.execute(
                    select(VocabularyWord)
                    .where(
                        VocabularyWord.word == word_data['word'],
                        VocabularyWord.level == word_data['level']
                    )
                )
                if existing.scalar_one_or_none():
                    skipped += 1
                    continue
            
            word = VocabularyWord(
                word=word_data['word'],
                phonetic=word_data.get('phonetic', ''),
                level=word_data['level'],
                meaning=word_data['meaning'],
                roots=word_data.get('roots', []),
                example_sentence=word_data.get('example_sentence', '')
            )
            db.add(word)
            added += 1
            
            # Commit in batches
            if added % 50 == 0:
                await db.commit()
                print(f"  Committed {added} words...")
        
        await db.commit()
        print(f"  Total: Added {added}, Skipped {skipped} existing")
        return added


async def seed_from_json(json_path: str):
    """Seed from a JSON file."""
    if not os.path.exists(json_path):
        print(f"Error: File not found: {json_path}")
        return
    
    with open(json_path, 'r', encoding='utf-8') as f:
        words = json.load(f)
    
    print(f"Loading {len(words)} words from {json_path}")
    await seed_vocabulary(words)


async def seed_existing():
    """Seed the existing 200 words (50 per level)."""
    print("Seeding existing vocabulary (200 words)...")
    await seed_vocabulary(EXISTING_WORDS)


async def main():
    """Main seeding function."""
    print("\n" + "="*60)
    print("VOCABULARY SEEDING")
    print("="*60)
    
    # Check current counts
    print("\nCurrent word counts:")
    counts = await get_current_word_count()
    total = 0
    for level in ["B1", "B2", "C1", "C2"]:
        count = counts.get(level, 0)
        print(f"  {level}: {count} words")
        total += count
    print(f"  Total: {total} words")
    
    # Check for full vocabulary file
    full_vocab_path = os.path.join(os.path.dirname(__file__), 'vocabulary_words_full.json')
    
    if os.path.exists(full_vocab_path):
        print(f"\nFound full vocabulary file: {full_vocab_path}")
        await seed_from_json(full_vocab_path)
    else:
        print("\nNo full vocabulary file found. Seeding existing words only.")
        await seed_existing()
    
    # Final counts
    print("\nFinal word counts:")
    counts = await get_current_word_count()
    total = 0
    for level in ["B1", "B2", "C1", "C2"]:
        count = counts.get(level, 0)
        print(f"  {level}: {count} words")
        total += count
    print(f"  Total: {total} words")


if __name__ == "__main__":
    asyncio.run(main())
