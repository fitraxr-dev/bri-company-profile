package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// User represents a user in the system
type User struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	FullName      string             `bson:"fullName" json:"fullName" validate:"required,min=3"`
	Email         string             `bson:"email" json:"email" validate:"required,email"`
	Password      string             `bson:"password" json:"-"` // Never send password in JSON
	PhoneNumber   string             `bson:"phoneNumber" json:"phoneNumber" validate:"required,len=10|len=15"`
	AccountNumber string             `bson:"accountNumber" json:"accountNumber" validate:"required"`
	Balance       float64            `bson:"balance" json:"balance"`
	Role          string             `bson:"role" json:"role"` // "user" or "admin"
	IsActive      bool               `bson:"isActive" json:"isActive"`
	CreatedAt     time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt     time.Time          `bson:"updatedAt" json:"updatedAt"`
}

// UserResponse represents user data sent to client (without password)
type UserResponse struct {
	ID              string  `json:"id"`
	FullName        string  `json:"fullName"`
	Email           string  `json:"email"`
	PhoneNumber     string  `json:"phoneNumber"`
	AccountNumber   string  `json:"accountNumber"`
	Balance         float64 `json:"balance"`
	FormattedBalance string `json:"formattedBalance"`
	Role            string  `json:"role"`
	IsActive        bool    `json:"isActive"`
	CreatedAt       time.Time `json:"createdAt,omitempty"`
	UpdatedAt       time.Time `json:"updatedAt,omitempty"`
}

// ToResponse converts User to UserResponse
func (u *User) ToResponse() UserResponse {
	return UserResponse{
		ID:              u.ID.Hex(),
		FullName:        u.FullName,
		Email:           u.Email,
		PhoneNumber:     u.PhoneNumber,
		AccountNumber:   u.AccountNumber,
		Balance:         u.Balance,
		FormattedBalance: formatBalance(u.Balance),
		Role:            u.Role,
		IsActive:        u.IsActive,
		CreatedAt:       u.CreatedAt,
		UpdatedAt:       u.UpdatedAt,
	}
}

// formatBalance formats balance to Indonesian currency format
func formatBalance(balance float64) string {
	// Simple formatting - could be improved with proper locale formatting
	return "Rp " + formatNumber(balance)
}

func formatNumber(num float64) string {
	// Basic number formatting
	return string(rune(int(num)))
}
