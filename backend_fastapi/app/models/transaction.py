"""
Transaction model for MongoDB.
Defines the Transaction schema and database operations.
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId
from app.models.user import PyObjectId


class TransactionBase(BaseModel):
    """Base transaction schema."""
    fromAccount: str
    toAccount: str
    amount: float = Field(..., gt=0)
    description: str = ""
    status: str = Field(default="pending", pattern="^(pending|success|failed)$")


class TransactionCreate(BaseModel):
    """Schema for creating a new transaction."""
    toAccount: str
    amount: float = Field(..., gt=0)
    description: str = ""


class TransactionInDB(TransactionBase):
    """Transaction schema as stored in database."""
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    initiatedBy: Optional[PyObjectId] = None
    date: datetime = Field(default_factory=datetime.utcnow)
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class TransactionResponse(TransactionBase):
    """Transaction schema for API responses."""
    id: str = Field(alias="_id")
    initiatedBy: Optional[str] = None
    date: datetime
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
