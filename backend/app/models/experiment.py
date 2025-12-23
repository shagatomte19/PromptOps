"""
Experiment and ExperimentVariant models for A/B testing.
"""

from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Text, Integer, Float, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
import enum

from app.database import Base


class ExperimentStatus(str, enum.Enum):
    """Status of an A/B experiment."""
    DRAFT = "draft"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"


class Experiment(Base):
    """
    A/B testing experiment for comparing prompt variants.
    """
    __tablename__ = "experiments"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    prompt_id: Mapped[int] = mapped_column(Integer, ForeignKey("prompts.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[ExperimentStatus] = mapped_column(
        Enum(ExperimentStatus),
        default=ExperimentStatus.DRAFT,
        nullable=False
    )
    
    # Experiment configuration
    traffic_allocation: Mapped[dict] = mapped_column(JSON, default=dict)  # {"variant_a": 50, "variant_b": 50}
    
    # Results
    results: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    winner_variant_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    ended_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    prompt: Mapped["Prompt"] = relationship("Prompt", back_populates="experiments")
    variants: Mapped[List["ExperimentVariant"]] = relationship(
        "ExperimentVariant",
        back_populates="experiment",
        cascade="all, delete-orphan"
    )
    
    def __repr__(self) -> str:
        return f"<Experiment(id={self.id}, name='{self.name}', status='{self.status}')>"


class ExperimentVariant(Base):
    """
    A variant in an A/B experiment (e.g., Variant A, Variant B).
    """
    __tablename__ = "experiment_variants"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    experiment_id: Mapped[int] = mapped_column(Integer, ForeignKey("experiments.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(50), nullable=False)  # A, B, C, etc.
    
    # Variant content
    system_prompt: Mapped[str] = mapped_column(Text, nullable=False, default="")
    user_prompt: Mapped[str] = mapped_column(Text, nullable=False, default="")
    model: Mapped[str] = mapped_column(String(100), nullable=False, default="gemini-2.0-flash")
    temperature: Mapped[float] = mapped_column(Float, nullable=False, default=0.7)
    
    # Traffic weight (percentage)
    traffic_weight: Mapped[int] = mapped_column(Integer, default=50)
    
    # Metrics
    request_count: Mapped[int] = mapped_column(Integer, default=0)
    success_count: Mapped[int] = mapped_column(Integer, default=0)
    avg_latency_ms: Mapped[float] = mapped_column(Float, default=0.0)
    avg_tokens: Mapped[float] = mapped_column(Float, default=0.0)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    experiment: Mapped["Experiment"] = relationship("Experiment", back_populates="variants")
    
    def __repr__(self) -> str:
        return f"<ExperimentVariant(id={self.id}, name='{self.name}')>"


# Import for type hints
from app.models.prompt import Prompt
