# EchoFluent - Spoken English Learning App

## Original Problem Statement
Mobile app for learning spoken English with AI coaching, vocabulary flashcards, grammar practice, and pronunciation help. User's main requirement is testing the mobile app externally using Xcode simulator and Android Studio.

## Architecture
- **Frontend**: React Native (Expo) - `/app/frontend`
- **Backend**: FastAPI - `/app/backend`
- **Database**: PostgreSQL (Neon)
- **AI**: Groq Llama 3.3 for chat, vocabulary generation
- **Auth**: Firebase Authentication
- **Cache**: Upstash Redis

## Completed Features

### Session 1 (Initial Setup)
- Cloned and configured the full-stack application
- Connected to external Neon PostgreSQL database
- Set up GitHub workflow for local mobile testing (emergent-dev branch)

### Session 2 (Current - Dec 2024)
1. **UI Improvements**
   - Reduced microphone button size (80px → 56px) for better screen fit
   - Adjusted icon size (36px → 24px) proportionally

2. **Voice Output Improvements**
   - Slowed speech rate (0.9 → 0.72) for clearer audio
   - Added pitch adjustment (1.05) for more natural female voice
   - Audio stops when clicking "Try understand differently"

3. **Vocabulary Batch Progression System** (NEW)
   - Backend: Updated `/api/vocab/start-session` with batch logic
   - Backend: Updated `/api/vocab/level-stats` with batch info
   - Backend: Added `/api/vocab/admin/status` endpoint
   - Backend: Added `/api/vocab/admin/generate-words` endpoint
   - Frontend: Shows batch progress (e.g., "Batch 2/10")
   - Frontend: Handles "next batch locked" state
   - Generated 884 vocabulary words (was 200)
     - B1: 447 words (9 batches)
     - B2: 337 words (7 batches)
     - C1: 50 words (needs generation)
     - C2: 50 words (needs generation)

## Batch Progression Logic
1. User learns words in batches of 50
2. When batch complete AND no words due for revision → next batch unlocks
3. Words never repeat - tracked in UserVocabProgress table
4. Target: 500 words per level (10 batches × 50 words)

## API Endpoints (Key)
- `POST /api/vocab/start-session` - Get new words for learning
- `GET /api/vocab/revision` - Get words due for spaced revision
- `POST /api/vocab/result` - Submit flashcard result
- `GET /api/vocab/level-stats` - Get stats with batch info
- `GET /api/vocab/admin/status` - Check word counts
- `POST /api/vocab/admin/generate-words` - Generate new vocabulary

## Pending Tasks

### P0 - Immediate
- Generate more vocabulary words for C1 and C2 levels (Groq rate limit hit)

### P1 - Next
- User testing verification for all Session 2 changes

### P2 - Future
- Premium natural voice (ElevenLabs/OpenAI TTS integration)
- Code cleanup: Remove `/app/frontend_web_backup/` and `/app/website/`

## Test Credentials
Firebase Auth - managed by user's Firebase project

## Key Files Modified This Session
- `/app/frontend/app/(tabs)/chat.tsx` - Mic button, voice settings, audio stop
- `/app/frontend/app/(tabs)/vocab.tsx` - Batch progress UI
- `/app/frontend/api/vocabulary.ts` - Updated interfaces
- `/app/backend/routers/vocabulary.py` - Batch logic, admin endpoints
- `/app/backend/db/generate_vocabulary.py` - Word generation script
