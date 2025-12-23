"""
Deployment schemas for API validation.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

from app.models.deployment import DeploymentStatus


class DeploymentCreate(BaseModel):
    """Schema for creating a deployment."""
    version_id: int = Field(..., description="Prompt version to deploy")
    environment_id: int = Field(..., description="Target environment")
    notes: Optional[str] = Field(None, max_length=500, description="Deployment notes")


class DeploymentResponse(BaseModel):
    """Schema for deployment response."""
    id: int
    version_id: int
    environment_id: int
    user_id: str
    status: DeploymentStatus
    notes: Optional[str]
    rolled_back_from_id: Optional[int]
    created_at: datetime
    deployed_at: Optional[datetime]
    
    # Nested info (populated in API)
    version_tag: Optional[str] = None
    prompt_name: Optional[str] = None
    environment_name: Optional[str] = None
    
    class Config:
        from_attributes = True


class DeploymentRollbackRequest(BaseModel):
    """Schema for rollback request."""
    reason: Optional[str] = Field(None, max_length=500, description="Rollback reason")
