"""
Environment schemas for API validation.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class EnvironmentBase(BaseModel):
    """Base schema for environment."""
    name: str = Field(..., min_length=1, max_length=50, description="Environment identifier")
    display_name: str = Field(..., min_length=1, max_length=100, description="Display name")
    description: Optional[str] = Field(None, max_length=500)
    is_protected: bool = Field(default=False, description="Require approval for deploys")
    color: str = Field(default="#6366f1", description="UI color hex code")


class EnvironmentCreate(EnvironmentBase):
    """Schema for creating an environment."""
    pass


class EnvironmentResponse(EnvironmentBase):
    """Schema for environment response."""
    id: int
    user_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True
