"""
Configuration settings for the FastAPI application.
Loads environment variables and provides application configuration.
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Server Configuration
    PORT: int = 5000
    HOST: str = "0.0.0.0"
    DEBUG: bool = True
    
    # MongoDB Configuration
    MONGODB_URI: str = "mongodb://localhost:27017/brimo_db"
    
    # JWT Configuration
    JWT_SECRET: str = "your-super-secret-jwt-key-change-this-in-production-2024"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRES_IN_DAYS: int = 7
    
    # CORS Configuration
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Convert CORS_ORIGINS string to list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
