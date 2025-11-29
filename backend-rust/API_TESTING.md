# API Testing Guide

## Setup

1. Pastikan server berjalan di `http://localhost:5000`
2. Install tools testing (optional):
   - [HTTPie](https://httpie.io/) atau
   - [Postman](https://www.postman.com/) atau
   - curl (built-in)

## 1. Health Check

### Test Ping
```bash
curl http://localhost:5000/api/ping
```

**Expected Response:**
```json
{
  "message": "pong",
  "timestamp": "2024-11-24T10:30:00.000Z"
}
```

## 2. Authentication Flow

### A. Signup (Register User Baru)

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phoneNumber": "08123456789",
    "accountNumber": "1234567890"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "fullName": "Test User",
      "email": "test@example.com",
      "phoneNumber": "08123456789",
      "accountNumber": "1234567890",
      "balance": 0,
      "formattedBalance": "Rp 0",
      "isActive": true,
      "role": "user"
    }
  }
}
```

**Save the token for next requests!**

### B. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

### C. Get Current User (Protected)

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "fullName": "Test User",
    "email": "test@example.com",
    "phoneNumber": "08123456789",
    "accountNumber": "1234567890",
    "balance": 0,
    "formattedBalance": "Rp 0",
    "isActive": true,
    "role": "user"
  }
}
```

## 3. Transfer & Transactions

### A. Create Another User (for transfer testing)

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Recipient User",
    "email": "recipient@example.com",
    "password": "password123",
    "phoneNumber": "08987654321",
    "accountNumber": "0987654321"
  }'
```

### B. Update Balance (Direct DB - for testing)

Untuk testing, update balance user pertama via MongoDB:
```javascript
db.users.updateOne(
  { "email": "test@example.com" },
  { $set: { "balance": 1000000 } }
)
```

### C. Transfer Money

```bash
curl -X POST http://localhost:5000/api/transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "toAccount": "0987654321",
    "amount": 100000,
    "description": "Transfer test"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Transfer berhasil",
  "data": {
    "transaction": {
      "_id": "...",
      "fromAccount": "1234567890",
      "toAccount": "0987654321",
      "amount": 100000,
      "description": "Transfer test",
      "status": "success",
      "date": "2024-11-24T10:35:00.000Z"
    }
  }
}
```

### D. Get Transaction History

```bash
curl "http://localhost:5000/api/transactions?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "_id": "...",
        "fromAccount": "1234567890",
        "toAccount": "0987654321",
        "amount": 100000,
        "description": "Transfer test",
        "status": "success",
        "date": "2024-11-24T10:35:00.000Z"
      }
    ]
  }
}
```

## 4. Articles

### A. Create Article

```bash
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "translations": [
      {
        "lang": "id",
        "title": "Tutorial BRImo",
        "slug": "tutorial-brimo",
        "content": [
          {
            "type": "text",
            "value": "Ini adalah tutorial penggunaan BRImo"
          },
          {
            "type": "image",
            "value": "https://example.com/image.jpg",
            "caption": "Screenshot aplikasi"
          }
        ]
      },
      {
        "lang": "en",
        "title": "BRImo Tutorial",
        "slug": "brimo-tutorial",
        "content": [
          {
            "type": "text",
            "value": "This is a BRImo usage tutorial"
          }
        ]
      }
    ],
    "category": "Tutorial",
    "author": "BRI Team",
    "coverImage": "https://example.com/cover.jpg",
    "status": "published",
    "publishedAt": "2024-11-24T00:00:00.000Z"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Article created successfully",
  "data": { ... }
}
```

### B. Get All Articles

```bash
curl "http://localhost:5000/api/articles?lang=id&status=published"
```

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "title": "Tutorial BRImo",
      "slug": "tutorial-brimo",
      "contentPreview": [ ... ],
      "category": "Tutorial",
      "author": "BRI Team",
      "coverImage": "https://example.com/cover.jpg",
      "publishedAt": "2024-11-24T00:00:00.000Z",
      "status": "published"
    }
  ]
}
```

### C. Get Article by Slug

