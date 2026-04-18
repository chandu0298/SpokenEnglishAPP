import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, func, ForeignKey, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.database import Base

class UserProgress(Base):
    __tablename__ = "user_progress"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lesson_id: Mapped[int] = mapped_column(Integer, nullable=False) # Ties back to the static 20 lessons
    
    score: Mapped[int] = mapped_column(Integer, default=0)
    current_phase: Mapped[int] = mapped_column(Integer, default=1) # 1 through 5
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="progress_records")
