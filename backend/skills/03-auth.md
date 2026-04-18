# Backend Skill 03: Authentication

## Architecture
We use Firebase Authentication to handle signups, logins, and OTPs. Once the client logs in, they receive a Firebase idToken. The client sends this in the `Authorization: Bearer <token>` header to our backend.

## Flow
1. Client sends a request to backend endpoint with `Bearer <idToken>`
2. FastAPI `get_current_user` dependency intercepts it
3. Middleware calls `firebase_admin.auth.verify_id_token`
4. If valid, the `firebase_uid` is extracted
5. The DB is queried for the corresponding `User` record
6. The `User` object is injected into the route handler

## Firebase Admin Setup
Initialize in `middleware/auth.py`:
```python
import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
firebase_admin.initialize_app(cred)
```

## Security Rule
- Almost all endpoints must require the `get_current_user` dependency except for webhooks and public config endpoints.
- When a user signs up on the frontend, they must make an initial `POST /api/auth/register` call to create their profile in our PostgreSQL DB, linking their `firebase_uid`.

## Free vs Pro Tier
When injecting `current_user`, handlers can check `current_user.plan_type` to enforce limits (e.g. limiting free users to 10 grammar checks a day).
