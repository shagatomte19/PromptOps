"""
Activity logging service for audit trail.
"""

from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.activity_log import ActivityLog, ActivityLevel


class ActivityService:
    """Service for logging user and system activities."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def log(
        self,
        user_id: str,
        action: str,
        message: str,
        level: ActivityLevel = ActivityLevel.INFO,
        source: str = "system",
        extra_data: Optional[dict] = None
    ) -> ActivityLog:
        """Create a new activity log entry."""
        log_entry = ActivityLog(
            user_id=user_id,
            action=action,
            message=message,
            level=level,
            source=source,
            extra_data=extra_data or {}
        )
        
        self.db.add(log_entry)
        await self.db.commit()
        await self.db.refresh(log_entry)
        
        return log_entry
    
    async def log_prompt_created(self, user_id: str, prompt_name: str, prompt_id: int):
        """Log prompt creation."""
        return await self.log(
            user_id=user_id,
            action="prompt.created",
            message=f"Created prompt '{prompt_name}'",
            level=ActivityLevel.SUCCESS,
            source="api",
            extra_data={"prompt_id": prompt_id, "prompt_name": prompt_name}
        )
    
    async def log_version_created(self, user_id: str, prompt_name: str, version_tag: str, version_id: int):
        """Log version creation."""
        return await self.log(
            user_id=user_id,
            action="version.created",
            message=f"Created version {version_tag} for '{prompt_name}'",
            level=ActivityLevel.SUCCESS,
            source="api",
            extra_data={"version_id": version_id, "version_tag": version_tag}
        )
    
    async def log_deployment(self, user_id: str, prompt_name: str, version_tag: str, environment: str, deployment_id: int):
        """Log deployment."""
        return await self.log(
            user_id=user_id,
            action="deployment.created",
            message=f"Deployed {prompt_name} {version_tag} to {environment}",
            level=ActivityLevel.SUCCESS,
            source="api",
            extra_data={"deployment_id": deployment_id, "environment": environment}
        )
    
    async def log_rollback(self, user_id: str, prompt_name: str, from_version: str, to_version: str, environment: str):
        """Log rollback."""
        return await self.log(
            user_id=user_id,
            action="deployment.rollback",
            message=f"Rolled back {prompt_name} from {from_version} to {to_version} in {environment}",
            level=ActivityLevel.WARNING,
            source="api",
            extra_data={"from_version": from_version, "to_version": to_version, "environment": environment}
        )
    
    async def log_inference(self, user_id: str, model: str, latency_ms: int, success: bool):
        """Log inference execution."""
        level = ActivityLevel.SUCCESS if success else ActivityLevel.ERROR
        message = f"Inference on {model} completed in {latency_ms}ms" if success else f"Inference on {model} failed"
        
        return await self.log(
            user_id=user_id,
            action="inference.run",
            message=message,
            level=level,
            source="api",
            extra_data={"model": model, "latency_ms": latency_ms, "success": success}
        )

