# BRI Company Profile - Backend (Go Fiber)

Backend API untuk aplikasi BRI Company Profile menggunakan **Go Fiber** dan **MongoDB**.

## 🚀 Fitur

- ✅ **Authentication & Authorization** - JWT-based auth dengan bcrypt password hashing
- ✅ **User Management** - Register, login, dan profile management
- ✅ **Money Transfer** - Transfer antar rekening dengan atomic operations
- ✅ **Transaction History** - Riwayat transaksi lengkap
- ✅ **Articles CMS** - CRUD artikel dengan multi-language support (ID/EN)
- ✅ **Stock Data Scraping** - Real-time data saham BBRI dari website BRI
- ✅ **CORS Support** - Konfigurasi CORS untuk frontend
- ✅ **Middleware** - Auth, logging, error handling

## 📁 Struktur Folder

```
backend-go-fiber/
├── main.go                 # Entry point aplikasi
├── .env                    # Environment variables
├── go.mod                  # Go module dependencies
├── go.sum                  # Go module checksums
└── src/
    ├── config/            # Konfigurasi aplikasi
    │   └── config.go
    ├── database/          # Database connection
    │   └── database.go
    ├── models/            # Data models
    │   ├── user.go
    │   ├── article.go
    │   └── transaction.go
    ├── controllers/       # Request handlers
    │   ├── auth.go
    │   ├── transfer.go
    │   └── article.go
    ├── middleware/        # Middleware functions
    │   ├── auth.go
    │   └── logger.go
    ├── services/          # Business logic
    │   └── stock.go
    └── routes/            # Route definitions
        └── routes.go
```

## 🛠️ Instalasi

### Prerequisites

- Go 1.21 atau lebih baru
- MongoDB (local atau Atlas)
- Git

### Setup

1. **Clone repository** (jika belum)

   ```bash
   git clone <repository-url>
   cd backend-go-fiber
   ```

2. **Install dependencies**

   ```bash
   go mod download
   ```

3. **Setup environment variables**

   Copy `.env.example` ke `.env` dan sesuaikan:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/brimo_db
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:3000,http://localhost:5173
   ```

4. **Run aplikasi**

   ```bash
   # Development
   go run main.go

   # Build production
   go build -o server main.go
   ./server
   ```

## 📡 API Endpoints

### Health Check

```
GET /api/ping
```

Response:

```json
{
  "message": "pong",
  "timestamp": "2024-01-10T10:30:00.000Z"
}
```

### Authentication

#### Register

```
POST /api/auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phoneNumber": "08123456789",
  "accountNumber": "1234567890"
}
```

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Get Current User

```
GET /api/auth/me
Authorization: Bearer <token>
```

### Transfer & Transactions

#### Transfer Money

```
POST /api/transfer
Authorization: Bearer <token>
Content-Type: application/json

