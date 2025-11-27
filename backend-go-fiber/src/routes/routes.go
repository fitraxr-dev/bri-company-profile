package routes

import (
	"time"

	"backend-go-fiber/src/controllers"
	"backend-go-fiber/src/middleware"

	"github.com/gofiber/fiber/v2"
)

// SetupRoutes configures all application routes
func SetupRoutes(app *fiber.App) {
	// Controllers
	authController := &controllers.AuthController{}
	transferController := &controllers.TransferController{}
	articleController := &controllers.ArticleController{}

	// API group
	api := app.Group("/api")

	// Health check
	api.Get("/ping", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message":   "pong",
			"timestamp": time.Now().Format("2006-01-02T15:04:05.000Z"),
		})
	})

	// Auth routes (public)
	auth := api.Group("/auth")
	auth.Post("/signup", authController.Signup)
	auth.Post("/login", authController.Login)
	auth.Get("/me", middleware.AuthMiddleware, authController.GetCurrentUser)

	// Transfer routes (protected)
	api.Post("/transfer", middleware.AuthMiddleware, transferController.TransferMoney)
	api.Get("/transactions", middleware.AuthMiddleware, transferController.GetTransactions)

	// Article routes
	articles := api.Group("/articles")
	
	// Public routes
	articles.Get("/", articleController.GetAllArticles)
	articles.Get("/slug/:slug", articleController.GetArticleBySlug)
	articles.Get("/category/:category", articleController.GetArticlesByCategory)
	articles.Get("/:id", articleController.GetArticleByID)

	// Protected routes (admin)
	articles.Post("/", middleware.AuthMiddleware, articleController.CreateArticle)
	articles.Put("/:id", middleware.AuthMiddleware, articleController.UpdateArticle)
	articles.Delete("/:id", middleware.AuthMiddleware, articleController.DeleteArticle)
}
