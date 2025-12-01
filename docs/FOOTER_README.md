# 📄 FooterBRI Component - Dokumentasi

## 📋 Overview

**FooterBRI** adalah komponen React footer profesional untuk website company profile Bank BRI dengan desain modern, responsif, dan kredibel.

---

## ✨ Fitur Utama

### 🎨 **Design Features**

- ✅ Warna korporat BRI (#002B7F)
- ✅ Layout 4 kolom responsif (1 kolom di mobile, 4 di desktop)
- ✅ Animasi hover smooth pada semua link
- ✅ Social media icons dengan efek hover yang menarik
- ✅ Typography yang jelas dan mudah dibaca

### 📱 **Responsive Design**

- ✅ Mobile-first approach
- ✅ Grid adapts: 1 col (mobile) → 2 cols (tablet) → 4 cols (desktop)
- ✅ Stack layout di mobile untuk readability optimal

### 🔗 **Interactive Elements**

- ✅ Hover effects pada semua link
- ✅ Icon animations
- ✅ External links dengan security attributes
- ✅ Accessible social media buttons

---

## 🏗️ Struktur Komponen

```
FooterBRI
├── Main Content (4 Columns)
│   ├── Kolom 1: Brand & Description
│   │   ├── Logo BRI
│   │   ├── Mission statement
│   │   └── Tagline
│   │
│   ├── Kolom 2: Tentang Perusahaan
│   │   ├── Tentang BRI
│   │   ├── Manajemen
│   │   ├── Karir
│   │   └── Berita & Informasi
│   │
│   ├── Kolom 3: Produk & Layanan
│   │   ├── Tabungan (icon)
│   │   ├── Pinjaman (icon)
│   │   ├── Kartu Kredit (icon)
│   │   ├── BRImo (icon)
│   │   └── [Button: Lihat Semua Produk]
│   │
│   └── Kolom 4: Hubungi Kami
│       ├── Alamat kantor
│       ├── Call Center (clickable)
│       ├── Email (clickable)
│       └── Social Media Icons
│
└── Footer Bottom
    ├── Copyright text
    └── Additional links (Privacy, Terms)
```

---

## 🎨 Warna & Styling

### Color Palette

| Element      | Color   | Tailwind Class    |
| ------------ | ------- | ----------------- |
| Background   | #002B7F | `bg-[#002B7F]`    |
| Text Primary | #E5E7EB | `text-gray-300`   |
| Text Hover   | #FFFFFF | `text-white`      |
| Accent Blue  | #60A5FA | `text-blue-400`   |
| Border       | #1E3A8A | `border-blue-800` |
| Button BG    | #2563EB | `bg-blue-600`     |

### Typography

```css
Headings: font-bold, text-lg (18px)
Body Text: text-sm (14px)
Links: text-sm with hover effect
Copyright: text-sm
```

---

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-icons": "^5.0.0",
  "tailwindcss": "^3.4.0"
}
```

### Icons Used (from react-icons/fa)

- `FaFacebookF` - Facebook icon
- `FaInstagram` - Instagram icon
- `FaLinkedinIn` - LinkedIn icon
- `FaYoutube` - YouTube icon
- `FaPhone` - Phone icon
- `FaEnvelope` - Email icon
- `FaMapMarkerAlt` - Location icon
- `FaWallet` - Wallet icon
- `FaCreditCard` - Credit card icon
- `FaMobileAlt` - Mobile icon
- `FaChevronRight` - Arrow icon

---

## 💻 Penggunaan

### Basic Usage

```jsx
import FooterBRI from "./components/FooterBRI";

function App() {
  return (
    <div>
      {/* Your content */}
      <FooterBRI />
    </div>
  );
}
```

### With Full Layout

```jsx
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FooterBRI from "./components/FooterBRI";

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        {/* Other sections */}
      </main>
      <FooterBRI />
    </div>
  );
}
```

---

## 🎯 Kustomisasi

### Mengubah Warna

```jsx
// Di FooterBRI.jsx, ganti class:
<footer className="bg-[#002B7F]">
// Menjadi warna custom:
<footer className="bg-[#YOUR_COLOR]">
```

### Menambah Link Baru

```jsx
const aboutLinks = [
  { name: "Tentang BRI", href: "/tentang" },
  { name: "Link Baru", href: "/link-baru" }, // Tambah di sini
];
```

### Mengubah Social Media

```jsx
const socialMedia = [
  {
    name: "Twitter", // Tambah social media baru
    icon: FaTwitter,
    href: "https://twitter.com/bankbri",
    color: "hover:bg-blue-400",
  },
];
```

### Custom Logo

Ganti section logo:

```jsx
{
  /* Logo BRI */
}
<div className="mb-4">
  <img src="/path/to/logo.png" alt="Bank BRI" className="h-12 w-auto" />
