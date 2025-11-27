package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Transaction represents a money transfer transaction
type Transaction struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	FromAccount string             `bson:"fromAccount" json:"fromAccount" validate:"required"`
	ToAccount   string             `bson:"toAccount" json:"toAccount" validate:"required"`
	Amount      float64            `bson:"amount" json:"amount" validate:"required,gt=0"`
	Description string             `bson:"description" json:"description"`
	Status      string             `bson:"status" json:"status" validate:"required,oneof=pending success failed"`
	InitiatedBy primitive.ObjectID `bson:"initiatedBy" json:"initiatedBy"`
	Date        time.Time          `bson:"date" json:"date"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
}
