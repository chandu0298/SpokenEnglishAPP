import uuid
import enum
from datetime import datetime, date
from sqlalchemy import (
    String, Text, DateTime, Date, Integer, Enum, ForeignKey,
    func, UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.database import Base


class VocabBucket(str, enum.Enum):
    """Spaced repetition bucket — words progress through these stages."""
    LEARNING = "learning"
    REVIEWING = "reviewing"
    STRONG = "strong"
    MASTERED = "mastered"


class VocabularyWord(Base):
    """
    Master vocabulary word bank.
    Each word belongs to a CEFR level and contains etymology + usage data.
    """
    __tablename__ = "vocabulary_words"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    word: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    phonetic: Mapped[str] = mapped_column(String(100), nullable=False)
    level: Mapped[str] = mapped_column(String(4), nullable=False, index=True)  # B1, B2, C1, C2
    meaning: Mapped[str] = mapped_column(Text, nullable=False)
    roots: Mapped[list] = mapped_column(ARRAY(String), nullable=False, default=list)
    example_sentence: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    progress_records = relationship(
        "UserVocabProgress", back_populates="word", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<VocabularyWord {self.word} ({self.level})>"


class UserVocabProgress(Base):
    """
    Per-user, per-word learning state.
    Tracks which bucket a word is in and when it should next appear for review.
    """
    __tablename__ = "user_word_progress"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    word_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("vocabulary_words.id", ondelete="CASCADE"),
        nullable=False
    )

    bucket: Mapped[VocabBucket] = mapped_column(
        Enum(VocabBucket), default=VocabBucket.LEARNING, nullable=False
    )
    correct_streak: Mapped[int] = mapped_column(Integer, default=0)
    next_review: Mapped[date] = mapped_column(Date, default=date.today)
    last_seen: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    total_attempts: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    user = relationship("User")
    word = relationship("VocabularyWord", back_populates="progress_records")

    __table_args__ = (
        UniqueConstraint("user_id", "word_id", name="uq_user_word"),
    )

    def __repr__(self):
        return f"<UserVocabProgress user={self.user_id} word={self.word_id} bucket={self.bucket}>"
