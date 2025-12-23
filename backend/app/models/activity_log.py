"""
ActivityLog model for audit trail.
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, Integer, DateTime, JSON, Enum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
import enum

from app.database import Base


class ActivityLevel(str, enum.Enum):
    """Log level for activity entries."""
    INFO = "info"
    SUCCESS = "success"
    WARNING = "warning"
    ERROR = "error"


class ActivityLog(Base):
    """
    Activity log for tracking user actions and system events.
    """
    __tablename__ = "activity_logs"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)  # Supabase user UUID
    
    # Log details
    level: Mapped[ActivityLevel] = mapped_column(
        Enum(ActivityLevel),
        default=ActivityLevel.INFO,
        nullable=False
    )
    action: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g., "prompt.created", "deployment.rollback"
    message: Mapped[str] = mapped_column(Text, nullable=False)
    source: Mapped[str] = mapped_column(String(50), default="system")  # e.g., "system", "api", "ui"
    
    # Additional context
    metadata: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)  # Extra data (prompt_id, version_id, etc.)
    
    # Timestamp
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    def __repr__(self) -> str:
        return f"<ActivityLog(id={self.id}, action='{self.action}')>"
