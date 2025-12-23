"""
Environment model for deployment targets.
"""

from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Integer, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base


class Environment(Base):
    """
    Deployment environment (development, staging, production).
    Each user has their own set of environments.
    """
    __tablename__ = "environments"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)  # Supabase user UUID
    name: Mapped[str] = mapped_column(String(50), nullable=False)  # dev, staging, prod
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_protected: Mapped[bool] = mapped_column(Boolean, default=False)  # Require approval for deploys
    color: Mapped[str] = mapped_column(String(20), default="#6366f1")  # UI color
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    deployments: Mapped[List["Deployment"]] = relationship(
        "Deployment",
        back_populates="environment",
        cascade="all, delete-orphan"
    )
    
    def __repr__(self) -> str:
        return f"<Environment(id={self.id}, name='{self.name}')>"


# Import for type hints
from app.models.deployment import Deployment
