# 🔐 Authentication Setup Guide - BRImo Project

## 📋 Overview

This guide covers the complete JWT-based authentication system implemented for the BRImo project, including login, signup, protected routes, and dashboard functionality.

## ✅ What Has Been Implemented

### Backend Components

1. **Auth Controller** (`backend/src/controllers/authController.js`)

   - `signup()` - User registration with validation
   - `login()` - User authentication
   - `getCurrentUser()` - Get logged-in user profile

2. **Auth Middleware** (`backend/src/middleware/authMiddleware.js`)

   - JWT token validation
   - Protects routes from unauthorized access
   - Handles token expiration and errors

3. **Auth Routes** (`backend/src/routes/auth.js`)

   - `POST /api/auth/signup` - Register new user
   - `POST /api/auth/login` - Login user
   - `GET /api/auth/me` - Get current user (protected)

4. **Environment Variables** (`backend/.env`)
   ```env
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
   JWT_EXPIRES_IN=7d
   BCRYPT_ROUNDS=10
   ```

### Frontend Components

1. **Auth Context** (`frontend/src/context/AuthContext.jsx`)

   - Global authentication state management
   - Functions: `signup()`, `login()`, `logout()`, `loadUser()`
   - Automatic axios header configuration

2. **Login Page** (`frontend/src/pages/Login.jsx`)

   - Email and password form
   - Show/hide password toggle
   - Error handling and loading states
   - Redirect to dashboard on success

3. **Signup Page** (`frontend/src/pages/Signup.jsx`)

   - Full registration form (fullName, email, password, phone, accountNumber)
   - Client-side validation
   - Password strength requirements
   - Confirm password field

4. **Dashboard Page** (`frontend/src/pages/Dashboard.jsx`)

   - Display user profile information
   - Show formatted account balance
   - Quick action buttons
   - Logout functionality

5. **Protected Route** (`frontend/src/components/ProtectedRoute.jsx`)

   - Wrapper component for protected pages
   - Redirects to login if not authenticated

6. **Updated App.jsx**

   - React Router setup
   - AuthProvider wrapping
   - Route definitions

7. **HomePage** (`frontend/src/pages/HomePage.jsx`)
   - Original landing page content
   - Public route

## 🚀 Installation

### 1. Install Backend Dependencies

```powershell
cd "backend"
npm install jsonwebtoken express-validator
```

### 2. Install Frontend Dependencies

```powershell
cd "frontend"
npm install react-router-dom lucide-react
```

## 🔧 Configuration

### Backend Setup

1. **Environment Variables**

   - Ensure `.env` file exists in `backend/` directory
   - **IMPORTANT**: Change `JWT_SECRET` in production!

2. **MongoDB Connection**
   - Make sure MongoDB is running on `mongodb://localhost:27017/brimo_db`
   - Run database seeding if needed:
     ```powershell
     cd backend
     node src/db/seedUsers.js
     ```

### Frontend Setup

1. **Axios Configuration**
   - Base URL already configured in `AuthContext.jsx`
   - Automatically adds JWT token to all requests

## 📡 API Endpoints

### 1. Signup (Register)

**Endpoint**: `POST /api/auth/signup`

**Request Body**:

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phoneNumber": "08123456789",
  "accountNumber": "1234567890"
}
```

**Validation Rules**:

- `fullName`: Min 3 characters
- `email`: Valid email format
- `password`: Min 8 characters, must contain uppercase, lowercase, and digit
- `phoneNumber`: 10-15 digits
- `accountNumber`: 10-16 characters

**Success Response** (201):

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "08123456789",
    "accountNumber": "1234567890",
    "balance": 0,
    "isActive": true
  }
}
```

**Error Response** (400):

```json
{
  "errors": [
    {
      "msg": "Password must be at least 8 characters long",
      "path": "password"
    }
  ]
}
```

### 2. Login

**Endpoint**: `POST /api/auth/login`

**Request Body**:

```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response** (200):

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "08123456789",
    "accountNumber": "1234567890",
    "balance": 0,
    "isActive": true
  }
}
```

**Error Response** (401):

```json
{
  "message": "Invalid credentials"
}
```

### 3. Get Current User (Protected)

**Endpoint**: `GET /api/auth/me`

**Headers**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response** (200):

