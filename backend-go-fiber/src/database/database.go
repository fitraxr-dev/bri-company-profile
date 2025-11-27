package database

import (
	"context"
	"log"
	"time"

	"backend-go-fiber/src/config"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Database
var Client *mongo.Client

// Connect establishes connection to MongoDB
func Connect() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(config.AppConfig.MongoURI)
	
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return err
	}

	// Ping the database
	err = client.Ping(ctx, nil)
	if err != nil {
		return err
	}

	Client = client
	DB = client.Database("brimo_db")
	
	log.Println("✅ MongoDB connected")
	return nil
}

// Disconnect closes the database connection
func Disconnect() {
	if Client != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		
		if err := Client.Disconnect(ctx); err != nil {
			log.Printf("Error disconnecting from MongoDB: %v", err)
		} else {
			log.Println("MongoDB connection closed")
		}
	}
}

// GetCollection returns a MongoDB collection
func GetCollection(name string) *mongo.Collection {
	return DB.Collection(name)
}
