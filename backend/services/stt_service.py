import os
from groq import Groq
from config import settings
from fastapi import UploadFile
import tempfile

class STTService:
    def __init__(self):
        self.client = Groq(api_key=settings.groq_api_key)

    async def transcribe_audio(self, audio_file: UploadFile) -> str:
        """
        Transcribes audio using Groq's Whisper-large-v3 model.
        """
        try:
            # Create a temporary file to store the uploaded audio
            with tempfile.NamedTemporaryFile(delete=False, suffix=".m4a") as tmp:
                content = await audio_file.read()
                tmp.write(content)
                tmp_path = tmp.name

            # Open and transcribe
            with open(tmp_path, "rb") as file:
                transcription = self.client.audio.transcriptions.create(
                    file=(tmp_path, file.read()),
                    model="whisper-large-v3",
                    response_format="text",
                    language="en"
                )

            # Cleanup
            os.unlink(tmp_path)
            
            return str(transcription).strip()
        except Exception as e:
            print(f"STT Error: {e}")
            return ""

stt_service = STTService()
