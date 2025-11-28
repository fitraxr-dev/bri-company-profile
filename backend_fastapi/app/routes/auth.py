"""
Authentication routes.
Handles user registration, login, and profile retrieval.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import UserCreate, UserLogin, Token, UserResponse, TokenData
from app.auth import get_password_hash, verify_password, create_access_token, get_current_user
from app.database import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/signup", response_model=dict, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate):
    """
    Register a new user.
    
    - **fullName**: User's full name (min 3 characters)
    - **email**: Valid email address
    - **password**: Password (min 8 characters, must contain uppercase, lowercase, and digit)
    - **phoneNumber**: Phone number (10-15 digits)
    - **accountNumber**: Account number (10-16 digits)
    """
    db = get_database()
    
    # Check if email already exists
    existing_user = await db.users.find_one({"email": user_data.email.lower()})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email sudah terdaftar"
        )
    
    # Check if account number already exists
    existing_account = await db.users.find_one({"accountNumber": user_data.accountNumber})
    if existing_account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nomor rekening sudah terdaftar"
        )
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user document
    user_doc = {
        "fullName": user_data.fullName,
        "email": user_data.email.lower(),
        "password": hashed_password,
        "phoneNumber": user_data.phoneNumber,
        "accountNumber": user_data.accountNumber,
        "balance": 0.0,
        "role": "user",
        "isActive": True,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    }
    
    # Insert into database
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Generate JWT token
    token = create_access_token(
        data={"userId": user_id, "email": user_data.email.lower()}
    )
    
    # Return response
    return {
        "success": True,
        "message": "Registrasi berhasil",
        "data": {
            "token": token,
            "user": {
                "id": user_id,
                "fullName": user_data.fullName,
                "email": user_data.email.lower(),
                "phoneNumber": user_data.phoneNumber,
                "accountNumber": user_data.accountNumber,
                "balance": 0.0,
                "isActive": True,
                "role": "user",
            }
        }
    }


@router.post("/login", response_model=dict)
async def login(credentials: UserLogin):
    """
    Login user and generate JWT token.
    
    - **email**: User's email
    - **password**: User's password
    """
    db = get_database()
    
    # Find user by email
    user = await db.users.find_one({"email": credentials.email.lower()})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah"
        )
    
    # Check if account is active
    if not user.get("isActive", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Akun Anda tidak aktif. Hubungi administrator."
        )
    
    # Verify password
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah"
        )
    
    # Generate JWT token
    token = create_access_token(
        data={"userId": str(user["_id"]), "email": user["email"]}
    )
    
    # Return response (exclude password)
    return {
        "success": True,
        "message": "Login berhasil",
        "data": {
            "token": token,
            "user": {
                "id": str(user["_id"]),
                "fullName": user["fullName"],
                "email": user["email"],
                "phoneNumber": user["phoneNumber"],
                "accountNumber": user["accountNumber"],
                "balance": user.get("balance", 0.0),
                "isActive": user.get("isActive", True),
                "role": user.get("role", "user"),
            }
        }
    }


@router.get("/me", response_model=dict)
async def get_current_user_profile(current_user: TokenData = Depends(get_current_user)):
    """
    Get current user profile (requires authentication).
    
    Requires valid JWT token in Authorization header.
    """
    db = get_database()
    
    # Find user by ID
    user = await db.users.find_one({"_id": ObjectId(current_user.userId)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User tidak ditemukan"
        )
    
    # Return user data (exclude password)
    return {
        "success": True,
        "data": {
            "user": {
                "id": str(user["_id"]),
                "fullName": user["fullName"],
                "email": user["email"],
                "phoneNumber": user["phoneNumber"],
                "accountNumber": user["accountNumber"],
                "balance": user.get("balance", 0.0),
                "isActive": user.get("isActive", True),
                "role": user.get("role", "user"),
            }
        }
    }
