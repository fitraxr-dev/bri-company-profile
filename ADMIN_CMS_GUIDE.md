# Admin CMS Documentation

## Overview

Admin CMS untuk mengelola artikel BRImo dengan autentikasi berbasis role (admin only).

## Struktur File

### Components

- **AdminRoute.jsx** - Protected route untuk halaman admin (hanya admin yang bisa akses)

### Pages

- **admin/AdminLogin.jsx** - Halaman login khusus admin
- **admin/AdminDashboard.jsx** - Dashboard CMS dengan tabel artikel & statistik
- **admin/ArticleForm.jsx** - Form untuk membuat artikel baru
- **admin/ArticleEdit.jsx** - Form untuk mengedit artikel yang sudah ada

## Routes

### Public Routes

- `/admin/login` - Login page untuk admin

### Protected Admin Routes (Requires admin role)

- `/admin` - Dashboard CMS
- `/admin/articles/create` - Create new article
- `/admin/articles/edit/:id` - Edit existing article

## Kredensial Admin

Gunakan kredensial berikut untuk login sebagai admin:

```
Email: admin@brimo.com
Password: password123
```

## Fitur Dashboard

### 1. Statistics Cards

- **Total Articles** - Jumlah total artikel
- **Published** - Jumlah artikel yang sudah dipublikasi
- **Draft** - Jumlah artikel yang masih draft

### 2. Articles Table

Menampilkan daftar semua artikel dengan informasi:

- Cover image & title
- Category
- Author
- Status (Published/Draft)
- Published date
- Actions (View, Edit, Delete)

### 3. Actions

- **View** - Melihat artikel di halaman publik
- **Edit** - Edit artikel
- **Delete** - Hapus artikel (dengan konfirmasi)
- **Create** - Buat artikel baru

## Form Artikel

### General Information

- **Cover Image URL** - URL gambar cover artikel
- **Category** - Kategori artikel (Tutorial, Tips, Berita, Panduan)
- **Author** - Nama penulis
- **Status** - Draft atau Published
- **Published Date** - Tanggal publikasi

### Multi-Language Support

Setiap artikel memiliki 2 versi bahasa:

- 🇮🇩 **Bahasa Indonesia**
- 🇬🇧 **English**

Untuk setiap bahasa, isi:

- **Title** - Judul artikel
- **Slug** - URL-friendly slug (auto-generated dari title)
- **Content Blocks** - Konten artikel

### Content Blocks

Artikel mendukung 2 jenis content block:

#### 1. Text Block

- Mendukung markdown formatting:
  - `##` untuk heading
  - `###` untuk subheading
  - `•` untuk bullet points
- Contoh:

  ```
  ## Cara Membuka Aplikasi

  Untuk membuka aplikasi BRImo, ikuti langkah berikut:
  • Buka aplikasi BRImo
  • Login menggunakan akun Anda
  • Akses fitur yang diinginkan
  ```

#### 2. Image Block

- **Image URL** - URL gambar dari Unsplash atau sumber lain
- **Caption** - Keterangan gambar (opsional)

### Actions

- **Add Text** - Tambah text block
- **Add Image** - Tambah image block
- **Remove** - Hapus content block (minimal 1 block harus ada)

## Workflow

### 1. Login sebagai Admin

1. Buka `/admin/login`
2. Masukkan email: `admin@brimo.com`
3. Masukkan password: `password123`
4. Klik "Masuk"
5. Redirect ke `/admin` dashboard

### 2. Membuat Artikel Baru

1. Di dashboard, klik tombol "Buat Artikel"
2. Isi General Information (cover image, category, author, status, date)
3. Isi konten untuk Bahasa Indonesia:
   - Title dan slug
   - Tambah content blocks (text/image)
4. Isi konten untuk English:
   - Title dan slug
   - Tambah content blocks (text/image)
5. Klik "Buat Artikel"
6. Artikel berhasil dibuat, redirect ke dashboard

### 3. Mengedit Artikel

1. Di dashboard, klik icon edit (pensil biru) pada artikel
2. Form akan ter-isi dengan data artikel yang ada
3. Edit field yang diinginkan
4. Klik "Simpan Perubahan"
5. Artikel berhasil diupdate, redirect ke dashboard

### 4. Menghapus Artikel

1. Di dashboard, klik icon delete (trash merah) pada artikel
2. Konfirmasi penghapusan
3. Artikel berhasil dihapus dari database

### 5. Melihat Artikel

