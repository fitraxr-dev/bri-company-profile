use actix_web::{web, HttpResponse};
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};
use serde::{Deserialize, Serialize};

use crate::{
    error::{AppError, AppResult},
    models::{Article, ArticleDetail, ArticlePreview},
};

#[derive(Deserialize)]
pub struct ArticleQuery {
    #[serde(default = "default_lang")]
    pub lang: String,
    
    #[serde(default = "default_status")]
    pub status: String,
    
    pub category: Option<String>,
}

fn default_lang() -> String {
    "id".to_string()
}

fn default_status() -> String {
    "published".to_string()
}

#[derive(Serialize)]
struct ArticlesResponse {
    success: bool,
    count: usize,
    data: Vec<ArticlePreview>,
}

#[derive(Serialize)]
struct ArticleResponse {
    success: bool,
    data: ArticleDetail,
}

#[derive(Serialize)]
struct ArticleFullResponse {
    success: bool,
    data: Article,
}

#[derive(Serialize)]
struct MessageResponse {
    success: bool,
    message: String,
}

#[derive(Serialize)]
struct CreateArticleResponse {
    success: bool,
    message: String,
    data: Article,
}

#[derive(Serialize)]
struct UpdateArticleResponse {
    success: bool,
    message: String,
    data: Article,
}

/// GET /api/articles
/// Get all articles with optional filters
pub async fn get_all_articles(
    db: web::Data<Database>,
    query: web::Query<ArticleQuery>,
) -> AppResult<HttpResponse> {
    let articles_collection = db.collection::<Article>("articles");
    
    // Build filter
    let mut filter = doc! {};
    if !query.status.is_empty() {
        filter.insert("status", &query.status);
    }
    if let Some(ref category) = query.category {
        filter.insert("category", category);
    }
    
    // Find articles
    let mut cursor = articles_collection
        .find(
            filter,
        )
        .sort(doc! { "publishedAt": -1 })
        .await?;
    
    let mut articles = Vec::new();
    while cursor.advance().await? {
        let article = cursor.deserialize_current()?;
        if let Some(preview) = article.to_preview(&query.lang) {
            articles.push(preview);
        }
    }
    
    let response = ArticlesResponse {
        success: true,
        count: articles.len(),
        data: articles,
    };
    
    Ok(HttpResponse::Ok().json(response))
}

/// GET /api/articles/slug/{slug}
/// Get article by slug
pub async fn get_article_by_slug(
    db: web::Data<Database>,
    slug: web::Path<String>,
    query: web::Query<ArticleQuery>,
) -> AppResult<HttpResponse> {
    let articles_collection = db.collection::<Article>("articles");
    
    // Find article with matching slug and language
    let article = articles_collection
        .find_one(
            doc! {
                "translations.slug": slug.as_str(),
                "translations.lang": &query.lang
            },
        )
        .await?
        .ok_or_else(|| AppError::NotFound("Article not found".to_string()))?;
    
    let article_data = article
        .get_by_language(&query.lang)
        .ok_or_else(|| AppError::NotFound("Translation not found".to_string()))?;
    
    let response = ArticleResponse {
        success: true,
        data: article_data,
    };
    
    Ok(HttpResponse::Ok().json(response))
}

/// GET /api/articles/{id}
/// Get article by ID (with all languages)
pub async fn get_article_by_id(
    db: web::Data<Database>,
    id: web::Path<String>,
) -> AppResult<HttpResponse> {
    let articles_collection = db.collection::<Article>("articles");
    
    // Parse ObjectId
    let article_id = ObjectId::parse_str(id.as_str())
        .map_err(|_| AppError::BadRequest("Invalid article ID".to_string()))?;
    
    // Find article
    let saved_article = articles_collection
        .find_one(doc! { "_id": article_id })
        .await?
        .ok_or_else(|| AppError::NotFound("Article not found".to_string()))?;
    
    let response = ArticleFullResponse {
        success: true,
        data: saved_article,
    };
    
    Ok(HttpResponse::Ok().json(response))
}

