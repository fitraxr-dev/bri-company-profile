"""
Article routes.
Handles CRUD operations for articles with multi-language support.
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.models.article import ArticleCreate, ArticleUpdate, ArticleResponse, ArticleListItem
from app.models.user import TokenData
from app.auth import get_current_user
from app.database import get_database
from bson import ObjectId
from datetime import datetime
from typing import Optional, List

router = APIRouter(prefix="/api/articles", tags=["Articles"], redirect_slashes=False)


@router.get("", response_model=dict)
async def get_all_articles(
    lang: str = Query("id"),
    status: Optional[str] = Query(None),
    category: Optional[str] = None
):
    """
    Get all articles with optional filtering.
    
    - **lang**: Language code (id, en, en-US, id-ID, etc. - will be normalized to id or en)
    - **status**: Filter by status (draft or published, or empty for all)
    - **category**: Filter by category
    """
    # Normalize language code (en-US -> en, id-ID -> id)
    lang = lang.lower().split('-')[0] if '-' in lang else lang.lower()
    if lang not in ['id', 'en']:
        lang = 'id'  # Default to Indonesian if invalid
    db = get_database()
    
    # Build filter
    filter_query = {}
    # Only filter by status if it's provided and not empty
    if status and status.strip() and status in ['draft', 'published']:
        filter_query["status"] = status
    if category:
        filter_query["category"] = category
    
    # Find articles
    articles = await db.articles.find(filter_query).sort("publishedAt", -1).to_list(length=None)
    
    # Transform to include only requested language
    transformed_articles = []
    for article in articles:
        # Find translation for requested language
        translation = next(
            (t for t in article.get("translations", []) if t["lang"] == lang),
            None
        )
        if not translation:
            continue
        
        transformed_articles.append({
            "_id": str(article["_id"]),
            "title": translation["title"],
            "slug": translation["slug"],
            "contentPreview": translation["content"][:2] if translation["content"] else [],
            "category": article["category"],
            "author": article["author"],
            "coverImage": article["coverImage"],
            "publishedAt": article["publishedAt"],
            "status": article["status"],
        })
    
    return {
        "success": True,
        "count": len(transformed_articles),
        "data": transformed_articles
    }


@router.get("/slug/{slug}", response_model=dict)
async def get_article_by_slug(
    slug: str,
    lang: str = Query("id")
):
    """
    Get article by slug.
    
    - **slug**: Article slug
    - **lang**: Language code (id, en, en-US, id-ID, etc. - will be normalized)
    """
    # Normalize language code
    lang = lang.lower().split('-')[0] if '-' in lang else lang.lower()
    if lang not in ['id', 'en']:
        lang = 'id'
    db = get_database()
    
    # Find article with matching slug and language
    article = await db.articles.find_one({
        "translations.slug": slug,
        "translations.lang": lang
    })
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Find the translation for requested language
    translation = next(
        (t for t in article.get("translations", []) if t["lang"] == lang),
        None
    )
    
    if not translation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Translation not found for this language"
        )
    
    # Build response
    article_data = {
        "_id": str(article["_id"]),
        "title": translation["title"],
        "slug": translation["slug"],
        "content": translation["content"],
        "category": article["category"],
        "author": article["author"],
        "coverImage": article["coverImage"],
        "publishedAt": article["publishedAt"],
        "status": article["status"],
    }
    
    return {
        "success": True,
        "data": article_data
    }


@router.get("/category/{category}", response_model=dict)
async def get_articles_by_category(
    category: str,
    lang: str = Query("id")
):
    """
    Get articles by category.
    
    - **category**: Article category
    - **lang**: Language code (id, en, en-US, id-ID, etc. - will be normalized)
    """
    # Normalize language code
    lang = lang.lower().split('-')[0] if '-' in lang else lang.lower()
    if lang not in ['id', 'en']:
        lang = 'id'
    db = get_database()
    
    # Find articles in category
    articles = await db.articles.find({
        "category": category,
        "status": "published"
    }).sort("publishedAt", -1).to_list(length=None)
    
    # Transform to include only requested language
    transformed_articles = []
    for article in articles:
        translation = next(
            (t for t in article.get("translations", []) if t["lang"] == lang),
            None
        )
        if not translation:
            continue
        
        transformed_articles.append({
            "_id": str(article["_id"]),
            "title": translation["title"],
            "slug": translation["slug"],
            "contentPreview": translation["content"][:2] if translation["content"] else [],
            "category": article["category"],
            "author": article["author"],
            "coverImage": article["coverImage"],
            "publishedAt": article["publishedAt"],
            "status": article["status"],
        })
    
    return {
        "success": True,
        "count": len(transformed_articles),
        "data": transformed_articles
    }


@router.get("/{id}", response_model=dict)
async def get_article_by_id(id: str):
    """
    Get article by ID (with all languages).
    
    - **id**: Article ID
    """
    db = get_database()
    
    # Validate ObjectId
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid article ID"
        )
    
    # Find article
    article = await db.articles.find_one({"_id": ObjectId(id)})
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Convert ObjectId to string
    article["_id"] = str(article["_id"])
    
    return {
        "success": True,
        "data": article
    }


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_article(
    article_data: ArticleCreate,
    current_user: TokenData = Depends(get_current_user)
):
    """
    Create a new article (requires authentication).
    
    - **translations**: List of translations (must include at least one)
    - **category**: Article category
    - **author**: Author name
    - **coverImage**: Cover image URL
    - **status**: Article status (draft or published)
    """
    db = get_database()
    
    # Create article document
    article_doc = article_data.model_dump()
    article_doc["publishedAt"] = datetime.utcnow()
    article_doc["createdAt"] = datetime.utcnow()
    article_doc["updatedAt"] = datetime.utcnow()
    
    # Insert into database
    result = await db.articles.insert_one(article_doc)
    article_doc["_id"] = str(result.inserted_id)
    
    return {
        "success": True,
        "message": "Article created successfully",
        "data": article_doc
    }


@router.put("/{id}", response_model=dict)
async def update_article(
    id: str,
    update_data: ArticleUpdate,
    current_user: TokenData = Depends(get_current_user)
):
    """
    Update an article (requires authentication).
    
    - **id**: Article ID
    - All fields are optional
    """
    db = get_database()
    
    # Validate ObjectId
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid article ID"
        )
    
    # Build update document (only include provided fields)
    update_doc = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if not update_doc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No update data provided"
        )
    
    update_doc["updatedAt"] = datetime.utcnow()
    
    # Update article
    result = await db.articles.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": update_doc},
        return_document=True
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Convert ObjectId to string
    result["_id"] = str(result["_id"])
    
    return {
        "success": True,
        "message": "Article updated successfully",
        "data": result
    }


@router.delete("/{id}", response_model=dict)
async def delete_article(
    id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """
    Delete an article (requires authentication).
    
    - **id**: Article ID
    """
    db = get_database()
    
    # Validate ObjectId
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid article ID"
        )
    
    # Delete article
    result = await db.articles.delete_one({"_id": ObjectId(id)})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    return {
        "success": True,
        "message": "Article deleted successfully"
    }
