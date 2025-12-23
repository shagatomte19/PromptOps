"""
Metrics API router - Monitoring and analytics.
"""

from typing import List, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from app.database import get_db
from app.deps import get_current_user
from app.services.supabase_auth import SupabaseUser
from app.models.metric import Metric
from app.schemas.metric import MetricResponse, MetricsOverview, MetricsTimeSeriesResponse, LatencyData, CostData


router = APIRouter(prefix="/metrics", tags=["Metrics"])


@router.get("/overview", response_model=MetricsOverview)
async def get_metrics_overview(
    days: int = Query(default=7, ge=1, le=90),
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Get aggregated metrics overview for the dashboard."""
    since = datetime.utcnow() - timedelta(days=days)
    
    # Get all metrics in time range
    result = await db.execute(
        select(Metric)
        .where(
            Metric.user_id == user.id,
            Metric.timestamp >= since
        )
    )
    metrics = result.scalars().all()
    
    if not metrics:
        return MetricsOverview()
    
    # Calculate aggregates
    total_requests = len(metrics)
    successful = sum(1 for m in metrics if m.success)
    success_rate = (successful / total_requests * 100) if total_requests > 0 else 0
    
    latencies = [m.latency_ms for m in metrics]
    avg_latency = sum(latencies) / len(latencies) if latencies else 0
    
    # Calculate percentiles
    sorted_latencies = sorted(latencies)
    p95_idx = int(len(sorted_latencies) * 0.95)
    p99_idx = int(len(sorted_latencies) * 0.99)
    p95_latency = sorted_latencies[p95_idx] if sorted_latencies else 0
    p99_latency = sorted_latencies[p99_idx] if sorted_latencies else 0
    
    total_tokens = sum(m.total_tokens for m in metrics)
    total_cost = sum(m.estimated_cost_cents for m in metrics)
    
    return MetricsOverview(
        total_requests=total_requests,
        success_rate=round(success_rate, 2),
        avg_latency_ms=round(avg_latency, 2),
        p95_latency_ms=round(p95_latency, 2),
        p99_latency_ms=round(p99_latency, 2),
        total_tokens=total_tokens,
        total_cost_cents=round(total_cost, 4)
    )


@router.get("/latency", response_model=List[LatencyData])
async def get_latency_data(
    days: int = Query(default=7, ge=1, le=90),
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Get latency time series data."""
    since = datetime.utcnow() - timedelta(days=days)
    
    # Get metrics grouped by hour
    result = await db.execute(
        select(Metric)
        .where(
            Metric.user_id == user.id,
            Metric.timestamp >= since
        )
        .order_by(Metric.timestamp)
    )
    metrics = result.scalars().all()
    
    # Group by hour
    hourly_data = {}
    for m in metrics:
        hour_key = m.timestamp.replace(minute=0, second=0, microsecond=0)
        if hour_key not in hourly_data:
            hourly_data[hour_key] = []
        hourly_data[hour_key].append(m.latency_ms)
    
    # Calculate per-hour stats
    response = []
    for timestamp, latencies in hourly_data.items():
        sorted_lat = sorted(latencies)
        p95_idx = int(len(sorted_lat) * 0.95)
        response.append(LatencyData(
            timestamp=timestamp,
            avg_latency_ms=round(sum(latencies) / len(latencies), 2),
            p95_latency_ms=sorted_lat[p95_idx] if sorted_lat else 0,
            request_count=len(latencies)
        ))
    
    return response


@router.get("/costs", response_model=List[CostData])
async def get_cost_data(
    days: int = Query(default=30, ge=1, le=90),
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Get cost breakdown by day."""
    since = datetime.utcnow() - timedelta(days=days)
    
    result = await db.execute(
        select(Metric)
        .where(
            Metric.user_id == user.id,
            Metric.timestamp >= since
        )
        .order_by(Metric.timestamp)
    )
    metrics = result.scalars().all()
    
    # Group by day
    daily_data = {}
    for m in metrics:
        day_key = m.timestamp.strftime("%Y-%m-%d")
        if day_key not in daily_data:
            daily_data[day_key] = {"cost": 0, "tokens": 0}
        daily_data[day_key]["cost"] += m.estimated_cost_cents
        daily_data[day_key]["tokens"] += m.total_tokens
    
    response = [
        CostData(date=day, cost_cents=round(data["cost"], 4), token_count=data["tokens"])
        for day, data in daily_data.items()
    ]
    
    return response


@router.get("/recent", response_model=List[MetricResponse])
async def get_recent_metrics(
    limit: int = Query(default=50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Get recent individual metrics."""
    result = await db.execute(
        select(Metric)
        .where(Metric.user_id == user.id)
        .order_by(Metric.timestamp.desc())
        .limit(limit)
    )
    metrics = result.scalars().all()
    
    return metrics


@router.get("/by-model")
async def get_metrics_by_model(
    days: int = Query(default=30, ge=1, le=90),
    db: AsyncSession = Depends(get_db),
    user: SupabaseUser = Depends(get_current_user)
):
    """Get metrics breakdown by model."""
    since = datetime.utcnow() - timedelta(days=days)
    
    result = await db.execute(
        select(Metric)
        .where(
            Metric.user_id == user.id,
            Metric.timestamp >= since
        )
    )
    metrics = result.scalars().all()
    
    # Group by model
    model_data = {}
    for m in metrics:
        if m.model not in model_data:
            model_data[m.model] = {
                "request_count": 0,
                "success_count": 0,
                "total_latency": 0,
                "total_tokens": 0,
                "total_cost": 0
            }
        model_data[m.model]["request_count"] += 1
        if m.success:
            model_data[m.model]["success_count"] += 1
        model_data[m.model]["total_latency"] += m.latency_ms
        model_data[m.model]["total_tokens"] += m.total_tokens
        model_data[m.model]["total_cost"] += m.estimated_cost_cents
    
    response = []
    for model, data in model_data.items():
        response.append({
            "model": model,
            "request_count": data["request_count"],
            "success_rate": round(data["success_count"] / data["request_count"] * 100, 2) if data["request_count"] > 0 else 0,
            "avg_latency_ms": round(data["total_latency"] / data["request_count"], 2) if data["request_count"] > 0 else 0,
            "total_tokens": data["total_tokens"],
            "total_cost_cents": round(data["total_cost"], 4)
        })
    
    return response
