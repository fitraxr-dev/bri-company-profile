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

type ArticleController struct{}

// GetAllArticles returns list of articles with optional filters
func (ac *ArticleController) GetAllArticles(c *fiber.Ctx) error {
	lang := c.Query("lang", "id")
	status := c.Query("status")
	category := c.Query("category")

	ctx := context.Background()
	articleCollection := database.GetCollection("articles")

	// Build filter
	filter := bson.M{}
	
	// Only filter by status if explicitly provided and not empty string
	if status != "" {
		filter["status"] = status
	}
	
	if category != "" {
		filter["category"] = category
	}

	// Find articles
	opts := options.Find().SetSort(bson.D{{Key: "publishedAt", Value: -1}})
	cursor, err := articleCollection.Find(ctx, filter, opts)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Error fetching articles",
			"error":   err.Error(),
		})
	}
	defer cursor.Close(ctx)

	var articles []models.Article
	if err := cursor.All(ctx, &articles); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Error parsing articles",
			"error":   err.Error(),
		})
	}

	// Transform articles to previews with requested language
	var previews []models.ArticlePreview
	includeStatus := status == "" // Include status if fetching all articles
	
	for _, article := range articles {
		if preview := article.GetPreview(lang, includeStatus); preview != nil {
			previews = append(previews, *preview)
		}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"count":   len(previews),
		"data":    previews,
	})
}

// GetArticleBySlug returns article detail by slug
func (ac *ArticleController) GetArticleBySlug(c *fiber.Ctx) error {
	slug := c.Params("slug")
	lang := c.Query("lang", "id")

	ctx := context.Background()
	articleCollection := database.GetCollection("articles")

	// Find article by slug and language
	filter := bson.M{
		"translations": bson.M{
			"$elemMatch": bson.M{
				"slug": slug,
				"lang": lang,
			},
		},
	}

	var article models.Article
	err := articleCollection.FindOne(ctx, filter).Decode(&article)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": "Article not found",
		})
	}

	// Get article detail for requested language
	detail := article.GetByLanguage(lang)
	if detail == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": "Article not found for this language",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"data":    detail,
	})
}

// GetArticleByID returns article by ID with all languages
func (ac *ArticleController) GetArticleByID(c *fiber.Ctx) error {
	id := c.Params("id")

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid article ID",
		})
	}

	ctx := context.Background()
	articleCollection := database.GetCollection("articles")

	var article models.Article
	err = articleCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&article)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": "Article not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"data":    article,
	})
}

// CreateArticle creates a new article
func (ac *ArticleController) CreateArticle(c *fiber.Ctx) error {
	var article models.Article
	if err := c.BodyParser(&article); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
			"error":   err.Error(),
		})
	}

	// Set timestamps
	article.ID = primitive.NewObjectID()
	article.CreatedAt = time.Now()
	article.UpdatedAt = time.Now()

	if article.PublishedAt.IsZero() {
		article.PublishedAt = time.Now()
	}

	ctx := context.Background()
	articleCollection := database.GetCollection("articles")

	_, err := articleCollection.InsertOne(ctx, article)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Error creating article",
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "Article created successfully",
		"data":    article,
	})
}

// UpdateArticle updates an existing article
func (ac *ArticleController) UpdateArticle(c *fiber.Ctx) error {
	id := c.Params("id")

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid article ID",
		})
	}

	var updateData models.Article
	if err := c.BodyParser(&updateData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
			"error":   err.Error(),
		})
	}

	// Update timestamp
	updateData.UpdatedAt = time.Now()

	ctx := context.Background()
	articleCollection := database.GetCollection("articles")

	// Update article
	update := bson.M{
		"$set": bson.M{
			"translations": updateData.Translations,
			"category":     updateData.Category,
			"author":       updateData.Author,
			"coverImage":   updateData.CoverImage,
			"status":       updateData.Status,
			"updatedAt":    updateData.UpdatedAt,
		},
	}

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	result := articleCollection.FindOneAndUpdate(ctx, bson.M{"_id": objID}, update, opts)

	var article models.Article
	if err := result.Decode(&article); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": "Article not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Article updated successfully",
		"data":    article,
	})
}

// DeleteArticle deletes an article
func (ac *ArticleController) DeleteArticle(c *fiber.Ctx) error {
	id := c.Params("id")

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid article ID",
		})
	}

	ctx := context.Background()
	articleCollection := database.GetCollection("articles")

	result, err := articleCollection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Error deleting article",
			"error":   err.Error(),
		})
	}

	if result.DeletedCount == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": "Article not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Article deleted successfully",
	})
}

// GetArticlesByCategory returns articles filtered by category
func (ac *ArticleController) GetArticlesByCategory(c *fiber.Ctx) error {
	category := c.Params("category")
	lang := c.Query("lang", "id")

	ctx := context.Background()
	articleCollection := database.GetCollection("articles")

	// Find published articles in category
	filter := bson.M{
		"category": category,
		"status":   "published",
	}

	opts := options.Find().SetSort(bson.D{{Key: "publishedAt", Value: -1}})
	cursor, err := articleCollection.Find(ctx, filter, opts)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Error fetching articles by category",
			"error":   err.Error(),
		})
	}
	defer cursor.Close(ctx)

	var articles []models.Article
	if err := cursor.All(ctx, &articles); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Error parsing articles",
			"error":   err.Error(),
		})
	}

	// Transform to previews
	var previews []models.ArticlePreview
	for _, article := range articles {
		if preview := article.GetPreview(lang, false); preview != nil {
			previews = append(previews, *preview)
		}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"count":   len(previews),
		"data":    previews,
	})
}
