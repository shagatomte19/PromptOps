"""
Prompt and PromptVersion models.
"""

from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Text, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base


class Prompt(Base):
    """
    A prompt container that holds multiple versions.
    Linked to a Supabase user via user_id.
    """
    __tablename__ = "prompts"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)  # Supabase user UUID
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    versions: Mapped[List["PromptVersion"]] = relationship(
        "PromptVersion",
        back_populates="prompt",
        cascade="all, delete-orphan",
        order_by="desc(PromptVersion.created_at)"
    )
    experiments: Mapped[List["Experiment"]] = relationship(
        "Experiment",
        back_populates="prompt",
        cascade="all, delete-orphan"
    )
    
    def __repr__(self) -> str:
        return f"<Prompt(id={self.id}, name='{self.name}')>"


class PromptVersion(Base):
    """
    A specific version of a prompt with content and configuration.
    """
    __tablename__ = "prompt_versions"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    prompt_id: Mapped[int] = mapped_column(Integer, ForeignKey("prompts.id", ondelete="CASCADE"), nullable=False)
    version_tag: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g., "v1.0.0"
    
    # Prompt content
    system_prompt: Mapped[str] = mapped_column(Text, nullable=False, default="")
    user_prompt: Mapped[str] = mapped_column(Text, nullable=False, default="")
    
    # Configuration
    model: Mapped[str] = mapped_column(String(100), nullable=False, default="gemini-2.0-flash")
    temperature: Mapped[float] = mapped_column(Float, nullable=False, default=0.7)
    max_tokens: Mapped[int] = mapped_column(Integer, nullable=False, default=1024)
    
    # Metadata
    commit_message: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    variables: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)  # Variable definitions
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    prompt: Mapped["Prompt"] = relationship("Prompt", back_populates="versions")
    deployments: Mapped[List["Deployment"]] = relationship(
        "Deployment",
        back_populates="version",
        cascade="all, delete-orphan"
    )
    
    def __repr__(self) -> str:
        return f"<PromptVersion(id={self.id}, tag='{self.version_tag}')>"


# Import for type hints (avoid circular imports)
from app.models.experiment import Experiment
from app.models.deployment import Deployment
