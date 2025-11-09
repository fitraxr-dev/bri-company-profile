# 📝 Changelog - Info Saham BRI

## [v2.0.0] - 26 Oktober 2025

### 🔥 Major Changes

#### **Scraping Source Update**

- ✅ **REMOVED**: Yahoo Finance scraping (dihapus sepenuhnya)
- ✅ **ADDED**: Direct scraping dari BRI Official Website (https://bri.co.id/informasi-investor)
- ✅ **Improved**: Parsing data lebih akurat sesuai struktur HTML BRI

### 🎯 Data yang Di-scrape

Backend sekarang mengambil data langsung dari elemen-elemen berikut di website BRI:

```html
<!-- Harga Saham -->
<div id="price" class="number">3.850,00</div>

<!-- Perubahan Harga dan Persentase -->
<div id="plusMinus" class="number increase">+30.00(+0.79%)</div>

<!-- Volume -->
<div id="volAvg" class="number">313.903.600,00</div>

<!-- Rentang Hari Ini -->
<div id="range" class="number">3.820,00 - 3.910,00</div>

<!-- Rentang 52 Minggu -->
<div id="fiveTwoWeek" class="number">3.360,00 - 4.870,00</div>

<!-- Waktu Update -->
<span id="lastUpdate">26/10/2025 09:00</span>
```

### 📊 Response API

**Endpoint**: `GET /api/stock/bbri`

**Sample Response**:

```json
{
  "success": true,
  "data": {
    "symbol": "BBRI",
    "name": "Bank Rakyat Indonesia (Persero) Tbk",
    "price": 3850,
    "change": 30,
    "changePercent": 0.79,
    "volume": "313.903.600,00",
    "dayRange": "3.820,00 - 3.910,00",
    "fiftyTwoWeekRange": "3.360,00 - 4.870,00",
    "lastUpdate": "26/10/2025 09:00",
    "source": "BRI Website"
  }
}
```

### 🔧 Technical Details

#### Parsing Logic

1. **Price Parsing**:

   - Input: `"3.850,00"` (format Indonesia)
   - Output: `3850` (number)
   - Method: Menghapus titik pemisah ribuan, ganti koma dengan titik

2. **Change Parsing**:

   - Input: `"+30.00(+0.79%)"` atau `"-30.00(-0.79%)"`
   - Output: `change: 30, changePercent: 0.79`
   - Method: Regex matching untuk extract angka dan tanda

3. **Volume & Range**:

   - Disimpan sebagai string dengan format asli
   - Tidak dikonversi untuk menjaga format Indonesia

4. **Last Update**:
   - Langsung diambil dari `#lastUpdate`
   - Format: `"DD/MM/YYYY HH:MM"`

### 🛡️ Fallback System

Jika scraping BRI gagal, sistem akan menggunakan **Mock Data**:

```javascript
{
  price: 3850 + random(-50 to +50),
  change: random value,
  changePercent: calculated,
  volume: "313.903.600,00",
  dayRange: "3.820,00 - 3.910,00",
  fiftyTwoWeekRange: "3.360,00 - 4.870,00",
  source: "Mock Data (Demo)"
}
```

### ⚙️ Configuration

**Axios Settings**:

```javascript
{
  timeout: 15000, // 15 detik
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    "Accept": "text/html,application/xhtml+xml,...",
    "Accept-Language": "id-ID,id;q=0.9,..."
  }
}
```

### 📈 Performance

- **Response Time**: ~2-5 detik (tergantung koneksi ke BRI)
- **Reliability**: Direct scraping dari source resmi BRI
- **Update Frequency**: Setiap page refresh / manual refresh

### 🐛 Known Issues

- ⚠️ Jika website BRI maintenance, akan fallback ke mock data
- ⚠️ Format data tergantung struktur HTML BRI (bisa berubah sewaktu-waktu)

### 🔮 Future Improvements

- [ ] Cache data untuk mengurangi request
- [ ] Rate limiting protection
- [ ] Webhook/WebSocket for real-time updates
- [ ] Historical data storage

---

## [v1.0.0] - 25 Oktober 2025

### Initial Release

- ✅ Backend scraping service
- ✅ Frontend React component
- ✅ Yahoo Finance + BRI Website scraping
- ✅ Mock data fallback
- ✅ Modern UI with TailwindCSS
- ✅ Skeleton loader
- ✅ Error handling

---

## Migration Guide (v1.0 → v2.0)

### Breaking Changes

**Removed**:

- `getStockFromYahoo()` function
- Yahoo Finance dependencies

**Modified**:

- `getStockFromBRI()` - Improved parsing
- Mock data - Updated base price from 4850 to 3850

### Action Required

1. **Pull latest code**
2. **Restart backend**: `npm run dev`
3. **Test API**: `curl http://localhost:5000/api/stock/bbri`
4. **Verify data** matches BRI website

### No Frontend Changes

Frontend component tetap sama, tidak perlu update.

---

**Updated by**: GitHub Copilot  
**Date**: 26 Oktober 2025  
**Version**: 2.0.0
