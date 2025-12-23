"""
API routers for PromptOps Cloud.
"""

from app.routers.prompts import router as prompts_router
from app.routers.environments import router as environments_router
from app.routers.experiments import router as experiments_router
from app.routers.deployments import router as deployments_router
from app.routers.inference import router as inference_router
from app.routers.metrics import router as metrics_router
from app.routers.activity import router as activity_router

__all__ = [
    "prompts_router",
    "environments_router",
    "experiments_router",
    "deployments_router",
    "inference_router",
    "metrics_router",
    "activity_router",
]
