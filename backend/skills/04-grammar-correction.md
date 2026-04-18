# Backend Skill 04: Grammar Correction

## Architecture
Uses the Groq API (Llama 3.1 8B) for fast inference to parse user text/speech and return structured grammar corrections.

## API Endpoint
`POST /api/grammar/correct`

### Request Payload
```json
{
  "text": "He go to school yesterday.",
  "user_level": "A2"
}
```

### Response Payload
```json
{
  "original": "He go to school yesterday.",
  "corrected": "He went to school yesterday.",
  "explanation": "Use 'went' instead of 'go' because the action happened in the past.",
  "errors": [
     {"word": "go", "replacement": "went", "type": "verb_tense"}
  ]
}
```

## Implementation Details
1. **Prompt Engineering**: The system prompt to Llama MUST enforce output in JSON format so we can reliably parse it into the Pydantic schema for the response.
2. **Groq Client**: Use the official `groq` python SDK or `httpx` async client.
   ```python
   import os
   from groq import AsyncGroq
   
   client = AsyncGroq(api_key=os.environ.get("GROQ_API_KEY"))
   ```
3. **Usage Limits**: Query Redis (`INCR user:{user_id}:grammar_count_today`) to enforce daily limits if the user is on the `FREE` plan. Limit: 10/day.
