"""
Activity API router - Audit logs and system events.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.database import get_db
from app.deps import get_current_user
from app.services.supabase_auth import SupabaseUser
from app.models.activity_log import ActivityLog, ActivityLevel
from app.schemas.activity_log import ActivityLogResponse


router = APIRouter(prefix="/activity", tags=["Activity"])


@router.get("", response_model=List[ActivityLogResponse])
async def list_activity_logs(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    level: Optional[ActivityLevel] = None,
    action: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """
    List activity logs with optional filtering.
    """
    query = (
        select(ActivityLog)
        .where(ActivityLog.user_id == user.id)
        .order_by(ActivityLog.timestamp.desc())
    )
    
    if level:
        query = query.where(ActivityLog.level == level)
    
    if action:
        query = query.where(ActivityLog.action == action)
    
    if search:
        query = query.where(
            or_(
                ActivityLog.message.ilike(f"%{search}%"),
                ActivityLog.action.ilike(f"%{search}%")
            )
        )
    
    query = query.offset(offset).limit(limit)
    
    result = await db.execute(query)
    logs = result.scalars().all()
    
    return logs


@router.get("/actions")
async def get_action_types(
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """
    Get all unique action types for filtering.
    """
    result = await db.execute(
        select(ActivityLog.action)
        .where(ActivityLog.user_id == user.id)
        .distinct()
    )
    actions = result.scalars().all()
    
    return {"actions": actions}


@router.get("/recent", response_model=List[ActivityLogResponse])
async def get_recent_activity(
    limit: int = Query(default=10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """
    Get recent activity for the dashboard activity panel.
    """
    result = await db.execute(
        select(ActivityLog)
        .where(ActivityLog.user_id == user.id)
        .order_by(ActivityLog.timestamp.desc())
        .limit(limit)
    )
    logs = result.scalars().all()
    
    return logs
