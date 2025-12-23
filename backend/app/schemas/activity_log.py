"""
ActivityLog schemas for API responses.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel

from app.models.activity_log import ActivityLevel


class ActivityLogResponse(BaseModel):
    """Schema for activity log response."""
    id: int
    user_id: str
    level: ActivityLevel
    action: str
    message: str
    source: str
    metadata: Optional[dict]
    timestamp: datetime
    
    class Config:
        from_attributes = True


class ActivityLogListParams(BaseModel):
    """Query parameters for activity log list."""
    limit: int = 50
    offset: int = 0
    level: Optional[ActivityLevel] = None
    action: Optional[str] = None
    search: Optional[str] = None
