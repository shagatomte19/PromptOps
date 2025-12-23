"""
PromptOps Cloud - FastAPI Backend Application

A production-grade API for managing LLM prompts, versions,
experiments, deployments, and monitoring.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.database import init_db
from app.routers import (
    prompts_router,
    environments_router,
    experiments_router,
    deployments_router,
    inference_router,
    metrics_router,
    activity_router
)


settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    print("🚀 Starting PromptOps Cloud API...")
    await init_db()
    print("✅ Database initialized")
    
    yield
    
    # Shutdown
    print("👋 Shutting down PromptOps Cloud API...")


# Create FastAPI application
app = FastAPI(
    title="PromptOps Cloud API",
    description="DevOps for AI Prompts & Agents",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)


# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)


# Exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled errors."""
    print(f"❌ Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc) if settings.debug else None}
    )


# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "app": settings.app_name,
        "env": settings.app_env
    }


# Mount routers with /api/v1 prefix
API_PREFIX = "/api/v1"

app.include_router(prompts_router, prefix=API_PREFIX)
app.include_router(environments_router, prefix=API_PREFIX)
app.include_router(experiments_router, prefix=API_PREFIX)
app.include_router(deployments_router, prefix=API_PREFIX)
app.include_router(inference_router, prefix=API_PREFIX)
app.include_router(metrics_router, prefix=API_PREFIX)
app.include_router(activity_router, prefix=API_PREFIX)


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "name": "PromptOps Cloud API",
        "version": "1.0.0",
        "docs": "/api/docs",
        "health": "/api/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
