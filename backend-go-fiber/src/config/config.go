package config

import (
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	MongoURI    string
	JWTSecret   string
	JWTExpires  string
	AllowedOrigins []string
	Environment string
}

var AppConfig *Config

// LoadConfig loads configuration from environment variables
func LoadConfig() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Parse CORS origins
	corsOrigin := getEnv("CORS_ORIGIN", "http://localhost:3000,http://localhost:5173")
	allowedOrigins := strings.Split(corsOrigin, ",")
	
	// Trim spaces from origins
	for i, origin := range allowedOrigins {
		allowedOrigins[i] = strings.TrimSpace(origin)
	}

	AppConfig = &Config{
		Port:           getEnv("PORT", "5000"),
		MongoURI:       getEnv("MONGODB_URI", "mongodb://localhost:27017/brimo_db"),
		JWTSecret:      getEnv("JWT_SECRET", "your-secret-key-change-in-production"),
		JWTExpires:     getEnv("JWT_EXPIRES_IN", "7d"),
		AllowedOrigins: allowedOrigins,
		Environment:    getEnv("NODE_ENV", "development"),
	}

	log.Println("✅ Configuration loaded")
}

// getEnv gets environment variable with fallback
func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
