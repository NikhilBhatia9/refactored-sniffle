"""
Configuration management for Alpha Oracle backend.
Loads settings from environment variables with sensible defaults.
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # API Keys (optional - will use demo data if not provided)
    ALPHA_VANTAGE_API_KEY: Optional[str] = None
    FRED_API_KEY: Optional[str] = None
    
    # Application settings
    APP_NAME: str = "Alpha Oracle"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Data refresh settings
    DATA_REFRESH_INTERVAL: int = 3600  # 1 hour in seconds
    CACHE_TTL: int = 300  # 5 minutes in seconds
    
    # Database settings
    DB_URL: str = "sqlite+aiosqlite:///./alpha_oracle.db"
    
    # CORS settings
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
