use mongodb::{Client, Database};
use crate::config::Config;

pub async fn connect_db(config: &Config) -> Result<Database, mongodb::error::Error> {
    let client = Client::with_uri_str(&config.mongodb_uri).await?;
    
    // Ping to verify connection
    client
        .database("admin")
        .run_command(mongodb::bson::doc! { "ping": 1 })
        .await?;
    
    println!("✅ MongoDB connected successfully");
    
    // Extract database name from URI or use default
    let db_name = extract_db_name(&config.mongodb_uri);
    Ok(client.database(&db_name))
}

fn extract_db_name(uri: &str) -> String {
    // Extract database name from MongoDB URI
    // Format: mongodb://.../{db_name}?...
    if let Some(start) = uri.rfind('/') {
        let after_slash = &uri[start + 1..];
        if let Some(end) = after_slash.find('?') {
            return after_slash[..end].to_string();
        } else {
            return after_slash.to_string();
        }
    }
    "brimo_db".to_string() // default
}
