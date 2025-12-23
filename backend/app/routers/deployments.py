"""
Deployments API router - Manage prompt deployments to environments.
"""

from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.deps import get_current_user
from app.services.supabase_auth import SupabaseUser
from app.services.activity import ActivityService
from app.models.deployment import Deployment, DeploymentStatus
from app.models.prompt import Prompt, PromptVersion
from app.models.environment import Environment
from app.schemas.deployment import DeploymentCreate, DeploymentResponse, DeploymentRollbackRequest


router = APIRouter(prefix="/deployments", tags=["Deployments"])


@router.get("", response_model=List[DeploymentResponse])
async def list_deployments(
    environment_id: int = None,
    prompt_id: int = None,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """List deployments, optionally filtered by environment or prompt."""
    query = (
        select(Deployment)
        .join(PromptVersion)
        .join(Prompt)
        .join(Environment)
        .where(Deployment.user_id == user.id)
        .order_by(Deployment.created_at.desc())
    )
    
    if environment_id:
        query = query.where(Deployment.environment_id == environment_id)
    if prompt_id:
        query = query.where(Prompt.id == prompt_id)
    
    result = await db.execute(query)
    deployments = result.scalars().all()
    
    # Enrich with names
    response = []
    for dep in deployments:
        # Fetch related data
        version_result = await db.execute(
            select(PromptVersion)
            .options(selectinload(PromptVersion.prompt))
            .where(PromptVersion.id == dep.version_id)
        )
        version = version_result.scalar_one_or_none()
        
        env_result = await db.execute(
            select(Environment).where(Environment.id == dep.environment_id)
        )
        env = env_result.scalar_one_or_none()
        
        response.append(DeploymentResponse(
            id=dep.id,
            version_id=dep.version_id,
            environment_id=dep.environment_id,
            user_id=dep.user_id,
            status=dep.status,
            notes=dep.notes,
            rolled_back_from_id=dep.rolled_back_from_id,
            created_at=dep.created_at,
            deployed_at=dep.deployed_at,
            version_tag=version.version_tag if version else None,
            prompt_name=version.prompt.name if version and version.prompt else None,
            environment_name=env.name if env else None
        ))
    
    return response


@router.post("", response_model=DeploymentResponse, status_code=status.HTTP_201_CREATED)
async def create_deployment(
    data: DeploymentCreate,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Deploy a prompt version to an environment."""
    # Verify version ownership
    version_result = await db.execute(
        select(PromptVersion)
        .join(Prompt)
        .options(selectinload(PromptVersion.prompt))
        .where(PromptVersion.id == data.version_id, Prompt.user_id == user.id)
    )
    version = version_result.scalar_one_or_none()
    
    if not version:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Version not found"
        )
    
    # Verify environment ownership
    env_result = await db.execute(
        select(Environment)
        .where(Environment.id == data.environment_id, Environment.user_id == user.id)
    )
    environment = env_result.scalar_one_or_none()
    
    if not environment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Environment not found"
        )
    
    # Deactivate previous active deployment in this environment for this prompt
    prev_result = await db.execute(
        select(Deployment)
        .join(PromptVersion)
        .where(
            Deployment.environment_id == data.environment_id,
            PromptVersion.prompt_id == version.prompt_id,
            Deployment.status == DeploymentStatus.ACTIVE
        )
    )
    prev_deployment = prev_result.scalar_one_or_none()
    
    if prev_deployment:
        prev_deployment.status = DeploymentStatus.ROLLED_BACK
    
    # Create new deployment
    deployment = Deployment(
        version_id=data.version_id,
        environment_id=data.environment_id,
        user_id=user.id,
        status=DeploymentStatus.ACTIVE,
        notes=data.notes,
        deployed_at=datetime.utcnow()
    )
    db.add(deployment)
    await db.commit()
    await db.refresh(deployment)
    
    # Log activity
    activity_service = ActivityService(db)
    await activity_service.log_deployment(
        user.id,
        version.prompt.name,
        version.version_tag,
        environment.name,
        deployment.id
    )
    
    return DeploymentResponse(
        id=deployment.id,
        version_id=deployment.version_id,
        environment_id=deployment.environment_id,
        user_id=deployment.user_id,
        status=deployment.status,
        notes=deployment.notes,
        rolled_back_from_id=deployment.rolled_back_from_id,
        created_at=deployment.created_at,
        deployed_at=deployment.deployed_at,
        version_tag=version.version_tag,
        prompt_name=version.prompt.name,
        environment_name=environment.name
    )


@router.get("/{deployment_id}", response_model=DeploymentResponse)
async def get_deployment(
    deployment_id: int,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Get a deployment by ID."""
    result = await db.execute(
        select(Deployment)
        .where(Deployment.id == deployment_id, Deployment.user_id == user.id)
    )
    deployment = result.scalar_one_or_none()
    
    if not deployment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deployment not found"
        )
    
    # Fetch related data
    version_result = await db.execute(
        select(PromptVersion)
        .options(selectinload(PromptVersion.prompt))
        .where(PromptVersion.id == deployment.version_id)
    )
    version = version_result.scalar_one_or_none()
    
    env_result = await db.execute(
        select(Environment).where(Environment.id == deployment.environment_id)
    )
    env = env_result.scalar_one_or_none()
    
    return DeploymentResponse(
        id=deployment.id,
        version_id=deployment.version_id,
        environment_id=deployment.environment_id,
        user_id=deployment.user_id,
        status=deployment.status,
        notes=deployment.notes,
        rolled_back_from_id=deployment.rolled_back_from_id,
        created_at=deployment.created_at,
        deployed_at=deployment.deployed_at,
        version_tag=version.version_tag if version else None,
        prompt_name=version.prompt.name if version and version.prompt else None,
        environment_name=env.name if env else None
    )


@router.post("/{deployment_id}/rollback", response_model=DeploymentResponse)
async def rollback_deployment(
    deployment_id: int,
    data: DeploymentRollbackRequest = None,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Rollback to a previous deployment."""
    # Get the deployment to rollback to
    result = await db.execute(
        select(Deployment)
        .where(Deployment.id == deployment_id, Deployment.user_id == user.id)
    )
    target_deployment = result.scalar_one_or_none()
    
    if not target_deployment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deployment not found"
        )
    
    # Get version and environment info
    version_result = await db.execute(
        select(PromptVersion)
        .options(selectinload(PromptVersion.prompt))
        .where(PromptVersion.id == target_deployment.version_id)
    )
    version = version_result.scalar_one_or_none()
    
    env_result = await db.execute(
        select(Environment).where(Environment.id == target_deployment.environment_id)
    )
    environment = env_result.scalar_one_or_none()
    
    # Find current active deployment
    current_result = await db.execute(
        select(Deployment)
        .join(PromptVersion)
        .where(
            Deployment.environment_id == target_deployment.environment_id,
            PromptVersion.prompt_id == version.prompt_id,
            Deployment.status == DeploymentStatus.ACTIVE
        )
    )
    current_deployment = current_result.scalar_one_or_none()
    
    if current_deployment:
        current_deployment.status = DeploymentStatus.ROLLED_BACK
    
    # Create new deployment as rollback
    rollback = Deployment(
        version_id=target_deployment.version_id,
        environment_id=target_deployment.environment_id,
        user_id=user.id,
        status=DeploymentStatus.ACTIVE,
        notes=data.reason if data else "Rollback",
        rolled_back_from_id=current_deployment.id if current_deployment else None,
        deployed_at=datetime.utcnow()
    )
    db.add(rollback)
    await db.commit()
    await db.refresh(rollback)
    
    # Log activity
    if current_deployment:
        current_version = await db.execute(
            select(PromptVersion).where(PromptVersion.id == current_deployment.version_id)
        )
        cv = current_version.scalar_one_or_none()
        activity_service = ActivityService(db)
        await activity_service.log_rollback(
            user.id,
            version.prompt.name,
            cv.version_tag if cv else "unknown",
            version.version_tag,
            environment.name
        )
    
    return DeploymentResponse(
        id=rollback.id,
        version_id=rollback.version_id,
        environment_id=rollback.environment_id,
        user_id=rollback.user_id,
        status=rollback.status,
        notes=rollback.notes,
        rolled_back_from_id=rollback.rolled_back_from_id,
        created_at=rollback.created_at,
        deployed_at=rollback.deployed_at,
        version_tag=version.version_tag,
        prompt_name=version.prompt.name,
        environment_name=environment.name
    )


@router.get("/active/{environment_id}/{prompt_id}", response_model=DeploymentResponse)
async def get_active_deployment(
    environment_id: int,
    prompt_id: int,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Get the currently active deployment for a prompt in an environment."""
    result = await db.execute(
        select(Deployment)
        .join(PromptVersion)
        .join(Prompt)
        .where(
            Deployment.environment_id == environment_id,
            Prompt.id == prompt_id,
            Deployment.user_id == user.id,
            Deployment.status == DeploymentStatus.ACTIVE
        )
    )
    deployment = result.scalar_one_or_none()
    
    if not deployment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active deployment found"
        )
    
    # Fetch related data
    version_result = await db.execute(
        select(PromptVersion)
        .options(selectinload(PromptVersion.prompt))
        .where(PromptVersion.id == deployment.version_id)
    )
    version = version_result.scalar_one_or_none()
    
    env_result = await db.execute(
        select(Environment).where(Environment.id == deployment.environment_id)
    )
    env = env_result.scalar_one_or_none()
    
    return DeploymentResponse(
        id=deployment.id,
        version_id=deployment.version_id,
        environment_id=deployment.environment_id,
        user_id=deployment.user_id,
        status=deployment.status,
        notes=deployment.notes,
        rolled_back_from_id=deployment.rolled_back_from_id,
        created_at=deployment.created_at,
        deployed_at=deployment.deployed_at,
        version_tag=version.version_tag if version else None,
        prompt_name=version.prompt.name if version and version.prompt else None,
        environment_name=env.name if env else None
    )
