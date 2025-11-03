# Articles Management System

Sistem manajemen artikel multi-bahasa untuk BRImo menggunakan MongoDB dan Mongoose.

## 📋 Fitur

- ✅ Multi-bahasa (Indonesia & English)
- ✅ Content blocks (text & image)
- ✅ Categories & authors
- ✅ Draft/Published status
- ✅ SEO-friendly slugs
- ✅ Cover images
- ✅ RESTful API endpoints
- ✅ Migration & seeding tools

## 🗂️ Struktur Database

### Article Schema

```javascript
{
  translations: [
    {
      lang: "id" | "en",        // Kode bahasa
      title: String,             // Judul artikel
      slug: String,              // URL-friendly slug
      content: [                 // Array content blocks
        {
          type: "text" | "image",
          value: String,         // Konten teks atau URL gambar
          caption: String        // Caption untuk gambar (opsional)
        }
      ]
    }
  ],
  category: String,              // Kategori artikel
  author: String,                // Nama penulis
  coverImage: String,            // URL cover image
  publishedAt: Date,             // Tanggal publikasi
  status: "draft" | "published", // Status artikel
  createdAt: Date,               // Auto-generated
  updatedAt: Date                // Auto-generated
}
```

## 🚀 Setup & Installation

### 1. Migration

Jalankan migration untuk membuat koleksi articles:

```bash
npm run migrate:articles
```

Output:

```
🔄 Running migration: createArticlesCollection...
✅ MongoDB Connected: localhost
✅ Collection "articles" created successfully
✅ Indexes created successfully
✅ Migration completed successfully
```

### 2. Seeding

Tambahkan artikel contoh "Cara Membuat Akun BRImo":

```bash
npm run seed:articles
```

Output:

```
🌱 Seeding articles...
✅ MongoDB Connected: localhost
✅ Article created successfully!
📝 Article ID: 69082d5f8e180e3d92b80172
📌 Indonesian slug: cara-membuat-akun-brimo
📌 English slug: how-to-create-brimo-account
🎉 Seeding completed!
```

## 📡 API Endpoints

Base URL: `http://localhost:5000/api/articles`

### GET /api/articles

Mendapatkan semua artikel

**Query Parameters:**

- `lang` - Kode bahasa (id/en), default: id
- `status` - Status artikel (draft/published), default: published
- `category` - Filter berdasarkan kategori

**Example:**

```bash
GET /api/articles?lang=id&status=published
```

### GET /api/articles/slug/:slug

Mendapatkan artikel berdasarkan slug

**Query Parameters:**

- `lang` - Kode bahasa (id/en), default: id

**Example:**

```bash
GET /api/articles/slug/cara-membuat-akun-brimo?lang=id
```

### GET /api/articles/:id

Mendapatkan artikel berdasarkan ID (semua bahasa)

### GET /api/articles/category/:category

Mendapatkan artikel berdasarkan kategori

**Query Parameters:**

- `lang` - Kode bahasa (id/en), default: id

### POST /api/articles

Membuat artikel baru

**Request Body:**

```json
{
  "translations": [
    {
      "lang": "id",
      "title": "Judul Artikel",
      "slug": "judul-artikel",
      "content": [
        {
          "type": "text",
          "value": "Konten artikel..."
        },
        {
          "type": "image",
          "value": "https://example.com/image.jpg",
          "caption": "Caption gambar"
        }
      ]
    }
  ],
  "category": "Tutorial",
  "author": "Admin",
  "coverImage": "https://example.com/cover.jpg",
  "status": "published"
}
```

### PUT /api/articles/:id

Update artikel

### DELETE /api/articles/:id

Hapus artikel

## 💡 Usage Examples

### Frontend Integration

```javascript
// Fetch all articles in Indonesian
const fetchArticles = async () => {
  const response = await fetch("http://localhost:5000/api/articles?lang=id");
  const data = await response.json();
  return data.data;
};

// Fetch specific article by slug
const fetchArticle = async (slug, lang = "id") => {
  const response = await fetch(
    `http://localhost:5000/api/articles/slug/${slug}?lang=${lang}`
  );
  const data = await response.json();
  return data.data;
};

// Render article content
const renderContent = (content) => {
  return content.map((block, index) => {
    if (block.type === "text") {
      return <div key={index}>{block.value}</div>;
    } else if (block.type === "image") {
      return (
        <figure key={index}>
          <img src={block.value} alt={block.caption || ""} />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    }
  });
};
```

## 📝 Article Seed Content

Artikel contoh yang telah di-seed:

**Judul (ID):** Cara Membuat Akun BRImo  
**Judul (EN):** How to Create a BRImo Account  
**Kategori:** Tutorial  
**Penulis:** Tim BRI Digital  
**Status:** Published

**Content includes:**

- ✅ Penjelasan tentang BRImo
- ✅ Keuntungan menggunakan BRImo
- ✅ 7 langkah membuat akun (dengan ilustrasi gambar)
- ✅ Tips keamanan
- ✅ 3 gambar ilustrasi dari Unsplash

**Cover Image:**

```
https://images.unsplash.com/photo-1563013544-824ae1b704d3
```

**Content Images:**

1. Mobile banking app illustration
2. Registration page display
3. Security setup with biometrics

## 🔍 Model Methods

### Instance Methods

```javascript
// Get article in specific language
const articleData = article.getByLanguage("id");
```

### Static Methods

```javascript
// Find article by slug and language
const article = await Article.findBySlugAndLang(
  "cara-membuat-akun-brimo",
  "id"
);
```

## 📊 Indexes

Schema memiliki indexes untuk performa optimal:

```javascript
// Composite index untuk pencarian slug + language
{ 'translations.slug': 1, 'translations.lang': 1 }

// Index untuk sorting berdasarkan status dan tanggal
{ status: 1, publishedAt: -1 }

// Index untuk filter kategori
{ category: 1 }
```

## 🛠️ File Structure

```
backend/
├── src/
│   ├── models/
│   │   └── Article.js              # Mongoose schema
│   ├── controllers/
│   │   └── articleController.js    # API controllers
│   ├── routes/
│   │   └── articles.js             # Express routes
│   ├── migrations/
│   │   └── createArticlesCollection.js
│   ├── seed/
│   │   └── articles.seed.js
│   └── db/
│       └── connect.js
└── package.json
```

## 🔐 Security Notes

Saat ini semua endpoints bersifat public untuk testing. Untuk production:

1. Uncomment baris auth middleware di `routes/articles.js`
2. Protect POST, PUT, DELETE endpoints
3. Tambahkan role-based access control
4. Validate input data
5. Sanitize HTML content

```javascript
// Production route example
router.post("/", authMiddleware, isAdmin, createArticle);
router.put("/:id", authMiddleware, isAdmin, updateArticle);
router.delete("/:id", authMiddleware, isAdmin, deleteArticle);
```

## 📚 Additional Resources

- [API Testing Guide](./API_ARTICLES_TESTING.md)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Express Routing](https://expressjs.com/en/guide/routing.html)

## 🐛 Troubleshooting

### Error: Collection already exists

Jika Anda menjalankan migration lebih dari sekali, collection sudah ada. Ini normal dan aman.

### Error: Article already exists

Jika Anda menjalankan seeding lebih dari sekali, artikel sudah ada. Script akan skip otomatis.

### Error: MONGO_URI undefined

Pastikan file `.env` memiliki variable `MONGODB_URI` atau `MONGO_URI`.

## 📄 License

MIT License - BRI Digital Banking Project
