"""
Metric schemas for monitoring API.
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class MetricResponse(BaseModel):
    """Schema for individual metric response."""
    id: int
    user_id: str
    deployment_id: Optional[int]
    prompt_id: Optional[int]
    model: str
    latency_ms: int
    input_tokens: int
    output_tokens: int
    total_tokens: int
    estimated_cost_cents: float
    success: bool
    error_message: Optional[str]
    timestamp: datetime
    
    class Config:
        from_attributes = True


class MetricsOverview(BaseModel):
    """Dashboard overview metrics."""
    total_requests: int = 0
    success_rate: float = 0.0
    avg_latency_ms: float = 0.0
    p95_latency_ms: float = 0.0
    p99_latency_ms: float = 0.0
    total_tokens: int = 0
    total_cost_cents: float = 0.0


class LatencyData(BaseModel):
    """Latency time series data point."""
    timestamp: datetime
    avg_latency_ms: float
    p95_latency_ms: float
    request_count: int


class CostData(BaseModel):
    """Cost breakdown data."""
    date: str
    cost_cents: float
    token_count: int


class MetricsTimeSeriesResponse(BaseModel):
    """Time series metrics response."""
    latency: List[LatencyData] = []
    costs: List[CostData] = []
    overview: MetricsOverview
