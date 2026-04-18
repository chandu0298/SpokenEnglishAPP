# Backend Skill 06: Lessons & Practice

## Architecture
There are 20 predefined topics (stored in the `lessons` table) spanning 6 categories (Social, Business, Travel, Daily, Finance, Phone). Users engage in interactive roleplays covering specific scenarios.

## API Endpoints

1. **`GET /api/lessons`**
   Returns all topics grouped by category, including progress data.
   - Joins `lessons` with `user_progress` for the `current_user`.
   - Maps to UI "Topic Cards" with completion statuses.

2. **`GET /api/lessons/{id}`**
   Returns details for a specific topic, including key phrases and the scenario description.

3. **`POST /api/lessons/{id}/start`**
   Starts a new roleplay session. 
   Initializes a Redis context: `session:{user_id}:{lesson_id}` containing the AI system prompt tailored to the scenario (e.g., Hotel Receptionist, Interviewer).

4. **`POST /api/lessons/{id}/submit`**
   User submits their turn in the roleplay. Similar to the Chatbot, but constrained to the scenario. 
   Limits roleplay to ~5 turns (10 total messages).

5. **`POST /api/lessons/{id}/score`**
   Ends the session. 
   - Prompts Groq to evaluate the full conversation history.
   - Calculates a Fluency Score (0-100).
   - Writes the score and `is_completed=True` to PostgreSQL `user_progress` table.
   - Returns badges/score to the user.
