# Backend Skill 07: TTS & STT Integration

## Architecture
For Voice IO, we rely entirely on Groq's extremely fast inference APIs.

## Speech-to-Text (STT)
Powered by Groq Whisper (`whisper-large-v3`).
- **Endpoint**: `POST /api/voice/transcribe`
- **Pipeline**:
  1. Client records audio (mp4/m4a/wav) and sends as `multipart/form-data`.
  2. FastAPI receives `UploadFile`.
  3. Send file directly to Groq's audio translations/transcriptions API using the `groq` python client `audio.transcriptions.create`.
  4. Return transcribed text string to the frontend.

## Text-to-Speech (TTS)
Powered by Groq PlayAI (or alternative realistic TTS if specified).
- **Endpoint**: `POST /api/voice/speak`
- **Pipeline**:
  1. Client sends JSON payload with text.
  2. Request TTS from provider.
  3. Stream raw audio bytes back to the client as an `audio/mpeg` or `audio/wav` response payload using `StreamingResponse`.

## Performance Notes
Because this is meant to be a fluid conversation, we do NOT want to save these temporary audio files to cloud storage (S3). Buffer them in memory and stream them directly back to the client to minimize latency.
