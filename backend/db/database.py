from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from config import settings
import ssl

Base = declarative_base()

# Create SSL context for Neon PostgreSQL
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# Async Engine (Neon PostgreSQL)
engine = create_async_engine(
    settings.database_url.replace("?ssl=true", ""),
    connect_args={"ssl": ssl_context},
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
