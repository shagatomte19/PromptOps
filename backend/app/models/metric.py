"""
Metric model for tracking inference performance.
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.database import Base


class Metric(Base):
    """
    Metrics for individual inference requests.
    Used for monitoring latency, cost, and token usage.
    """
    __tablename__ = "metrics"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    
    # Reference (optional - can be from deployment or direct test)
    deployment_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("deployments.id", ondelete="SET NULL"), nullable=True)
    prompt_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("prompts.id", ondelete="SET NULL"), nullable=True)
    version_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("prompt_versions.id", ondelete="SET NULL"), nullable=True)
    experiment_variant_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    # Model info
    model: Mapped[str] = mapped_column(String(100), nullable=False)
    
    # Performance metrics
    latency_ms: Mapped[int] = mapped_column(Integer, nullable=False)  # Time to complete request
    input_tokens: Mapped[int] = mapped_column(Integer, default=0)
    output_tokens: Mapped[int] = mapped_column(Integer, default=0)
    total_tokens: Mapped[int] = mapped_column(Integer, default=0)
    
    # Cost estimation (in USD cents)
    estimated_cost_cents: Mapped[float] = mapped_column(Float, default=0.0)
    
    # Status
    success: Mapped[bool] = mapped_column(default=True)
    error_message: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # Timestamp
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    def __repr__(self) -> str:
        return f"<Metric(id={self.id}, latency={self.latency_ms}ms)>"
