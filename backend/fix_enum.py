import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import sys

# User's current DB URL from .env
DB_URL = "postgresql+asyncpg://neondb_owner:npg_0dGSLcFVv1ei@ep-summer-tooth-anqxvwph.c-6.us-east-1.aws.neon.tech/neondb"

async def fix_enum():
    print(f"Adding 'INITIAL' to cefrlevel enum...")
    try:
        engine = create_async_engine(DB_URL)
        async with engine.begin() as conn:
            # We use a standard connection to run ALTER TYPE because it cannot be run in a transaction block usually, 
            # but SQLAlchemy 'engine.begin()' handles it or we can use 'engine.connect()'.
            # Note: Postgres ALTER TYPE ADD VALUE cannot run in a transaction block in some versions, 
            # but Neon/Postgres 12+ supports it.
            await conn.execute(text("ALTER TYPE cefrlevel ADD VALUE IF NOT EXISTS 'INITIAL' BEFORE 'A1'"))
            print("Successfully added 'INITIAL' to cefrlevel")
    except Exception as e:
        print(f"Fix Failed: {e}")
        # If it says it's already there or cannot run in transaction, we'll know
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(fix_enum())
