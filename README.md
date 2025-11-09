# BRImo - Digital Banking Solution -git 

## 🏦 Bank BRI Digital Banking Platform

Modern web application untuk layanan perbankan digital Bank BRI dengan fitur lengkap dan user-friendly interface.

**🚀 Ready for Production Deployment!**
- Frontend: Vercel
- Backend: Azure App Service (Linux)
- Database: MongoDB Atlas

This workspace contains two folders:

- `backend/` — Express + Mongoose API dengan JWT Authentication
- `frontend/` — Vite + React app dengan TailwindCSS + daisyUI + i18next

## ✨ Fitur Utama

- 🔐 Authentication (Login/Signup) dengan JWT
- 🌍 Multilingual Support (Indonesia/English)
- 💰 Dashboard dengan informasi saldo dan profil user
- 📊 Real-time Stock Information BRI
- 🎨 Modern & Responsive UI Design
- 🛡️ Secure dengan bcrypt password hashing

## 🚀 Quick Start (Windows PowerShell)

### 1. Backend

```powershell
cd "./backend"
npm install
npm run dev
```

### 2. Frontend

```powershell
cd "./frontend"
npm install
npm run dev
```

## 📋 Prerequisites

- Node.js >= 18
- MongoDB (local atau cloud)
- npm atau yarn

## 🔧 Configuration

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/brimo_db
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
```

## 📱 Aplikasi URL

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017/brimo_db

## 📚 Dokumentasi

Lihat dokumentasi lengkap di:

**Development:**
- [Authentication Setup](./AUTHENTICATION_SETUP.md)
- [How to Run](./HOW_TO_RUN.md)
- [UI Improvements](./UI_IMPROVEMENTS.md)
- [Database Setup](./backend/DATABASE_SETUP.md)

**Deployment (Production):**
- [🐧 Deployment Guide - Linux](./DEPLOYMENT_GUIDE_LINUX.md) - **Recommended**
- [Deployment Checklist - Linux](./DEPLOYMENT_CHECKLIST_LINUX.md)
- [Linux Deployment Update](./LINUX_DEPLOYMENT_UPDATE.md)

## 🎯 Tech Stack

**Frontend:**

- React 18.2
- Vite 5.0
- TailwindCSS 3.4
- DaisyUI 3.0
- i18next (Multilingual)
- React Router DOM
- Axios

**Backend:**

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt
- express-validator

## 👥 Default Test Accounts

```
Email: john.doe@example.com
Password: Password123

Email: jane.smith@example.com
Password: Password123
```

## 📄 License

Created for Politeknik Negeri Bandung - Web Development Framework Project

---

**BRImo** - Digital Banking Solution © 2024 Bank BRI
