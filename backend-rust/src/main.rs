use actix_web::{middleware::Logger, web, App, HttpResponse, HttpServer};
use actix_cors::Cors;

mod config;
mod db;
mod error;
mod models;
mod controllers;
mod middleware;
mod routes;
mod services;
mod utils;

use config::Config;
use utils::JwtUtils;
use services::StockService;
use serde::Serialize;

#[derive(Serialize)]
struct PingResponse {
    message: String,
    timestamp: String,
}

#[derive(Serialize)]
struct UsersResponse {
    users: Vec<models::User>,
}

#[derive(Serialize)]
struct UserResponse {
    user: models::User,
}

/// Health check endpoint
async fn ping() -> HttpResponse {
    HttpResponse::Ok().json(PingResponse {
        message: "pong".to_string(),
        timestamp: chrono::Utc::now().to_rfc3339(),
    })
}

/// Get stock data endpoint
async fn get_stock() -> Result<HttpResponse, error::AppError> {
    let stock_data = StockService::get_stock_data().await?;
    Ok(HttpResponse::Ok().json(stock_data))
}

/// Get all users endpoint
async fn get_users(db: web::Data<mongodb::Database>) -> Result<HttpResponse, error::AppError> {
    let users_collection = db.collection::<models::User>("users");
    
    let mut cursor = users_collection
        .find(
            mongodb::bson::doc! {},
        )
        .limit(20)
        .await?;
    
    let mut users = Vec::new();
    while cursor.advance().await? {
        let mut user = cursor.deserialize_current()?;
        user.password = "".to_string(); // Don't expose passwords
        users.push(user);
    }
    
    Ok(HttpResponse::Ok().json(users))
}

/// Create user endpoint
async fn create_user(
    db: web::Data<mongodb::Database>,
    user: web::Json<models::User>,
) -> Result<HttpResponse, error::AppError> {
    let users_collection = db.collection::<models::User>("users");
    
    let insert_result = users_collection.insert_one(user.into_inner()).await?;
    
    let user_id = insert_result.inserted_id.as_object_id()
        .ok_or_else(|| error::AppError::InternalError("Failed to get user ID".to_string()))?;
    
    let created_user = users_collection
        .find_one(mongodb::bson::doc! { "_id": user_id })
        .await?
        .ok_or_else(|| error::AppError::InternalError("Failed to fetch created user".to_string()))?;
    
    Ok(HttpResponse::Created().json(created_user))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize logger
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    
    // Load configuration
    let config = Config::from_env();
    let port = config.port;
    let cors_origins = config.cors_origins.clone();
    
    // Connect to database
    let db = db::connect_db(&config)
        .await
        .expect("Failed to connect to MongoDB");
    
    // Create JWT utils
    let jwt_utils = JwtUtils::new(
        config.jwt_secret.clone(),
        config.jwt_expires_in,
    );
    
    println!("🚀 Server running on http://localhost:{}", port);
    
    // Start HTTP server
    HttpServer::new(move || {
        // Configure CORS
        let mut cors = Cors::default()
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE", "OPTIONS"])
            .allowed_headers(vec![
                actix_web::http::header::CONTENT_TYPE,
                actix_web::http::header::AUTHORIZATION,
            ])
            .supports_credentials()
            .max_age(3600);
        
        // Add allowed origins
        for origin in &cors_origins {
            cors = cors.allowed_origin(origin);
        }
        
        App::new()
            .app_data(web::Data::new(db.clone()))
            .app_data(web::Data::new(jwt_utils.clone()))
            .app_data(web::Data::new(config.clone()))
            .wrap(Logger::default())
            .wrap(cors)
            // Health check
            .route("/api/ping", web::get().to(ping))
            // Stock endpoint
            .route("/api/stock/bbri", web::get().to(get_stock))
            // Users endpoints
            .route("/api/users", web::get().to(get_users))
            .route("/api/users", web::post().to(create_user))
            // Article routes - directly here to ensure proper ordering
            .route("/api/articles", web::get().to(controllers::get_all_articles))
            .route("/api/articles", web::post().to(controllers::create_article))
            .route("/api/articles/slug/{slug}", web::get().to(controllers::get_article_by_slug))
            .route("/api/articles/category/{category}", web::get().to(controllers::get_articles_by_category))
            .route("/api/articles/{id}", web::get().to(controllers::get_article_by_id))
            .route("/api/articles/{id}", web::put().to(controllers::update_article))
            .route("/api/articles/{id}", web::delete().to(controllers::delete_article))
            // Auth routes
            .configure(routes::auth_routes)
            // Transfer routes
            .configure(routes::transfer_routes)
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}
