# 🚀 Vercel SPA Deployment Guide

## Masalah: 404 Error pada Direct URL Access

### **Penyebab:**

Ketika user mengakses URL langsung seperti `https://yourapp.vercel.app/login`, Vercel mencari file `/login/index.html` atau `/login` yang tidak ada. Ini menyebabkan error 404.

### **Solusi:**

Menggunakan `rewrites` di `vercel.json` untuk mengarahkan semua route ke `index.html`, sehingga React Router dapat menangani routing.

---

## ✅ Konfigurasi yang Sudah Diterapkan

### **File: `frontend/vercel.json`**

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/((?!assets|favicon.ico).*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "env": {
    "VITE_API_URL": "@vite_api_url"
  }
}
```

---

## 📋 Penjelasan Konfigurasi

### **1. Rewrites**

```json
"rewrites": [
  {
    "source": "/((?!assets|favicon.ico).*)",
    "destination": "/index.html"
  }
]
```

**Penjelasan:**

- **`source`**: Regex pattern yang match semua route KECUALI `/assets/*` dan `favicon.ico`
- **`destination`**: Semua request diarahkan ke `/index.html`
- **Hasil**: React Router dapat menangani routing di client-side

**Mengapa tidak `"source": "/(.*)"` saja?**

- Agar file static di folder `/assets` tidak di-redirect
- File seperti CSS, JS, images tetap dimuat langsung
- Performa lebih baik karena file static di-cache

### **2. Cache Headers untuk Assets**

```json
{
  "source": "/assets/(.*)",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "public, max-age=31536000, immutable"
    }
  ]
}
```

**Manfaat:**

- ✅ File di `/assets` di-cache selama 1 tahun (31536000 detik)
- ✅ Mengurangi bandwidth dan mempercepat load time
- ✅ `immutable` = browser tidak perlu revalidate

### **3. Security Headers**

```json
{
  "key": "X-Content-Type-Options",
  "value": "nosniff"
}
```

**Proteksi:**

- ✅ **X-Content-Type-Options**: Mencegah MIME-type sniffing
- ✅ **X-Frame-Options**: Mencegah clickjacking attack
- ✅ **X-XSS-Protection**: Proteksi tambahan dari XSS attack

---

## 🎯 Routes yang Berfungsi

Setelah konfigurasi ini, semua route berikut dapat diakses langsung:

### **Public Routes:**

```
✅ https://bri-company-profile.vercel.app/
✅ https://bri-company-profile.vercel.app/login
✅ https://bri-company-profile.vercel.app/signup
✅ https://bri-company-profile.vercel.app/articles
✅ https://bri-company-profile.vercel.app/article/artikel-slug-example
```

### **Protected Routes:**

```
✅ https://bri-company-profile.vercel.app/dashboard
✅ https://bri-company-profile.vercel.app/transfer
✅ https://bri-company-profile.vercel.app/history
```

### **Admin Routes:**

```
✅ https://bri-company-profile.vercel.app/admin/login
✅ https://bri-company-profile.vercel.app/admin/dashboard
✅ https://bri-company-profile.vercel.app/admin/articles/new
✅ https://bri-company-profile.vercel.app/admin/articles/edit/:id
```

---

## 🔧 Cara Deploy ke Vercel

### **Method 1: Via Vercel Dashboard (Recommended)**

1. **Login ke Vercel**

   ```
   https://vercel.com/login
   ```

2. **Import Project**

   - Click "Add New Project"
   - Connect GitHub repository: `fitraxr-dev/bri-company-profile`
   - Select repository

3. **Configure Build Settings**

   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**

   - Add variable: `VITE_API_URL`
   - Value: `https://bro-bank-dyafe0fferh8exe9.indonesiacentral-01.azurewebsites.net/api`

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Access your app at generated URL

### **Method 2: Via Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from frontend folder
cd frontend
vercel

# Follow prompts:
# - Project name: bri-company-profile
# - Root directory: ./
# - Build command: npm run build
# - Output directory: dist

# Deploy to production
vercel --prod
```

---

## 🧪 Testing Setelah Deploy

### **Test 1: Direct URL Access**

```bash
# Test semua route berfungsi
curl -I https://bri-company-profile.vercel.app/login
curl -I https://bri-company-profile.vercel.app/articles
curl -I https://bri-company-profile.vercel.app/dashboard

# Expected: Status 200 OK (bukan 404)
```

### **Test 2: Browser Console**

```javascript
// Buka browser console di Vercel site
console.log(import.meta.env.VITE_API_URL);
// Expected: "https://bro-bank-dyafe0fferh8exe9.indonesiacentral-01.azurewebsites.net/api"

// Test fetch
fetch(import.meta.env.VITE_API_URL + "/articles")
  .then((r) => r.json())
  .then((d) => console.log("Articles:", d));
```

### **Test 3: React Router Navigation**

1. Access `https://bri-company-profile.vercel.app/`
2. Click navigation ke `/login` → Should work ✅
3. Refresh browser di `/login` → Should work ✅ (tidak 404)
4. Copy URL `/login` dan paste di new tab → Should work ✅

---

## 📁 Struktur Folder Final

```
BRI Redesign/
├── frontend/
│   ├── dist/                    # Build output (generated)
│   │   ├── index.html
│   │   ├── assets/
│   │   │   ├── index-abc123.js
│   │   │   ├── index-def456.css
│   │   │   └── logo-ghi789.png
│   │   └── favicon.ico
│   ├── public/                  # Static files
│   │   └── favicon.ico
│   ├── src/
│   │   ├── App.jsx             # React Router setup
│   │   ├── main.jsx            # Entry point
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Articles.jsx
│   │   │   └── ...
│   │   └── ...
│   ├── vercel.json             # ✅ Vercel configuration
│   ├── vite.config.js
│   ├── package.json
│   └── index.html
└── backend/
    └── ...
```

---

## ⚙️ Environment Variables di Vercel

### **Setting Environment Variables:**

1. **Via Dashboard:**

   ```
   Vercel Dashboard → Project → Settings → Environment Variables
   ```

2. **Add Variable:**

   ```
   Name:  VITE_API_URL
   Value: https://bro-bank-dyafe0fferh8exe9.indonesiacentral-01.azurewebsites.net/api
   Scope: Production, Preview, Development (semua)
   ```

3. **Redeploy:**
   ```bash
   # Trigger redeploy setelah add env var
   git commit --allow-empty -m "Trigger redeploy"
   git push origin main
   ```

### **Verification:**

```javascript
// Di deployed app, buka console:
console.log(import.meta.env.VITE_API_URL);
// Should output: "https://bro-bank-dyafe0fferh8exe9.indonesiacentral-01.azurewebsites.net/api"
```

---

## 🐛 Troubleshooting

### **Issue 1: Masih 404 setelah deploy**

**Cause:** Vercel belum pick up `vercel.json`

**Solution:**

```bash
# Force redeploy
git add frontend/vercel.json
git commit -m "Update vercel.json with rewrites"
git push origin main

# Atau via Vercel Dashboard:
# Deployments → Latest → ... → Redeploy
```

### **Issue 2: Assets tidak load (404)**

**Cause:** Rewrite rule terlalu agresif

**Solution:** Pastikan regex di `vercel.json` exclude `/assets`:

```json
"source": "/((?!assets|favicon.ico).*)"
```

### **Issue 3: Environment variable tidak ter-load**

**Cause:** Variable name salah atau tidak di-prefix `VITE_`

**Solution:**

```bash
# HARUS pakai prefix VITE_ untuk Vite apps
✅ VITE_API_URL
❌ API_URL
❌ REACT_APP_API_URL (ini untuk CRA, bukan Vite)
```

### **Issue 4: Routing berfungsi di local tapi tidak di Vercel**

**Cause:** `vercel.json` tidak ada di root project yang benar

**Solution:**

```bash
# Pastikan vercel.json di folder frontend
frontend/vercel.json  ✅
vercel.json           ❌ (wrong location if root directory is frontend)

# Atau set root directory di Vercel Dashboard:
# Settings → Build & Development Settings → Root Directory = "frontend"
```

---

## 📊 Comparison: Rewrites vs Redirects

### **Rewrites (yang kita pakai):**

```json
"rewrites": [
  { "source": "/(.*)", "destination": "/index.html" }
]
```

- ✅ URL tetap sama di browser (`/login` tetap `/login`)
- ✅ Client-side routing works
- ✅ SEO friendly
- ✅ User tidak bingung

### **Redirects (JANGAN pakai untuk SPA):**

```json
"redirects": [
  { "source": "/(.*)", "destination": "/" }
]
```

- ❌ URL berubah di browser (`/login` → `/`)
- ❌ Break client-side routing
- ❌ Bad UX
- ❌ SEO issues

---

## 📖 Best Practices

### **1. Vercel.json Structure**

```json
{
  // Build configuration
  "buildCommand": "npm run build",
  "framework": "vite",
  "outputDirectory": "dist",

  // SPA routing (CRITICAL!)
  "rewrites": [
    {
      "source": "/((?!assets|favicon.ico).*)",
      "destination": "/index.html"
    }
  ],

  // Performance optimization
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],

  // Environment
  "env": {
    "VITE_API_URL": "@vite_api_url"
  }
}
```

### **2. Vite Config for Production**

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],

  // Base URL (default adalah "/")
  base: "/",

  // Build optimization
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
```

### **3. React Router Setup**

```javascript
// App.jsx
import { BrowserRouter } from "react-router-dom";

// ✅ Use BrowserRouter (bukan HashRouter)
<BrowserRouter>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<Login />} />
  </Routes>
</BrowserRouter>;

// ❌ JANGAN pakai HashRouter untuk production
// HashRouter menggunakan /#/login (tidak SEO friendly)
```

---

## 🎯 Checklist Deployment

Sebelum deploy, pastikan semua ini sudah ✅:

- [ ] `vercel.json` ada di folder `frontend/`
- [ ] `rewrites` sudah dikonfigurasi dengan benar
- [ ] Environment variable `VITE_API_URL` sudah diset di Vercel
- [ ] React Router menggunakan `BrowserRouter` (bukan `HashRouter`)
- [ ] Build local sukses: `npm run build`
- [ ] Preview build local: `npm run preview`
- [ ] Test semua route di preview local
- [ ] Push ke GitHub
- [ ] Vercel auto-deploy triggered
- [ ] Test direct URL access di Vercel deployment
- [ ] Test navigation di deployed app
- [ ] Test refresh di semua route

---

## 📞 Support

Jika masih ada masalah:

1. **Check Vercel Logs:**

   ```
   Vercel Dashboard → Deployments → Latest → Function Logs
   ```

2. **Check Build Logs:**

   ```
   Vercel Dashboard → Deployments → Latest → Build Logs
   ```

3. **Redeploy:**
   ```bash
   git commit --allow-empty -m "Redeploy"
   git push origin main
   ```

---

**Last Updated:** November 10, 2025  
**Vercel Docs:** https://vercel.com/docs/frameworks/vite  
**React Router Docs:** https://reactrouter.com/en/main/start/tutorial
