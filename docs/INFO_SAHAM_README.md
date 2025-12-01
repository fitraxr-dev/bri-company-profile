# 📊 Info Saham BRI - Komponen React

Komponen React untuk menampilkan informasi saham Bank BRI (BBRI) secara real-time dengan data yang di-refresh setiap kali halaman dimuat ulang.

## ✨ Fitur

- ✅ **Real-time Data**: Mengambil data saham terbaru setiap refresh
- ✅ **Web Scraping**: Backend scraping dari Yahoo Finance dengan fallback ke mock data
- ✅ **Modern UI**: Desain card modern dengan warna BRI (#0043A4)
- ✅ **Skeleton Loader**: Loading state yang smooth
- ✅ **Error Handling**: Menampilkan pesan error yang user-friendly
- ✅ **Format Rupiah**: Angka diformat dengan koma untuk ribuan
- ✅ **Animasi**: Indikator naik/turun dengan animasi
- ✅ **Responsive**: Tampil baik di desktop dan mobile
- ✅ **Refresh Manual**: Tombol refresh untuk update manual

## 📦 Dependencies

### Backend

```json
{
  "axios": "^1.x.x",
  "cheerio": "^1.x.x",
  "express": "^4.x.x",
  "cors": "^2.x.x"
}
```

### Frontend

```json
{
  "react": "^18.x.x",
  "axios": "^1.x.x",
  "lucide-react": "^0.548.0",
  "tailwindcss": "^3.x.x"
}
```

## 🚀 Cara Menjalankan

### 1. Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Install dependencies (jika belum)
npm install

# Jalankan server
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

### 2. Setup Frontend

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies (jika belum)
npm install

# Jalankan development server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173` (atau port yang ditampilkan)

### 3. Akses Aplikasi

Buka browser dan akses:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api/stock/bbri`

## 📝 Penggunaan Komponen

### Import dan Gunakan di App.jsx

```jsx
import InfoSahamBRI from "./components/InfoSahamBRI";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <InfoSahamBRI />
    </div>
  );
}

export default App;
```

### Atau gunakan di halaman tertentu

```jsx
import InfoSahamBRI from "../components/InfoSahamBRI";

function InvestorPage() {
  return (
    <div>
      <h1>Informasi Investor</h1>
      <InfoSahamBRI />
    </div>
  );
}
```

## 🎨 Kustomisasi

### Mengubah Warna Tema

Edit file `InfoSahamBRI.jsx`, cari class dengan warna `[#0043A4]` dan ganti sesuai kebutuhan:

```jsx
// Contoh: Ganti warna header
<div className="bg-gradient-to-r from-[#0043A4] to-[#0056D6] p-6">
```

### Mengubah Interval Refresh Otomatis

Tambahkan auto-refresh dengan `setInterval`:

```jsx
useEffect(() => {
  fetchStockData();

  // Auto refresh setiap 5 menit (300000 ms)
  const interval = setInterval(() => {
    fetchStockData();
  }, 300000);

  return () => clearInterval(interval);
}, []);
```

## 🌐 API Backend

### Endpoint: `GET /api/stock/bbri`

**Response Success:**

```json
{
  "success": true,
  "data": {
    "symbol": "BBRI",
    "name": "Bank Rakyat Indonesia (Persero) Tbk",
    "price": 4850,
    "change": 25,
    "changePercent": 0.52,
    "volume": "1.245.678.900",
    "dayRange": "4,800 - 4,900",
    "fiftyTwoWeekRange": "3,500 - 5,200",
    "marketCap": "Rp 607,5 T",
    "peRatio": "12,45",
    "lastUpdate": "2025-10-25T10:30:00.000Z",
    "source": "Yahoo Finance"
  }
}
```

**Response Error:**

```json
{
  "success": false,
  "error": "Gagal mengambil data saham",
  "message": "Error details..."
}
```

## 🔧 Troubleshooting

### Backend tidak bisa scraping data

Jika Yahoo Finance atau website BRI tidak bisa diakses, backend akan otomatis menggunakan **mock data** yang realistis dengan harga yang berubah-ubah.

### CORS Error

Pastikan backend menggunakan middleware CORS:

```javascript
const cors = require("cors");
app.use(cors());
```

### Port sudah digunakan

Ubah port di file `backend/src/index.js`:

```javascript
const port = process.env.PORT || 5001; // Ganti ke port lain
```

Dan update URL di frontend:

```javascript
const response = await axios.get("http://localhost:5001/api/stock/bbri");
```

## 📸 Screenshot

Komponen menampilkan:

- **Header**: Judul, nama perusahaan, kode saham, dan waktu update
- **Harga**: Harga saham dengan indikator naik/turun (hijau/merah)
- **Detail**: Volume, rentang hari, rentang 52 minggu, market cap, P/E ratio
- **CTA**: Tombol "Lebih Lanjut" ke ir-bri.com

## 🎯 Fitur Mendatang

- [ ] Chart harga saham historis
- [ ] Notifikasi perubahan harga signifikan
- [ ] Perbandingan dengan saham bank lain
- [ ] Mode dark theme
- [ ] Export data ke CSV/PDF

## 📄 Lisensi

Project ini dibuat untuk keperluan edukasi dan demonstrasi.

## 👨‍💻 Developer

Dibuat dengan ❤️ untuk tugas Framework Project - Politeknik Negeri Bandung

---

**Catatan**: Data saham yang ditampilkan bersifat informatif dan bukan merupakan rekomendasi investasi. Selalu lakukan riset mendalam sebelum berinvestasi.
