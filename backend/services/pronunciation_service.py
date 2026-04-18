from typing import List, Dict, Any, Optional
import json
from services.groq_service import client

class PronunciationService:
    @staticmethod
    async def analyze_word(word: str) -> Dict[str, Any]:
        """
        Analyzes a word's pronunciation using vLLM (Groq).
        Returns a simplified comparison between American and British accents with coach tips.
        """
        prompt = f"""
        You are an expert pronunciation coach. Analyze the English word: "{word}"
        Provide a comparison between General American and British (RP) pronunciations.
        
        Requirements:
        1. "word": The original word.
        2. "american": A simple, easy-to-read phonetic spelling for US (e.g., "WAH-der"). 
        3. "british": A simple, easy-to-read phonetic spelling for UK (e.g., "WOR-tuh").
        4. "difference": A one-sentence explanation of the phonetic gap.
        5. "pitfalls": A list of 2 short "Coaching Tips" for non-native speakers (e.g., "Keep your tongue low").
        
        CRITICAL: 
        - DO NOT return the original word in phonetic fields. 
        - ALWAYS return a simplified "sounds-like" breakdown.
        
        Example for "water":
        {{
            "word": "water",
            "american": "WAH-der",
            "british": "WOR-tuh",
            "difference": "US uses a 'flap T' (D sound), while UK uses a crisp 'T' or glottal stop.",
            "pitfalls": ["Avoid the 'R' at the end for UK accent", "Keep the 'D' sound light in US"]
        }}
        
        Return ONLY the JSON.
        """
        
        try:
            response = await client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": "You are a helpful linguistic expert and pronunciation coach. You excel at creating simple phonetic guides for non-native speakers."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            print(f"Error analyzing word '{word}': {e}")
            return {
                "word": word,
                "american": word.upper(),
                "british": word.upper(),
                "difference": "Comparison currently unavailable.",
                "pitfalls": ["Check your syllable stress", "Clear vowel sounds are key"]
            }

pronunciation_service = PronunciationService()