{
  "toAccount": "0987654321",
  "amount": 100000,
  "description": "Transfer test"
}
```

#### Get Transactions

```
GET /api/transactions?limit=50
Authorization: Bearer <token>
```

### Articles

#### Get All Articles

```
GET /api/articles?lang=id&status=published&category=Tutorial
```

Query Parameters:

- `lang`: Language (id/en) - default: id
- `status`: Filter by status (published/draft) - optional
- `category`: Filter by category - optional

#### Get Article by Slug

```
GET /api/articles/slug/:slug?lang=id
```

#### Get Article by ID

```
GET /api/articles/:id
```

#### Create Article (Protected)

```
POST /api/articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "translations": [
    {
      "lang": "id",
      "title": "Judul Artikel",
      "slug": "judul-artikel",
      "content": [
        {
          "type": "text",
          "value": "Isi artikel..."
        }
      ]
    }
  ],
  "category": "Tutorial",
  "author": "Admin",
  "coverImage": "https://example.com/image.jpg",
  "status": "published"
}
```

#### Update Article (Protected)

```
PUT /api/articles/:id
Authorization: Bearer <token>
```

#### Delete Article (Protected)

```
DELETE /api/articles/:id
Authorization: Bearer <token>
```

### Stock Data

#### Get BBRI Stock Data

```
GET /api/stock/bbri
```

Response:

```json
{
  "symbol": "BBRI",
  "name": "Bank Rakyat Indonesia (Persero) Tbk",
  "price": 3850.0,
  "change": 30.0,
  "changePercent": 0.79,
  "volume": "313.903.600,00",
  "dayRange": "3.820,00 - 3.910,00",
  "fiftyTwoWeekRange": "3.360,00 - 4.870,00",
  "lastUpdate": "...",
  "source": "BRI Official Website",
  "fetchedAt": "2024-01-10T10:30:00Z"
}
```

## 🔐 Authentication

API menggunakan JWT (JSON Web Token) untuk authentication.

**Flow:**

1. User login via `/api/auth/login`
2. Server mengembalikan JWT token
3. Client menyimpan token (localStorage/cookies)
4. Setiap request ke protected endpoint, kirim token di header:
   ```
   Authorization: Bearer <token>
   ```

**Token expires:** 7 hari (configurable via JWT_EXPIRES_IN)

## 🗄️ Database Models

### User

```go
{
  "_id": ObjectId,
  "fullName": string,
  "email": string (unique, lowercase),
  "password": string (bcrypt hashed),
  "phoneNumber": string,
  "accountNumber": string (unique),
  "balance": float64,
  "role": "user" | "admin",
  "isActive": boolean,
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

### Article

```go
{
  "_id": ObjectId,
  "translations": [
    {
      "lang": "id" | "en",
      "title": string,
      "slug": string,
      "content": [
        {
          "type": "text" | "image",
          "value": string,
          "caption": string (optional)
        }
      ]
    }
  ],
  "category": string,
  "author": string,
  "coverImage": string,
  "publishedAt": timestamp,
  "status": "draft" | "published",
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

### Transaction

```go
{
  "_id": ObjectId,
  "fromAccount": string,
  "toAccount": string,
  "amount": float64,
  "description": string,
  "status": "pending" | "success" | "failed",
  "initiatedBy": ObjectId (ref: User),
  "date": timestamp,
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:5000/api/ping

# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "Password123",
    "phoneNumber": "08123456789",
    "accountNumber": "1234567890"
  }'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

## 🚀 Deployment

### Build untuk Production

```bash
# Build binary
go build -o server main.go

# Run
./server
```

### Docker (Optional)

```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o server main.go

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/server .
COPY --from=builder /app/.env .
EXPOSE 5000
CMD ["./server"]
```

Build dan run:

```bash
docker build -t bri-backend-go .
docker run -p 5000:5000 bri-backend-go
```

## 📝 Development Notes

### Perbedaan dengan Express Version

1. **Performance**: Go Fiber lebih cepat dan efisien memory
2. **Type Safety**: Strong typing dengan Go
3. **Concurrency**: Built-in goroutines untuk operasi async
4. **Compilation**: Binary executable, tidak perlu runtime

### Best Practices

- Gunakan context untuk timeout operations
- Implementasi proper error handling
- Validate input dengan struct tags
- Use middleware untuk cross-cutting concerns
- Keep controllers thin, business logic di services

## 🔧 Troubleshooting

### MongoDB Connection Error

```
Error: connection timeout
```

**Solution:** Check MongoDB URI dan pastikan MongoDB running

### JWT Token Invalid

```
Error: Token tidak valid
```

**Solution:** Verify JWT_SECRET sama di semua environment

### CORS Error

```
Error: CORS policy blocked
```

**Solution:** Tambahkan frontend URL ke CORS_ORIGIN di `.env`

## 📚 Resources

- [Fiber Documentation](https://docs.gofiber.io/)
- [MongoDB Go Driver](https://www.mongodb.com/docs/drivers/go/current/)
- [JWT Go](https://github.com/golang-jwt/jwt)
- [Go Best Practices](https://go.dev/doc/effective_go)

## 👥 Contributors

- Backend Express Version: Team
- Go Fiber Port: GitHub Copilot

## 📄 License

MIT License
