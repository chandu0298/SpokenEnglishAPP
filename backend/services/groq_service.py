from config import settings
from groq import AsyncGroq
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import json
import hashlib
from services import redis_service

client = AsyncGroq(api_key=settings.groq_api_key)

class GrammarCorrectionResponse(BaseModel):
    original: str
    corrected: str
    explanation: str
    errors: List[Dict[str, str]]

class ChatbotResponse(BaseModel):
    coach_reply: str
    grammar_tips: List[Dict[str, str]]

class PronunciationGuideResponse(BaseModel):
    phonetic_spelling: str
    rhymes_with: str
    syllable_examples: str
    usage_sentence: str

class WordOriginResponse(BaseModel):
    word: str
    origin_title: str
    short_preview: str
    full_story: str

async def get_grammar_correction(text: str, user_level: str = "B1") -> GrammarCorrectionResponse:
    """
    Given a user's text, uses Groq Llama 3.1 to provide grammar corrections.
    Caches results to reduce API hits for repeated identical queries.
    """
    cache_key = f"grammar:{user_level}:{hashlib.md5(text.strip().lower().encode()).hexdigest()}"
    cached = await redis_service.get_cached_response(cache_key)
    if cached:
        try:
            return GrammarCorrectionResponse(**json.loads(cached))
        except: pass

    system_prompt = f"""You are an expert English language coach.
Your task is to analyze the user's sentence and correct any grammatical errors. 
The user's current English proficiency level is {user_level} on the CEFR scale. Tailor your explanation to this level.

You MUST respond with ONLY a valid JSON object matching this schema:
{{
  "original": "The original text exactly as provided.",
  "corrected": "The grammatically correct version of the text.",
  "explanation": "A friendly, encouraging explanation of the corrections.",
  "errors": [
     {{"word": "wrong_word", "replacement": "correct_word", "type": "error_type"}}
  ]
}}
If there are no errors, "corrected" should be the same as "original", "errors" should be an empty array [], and "explanation" should be a short encouraging message like "Perfect sentence!".
"""

    response = await client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text}
        ],
        response_format={"type": "json_object"},
        temperature=0.3,
    )

    try:
        content = response.choices[0].message.content
        data = json.loads(content)
        # Cache for future use
        await redis_service.set_cached_response(cache_key, content)
        return GrammarCorrectionResponse(**data)
    except Exception as e:
        print(f"Error parsing Groq response: {e}")
        # Return a fallback response
        return GrammarCorrectionResponse(
            original=text,
            corrected=text,
            explanation="Could not process grammar correction at this time.",
            errors=[]
        )

async def get_coach_response(user_message: str, history: List[Dict[str, str]], user_level: str = "B1") -> ChatbotResponse:
    """
    Simulates Coach Priya answering the user's message while checking for grammar mistakes.
    Too dynamic to cache effectively with history.
    """
    
    system_prompt = f"""You are Coach Priya, a friendly but direct English language coach.
Your task is to respond naturally to the user in the ongoing conversation, adapting your vocabulary to their CEFR level: {user_level}.

CRITICAL PERSONALITY RULES:
- AVOID robotic, overly enthusiastic filler phrases like "That's a great goal!" or "Let's break it down together."
- Be direct and get straight to the point (e.g., "Sure, let me explain the difference...").
- Whenever the user asks for an explanation of a word, grammar rule, or concept, you MUST provide a brief explanation followed immediately by a practical, real-life scenario/example illustrating its use.

While you continue the conversation, you MUST also analyze their latest message for clear grammar mistakes.
DO NOT hyper-correct! ONLY provide grammar tips for actual grammatical errors. Do NOT provide stylistic suggestions or correct informal language if it is acceptable in spoken English. If the meaning is clear and grammatically acceptable, "grammar_tips" MUST be an empty array [].

You MUST respond with ONLY a valid JSON object matching this schema:
{{
  "coach_reply": "Your direct, engaging, and practical response.",
  "grammar_tips": [
     {{"mistake": "The exact wrong part", "correction": "The correct phrase", "explanation": "Why it's wrong"}}
  ]
}}
If there are no clear grammatical errors, "grammar_tips" must be an empty array [].
Do NOT mention grammar checking in your "coach_reply"; the UI will handle showing the tips separately.
"""

    messages = [{"role": "system", "content": system_prompt}]
    
    # Add history
    for msg in history:
        messages.append(msg)
        
    messages.append({"role": "user", "content": user_message})

    response = await client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=messages,
        response_format={"type": "json_object"},
        temperature=0.6,
    )

    try:
        content = response.choices[0].message.content
        data = json.loads(content)
        return ChatbotResponse(**data)
    except Exception as e:
        print(f"Error parsing Coach Priya response: {e}")
        return ChatbotResponse(
            coach_reply="I'm having a little trouble connecting my thoughts right now. Could you repeat that?",
            grammar_tips=[]
        )

