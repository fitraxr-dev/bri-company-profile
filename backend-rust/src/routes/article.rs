use actix_web::web;
use crate::controllers;

pub fn article_routes(cfg: &mut web::ServiceConfig) {
    cfg
        // Root article routes (without scope to avoid trailing slash issues)
        .route("/api/articles", web::get().to(controllers::get_all_articles))
        .route("/api/articles", web::post().to(controllers::create_article))
        .route("/api/articles/", web::get().to(controllers::get_all_articles))
        .route("/api/articles/", web::post().to(controllers::create_article))
        .route("/api/articles/slug/{slug}", web::get().to(controllers::get_article_by_slug))
        .route("/api/articles/category/{category}", web::get().to(controllers::get_articles_by_category))
        .route("/api/articles/{id}", web::get().to(controllers::get_article_by_id))
        .route("/api/articles/{id}", web::put().to(controllers::update_article))
        .route("/api/articles/{id}", web::delete().to(controllers::delete_article));
}
