# EchoFluent - Backend Deployment Guide

This guide outlines the steps to deploy the EchoFluent backend to a production environment (e.g., VPS, AWS, Render).

## 1. Prerequisites
- **Python 3.10+**
- **PostgreSQL** (Neon.tech recommended)
- **Redis** (Upstash recommended)
- **Google Cloud Project** with Text-to-Speech API enabled.
- **Groq API Key**
- **Razorpay Account** (Live or Test mode)

## 2. Environment Configuration
1. Copy `.env.production.example` to `.env`:
   ```bash
   cp .env.production.example .env
   ```
2. Fill in all the secret keys in `.env`.
3. Place your `firebase_service_account.json` and `google_cloud_credentials.json` in the root directory.

## 3. Installation
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## 4. Database Migrations
Run the migrations to set up the production database schema:
```bash
alembic upgrade head
```

## 5. Running in Production
Use `uvicorn` with `gunicorn` for a production-grade worker setup:
```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
```

## 6. Security Checklist
- [ ] `APP_ENV` is set to `production`.
- [ ] `CORS_ORIGINS` is restricted to your production domain.
- [ ] Database URL is secured with SSL.
- [ ] Ensure all API keys are restricted/scoped in their respective portals.
