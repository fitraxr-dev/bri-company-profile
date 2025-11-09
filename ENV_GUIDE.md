# Environment Configuration Guide

## 📁 Environment Files

### Frontend

- `.env` - Default development configuration (git-tracked for team)
- `.env.dev` - Development environment (localhost)
- `.env.production` - Production environment (Azure - existing)

### Backend

- `.env` - Production configuration (MongoDB Atlas)
- `.env.dev` - Development configuration (MongoDB Local)

---

## 🚀 Running in Development Mode

### **Frontend (Port 3000)**

```bash
cd frontend
npm run dev
```

This will:

- Start Vite dev server on `http://localhost:3000`
- Connect to backend at `http://localhost:5000/api`
- Use `.env.dev` configuration

### **Backend (Port 5000)**

```bash
cd backend
npm run dev
```

This will:

- Start Express server on `http://localhost:5000`
- Connect to local MongoDB at `mongodb://localhost:27017/brimo_db`
- Use `.env.dev` configuration

**Alternative with auto-reload:**

```bash
npm run dev:watch
```

---

## 🌱 Seeding Database

### **First Time Setup (Development)**

```bash
cd backend

# 1. Run migrations first (create collections & indexes)
npm run migrate:dev

# 2. Then seed data
npm run seed:dev

# Or run both together:
npm run db:setup:dev
```

### **First Time Setup (Production)**

```bash
cd backend

# 1. Run migrations first
npm run migrate

# 2. Then seed data
npm run seed

# Or run both together:
npm run db:setup
```

This will seed:

- ✅ 4 Users (1 admin + 3 regular users)
- ✅ 1 Article (bilingual: ID & EN)

**Default Credentials:**

- Admin: `admin@brimo.com` / `password123`
- User: `ahmad.fadli@example.com` / `password123`

---

## 📋 Environment Variables

### **Frontend (.env.dev)**

```env
VITE_API_URL=http://localhost:5000/api
```

### **Backend (.env.dev)**

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/brimo_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
```

---

## ⚙️ How It Works

### **Frontend**

- Vite automatically loads `.env.dev` when running with `--mode dev`
- All variables must be prefixed with `VITE_` to be exposed to client
- Access via `import.meta.env.VITE_API_URL`

### **Backend**

- Uses `dotenv/config` with custom path to load `.env.dev`
- No prefix required for backend variables
- Access via `process.env.MONGODB_URI`

---

## 🔧 NPM Scripts Reference

### Frontend

| Command           | Description              | Environment                  |
| ----------------- | ------------------------ | ---------------------------- |
| `npm run dev`     | Start dev server         | Development (.env.dev)       |
| `npm run build`   | Build for production     | Production (.env.production) |
| `npm run preview` | Preview production build | -                            |

### Backend

| Command                | Description                         | Environment            |
| ---------------------- | ----------------------------------- | ---------------------- |
| `npm run dev`          | Start server (dev mode)             | Development (.env.dev) |
| `npm run dev:watch`    | Start with auto-reload              | Development (.env.dev) |
| `npm start`            | Start server (production)           | Production (.env)      |
| `npm run migrate:dev`  | Create collections & indexes (dev)  | Development (.env.dev) |
| `npm run migrate`      | Create collections & indexes (prod) | Production (.env)      |
| `npm run seed:dev`     | Seed local database                 | Development (.env.dev) |
| `npm run seed`         | Seed production database            | Production (.env)      |
| `npm run db:setup:dev` | Migrate + seed (dev)                | Development (.env.dev) |
| `npm run db:setup`     | Migrate + seed (prod)               | Production (.env)      |

---

## 📝 Notes

1. **Never commit `.env`** files with sensitive data (already in `.gitignore`)
2. `.env.dev` can be committed as it contains only local development config
3. For production deployment, set environment variables in Azure Portal
4. MongoDB local must be running for development mode
5. Use `npm run seed:dev` first time to populate local database

---

## 🐛 Troubleshooting

### Frontend not connecting to backend

- Check if backend is running: `http://localhost:5000/api/ping`
- Verify `VITE_API_URL` in `.env.dev`
- Restart dev server after changing `.env` files

### Backend connection errors

- MongoDB local not running: Start MongoDB service
- Wrong MongoDB URI: Check `MONGODB_URI` in `.env.dev`
- Port already in use: Change `PORT` in `.env.dev`

### Database empty

- Run seeder: `npm run seed:dev` (for local)
- Check MongoDB connection in logs
- Verify seeder output for errors
