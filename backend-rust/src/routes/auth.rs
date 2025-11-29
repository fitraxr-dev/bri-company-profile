use actix_web::web;
use crate::controllers;

pub fn auth_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/auth")
            .route("/signup", web::post().to(controllers::signup))
            .route("/login", web::post().to(controllers::login))
            .route("/me", web::get().to(controllers::get_current_user))
    );
}
