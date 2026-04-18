import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings

# Import routers here later
from routers import grammar, chatbot, vocabulary, pronunciation, user, stt, voice, payments
# from routers import auth

app = FastAPI(
    title="EchoFluent Backend",
    description="FastAPI backend for EchoFluent, an AI-powered spoken English coaching app",
    version="1.0.0"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Basic Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    try:
        response = await call_next(request)
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"CRITICAL 500 ERROR: {error_details}")
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal Server Error", "error": str(e), "traceback": error_details}
        )

# app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(grammar.router, prefix="/api/grammar", tags=["Grammar"])
app.include_router(chatbot.router, prefix="/api/chat", tags=["Coach Chatbot"])
app.include_router(vocabulary.router, prefix="/api/vocab", tags=["Vocabulary"])
app.include_router(pronunciation.router, prefix="/api/pronunciation", tags=["Pronunciation"])
app.include_router(user.router, prefix="/api/user", tags=["User Profile"])
app.include_router(stt.router, prefix="/api/stt", tags=["Speech to Text"])
app.include_router(voice.router, prefix="/api/voice", tags=["Voice & TTS"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])

@app.get("/")
async def root():
    return {"message": "Welcome to EchoFluent API!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
