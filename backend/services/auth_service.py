import firebase_admin
from firebase_admin import auth, credentials
from fastapi import Header, HTTPException, Depends
from config import settings
from typing import Optional
import os

# Initialize Firebase Admin SDK
# Note: Ensure the file exists at the path defined in settings.firebase_service_account_path
try:
    if not firebase_admin._apps:
        # Check if the path is valid before initializing
        if os.path.exists(settings.firebase_service_account_path):
            cred = credentials.Certificate(settings.firebase_service_account_path)
            firebase_admin.initialize_app(cred)
        else:
            print(f"WARNING: Firebase service account file not found at {settings.firebase_service_account_path}. Auth will fail.")
except Exception as e:
    print(f"Error initializing Firebase Admin: {e}")

from db.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from models.user import User, CEFRLevel, PlanType
from sqlalchemy import select

async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    FastAPI dependency to verify the Firebase ID Token.
    Returns the User object from DB. If user doesn't exist, it creates one.
    Also synchronizes name and email from Firebase to the DB.
    """
    # MOCK USER FOR DEV
    MOCK_UID = "00000000-0000-0000-0000-000000000001"
    
    firebase_uid = None
    email = None
    name = "New Learner"

    # 1. Handle Authentication (Mock for dev or Firebase verify)
    if settings.app_env == "development" and not authorization:
        firebase_uid = MOCK_UID
        email = "test@example.com"
        name = "Mock Developer"
    else:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

        id_token = authorization.split("Bearer ")[1]
        try:
            decoded_token = auth.verify_id_token(id_token)
            firebase_uid = decoded_token['uid']
            email = decoded_token.get('email')
            name = decoded_token.get('name')
            
            # If name is missing from token (common on first sign-up), 
            # fetch full user record from Firebase Admin
            if not name:
                try:
                    full_user = auth.get_user(firebase_uid)
                    name = full_user.display_name or "New Learner"
                except:
                    name = "New Learner"
                    
        except Exception as e:
            print(f"Auth error: {e}")
            raise HTTPException(status_code=401, detail="Invalid or expired token")

    # 2. Synchronize with Database
    result = await db.execute(select(User).where(User.firebase_uid == firebase_uid))
    user = result.scalar_one_or_none()

    if not user:
        # Create new user
        user = User(
            firebase_uid=firebase_uid,
            email=email,
            name=name,
            cefr_level=CEFRLevel.INITIAL,
            plan_type=PlanType.FREE,
            streak_days=0
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    else:
        # Synchronize metadata if changed
        modified = False
        if email and user.email != email:
            user.email = email
            modified = True
        if name and name != "New Learner" and user.name != name:
            user.name = name
            modified = True
            
        if modified:
            await db.commit()
            await db.refresh(user)

    return user

