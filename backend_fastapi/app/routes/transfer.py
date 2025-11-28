"""
Transfer and transaction routes.
Handles money transfers and transaction history.
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.models.transaction import TransactionCreate, TransactionResponse
from app.models.user import TokenData
from app.auth import get_current_user
from app.database import get_database
from bson import ObjectId
from datetime import datetime
from typing import List

router = APIRouter(prefix="/api", tags=["Transfers"])


@router.post("/transfer", response_model=dict)
async def transfer_money(
    transfer_data: TransactionCreate,
    current_user: TokenData = Depends(get_current_user)
):
    """
    Transfer money to another account.
    
    Requires authentication. Uses atomic operations for consistency.
    
    - **toAccount**: Recipient's account number
    - **amount**: Amount to transfer (must be positive)
    - **description**: Optional transfer description
    """
    db = get_database()
    
    # Validate input
    if not transfer_data.toAccount or transfer_data.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Data transfer tidak valid"
        )
    
    # Load sender
    sender = await db.users.find_one({"_id": ObjectId(current_user.userId)})
    if not sender:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pengirim tidak ditemukan"
        )
    
    # Load recipient
    recipient = await db.users.find_one({"accountNumber": transfer_data.toAccount})
    if not recipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rekening tujuan tidak ditemukan"
        )
    
    # Check if not transferring to self
    if recipient["accountNumber"] == sender["accountNumber"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tidak bisa transfer ke rekening sendiri"
        )
    
    # Check if sender has sufficient balance
    if sender.get("balance", 0) < transfer_data.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Saldo tidak mencukupi"
        )
    
    try:
        # Atomic debit sender (with balance check to prevent negative balance)
        sender_update = await db.users.find_one_and_update(
            {
                "_id": ObjectId(current_user.userId),
                "balance": {"$gte": transfer_data.amount}
            },
            {"$inc": {"balance": -transfer_data.amount}},
            return_document=True
        )
        
        if not sender_update:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Saldo tidak mencukupi atau perubahan saldo gagal"
            )
        
        # Atomic credit recipient
        await db.users.find_one_and_update(
            {"_id": recipient["_id"]},
            {"$inc": {"balance": transfer_data.amount}},
            return_document=True
        )
        
        # Create transaction record
        transaction_doc = {
            "fromAccount": sender["accountNumber"],
            "toAccount": recipient["accountNumber"],
            "amount": transfer_data.amount,
            "description": transfer_data.description or "",
            "status": "success",
            "initiatedBy": ObjectId(current_user.userId),
            "date": datetime.utcnow(),
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
        }
        
        result = await db.transactions.insert_one(transaction_doc)
        transaction_doc["_id"] = result.inserted_id
        
        return {
            "success": True,
            "message": "Transfer berhasil",
            "data": {
                "transaction": {
                    "id": str(transaction_doc["_id"]),
                    "fromAccount": transaction_doc["fromAccount"],
                    "toAccount": transaction_doc["toAccount"],
                    "amount": transaction_doc["amount"],
                    "description": transaction_doc["description"],
                    "status": transaction_doc["status"],
                    "date": transaction_doc["date"],
                }
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        # Best-effort failed transaction record
        try:
            failed_trx = {
                "fromAccount": sender.get("accountNumber", ""),
                "toAccount": transfer_data.toAccount,
                "amount": transfer_data.amount,
                "description": transfer_data.description or "",
                "status": "failed",
                "initiatedBy": ObjectId(current_user.userId),
                "date": datetime.utcnow(),
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow(),
            }
            await db.transactions.insert_one(failed_trx)
        except Exception:
            pass
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan saat transfer: {str(e)}"
        )


@router.get("/transactions", response_model=dict)
async def get_transactions(
    limit: int = Query(50, ge=1, le=100),
    current_user: TokenData = Depends(get_current_user)
):
    """
    Get transaction history for current user.
    
    Requires authentication. Returns transactions where user is sender or recipient.
    
    - **limit**: Maximum number of transactions to return (default: 50, max: 100)
    """
    db = get_database()
    
    # Find user to get account number
    user = await db.users.find_one(
        {"_id": ObjectId(current_user.userId)},
        {"accountNumber": 1}
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User tidak ditemukan"
        )
    
    # Find transactions where user is sender or recipient
    transactions = await db.transactions.find(
        {
            "$or": [
                {"fromAccount": user["accountNumber"]},
                {"toAccount": user["accountNumber"]}
            ]
        }
    ).sort("date", -1).limit(limit).to_list(length=limit)
    
    # Convert ObjectId to string
    for trx in transactions:
        trx["id"] = str(trx["_id"])
        del trx["_id"]
        if "initiatedBy" in trx:
            trx["initiatedBy"] = str(trx["initiatedBy"])
    
    return {
        "success": True,
        "data": {
            "transactions": transactions
        }
    }
