# Backend Skill 02: Database & Models

## Architecture
- **Provider**: Neon (Serverless PostgreSQL)
- **ORM**: SQLAlchemy 2.0 (Async enabled)
- **Driver**: `asyncpg`
- **Migrations**: Alembic

## Core Models

### `users`
Stores user profile after Firebase auth.
- `id`: UUID (Primary Key)
- `firebase_uid`: String (Unique)
- `email`: String (Nullable)
- `phone`: String (Nullable)
- `name`: String
- `cefr_level`: Enum (A1, A2, B1, B2, C1, C2)
- `plan_type`: Enum (FREE, PRO)
- `created_at`: DateTime
- `updated_at`: DateTime

### `lessons`
Stores the metadata for the 20 predefined topics.
- `id`: Int (Primary Key)
- `topic_title`: String
- `category`: Enum (SOCIAL, BUSINESS, TRAVEL, DAILY, FINANCE, PHONE)
- `difficulty`: Enum (Beginner, Intermediate, Advanced)
- `description`: String

### `user_progress`
Tracks user completion and scores.
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> users)
- `lesson_id`: Int (Foreign Key -> lessons)
- `score`: Int
- `is_completed`: Boolean
- `completed_at`: DateTime

## ORM Guidelines
1. All models should inherit from a declarative base (`Base = declarative_base()`)
2. Use `mapped_column` syntax from SQLAlchemy 2.0
3. Time fields should default to `func.now()`

## Database Connection
In `backend/db/database.py`, use async engine:
```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

engine = create_async_engine(settings.DATABASE_URL, echo=True)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)
```
Provide a `get_db` generator to inject DB sessions into routers.
