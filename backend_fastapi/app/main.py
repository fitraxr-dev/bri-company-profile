"""
FastAPI Application Entry Point.
BRImo Backend API - Digital Banking Solution by Bank BRI
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection
from app.routes import (
    auth_router,
    transfer_router,
    articles_router,
    stock_router,
    users_router,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    """
    # Startup
    logger.info("Starting up BRImo Backend API...")
    await connect_to_mongo()
    logger.info("Application startup complete")
    
    yield
    
    # Shutdown
    logger.info("Shutting down BRImo Backend API...")
    await close_mongo_connection()
    logger.info("Application shutdown complete")


# Create FastAPI application
app = FastAPI(
    title="BRImo Backend API",
    description="Digital Banking Solution by Bank BRI - FastAPI Implementation",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# Health check endpoint
@app.get("/api/ping")
async def ping():
    """Health check endpoint."""
    from datetime import datetime
    return {
        "message": "pong",
        "timestamp": datetime.utcnow().isoformat()
    }

# Include routers
app.include_router(auth_router)
app.include_router(transfer_router)
app.include_router(articles_router)
app.include_router(stock_router)
app.include_router(users_router)

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "BRImo Backend API",
        "version": "1.0.0",
        "description": "Digital Banking Solution by Bank BRI - FastAPI Implementation",
        "docs": "/docs",
        "health": "/api/ping"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
