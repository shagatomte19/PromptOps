"""
Deployment model for tracking prompt version deployments.
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
import enum

from app.database import Base


class DeploymentStatus(str, enum.Enum):
    """Status of a deployment."""
    PENDING = "pending"
    DEPLOYING = "deploying"
    ACTIVE = "active"
    ROLLED_BACK = "rolled_back"
    FAILED = "failed"


class Deployment(Base):
    """
    A deployment of a prompt version to an environment.
    """
    __tablename__ = "deployments"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    version_id: Mapped[int] = mapped_column(Integer, ForeignKey("prompt_versions.id", ondelete="CASCADE"), nullable=False)
    environment_id: Mapped[int] = mapped_column(Integer, ForeignKey("environments.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)  # Who deployed
    
    status: Mapped[DeploymentStatus] = mapped_column(
        Enum(DeploymentStatus),
        default=DeploymentStatus.PENDING,
        nullable=False
    )
    
    # Deployment notes
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Rollback reference
    rolled_back_from_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("deployments.id"), nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    deployed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    version: Mapped["PromptVersion"] = relationship("PromptVersion", back_populates="deployments")
    environment: Mapped["Environment"] = relationship("Environment", back_populates="deployments")
    
    def __repr__(self) -> str:
        return f"<Deployment(id={self.id}, status='{self.status}')>"


# Import for type hints
from app.models.prompt import PromptVersion
from app.models.environment import Environment
