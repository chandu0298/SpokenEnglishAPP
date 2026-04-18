from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.database import get_db
from models.user import User, CEFRLevel
from pydantic import BaseModel
from services.auth_service import get_current_user

router = APIRouter()

class UpdateLevelRequest(BaseModel):
    level: CEFRLevel

@router.post("/update-level")
async def update_user_level(
    request: UpdateLevelRequest, 
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    user.cefr_level = request.level
    await db.commit()
    
    return {"message": "Success", "level": user.cefr_level}

@router.get("/me")
async def get_my_profile(user: User = Depends(get_current_user)):
    return {
        "id": str(user.id),
        "firebase_uid": user.firebase_uid,
        "name": user.name,
        "email": user.email,
        "cefr_level": user.cefr_level.value if hasattr(user.cefr_level, 'value') else user.cefr_level,
        "streak": user.streak_days,
        "plan": user.plan_type.value if hasattr(user.plan_type, 'value') else user.plan_type
    }
