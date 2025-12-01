# 🐧 Update untuk Deployment Linux

## ✅ Perubahan yang Sudah Dilakukan

### File yang Dihapus
- ❌ `backend/web.config` - Tidak diperlukan untuk Linux (hanya untuk IIS/Windows)

### File Baru untuk Linux
- ✅ `backend/startup.sh` - Bash script untuk startup Node.js di Linux container
- ✅ `DEPLOYMENT_GUIDE_LINUX.md` - Panduan lengkap deployment ke Linux
- ✅ `DEPLOYMENT_CHECKLIST_LINUX.md` - Checklist khusus Linux

### File yang Diupdate
- ✅ `backend/.deployment` - Ditambahkan `WEBSITE_NODE_DEFAULT_VERSION=18-lts`
- ✅ `backend/.env.production` - Updated header untuk Azure Linux

---

## 🔑 Perbedaan Utama: Windows vs Linux

| Aspek | Windows (IIS) | Linux (Native Node) |
|-------|---------------|---------------------|
| **Config File** | `web.config` (XML) | `startup.sh` (Bash) |
| **Web Server** | IIS + iisnode | Native Node.js |
| **Runtime** | Via IIS | Direct Node process |
| **Path Style** | `\` dan `/` | `/` saja |
| **Case Sensitive** | No | Yes |
| **Line Endings** | CRLF | LF |
| **Startup** | Via IIS handlers | Via startup command |

---

## 📋 Checklist Penting untuk Linux

### 1. Line Endings (PENTING!)
```bash
# Set Git untuk menggunakan LF
git config core.autocrlf false
git config core.eol lf

# Verify file
file backend/startup.sh
# Seharusnya: "POSIX shell script, ASCII text executable"
```

### 2. File Permissions
```bash
# Make startup script executable (jika perlu)
chmod +x backend/startup.sh
```

### 3. Case Sensitivity
```javascript
// ✅ Correct - pastikan case match dengan nama file sebenarnya
import User from "./models/User.js"

// ❌ Error di Linux jika file sebenarnya User.js
import User from "./models/user.js"
```

### 4. Path Separators
```javascript
// ✅ Gunakan forward slash atau path.join()
const filePath = "src/index.js"
const filePath = path.join("src", "index.js")

// ❌ Jangan gunakan backslash
const filePath = "src\\index.js"  // Error di Linux
```

---

## 🚀 Command Azure CLI untuk Linux

### Buat App Service Plan (Linux)
```bash
az appservice plan create \
  --name bri-plan \
  --resource-group bri-rg \
  --sku F1 \
  --is-linux  # ← PENTING untuk Linux!
```

### Buat Web App dengan Node.js Runtime
```bash
az webapp create \
  --resource-group bri-rg \
  --plan bri-plan \
  --name bri-backend-api \
  --runtime "NODE:18-lts"  # ← Runtime Linux
```

### Set Startup Command
```bash
az webapp config set \
  --resource-group bri-rg \
  --name bri-backend-api \
  --startup-file "node src/index.js"
```

### Deploy via ZIP
```bash
cd backend

# Create zip (exclude node_modules)
zip -r deploy.zip . -x "node_modules/*" -x ".git/*" -x ".env*" -x "*.log"

# Deploy
az webapp deployment source config-zip \
  --resource-group bri-rg \
  --name bri-backend-api \
  --src deploy.zip

# Clean up
rm deploy.zip
```

---

## 🔧 Troubleshooting Linux

### Problem: "command not found" atau "$'\r': command not found"

**Cause:** File menggunakan Windows line endings (CRLF)

**Solution:**
```bash
# Install dos2unix
# Ubuntu/Debian: sudo apt install dos2unix
# macOS: brew install dos2unix

# Convert file
dos2unix backend/startup.sh

# Verify
file backend/startup.sh
```

### Problem: Permission denied saat execute script

**Solution:**
```bash
chmod +x backend/startup.sh
```

### Problem: Module not found di production

**Check deployment logs:**
```bash
az webapp log tail --name bri-backend-api --resource-group bri-rg
```

**Pastikan build berjalan:**
```bash
az webapp config appsettings set \
  --name bri-backend-api \
  --resource-group bri-rg \
  --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

---

## 📝 Environment Variables Tambahan untuk Linux

```bash
# Set saat create/update app settings
az webapp config appsettings set \
  --name bri-backend-api \
  --resource-group bri-rg \
  --settings \
    PORT=8080 \
    NODE_ENV=production \
    MONGODB_URI="..." \
    JWT_SECRET="..." \
    CORS_ORIGIN="..." \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true \
    WEBSITE_NODE_DEFAULT_VERSION=18-lts
```

---

## ✅ Testing Checklist

Setelah deploy ke Linux, test:

```bash
# Health check
curl https://bri-backend-api.azurewebsites.net/api/ping

# With headers
curl -v https://bri-backend-api.azurewebsites.net/api/ping

# Stock API
curl https://bri-backend-api.azurewebsites.net/api/stock/bbri

# Check response time
time curl https://bri-backend-api.azurewebsites.net/api/ping
```

---

## 🎯 Next Steps

1. **Commit perubahan:**
   ```bash
   git add .
   git commit -m "chore: configure for Linux deployment"
   git push origin main
   ```

2. **Ikuti deployment guide:**
   - Baca: `DEPLOYMENT_GUIDE_LINUX.md`
   - Checklist: `DEPLOYMENT_CHECKLIST_LINUX.md`

3. **Deploy:**
   - MongoDB Atlas → Backend Azure Linux → Frontend Vercel

---

## 📚 Resources

- [Azure App Service Linux](https://docs.microsoft.com/azure/app-service/containers/)
- [Node.js on Linux](https://docs.microsoft.com/azure/app-service/quickstart-nodejs)
- [Bash scripting guide](https://www.gnu.org/software/bash/manual/)

---

**Status:** ✅ Configured for Linux deployment!

**Recommended:** Free tier (F1) untuk testing, upgrade ke B1 ($13/month) untuk production.
