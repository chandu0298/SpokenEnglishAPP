import uuid
from typing import Optional
from datetime import datetime
from sqlalchemy import String, DateTime, func, Enum, ForeignKey, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from db.database import Base

class CEFRLevel(str, enum.Enum):
    INITIAL = "INITIAL"
    A1 = "A1"
    A2 = "A2"
    B1 = "B1"
    B2 = "B2"
    C1 = "C1"
    C2 = "C2"


class PlanType(str, enum.Enum):
    FREE = "FREE"
    PRO = "PRO"

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    firebase_uid: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    
    cefr_level: Mapped[CEFRLevel] = mapped_column(Enum(CEFRLevel), default=CEFRLevel.INITIAL)

    plan_type: Mapped[PlanType] = mapped_column(Enum(PlanType), default=PlanType.FREE)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    streak_days: Mapped[int] = mapped_column(Integer, default=0)
    last_active_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    progress_records = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")
