# Frontend Skill 05: Coach Priya Chat UI

## Architecture
The Chat UI (`app/(tabs)/coach.tsx`) provides a natural conversational interface with the AI.

## Chat Bubbles
- **User Message**: Gray background `#F3F4F6`, dark text. Right-aligned.
- **Coach Message**: Light Blue background `#E5EBFF`, primary blue text or dark text. Left-aligned.
- **Auto TTS**: A toggle at the top of the chat controls whether Coach Priya's messages are automatically played via TTS as they arrive.

## Inline Grammar Tips
When the backend API detects a grammar mistake in the user's message, it returns `grammar_tips` alongside the `coach_reply`.
- The tip should render as a separate, smaller UI block *immediately below* the user's gray message bubble, before the Coach's reply.
- **Style**: Light green tint with a small sparkles or Checkmark icon. Shows "Tip: " + the correction.

## Input Mechanism
- Standard text input field.
- A microphone icon on the right side of the input field. Holding it invokes `expo-av` recording + Whisper STT (similar to the Grammar screen).
