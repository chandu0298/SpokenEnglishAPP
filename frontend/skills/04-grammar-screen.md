# Frontend Skill 04: Grammar Correction Screen

## Architecture
The Grammar Screen (`app/(tabs)/grammar.tsx`) allows free-form text or voice input to instantly receive grammatical corrections powered by Llama 3.1.

## UI Layout
1. **Input Section**:
   - A large multiline `TextInput` area.
   - A floating Action Button (FAB) at the bottom right containing a Microphone icon.
   - When the user holds the mic, it pulses (Animation), records audio, and uses Groq Whisper STT to populate the text area.
2. **Submit Button**: 
   - A primary blue button "Check Grammar" at the bottom.
3. **Results Section (post-submit)**:
   - Takes over the input area once processing is done.
   - Shows two stacked cards:
     - **Card 1 (Original)**: Light red/gray tint. Shows original text.
     - **Card 2 (Refined)**: Light green tint `#ECFDF5`. Shows corrected text.
   - **Play Button**: A speaker icon on the Refined card. Clicking it calls `/api/voice/speak` and plays the natural TTS audio.
   - **Feedback List**: Scrollable list of specific errors and why they were changed.

## Voice Integration (`expo-av`)
- Use `expo-av` for recording and playback.
- Format for STT uploading: `m4a` or `wav`.
- Ensure appropriate permissions (`Audio.requestPermissionsAsync`) are requested before the first use.
