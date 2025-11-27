package main

import (
	"log"
	"strings"
	"time"

	"backend-go-fiber/src/config"
	"backend-go-fiber/src/database"
	"backend-go-fiber/src/middleware"
	"backend-go-fiber/src/routes"
	"backend-go-fiber/src/services"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	// Load configuration
	config.LoadConfig()

	// Connect to MongoDB
	if err := database.Connect(); err != nil {
		log.Fatalf("❌ Failed to connect to MongoDB: %v", err)
	}
	defer database.Disconnect()

	// Create Fiber app
	app := fiber.New(fiber.Config{
		ErrorHandler: customErrorHandler,
		AppName:      "BRI Company Profile API",
	})

	// Middleware
	// Recover from panics
	app.Use(recover.New())

	// CORS configuration
	app.Use(cors.New(cors.Config{
		AllowOrigins: strings.Join(config.AppConfig.AllowedOrigins, ","),
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
		AllowCredentials: true,
	}))

	// Custom logger middleware
	app.Use(middleware.Logger)

	// Stock API endpoint
	app.Get("/api/stock/bbri", func(c *fiber.Ctx) error {
		stockService := &services.StockService{}
		stockData, err := stockService.GetStockData()
		if err != nil {
			log.Printf("Error fetching stock data: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"error":   "Gagal mengambil data saham",
				"message": err.Error(),
			})
		}

		return c.JSON(stockData)
	})

	// Setup routes
	routes.SetupRoutes(app)

	// Start server
	port := config.AppConfig.Port
	log.Printf("🚀 Server running on http://localhost:%s", port)
	
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("❌ Failed to start server: %v", err)
	}
}

// customErrorHandler handles errors globally
func customErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	message := "Internal Server Error"

	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
		message = e.Message
	}

	log.Printf("Error: %v", err)

	return c.Status(code).JSON(fiber.Map{
		"success": false,
		"message": message,
		"error":   err.Error(),
		"timestamp": time.Now().Format(time.RFC3339),
	})
}
