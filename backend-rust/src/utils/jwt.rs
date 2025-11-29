use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use crate::error::{AppError, AppResult};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    #[serde(rename = "userId")]
    pub user_id: String,
    
    pub email: String,
    
    pub exp: i64, // Expiration time (as UTC timestamp)
}

#[derive(Clone)]
pub struct JwtUtils {
    secret: String,
    expires_in: i64,
}

impl JwtUtils {
    pub fn new(secret: String, expires_in: i64) -> Self {
        Self { secret, expires_in }
    }
    
    pub fn generate_token(&self, user_id: &str, email: &str) -> AppResult<String> {
        let expiration = Utc::now()
            .checked_add_signed(Duration::seconds(self.expires_in))
            .ok_or_else(|| AppError::InternalError("Failed to calculate expiration".to_string()))?
            .timestamp();
        
        let claims = Claims {
            user_id: user_id.to_string(),
            email: email.to_string(),
            exp: expiration,
        };
        
        let token = encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.secret.as_bytes()),
        )?;
        
        Ok(token)
    }
    
    pub fn verify_token(&self, token: &str) -> AppResult<Claims> {
        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.secret.as_bytes()),
            &Validation::default(),
        )?;
        
        Ok(token_data.claims)
    }
}
