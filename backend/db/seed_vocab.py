import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db.database import AsyncSessionLocal
from db.vocabulary_seed import VOCABULARY_WORDS
from models.vocabulary import VocabularyWord

async def seed():
    async with AsyncSessionLocal() as session:
        for w in VOCABULARY_WORDS:
            word = VocabularyWord(**w)
            session.add(word)
        await session.commit()
        print(f"✅ Seeded {len(VOCABULARY_WORDS)} words")

if __name__ == "__main__":
    asyncio.run(seed())
