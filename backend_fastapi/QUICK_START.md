# Quick Start Guide - FastAPI Backend

## Installation & Setup

### 1. Create Virtual Environment
```powershell
# Navigate to backend_fastapi folder
cd backend_fastapi

# Create virtual environment
python -m venv venv

# Activate it (PowerShell)
.\venv\Scripts\Activate.ps1

# Or for CMD
# venv\Scripts\activate.bat
```

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 3. Configure Environment
```powershell
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
```

### 4. Start MongoDB
Make sure MongoDB is running on `mongodb://localhost:27017`

### 5. Run the Server
```powershell
# Development mode (with auto-reload)
uvicorn app.main:app --reload --port 5000

# Or
python -m app.main
```

### 6. Test the API
Open your browser and visit:
- http://localhost:5000/docs (Swagger UI)
- http://localhost:5000/api/ping (Health check)

## Key Commands

### Development
```powershell
# Run with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 5000

# Run with custom log level
uvicorn app.main:app --reload --log-level debug
```

### Production
```powershell
# Run with multiple workers
uvicorn app.main:app --host 0.0.0.0 --port 5000 --workers 4

# Run with Gunicorn (Linux/Mac)
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:5000
```

## Testing Endpoints

### 1. Health Check
```powershell
curl http://localhost:5000/api/ping
```

### 2. Register User
```powershell
curl -X POST http://localhost:5000/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "Password123",
    "phoneNumber": "081234567890",
    "accountNumber": "1234567890"
  }'
```

### 3. Login
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

## Troubleshooting

### Port Already in Use
```powershell
# Use a different port
uvicorn app.main:app --reload --port 5001
```

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod`
- Check MONGODB_URI in .env file
- Verify MongoDB is accessible at localhost:27017

### Module Not Found
```powershell
# Make sure virtual environment is activated
.\venv\Scripts\Activate.ps1

# Reinstall dependencies
pip install -r requirements.txt
```

### Import Errors
```powershell
# Make sure you're in the backend_fastapi directory
# Run from the backend_fastapi folder:
uvicorn app.main:app --reload
```

## Next Steps

1. **Create test data** using the Swagger UI at http://localhost:5000/docs
2. **Test authentication** by registering and logging in
3. **Explore API endpoints** in the interactive documentation
4. **Connect your frontend** by updating the API base URL

Enjoy your FastAPI backend! 🚀