/// POST /api/articles
/// Create new article
pub async fn create_article(
    db: web::Data<Database>,
    req: web::Json<Article>,
) -> AppResult<HttpResponse> {
    let articles_collection = db.collection::<Article>("articles");
    
    // Validate that at least one translation exists
    if req.translations.is_empty() {
        return Err(AppError::ValidationError(
            "At least one translation is required".to_string()
        ));
    }
    
    // Insert article
    let insert_result = articles_collection.insert_one(req.into_inner()).await?;
    
    // Fetch the created article
    let article_id = insert_result.inserted_id.as_object_id()
        .ok_or_else(|| AppError::InternalError("Failed to get article ID".to_string()))?;
    
    let article = articles_collection
        .find_one(doc! { "_id": article_id })
        .await?
        .ok_or_else(|| AppError::InternalError("Failed to fetch created article".to_string()))?;
    
    let response = CreateArticleResponse {
        success: true,
        message: "Article created successfully".to_string(),
        data: article,
    };
    
    Ok(HttpResponse::Created().json(response))
}

/// PUT /api/articles/{id}
/// Update article
pub async fn update_article(
    db: web::Data<Database>,
    id: web::Path<String>,
    req: web::Json<Article>,
) -> AppResult<HttpResponse> {
    let articles_collection = db.collection::<Article>("articles");
    
    // Parse ObjectId
    let article_id = ObjectId::parse_str(id.as_str())
        .map_err(|_| AppError::BadRequest("Invalid article ID".to_string()))?;
    
    // Validate that at least one translation exists
    if req.translations.is_empty() {
        return Err(AppError::ValidationError(
            "At least one translation is required".to_string()
        ));
    }
    
    // Update article
    let update_doc = mongodb::bson::to_document(&req.into_inner())
        .map_err(|e| AppError::InternalError(format!("Failed to serialize: {}", e)))?;
    
    let updated_article = articles_collection
        .find_one_and_update(
            doc! { "_id": article_id },
            doc! { "$set": update_doc },
        )
        .return_document(mongodb::options::ReturnDocument::After)
        .await?
        .ok_or_else(|| AppError::NotFound("Article not found".to_string()))?;
    
    let response = UpdateArticleResponse {
        success: true,
        message: "Article updated successfully".to_string(),
        data: updated_article,
    };
    
    Ok(HttpResponse::Ok().json(response))
}

/// DELETE /api/articles/{id}
/// Delete article
pub async fn delete_article(
    db: web::Data<Database>,
    id: web::Path<String>,
) -> AppResult<HttpResponse> {
    let articles_collection = db.collection::<Article>("articles");
    
    // Parse ObjectId
    let article_id = ObjectId::parse_str(id.as_str())
        .map_err(|_| AppError::BadRequest("Invalid article ID".to_string()))?;
    
    // Delete article
    let result = articles_collection
        .delete_one(doc! { "_id": article_id })
        .await?;
    
    if result.deleted_count == 0 {
        return Err(AppError::NotFound("Article not found".to_string()));
    }
    
    let response = MessageResponse {
        success: true,
        message: "Article deleted successfully".to_string(),
    };
    
    Ok(HttpResponse::Ok().json(response))
}

/// GET /api/articles/category/{category}
/// Get articles by category
pub async fn get_articles_by_category(
    db: web::Data<Database>,
    category: web::Path<String>,
    query: web::Query<ArticleQuery>,
) -> AppResult<HttpResponse> {
    let articles_collection = db.collection::<Article>("articles");
    
    // Find articles by category
    let mut cursor = articles_collection
        .find(
            doc! {
                "category": category.as_str(),
                "status": "published"
            },
        )
        .sort(doc! { "publishedAt": -1 })
        .await?;
    
    let mut articles = Vec::new();
    while cursor.advance().await? {
        let article = cursor.deserialize_current()?;
        if let Some(preview) = article.to_preview(&query.lang) {
            articles.push(preview);
        }
    }
    
    let response = ArticlesResponse {
        success: true,
        count: articles.len(),
        data: articles,
    };
    
    Ok(HttpResponse::Ok().json(response))
}
