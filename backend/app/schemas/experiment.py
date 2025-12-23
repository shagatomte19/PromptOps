"""
Experiment schemas for A/B testing API validation.
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

from app.models.experiment import ExperimentStatus


# ====== Experiment Variant Schemas ======

class ExperimentVariantBase(BaseModel):
    """Base schema for experiment variant."""
    name: str = Field(..., min_length=1, max_length=50, description="Variant name (A, B, C, etc.)")
    system_prompt: str = Field(default="")
    user_prompt: str = Field(default="")
    model: str = Field(default="gemini-2.0-flash")
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    traffic_weight: int = Field(default=50, ge=0, le=100, description="Traffic percentage")


class ExperimentVariantCreate(ExperimentVariantBase):
    """Schema for creating a variant."""
    pass


class ExperimentVariantResponse(ExperimentVariantBase):
    """Schema for variant response."""
    id: int
    experiment_id: int
    request_count: int = 0
    success_count: int = 0
    avg_latency_ms: float = 0.0
    avg_tokens: float = 0.0
    created_at: datetime
    
    class Config:
        from_attributes = True


# ====== Experiment Schemas ======

class ExperimentBase(BaseModel):
    """Base schema for experiment."""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None


class ExperimentCreate(ExperimentBase):
    """Schema for creating an experiment."""
    prompt_id: int
    variants: List[ExperimentVariantCreate] = Field(..., min_length=2, description="At least 2 variants required")


class ExperimentUpdate(BaseModel):
    """Schema for updating an experiment."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[ExperimentStatus] = None


class ExperimentResponse(ExperimentBase):
    """Schema for experiment response."""
    id: int
    prompt_id: int
    status: ExperimentStatus
    traffic_allocation: dict
    results: Optional[dict]
    winner_variant_id: Optional[int]
    created_at: datetime
    started_at: Optional[datetime]
    ended_at: Optional[datetime]
    variants: List[ExperimentVariantResponse] = []
    
    class Config:
        from_attributes = True