async def get_pronunciation_guide(word_or_phrase: str) -> PronunciationGuideResponse:
    """
    Simulates a linguistics expert breaking down how to pronounce a specific word or short phrase.
    Caches results as pronunciations don't change.
    """
    cache_key = f"pronounce:{hashlib.md5(word_or_phrase.strip().lower().encode()).hexdigest()}"
    cached = await redis_service.get_cached_response(cache_key)
    if cached:
        try:
            return PronunciationGuideResponse(**json.loads(cached))
        except: pass

    system_prompt = """You are a pronunciation expert teaching English to beginners.
I will give you a confusing English word or short phrase. You MUST break down how to pronounce it using extremely simple, relatable words.

You MUST respond with ONLY a valid JSON object matching this exact schema:
{
  "phonetic_spelling": "A simple phonetic spelling using normal letters (no confusing IPA symbols) like 'kuh-myoo-ni-kay-shun'.",
  "rhymes_with": "1 or 2 easy English words that perfectly rhyme with it.",
  "syllable_examples": "A brief breakdown comparing its syllables to tiny words they already know (e.g. 'The tion at the end sounds like the word shun').",
  "usage_sentence": "A very short, simple 1-sentence example using the word in context."
}
"""

    response = await client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"How do I pronounce: {word_or_phrase}"}
        ],
        response_format={"type": "json_object"},
        temperature=0.4,
    )

    try:
        content = response.choices[0].message.content
        data = json.loads(content)
        await redis_service.set_cached_response(cache_key, content)
        return PronunciationGuideResponse(**data)
    except Exception as e:
        print(f"Error parsing pronunciation response: {e}")
        return PronunciationGuideResponse(
            phonetic_spelling="error",
            rhymes_with="error",
            syllable_examples="System encountered an error finding pronunciation data.",
            usage_sentence="Please try again later."
        )

async def generate_vocabulary_scenario(word: str, meaning: str, user_level: str = "B1") -> str:
    """
    Generates a fresh, relatable real-world scenario sentence using the given word.
    Caches result to avoid repeated calls for the same word/meaning/level.
    """
    cache_key = f"vocab_scenario:{user_level}:{hashlib.md5((word + meaning).strip().lower().encode()).hexdigest()}"
    cached = await redis_service.get_cached_response(cache_key)
    if cached:
        return cached

    system_prompt = f"""You are a vocabulary coach for an Indian professional audience.
The user's CEFR English level is {user_level}.

Given a word and its meaning, create ONE natural, relatable sentence using the word.
The sentence should be set in an Indian workplace or daily life context — think IT companies,
Hyderabad/Bengaluru offices, team meetings, chai breaks, commute, or family situations.

Rules:
- Keep it under 25 words
- The sentence should make the word's meaning obvious from context
- Sound natural, not textbook-like
- Respond with ONLY the sentence, nothing else — no quotes, no labels, no explanation
"""

    response = await client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Word: {word}\nMeaning: {meaning}"}
        ],
        temperature=0.7,
        max_tokens=60,
    )

    try:
        content = response.choices[0].message.content.strip().strip('"')
        await redis_service.set_cached_response(cache_key, content)
        return content
    except Exception as e:
        print(f"Error generating vocabulary scenario: {e}")
        return f"Unable to generate a scenario for '{word}' at this time."

async def get_word_origin_story() -> WordOriginResponse:
    """
    Asks Groq to pick a surprising and interesting English word origin story.
    Designed for the 'Do you KNOW' home page banner.
    """
    system_prompt = """You are an etymology expert and storyteller. 
Your goal is to find an extremely interesting, surprising, and educational story about the origin of a common English word.

Rules:
1. Pick a word that a professional English learner (B1-C1 level) would find useful or fascinating.
2. The story should be engaging and reveal something "surprising" (e.g., words with nautical origins, unexpected Latin/Greek roots, or historical accidents).
3. 'short_preview' should be 1-2 sentences that hook the reader (max 150 chars).
4. 'full_story' should be a rich, interesting 2-paragraph narrative (max 500 chars).
5. 'origin_title' should be a catchy title for the story.

You MUST respond with ONLY a valid JSON object matching this schema:
{
  "word": "The word itself",
  "origin_title": "A catchy title",
  "short_preview": "A hook for the user",
  "full_story": "The complete, interesting story"
}
"""

    response = await client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": "Tell me a truly surprising word origin story for today."}
        ],
        response_format={"type": "json_object"},
        temperature=0.8, # Slightly higher for variety/creativity
    )

    try:
        content = response.choices[0].message.content
        data = json.loads(content)
        return WordOriginResponse(**data)
    except Exception as e:
        print(f"Error parsing word origin response: {e}")
        return WordOriginResponse(
            word="Discovery",
            origin_title="Finding the new",
            short_preview="Did you know 'discover' literally means to 'un-cover'?",
            full_story="The word 'discover' comes from the Old French 'descouvrir', which means to reveal or un-cover. It's the opposite of cover!"
        )
