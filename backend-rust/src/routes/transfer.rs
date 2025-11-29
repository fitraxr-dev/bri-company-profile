use actix_web::web;
use crate::controllers;

pub fn transfer_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .route("/transfer", web::post().to(controllers::transfer_money))
            .route("/transactions", web::get().to(controllers::get_transactions))
    );
}
