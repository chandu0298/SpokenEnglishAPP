from config import settings
from typing import Optional
import os
import httpx
from urllib.parse import quote

class TTSService:
    def __init__(self):
        # Set environment variable for Google Cloud Library if path is provided in settings
        creds_path = settings.google_creds_path
        if creds_path:
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = creds_path

    async def generate_speech_google(self, text: str, gender: str = "FEMALE", speed: float = 1.0, accent: str = "US") -> Optional[bytes]:
        """
        Generates speech using Google Cloud TTS (Neural2 voices).
        Returns the raw MP3 bytes.
        """
        creds_path = settings.google_creds_path
        if not creds_path:
            print("Google Cloud TTS credentials not configured. Skipping Google TTS.")
            return None

        try:
            from google.cloud import texttospeech
            
            client = texttospeech.TextToSpeechClient()
            input_text = texttospeech.SynthesisInput(text=text)
            
            # Map our internal accent terms to Google language codes
            lang_code = "en-GB" if accent == "GB" else "en-US"
            # Selected premium Neural2 voices
            voice_name = f"{lang_code}-Neural2-F" if gender == "FEMALE" else f"{lang_code}-Neural2-D"
            
            voice = texttospeech.VoiceSelectionParams(
                language_code=lang_code,
                name=voice_name,
                ssml_gender=texttospeech.SsmlVoiceGender.FEMALE if gender == "FEMALE" else texttospeech.SsmlVoiceGender.MALE,
            )
            
            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3,
                pitch=0,
                speaking_rate=speed
            )
            
            response = client.synthesize_speech(
                input=input_text, voice=voice, audio_config=audio_config
            )
            return response.audio_content
        except Exception as e:
            print(f"Google TTS error: {e}")
            return None

    async def generate_speech_fallback(self, text: str, speed: float = 1.0, accent: str = "US") -> Optional[bytes]:
        """
        Free fallback using Google Translate's unofficial TTS API.
        Note: Unofficial API has limited speed support; speed < 0.75 will trigger 'slow' mode.
        """
        try:
            # Map accent to fallback language code
            lang_code = "en-gb" if accent == "GB" else "en-us"
            is_slow = "1" if speed < 0.75 else "0"
            url = f"https://translate.google.com/translate_tts?ie=UTF-8&q={quote(text)}&tl={lang_code}&client=tw-ob&ttsspeed={speed}&total=1&idx=0&textlen={len(text)}&slow={is_slow}"
            
            async with httpx.AsyncClient() as client:
                response = await client.get(url, timeout=10.0)
                if response.status_code == 200:
                    return response.content
                else:
                    print(f"Fallback TTS failed with status {response.status_code}")
                    return None
        except Exception as e:
            print(f"Fallback TTS error: {e}")
            return None


tts_service = TTSService()
