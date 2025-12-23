"""
FastAPI dependencies for authentication and database access.
"""

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.supabase_auth import SupabaseAuthService, SupabaseUser, get_auth_service


# HTTP Bearer token scheme
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: SupabaseAuthService = Depends(get_auth_service)
) -> SupabaseUser:
    """
    Dependency to get the current authenticated user from Supabase JWT.
    Raises 401 if token is invalid or expired.
    """
    token = credentials.credentials
    
    user = await auth_service.verify_token(token)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return user


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    auth_service: SupabaseAuthService = Depends(get_auth_service)
) -> Optional[SupabaseUser]:
    """
    Dependency to optionally get the current user.
    Returns None if no token provided (for public endpoints).
    """
    if not credentials:
        return None
    
    token = credentials.credentials
    return await auth_service.verify_token(token)


def require_user(user: SupabaseUser = Depends(get_current_user)) -> SupabaseUser:
    """Alias for get_current_user for explicit requirement."""
    return user
