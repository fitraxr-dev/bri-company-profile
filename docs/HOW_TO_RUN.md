# 🚀 Cara Menjalankan Aplikasi BRImo

## ✅ Status Aplikasi

Aplikasi sudah berjalan dengan sukses tanpa error!

- ✅ Backend: http://localhost:5000
- ✅ Frontend: http://localhost:3000
- ✅ MongoDB: Connected

## 🔧 Perbaikan yang Sudah Dilakukan

### 1. **Fixed: Duplicate User Model Error**

**Masalah**: `OverwriteModelError: Cannot overwrite 'User' model once compiled.`

**Solusi**:

- Menghapus definisi User model duplikat di `backend/src/index.js`
- Menggunakan import User model dari `backend/src/models/User.js`
- Menambahkan check `mongoose.models.User || mongoose.model()` untuk mencegah hot-reload error

**File yang diubah**:

- `backend/src/index.js` - Menghapus definisi inline UserSchema, menggunakan import
- `backend/src/models/User.js` - Menambahkan protection untuk hot-reload

## 📋 Cara Menjalankan Aplikasi

### Prerequisites

- Node.js >= 18
- MongoDB berjalan di `mongodb://localhost:27017`
- npm atau yarn

### 1. Jalankan Backend

```powershell
cd "backend"
npm run dev
```

**Output yang diharapkan**:

```
🚀 Server running on http://localhost:5000
✅ MongoDB connected
```

### 2. Jalankan Frontend (Terminal Baru)

```powershell
cd "frontend"
npm run dev
```

**Output yang diharapkan**:

```
VITE v5.4.21  ready in XXX ms
➜  Local:   http://localhost:3000/
```

### 3. Buka Browser

Aplikasi otomatis terbuka di: **http://localhost:3000**

## 🧪 Testing Authentication

### Test dengan User yang Sudah Ada

Login dengan credentials berikut (dari seeder):

**User 1:**

- Email: `john.doe@example.com`
- Password: `Password123`

**User 2:**

- Email: `jane.smith@example.com`
- Password: `Password123`

**User 3:**

- Email: `ahmad.yani@example.com`
- Password: `Password123`

### Test Signup

1. Kunjungi: http://localhost:3000/signup
2. Isi form pendaftaran:
   - Nama Lengkap: min 3 karakter
   - Email: format valid
   - Password: min 8 karakter (huruf besar, kecil, angka)
   - Nomor Telepon: 10-15 digit
   - Nomor Rekening: 10-16 karakter
3. Klik "Daftar"
4. Akan redirect ke dashboard

### Test Login

1. Kunjungi: http://localhost:3000/login
2. Masukkan email dan password
3. Klik "Login"
4. Akan redirect ke dashboard

### Test Protected Route

1. Logout dari dashboard
2. Coba akses: http://localhost:3000/dashboard
3. Akan redirect ke login (karena tidak authenticated)

## 🗂️ Struktur Endpoint API

### Public Endpoints

- `GET /api/ping` - Health check
- `POST /api/auth/signup` - Daftar user baru
- `POST /api/auth/login` - Login user
- `GET /api/stock/bbri` - Data saham BRI
- `GET /api/users` - List users (untuk development)

### Protected Endpoints

- `GET /api/auth/me` - Get current user (butuh JWT token)

## 📡 Proxy Configuration

Frontend sudah dikonfigurasi dengan proxy ke backend:

- Request ke `/api/*` otomatis diteruskan ke `http://localhost:5000`
- Tidak perlu CORS configuration tambahan

## ⚠️ Catatan Penting

### Warning yang Bisa Diabaikan

**Warning**: `The CJS build of Vite's Node API is deprecated`

- Ini hanya deprecation warning, bukan error
- Aplikasi tetap berjalan normal
- Akan diperbaiki di Vite v6 (future update)

### MongoDB Connection

Pastikan MongoDB sudah berjalan:

```powershell
# Cek status MongoDB (Windows)
net start MongoDB

# Atau jalankan MongoDB manual
mongod --dbpath "path/to/your/data"
```

### Environment Variables

File `.env` sudah ada di `backend/`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/brimo_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
```

**⚠️ PENTING**: Ganti `JWT_SECRET` untuk production!

## 🔄 Restart Server

### Restart Backend

Press `Ctrl+C` di terminal backend, lalu:

```powershell
npm run dev
```

### Restart Frontend

Press `Ctrl+C` di terminal frontend, lalu:

```powershell
npm run dev
```

### Quick Restart (nodemon)

Di terminal backend, ketik: `rs` + Enter

## 🐛 Troubleshooting

### Port Sudah Digunakan

**Error**: `Port 5000 is already in use`

**Solusi**:

```powershell
# Cari process yang menggunakan port 5000
netstat -ano | findstr :5000

# Kill process (ganti PID dengan process ID)
taskkill /PID <PID> /F
```

### MongoDB Connection Failed

**Error**: `MongoDB connection error`

**Solusi**:

1. Pastikan MongoDB service berjalan
2. Cek connection string di `.env`
3. Test connection: `mongosh mongodb://localhost:27017`

### Module Not Found

**Error**: `Cannot find module 'xxx'`

**Solusi**:

```powershell
# Install ulang dependencies
npm install

# Clear cache dan install ulang
npm cache clean --force
rm -rf node_modules
npm install
```

## 📊 Development Tools

### View Logs

**Backend logs**: Terminal backend akan menampilkan request logs

**Frontend logs**: Buka browser DevTools (F12) → Console tab

### Database Management

**MongoDB Compass**: `mongodb://localhost:27017`

- Database: `brimo_db`
- Collection: `users`

### API Testing

**Postman / Thunder Client**:

- Import collection dari `AUTHENTICATION_SETUP.md`
- Base URL: `http://localhost:5000`

## 🎯 Quick Commands

```powershell
# Backend
cd backend
npm run dev          # Start development server
npm run start        # Start production server
npm run migrate      # Run migrations
npm run seed         # Seed database
npm run db:setup     # Run migrate + seed

# Frontend
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## ✨ Fitur yang Sudah Berjalan

- ✅ Multilingual (Indonesia/English) dengan i18next
- ✅ Authentication (Login/Signup) dengan JWT
- ✅ Protected Routes
- ✅ User Dashboard dengan profile display
- ✅ Stock Information dari BRI website
- ✅ Responsive Design dengan Tailwind CSS
- ✅ MongoDB Integration dengan User model
- ✅ Password hashing dengan bcrypt
- ✅ Form validation (client & server)
- ✅ Error handling yang comprehensive

## 🎉 Aplikasi Siap Digunakan!

Semua fitur sudah berjalan dengan baik tanpa error. Selamat menggunakan!

---

**Updated**: October 27, 2025
**Status**: ✅ Running Successfully
**Errors**: 0
