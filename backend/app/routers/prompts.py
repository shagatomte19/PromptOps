"""
Prompts API router - CRUD operations for prompts and versions.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.deps import get_current_user
from app.services.supabase_auth import SupabaseUser
from app.services.activity import ActivityService
from app.models.prompt import Prompt, PromptVersion
from app.schemas.prompt import (
    PromptCreate, PromptUpdate, PromptResponse, PromptListResponse,
    PromptVersionCreate, PromptVersionResponse
)


router = APIRouter(prefix="/prompts", tags=["Prompts"])


@router.get("", response_model=List[PromptListResponse])
async def list_prompts(
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """List all prompts for the current user."""
    result = await db.execute(
        select(Prompt)
        .where(Prompt.user_id == user.id)
        .options(selectinload(Prompt.versions))
        .order_by(Prompt.updated_at.desc())
    )
    prompts = result.scalars().all()
    
    # Transform to list response with version info
    response = []
    for prompt in prompts:
        latest_version = prompt.versions[0].version_tag if prompt.versions else None
        response.append(PromptListResponse(
            id=prompt.id,
            user_id=prompt.user_id,
            name=prompt.name,
            description=prompt.description,
            created_at=prompt.created_at,
            updated_at=prompt.updated_at,
            latest_version=latest_version,
            version_count=len(prompt.versions)
        ))
    
    return response


@router.post("", response_model=PromptResponse, status_code=status.HTTP_201_CREATED)
async def create_prompt(
    data: PromptCreate,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Create a new prompt with optional initial version."""
    # Create prompt
    prompt = Prompt(
        user_id=user.id,
        name=data.name,
        description=data.description
    )
    db.add(prompt)
    await db.flush()  # Get the prompt ID
    
    # Create initial version if provided
    if data.initial_version:
        version = PromptVersion(
            prompt_id=prompt.id,
            version_tag=data.initial_version.version_tag,
            system_prompt=data.initial_version.system_prompt,
            user_prompt=data.initial_version.user_prompt,
            model=data.initial_version.model,
            temperature=data.initial_version.temperature,
            max_tokens=data.initial_version.max_tokens,
            commit_message=data.initial_version.commit_message,
            variables=data.initial_version.variables
        )
        db.add(version)
    
    await db.commit()
    await db.refresh(prompt)
    
    # Log activity
    activity_service = ActivityService(db)
    await activity_service.log_prompt_created(user.id, prompt.name, prompt.id)
    
    # Reload with versions
    result = await db.execute(
        select(Prompt)
        .where(Prompt.id == prompt.id)
        .options(selectinload(Prompt.versions))
    )
    prompt = result.scalar_one()
    
    return prompt


@router.get("/{prompt_id}", response_model=PromptResponse)
async def get_prompt(
    prompt_id: int,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Get a prompt with all its versions."""
    result = await db.execute(
        select(Prompt)
        .where(Prompt.id == prompt_id, Prompt.user_id == user.id)
        .options(selectinload(Prompt.versions))
    )
    prompt = result.scalar_one_or_none()
    
    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found"
        )
    
    return prompt


@router.put("/{prompt_id}", response_model=PromptResponse)
async def update_prompt(
    prompt_id: int,
    data: PromptUpdate,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Update a prompt's metadata."""
    result = await db.execute(
        select(Prompt)
        .where(Prompt.id == prompt_id, Prompt.user_id == user.id)
        .options(selectinload(Prompt.versions))
    )
    prompt = result.scalar_one_or_none()
    
    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found"
        )
    
    # Update fields
    if data.name is not None:
        prompt.name = data.name
    if data.description is not None:
        prompt.description = data.description
    
    await db.commit()
    await db.refresh(prompt)
    
    return prompt


@router.delete("/{prompt_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_prompt(
    prompt_id: int,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Delete a prompt and all its versions."""
    result = await db.execute(
        select(Prompt)
        .where(Prompt.id == prompt_id, Prompt.user_id == user.id)
    )
    prompt = result.scalar_one_or_none()
    
    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found"
        )
    
    await db.delete(prompt)
    await db.commit()


# ====== Versions Endpoints ======

@router.get("/{prompt_id}/versions", response_model=List[PromptVersionResponse])
async def list_versions(
    prompt_id: int,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """List all versions for a prompt."""
    # Verify prompt ownership
    result = await db.execute(
        select(Prompt)
        .where(Prompt.id == prompt_id, Prompt.user_id == user.id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found"
        )
    
    result = await db.execute(
        select(PromptVersion)
        .where(PromptVersion.prompt_id == prompt_id)
        .order_by(PromptVersion.created_at.desc())
    )
    versions = result.scalars().all()
    
    return versions


@router.post("/{prompt_id}/versions", response_model=PromptVersionResponse, status_code=status.HTTP_201_CREATED)
async def create_version(
    prompt_id: int,
    data: PromptVersionCreate,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Create a new version for a prompt."""
    # Verify prompt ownership
    result = await db.execute(
        select(Prompt)
        .where(Prompt.id == prompt_id, Prompt.user_id == user.id)
    )
    prompt = result.scalar_one_or_none()
    
    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found"
        )
    
    # Check for duplicate version tag
    existing = await db.execute(
        select(PromptVersion)
        .where(
            PromptVersion.prompt_id == prompt_id,
            PromptVersion.version_tag == data.version_tag
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Version {data.version_tag} already exists"
        )
    
    # Create version
    version = PromptVersion(
        prompt_id=prompt_id,
        version_tag=data.version_tag,
        system_prompt=data.system_prompt,
        user_prompt=data.user_prompt,
        model=data.model,
        temperature=data.temperature,
        max_tokens=data.max_tokens,
        commit_message=data.commit_message,
        variables=data.variables
    )
    db.add(version)
    await db.commit()
    await db.refresh(version)
    
    # Log activity
    activity_service = ActivityService(db)
    await activity_service.log_version_created(user.id, prompt.name, version.version_tag, version.id)
    
    return version


@router.get("/{prompt_id}/versions/{version_id}", response_model=PromptVersionResponse)
async def get_version(
    prompt_id: int,
    version_id: int,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Get a specific version."""
    # Verify prompt ownership
    result = await db.execute(
        select(Prompt)
        .where(Prompt.id == prompt_id, Prompt.user_id == user.id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found"
        )
    
    result = await db.execute(
        select(PromptVersion)
        .where(PromptVersion.id == version_id, PromptVersion.prompt_id == prompt_id)
    )
    version = result.scalar_one_or_none()
    
    if not version:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Version not found"
        )
    
    return version
