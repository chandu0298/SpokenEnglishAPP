from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from services.stt_service import stt_service
from services.redis_service import increment_user_usage, get_user_usage
from services.auth_service import get_current_user
from models.user import User, PlanType

router = APIRouter()

@router.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user)
):
    """
    Receives an audio file from the mobile app and returns the transcribed text.
    """
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload audio.")

    # Check usage limits for FREE users
    user_id_str = str(user.id)
    if user.plan_type == PlanType.FREE:
        daily_transcriptions = await get_user_usage(user_id_str, "stt")
        if daily_transcriptions >= 10:
            raise HTTPException(
                status_code=403, 
                detail="Daily transcription limit reached for free plan. Upgrade to PRO for unlimited speech practice!"
            )

    text = await stt_service.transcribe_audio(file)
    
    if not text:
        raise HTTPException(status_code=500, detail="Transcription failed")

    # Increment usage count
    await increment_user_usage(user_id_str, "stt")

    return {
        "text": text,
        "language": "en"
    }
