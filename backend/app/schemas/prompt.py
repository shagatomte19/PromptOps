"""
Prompt schemas for API validation.
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


# ====== Prompt Version Schemas ======

class PromptVersionBase(BaseModel):
    """Base schema for prompt version."""
    system_prompt: str = Field(default="", description="System context for the prompt")
    user_prompt: str = Field(default="", description="User message template")
    model: str = Field(default="gemini-2.0-flash", description="LLM model to use")
    temperature: float = Field(default=0.7, ge=0.0, le=2.0, description="Sampling temperature")
    max_tokens: int = Field(default=1024, ge=1, le=8192, description="Maximum output tokens")


class PromptVersionCreate(PromptVersionBase):
    """Schema for creating a new prompt version."""
    version_tag: str = Field(..., description="Version tag (e.g., v1.0.0)")
    commit_message: Optional[str] = Field(None, max_length=500, description="Version commit message")
    variables: Optional[dict] = Field(None, description="Variable definitions")


class PromptVersionResponse(PromptVersionBase):
    """Schema for prompt version response."""
    id: int
    prompt_id: int
    version_tag: str
    commit_message: Optional[str]
    variables: Optional[dict]
    created_at: datetime
    
    class Config:
        from_attributes = True


# ====== Prompt Schemas ======

class PromptBase(BaseModel):
    """Base schema for prompt."""
    name: str = Field(..., min_length=1, max_length=255, description="Prompt name")
    description: Optional[str] = Field(None, description="Prompt description")


class PromptCreate(PromptBase):
    """Schema for creating a new prompt."""
    # Optional: create initial version
    initial_version: Optional[PromptVersionCreate] = None


class PromptUpdate(BaseModel):
    """Schema for updating a prompt."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None


class PromptResponse(PromptBase):
    """Schema for prompt response."""
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime
    versions: List[PromptVersionResponse] = []
    
    class Config:
        from_attributes = True


class PromptListResponse(PromptBase):
    """Schema for prompt list item (without full versions)."""
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime
    latest_version: Optional[str] = None  # Latest version tag
    version_count: int = 0
    
    class Config:
        from_attributes = True
