# Quick Start Guide - Backend Go Fiber

Panduan cepat untuk menjalankan backend BRI Company Profile dengan Go Fiber.

## ⚡ Quick Start (5 Menit)

### 1. Prerequisites Check

```bash
# Check Go version (minimum 1.21)
go version

# Check MongoDB (local atau Atlas)
mongosh --version
```

### 2. Clone & Setup

```bash
# Masuk ke folder backend-go-fiber
cd backend-go-fiber

# Install dependencies
go mod download
```

### 3. Environment Setup

```bash
# Copy .env.example
cp .env.example .env

# Edit .env dengan editor favorit
notepad .env  # Windows
# atau
nano .env     # Linux/Mac
```

**Minimal configuration:**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/brimo_db
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:5173
```

### 4. Run Server

```bash
# Development mode
go run main.go

# Atau build dulu
go build -o server.exe main.go
./server.exe
```

✅ **Server running di:** http://localhost:5000

## 🧪 Test API

### Test Health Check

```bash
curl http://localhost:5000/api/ping
```

**Expected Response:**

```json
{
  "message": "pong",
  "timestamp": "2024-01-10T10:30:00.000Z"
}
```

### Test Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "Password123",
    "phoneNumber": "08123456789",
    "accountNumber": "1234567890"
  }'
```

### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

**Save the token dari response!**

### Test Protected Endpoint

```bash
# Replace <TOKEN> dengan token dari login
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

## 🎯 Common Tasks

### Build untuk Production

```bash
# Build
go build -o server.exe main.go

# Run
./server.exe
```

### Cross-Compile untuk Linux

```bash
# Build untuk Linux server
$env:GOOS="linux"; $env:GOARCH="amd64"; go build -o server-linux main.go

# Atau di Linux/Mac
GOOS=linux GOARCH=amd64 go build -o server-linux main.go
```

### Update Dependencies

```bash
# Update all dependencies
go get -u ./...
go mod tidy
```

### Format Code

```bash
# Format semua Go files
go fmt ./...
```

## 🔧 Development Workflow

### 1. Start MongoDB

**Local MongoDB:**

```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongodb
```

**MongoDB Atlas:**

- Sudah running di cloud, tinggal set MONGODB_URI

### 2. Start Backend

```bash
# Terminal 1: Backend
cd backend-go-fiber
go run main.go
```

### 3. Start Frontend (Optional)

```bash
# Terminal 2: Frontend
cd ../frontend
npm run dev
```

### 4. Test dengan Postman/Thunder Client

Import collection atau manual test:

- Base URL: `http://localhost:5000/api`
- Endpoints: lihat di README.md

## 📝 Environment Variables Explained

```env
# Port server (default: 5000)
PORT=5000

# MongoDB connection string
# Local: mongodb://localhost:27017/brimo_db
# Atlas: mongodb+srv://user:pass@cluster.mongodb.net/
MONGODB_URI=mongodb://localhost:27017/brimo_db

# JWT secret untuk signing tokens (WAJIB diganti di production!)
JWT_SECRET=your-super-secret-jwt-key

# JWT expiration time (7d = 7 hari)
JWT_EXPIRES_IN=7d

# CORS allowed origins (comma separated)
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Environment (development/production)
NODE_ENV=development
```

## 🐛 Troubleshooting

### Error: "MongoDB connection timeout"

**Solusi:**

1. Check MongoDB running: `mongosh`
2. Check MONGODB_URI di .env
3. Untuk Atlas: check IP whitelist di MongoDB Atlas

### Error: "Port already in use"

**Solusi:**

```bash
# Find process using port 5000
# Windows
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :5000

# Kill process atau ubah PORT di .env
```

### Error: "Cannot find package"

**Solusi:**

```bash
# Clean dan reinstall
go clean -modcache
go mod download
go mod tidy
```

### Error: "JWT token invalid"

**Solusi:**

1. Check JWT_SECRET sama di .env
2. Token mungkin expired (7 hari)
3. Login ulang untuk dapat token baru

## 🚀 Next Steps

1. ✅ Server running
2. 📖 Baca [README.md](./README.md) untuk API documentation lengkap
3. 🔍 Lihat [COMPARISON.md](./COMPARISON.md) untuk perbandingan dengan Express
4. 🧪 Test semua endpoints dengan Postman
5. 🎨 Connect dengan frontend React

## 📚 Resources

- [Fiber Documentation](https://docs.gofiber.io/)
- [MongoDB Go Driver](https://www.mongodb.com/docs/drivers/go/current/)
- [Go by Example](https://gobyexample.com/)
- [Effective Go](https://go.dev/doc/effective_go)

## 💡 Pro Tips

1. **Auto Reload:** Use `air` for hot reload

   ```bash
   go install github.com/cosmtrek/air@latest
   air
   ```

2. **Debug Mode:** Use Delve debugger

   ```bash
   go install github.com/go-delve/delve/cmd/dlv@latest
   dlv debug
   ```

3. **Linting:** Use golangci-lint
   ```bash
   go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
   golangci-lint run
   ```

Happy Coding! 🎉
