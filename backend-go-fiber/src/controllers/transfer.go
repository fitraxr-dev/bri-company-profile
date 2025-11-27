package controllers

import (
	"context"
	"time"

	"backend-go-fiber/src/database"
	"backend-go-fiber/src/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type TransferController struct{}

// TransferRequest represents transfer request body
type TransferRequest struct {
	ToAccount   string  `json:"toAccount" validate:"required"`
	Amount      float64 `json:"amount" validate:"required,gt=0"`
	Description string  `json:"description"`
}

// TransferMoney handles money transfer between accounts
func (tc *TransferController) TransferMoney(c *fiber.Ctx) error {
	var req TransferRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
			"error":   err.Error(),
		})
	}

	// Validate amount
	if req.Amount <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Data transfer tidak valid",
		})
	}

	// Get sender ID from context
	senderID := c.Locals("userId").(string)
	objID, _ := primitive.ObjectIDFromHex(senderID)

	ctx := context.Background()
	userCollection := database.GetCollection("users")
	transactionCollection := database.GetCollection("transactions")

	// Find sender
	var sender models.User
	err := userCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&sender)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": "Pengirim tidak ditemukan",
		})
	}

	// Find recipient by account number
	var recipient models.User
	err = userCollection.FindOne(ctx, bson.M{"accountNumber": req.ToAccount}).Decode(&recipient)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": "Rekening tujuan tidak ditemukan",
		})
	}

	// Check if transferring to self
	if recipient.AccountNumber == sender.AccountNumber {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Tidak bisa transfer ke rekening sendiri",
		})
	}

	// Check sufficient balance
	if sender.Balance < req.Amount {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Saldo tidak mencukupi",
		})
	}

	// Atomic update: debit sender (with balance check)
	updateResult := userCollection.FindOneAndUpdate(
		ctx,
		bson.M{
			"_id":     sender.ID,
			"balance": bson.M{"$gte": req.Amount},
		},
		bson.M{
			"$inc": bson.M{"balance": -req.Amount},
			"$set": bson.M{"updatedAt": time.Now()},
		},
		options.FindOneAndUpdate().SetReturnDocument(options.After),
	)

	var updatedSender models.User
	if err := updateResult.Decode(&updatedSender); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Saldo tidak mencukupi atau perubahan saldo gagal",
		})
	}

	// Atomic update: credit recipient
	_, err = userCollection.UpdateOne(
		ctx,
		bson.M{"_id": recipient.ID},
		bson.M{
			"$inc": bson.M{"balance": req.Amount},
			"$set": bson.M{"updatedAt": time.Now()},
		},
	)
	if err != nil {
		// Rollback sender balance if recipient update fails
		userCollection.UpdateOne(
			ctx,
			bson.M{"_id": sender.ID},
			bson.M{
				"$inc": bson.M{"balance": req.Amount},
				"$set": bson.M{"updatedAt": time.Now()},
			},
		)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Transfer gagal, saldo dikembalikan",
		})
	}

	// Create transaction record
	transaction := models.Transaction{
		ID:          primitive.NewObjectID(),
		FromAccount: sender.AccountNumber,
		ToAccount:   recipient.AccountNumber,
		Amount:      req.Amount,
		Description: req.Description,
		Status:      "success",
		InitiatedBy: sender.ID,
		Date:        time.Now(),
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	_, err = transactionCollection.InsertOne(ctx, transaction)
	if err != nil {
		// Transaction record failed but transfer succeeded
		// Log the error but don't fail the request
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Transfer berhasil",
		"data": fiber.Map{
			"transaction": transaction,
		},
	})
}

// GetTransactions returns transaction history for current user
func (tc *TransferController) GetTransactions(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userId").(string)
	objID, _ := primitive.ObjectIDFromHex(userID)

	ctx := context.Background()
	userCollection := database.GetCollection("users")
	transactionCollection := database.GetCollection("transactions")

	// Find user
	var user models.User
	err := userCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": "User tidak ditemukan",
		})
	}

	// Get limit from query params
	limit := c.QueryInt("limit", 50)

	// Find transactions where user is sender or recipient
	filter := bson.M{
		"$or": []bson.M{
			{"fromAccount": user.AccountNumber},
			{"toAccount": user.AccountNumber},
		},
	}

	opts := options.Find().
		SetSort(bson.D{{Key: "date", Value: -1}}).
		SetLimit(int64(limit))

	cursor, err := transactionCollection.Find(ctx, filter, opts)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Gagal mengambil riwayat transaksi",
			"error":   err.Error(),
		})
	}
	defer cursor.Close(ctx)

	var transactions []models.Transaction
	if err := cursor.All(ctx, &transactions); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Error parsing transactions",
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"data": fiber.Map{
			"transactions": transactions,
		},
	})
}
