from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from services.groq_service import get_grammar_correction, GrammarCorrectionResponse
from services.redis_service import increment_user_usage, get_user_usage
from services.auth_service import get_current_user
from models.user import User, PlanType

router = APIRouter()

class GrammarRequest(BaseModel):
    text: str

@router.post("/correct", response_model=GrammarCorrectionResponse)
async def correct_grammar(
    request: GrammarRequest,
    user: User = Depends(get_current_user)
):
    """
    Accepts text and returns grammatical corrections and feedback using Groq AI.
    """
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    # Check usage limits for FREE users
    user_id_str = str(user.id)
    if user.plan_type == PlanType.FREE:
        daily_corrections = await get_user_usage(user_id_str, "grammar")
        if daily_corrections >= 5:
            raise HTTPException(
                status_code=403, 
                detail="Daily grammar correction limit reached for free plan. Upgrade to PRO for unlimited checks!"
            )

    try:
        # Use user.cefr_level if available, or fall back to B1
        level = user.cefr_level.value if hasattr(user, 'cefr_level') else "B1"
        result = await get_grammar_correction(request.text, level)
        
        # Increment usage count
        await increment_user_usage(user_id_str, "grammar")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

