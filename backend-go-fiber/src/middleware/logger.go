package middleware

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
)

// Logger middleware logs all requests
func Logger(c *fiber.Ctx) error {
	start := time.Now()

	// Process request
	err := c.Next()

	// Log request details
	duration := time.Since(start)
	log.Printf("[%s] %s %s - %d (%s)",
		c.Method(),
		c.Path(),
		c.IP(),
		c.Response().StatusCode(),
		duration,
	)

	return err
}