1. Di dashboard, klik icon view (mata) pada artikel
2. Redirect ke halaman publik artikel (`/article/:slug`)
3. Lihat artikel sebagaimana user melihatnya

### 6. Logout

1. Klik tombol "Keluar" di header
2. Redirect ke homepage

## Security

### AdminRoute Protection

- Memeriksa apakah user sudah login
- Memeriksa apakah user memiliki role "admin"
- Jika tidak login → redirect ke `/login?redirect=/admin`
- Jika bukan admin → redirect ke `/`

### Authorization Flow

1. User login dengan kredensial admin
2. Backend memvalidasi dan mengembalikan user data dengan role
3. Frontend menyimpan token & user data di AuthContext
4. AdminRoute memeriksa `user.role === "admin"`
5. Jika valid, render admin pages
6. Jika tidak valid, redirect sesuai kondisi

## API Endpoints

Admin menggunakan endpoint artikel yang sama:

- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get article by ID
- `POST /api/articles` - Create new article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article

## Design System

### Colors

- **Primary** - `#00529B` (BRI Blue)
- **Secondary** - `#003B73` (Deep Blue)
- **Orange** - `#F58220` (BRI Orange)
- **Background** - `#F4F6F8` (Light Gray)
- **Success** - `#10B981` (Green)
- **Warning** - `#F59E0B` (Yellow)
- **Error** - `#EF4444` (Red)

### Icons

Menggunakan `@heroicons/react/24/outline`:

- NewspaperIcon - Artikel
- PlusIcon - Create
- PencilIcon - Edit
- TrashIcon - Delete
- EyeIcon - View
- ArrowLeftIcon - Back
- ArrowRightOnRectangleIcon - Logout

### Fonts

- **Heading** - Poppins (bold)
- **Body** - Lato (regular)

## Tips

### Content Creation

1. Gunakan Unsplash untuk gambar berkualitas tinggi
2. Pastikan slug unik untuk setiap artikel
3. Gunakan markdown formatting untuk struktur konten yang rapi
4. Tambahkan caption pada gambar untuk accessibility
5. Preview artikel sebelum publish (set status "Published")

### Best Practices

1. Selalu isi kedua bahasa (ID & EN) untuk konsistensi
2. Gunakan kategori yang sesuai
3. Set tanggal publikasi sesuai jadwal
4. Gunakan draft untuk artikel yang belum siap publish
5. Review artikel di halaman publik sebelum final

## Troubleshooting

### Issue: Tidak bisa login sebagai admin

**Solution:**

- Pastikan menggunakan email `admin@brimo.com`
- Pastikan password `password123`
- Cek apakah backend sudah running
- Cek apakah seeding admin sudah dijalankan

### Issue: Redirect ke homepage setelah login

**Solution:**

- Cek apakah user memiliki role "admin" di database
- Jalankan seeding ulang jika perlu: `node src/seeders/seedUsers.js`

### Issue: Article tidak muncul di dashboard

**Solution:**

- Cek apakah backend sudah running di port 5000
- Cek console untuk error message
- Pastikan MongoDB running

### Issue: Image tidak muncul

**Solution:**

- Pastikan URL gambar valid dan accessible
- Gunakan HTTPS URLs
- Test URL di browser terlebih dahulu

## Development

### Adding New Features

1. **New Article Category:**

   - Edit ArticleForm.jsx dan ArticleEdit.jsx
   - Tambahkan option di select category

2. **New Content Block Type:**

   - Update Article model di backend
   - Update form handling di ArticleForm & ArticleEdit
   - Update rendering di ArticleDetail

3. **Additional Fields:**
   - Update Article schema
   - Update forms
   - Update table display

### Testing

1. Login sebagai admin
2. Create artikel dengan berbagai kombinasi content blocks
3. Edit artikel yang sudah ada
4. Delete artikel
5. View artikel di halaman publik
6. Test dengan berbagai browser
7. Test responsive design (mobile, tablet, desktop)

## Deployment Notes

### Environment Variables

Pastikan `VITE_API_URL` di frontend sudah di-set dengan benar:

```
VITE_API_URL=http://localhost:5000/api
```

### Production Considerations

1. Ganti password default admin
2. Implementasi rate limiting untuk login
3. Add image upload feature (sekarang masih URL-based)
4. Add rich text editor untuk content blocks
5. Add article preview before publish
6. Add article scheduling feature
7. Add article versioning/revision history
