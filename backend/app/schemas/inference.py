"""
Inference schemas for AI execution API.
"""

from typing import Optional, Dict
from pydantic import BaseModel, Field


class InferenceRequest(BaseModel):
    """Schema for inference request."""
    system_prompt: str = Field(..., description="System context")
    user_prompt: str = Field(..., description="User message")
    variables: Optional[Dict[str, str]] = Field(None, description="Variable values to interpolate")
    model: str = Field(default="gemini-2.0-flash", description="Model to use")
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(default=1024, ge=1, le=8192)
    
    # Optional: link to prompt/version for metrics
    prompt_id: Optional[int] = None
    version_id: Optional[int] = None
    deployment_id: Optional[int] = None
    experiment_variant_id: Optional[int] = None


class InferenceResponse(BaseModel):
    """Schema for inference response (non-streaming)."""
    text: str
    model: str
    latency_ms: int
    input_tokens: int
    output_tokens: int
    total_tokens: int
    estimated_cost_cents: float
    success: bool
    error: Optional[str] = None


class InferenceTestRequest(BaseModel):
    """Schema for testing a prompt with variables."""
    prompt_id: int
    version_id: int
    variables: Dict[str, str] = Field(default_factory=dict)
