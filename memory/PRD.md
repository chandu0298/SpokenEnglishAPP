# EchoFluent - Product Requirements Document

## Overview
EchoFluent is an AI-powered English coaching application that helps users improve their spoken English through real-time conversations, grammar correction, pronunciation analysis, and vocabulary building.

## Original Problem Statement
Clone and set up the SpokenEnglishAPP (EchoFluent) from GitHub repository to be runnable.

## Architecture
- **Frontend**: React.js web application (converted from React Native Expo)
- **Backend**: FastAPI Python application
- **Database**: Neon PostgreSQL (async)
- **Cache**: In-memory fallback (Upstash Redis optional)
- **AI Engine**: Groq Llama 3.1 for chat and grammar
- **Auth**: Firebase Authentication (configured)
- **Payments**: Razorpay (optional)

## Tech Stack
- Frontend: React 18, Lucide Icons, CSS3 with custom properties
- Backend: FastAPI, SQLAlchemy (async), Pydantic
- Database: PostgreSQL via Neon
- AI: Groq API (llama-3.1-8b-instant model)

## User Personas
1. **English Learners**: B1-C1 level professionals looking to improve conversational English
2. **Job Seekers**: Users practicing interview scenarios
3. **Students**: Learners building vocabulary and grammar skills

## Core Requirements (Static)
1. AI-powered chat with Coach Priya
2. Grammar correction with detailed feedback
3. Vocabulary building with word origins
4. Pronunciation guidance
5. User progress tracking

## What's Been Implemented
**Date: April 19, 2026**
- ✅ Cloned repository from GitHub
- ✅ Set up PostgreSQL database with Neon
- ✅ Configured Groq API for AI chat
- ✅ Created React web frontend (from React Native Expo)
- ✅ Implemented Coach Priya chat demo
- ✅ Daily word origin feature
- ✅ Landing page with features showcase
- ✅ Waitlist signup form

## API Endpoints
- `GET /` - Health check
- `POST /api/chat/demo` - Public chat demo
- `POST /api/chat/message` - Authenticated chat (requires Firebase token)
- `POST /api/grammar/correct` - Grammar correction
- `GET /api/vocab/daily-origin` - Daily word origin story
- `GET /api/vocab/words` - Vocabulary words
- `POST /api/pronunciation/guide` - Pronunciation guide
- `POST /api/stt/transcribe` - Speech to text
- `GET /api/voice/tts` - Text to speech

## Prioritized Backlog

### P0 (Critical)
- None currently

### P1 (High Priority)
- User authentication flow (Firebase)
- User profile management
- Progress tracking dashboard

### P2 (Medium Priority)
- Payment integration (Razorpay)
- Premium features unlock
- Voice recording for pronunciation

## Next Tasks
1. Implement user authentication with Firebase
2. Add user dashboard with learning progress
3. Enable voice recording for speech-to-text
4. Implement vocabulary flashcard system
5. Add lesson progression system
