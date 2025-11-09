# 🚀 Panduan Deployment BRImo ke Production

## 📌 Overview

Aplikasi BRImo akan di-deploy ke:
- **Frontend**: Vercel (https://vercel.com)
- **Backend**: Azure App Service (https://portal.azure.com)
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

```powershell
cd backend

# Buat file .env sementara dengan MongoDB Atlas URI
echo "MONGODB_URI=mongodb+srv://brimo_admin:PASSWORD@cluster0.xxxxx.mongodb.net/brimo_db" > .env.temp

# Jalankan migration & seed
$env:MONGODB_URI="mongodb+srv://brimo_admin:PASSWORD@cluster0.xxxxx.mongodb.net/brimo_db"
npm run migrate
npm run seed

# Hapus file temporary
Remove-Item .env.temp
```

✅ **MongoDB Atlas siap!** Simpan Connection String untuk langkah berikutnya.

---

## ☁️ LANGKAH 2: Deploy Backend ke Azure App Service

### 2.1 Persiapan (Install Azure CLI)

**Download & Install Azure CLI:**
- Windows: https://aka.ms/installazurecliwindows
- Atau via winget: `winget install -e --id Microsoft.AzureCLI`

**Verifikasi instalasi:**
```powershell
az --version
```

### 2.2 Login ke Azure

```powershell
az login
```

Browser akan terbuka, login dengan akun Microsoft/Azure Anda.

### 2.3 Set Subscription (jika punya multiple subscriptions)

```powershell
# Lihat daftar subscriptions
az account list --output table

# Set subscription yang akan digunakan
az account set --subscription "SUBSCRIPTION_ID_ATAU_NAME"
```

### 2.4 Buat Resource Group

```powershell
az group create --name bri-rg --location southeastasia
```

**Location options:** `southeastasia` (Singapore), `eastasia` (Hong Kong), `japaneast` (Tokyo)

### 2.5 Buat App Service Plan

```powershell
# Free tier (F1)
az appservice plan create --name bri-plan --resource-group bri-rg --sku F1 --is-linux

# Atau jika ingin performa lebih baik (B1 - Basic)
# az appservice plan create --name bri-plan --resource-group bri-rg --sku B1 --is-linux
```

### 2.6 Buat Web App

```powershell
az webapp create `
  --resource-group bri-rg `
  --plan bri-plan `
  --name bri-backend-api `
  --runtime "NODE:18-lts"
```

⚠️ **Nama `bri-backend-api` harus unik secara global!** Jika sudah dipakai, gunakan nama lain seperti:
- `bri-backend-api-yourname`
- `brimo-api-2024`
- dll.

URL akan menjadi: `https://bri-backend-api.azurewebsites.net`

### 2.7 Generate JWT Secret

```powershell
# Generate strong random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Simpan output-nya (64+ karakter random).

### 2.8 Set Environment Variables

```powershell
az webapp config appsettings set --name bri-backend-api --resource-group bri-rg --settings `
  PORT=8080 `
  NODE_ENV=production `
  MONGODB_URI="mongodb+srv://brimo_admin:PASSWORD@cluster0.xxxxx.mongodb.net/brimo_db?retryWrites=true&w=majority" `
  JWT_SECRET="your-generated-64-char-secret" `
  JWT_EXPIRES_IN=7d `
  BCRYPT_ROUNDS=10 `
  CORS_ORIGIN="https://your-app.vercel.app" `
  API_TIMEOUT=15000 `
  STOCK_CACHE_TIME=300000 `
  STOCK_FALLBACK_ENABLED=true
```

⚠️ **Ganti:**
- `PASSWORD` dengan MongoDB password Anda
- `cluster0.xxxxx` dengan cluster URL Anda
- `your-generated-64-char-secret` dengan JWT secret yang di-generate
- `https://your-app.vercel.app` akan diupdate setelah deploy Vercel (langkah 3)

### 2.9 Deploy Backend ke Azure

**Opsi A: Deploy dari GitHub (Recommended)**

```powershell
# Pastikan semua perubahan sudah di-commit dan di-push ke GitHub
cd ..
git add .
git commit -m "chore: prepare for deployment"
git push origin main

# Setup continuous deployment dari GitHub
az webapp deployment source config --name bri-backend-api --resource-group bri-rg `
  --repo-url https://github.com/fitraxr-dev/bri-company-profile `
  --branch main `
  --manual-integration
```

**Opsi B: Deploy via ZIP (Lebih cepat untuk testing)**

```powershell
cd backend

# Zip semua files kecuali node_modules
Compress-Archive -Path * -DestinationPath deploy.zip -Force

# Deploy
az webapp deployment source config-zip --resource-group bri-rg --name bri-backend-api --src deploy.zip

# Hapus file zip
Remove-Item deploy.zip
```

### 2.10 Set Startup Command (Penting!)

```powershell
az webapp config set --resource-group bri-rg --name bri-backend-api --startup-file "node src/index.js"
```

### 2.11 Enable Logging (untuk debugging)

```powershell
az webapp log config --name bri-backend-api --resource-group bri-rg `
  --application-logging filesystem `
  --detailed-error-messages true `
  --failed-request-tracing true `
  --web-server-logging filesystem
```

### 2.12 Test Backend

```powershell
# Test health check
curl https://bri-backend-api.azurewebsites.net/api/ping

# Atau buka di browser:
# https://bri-backend-api.azurewebsites.net/api/ping
```

Expected response:
```json
{
  "message": "pong",
  "timestamp": "2025-11-03T..."
}
```

### 2.13 View Logs (jika ada error)

```powershell
az webapp log tail --name bri-backend-api --resource-group bri-rg
```

✅ **Backend Azure siap!** Catat URL untuk langkah berikutnya.

---

## 🎨 LANGKAH 3: Deploy Frontend ke Vercel

### 3.1 Persiapan

1. Buat akun di https://vercel.com (gunakan GitHub untuk login)
2. Install Vercel CLI (optional, bisa deploy via dashboard juga):

```powershell
npm i -g vercel
```

### 3.2 Update Environment Variable

Edit file `frontend/.env.production`:

```env
VITE_API_URL=https://bri-backend-api.azurewebsites.net/api
```

Ganti `bri-backend-api` dengan nama Azure App Service Anda.

```powershell
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

```powershell
cd frontend

# Login
vercel login

# Deploy preview
vercel

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

### 3.5 Set Custom Domain (Optional)

Di Vercel Dashboard:
1. Pilih project Anda
2. Settings > Domains
3. Add domain Anda (jika punya)

✅ **Frontend Vercel siap!** Catat URL Vercel Anda.

---

## 🔄 LANGKAH 4: Update CORS di Backend

Setelah dapat URL Vercel, update CORS di Azure:

```powershell
az webapp config appsettings set --name bri-backend-api --resource-group bri-rg --settings `
  CORS_ORIGIN="https://bri-company-profile-xxxxx.vercel.app,http://localhost:3000"
```

Ganti `bri-company-profile-xxxxx` dengan URL Vercel Anda (tanpa trailing slash).

Atau set multiple origins dengan koma separator:
```
CORS_ORIGIN="https://your-app.vercel.app,https://custom-domain.com,http://localhost:3000"
```

**Restart Backend:**
```powershell
az webapp restart --name bri-backend-api --resource-group bri-rg
```

---

## ✅ LANGKAH 5: Testing Aplikasi Production

### 5.1 Test Backend

```powershell
# Health check
curl https://bri-backend-api.azurewebsites.net/api/ping

# Stock API
curl https://bri-backend-api.azurewebsites.net/api/stock/bbri
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

### Problem: CORS Error

**Symptom:** Frontend tidak bisa akses backend, error di console:
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Cek CORS_ORIGIN di Azure settings include URL Vercel yang benar
2. Restart Azure App Service
3. Pastikan tidak ada trailing slash di URL

### Problem: 500 Error di Backend

**Check logs:**
```powershell
az webapp log tail --name bri-backend-api --resource-group bri-rg
```

**Common causes:**
- MongoDB connection string salah
- Environment variables tidak ter-set
- JWT_SECRET tidak ada

### Problem: Frontend tidak load API

**Check:**
1. Browser DevTools > Network tab
2. Pastikan `VITE_API_URL` ter-set di Vercel
3. Rebuild & redeploy Vercel jika perlu

### Problem: MongoDB Connection Error

**Check:**
1. MongoDB Atlas cluster running
2. IP `0.0.0.0/0` di-whitelist
3. Username & password benar di connection string
4. Database name `brimo_db` ada di connection string

---

## 🔄 UPDATE & REDEPLOY

### Update Backend

```powershell
# Commit changes
git add .
git commit -m "feat: new feature"
git push origin main

# Azure akan auto-deploy jika setup continuous deployment
# Atau manual deploy:
cd backend
Compress-Archive -Path * -DestinationPath deploy.zip -Force
az webapp deployment source config-zip --resource-group bri-rg --name bri-backend-api --src deploy.zip
Remove-Item deploy.zip
```

### Update Frontend

```powershell
# Commit & push
git add .
git commit -m "feat: new feature"
git push origin main

# Vercel auto-deploy jika connected ke GitHub
# Atau manual:
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

**Azure App Service (F1):**
- ✅ 1GB RAM
- ✅ 1GB storage
- ✅ 60 minutes/day CPU time
- ⚠️ Untuk production serius, upgrade ke B1 ($13/month)

**Vercel (Hobby):**
- ✅ 100GB bandwidth
- ✅ Unlimited requests
- ✅ Free untuk personal projects

---

## 📝 CHECKLIST AKHIR

- [ ] MongoDB Atlas cluster running
- [ ] Backend deployed ke Azure
- [ ] Backend health check OK (`/api/ping`)
- [ ] Frontend deployed ke Vercel
- [ ] CORS configured dengan Vercel URL
- [ ] Environment variables set (Azure & Vercel)
- [ ] Test login/signup works
- [ ] Test transfer feature works
- [ ] Test stock API works
- [ ] Test language switcher works

---

## 🎉 SELESAI!

Aplikasi BRImo Anda sudah live di production!

**URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://bri-backend-api.azurewebsites.net`
- Database: MongoDB Atlas

**Next Steps:**
- Setup custom domain (optional)
- Setup monitoring (Azure Application Insights, Vercel Analytics)
- Setup backup untuk database
- Setup CI/CD pipeline (GitHub Actions)

---

## 📞 SUPPORT

Jika ada masalah:
1. Check logs: `az webapp log tail --name bri-backend-api --resource-group bri-rg`
2. Check Vercel logs: Dashboard > Project > Deployments > View Logs
3. Check MongoDB Atlas logs: Dashboard > Metrics

**Dokumentasi:**
- Azure: https://docs.microsoft.com/azure/app-service/
- Vercel: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com/
