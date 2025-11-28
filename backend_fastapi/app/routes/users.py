"""
User routes.
Handles user management operations.
"""
from fastapi import APIRouter, HTTPException, status, Query
from app.database import get_database
from bson import ObjectId
from typing import List

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/", response_model=dict)
async def get_users(limit: int = Query(20, ge=1, le=100)):
    """
    Get all users (excluding passwords).
    
    - **limit**: Maximum number of users to return (default: 20, max: 100)
    """
    db = get_database()
    
    # Find users (exclude password field)
    users = await db.users.find(
        {},
        {"password": 0}
    ).limit(limit).to_list(length=limit)
    
    # Convert ObjectId to string
    for user in users:
        user["id"] = str(user["_id"])
        del user["_id"]
    
    return {
        "success": True,
        "count": len(users),
        "data": users
    }


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_user(user_data: dict):
    """
    Create a new user.
    
    Note: For production, use the /api/auth/signup endpoint instead.
    This endpoint is for testing/admin purposes only.
    """
    db = get_database()
    
    # Insert user
    result = await db.users.insert_one(user_data)
    user_data["id"] = str(result.inserted_id)
    
    return {
        "success": True,
        "message": "User created successfully",
        "data": user_data
    }
