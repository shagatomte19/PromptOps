"""
Supabase Auth service for validating JWT tokens.
Since we're using Supabase Auth on the frontend, the backend only needs to validate tokens.
"""

from functools import lru_cache
from typing import Optional
import httpx
from jose import jwt, JWTError
from pydantic import BaseModel

from app.config import get_settings


class SupabaseUser(BaseModel):
    """User data from Supabase JWT."""
    id: str  # Supabase user UUID
    email: Optional[str] = None
    role: str = "authenticated"
    app_metadata: dict = {}
    user_metadata: dict = {}


class SupabaseAuthService:
    """
    Service for validating Supabase JWT tokens.
    The frontend handles login/register via Supabase Auth.
    Backend only validates the token and extracts user info.
    """
    
    def __init__(self, supabase_url: str, supabase_anon_key: str):
        self.supabase_url = supabase_url
        self.supabase_anon_key = supabase_anon_key
        self.jwt_secret = None  # Will be fetched from Supabase
        self._jwks_cache = None
    
    async def get_jwt_secret(self) -> str:
        """
        Get the JWT secret from Supabase.
        For Supabase, we can use the JWKS endpoint to verify tokens.
        Alternative: Use the anon key's JWT secret (base64 decode the anon key).
        
        For simplicity, we'll verify against Supabase's user endpoint.
        """
        return self.supabase_anon_key
    
    async def verify_token(self, token: str) -> Optional[SupabaseUser]:
        """
        Verify a Supabase JWT token and return user info.
        
        We'll call Supabase's /auth/v1/user endpoint to validate the token
        and get user information.
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.supabase_url}/auth/v1/user",
                    headers={
                        "Authorization": f"Bearer {token}",
                        "apikey": self.supabase_anon_key
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return SupabaseUser(
                        id=data.get("id"),
                        email=data.get("email"),
                        role=data.get("role", "authenticated"),
                        app_metadata=data.get("app_metadata", {}),
                        user_metadata=data.get("user_metadata", {})
                    )
                else:
                    return None
                    
        except Exception as e:
            print(f"Token verification error: {e}")
            return None
    
    def decode_token_locally(self, token: str) -> Optional[dict]:
        """
        Decode JWT token locally without verification.
        Useful for extracting claims when we trust the token source.
        """
        try:
            # Decode without verification (for debugging only)
            payload = jwt.get_unverified_claims(token)
            return payload
        except JWTError:
            return None


@lru_cache()
def get_auth_service() -> SupabaseAuthService:
    """Get cached auth service instance."""
    settings = get_settings()
    return SupabaseAuthService(
        supabase_url=settings.supabase_url,
        supabase_anon_key=settings.supabase_anon_key
    )
