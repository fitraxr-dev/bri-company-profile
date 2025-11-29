use chrono::{DateTime, Utc};
use mongodb::bson::{oid::ObjectId, DateTime as BsonDateTime};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Transaction {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    
    #[serde(rename = "fromAccount")]
    pub from_account: String,
    
    #[serde(rename = "toAccount")]
    pub to_account: String,
    
    pub amount: f64,
    
    pub description: String,
    
    pub status: String, // "pending", "success", "failed"
    
    #[serde(rename = "initiatedBy", skip_serializing_if = "Option::is_none")]
    pub initiated_by: Option<ObjectId>,
    
    pub date: BsonDateTime,
    
    #[serde(rename = "createdAt", skip_serializing_if = "Option::is_none")]
    pub created_at: Option<BsonDateTime>,
    
    #[serde(rename = "updatedAt", skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<BsonDateTime>,
}

#[derive(Debug, Deserialize)]
pub struct TransferRequest {
    #[serde(rename = "toAccount")]
    pub to_account: String,
    
    pub amount: f64,
    
    #[serde(default)]
    pub description: String,
}

#[derive(Debug, Serialize)]
pub struct TransactionResponse {
    pub _id: String,
    
    #[serde(rename = "fromAccount")]
    pub from_account: String,
    
    #[serde(rename = "toAccount")]
    pub to_account: String,
    
    pub amount: f64,
    
    pub description: String,
    
    pub status: String,
    
    pub date: DateTime<Utc>,
}

impl Transaction {
    pub fn to_response(&self) -> TransactionResponse {
        TransactionResponse {
            _id: self.id.map(|id| id.to_hex()).unwrap_or_default(),
            from_account: self.from_account.clone(),
            to_account: self.to_account.clone(),
            amount: self.amount,
            description: self.description.clone(),
            status: self.status.clone(),
            date: self.date.to_chrono(),
        }
    }
}
