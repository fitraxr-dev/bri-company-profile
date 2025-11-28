"""
Article model for MongoDB.
Defines the Article schema with multi-language support.
"""
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Literal
from datetime import datetime
from bson import ObjectId
from app.models.user import PyObjectId


class ContentBlock(BaseModel):
    """Content block schema for article content."""
    type: Literal["text", "image"]
    value: str
    caption: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "type": "text",
                "value": "This is a paragraph of text.",
                "caption": None
            }
        }


class Translation(BaseModel):
    """Translation schema for multi-language support."""
    lang: Literal["id", "en"]
    title: str
    slug: str
    content: List[ContentBlock] = []

    class Config:
        json_schema_extra = {
            "example": {
                "lang": "id",
                "title": "Judul Artikel",
                "slug": "judul-artikel",
                "content": [
                    {
                        "type": "text",
                        "value": "Ini adalah paragraf pertama."
                    }
                ]
            }
        }


class ArticleBase(BaseModel):
    """Base article schema."""
    translations: List[Translation]
    category: str = "Tutorial"
    author: str
    coverImage: str
    status: Literal["draft", "published"] = "draft"

    @field_validator('translations')
    @classmethod
    def validate_translations(cls, v):
        """Validate that at least one translation exists."""
        if not v or len(v) == 0:
            raise ValueError('At least one translation is required')
        return v


class ArticleCreate(ArticleBase):
    """Schema for creating a new article."""
    pass


class ArticleUpdate(BaseModel):
    """Schema for updating an article."""
    translations: Optional[List[Translation]] = None
    category: Optional[str] = None
    author: Optional[str] = None
    coverImage: Optional[str] = None
    status: Optional[Literal["draft", "published"]] = None


class ArticleInDB(ArticleBase):
    """Article schema as stored in database."""
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    publishedAt: datetime = Field(default_factory=datetime.utcnow)
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class ArticleResponse(ArticleBase):
    """Article schema for API responses."""
    id: str = Field(alias="_id")
    publishedAt: datetime
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class ArticleListItem(BaseModel):
    """Simplified article schema for list views."""
    id: str = Field(alias="_id")
    title: str
    slug: str
    contentPreview: List[ContentBlock] = []
    category: str
    author: str
    coverImage: str
    publishedAt: datetime
    status: str

    class Config:
        populate_by_name = True
