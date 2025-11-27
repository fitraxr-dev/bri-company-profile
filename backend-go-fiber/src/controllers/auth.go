package controllers

import (
	"context"
	"log"
	"strings"
	"time"

	"backend-go-fiber/src/config"
	"backend-go-fiber/src/database"
	"backend-go-fiber/src/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type AuthController struct{}

// JWTClaims represents the JWT claims
type JWTClaims struct {
	UserID string `json:"userId"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

// SignupRequest represents signup request body
type SignupRequest struct {
	FullName      string `json:"fullName" validate:"required,min=3"`
	Email         string `json:"email" validate:"required,email"`
	Password      string `json:"password" validate:"required,min=8"`
	PhoneNumber   string `json:"phoneNumber" validate:"required"`
	AccountNumber string `json:"accountNumber" validate:"required"`
}

// LoginRequest represents login request body
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

// Signup handles user registration
func (ac *AuthController) Signup(c *fiber.Ctx) error {
	var req SignupRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
			"error":   err.Error(),
		})
	}

	// Validate password requirements
	if len(req.Password) < 8 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Password minimal 8 karakter",
		})
	}

	ctx := context.Background()
	userCollection := database.GetCollection("users")

	// Check if email already exists
	email := strings.ToLower(req.Email)
	var existingUser models.User
	err := userCollection.FindOne(ctx, bson.M{"email": email}).Decode(&existingUser)
	if err == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Email sudah terdaftar",
		})
	}

	// Check if account number already exists
	err = userCollection.FindOne(ctx, bson.M{"accountNumber": req.AccountNumber}).Decode(&existingUser)
	if err == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Nomor rekening sudah terdaftar",
		})
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), 10)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Error hashing password",
			"error":   err.Error(),
		})
	}

	// Create new user
	newUser := models.User{
		ID:            primitive.NewObjectID(),
		FullName:      req.FullName,
		Email:         email,
		Password:      string(hashedPassword),
		PhoneNumber:   req.PhoneNumber,
		AccountNumber: req.AccountNumber,
		Balance:       0,
		Role:          "user",
		IsActive:      true,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	// Insert to database
	_, err = userCollection.InsertOne(ctx, newUser)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Error creating user",
			"error":   err.Error(),
		})
	}

	// Generate JWT token
	token, err := generateToken(newUser.ID.Hex(), newUser.Email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Error generating token",
			"error":   err.Error(),
		})
	}

	// Return success response
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "Registrasi berhasil",
		"data": fiber.Map{
			"token": token,
			"user":  newUser.ToResponse(),
		},
	})
}

// Login handles user authentication
func (ac *AuthController) Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
			"error":   err.Error(),
		})
	}

	ctx := context.Background()
	userCollection := database.GetCollection("users")

	// Find user by email
	email := strings.ToLower(req.Email)
	var user models.User
	err := userCollection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		// Log the error for debugging
		log.Printf("User not found for email %s: %v", email, err)
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Email atau password salah",
		})
	}
	
	// Debug log (remove in production)
	log.Printf("Found user: %s, checking password...", user.Email)

	// Check if account is active
	if !user.IsActive {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Akun Anda tidak aktif. Hubungi administrator.",
		})
	}

	// Verify password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Email atau password salah",
		})
	}

	// Generate JWT token
	token, err := generateToken(user.ID.Hex(), user.Email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Error generating token",
			"error":   err.Error(),
		})
	}

	// Return success response
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Login berhasil",
		"data": fiber.Map{
			"token": token,
			"user":  user.ToResponse(),
		},
	})
}

// GetCurrentUser returns current user profile
func (ac *AuthController) GetCurrentUser(c *fiber.Ctx) error {
	// Get user ID from context (set by auth middleware)
	userID := c.Locals("userId").(string)

	ctx := context.Background()
	userCollection := database.GetCollection("users")

	// Convert string ID to ObjectID
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid user ID",
		})
	}

	// Find user
	var user models.User
	err = userCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": "User tidak ditemukan",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"data": fiber.Map{
			"user": user.ToResponse(),
		},
	})
}

// generateToken generates JWT token for user
func generateToken(userID, email string) (string, error) {
	// Parse duration from config (e.g., "7d")
	expiresIn := 7 * 24 * time.Hour // Default 7 days

	claims := JWTClaims{
		UserID: userID,
		Email:  email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiresIn)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(config.AppConfig.JWTSecret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
