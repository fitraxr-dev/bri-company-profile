# 📋 Deployment Checklist - BRImo

## ✅ File Persiapan yang Sudah Dibuat

### Backend (Azure App Service)
- [x] `backend/web.config` - IIS configuration untuk Azure
- [x] `backend/.deployment` - Azure deployment settings
- [x] `backend/.env.production` - Template environment variables
- [x] `backend/src/index.js` - Updated CORS configuration
- [x] `backend/.gitignore` - Updated untuk ignore .env files

### Frontend (Vercel)
- [x] `frontend/vercel.json` - Vercel configuration
- [x] `frontend/.env.production` - Production API URL
- [x] `frontend/.env.example` - Template environment variables
- [x] `frontend/src/components/InfoSahamBRI.jsx` - Fixed hardcoded URL
- [x] `frontend/.gitignore` - Updated untuk ignore .env files

### Documentation
- [x] `DEPLOYMENT_GUIDE.md` - Panduan deployment lengkap step-by-step

---

## 🎯 Langkah Deployment

### 1️⃣ MongoDB Atlas
- [ ] Buat cluster di MongoDB Atlas
- [ ] Buat database user & password
- [ ] Whitelist IP: 0.0.0.0/0
- [ ] Dapatkan connection string
- [ ] (Optional) Seed database dengan test users

### 2️⃣ Azure App Service (Backend)
- [ ] Install Azure CLI
- [ ] Login ke Azure: `az login`
- [ ] Buat resource group: `bri-rg`
- [ ] Buat app service plan (F1 atau B1)
- [ ] Buat web app dengan nama unik
- [ ] Generate JWT secret (64+ characters)
- [ ] Set environment variables di Azure
- [ ] Deploy backend (via GitHub atau ZIP)
- [ ] Set startup command: `node src/index.js`
- [ ] Enable logging
- [ ] Test: `/api/ping` endpoint

### 3️⃣ Vercel (Frontend)
- [ ] Login ke Vercel dengan GitHub
- [ ] Import repository dari GitHub
- [ ] Set root directory: `frontend`
- [ ] Set environment variable: `VITE_API_URL`
- [ ] Deploy project
- [ ] Dapatkan Vercel URL

### 4️⃣ Update CORS
- [ ] Update `CORS_ORIGIN` di Azure dengan Vercel URL
- [ ] Restart Azure App Service

### 5️⃣ Testing
- [ ] Test backend health check
- [ ] Test frontend homepage
- [ ] Test login/signup
- [ ] Test dashboard
- [ ] Test transfer feature
- [ ] Test history
- [ ] Test stock API
- [ ] Test language switcher

---

## 🔑 Environment Variables yang Diperlukan

### Azure App Service (Backend)
```
PORT=8080
NODE_ENV=production
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/brimo_db
JWT_SECRET=<64-char-random-string>
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=https://your-app.vercel.app
API_TIMEOUT=15000
STOCK_CACHE_TIME=300000
STOCK_FALLBACK_ENABLED=true
```

### Vercel (Frontend)
```
VITE_API_URL=https://bri-backend-api.azurewebsites.net/api
```

---

## 📝 Credentials yang Perlu Disimpan

- [ ] MongoDB Atlas Username
- [ ] MongoDB Atlas Password
- [ ] MongoDB Connection String
- [ ] JWT Secret (64+ characters)
- [ ] Azure Resource Group Name
- [ ] Azure App Service Name
- [ ] Azure App Service URL
- [ ] Vercel Project Name
- [ ] Vercel Deployment URL

---

## 🚀 Quick Deploy Commands

### Generate JWT Secret
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Deploy Backend (ZIP)
```powershell
cd backend
Compress-Archive -Path * -DestinationPath deploy.zip -Force
az webapp deployment source config-zip --resource-group bri-rg --name bri-backend-api --src deploy.zip
Remove-Item deploy.zip
```

### Deploy Frontend (CLI)
```powershell
cd frontend
vercel --prod
```

---

## 🔧 Troubleshooting

### CORS Error
- Pastikan Vercel URL ada di `CORS_ORIGIN`
- Restart Azure App Service
- Tidak ada trailing slash di URL

### Backend 500 Error
- Check logs: `az webapp log tail --name bri-backend-api --resource-group bri-rg`
- Verifikasi MongoDB connection string
- Verifikasi semua environment variables ter-set

### Frontend tidak load
- Check `VITE_API_URL` di Vercel settings
- Rebuild & redeploy jika perlu
- Check browser console untuk error

---

## 📚 Resources

- [Deployment Guide Lengkap](./DEPLOYMENT_GUIDE.md)
- [Azure CLI Docs](https://docs.microsoft.com/cli/azure/)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

---

## ✅ Production Ready Checklist

- [x] Environment variables tidak ter-commit ke Git
- [x] CORS configured dengan URL production
- [x] Hardcoded URLs diganti dengan environment variables
- [x] .gitignore updated untuk security
- [x] Backend config files untuk Azure siap
- [x] Frontend config files untuk Vercel siap
- [ ] MongoDB Atlas cluster siap
- [ ] Backend deployed & running
- [ ] Frontend deployed & running
- [ ] Testing completed
- [ ] DNS/Custom domain configured (optional)

---

**Status:** ✅ Persiapan selesai, siap untuk deployment!

**Next:** Ikuti [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) untuk step-by-step deployment.