```bash
curl "http://localhost:5000/api/articles/slug/tutorial-brimo?lang=id"
```

### D. Get Article by ID

```bash
curl "http://localhost:5000/api/articles/ARTICLE_ID_HERE"
```

### E. Update Article

```bash
curl -X PUT "http://localhost:5000/api/articles/ARTICLE_ID_HERE" \
  -H "Content-Type: application/json" \
  -d '{ ... updated data ... }'
```

### F. Delete Article

```bash
curl -X DELETE "http://localhost:5000/api/articles/ARTICLE_ID_HERE"
```

### G. Get Articles by Category

```bash
curl "http://localhost:5000/api/articles/category/Tutorial?lang=id"
```

## 5. Stock Data

### Get BBRI Stock Data

```bash
curl http://localhost:5000/api/stock/bbri
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "BBRI",
    "name": "Bank Rakyat Indonesia (Persero) Tbk",
    "price": 3850.0,
    "change": 30.0,
    "changePercent": 0.79,
    "volume": "313.903.600,00",
    "dayRange": "3.820,00 - 3.910,00",
    "fiftyTwoWeekRange": "3.360,00 - 4.870,00",
    "lastUpdate": "24 Nov 2024"
  }
}
```

## 6. Users (Admin Endpoints)

### A. Get All Users

```bash
curl http://localhost:5000/api/users
```

### B. Create User

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin User",
    "email": "admin@example.com",
    "password": "hashedpasswordhere",
    "phoneNumber": "08111111111",
    "accountNumber": "1111111111",
    "balance": 0,
    "role": "admin",
    "isActive": true
  }'
```

## Error Cases Testing

### 1. Invalid Credentials

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }'
```

**Expected:**
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

### 2. Missing Token

```bash
curl http://localhost:5000/api/auth/me
```

**Expected:**
```json
{
  "success": false,
  "message": "Token tidak ditemukan. Silakan login terlebih dahulu."
}
```

### 3. Insufficient Balance

```bash
curl -X POST http://localhost:5000/api/transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "toAccount": "0987654321",
    "amount": 9999999999,
    "description": "Large transfer"
  }'
```

**Expected:**
```json
{
  "success": false,
  "message": "Saldo tidak mencukupi"
}
```

### 4. Duplicate Email

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Duplicate User",
    "email": "test@example.com",
    "password": "password123",
    "phoneNumber": "08111222333",
    "accountNumber": "9999999999"
  }'
```

**Expected:**
```json
{
  "success": false,
  "message": "Email sudah terdaftar"
}
```

## Performance Testing

### Using Apache Bench (ab)

```bash
# Install ab
sudo apt install apache2-utils  # Linux
brew install httpd              # macOS

# Test 1000 requests with 10 concurrent connections
ab -n 1000 -c 10 http://localhost:5000/api/ping
```

### Using wrk

```bash
# Install wrk
git clone https://github.com/wg/wrk.git
cd wrk && make

# Test with 12 threads, 400 connections for 30 seconds
wrk -t12 -c400 -d30s http://localhost:5000/api/ping
```

## Integration Testing with Frontend

1. Update frontend `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

2. Start backend Rust:
```bash
cd backend-rust
cargo run
```

3. Start frontend:
```bash
cd frontend
npm run dev
```

4. Test all flows in browser:
   - Login/Signup
   - Transfer money
   - View transactions
   - Read articles
   - Check stock prices

## Notes

- Semua endpoints **case-sensitive**
- Token JWT expires dalam **7 hari** (default)
- MongoDB ObjectId otomatis di-generate
- CORS sudah dikonfigurasi untuk localhost:3000 dan localhost:5173
- Gunakan **HTTPS** di production

## Troubleshooting

### Connection Refused
- Pastikan server berjalan: `cargo run`
- Check port: `netstat -ano | findstr :5000` (Windows)

### 500 Internal Server Error
- Check logs di terminal server
- Verify MongoDB connection
- Check environment variables

### 401 Unauthorized
- Verify token masih valid (belum expired)
- Check Authorization header format: `Bearer <token>`
- Ensure JWT_SECRET sama dengan saat token di-generate
