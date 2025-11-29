use chrono::{DateTime, Utc};
use mongodb::bson::{oid::ObjectId, DateTime as BsonDateTime};
use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    
    #[serde(rename = "fullName")]
    pub full_name: String,
    
    pub email: String,
    
    pub password: String,
    
    #[serde(rename = "phoneNumber")]
    pub phone_number: String,
    
    #[serde(rename = "accountNumber")]
    pub account_number: String,
    
    pub balance: f64,
    
    pub role: String,
    
    #[serde(rename = "isActive")]
    pub is_active: bool,
    
    #[serde(rename = "createdAt", skip_serializing_if = "Option::is_none")]
    pub created_at: Option<BsonDateTime>,
    
    #[serde(rename = "updatedAt", skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<BsonDateTime>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct SignupRequest {
    #[validate(length(min = 1, message = "Nama lengkap wajib diisi"))]
    #[serde(rename = "fullName")]
    pub full_name: String,
    
    #[validate(email(message = "Format email tidak valid"))]
    pub email: String,
    
    #[validate(length(min = 8, message = "Password minimal 8 karakter"))]
    pub password: String,
    
    #[validate(regex(path = "*RE_PHONE", message = "Nomor telepon harus 10-15 digit angka"))]
    #[serde(rename = "phoneNumber")]
    pub phone_number: String,
    
    #[validate(length(min = 1, message = "Nomor rekening wajib diisi"))]
    #[serde(rename = "accountNumber")]
    pub account_number: String,
}

#[derive(Debug, Deserialize, Validate)]
pub struct LoginRequest {
    #[validate(email(message = "Format email tidak valid"))]
    pub email: String,
    
    #[validate(length(min = 1, message = "Password wajib diisi"))]
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct UserResponse {
    pub id: String,
    
    #[serde(rename = "fullName")]
    pub full_name: String,
    
    pub email: String,
    
    #[serde(rename = "phoneNumber")]
    pub phone_number: String,
    
    #[serde(rename = "accountNumber")]
    pub account_number: String,
    
    pub balance: f64,
    
    #[serde(rename = "formattedBalance")]
    pub formatted_balance: String,
    
    #[serde(rename = "isActive")]
    pub is_active: bool,
    
    pub role: String,
}

impl User {
    pub fn to_response(&self) -> UserResponse {
        UserResponse {
            id: self.id.map(|id| id.to_hex()).unwrap_or_default(),
            full_name: self.full_name.clone(),
            email: self.email.clone(),
            phone_number: self.phone_number.clone(),
            account_number: self.account_number.clone(),
            balance: self.balance,
            formatted_balance: format_currency(self.balance),
            is_active: self.is_active,
            role: self.role.clone(),
        }
    }
}

fn format_currency(amount: f64) -> String {
    format!("Rp {:.0}", amount)
        .as_bytes()
        .rchunks(3)
        .rev()
        .map(std::str::from_utf8)
        .collect::<Result<Vec<&str>, _>>()
        .unwrap()
        .join(".")
}

lazy_static::lazy_static! {
    static ref RE_PHONE: regex::Regex = regex::Regex::new(r"^[0-9]{10,15}$").unwrap();
}