```json
{
  "_id": "...",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "08123456789",
  "accountNumber": "1234567890",
  "balance": 0,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response** (401):

```json
{
  "message": "Token expired"
}
```

## 🔐 Security Features

### Password Security

- **bcrypt** hashing with 10 salt rounds
- Passwords never stored in plain text
- Minimum password requirements enforced

### JWT Tokens

- 7-day expiration by default
- Stored in localStorage (frontend)
- Sent via Authorization Bearer header
- Validated on protected routes

### Input Validation

- **express-validator** on backend
- Client-side validation on frontend
- Prevents SQL injection, XSS attacks

### Account Security

- Email uniqueness enforced
- Account number uniqueness enforced
- Active status check on login

## 🎯 Frontend Usage

### Using Auth Context

```jsx
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { user, login, logout, loading } = useAuth();

  const handleLogin = async () => {
    const result = await login("email@example.com", "password");
    if (result.success) {
      // Redirect or update UI
    } else {
      console.error(result.message);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <div>
          <p>Welcome, {user.fullName}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Protected Routes

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## 🧪 Testing the Authentication

### 1. Start Backend Server

```powershell
cd backend
npm run dev
```

Backend should run on `http://localhost:5000`

### 2. Start Frontend Server

```powershell
cd frontend
npm run dev
```

Frontend should run on `http://localhost:5173`

### 3. Test Signup Flow

1. Navigate to `http://localhost:5173/signup`
2. Fill in the registration form:
   - Full Name: "John Doe"
   - Email: "john@example.com"
   - Password: "SecurePass123"
   - Confirm Password: "SecurePass123"
   - Phone: "08123456789"
   - Account Number: "1234567890"
3. Click "Daftar"
4. Should redirect to `/dashboard` automatically

### 4. Test Login Flow

1. Navigate to `http://localhost:5173/login`
2. Enter email and password
3. Click "Login"
4. Should redirect to `/dashboard`

### 5. Test Protected Route

1. Open browser DevTools
2. Clear localStorage: `localStorage.clear()`
3. Try to access `http://localhost:5173/dashboard`
4. Should redirect to `/login`

### 6. Test Logout

1. Login first
2. On dashboard, click "Logout" button
3. Token should be cleared from localStorage
4. Should redirect to `/login`

## 🛠️ Troubleshooting

### Issue: "Token is not valid"

**Solution**: Token might be expired. Logout and login again.

### Issue: "User already exists"

**Solution**: Email or account number already registered. Use different credentials.

### Issue: "Network Error"

**Solution**: Make sure backend server is running on port 5000.

### Issue: "CORS Error"

**Solution**: Backend has CORS enabled. Check if frontend axios base URL is correct.

### Issue: Page redirects to login immediately

**Solution**:

1. Check if token exists in localStorage
2. Check if token is still valid (not expired)
3. Verify backend `/api/auth/me` endpoint works

## 📊 Data Flow

### Login Flow

```
User Input (Email/Password)
    ↓
Frontend: login() in AuthContext
    ↓
POST /api/auth/login
    ↓
Backend: Validate credentials with bcrypt
    ↓
Backend: Generate JWT token
    ↓
Response: { token, user }
    ↓
Frontend: Save token to localStorage
    ↓
Frontend: Set axios Authorization header
    ↓
Frontend: Update user state
    ↓
Redirect to /dashboard
```

### Protected Route Flow

```
User accesses /dashboard
    ↓
ProtectedRoute checks: Is user authenticated?
    ↓
No → Redirect to /login
    ↓
Yes → Render Dashboard
    ↓
Dashboard calls loadUser()
    ↓
GET /api/auth/me (with token in header)
    ↓
Backend: Verify JWT token
    ↓
Backend: Fetch user from database
    ↓
Response: User data
    ↓
Display user profile
```

## 📝 Next Steps

1. **Add Password Reset**

   - Forgot password page
   - Email verification
   - Reset token generation

2. **Add Email Verification**

   - Send verification email on signup
   - Email verification endpoint

3. **Add Profile Edit**

   - Update user information
   - Change password functionality

4. **Add Refresh Tokens**

   - Implement token refresh mechanism
   - Automatic token renewal

5. **Add Social Login**

   - Google OAuth
   - Facebook OAuth

6. **Add Two-Factor Authentication (2FA)**
   - SMS verification
   - Authenticator app support

## 🔗 Related Documentation

- [Database Setup Guide](./DATABASE_SETUP.md)
- [ES Modules Guide](./ES_MODULES_GUIDE.md)
- [i18n Implementation](./I18N_IMPLEMENTATION.md)

## 📚 Libraries Used

- **jsonwebtoken** (^9.0.0) - JWT token generation and verification
- **bcrypt** (^5.1.0) - Password hashing
- **express-validator** (^7.0.0) - Input validation
- **react-router-dom** (^6.x) - Frontend routing
- **lucide-react** (^0.x) - Icon library
- **axios** (^1.12.0) - HTTP client

## ⚠️ Important Notes

1. **Change JWT_SECRET in production!** Current secret is for development only.
2. **Use HTTPS in production** to protect tokens in transit.
3. **Implement rate limiting** to prevent brute force attacks.
4. **Add CSRF protection** for additional security.
5. **Monitor failed login attempts** and implement account lockout.

---

**Created**: 2024
**Project**: BRI Redesign - BRImo Application
**Author**: Politeknik Negeri Bandung
