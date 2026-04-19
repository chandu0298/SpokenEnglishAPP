"""
Vocabulary Generation Script
Generates 500 words per CEFR level (B1, B2, C1, C2) using Groq AI.
Total: 2000 words for continuous learning.

Run: python -m db.generate_vocabulary
"""

import asyncio
import json
import os
import sys
from groq import AsyncGroq

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import settings

client = AsyncGroq(api_key=settings.groq_api_key)

# Categories to ensure variety
WORD_CATEGORIES = [
    "business and workplace",
    "technology and computing", 
    "daily life and routines",
    "travel and transportation",
    "health and wellness",
    "education and learning",
    "finance and economics",
    "relationships and social",
    "environment and nature",
    "arts and entertainment",
    "food and cooking",
    "sports and fitness",
    "science and research",
    "law and government",
    "communication and media"
]

LEVEL_DESCRIPTIONS = {
    "B1": "Intermediate level - common vocabulary for everyday situations, work, and travel",
    "B2": "Upper-Intermediate level - more nuanced vocabulary for complex discussions and professional contexts", 
    "C1": "Advanced level - sophisticated vocabulary for academic, business, and specialized topics",
    "C2": "Mastery level - rare, literary, and highly specialized vocabulary for native-like fluency"
}

async def generate_words_batch(level: str, category: str, batch_num: int, existing_words: set) -> list:
    """Generate a batch of 10-15 words for a specific level and category."""
    
    existing_sample = list(existing_words)[:50] if existing_words else []
    
    prompt = f"""Generate exactly 12 English vocabulary words for {level} level ({LEVEL_DESCRIPTIONS[level]}).
Category focus: {category}

IMPORTANT: Do NOT include any of these words that already exist: {existing_sample}

For each word, provide:
1. word: The vocabulary word (single word or common phrase)
2. phonetic: Pronunciation guide (e.g., "uh-KOM-plish")
3. meaning: Clear definition (1-2 sentences)
4. roots: Array of etymology/root words with language origin
5. example_sentence: Real-world example in Indian professional/daily life context

Return ONLY a valid JSON array with exactly 12 word objects. No other text.
Example format:
[
  {{
    "word": "accomplish",
    "phonetic": "uh-KOM-plish", 
    "meaning": "To successfully complete or achieve something you planned to do",
    "roots": ["Latin: accomplere (to fill up, complete)"],
    "example_sentence": "She accomplished all her sprint tasks before the Friday deadline."
  }}
]"""

    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a vocabulary expert. Return ONLY valid JSON arrays."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.8,
            max_tokens=4000
        )
        
        content = response.choices[0].message.content
        # Try to extract JSON array from response
        if content.strip().startswith('['):
            data = json.loads(content)
        else:
            # Response might be wrapped in an object
            data = json.loads(content)
            if isinstance(data, dict) and 'words' in data:
                data = data['words']
            elif isinstance(data, dict):
                # Find the array in the dict
                for key, val in data.items():
                    if isinstance(val, list):
                        data = val
                        break
        
        if not isinstance(data, list):
            print(f"  Warning: Invalid response format for {level}/{category}")
            return []
            
        # Validate and filter
        valid_words = []
        for item in data:
            if isinstance(item, dict) and 'word' in item:
                word_lower = item['word'].lower()
                if word_lower not in existing_words:
                    valid_words.append({
                        "word": item.get('word', ''),
                        "phonetic": item.get('phonetic', ''),
                        "level": level,
                        "meaning": item.get('meaning', ''),
                        "roots": item.get('roots', []),
                        "example_sentence": item.get('example_sentence', '')
                    })
                    existing_words.add(word_lower)
        
        return valid_words
        
    except Exception as e:
        print(f"  Error generating batch: {e}")
        return []


async def generate_level_vocabulary(level: str, target_count: int = 500) -> list:
    """Generate vocabulary words for a single level."""
    print(f"\n{'='*60}")
    print(f"Generating {target_count} words for level {level}")
    print(f"{'='*60}")
    
    all_words = []
    existing_words = set()
    batch_num = 0
    
    while len(all_words) < target_count:
        for category in WORD_CATEGORIES:
            if len(all_words) >= target_count:
                break
                
            batch_num += 1
            print(f"  Batch {batch_num}: {category} ({len(all_words)}/{target_count} words)")
            
            words = await generate_words_batch(level, category, batch_num, existing_words)
            all_words.extend(words)
            
            # Small delay to avoid rate limits
            await asyncio.sleep(1)
        
        # If we've gone through all categories and still need more, loop again
        if len(all_words) < target_count:
            print(f"  Continuing... need {target_count - len(all_words)} more words")
    
    # Trim to exact count
    all_words = all_words[:target_count]
    print(f"  ✓ Generated {len(all_words)} words for {level}")
    
    return all_words


async def generate_all_vocabulary():
    """Generate vocabulary for all levels and save to file."""
    print("\n" + "="*60)
    print("VOCABULARY GENERATION STARTED")
    print("Target: 500 words × 4 levels = 2000 total words")
    print("="*60)
    
    all_vocabulary = []
    
    for level in ["B1", "B2", "C1", "C2"]:
        words = await generate_level_vocabulary(level, 500)
        all_vocabulary.extend(words)
    
    # Save to JSON file
    output_path = os.path.join(os.path.dirname(__file__), 'vocabulary_words_full.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_vocabulary, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*60}")
    print(f"GENERATION COMPLETE!")
    print(f"Total words: {len(all_vocabulary)}")
    print(f"Saved to: {output_path}")
    print(f"{'='*60}")
    
    # Also generate Python seed file
    await generate_seed_file(all_vocabulary)
    
    return all_vocabulary


async def generate_seed_file(vocabulary: list):
    """Generate a Python seed file from the vocabulary list."""
    output_path = os.path.join(os.path.dirname(__file__), 'vocabulary_seed_full.py')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('"""\n')
        f.write('Vocabulary seed data — 500 words per CEFR level (B1, B2, C1, C2).\n')
        f.write('2000 total words for continuous learning.\n')
        f.write('Auto-generated using Groq AI.\n')
        f.write('"""\n\n')
        f.write('VOCABULARY_WORDS = [\n')
        
        for word in vocabulary:
            roots_str = json.dumps(word.get('roots', []))
            example = word.get('example_sentence', '').replace('"', '\\"')
            meaning = word.get('meaning', '').replace('"', '\\"')
            
            f.write(f'    {{"word": "{word["word"]}", "phonetic": "{word.get("phonetic", "")}", "level": "{word["level"]}",\n')
            f.write(f'     "meaning": "{meaning}",\n')
            f.write(f'     "roots": {roots_str},\n')
            f.write(f'     "example_sentence": "{example}"}},\n\n')
        
        f.write(']\n')
    
    print(f"Seed file saved to: {output_path}")


if __name__ == "__main__":
    asyncio.run(generate_all_vocabulary())
