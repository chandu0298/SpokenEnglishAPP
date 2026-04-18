# EchoFluent - Master Guidelines

## Project Overview
EchoFluent is a mobile app built with React Native (Expo) and FastAPI that uses AI-powered roleplay and grammar feedback to help users gain confidence in real-world English conversations.

## Architecture
- **Frontend**: React Native with Expo (File-based routing)
- **Backend**: FastAPI (Python)
- **Database**: Neon PostgreSQL (asyncpg) via SQLAlchemy
- **Caching / Session**: Upstash Redis
- **Auth**: Firebase Authentication (Email/Password & Phone/OTP)
- **AI Engine**: Groq Llama 3.1 (Grammar & Chat)
- **Voice**: Groq Whisper (STT) & Groq PlayAI (TTS)
- **Payments**: Razorpay (UPI, Cards, Netbanking)

## Skill Files (Documentation)
When developing new features in Antigravity, you MUST read the relevant detailed skill files first. They contain the exact architecture plans, database schemas, UI structures, and logic flow required.

### 🐍 Backend Skills (`backend/skills/`)
1. `01-project-setup.md` - FastAPI App config & directory structure
2. `02-database.md` - Neon PostgreSQL schemas, SQLAlchemy
3. `03-auth.md` - Firebase admin logic, JWT middleware
4. `04-grammar-correction.md` - Groq Llama integration
5. `05-coaching-chatbot.md` - Coach Priya Redis session API
6. `06-lessons.md` - Topic API logic & Score tracking
7. `07-tts-stt.md` - PlayAI and Whisper integration
8. `08-payments.md` - Razorpay webhook handlers

### 📱 Frontend Skills (`frontend/skills/`)
1. `01-project-setup.md` - Expo config, Design system
2. `02-auth-screens.md` - Login, OTP flow
3. `03-home-dashboard.md` - Main dashboard UI
4. `04-grammar-screen.md` - Voice input, grammar diff cards
5. `05-coach-chat.md` - Chat UI with inline TTS and feedback
6. `06-lessons-screens.md` - Topics and roleplay UI
7. `07-payment-screen.md` - Plan selection, checkout
8. `08-shared-components.md` - Reusable UI elements

## Design System (Stitch Prototype)
- **Background**: `#F5F7FA`
- **Primary**: `#2B59FF` (blue)
- **Text Primary**: `#1A1C1E`
- **Text Secondary**: `#6B7280`
- **Font**: Inter
- Cards should have a white background, rounded edges, and a subtle shadow.

## Common Commands
* Backend Dev: `cd backend && uvicorn main:app --reload`
* Mobile Dev: `cd frontend && npx expo start`
