# API Testing Guide for Articles

## Base URL

```
http://localhost:5000/api/articles
```

## Available Endpoints

### 1. Get All Articles

**GET** `/api/articles`

Query parameters:

- `lang` - Language code (id/en), default: id
- `status` - Article status (draft/published), default: published
- `category` - Filter by category

Example:

```bash
# Get all published Indonesian articles
curl http://localhost:5000/api/articles?lang=id

# Get all published English articles
curl http://localhost:5000/api/articles?lang=en

# Get tutorial articles
curl http://localhost:5000/api/articles?category=Tutorial&lang=id
```

Response:

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "title": "Cara Membuat Akun BRImo",
      "slug": "cara-membuat-akun-brimo",
      "contentPreview": [...],
      "category": "Tutorial",
      "author": "Tim BRI Digital",
      "coverImage": "https://...",
      "publishedAt": "2025-11-03T...",
      "status": "published"
    }
  ]
}
```

### 2. Get Article by Slug

**GET** `/api/articles/slug/:slug`

Query parameters:

- `lang` - Language code (id/en), default: id

Example:

```bash
# Get Indonesian version
curl http://localhost:5000/api/articles/slug/cara-membuat-akun-brimo?lang=id

# Get English version
curl http://localhost:5000/api/articles/slug/how-to-create-brimo-account?lang=en
```

Response:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "lang": "id",
    "title": "Cara Membuat Akun BRImo",
    "slug": "cara-membuat-akun-brimo",
    "content": [
      {
        "type": "text",
        "value": "BRImo adalah aplikasi mobile banking..."
      },
      {
        "type": "image",
        "value": "https://...",
        "caption": "Ilustrasi aplikasi..."
      }
    ],
    "category": "Tutorial",
    "author": "Tim BRI Digital",
    "coverImage": "https://...",
    "publishedAt": "2025-11-03T...",
    "status": "published"
  }
}
```

### 3. Get Article by ID

**GET** `/api/articles/:id`

Example:

```bash
curl http://localhost:5000/api/articles/69082d5f8e180e3d92b80172
```

Response includes all translations.

### 4. Get Articles by Category

**GET** `/api/articles/category/:category`

Query parameters:

- `lang` - Language code (id/en), default: id

Example:

```bash
curl http://localhost:5000/api/articles/category/Tutorial?lang=id
```

### 5. Create Article

**POST** `/api/articles`

Example:

```bash
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "translations": [
      {
        "lang": "id",
        "title": "Judul Artikel",
        "slug": "judul-artikel",
        "content": [
          {
            "type": "text",
            "value": "Konten artikel..."
          }
        ]
      }
    ],
    "category": "Tutorial",
    "author": "Admin",
    "coverImage": "https://example.com/image.jpg",
    "status": "published"
  }'
```

### 6. Update Article

**PUT** `/api/articles/:id`

Example:

```bash
curl -X PUT http://localhost:5000/api/articles/69082d5f8e180e3d92b80172 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "draft"
  }'
```

### 7. Delete Article

**DELETE** `/api/articles/:id`

Example:

```bash
curl -X DELETE http://localhost:5000/api/articles/69082d5f8e180e3d92b80172
```

## Testing in Browser

You can test GET requests directly in browser:

- http://localhost:5000/api/articles?lang=id
- http://localhost:5000/api/articles/slug/cara-membuat-akun-brimo?lang=id
- http://localhost:5000/api/articles/slug/how-to-create-brimo-account?lang=en

## Database Commands

```bash
# Run migration
npm run migrate:articles

# Run seeding
npm run seed:articles
```

## MongoDB Schema Structure

```javascript
{
  translations: [
    {
      lang: "id" | "en",
      title: String,
      slug: String,
      content: [
        {
          type: "text" | "image",
          value: String,
          caption?: String
        }
      ]
    }
  ],
  category: String,
  author: String,
  coverImage: String,
  publishedAt: Date,
  status: "draft" | "published"
}
```
