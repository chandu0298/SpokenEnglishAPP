# Frontend Skill 06: Lessons & Roleplay Screens

## Overview
These screens guide the user through structured, topic-specific practice.

## Screens

### 1. Topic Detail (`app/lessons/[id].tsx`)
- Displays when a user taps a TopicCard on the Home Dashboard.
- **Header**: Topic title, category badge, difficulty.
- **Key Phrases Section**: A list of 3-5 useful phrases for this scenario. Each has a TTS play button to hear pronunciation.
- **Start Button**: "Start Roleplay" at the bottom.

### 2. Roleplay Session (`app/lessons/session/[id].tsx`)
- Very similar to the Coach Chat UI, but focused on the specific scenario.
- Shows a progress indicator at the top (e.g., Turn 1/5).
- Automatically ends after ~5 interactions or when the Objective is met (determined by backend).
- Uses the `/api/lessons/{id}/submit` endpoint.

### 3. Session Summary Modal
- Upon completion, calls `/api/lessons/{id}/score`.
- Displays the Fluency Score in a large circular progress chart.
- Shows vocabulary suggestions.
- Button: "Complete" -> Navigates back to Dashboard and updates progress.
