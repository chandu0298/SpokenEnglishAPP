from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os

class Settings(BaseSettings):
    app_env: str = "development"
    cors_origins: str = "http://localhost:8081,exp://localhost:8081"
    
    # API Keys
    groq_api_key: str = ""
    
    # Database
    database_url: str = ""
    
    # Redis
    upstash_redis_url: str = ""
    upstash_redis_token: str = ""
    
    # Firebase
    firebase_service_account_path: str = "./firebase_service_account.json"
    
    # Payments
    razorpay_key_id: str = ""
    razorpay_key_secret: str = ""
    razorpay_webhook_secret: str = ""
    
    # Voice / TTS
    google_application_credentials: str = "" # Path to json file

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() == "production"

    @property
    def google_creds_path(self) -> str:
        if self.google_application_credentials:
            return self.google_application_credentials
        # Fallback to firebase service account if it exists
        if os.path.exists(self.firebase_service_account_path):
            return self.firebase_service_account_path
        return ""

    # Load from .env by default, but allow overriding with system env variables
    model_config = SettingsConfigDict(
        env_file=(".env", ".env.local"),
        env_file_encoding="utf-8", 
        extra="ignore"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

settings = Settings()
