use actix_web::{web, HttpResponse};
use bcrypt::{hash, verify};
use mongodb::{bson::{doc, oid::ObjectId, DateTime as BsonDateTime}, Database};
use serde::Serialize;
use validator::Validate;
use chrono::Utc;

use crate::{
    error::{AppError, AppResult},
    models::{LoginRequest, SignupRequest, User, UserResponse},
    middleware::AuthUser,
    utils::JwtUtils,
    config::Config,
};

#[derive(Serialize)]
struct AuthResponse {
    success: bool,
    message: String,
    data: AuthData,
}

#[derive(Serialize)]
struct AuthData {
    token: String,
    user: UserResponse,
}

#[derive(Serialize)]
struct UserDataResponse {
    success: bool,
    data: UserResponse,
}

/// POST /api/auth/signup
/// Register user baru
pub async fn signup(
    db: web::Data<Database>,
    config: web::Data<Config>,
    jwt_utils: web::Data<JwtUtils>,
    req: web::Json<SignupRequest>,
) -> AppResult<HttpResponse> {
    // Validate request
    req.validate()
        .map_err(|e| AppError::ValidationError(format!("Validasi gagal: {}", e)))?;
    
    let users_collection = db.collection::<User>("users");
    
    // Check if email already exists
    let email_lower = req.email.to_lowercase();
    let existing_user = users_collection
        .find_one(doc! { "email": &email_lower })
        .await?;
    
    if existing_user.is_some() {
        return Err(AppError::BadRequest("Email sudah terdaftar".to_string()));
    }
    
    // Check if account number already exists
    let existing_account = users_collection
        .find_one(doc! { "accountNumber": &req.account_number })
        .await?;
    
    if existing_account.is_some() {
        return Err(AppError::BadRequest("Nomor rekening sudah terdaftar".to_string()));
    }
    
    // Hash password
    let hashed_password = hash(&req.password, config.bcrypt_cost)?;
    
    // Create new user
    let new_user = User {
        id: None,
        full_name: req.full_name.clone(),
        email: email_lower.clone(),
        password: hashed_password,
        phone_number: req.phone_number.clone(),
        account_number: req.account_number.clone(),
        balance: 0.0,
        role: "user".to_string(),
        is_active: true,
        created_at: Some(BsonDateTime::now()),
        updated_at: Some(BsonDateTime::now()),
    };
    
    // Insert to database
    let insert_result = users_collection.insert_one(&new_user).await?;
    let user_id = insert_result.inserted_id.as_object_id()
        .ok_or_else(|| AppError::InternalError("Failed to get user ID".to_string()))?;
    
    // Generate JWT token
    let token = jwt_utils.generate_token(&user_id.to_hex(), &email_lower)?;
    
    // Create response
    let mut user_copy = new_user.clone();
    user_copy.id = Some(user_id);
    
    let response = AuthResponse {
        success: true,
        message: "Registrasi berhasil".to_string(),
        data: AuthData {
            token,
            user: user_copy.to_response(),
        },
    };
    
    Ok(HttpResponse::Created().json(response))
}

/// POST /api/auth/login
/// Login user dan generate JWT token
pub async fn login(
    db: web::Data<Database>,
    jwt_utils: web::Data<JwtUtils>,
    req: web::Json<LoginRequest>,
) -> AppResult<HttpResponse> {
    // Validate request
    req.validate()
        .map_err(|e| AppError::ValidationError(format!("Validasi gagal: {}", e)))?;
    
    let users_collection = db.collection::<User>("users");
    
    // Find user by email
    let email_lower = req.email.to_lowercase();
    let user = users_collection
        .find_one(doc! { "email": &email_lower })
        .await?
        .ok_or_else(|| AppError::Unauthorized("Email atau password salah".to_string()))?;
    
    // Check if account is active
    if !user.is_active {
        return Err(AppError::Unauthorized(
            "Akun Anda tidak aktif. Hubungi administrator.".to_string()
        ));
    }
    
    // Verify password
    let is_valid = verify(&req.password, &user.password)?;
    if !is_valid {
        return Err(AppError::Unauthorized("Email atau password salah".to_string()));
    }
    
    // Generate JWT token
    let user_id = user.id
        .ok_or_else(|| AppError::InternalError("User ID not found".to_string()))?;
    let token = jwt_utils.generate_token(&user_id.to_hex(), &user.email)?;
    
    // Create response
    let response = AuthResponse {
        success: true,
        message: "Login berhasil".to_string(),
        data: AuthData {
            token,
            user: user.to_response(),
        },
    };
    
    Ok(HttpResponse::Ok().json(response))
}

/// GET /api/auth/me
/// Get current user profile (protected route)
pub async fn get_current_user(
    db: web::Data<Database>,
    auth_user: AuthUser,
) -> AppResult<HttpResponse> {
    let users_collection = db.collection::<User>("users");
    
    // Parse user ID
    let user_id = ObjectId::parse_str(&auth_user.user_id)
        .map_err(|_| AppError::BadRequest("Invalid user ID".to_string()))?;
    
    // Find user
    let user = users_collection
        .find_one(doc! { "_id": user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("User tidak ditemukan".to_string()))?;
    
    let response = UserDataResponse {
        success: true,
        data: user.to_response(),
    };
    
    Ok(HttpResponse::Ok().json(response))
}
