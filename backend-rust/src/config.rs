use std::env;

#[derive(Clone, Debug)]
pub struct Config {
    pub port: u16,
    pub mongodb_uri: String,
    pub jwt_secret: String,
    pub jwt_expires_in: i64,
    pub bcrypt_cost: u32,
    pub cors_origins: Vec<String>,
}

impl Config {
    pub fn from_env() -> Self {
        dotenv::dotenv().ok();

        let port = env::var("PORT")
            .unwrap_or_else(|_| "5000".to_string())
            .parse()
            .expect("PORT must be a number");

        let mongodb_uri = env::var("MONGODB_URI")
            .unwrap_or_else(|_| "mongodb://localhost:27017/brimo_db".to_string());

        let jwt_secret = env::var("JWT_SECRET")
            .expect("JWT_SECRET must be set in environment");

        let jwt_expires_in = env::var("JWT_EXPIRES_IN")
            .unwrap_or_else(|_| "604800".to_string()) // 7 days in seconds
            .parse()
            .expect("JWT_EXPIRES_IN must be a number");

        let bcrypt_cost = env::var("BCRYPT_COST")
            .unwrap_or_else(|_| "10".to_string())
            .parse()
            .expect("BCRYPT_COST must be a number");

        let cors_origins = env::var("CORS_ORIGIN")
            .unwrap_or_else(|_| "http://localhost:3000,http://localhost:5173".to_string())
            .split(',')
            .map(|s| s.trim().to_string())
            .collect();

        Config {
            port,
            mongodb_uri,
            jwt_secret,
            jwt_expires_in,
            bcrypt_cost,
            cors_origins,
        }
    }
}
