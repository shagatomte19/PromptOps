"""
Experiments API router - A/B testing functionality.
"""

from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.deps import get_current_user
from app.services.supabase_auth import SupabaseUser
from app.models.experiment import Experiment, ExperimentVariant, ExperimentStatus
from app.models.prompt import Prompt
from app.schemas.experiment import (
    ExperimentCreate, ExperimentUpdate, ExperimentResponse,
    ExperimentVariantCreate, ExperimentVariantResponse
)


router = APIRouter(prefix="/experiments", tags=["Experiments"])


@router.get("", response_model=List[ExperimentResponse])
async def list_experiments(
    prompt_id: int = None,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """List experiments, optionally filtered by prompt."""
    query = (
        select(Experiment)
        .join(Prompt)
        .where(Prompt.user_id == user.id)
        .options(selectinload(Experiment.variants))
        .order_by(Experiment.created_at.desc())
    )
    
    if prompt_id:
        query = query.where(Experiment.prompt_id == prompt_id)
    
    result = await db.execute(query)
    experiments = result.scalars().all()
    
    return experiments


@router.post("", response_model=ExperimentResponse, status_code=status.HTTP_201_CREATED)
async def create_experiment(
    data: ExperimentCreate,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Create a new A/B experiment with variants."""
    # Verify prompt ownership
    result = await db.execute(
        select(Prompt)
        .where(Prompt.id == data.prompt_id, Prompt.user_id == user.id)
    )
    prompt = result.scalar_one_or_none()
    
    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found"
        )
    
    # Calculate traffic allocation
    total_weight = sum(v.traffic_weight for v in data.variants)
    traffic_allocation = {
        v.name: round((v.traffic_weight / total_weight) * 100, 1)
        for v in data.variants
    }
    
    # Create experiment
    experiment = Experiment(
        prompt_id=data.prompt_id,
        name=data.name,
        description=data.description,
        status=ExperimentStatus.DRAFT,
        traffic_allocation=traffic_allocation
    )
    db.add(experiment)
    await db.flush()
    
    # Create variants
    for variant_data in data.variants:
        variant = ExperimentVariant(
            experiment_id=experiment.id,
            name=variant_data.name,
            system_prompt=variant_data.system_prompt,
            user_prompt=variant_data.user_prompt,
            model=variant_data.model,
            temperature=variant_data.temperature,
            traffic_weight=variant_data.traffic_weight
        )
        db.add(variant)
    
    await db.commit()
    
    # Reload with variants
    result = await db.execute(
        select(Experiment)
        .where(Experiment.id == experiment.id)
        .options(selectinload(Experiment.variants))
    )
    experiment = result.scalar_one()
    
    return experiment


@router.get("/{experiment_id}", response_model=ExperimentResponse)
async def get_experiment(
    experiment_id: int,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Get an experiment with its variants."""
    result = await db.execute(
        select(Experiment)
        .join(Prompt)
        .where(Experiment.id == experiment_id, Prompt.user_id == user.id)
        .options(selectinload(Experiment.variants))
    )
    experiment = result.scalar_one_or_none()
    
    if not experiment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experiment not found"
        )
    
    return experiment


@router.put("/{experiment_id}", response_model=ExperimentResponse)
async def update_experiment(
    experiment_id: int,
    data: ExperimentUpdate,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Update an experiment (name, description, or status)."""
    result = await db.execute(
        select(Experiment)
        .join(Prompt)
        .where(Experiment.id == experiment_id, Prompt.user_id == user.id)
        .options(selectinload(Experiment.variants))
    )
    experiment = result.scalar_one_or_none()
    
    if not experiment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experiment not found"
        )
    
    # Update fields
    if data.name is not None:
        experiment.name = data.name
    if data.description is not None:
        experiment.description = data.description
    if data.status is not None:
        # Handle status transitions
        if data.status == ExperimentStatus.RUNNING and experiment.status == ExperimentStatus.DRAFT:
            experiment.started_at = datetime.utcnow()
        elif data.status == ExperimentStatus.COMPLETED and experiment.status == ExperimentStatus.RUNNING:
            experiment.ended_at = datetime.utcnow()
        experiment.status = data.status
    
    await db.commit()
    await db.refresh(experiment)
    
    return experiment


@router.delete("/{experiment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_experiment(
    experiment_id: int,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Delete an experiment and its variants."""
    result = await db.execute(
        select(Experiment)
        .join(Prompt)
        .where(Experiment.id == experiment_id, Prompt.user_id == user.id)
    )
    experiment = result.scalar_one_or_none()
    
    if not experiment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experiment not found"
        )
    
    await db.delete(experiment)
    await db.commit()


@router.post("/{experiment_id}/start", response_model=ExperimentResponse)
async def start_experiment(
    experiment_id: int,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Start an experiment (transition from DRAFT to RUNNING)."""
    result = await db.execute(
        select(Experiment)
        .join(Prompt)
        .where(Experiment.id == experiment_id, Prompt.user_id == user.id)
        .options(selectinload(Experiment.variants))
    )
    experiment = result.scalar_one_or_none()
    
    if not experiment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experiment not found"
        )
    
    if experiment.status != ExperimentStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only start experiments in DRAFT status"
        )
    
    experiment.status = ExperimentStatus.RUNNING
    experiment.started_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(experiment)
    
    return experiment


@router.post("/{experiment_id}/stop", response_model=ExperimentResponse)
async def stop_experiment(
    experiment_id: int,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Stop a running experiment."""
    result = await db.execute(
        select(Experiment)
        .join(Prompt)
        .where(Experiment.id == experiment_id, Prompt.user_id == user.id)
        .options(selectinload(Experiment.variants))
    )
    experiment = result.scalar_one_or_none()
    
    if not experiment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experiment not found"
        )
    
    if experiment.status != ExperimentStatus.RUNNING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only stop experiments in RUNNING status"
        )
    
    experiment.status = ExperimentStatus.COMPLETED
    experiment.ended_at = datetime.utcnow()
    
    # Calculate results
    variants_data = []
    for variant in experiment.variants:
        success_rate = (variant.success_count / variant.request_count * 100) if variant.request_count > 0 else 0
        variants_data.append({
            "id": variant.id,
            "name": variant.name,
            "request_count": variant.request_count,
            "success_count": variant.success_count,
            "success_rate": round(success_rate, 2),
            "avg_latency_ms": round(variant.avg_latency_ms, 2),
            "avg_tokens": round(variant.avg_tokens, 2)
        })
    
    # Determine winner (highest success rate)
    if variants_data:
        winner = max(variants_data, key=lambda x: x["success_rate"])
        experiment.winner_variant_id = winner["id"]
    
    experiment.results = {"variants": variants_data}
    
    await db.commit()
    await db.refresh(experiment)
    
    return experiment
