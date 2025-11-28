# BRImo Backend API - FastAPI Implementation

A modern, high-performance backend API for BRImo (BRI Mobile Banking) built with FastAPI and MongoDB.

## 🚀 Features

- **Fast & Modern**: Built with FastAPI for high performance and modern Python features
- **Async MongoDB**: Uses Motor (async MongoDB driver) for non-blocking database operations
- **JWT Authentication**: Secure authentication using JSON Web Tokens
- **Multi-language Support**: Article system with Indonesian and English translations
- **Stock Data Scraping**: Real-time BBRI stock data from BRI website
- **Banking Operations**: Money transfers, transaction history, account management
- **Auto Documentation**: Interactive API docs with Swagger UI and ReDoc

## 📋 Requirements

- Python 3.8+
- MongoDB 4.0+
- pip (Python package manager)

## 🛠️ Installation

1. **Create a virtual environment**:
```bash
python -m venv venv
```

2. **Activate the virtual environment**:

Windows (PowerShell):
```powershell
.\venv\Scripts\Activate.ps1
```

Windows (CMD):
```cmd
venv\Scripts\activate.bat
```

Linux/Mac:
```bash
source venv/bin/activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=5000
HOST=0.0.0.0
DEBUG=True
MONGODB_URI=mongodb://localhost:27017/brimo_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
JWT_ALGORITHM=HS256
JWT_EXPIRES_IN_DAYS=7
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 🚀 Running the Application

### Development Mode (with auto-reload)
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 5000
```

Or using the main module:
```bash
python -m app.main
```

### Production Mode
```bash
uvicorn app.main:app --host 0.0.0.0 --port 5000 --workers 4
```

## 📚 API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:5000/docs
- **ReDoc**: http://localhost:5000/redoc

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile (requires auth)

### Transfers & Transactions
- `POST /api/transfer` - Transfer money (requires auth)
- `GET /api/transactions` - Get transaction history (requires auth)

### Articles
- `GET /api/articles` - Get all articles
- `GET /api/articles/slug/{slug}` - Get article by slug
- `GET /api/articles/category/{category}` - Get articles by category
- `GET /api/articles/{id}` - Get article by ID
- `POST /api/articles` - Create article (requires auth)
- `PUT /api/articles/{id}` - Update article (requires auth)
- `DELETE /api/articles/{id}` - Delete article (requires auth)

### Stock
- `GET /api/stock/bbri` - Get BBRI stock data

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user (testing only)

### Health Check
- `GET /api/ping` - Health check endpoint

## 🗄️ Database Setup

The application connects to MongoDB automatically. Make sure MongoDB is running:

```bash
# Start MongoDB (if installed locally)
mongod
```

### Creating Collections and Indexes

Collections will be created automatically when you insert the first document. However, for optimal performance, you may want to create indexes manually.

Connect to MongoDB shell:
```bash
mongosh
use brimo_db
```

Create indexes:
```javascript
// Users collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ accountNumber: 1 }, { unique: true })
db.users.createIndex({ phoneNumber: 1 })

// Transactions collection
db.transactions.createIndex({ fromAccount: 1 })
db.transactions.createIndex({ toAccount: 1 })
db.transactions.createIndex({ date: -1 })

// Articles collection
db.articles.createIndex({ "translations.slug": 1, "translations.lang": 1 })
db.articles.createIndex({ status: 1, publishedAt: -1 })
db.articles.createIndex({ category: 1 })
```

## 🧪 Testing

You can test the API using:

1. **Swagger UI**: http://localhost:5000/docs (interactive testing)
2. **curl**:
```bash
# Health check
curl http://localhost:5000/api/ping

# Register user
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "phoneNumber": "081234567890",
    "accountNumber": "1234567890"
  }'
```

3. **Postman or Insomnia**: Import the API endpoints from the Swagger documentation

## 📁 Project Structure

```
backend_fastapi/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration settings
│   ├── database.py          # MongoDB connection
│   ├── auth.py              # Authentication utilities
│   ├── models/              # Pydantic models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── transaction.py
│   │   └── article.py
│   ├── routes/              # API routes
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── transfer.py
│   │   ├── articles.py
│   │   ├── stock.py
│   │   └── users.py
│   └── services/            # Business logic
│       ├── __init__.py
│       └── stock_service.py
├── .env.example             # Environment variables template
├── .gitignore
├── requirements.txt         # Python dependencies
└── README.md
```

## 🔒 Security Features

- **Password Hashing**: Using bcrypt for secure password storage
- **JWT Authentication**: Stateless authentication with configurable expiration
- **Input Validation**: Pydantic models for request validation
- **CORS Protection**: Configurable CORS middleware
- **SQL Injection Protection**: MongoDB's natural protection against SQL injection

## 🌟 Key Differences from Node.js Version

1. **Type Safety**: Pydantic models provide runtime type checking and validation
2. **Async/Await**: Native async support with async/await syntax
3. **Auto Documentation**: Automatic OpenAPI (Swagger) documentation generation
4. **Performance**: FastAPI is one of the fastest Python frameworks
5. **Modern Python**: Uses Python 3.8+ features like type hints

## 🚧 Migration Notes

This FastAPI backend maintains API compatibility with the original Node.js/Express backend:

- Same endpoint paths
- Same request/response formats
- Same authentication mechanism (JWT)
- Same database schema (MongoDB)

Frontend applications can switch between backends without code changes.

## 📝 License

Copyright © 2024 Bank BRI. All rights reserved.

## 👥 Contributors

- Converted from Node.js/Express to FastAPI
- Original backend: BRImo Backend Team

## 🤝 Support

For issues and questions, please contact the development team.
