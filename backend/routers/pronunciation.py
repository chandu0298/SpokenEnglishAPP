from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Any, Dict
from services.pronunciation_service import pronunciation_service
from services.auth_service import get_current_user
from models.user import User

router = APIRouter()

@router.get("/analyze")
async def analyze_pronunciation(
    word: str = Query(..., min_length=1),
    user: User = Depends(get_current_user)
):
    """
    Get a detailed pronunciation guide for a specific word.
    """
    if not word.isalpha():
        # Optional: check if it's a single word with no numbers/punctuation
        pass
        
    try:
        result = await pronunciation_service.analyze_word(word)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

