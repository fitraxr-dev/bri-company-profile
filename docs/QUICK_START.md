# 🚀 Quick Start - Info Saham BRI

## Instalasi Cepat

### 1️⃣ Backend Setup

```powershell
# Masuk ke folder backend
cd backend

# Install dependencies (sudah selesai)
npm install

# Jalankan server (sudah berjalan di background)
npm run dev
```

✅ Backend berjalan di: **http://localhost:5000**

### 2️⃣ Frontend Setup

```powershell
# Buka terminal baru
# Masuk ke folder frontend
cd frontend

# Install dependencies (sudah selesai)
npm install

# Jalankan Vite dev server
npm run dev
```

🌐 Frontend akan berjalan di: **http://localhost:5173**

---

## 🧪 Testing

### Test Backend API

Buka browser atau gunakan curl:

```
http://localhost:5000/api/stock/bbri
```

Response yang diharapkan:

```json
{
  "success": true,
  "data": {
    "symbol": "BBRI",
    "name": "Bank Rakyat Indonesia (Persero) Tbk",
    "price": 4850,
    "change": 25,
    "changePercent": 0.52,
    ...
  }
}
```

### Test Frontend

1. Jalankan frontend: `npm run dev`
2. Buka browser: `http://localhost:5173`
3. Anda akan melihat komponen Info Saham BRI
4. Klik tombol refresh untuk update data

---

## 📁 Cara Menggunakan Komponen

### Opsi 1: Ganti App.jsx (Recommended)

```jsx
// frontend/src/App.jsx
import InfoSahamBRI from "./components/InfoSahamBRI";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <InfoSahamBRI />
    </div>
  );
}

export default App;
```

### Opsi 2: Tambahkan ke Halaman Existing

```jsx
// Tambahkan di halaman investor atau home
import InfoSahamBRI from "./components/InfoSahamBRI";

function InvestorPage() {
  return (
    <div>
      <h1>Informasi Investor</h1>
      <InfoSahamBRI />
    </div>
  );
}
```

### Opsi 3: Copy dari Example

```powershell
# Copy file example ke App.jsx
cp src/App.example.jsx src/App.jsx
```

---

## 🎨 Fitur Utama

✅ **Real-time Data**: Update otomatis setiap refresh  
✅ **Skeleton Loader**: Loading state yang smooth  
✅ **Error Handling**: Pesan error user-friendly  
✅ **Format Rupiah**: Angka dengan koma (4.850,00)  
✅ **Animasi**: Indikator naik (hijau) / turun (merah)  
✅ **Responsive**: Desktop & mobile friendly  
✅ **Modern Design**: Warna BRI (#0043A4)

---

## 🔧 Status Checklist

- [x] Backend dependencies installed (axios, cheerio)
- [x] Frontend dependencies installed (axios)
- [x] Backend service created (stockService.js)
- [x] Backend API endpoint created (/api/stock/bbri)
- [x] Frontend component created (InfoSahamBRI.jsx)
- [x] Backend server running (port 5000)
- [ ] Frontend server running (port 5173) ← **JALANKAN INI**
- [ ] Component integrated in App.jsx ← **LAKUKAN INI**

---

## ⚡ Next Steps

1. **Jalankan Frontend:**

   ```powershell
   cd frontend
   npm run dev
   ```

2. **Edit App.jsx:**

   - Buka `frontend/src/App.jsx`
   - Import dan gunakan `<InfoSahamBRI />`
   - Atau copy dari `src/App.example.jsx`

3. **Test di Browser:**

   - Buka http://localhost:5173
   - Lihat komponen Info Saham BRI
   - Klik refresh untuk update data

4. **Refresh Halaman:**
   - Setiap refresh, data akan di-fetch ulang
   - Lihat animasi loading skeleton
   - Perhatikan warna hijau (naik) atau merah (turun)

---

## 📞 Troubleshooting

### Backend Error?

- Pastikan MongoDB berjalan (atau comment kode MongoDB di index.js)
- Cek port 5000 tidak digunakan aplikasi lain

### Frontend Error?

- Pastikan backend berjalan di port 5000
- Cek browser console untuk error CORS
- Pastikan axios terinstall: `npm install axios`

### Data tidak muncul?

- Backend otomatis fallback ke mock data jika scraping gagal
- Data akan tetap muncul dengan label "Mock Data (Demo)"

---

## 🎯 Selesai!

Anda sekarang memiliki komponen Info Saham BRI yang:

- ✅ Real-time data setiap refresh
- ✅ Modern UI dengan warna BRI
- ✅ Fully functional dengan backend scraping
- ✅ Ready untuk production

**Happy Coding! 🚀**
