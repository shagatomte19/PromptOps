"""
Environments API router - Manage deployment environments.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.deps import get_current_user
from app.services.supabase_auth import SupabaseUser
from app.models.environment import Environment
from app.schemas.environment import EnvironmentCreate, EnvironmentResponse


router = APIRouter(prefix="/environments", tags=["Environments"])


@router.get("", response_model=List[EnvironmentResponse])
async def list_environments(
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """List all environments for the current user."""
    result = await db.execute(
        select(Environment)
        .where(Environment.user_id == user.id)
        .order_by(Environment.created_at)
    )
    environments = result.scalars().all()
    
    # Create default environments if none exist
    if not environments:
        default_envs = [
            Environment(
                user_id=user.id,
                name="development",
                display_name="Development",
                description="Local development environment",
                is_protected=False,
                color="#22c55e"  # Green
            ),
            Environment(
                user_id=user.id,
                name="staging",
                display_name="Staging",
                description="Pre-production testing environment",
                is_protected=False,
                color="#eab308"  # Yellow
            ),
            Environment(
                user_id=user.id,
                name="production",
                display_name="Production",
                description="Live production environment",
                is_protected=True,
                color="#ef4444"  # Red
            ),
        ]
        
        for env in default_envs:
            db.add(env)
        
        await db.commit()
        
        # Re-fetch
        result = await db.execute(
            select(Environment)
            .where(Environment.user_id == user.id)
            .order_by(Environment.created_at)
        )
        environments = result.scalars().all()
    
    return environments


@router.post("", response_model=EnvironmentResponse, status_code=status.HTTP_201_CREATED)
async def create_environment(
    data: EnvironmentCreate,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Create a new environment."""
    # Check for duplicate name
    existing = await db.execute(
        select(Environment)
        .where(Environment.user_id == user.id, Environment.name == data.name)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Environment '{data.name}' already exists"
        )
    
    environment = Environment(
        user_id=user.id,
        name=data.name,
        display_name=data.display_name,
        description=data.description,
        is_protected=data.is_protected,
        color=data.color
    )
    db.add(environment)
    await db.commit()
    await db.refresh(environment)
    
    return environment


@router.get("/{env_id}", response_model=EnvironmentResponse)
async def get_environment(
    env_id: int,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Get an environment by ID."""
    result = await db.execute(
        select(Environment)
        .where(Environment.id == env_id, Environment.user_id == user.id)
    )
    environment = result.scalar_one_or_none()
    
    if not environment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Environment not found"
        )
    
    return environment


@router.delete("/{env_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_environment(
    env_id: int,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Delete an environment."""
    result = await db.execute(
        select(Environment)
        .where(Environment.id == env_id, Environment.user_id == user.id)
    )
    environment = result.scalar_one_or_none()
    
    if not environment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Environment not found"
        )
    
    await db.delete(environment)
    await db.commit()
