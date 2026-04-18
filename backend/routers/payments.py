from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.ext.asyncio import AsyncSession
from db.database import get_db
from models.user import User, PlanType
from services.auth_service import get_current_user
from services.payment_service import payment_service
from pydantic import BaseModel
from config import settings
import json

router = APIRouter()

class OrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str
    razorpay_key_id: str

@router.post("/create-order", response_model=OrderResponse)
async def create_razorpay_order(
    user: User = Depends(get_current_user)
):
    """
    Creates an order for the PRO plan upgrade.
    """
    if user.plan_type == PlanType.PRO:
        raise HTTPException(status_code=400, detail="User is already on PRO plan")
    
    # Amount in paise (e.g., 19900 = ₹199)
    # In production, this should likely be fetched from a config or database.
    amount = 19900 
    
    try:
        order = payment_service.create_order(amount=amount)
        return {
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "razorpay_key_id": settings.razorpay_key_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: str = Header(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Handles Razorpay webhooks (e.g., payment.captured).
    """
    body = await request.body()
    body_str = body.decode("utf-8")

    if not payment_service.verify_webhook_signature(body_str, x_razorpay_signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    data = json.loads(body_str)
    event = data.get("event")

    if event == "payment.captured":
        # Handle successful payment
        payload = data.get("payload", {})
        payment = payload.get("payment", {}).get("entity", {})
        order_id = payment.get("order_id")
        email = payment.get("email")
        
        # Note: In a real production app, we would use the 'notes' field in the 
        # Razorpay order to store the user_id or firebase_uid for solid matching.
        # For now, we match by email if available, or just log.
        
        # TODO: Update user to PRO plan in database
        # This belongs in a proper background task or dedicated handler
        print(f"SUCCESS: Payment captured for order {order_id} (User: {email})")
        
    return {"status": "ok"}