</div>;
```

---

## 📱 Responsive Breakpoints

| Screen Size         | Layout    | Grid             |
| ------------------- | --------- | ---------------- |
| Mobile (<640px)     | 1 column  | `grid-cols-1`    |
| Tablet (640-1024px) | 2 columns | `md:grid-cols-2` |
| Desktop (>1024px)   | 4 columns | `lg:grid-cols-4` |

---

## ♿ Accessibility

### Features Implemented

1. **Semantic HTML**

   - `<footer>` tag untuk struktur yang jelas
   - Heading hierarchy (h2, h3)

2. **ARIA Labels**

   ```jsx
   <a aria-label="Facebook">
   ```

3. **Keyboard Navigation**

   - Semua link accessible via keyboard
   - Focus states visible

4. **Screen Reader Friendly**

   - Descriptive link text
   - Icon labels for context

5. **Color Contrast**
   - Text contrast ratio > 4.5:1
   - Complies with WCAG AA

---

## 🚀 Performance

### Optimization Tips

1. **Lazy Load Icons**

   ```jsx
   import dynamic from "next/dynamic";
   const FaFacebookF = dynamic(() =>
     import("react-icons/fa").then((mod) => mod.FaFacebookF)
   );
   ```

2. **Image Optimization**

   - Use WebP format for logo
   - Add width/height attributes

3. **Link Prefetching**
   ```jsx
   <link rel="prefetch" href="/tentang" />
   ```

---

## 🧪 Testing Checklist

- [ ] Desktop view (1920x1080)
- [ ] Tablet view (768x1024)
- [ ] Mobile view (375x667)
- [ ] All links clickable
- [ ] Social media opens in new tab
- [ ] Hover effects working
- [ ] Icons rendering correctly
- [ ] Text readable on all devices
- [ ] Copyright year dynamic

---

## 📊 Component Stats

```
Lines of Code: 205
File Size: ~7KB
Dependencies: 2 (react-icons, tailwindcss)
Icons Used: 12
Links: 13
Social Media: 4
Columns: 4 (responsive)
```

---

## 🎨 Visual Preview

```
┌─────────────────────────────────────────────────────────────┐
│                     Footer BRI                              │
├─────────────┬────────────────┬─────────────┬────────────────┤
│ Bank BRI    │ Tentang        │ Produk      │ Hubungi Kami   │
│             │                │             │                │
│ Melayani    │ > Tentang BRI  │ 💳 Tabungan │ 📍 Jl. Sudirman│
│ Dengan      │ > Manajemen    │ 💰 Pinjaman │ ☎ 14017        │
│ Setulus     │ > Karir        │ 💳 Kartu    │ ✉ callbri@...  │
│ Hati        │ > Berita       │ 📱 BRImo    │                │
│             │                │             │ [f] [i] [in] [y]│
│ "Tumbuh     │                │ [Lihat All] │                │
│  Bersama"   │                │             │                │
└─────────────┴────────────────┴─────────────┴────────────────┘
├─────────────────────────────────────────────────────────────┤
│ © 2025 PT Bank Rakyat Indonesia │ Privacy │ Terms          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔗 Links Reference

### Internal Links

- `/tentang` - About page
- `/manajemen` - Management page
- `/karir` - Career page
- `/berita` - News page
- `/produk/tabungan` - Savings products
- `/produk/pinjaman` - Loan products
- `/produk/kartu` - Card products
- `/brimo` - BRImo app page
- `/privacy-policy` - Privacy policy
- `/terms` - Terms & conditions

### External Links

- `https://www.facebook.com/BRIofficialpage`
- `https://www.instagram.com/bankbri_id`
- `https://www.linkedin.com/company/pt--bank-rakyat-indonesia--persero--tbk-`
- `https://www.youtube.com/user/BANKBRI`
- `tel:14017` - Call center
- `mailto:callbri@bri.co.id` - Email

---

## 🐛 Common Issues

### Issue 1: Icons not showing

**Solution:**

```bash
npm install react-icons
```

### Issue 2: Tailwind classes not working

**Solution:** Pastikan `tailwind.config.js` include komponen:

```js
content: [
  "./src/**/*.{js,jsx,ts,tsx}",
],
```

### Issue 3: Links not working

**Solution:** Gunakan React Router untuk internal navigation:

```jsx
import { Link } from "react-router-dom";
<Link to="/tentang">Tentang BRI</Link>;
```

---

## 📝 Changelog

### v1.0.0 (26 Oktober 2025)

- ✅ Initial release
- ✅ 4-column responsive layout
- ✅ Social media integration
- ✅ Icon support
- ✅ Hover animations
- ✅ Accessibility features

---

## 🤝 Contributing

Ingin improve komponen ini?

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

## 📄 License

MIT License - Politeknik Negeri Bandung

---

## 👨‍💻 Author

**Framework Project - Semester 5**  
Politeknik Negeri Bandung  
Pengembangan Web

---

## 🎉 Credits

- Design inspiration: BRI Official Website
- Icons: React Icons (Font Awesome)
- Styling: TailwindCSS
- Framework: React + Vite

---

**Made with ❤️ for Bank BRI Company Profile**
