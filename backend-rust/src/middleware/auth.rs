use actix_web::{dev::Payload, error::ErrorUnauthorized, Error, FromRequest, HttpRequest};
use futures::future::{ready, Ready};
use crate::error::AppError;

pub struct AuthUser {
    pub user_id: String,
    pub email: String,
}

impl FromRequest for AuthUser {
    type Error = Error;
    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        // Get JWT utils from app data
        let jwt_utils = match req.app_data::<actix_web::web::Data<crate::utils::JwtUtils>>() {
            Some(utils) => utils,
            None => {
                return ready(Err(ErrorUnauthorized(
                    "JWT configuration not found"
                )));
            }
        };
        
        // Get Authorization header
        let auth_header = match req.headers().get("authorization") {
            Some(header) => header,
            None => {
                return ready(Err(ErrorUnauthorized(
                    "Token tidak ditemukan. Silakan login terlebih dahulu."
                )));
            }
        };
        
        // Convert header to string
        let auth_str = match auth_header.to_str() {
            Ok(s) => s,
            Err(_) => {
                return ready(Err(ErrorUnauthorized(
                    "Invalid authorization header"
                )));
            }
        };
        
        // Check if it starts with "Bearer "
        if !auth_str.starts_with("Bearer ") {
            return ready(Err(ErrorUnauthorized(
                "Invalid authorization header format"
            )));
        }
        
        // Extract token
        let token = &auth_str[7..];
        
        // Verify token
        match jwt_utils.verify_token(token) {
            Ok(claims) => ready(Ok(AuthUser {
                user_id: claims.user_id,
                email: claims.email,
            })),
            Err(e) => {
                let error_msg = match e {
                    AppError::Unauthorized(msg) => msg,
                    _ => "Token tidak valid".to_string(),
                };
                ready(Err(ErrorUnauthorized(error_msg)))
            }
        }
    }
}
