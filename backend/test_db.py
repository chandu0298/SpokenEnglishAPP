import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import sys

# User's current DB URL from .env
DB_URL = "postgresql+asyncpg://neondb_owner:npg_0dGSLcFVv1ei@ep-summer-tooth-anqxvwph.c-6.us-east-1.aws.neon.tech/neondb"

async def test_connection():
    print(f"Testing connection to: {DB_URL}")
    try:
        engine = create_async_engine(DB_URL)
        async with engine.begin() as conn:
            # Check for SELECT 1
            await conn.execute(text("SELECT 1"))
            print("Successfully executed 'SELECT 1'")
            
            # Check for Enum values
        # Check users table structure
        async with engine.connect() as conn:
            result = await conn.execute(text("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'users'
            """))
            cols = result.fetchall()
            print("\nUsers table columns:")
            for col in cols:
                print(f"- {col[0]} ({col[1]})")

        print("\nEnum cefrlevel values:", await get_enum_values(engine, "cefrlevel"))
        print("Enum plantype values:", await get_enum_values(engine, "plantype"))
        print("\nDatabase Schema Check: Complete")
    except Exception as e:
        print(f"Database Connection Failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(test_connection())
