# 📋 Deployment Checklist - BRImo (Linux)

## ✅ File Persiapan yang Sudah Dibuat

### Backend (Azure App Service - Linux)

- [x] `backend/.deployment` - Azure deployment configuration untuk Linux
- [x] `backend/startup.sh` - Startup script untuk Linux container
- [x] `backend/.env.production` - Template environment variables
- [x] `backend/src/index.js` - CORS configuration untuk production
- [x] `backend/.gitignore` - Updated untuk ignore .env files
- [x] ~~`backend/web.config`~~ - **DIHAPUS** (tidak diperlukan untuk Linux)

### Frontend (Vercel)

- [x] `frontend/vercel.json` - Vercel configuration
- [x] `frontend/.env.production` - Production API URL
- [x] `frontend/.env.example` - Template environment variables
- [x] `frontend/src/components/InfoSahamBRI.jsx` - Fixed hardcoded URL
- [x] `frontend/.gitignore` - Updated untuk ignore .env files

### Documentation

- [x] `DEPLOYMENT_GUIDE_LINUX.md` - Panduan deployment lengkap untuk Linux
- [x] `DEPLOYMENT_CHECKLIST.md` - Checklist untuk tracking progress

---

## 🐧 Perbedaan Linux vs Windows

### ❌ Tidak Diperlukan di Linux:
- `web.config` (hanya untuk IIS/Windows)
- IIS-specific configurations

### ✅ Khusus untuk Linux:
- `startup.sh` - Bash script untuk startup
- Node.js runtime langsung (bukan via IIS)
- Case-sensitive file paths
- LF line endings (bukan CRLF)

---

## 🎯 Langkah Deployment

### 1️⃣ MongoDB Atlas

- [ ] Buat cluster di MongoDB Atlas
- [ ] Buat database user & password
- [ ] Whitelist IP: 0.0.0.0/0
- [ ] Dapatkan connection string
- [ ] (Optional) Seed database dengan test users

### 2️⃣ Azure App Service (Backend - Linux)

- [ ] Install Azure CLI
- [ ] Login ke Azure: `az login`
- [ ] Buat resource group: `bri-rg`
- [ ] Buat app service plan dengan `--is-linux` flag
- [ ] Buat web app dengan runtime `NODE:18-lts`
- [ ] Generate JWT secret (64+ characters)
- [ ] Set environment variables di Azure
- [ ] Set startup command: `node src/index.js`
- [ ] Deploy backend (via GitHub atau ZIP)
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

### Azure App Service (Backend - Linux)

```bash
PORT=8080
NODE_ENV=production
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/brimo_db
JWT_SECRET=<64-char-random-string>
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=https://your-app.vercel.app,http://localhost:3000
API_TIMEOUT=15000
STOCK_CACHE_TIME=300000
STOCK_FALLBACK_ENABLED=true
SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

### Vercel (Frontend)

```bash
VITE_API_URL=https://bri-backend-api.azurewebsites.net/api
```

---

## 🚀 Quick Deploy Commands (Linux/macOS)

### Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Create Resource Group

```bash
az group create --name bri-rg --location southeastasia
```

### Create Linux App Service Plan

```bash
az appservice plan create \
  --name bri-plan \
  --resource-group bri-rg \
  --sku F1 \
  --is-linux
```

### Create Web App (Linux)

```bash
az webapp create \
  --resource-group bri-rg \
  --plan bri-plan \
  --name bri-backend-api \
  --runtime "NODE:18-lts"
```

### Set Startup Command

```bash
az webapp config set \
  --resource-group bri-rg \
  --name bri-backend-api \
  --startup-file "node src/index.js"
```

### Deploy Backend (ZIP)

```bash
cd backend
zip -r deploy.zip . -x "node_modules/*" -x ".git/*" -x ".env*"
az webapp deployment source config-zip \
  --resource-group bri-rg \
  --name bri-backend-api \
  --src deploy.zip
rm deploy.zip
```

### Deploy Frontend (Vercel CLI)

```bash
cd frontend
vercel --prod
```

### View Logs

```bash
az webapp log tail --name bri-backend-api --resource-group bri-rg
```

---

## 🔧 Troubleshooting Linux-Specific

### Problem: Permission Denied

**Cause:** Script tidak executable

**Solution:**

```bash
chmod +x backend/startup.sh
git add backend/startup.sh
git commit -m "fix: make startup.sh executable"
```

### Problem: Line Ending Issues (CRLF vs LF)

**Symptoms:** Script error `\r: command not found`

**Solution:**

```bash
# Convert CRLF to LF
dos2unix backend/startup.sh

# Or using Git
git config core.autocrlf false
git config core.eol lf

# Fix existing files
git rm --cached -r .
git reset --hard
```

### Problem: Case Sensitivity

**Linux is case-sensitive!** `Index.js` ≠ `index.js`

**Solution:** Pastikan semua import/require menggunakan case yang benar

### Problem: Module Not Found after Deploy

**Check:**

```bash
# SSH to container
az webapp ssh --name bri-backend-api --resource-group bri-rg

# Check if node_modules installed
ls -la /home/site/wwwroot/

# Manual install
cd /home/site/wwwroot
npm install --production
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

## ✅ Production Ready Checklist

- [x] Environment variables tidak ter-commit ke Git
- [x] CORS configured dengan URL production
- [x] Hardcoded URLs diganti dengan environment variables
- [x] .gitignore updated untuk security
- [x] Linux-compatible configurations (no web.config)
- [x] Startup script untuk Linux siap
- [x] Line endings set ke LF
- [ ] MongoDB Atlas cluster siap
- [ ] Backend deployed & running di Linux
- [ ] Frontend deployed & running
- [ ] Testing completed
- [ ] DNS/Custom domain configured (optional)

---

## 🐧 Linux Best Practices

### File Permissions

```bash
# Make scripts executable
chmod +x backend/startup.sh
```

### Line Endings

```bash
# Set Git to use LF
git config --global core.autocrlf false
git config --global core.eol lf
```

### Path Separators

```javascript
// ❌ Windows style
const path = "backend\\src\\index.js";

// ✅ Linux style (works on both)
const path = "backend/src/index.js";
const path = require('path').join('backend', 'src', 'index.js');
```

### Environment Variables

```bash
# Linux/macOS
export MONGODB_URI="mongodb+srv://..."

# Check variable
echo $MONGODB_URI
```

---

## 📚 Resources

- [Deployment Guide Linux Lengkap](./DEPLOYMENT_GUIDE_LINUX.md)
- [Azure Linux App Service Docs](https://docs.microsoft.com/azure/app-service/containers/)
- [Node.js on Azure Linux](https://docs.microsoft.com/azure/app-service/quickstart-nodejs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

---

**Status:** ✅ Persiapan Linux selesai, siap untuk deployment!

**Next:** Ikuti [DEPLOYMENT_GUIDE_LINUX.md](./DEPLOYMENT_GUIDE_LINUX.md) untuk step-by-step deployment.
