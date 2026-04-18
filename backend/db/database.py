from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from config import settings

Base = declarative_base()

# Async Engine (Neon PostgreSQL)
engine = create_async_engine(
    settings.database_url,
    connect_args={"ssl": True},
    echo=False,  # Set to True for debugging queries
    future=True
)

# Async Session Maker
AsyncSessionLocal = async_sessionmaker(
    engine, 
    expire_on_commit=False, 
    autoflush=False
)

async def get_db():
    """Dependency injection generator for database sessions."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
