"""
Routes package initialization.
"""
from app.routes.auth import router as auth_router
from app.routes.transfer import router as transfer_router
from app.routes.articles import router as articles_router
from app.routes.stock import router as stock_router
from app.routes.users import router as users_router

__all__ = [
    "auth_router",
    "transfer_router",
    "articles_router",
    "stock_router",
    "users_router",
]
