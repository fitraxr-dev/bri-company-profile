# 🐧 Deployment Guide for Linux - BRImo

## 📌 Overview

Aplikasi BRImo akan di-deploy ke:
- **Frontend**: Vercel (https://vercel.com)
- **Backend**: Azure App Service - Linux Container
- **Database**: MongoDB Atlas (https://cloud.mongodb.com)

---

## 🗄️ LANGKAH 1: Setup MongoDB Atlas

### 1.1 Buat Akun & Cluster

1. Kunjungi https://cloud.mongodb.com dan daftar/login
2. Klik **"Build a Database"** atau **"Create Cluster"**
3. Pilih **FREE** tier (M0 Sandbox - 512MB)
4. Pilih region terdekat (Singapore/Jakarta untuk performa optimal)
5. Klik **"Create Cluster"** (tunggu 3-5 menit)

### 1.2 Konfigurasi Database Access

1. Di sidebar kiri, klik **"Database Access"**
2. Klik **"Add New Database User"**
3. Pilih **"Password"** authentication
   - Username: `brimo_admin` (atau sesuai keinginan)
   - Password: **Generate Secure Password** (simpan password ini!)
4. Database User Privileges: **"Read and write to any database"**
5. Klik **"Add User"**

### 1.3 Konfigurasi Network Access

1. Di sidebar kiri, klik **"Network Access"**
2. Klik **"Add IP Address"**
3. Klik **"Allow Access from Anywhere"** (IP: `0.0.0.0/0`)
   - ⚠️ Untuk production yang lebih aman, whitelist hanya IP Azure nanti
4. Klik **"Confirm"**

### 1.4 Dapatkan Connection String

1. Kembali ke **"Database"** (sidebar kiri)
2. Klik tombol **"Connect"** pada cluster Anda
3. Pilih **"Connect your application"**
4. Driver: **Node.js**, Version: **4.1 or later**
5. Copy **Connection String**:
   ```
   mongodb+srv://brimo_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Ganti `<password>`** dengan password yang Anda simpan tadi
7. Tambahkan database name: `/brimo_db` sebelum `?`
   ```
   mongodb+srv://brimo_admin:PASSWORD123@cluster0.xxxxx.mongodb.net/brimo_db?retryWrites=true&w=majority
   ```

### 1.5 (Opsional) Seed Database

Jika ingin mengisi data awal (user test):

```bash
cd backend

# Set environment variable
export MONGODB_URI="mongodb+srv://brimo_admin:PASSWORD@cluster0.xxxxx.mongodb.net/brimo_db"

# Jalankan migration & seed
npm run migrate
npm run seed
```

✅ **MongoDB Atlas siap!** Simpan Connection String untuk langkah berikutnya.

---

## ☁️ LANGKAH 2: Deploy Backend ke Azure App Service (Linux)

### 2.1 Persiapan (Install Azure CLI)

**Install Azure CLI:**

```bash
# Ubuntu/Debian
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# macOS
brew install azure-cli

# Windows (PowerShell)
winget install -e --id Microsoft.AzureCLI
```

**Verifikasi instalasi:**
```bash
az --version
```

### 2.2 Login ke Azure

```bash
az login
```

Browser akan terbuka, login dengan akun Microsoft/Azure Anda.

### 2.3 Set Subscription (jika punya multiple subscriptions)

```bash
# Lihat daftar subscriptions
az account list --output table

# Set subscription yang akan digunakan
az account set --subscription "SUBSCRIPTION_ID_ATAU_NAME"
```

### 2.4 Buat Resource Group

```bash
az group create --name bri-rg --location southeastasia
```

**Location options:** `southeastasia` (Singapore), `eastasia` (Hong Kong), `japaneast` (Tokyo)

### 2.5 Buat App Service Plan (Linux)

```bash
# Free tier (F1) - untuk testing
az appservice plan create \
  --name bri-plan \
  --resource-group bri-rg \
  --sku F1 \
  --is-linux

# Atau Basic B1 - untuk production (recommended)
# az appservice plan create \
#   --name bri-plan \
#   --resource-group bri-rg \
#   --sku B1 \
#   --is-linux
```

### 2.6 Buat Web App dengan Node.js Runtime

```bash
az webapp create \
  --resource-group bri-rg \
  --plan bri-plan \
  --name bri-backend-api \
  --runtime "NODE:18-lts"
```

⚠️ **Nama `bri-backend-api` harus unik secara global!** Jika sudah dipakai, gunakan nama lain seperti:
- `bri-backend-api-yourname`
- `brimo-api-2024`
- dll.

URL akan menjadi: `https://bri-backend-api.azurewebsites.net`

### 2.7 Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Simpan output-nya (64+ karakter random).

### 2.8 Set Environment Variables

```bash
az webapp config appsettings set \
  --name bri-backend-api \
  --resource-group bri-rg \
  --settings \
    PORT=8080 \
    NODE_ENV=production \
    MONGODB_URI="mongodb+srv://brimo_admin:PASSWORD@cluster0.xxxxx.mongodb.net/brimo_db?retryWrites=true&w=majority" \
    JWT_SECRET="your-generated-64-char-secret" \
    JWT_EXPIRES_IN=7d \
    BCRYPT_ROUNDS=10 \
    CORS_ORIGIN="https://your-app.vercel.app,http://localhost:3000" \
    API_TIMEOUT=15000 \
    STOCK_CACHE_TIME=300000 \
    STOCK_FALLBACK_ENABLED=true \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

⚠️ **Ganti:**
- `PASSWORD` dengan MongoDB password Anda
- `cluster0.xxxxx` dengan cluster URL Anda
- `your-generated-64-char-secret` dengan JWT secret yang di-generate
- `https://your-app.vercel.app` akan diupdate setelah deploy Vercel (langkah 3)

### 2.9 Set Startup Command

```bash
az webapp config set \
  --resource-group bri-rg \
  --name bri-backend-api \
  --startup-file "node src/index.js"
```

### 2.10 Deploy Backend ke Azure

**Opsi A: Deploy dari Local Zip (Recommended untuk testing)**

```bash
cd backend

# Create deployment package (exclude node_modules)
zip -r deploy.zip . -x "node_modules/*" -x ".git/*" -x ".env*" -x "*.log"

# Deploy
az webapp deployment source config-zip \
  --resource-group bri-rg \
  --name bri-backend-api \
  --src deploy.zip

# Clean up
rm deploy.zip
```

**Opsi B: Deploy dari GitHub (Recommended untuk production)**

```bash
# Pastikan semua perubahan sudah di-commit dan di-push
git add .
git commit -m "chore: prepare for Linux deployment"
git push origin main

# Setup continuous deployment dari GitHub
az webapp deployment source config \
  --name bri-backend-api \
  --resource-group bri-rg \
  --repo-url https://github.com/fitraxr-dev/bri-company-profile \
  --branch main \
  --manual-integration

# Set deployment path (karena backend ada di subfolder)
az webapp config appsettings set \
  --name bri-backend-api \
  --resource-group bri-rg \
  --settings PROJECT=backend
```

### 2.11 Enable Logging

```bash
az webapp log config \
  --name bri-backend-api \
  --resource-group bri-rg \
  --application-logging filesystem \
  --detailed-error-messages true \
  --failed-request-tracing true \
  --web-server-logging filesystem
```

### 2.12 Test Backend

```bash
# Test health check
curl https://bri-backend-api.azurewebsites.net/api/ping

# Test stock API
curl https://bri-backend-api.azurewebsites.net/api/stock/bbri
```

Expected response untuk `/api/ping`:
```json
{
  "message": "pong",
  "timestamp": "2025-11-03T..."
}
```

### 2.13 View Logs (jika ada error)

```bash
# Stream logs
az webapp log tail --name bri-backend-api --resource-group bri-rg

# Atau download logs
az webapp log download --name bri-backend-api --resource-group bri-rg --log-file logs.zip
```

✅ **Backend Azure (Linux) siap!** Catat URL untuk langkah berikutnya.

---

## 🎨 LANGKAH 3: Deploy Frontend ke Vercel

### 3.1 Persiapan

1. Buat akun di https://vercel.com (gunakan GitHub untuk login)
2. Install Vercel CLI (optional):

```bash
npm i -g vercel
```

### 3.2 Update Environment Variable

Edit file `frontend/.env.production`:

```env
VITE_API_URL=https://bri-backend-api.azurewebsites.net/api
```

Ganti `bri-backend-api` dengan nama Azure App Service Anda.

```bash
# Commit perubahan
git add frontend/.env.production
git commit -m "chore: update production API URL"
git push origin main
```

### 3.3 Deploy via Vercel Dashboard (Recommended)

1. Login ke https://vercel.com/dashboard
2. Klik **"Add New..."** > **"Project"**
3. Import dari GitHub: pilih repository **`bri-company-profile`**
4. Configure Project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` ⬅️ **PENTING!**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Environment Variables** (klik "Add"):
   ```
   Name: VITE_API_URL
   Value: https://bri-backend-api.azurewebsites.net/api
   ```

6. Klik **"Deploy"**

Tunggu 2-3 menit. Setelah selesai, Anda akan mendapat URL seperti:
```
https://bri-company-profile-xxxxx.vercel.app
```

### 3.4 Deploy via Vercel CLI (Alternative)

```bash
cd frontend

# Login
vercel login

# Deploy production
vercel --prod
```

Ikuti prompt:
- Set up and deploy: **Y**
- Which scope: (pilih account Anda)
- Link to existing project: **N**
- Project name: `bri-company-profile`
- Directory: `./` (sudah di folder frontend)
- Override settings: **N**

✅ **Frontend Vercel siap!** Catat URL Vercel Anda.

---

## 🔄 LANGKAH 4: Update CORS di Backend

Setelah dapat URL Vercel, update CORS di Azure:

```bash
az webapp config appsettings set \
  --name bri-backend-api \
  --resource-group bri-rg \
  --settings CORS_ORIGIN="https://bri-company-profile-xxxxx.vercel.app,http://localhost:3000"
```

Ganti `bri-company-profile-xxxxx` dengan URL Vercel Anda (tanpa trailing slash).

**Restart Backend:**
```bash
az webapp restart --name bri-backend-api --resource-group bri-rg
```

---

## ✅ LANGKAH 5: Testing Aplikasi Production

### 5.1 Test Backend

```bash
# Health check
curl https://bri-backend-api.azurewebsites.net/api/ping

# Stock API
curl https://bri-backend-api.azurewebsites.net/api/stock/bbri

# Test with verbose
curl -v https://bri-backend-api.azurewebsites.net/api/ping
```

### 5.2 Test Frontend

Buka browser ke: `https://your-app.vercel.app`

**Test fitur:**
- ✅ Homepage loading
- ✅ Navbar & Footer
- ✅ Stock info (real-time)
- ✅ Login page
- ✅ Signup (buat akun baru)
- ✅ Dashboard (setelah login)
- ✅ Transfer antar user
- ✅ History transaksi
- ✅ Language switcher (ID/EN)
- ✅ Logout

### 5.3 Test Login

**Gunakan test account:**
```
Email: john.doe@example.com
Password: Password123
```

Atau buat akun baru via Signup.

---

## 🔧 TROUBLESHOOTING

### Problem: Application Error atau 502 Bad Gateway

**Check logs:**
```bash
az webapp log tail --name bri-backend-api --resource-group bri-rg
```

**Common causes:**
- Node.js version mismatch
- Missing startup command
- MongoDB connection error
- Missing environment variables

**Solution:**
```bash
# Verify runtime
az webapp config show --name bri-backend-api --resource-group bri-rg --query linuxFxVersion

# Restart app
az webapp restart --name bri-backend-api --resource-group bri-rg
```

### Problem: CORS Error

**Symptom:** Frontend tidak bisa akses backend, error di console:
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Cek CORS_ORIGIN di Azure settings include URL Vercel yang benar
2. Pastikan format: `https://domain.com,https://domain2.com` (comma-separated, no spaces)
3. Restart Azure App Service
4. Clear browser cache

### Problem: Module Not Found

**Check logs dan verify build:**
```bash
# SSH ke container (jika enabled)
az webapp ssh --name bri-backend-api --resource-group bri-rg

# Or check deployment logs
az webapp log deployment show --name bri-backend-api --resource-group bri-rg
```

**Solution:**
```bash
# Ensure SCM_DO_BUILD_DURING_DEPLOYMENT is true
az webapp config appsettings set \
  --name bri-backend-api \
  --resource-group bri-rg \
  --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

### Problem: MongoDB Connection Timeout

**Check:**
1. MongoDB Atlas cluster running
2. IP `0.0.0.0/0` whitelisted di Network Access
3. Username & password correct di connection string
4. Connection string format correct

**Test connection:**
```bash
# SSH ke Azure App Service
az webapp ssh --name bri-backend-api --resource-group bri-rg

# Test MongoDB connection
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(e => console.error(e));"
```

---

## 🔄 UPDATE & REDEPLOY

### Update Backend

```bash
# Commit changes
git add .
git commit -m "feat: new feature"
git push origin main

# If using GitHub deployment, Azure auto-deploys
# Or manual zip deploy:
cd backend
zip -r deploy.zip . -x "node_modules/*" -x ".git/*"
az webapp deployment source config-zip \
  --resource-group bri-rg \
  --name bri-backend-api \
  --src deploy.zip
rm deploy.zip
```

### Update Frontend

```bash
# Commit & push
git add .
git commit -m "feat: new feature"
git push origin main

# Vercel auto-deploys if connected to GitHub
# Or manual:
cd frontend
vercel --prod
```

---

## 💰 BIAYA

### Free Tier Limits:

**MongoDB Atlas (M0):**
- ✅ 512MB storage
- ✅ Unlimited connections
- ✅ Free forever

**Azure App Service Linux (F1):**
- ✅ 1GB RAM
- ✅ 1GB storage
- ✅ 60 minutes/day CPU time
- ⚠️ Untuk production serius, upgrade ke B1 ($13/month)

**Vercel (Hobby):**
- ✅ 100GB bandwidth
- ✅ Unlimited requests
- ✅ Free untuk personal projects

---

## 🐧 Linux-Specific Notes

### Perbedaan dengan Windows/IIS:

1. **No web.config needed** - Linux menggunakan startup command langsung
2. **Case-sensitive paths** - `Index.js` ≠ `index.js`
3. **Forward slashes only** - `/path/to/file` bukan `\path\to\file`
4. **Line endings** - Gunakan LF bukan CRLF (set di Git: `git config core.autocrlf false`)
5. **Permissions** - Script files perlu executable permission

### Best Practices:

```bash
# Set Git line endings untuk Linux
git config core.autocrlf false
git config core.eol lf

# Verify files
file backend/startup.sh  # should show: "POSIX shell script"
```

---

## 📝 CHECKLIST AKHIR

- [ ] MongoDB Atlas cluster running
- [ ] Backend deployed ke Azure Linux
- [ ] Backend health check OK (`/api/ping`)
- [ ] Frontend deployed ke Vercel
- [ ] CORS configured dengan Vercel URL
- [ ] Environment variables set (Azure & Vercel)
- [ ] Startup command configured
- [ ] Logs enabled dan accessible
- [ ] Test login/signup works
- [ ] Test transfer feature works
- [ ] Test stock API works
- [ ] Test language switcher works

---

## 🎉 SELESAI!

Aplikasi BRImo Anda sudah live di production dengan Linux backend!

**URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://bri-backend-api.azurewebsites.net`
- Database: MongoDB Atlas

**Monitoring:**
```bash
# Real-time logs
az webapp log tail --name bri-backend-api --resource-group bri-rg

# Metrics
az monitor metrics list --resource bri-backend-api --resource-group bri-rg --resource-type "Microsoft.Web/sites"
```

---

## 📞 SUPPORT

**Azure Docs:**
- Linux App Service: https://docs.microsoft.com/azure/app-service/containers/
- Node.js on Azure: https://docs.microsoft.com/azure/app-service/quickstart-nodejs

**Vercel:** https://vercel.com/docs

**MongoDB Atlas:** https://docs.atlas.mongodb.com/
