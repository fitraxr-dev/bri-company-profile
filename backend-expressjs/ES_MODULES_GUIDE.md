# 🔧 ES Modules Migration Guide

Semua file telah dikonversi dari CommonJS ke ES Modules.

## ✅ Perubahan yang Sudah Dilakukan

### 1. **package.json**

```json
{
  "type": "module" // ← Enable ES Modules
}
```

### 2. **Import/Export Syntax**

#### ❌ CommonJS (OLD)

```javascript
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = new StockService();
```

#### ✅ ES Modules (NEW)

```javascript
import axios from "axios";
import * as cheerio from "cheerio";

export default new StockService();
```

## 📝 File yang Sudah Dikonversi

| File                               | Status        |
| ---------------------------------- | ------------- |
| `src/index.js`                     | ✅ ES Modules |
| `src/services/stockService.js`     | ✅ ES Modules |
| `models/User.js`                   | ✅ ES Modules |
| `migrations/initUserCollection.js` | ✅ ES Modules |
| `seeders/seedUsers.js`             | ✅ ES Modules |

## 🚀 Cara Menjalankan

```bash
# Development
npm run dev

# Production
npm start

# Migration
npm run migrate

# Seeding
npm run seed
```

## 🐛 Troubleshooting

### Error: "require is not defined"

**Penyebab:** File masih menggunakan `require()` CommonJS

**Solusi:** Ubah ke `import`

```javascript
// OLD
const express = require("express");

// NEW
import express from "express";
```

### Error: "Cannot use import statement outside a module"

**Penyebab:** `package.json` tidak memiliki `"type": "module"`

**Solusi:** Tambahkan di `package.json`:

```json
{
  "type": "module"
}
```

### Error: "Cannot find module" (dengan .js extension)

**Penyebab:** Import tidak menyertakan ekstensi file

**Solusi:** Selalu sertakan `.js` di import:

```javascript
// OLD
import stockService from "./services/stockService";

// NEW
import stockService from "./services/stockService.js";
```

### Error: "module.exports is not defined"

**Penyebab:** Menggunakan CommonJS export di ES Module

**Solusi:** Ubah ke `export`

```javascript
// OLD
module.exports = MyClass;

// NEW
export default MyClass;
```

## 📚 Common Patterns

### Default Export/Import

```javascript
// Export
export default function myFunction() {}

// Import
import myFunction from "./myFunction.js";
```

### Named Export/Import

```javascript
// Export
export const helper1 = () => {};
export const helper2 = () => {};

// Import
import { helper1, helper2 } from "./helpers.js";
```

### Import All

```javascript
// Export
export const a = 1;
export const b = 2;

// Import
import * as utils from "./utils.js";
// Access: utils.a, utils.b
```

### Mixed Export/Import

```javascript
// Export
export default MyClass;
export const helper = () => {};

// Import
import MyClass, { helper } from "./MyClass.js";
```

## ✨ Best Practices

1. **Always use `.js` extension** in imports
2. **Use `import` at top of file**
3. **Use `export default` for main export**
4. **Use named exports for utilities**
5. **Avoid mixing CommonJS and ES Modules**

## 🔗 Resources

- [Node.js ES Modules](https://nodejs.org/api/esm.html)
- [MDN Import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
- [MDN Export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)

---

**Status:** ✅ Semua file sudah menggunakan ES Modules
