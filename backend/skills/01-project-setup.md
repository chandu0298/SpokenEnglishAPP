# Backend Skill 01: Project Setup

## Architecture Overview
The backend is a FastAPI application designed to provide APIs for EchoFluent. It interacts with an Expo frontend, uses Neon PostgreSQL for persistence, Upstash Redis for caching, Firebase for Auth, and Groq for AI features.

## Tech Stack
- **Framework**: FastAPI (Python 3.10+)
- **Server**: Uvicorn
- **Dependency injected modules**: Controllers, Services, Storage

## Directory Structure
```
backend/
├── main.py              # Application entrypoint
├── config.py            # Pydantic BaseSettings for env vars
├── routers/             # API Controllers (FastAPI APIRouters)
├── services/            # Business Logic & External API calls
├── models/              # Relational models (SQLAlchemy) & Pydantic schemas
├── db/                  # Database session, config, migrations
├── middleware/          # Auth, CORS, Custom logging
└── skills/              # These instruction files
```

## Running the Project
1. Copy `.env.example` to `.env` and fill in secrets
2. Run `pip install -r requirements.txt`
3. Start the dev server: `uvicorn main:app --reload`
4. Access API Docs at: `http://localhost:8000/docs`

## Best Practices
1. **Dependency Injection**: Use FastAPI `Depends()` to inject services into routers.
2. **Environment Variables**: Load all through `config.py` using `pydantic-settings`.
3. **Async Everywhere**: Use async versions of all DB functions (`asyncpg`), Redis clients, and HTTP clients (`httpx`).
4. **CORS**: Configure CORS in `main.py` explicitly specifying frontend origins (Expo URL, production domain).
