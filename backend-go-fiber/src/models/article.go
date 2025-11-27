package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ContentBlock represents a content block in an article
type ContentBlock struct {
	Type    string `bson:"type" json:"type" validate:"required,oneof=text image"`
	Value   string `bson:"value" json:"value" validate:"required"`
	Caption string `bson:"caption,omitempty" json:"caption,omitempty"`
}

// Translation represents an article translation
type Translation struct {
	Lang    string         `bson:"lang" json:"lang" validate:"required,oneof=id en"`
	Title   string         `bson:"title" json:"title" validate:"required"`
	Slug    string         `bson:"slug" json:"slug" validate:"required"`
	Content []ContentBlock `bson:"content" json:"content"`
}

// Article represents an article in the system
type Article struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Translations []Translation      `bson:"translations" json:"translations" validate:"required,min=1"`
	Category     string             `bson:"category" json:"category" validate:"required"`
	Author       string             `bson:"author" json:"author" validate:"required"`
	CoverImage   string             `bson:"coverImage" json:"coverImage" validate:"required"`
	PublishedAt  time.Time          `bson:"publishedAt" json:"publishedAt"`
	Status       string             `bson:"status" json:"status" validate:"required,oneof=draft published"`
	CreatedAt    time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt    time.Time          `bson:"updatedAt" json:"updatedAt"`
}

// ArticlePreview represents a preview of an article
type ArticlePreview struct {
	ID             primitive.ObjectID `json:"_id"`
	Title          string             `json:"title"`
	Slug           string             `json:"slug"`
	ContentPreview []ContentBlock     `json:"contentPreview"`
	Category       string             `json:"category"`
	Author         string             `json:"author"`
	CoverImage     string             `json:"coverImage"`
	PublishedAt    time.Time          `json:"publishedAt"`
	Status         string             `json:"status,omitempty"`
}

// ArticleDetail represents detailed article data
type ArticleDetail struct {
	ID          primitive.ObjectID `json:"_id"`
	Title       string             `json:"title"`
	Slug        string             `json:"slug"`
	Content     []ContentBlock     `json:"content"`
	Category    string             `json:"category"`
	Author      string             `json:"author"`
	CoverImage  string             `json:"coverImage"`
	PublishedAt time.Time          `json:"publishedAt"`
	Status      string             `json:"status"`
	CreatedAt   time.Time          `json:"createdAt"`
	UpdatedAt   time.Time          `json:"updatedAt"`
}

// GetByLanguage returns article detail for specific language
func (a *Article) GetByLanguage(lang string) *ArticleDetail {
	for _, t := range a.Translations {
		if t.Lang == lang {
			return &ArticleDetail{
				ID:          a.ID,
				Title:       t.Title,
				Slug:        t.Slug,
				Content:     t.Content,
				Category:    a.Category,
				Author:      a.Author,
				CoverImage:  a.CoverImage,
				PublishedAt: a.PublishedAt,
				Status:      a.Status,
				CreatedAt:   a.CreatedAt,
				UpdatedAt:   a.UpdatedAt,
			}
		}
	}
	return nil
}

// GetPreview returns article preview for specific language
func (a *Article) GetPreview(lang string, includeStatus bool) *ArticlePreview {
	for _, t := range a.Translations {
		if t.Lang == lang {
			// Get first 2 content blocks as preview
			preview := t.Content
			if len(preview) > 2 {
				preview = preview[:2]
			}

			result := &ArticlePreview{
				ID:             a.ID,
				Title:          t.Title,
				Slug:           t.Slug,
				ContentPreview: preview,
				Category:       a.Category,
				Author:         a.Author,
				CoverImage:     a.CoverImage,
				PublishedAt:    a.PublishedAt,
			}

			if includeStatus {
				result.Status = a.Status
			}

			return result
		}
	}
	return nil
}
