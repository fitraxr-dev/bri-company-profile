package middleware

import (
	"strings"

	"backend-go-fiber/src/config"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// JWTClaims represents the JWT claims
type JWTClaims struct {
	UserID string `json:"userId"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

// AuthMiddleware validates JWT token
func AuthMiddleware(c *fiber.Ctx) error {
	// Get Authorization header
	authHeader := c.Get("Authorization")

	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Token tidak ditemukan. Silakan login terlebih dahulu.",
		})
	}

	// Extract token (format: "Bearer <token>")
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	// Parse and verify token
	token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.AppConfig.JWTSecret), nil
	})

	if err != nil {
		if err == jwt.ErrTokenExpired {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"success": false,
				"message": "Token expired. Silakan login kembali.",
			})
		}
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Token tidak valid.",
		})
	}

	if !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Token tidak valid.",
		})
	}

	// Extract claims
	claims, ok := token.Claims.(*JWTClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Invalid token claims.",
		})
	}

	// Store user data in context
	c.Locals("userId", claims.UserID)
	c.Locals("email", claims.Email)

	return c.Next()
}
