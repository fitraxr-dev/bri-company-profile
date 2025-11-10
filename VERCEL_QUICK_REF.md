# 🎯 Vercel SPA Routing - Quick Reference

## How It Works

```
User Request: https://yourapp.vercel.app/login
                            ↓
                    Vercel Server
                            ↓
              Check vercel.json rewrites
                            ↓
        Match: "/((?!assets|favicon.ico).*)"
                            ↓
            Return: /index.html (200 OK)
                            ↓
                    Browser loads HTML
                            ↓
                    React app initializes
                            ↓
                React Router sees URL = /login
                            ↓
            Render <Login /> component
                            ✅
```

---

## File Locations

```
frontend/
├── vercel.json           ← CRITICAL: Must exist here!
├── vite.config.js
├── package.json
├── index.html
└── src/
    └── App.jsx           ← BrowserRouter setup
```

---

## vercel.json - Essential Config

```json
{
  "rewrites": [
    {
      "source": "/((?!assets|favicon.ico).*)",
      "destination": "/index.html"
    }
  ]
}
```

**What this does:**

- ✅ `/login` → `/index.html` (React Router handles /login)
- ✅ `/articles` → `/index.html` (React Router handles /articles)
- ✅ `/dashboard` → `/index.html` (React Router handles /dashboard)
- ❌ `/assets/app.js` → `/assets/app.js` (served directly, NOT rewritten)

---

## Testing Checklist

### Before Deploy:

```bash
cd frontend
npm run build        # Build succeeds?
npm run preview      # Preview works?
# Open http://localhost:4173/login manually
```

### After Deploy:

```bash
# Test direct access
curl -I https://yourapp.vercel.app/login
# Should return: HTTP/2 200 (NOT 404)

# Test in browser
https://yourapp.vercel.app/login      ← Paste in address bar
https://yourapp.vercel.app/articles   ← Refresh page (F5)
https://yourapp.vercel.app/dashboard  ← Open in new tab
```

---

## Common Mistakes

### ❌ Wrong Location

```
vercel.json              ← Wrong! (in root)
frontend/vercel.json     ← Correct! (in frontend folder)
```

### ❌ Wrong Rewrite Pattern

```json
// This breaks static assets!
"rewrites": [{ "source": "/(.*)", "destination": "/" }]

// This is correct
"rewrites": [{ "source": "/((?!assets|favicon.ico).*)", "destination": "/index.html" }]
```

### ❌ Using Redirects Instead of Rewrites

```json
// BAD - URL changes in browser
"redirects": [{ "source": "/(.*)", "destination": "/" }]

// GOOD - URL stays the same
"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
```

### ❌ Using HashRouter

```jsx
// BAD - URLs like /#/login
import { HashRouter } from "react-router-dom";
<HashRouter>
  <Routes>...</Routes>
</HashRouter>;

// GOOD - URLs like /login
import { BrowserRouter } from "react-router-dom";
<BrowserRouter>
  <Routes>...</Routes>
</BrowserRouter>;
```

---

## Environment Variables

### Setting in Vercel Dashboard:

```
Project → Settings → Environment Variables

Name:  VITE_API_URL
Value: https://your-backend.azurewebsites.net/api
```

### Using in Code:

```javascript
// ✅ Correct (Vite)
const API_URL = import.meta.env.VITE_API_URL;

// ❌ Wrong (this is for Create React App)
const API_URL = process.env.REACT_APP_API_URL;
```

---

## Quick Fix if 404 Still Happens

```bash
# 1. Verify vercel.json location
ls frontend/vercel.json    # Should exist

# 2. Verify content
cat frontend/vercel.json   # Check rewrites section

# 3. Force redeploy
git add frontend/vercel.json
git commit -m "Add SPA rewrites config"
git push origin main

# 4. Check Vercel Dashboard
# Deployments → Latest → Build Logs
# Look for: "Found vercel.json"

# 5. Test after deploy
curl -I https://yourapp.vercel.app/login
# Should show: HTTP/2 200
```

---

## Routes Reference

| Route              | Type      | Direct Access Works? |
| ------------------ | --------- | -------------------- |
| `/`                | Public    | ✅ Yes               |
| `/login`           | Public    | ✅ Yes               |
| `/signup`          | Public    | ✅ Yes               |
| `/articles`        | Public    | ✅ Yes               |
| `/article/:slug`   | Public    | ✅ Yes               |
| `/dashboard`       | Protected | ✅ Yes\*             |
| `/transfer`        | Protected | ✅ Yes\*             |
| `/history`         | Protected | ✅ Yes\*             |
| `/admin/login`     | Admin     | ✅ Yes               |
| `/admin/dashboard` | Admin     | ✅ Yes\*             |

\*Akan redirect ke `/login` jika tidak authenticated (by `ProtectedRoute`)

---

## Performance Tips

### Cache Static Assets

```json
{
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
  ]
}
```

### Code Splitting

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          i18n: ["react-i18next", "i18next"],
        },
      },
    },
  },
});
```

---

## When to Redeploy

You need to redeploy when:

- ✅ Added/changed `vercel.json`
- ✅ Changed environment variables
- ✅ Changed build configuration
- ✅ Updated dependencies
- ✅ Fixed bugs or added features

You DON'T need to redeploy when:

- ❌ Just reading documentation
- ❌ Testing locally only

---

**TL;DR:**

1. Add `vercel.json` to `frontend/` folder
2. Use `rewrites` (not redirects)
3. Set environment variables in Vercel Dashboard
4. Push to GitHub → Auto deploy
5. Test direct URL access

**Still not working?** Check `VERCEL_SPA_SETUP.md` for detailed troubleshooting.
