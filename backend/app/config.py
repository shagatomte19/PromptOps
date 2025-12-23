"""
Application configuration using Pydantic Settings.
Loads environment variables from .env file.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # App Configuration
    app_name: str = "PromptOps Cloud"
    app_env: str = "development"
    debug: bool = True
    secret_key: str = "change-this-in-production"
    
    # Supabase Configuration
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: Optional[str] = None
    
    # Database
    database_url: str
    
    # Gemini API
    gemini_api_key: str
    
    # CORS Origins (comma-separated)
    cors_origins: str = "http://localhost:3000,http://localhost:5173"
    
    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS origins into a list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
