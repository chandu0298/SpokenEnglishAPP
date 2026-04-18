# Backend Skill 05: Coaching Chatbot

## Architecture
"Coach Priya" is an AI Persona powered by Llama 3.1 8B. Instead of standard chat, the prompt specifically instructs her to act as a supportive English coach. She will naturally reply to user messages while silently providing grammar corrections if the user makes a mistake.

## State Management
Since LLMs are stateless, we use Upstash Redis to store the chat history.
- **Key**: `chat:{user_id}:history`
- **Value**: JSON list of the last 10 messages (sliding window) to maintain context.

## API Endpoint
`POST /api/chat/message`

### Request Payload
```json
{
  "message": "I go to market tomorrow.",
  "user_level": "A2"
}
```

### Response Payload
```json
{
  "coach_reply": "That sounds like a fun plan! What are you planning to buy?",
  "grammar_tips": [
    {
      "mistake": "I go to market tomorrow.",
      "correction": "I am going to the market tomorrow.",
      "explanation": "Use 'am going to' or 'will go' for future plans."
    }
  ]
}
```

## System Prompt Guidelines
Instruct Llama to return a JSON containing BOTH the organic response (`coach_reply`) and an array of `grammar_tips`. If no mistakes were made, `grammar_tips` will be an empty array `[]`.

CEFR Adaptiveness: Coach Priya's vocabulary in `coach_reply` should adapt to the `user_level` sent in the request.
