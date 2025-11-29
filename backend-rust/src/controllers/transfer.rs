use actix_web::{web, HttpResponse};
use mongodb::{
    bson::{doc, oid::ObjectId, DateTime as BsonDateTime},
    Database,
};
use serde::{Deserialize, Serialize};
use chrono::Utc;

use crate::{
    error::{AppError, AppResult},
    middleware::AuthUser,
    models::{Transaction, TransactionResponse, TransferRequest, User},
};

#[derive(Serialize)]
struct TransferResponse {
    success: bool,
    message: String,
    data: TransferData,
}

#[derive(Serialize)]
struct TransferData {
    transaction: TransactionResponse,
}

#[derive(Serialize)]
struct TransactionsResponse {
    success: bool,
    data: TransactionsData,
}

#[derive(Serialize)]
struct TransactionsData {
    transactions: Vec<TransactionResponse>,
}

#[derive(Deserialize)]
pub struct QueryParams {
    #[serde(default = "default_limit")]
    pub limit: i64,
}

fn default_limit() -> i64 {
    50
}

/// POST /api/transfer
/// Transfer money between accounts (protected route)
pub async fn transfer_money(
    db: web::Data<Database>,
    auth_user: AuthUser,
    req: web::Json<TransferRequest>,
) -> AppResult<HttpResponse> {
    // Validate input
    if req.to_account.is_empty() || req.amount <= 0.0 {
        return Err(AppError::BadRequest("Data transfer tidak valid".to_string()));
    }
    
    let users_collection = db.collection::<User>("users");
    let transactions_collection = db.collection::<Transaction>("transactions");
    
    // Parse sender ID
    let sender_id = ObjectId::parse_str(&auth_user.user_id)
        .map_err(|_| AppError::BadRequest("Invalid user ID".to_string()))?;
    
    // Load sender
    let sender = users_collection
        .find_one(doc! { "_id": sender_id })
        .await?
        .ok_or_else(|| AppError::NotFound("Pengirim tidak ditemukan".to_string()))?;
    
    // Load recipient
    let recipient = users_collection
        .find_one(doc! { "accountNumber": &req.to_account })
        .await?
        .ok_or_else(|| AppError::NotFound("Rekening tujuan tidak ditemukan".to_string()))?;
    
    // Check if trying to transfer to own account
    if recipient.account_number == sender.account_number {
        return Err(AppError::BadRequest(
            "Tidak bisa transfer ke rekening sendiri".to_string()
        ));
    }
    
    // Check if sender has sufficient balance
    if sender.balance < req.amount {
        return Err(AppError::BadRequest("Saldo tidak mencukupi".to_string()));
    }
    
    // Atomic debit sender (with balance check to prevent negative balance)
    let update_result = users_collection
        .find_one_and_update(
            doc! {
                "_id": sender_id,
                "balance": { "$gte": req.amount }
            },
            doc! {
                "$inc": { "balance": -req.amount },
                "$set": { "updatedAt": BsonDateTime::from_chrono(Utc::now()) }
            },
        )
        .await?;
    
    if update_result.is_none() {
        return Err(AppError::BadRequest(
            "Saldo tidak mencukupi atau perubahan saldo gagal".to_string()
        ));
    }
    
    // Atomic credit recipient
    let recipient_id = recipient.id
        .ok_or_else(|| AppError::InternalError("Recipient ID not found".to_string()))?;
    
    users_collection
        .update_one(
            doc! { "_id": recipient_id },
            doc! {
                "$inc": { "balance": req.amount },
                "$set": { "updatedAt": BsonDateTime::from_chrono(Utc::now()) }
            },
        )
        .await?;
    
    // Create transaction record
    let transaction = Transaction {
        id: None,
        from_account: sender.account_number.clone(),
        to_account: recipient.account_number.clone(),
        amount: req.amount,
        description: req.description.clone(),
        status: "success".to_string(),
        initiated_by: Some(sender_id),
        date: BsonDateTime::now(),
        created_at: Some(BsonDateTime::now()),
        updated_at: Some(BsonDateTime::now()),
    };
    
    let insert_result = transactions_collection.insert_one(&transaction).await?;
    let transaction_id = insert_result.inserted_id.as_object_id()
        .ok_or_else(|| AppError::InternalError("Failed to get transaction ID".to_string()))?;
    
    let mut saved_transaction = transaction.clone();
    saved_transaction.id = Some(transaction_id);
    
    let response = TransferResponse {
        success: true,
        message: "Transfer berhasil".to_string(),
        data: TransferData {
            transaction: saved_transaction.to_response(),
        },
    };
    
    Ok(HttpResponse::Ok().json(response))
}

/// GET /api/transactions
/// Get transaction history for current user (protected route)
pub async fn get_transactions(
    db: web::Data<Database>,
    auth_user: AuthUser,
    query: web::Query<QueryParams>,
) -> AppResult<HttpResponse> {
    let users_collection = db.collection::<User>("users");
    let transactions_collection = db.collection::<Transaction>("transactions");
    
    // Parse user ID
    let user_id = ObjectId::parse_str(&auth_user.user_id)
        .map_err(|_| AppError::BadRequest("Invalid user ID".to_string()))?;
    
    // Get user's account number
    let user = users_collection
        .find_one(doc! { "_id": user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("User tidak ditemukan".to_string()))?;
    
    // Find all transactions involving this account
    let mut cursor = transactions_collection
        .find(
            doc! {
                "$or": [
                    { "fromAccount": &user.account_number },
                    { "toAccount": &user.account_number }
                ]
            },
        )
        .sort(doc! { "date": -1 })
        .limit(query.limit)
        .await?;
    
    let mut transactions = Vec::new();
    while cursor.advance().await? {
        let transaction = cursor.deserialize_current()?;
        transactions.push(transaction.to_response());
    }
    
    let response = TransactionsResponse {
        success: true,
        data: TransactionsData { transactions },
    };
    
    Ok(HttpResponse::Ok().json(response))
}
