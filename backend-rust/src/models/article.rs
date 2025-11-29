use chrono::{DateTime, Utc};
use mongodb::bson::{oid::ObjectId, DateTime as BsonDateTime};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ContentBlock {
    #[serde(rename = "type")]
    pub content_type: String, // "text" or "image"
    
    pub value: String,
    
    #[serde(skip_serializing_if = "Option::is_none")]
    pub caption: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Translation {
    pub lang: String, // "id" or "en"
    
    pub title: String,
    
    pub slug: String,
    
    pub content: Vec<ContentBlock>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Article {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    
    pub translations: Vec<Translation>,
    
    pub category: String,
    
    pub author: String,
    
    #[serde(rename = "coverImage")]
    pub cover_image: String,
    
    #[serde(rename = "publishedAt")]
    pub published_at: BsonDateTime,
    
    pub status: String, // "draft" or "published"
    
    #[serde(rename = "createdAt", skip_serializing_if = "Option::is_none")]
    pub created_at: Option<BsonDateTime>,
    
    #[serde(rename = "updatedAt", skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<BsonDateTime>,
}

#[derive(Debug, Serialize)]
pub struct ArticlePreview {
    pub _id: String,
    pub title: String,
    pub slug: String,
    
    #[serde(rename = "contentPreview")]
    pub content_preview: Vec<ContentBlock>,
    
    pub category: String,
    pub author: String,
    
    #[serde(rename = "coverImage")]
    pub cover_image: String,
    
    #[serde(rename = "publishedAt")]
    pub published_at: DateTime<Utc>,
    
    pub status: String,
}

#[derive(Debug, Serialize)]
pub struct ArticleDetail {
    pub _id: String,
    pub title: String,
    pub slug: String,
    pub content: Vec<ContentBlock>,
    pub category: String,
    pub author: String,
    
    #[serde(rename = "coverImage")]
    pub cover_image: String,
    
    #[serde(rename = "publishedAt")]
    pub published_at: DateTime<Utc>,
    
    pub status: String,
}

impl Article {
    pub fn get_by_language(&self, lang: &str) -> Option<ArticleDetail> {
        let translation = self.translations.iter().find(|t| t.lang == lang)?;
        
        Some(ArticleDetail {
            _id: self.id.map(|id| id.to_hex()).unwrap_or_default(),
            title: translation.title.clone(),
            slug: translation.slug.clone(),
            content: translation.content.clone(),
            category: self.category.clone(),
            author: self.author.clone(),
            cover_image: self.cover_image.clone(),
            published_at: self.published_at.to_chrono(),
            status: self.status.clone(),
        })
    }
    
    pub fn to_preview(&self, lang: &str) -> Option<ArticlePreview> {
        let translation = self.translations.iter().find(|t| t.lang == lang)?;
        
        let preview: Vec<ContentBlock> = translation.content.iter().take(2).cloned().collect();
        
        Some(ArticlePreview {
            _id: self.id.map(|id| id.to_hex()).unwrap_or_default(),
            title: translation.title.clone(),
            slug: translation.slug.clone(),
            content_preview: preview,
            category: self.category.clone(),
            author: self.author.clone(),
            cover_image: self.cover_image.clone(),
            published_at: self.published_at.to_chrono(),
            status: self.status.clone(),
        })
    }
}
