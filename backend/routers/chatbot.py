from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict
from services.groq_service import get_coach_response, ChatbotResponse
from services.redis_service import get_chat_history, add_message_to_history, increment_user_usage, get_user_usage
from services.auth_service import get_current_user
from models.user import User, PlanType
import uuid

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    user_level: str = "B1"

@router.post("/message", response_model=ChatbotResponse)
async def send_message(
    request: ChatRequest,
    user: User = Depends(get_current_user)
):
    """
    Handles a user's message, retrieves past conversation history,
    and returns a coached response + grammar tips.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    user_id_str = str(user.id)
    
    # 0. Check usage limits for FREE users
    if user.plan_type == PlanType.FREE:
        daily_messages = await get_user_usage(user_id_str, "chatbot")
        if daily_messages >= 20:
             raise HTTPException(
                status_code=403, 
                detail="Daily message limit reached for free plan. Upgrade to PRO for unlimited chat!"
            )
    
    try:
        # 1. Fetch previous context from Redis (last 10 messages)
        history = await get_chat_history(user_id_str, limit=10)
        
        # 2. Add current user message to Redis memory
        await add_message_to_history(user_id_str, "user", request.message)

        # 3. Call Groq with the context
        result = await get_coach_response(request.message, history, request.user_level)
        
        # 4. Save Coach Priya's response to Redis memory
        await add_message_to_history(user_id_str, "assistant", result.coach_reply)
        
        # 5. Increment usage count
        await increment_user_usage(user_id_str, "chatbot")
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/demo", response_model=ChatbotResponse)
async def send_demo_message(
    request: ChatRequest
):
    """
    Public demo endpoint for the website landing page.
    No authentication required, uses a shared demo session.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    demo_user_id = "website_demo_user"
    
    try:
        # Fetch history for the demo session
        history = await get_chat_history(demo_user_id, limit=5)
        
        await add_message_to_history(demo_user_id, "user", request.message)
        result = await get_coach_response(request.message, history, request.user_level)
        await add_message_to_history(demo_user_id, "assistant", result.coach_reply)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
