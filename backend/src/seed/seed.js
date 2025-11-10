import connectDB from "../db/connect.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Article from "../models/Article.js";

/**
 * Master Seeder - Seed all collections
 * Usage:
 * - Development: npm run seed:dev
 * - Production: npm run seed
 */

// ==================== USER SEEDING ====================
const seedUsers = async () => {
  try {
    console.log("\n👥 Seeding users...");

    // Check existing users
    const existingUsers = await User.find({
      email: { $in: ["admin@brimo.com", "ahmad.fadli@example.com"] },
    });

    if (existingUsers.length > 0) {
      console.log(
        `⚠️  ${existingUsers.length} users already exist. Skipping user seeding...`
      );
      return;
    }

    // Hash password dengan bcrypt
    const defaultPassword = "password123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Data user contoh
    const users = [
      {
        fullName: "Admin BRImo",
        email: "admin@brimo.com",
        password: hashedPassword,
        phoneNumber: "081234567899",
        accountNumber: "1001234567899",
        balance: 0,
        role: "admin",
        isActive: true,
      },
      {
        fullName: "Ahmad Fadli",
        email: "ahmad.fadli@example.com",
        password: hashedPassword,
        phoneNumber: "081234567890",
        accountNumber: "1001234567890",
        balance: 5000000,
        role: "user",
        isActive: true,
      },
      {
        fullName: "Siti Rahmawati",
        email: "siti.rahmawati@example.com",
        password: hashedPassword,
        phoneNumber: "081298765432",
        accountNumber: "1001234567891",
        balance: 2500000,
        role: "user",
        isActive: true,
      },
      {
        fullName: "Budi Santoso",
        email: "budi.santoso@example.com",
        password: hashedPassword,
        phoneNumber: "081356789012",
        accountNumber: "1001234567892",
        balance: 10000000,
        role: "user",
        isActive: true,
      },
    ];

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`✅ ${createdUsers.length} users created successfully!`);
    console.log("📧 Admin Email: admin@brimo.com");
    console.log("🔑 Password (all users): password123");
  } catch (error) {
    console.error("❌ Error seeding users:", error.message);
    throw error;
  }
};

// ==================== ARTICLE SEEDING ====================
const seedArticles = async () => {
  try {
    console.log("\n📰 Seeding articles...");

    // Check existing articles count
    const existingCount = await Article.countDocuments();
    
    if (existingCount >= 6) {
      console.log(
        `⚠️  ${existingCount} articles already exist. Skipping article seeding...`
      );
      return;
    }

    const articles = [
      // Article 1: Cara Membuat Akun BRImo
      {
        translations: [
          {
            lang: "id",
            title: "Cara Membuat Akun BRImo",
            slug: "cara-membuat-akun-brimo",
            content: [
              {
                type: "text",
                value:
                  "BRImo adalah aplikasi mobile banking dari Bank BRI yang memudahkan nasabah untuk melakukan berbagai transaksi perbankan kapan saja dan dimana saja. Dengan BRImo, Anda dapat melakukan transfer, pembayaran tagihan, pembelian pulsa, dan masih banyak lagi, semua dari smartphone Anda.",
              },
              {
                type: "text",
                value:
                  "## Keuntungan Menggunakan BRImo\n\n• Transaksi 24/7 tanpa harus ke kantor cabang\n• Gratis biaya transfer antar rekening BRI\n• Keamanan berlapis dengan PIN dan biometrik\n• Notifikasi real-time untuk setiap transaksi\n• Interface yang user-friendly dan mudah digunakan",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
                caption: "Ilustrasi aplikasi mobile banking BRImo di smartphone",
              },
              {
                type: "text",
                value:
                  "## Langkah-Langkah Membuat Akun BRImo\n\n### 1. Download Aplikasi BRImo\n\nUnduh aplikasi BRImo dari Google Play Store (Android) atau App Store (iOS). Pastikan Anda mengunduh aplikasi resmi dari PT Bank Rakyat Indonesia (Persero) Tbk.",
              },
              {
                type: "text",
                value:
                  '### 2. Buka Aplikasi dan Pilih "Daftar"\n\nSetelah aplikasi terinstall, buka aplikasi BRImo dan pilih tombol "Daftar" atau "Register" pada halaman awal.',
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
                caption: "Tampilan halaman pendaftaran aplikasi BRImo",
              },
              {
                type: "text",
                value:
                  "### 3. Masukkan Data Pribadi\n\nIsi formulir pendaftaran dengan data pribadi Anda:\n• Nomor rekening BRI\n• Nomor kartu ATM BRI\n• PIN ATM\n• Nomor handphone yang terdaftar di BRI\n• Email aktif\n\nPastikan semua data yang Anda masukkan sesuai dengan data yang terdaftar di Bank BRI.",
              },
              {
                type: "text",
                value:
                  "### 4. Verifikasi Nomor Handphone\n\nSetelah mengisi formulir, Anda akan menerima kode OTP (One Time Password) melalui SMS. Masukkan kode OTP tersebut ke aplikasi untuk verifikasi.",
              },
              {
                type: "text",
                value:
                  "### 5. Buat User ID dan Password\n\nBuat User ID dan Password untuk login ke aplikasi BRImo. Gunakan kombinasi yang kuat dan mudah diingat. User ID minimal 8 karakter dan Password minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, dan angka.",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80",
                caption: "Setup keamanan akun dengan password dan biometrik",
              },
              {
                type: "text",
                value:
                  "### 6. Aktivasi Biometrik (Opsional)\n\nUntuk keamanan tambahan, Anda dapat mengaktifkan fitur biometrik seperti fingerprint atau face recognition. Fitur ini akan mempercepat proses login Anda.",
              },
              {
                type: "text",
                value:
                  "### 7. Selesai!\n\nAkun BRImo Anda sudah aktif dan siap digunakan. Anda sekarang dapat melakukan berbagai transaksi perbankan melalui aplikasi BRImo dengan mudah dan aman.",
              },
              {
                type: "text",
                value:
                  "## Tips Keamanan\n\n• Jangan pernah memberikan User ID, Password, atau PIN Anda kepada siapapun\n• Pastikan menggunakan jaringan internet yang aman\n• Selalu logout setelah selesai bertransaksi\n• Update aplikasi secara berkala\n• Aktifkan notifikasi transaksi untuk monitoring\n\nSelamat menggunakan BRImo! Nikmati kemudahan transaksi perbankan di ujung jari Anda.",
              },
            ],
          },
          {
            lang: "en",
            title: "How to Create a BRImo Account",
            slug: "how-to-create-brimo-account",
            content: [
              {
                type: "text",
                value:
                  "BRImo is a mobile banking application from Bank BRI that makes it easy for customers to conduct various banking transactions anytime and anywhere. With BRImo, you can transfer money, pay bills, purchase credits, and much more, all from your smartphone.",
              },
              {
                type: "text",
                value:
                  "## Benefits of Using BRImo\n\n• 24/7 transactions without visiting a branch\n• Free transfer fees between BRI accounts\n• Multi-layered security with PIN and biometrics\n• Real-time notifications for every transaction\n• User-friendly and easy-to-use interface",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
                caption: "Illustration of BRImo mobile banking app on smartphone",
              },
              {
                type: "text",
                value:
                  "## Steps to Create a BRImo Account\n\n### 1. Download the BRImo App\n\nDownload the BRImo app from Google Play Store (Android) or App Store (iOS). Make sure you download the official app from PT Bank Rakyat Indonesia (Persero) Tbk.",
              },
              {
                type: "text",
                value:
                  '### 2. Open the App and Select "Register"\n\nOnce the app is installed, open the BRImo app and select the "Register" button on the home page.',
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
                caption: "BRImo app registration page display",
              },
              {
                type: "text",
                value:
                  "### 3. Enter Personal Information\n\nFill out the registration form with your personal data:\n• BRI account number\n• BRI ATM card number\n• ATM PIN\n• Phone number registered with BRI\n• Active email\n\nMake sure all the data you enter matches the data registered with Bank BRI.",
              },
              {
                type: "text",
                value:
                  "### 4. Phone Number Verification\n\nAfter filling out the form, you will receive an OTP (One Time Password) code via SMS. Enter the OTP code into the app for verification.",
              },
              {
                type: "text",
                value:
                  "### 5. Create User ID and Password\n\nCreate a User ID and Password to log in to the BRImo app. Use a strong and memorable combination. User ID minimum 8 characters and Password minimum 8 characters with a combination of uppercase, lowercase, and numbers.",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80",
                caption: "Account security setup with password and biometrics",
              },
              {
                type: "text",
                value:
                  "### 6. Activate Biometrics (Optional)\n\nFor additional security, you can activate biometric features such as fingerprint or face recognition. This feature will speed up your login process.",
              },
              {
                type: "text",
                value:
                  "### 7. Done!\n\nYour BRImo account is now active and ready to use. You can now perform various banking transactions through the BRImo app easily and securely.",
              },
              {
                type: "text",
                value:
                  "## Security Tips\n\n• Never give your User ID, Password, or PIN to anyone\n• Make sure to use a secure internet network\n• Always logout after completing transactions\n• Update the app regularly\n• Enable transaction notifications for monitoring\n\nEnjoy using BRImo! Experience the convenience of banking transactions at your fingertips.",
              },
            ],
          },
        ],
        category: "Tutorial",
        author: "Tim BRI Digital",
        coverImage:
          "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80",
        status: "published",
        publishedAt: new Date(),
      },

      // Article 2: Cara Transfer Uang via BRImo
      {
        translations: [
          {
            lang: "id",
            title: "Cara Transfer Uang Menggunakan BRImo",
            slug: "cara-transfer-uang-brimo",
            content: [
              {
                type: "text",
                value:
                  "Transfer uang menjadi lebih mudah dan cepat dengan aplikasi BRImo. Anda dapat mengirim uang ke sesama rekening BRI maupun ke bank lain hanya dengan beberapa langkah sederhana. Artikel ini akan memandu Anda melakukan transfer dengan aman dan efisien.",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80",
                caption: "Transfer uang mudah dengan BRImo",
              },
              {
                type: "text",
                value:
                  "## Jenis Transfer di BRImo\n\n### 1. Transfer Sesama BRI\n• Gratis biaya admin\n• Proses instant\n• Limit hingga Rp 100 juta per hari\n\n### 2. Transfer Antar Bank\n• Biaya admin Rp 6.500\n• Proses real-time via BI-FAST\n• Limit hingga Rp 25 juta per transaksi",
              },
              {
                type: "text",
                value:
                  "## Langkah Transfer Sesama BRI\n\n### Step 1: Login ke BRImo\nBuka aplikasi BRImo dan login menggunakan User ID dan Password Anda. Anda juga bisa menggunakan biometrik untuk login lebih cepat.",
              },
              {
                type: "text",
                value:
                  '### Step 2: Pilih Menu Transfer\nPada halaman utama, pilih menu "Transfer" kemudian pilih "Sesama BRI".',
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
                caption: "Menu transfer di aplikasi BRImo",
              },
              {
                type: "text",
                value:
                  "### Step 3: Masukkan Nomor Rekening Tujuan\nKetik nomor rekening tujuan atau pilih dari daftar favorit jika sudah pernah tersimpan. Sistem akan otomatis menampilkan nama pemilik rekening.",
              },
              {
                type: "text",
                value:
                  "### Step 4: Input Nominal Transfer\nMasukkan jumlah uang yang ingin ditransfer. Anda juga bisa menambahkan berita/keterangan transfer jika diperlukan.",
              },
              {
                type: "text",
                value:
                  "### Step 5: Konfirmasi dan Verifikasi\nPeriksa kembali detail transfer Anda:\n• Nomor rekening tujuan\n• Nama penerima\n• Nominal transfer\n• Berita transfer (opsional)\n\nMasukkan PIN transaksi untuk verifikasi.",
              },
              {
                type: "text",
                value:
                  "### Step 6: Transfer Berhasil\nSetelah verifikasi berhasil, transfer akan diproses instantly. Anda akan menerima notifikasi dan bukti transfer yang bisa disimpan atau dibagikan.",
              },
              {
                type: "text",
                value:
                  "## Tips Transfer Aman\n\n• Selalu cek nama penerima sebelum konfirmasi\n• Simpan bukti transfer untuk referensi\n• Jangan bagikan PIN kepada siapapun\n• Gunakan jaringan internet yang aman\n• Pastikan saldo mencukupi\n• Double check nominal transfer\n\nDengan mengikuti panduan ini, Anda dapat melakukan transfer dengan mudah dan aman melalui BRImo.",
              },
            ],
          },
          {
            lang: "en",
            title: "How to Transfer Money Using BRImo",
            slug: "how-to-transfer-money-brimo",
            content: [
              {
                type: "text",
                value:
                  "Transferring money becomes easier and faster with the BRImo app. You can send money to other BRI accounts or to other banks with just a few simple steps. This article will guide you to transfer safely and efficiently.",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80",
                caption: "Easy money transfer with BRImo",
              },
              {
                type: "text",
                value:
                  "## Types of Transfers in BRImo\n\n### 1. Transfer Between BRI Accounts\n• Free admin fee\n• Instant process\n• Limit up to IDR 100 million per day\n\n### 2. Interbank Transfer\n• Admin fee IDR 6,500\n• Real-time process via BI-FAST\n• Limit up to IDR 25 million per transaction",
              },
              {
                type: "text",
                value:
                  "## Steps for BRI to BRI Transfer\n\n### Step 1: Login to BRImo\nOpen the BRImo app and login using your User ID and Password. You can also use biometrics for faster login.",
              },
              {
                type: "text",
                value:
                  '### Step 2: Select Transfer Menu\nOn the main page, select the "Transfer" menu then choose "BRI to BRI".',
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
                caption: "Transfer menu in BRImo app",
              },
              {
                type: "text",
                value:
                  "### Step 3: Enter Destination Account Number\nType the destination account number or select from favorites list if previously saved. The system will automatically display the account holder's name.",
              },
              {
                type: "text",
                value:
                  "### Step 4: Input Transfer Amount\nEnter the amount of money you want to transfer. You can also add a transfer note/description if needed.",
              },
              {
                type: "text",
                value:
                  "### Step 5: Confirm and Verify\nReview your transfer details:\n• Destination account number\n• Recipient name\n• Transfer amount\n• Transfer note (optional)\n\nEnter your transaction PIN for verification.",
              },
              {
                type: "text",
                value:
                  "### Step 6: Transfer Successful\nAfter successful verification, the transfer will be processed instantly. You will receive a notification and transfer receipt that can be saved or shared.",
              },
              {
                type: "text",
                value:
                  "## Safe Transfer Tips\n\n• Always check recipient name before confirmation\n• Save transfer receipt for reference\n• Never share your PIN with anyone\n• Use secure internet connection\n• Ensure sufficient balance\n• Double check transfer amount\n\nBy following this guide, you can transfer easily and safely through BRImo.",
              },
            ],
          },
        ],
        category: "Tutorial",
        author: "Tim BRI Digital",
        coverImage:
          "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80",
        status: "published",
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },

      // Article 3: Cara Bayar Tagihan
      {
        translations: [
          {
            lang: "id",
            title: "Cara Bayar Tagihan Listrik, Air, dan Internet via BRImo",
            slug: "cara-bayar-tagihan-brimo",
            content: [
              {
                type: "text",
                value:
                  "BRImo memudahkan Anda untuk membayar berbagai tagihan bulanan seperti listrik PLN, PDAM, internet, TV kabel, dan masih banyak lagi. Tidak perlu lagi antri di loket pembayaran, semua bisa dilakukan dari rumah kapan saja.",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
                caption: "Bayar tagihan mudah dengan BRImo",
              },
              {
                type: "text",
                value:
                  "## Jenis Tagihan yang Tersedia\n\n• Listrik PLN (Token & Tagihan)\n• Air PDAM\n• Telepon & Internet\n• TV Kabel & Streaming\n• Kartu Kredit\n• Angsuran Pinjaman\n• BPJS Kesehatan\n• Pajak PBB\n• Dan masih banyak lagi",
              },
              {
                type: "text",
                value:
                  "## Cara Bayar Tagihan Listrik PLN\n\n### 1. Login ke BRImo\nBuka aplikasi BRImo dan masuk ke akun Anda.",
              },
              {
                type: "text",
                value:
                  '### 2. Pilih Menu Pembayaran\nPada halaman utama, pilih menu "Pembayaran" atau "Payment", kemudian pilih "Listrik PLN".',
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
                caption: "Menu pembayaran tagihan di BRImo",
              },
              {
                type: "text",
                value:
                  "### 3. Pilih Jenis Pembayaran\n• PLN Pascabayar: untuk bayar tagihan bulanan\n• PLN Prabayar: untuk beli token listrik",
              },
              {
                type: "text",
                value:
                  "### 4. Masukkan ID Pelanggan\nKetik nomor ID pelanggan PLN Anda (biasanya 12 digit). Sistem akan menampilkan nama pelanggan dan jumlah tagihan.",
              },
              {
                type: "text",
                value:
                  "### 5. Cek Detail Tagihan\nPeriksa detail tagihan:\n• Nama pelanggan\n• Periode tagihan\n• Jumlah tagihan\n• Biaya admin\n• Total pembayaran",
              },
              {
                type: "text",
                value:
                  "### 6. Konfirmasi Pembayaran\nJika semua data sudah benar, lanjutkan ke pembayaran dan masukkan PIN transaksi.",
              },
              {
                type: "text",
                value:
                  "### 7. Simpan Bukti Pembayaran\nSetelah pembayaran berhasil, Anda akan menerima struk digital. Simpan sebagai bukti pembayaran.",
              },
              {
                type: "text",
                value:
                  "## Cara Bayar Tagihan Internet & TV Kabel\n\nProses pembayaran tagihan internet dan TV kabel hampir sama dengan listrik:\n\n1. Pilih provider (IndiHome, MyRepublic, Biznet, dll)\n2. Masukkan nomor pelanggan/ID\n3. Cek detail tagihan\n4. Konfirmasi dan bayar\n5. Simpan bukti pembayaran",
              },
              {
                type: "text",
                value:
                  "## Keuntungan Bayar Tagihan di BRImo\n\n• Tersedia 24/7\n• Proses cepat & instant\n• Tidak ada biaya antrian\n• Notifikasi pembayaran otomatis\n• Riwayat pembayaran tersimpan\n• Bisa jadwalkan pembayaran rutin\n• Bukti pembayaran digital\n\nBayar tagihan jadi lebih praktis dengan BRImo!",
              },
            ],
          },
          {
            lang: "en",
            title: "How to Pay Electricity, Water, and Internet Bills via BRImo",
            slug: "how-to-pay-bills-brimo",
            content: [
              {
                type: "text",
                value:
                  "BRImo makes it easy for you to pay various monthly bills such as PLN electricity, PDAM water, internet, cable TV, and many more. No need to queue at payment counters anymore, everything can be done from home anytime.",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
                caption: "Pay bills easily with BRImo",
              },
              {
                type: "text",
                value:
                  "## Available Bill Types\n\n• PLN Electricity (Token & Bills)\n• PDAM Water\n• Phone & Internet\n• Cable TV & Streaming\n• Credit Cards\n• Loan Installments\n• BPJS Health Insurance\n• Property Tax (PBB)\n• And many more",
              },
              {
                type: "text",
                value:
                  "## How to Pay PLN Electricity Bills\n\n### 1. Login to BRImo\nOpen the BRImo app and log into your account.",
              },
              {
                type: "text",
                value:
                  '### 2. Select Payment Menu\nOn the main page, select "Payment" menu, then choose "PLN Electricity".',
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
                caption: "Bill payment menu in BRImo",
              },
              {
                type: "text",
                value:
                  "### 3. Choose Payment Type\n• PLN Postpaid: for monthly bill payment\n• PLN Prepaid: to buy electricity tokens",
              },
              {
                type: "text",
                value:
                  "### 4. Enter Customer ID\nType your PLN customer ID number (usually 12 digits). The system will display customer name and bill amount.",
              },
              {
                type: "text",
                value:
                  "### 5. Check Bill Details\nReview bill details:\n• Customer name\n• Billing period\n• Bill amount\n• Admin fee\n• Total payment",
              },
              {
                type: "text",
                value:
                  "### 6. Confirm Payment\nIf all data is correct, proceed to payment and enter your transaction PIN.",
              },
              {
                type: "text",
                value:
                  "### 7. Save Payment Receipt\nAfter successful payment, you will receive a digital receipt. Save it as proof of payment.",
              },
              {
                type: "text",
                value:
                  "## How to Pay Internet & Cable TV Bills\n\nThe process for paying internet and cable TV bills is similar to electricity:\n\n1. Select provider (IndiHome, MyRepublic, Biznet, etc)\n2. Enter customer number/ID\n3. Check bill details\n4. Confirm and pay\n5. Save payment receipt",
              },
              {
                type: "text",
                value:
                  "## Benefits of Paying Bills in BRImo\n\n• Available 24/7\n• Fast & instant process\n• No queuing fees\n• Automatic payment notifications\n• Payment history saved\n• Can schedule recurring payments\n• Digital payment receipts\n\nPaying bills becomes more practical with BRImo!",
              },
            ],
          },
        ],
        category: "Tutorial",
        author: "Tim BRI Digital",
        coverImage:
          "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1200&q=80",
        status: "published",
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },

      // Article 4: Fitur Keamanan BRImo
      {
        translations: [
          {
            lang: "id",
            title: "Fitur Keamanan BRImo yang Wajib Anda Ketahui",
            slug: "fitur-keamanan-brimo",
            content: [
              {
                type: "text",
                value:
                  "Keamanan adalah prioritas utama dalam bertransaksi digital. BRImo dilengkapi dengan berbagai fitur keamanan berlapis untuk melindungi data dan transaksi keuangan Anda. Mari kita bahas fitur-fitur keamanan yang membuat BRImo aman digunakan.",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&q=80",
                caption: "Keamanan berlapis di BRImo",
              },
              {
                type: "text",
                value:
                  "## Sistem Keamanan Multi-Layer\n\n### 1. Enkripsi End-to-End\nSemua data yang dikirim antara aplikasi BRImo dan server BRI dienkripsi menggunakan teknologi SSL 256-bit. Ini memastikan data Anda tidak dapat dibaca oleh pihak ketiga.",
              },
              {
                type: "text",
                value:
                  "### 2. Autentikasi Biometrik\n• Fingerprint (Sidik Jari)\n• Face Recognition (Pengenalan Wajah)\n• Lebih cepat dan aman dari password\n• Tidak bisa diduplikasi atau dicuri",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1563986768711-b3bde3dc821e?w=800&q=80",
                caption: "Login dengan biometrik untuk keamanan maksimal",
              },
              {
                type: "text",
                value:
                  "### 3. PIN Transaksi 6 Digit\nSetiap transaksi memerlukan PIN khusus yang berbeda dari PIN ATM. PIN ini:\n• Harus 6 digit angka\n• Tidak boleh angka berurutan (123456)\n• Tidak boleh angka sama semua (111111)\n• Bisa diubah kapan saja\n• Akan terkunci setelah 3x salah input",
              },
              {
                type: "text",
                value:
                  "### 4. Verifikasi OTP (One Time Password)\nUntuk transaksi tertentu atau perubahan data penting, BRImo akan mengirim kode OTP via SMS ke nomor terdaftar. Kode ini:\n• Berlaku 3 menit\n• Hanya sekali pakai\n• Tidak bisa ditebak\n• Wajib dirahasiakan",
              },
              {
                type: "text",
                value:
                  "## Fitur Keamanan Tambahan\n\n### Auto Logout\nAplikasi akan otomatis logout jika:\n• Tidak ada aktivitas selama 3 menit\n• Aplikasi diminimize terlalu lama\n• Terdeteksi aktivitas mencurigakan",
              },
              {
                type: "text",
                value:
                  "### Anti Screenshot\nBRImo memblokir screenshot di halaman-halaman sensitif seperti:\n• Input PIN\n• Detail saldo\n• Informasi rekening\n• Data pribadi",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80",
                caption: "Notifikasi real-time untuk setiap transaksi",
              },
              {
                type: "text",
                value:
                  "### Notifikasi Real-Time\nAnda akan menerima notifikasi instant untuk:\n• Setiap transaksi yang berhasil\n• Login dari device baru\n• Perubahan data akun\n• Aktivitas mencurigakan",
              },
              {
                type: "text",
                value:
                  "### Device Binding\nBRImo akan mengenali device yang Anda gunakan:\n• Maksimal 2 device aktif\n• Notifikasi jika ada login dari device baru\n• Bisa remote logout dari device lain\n• Verifikasi extra untuk device baru",
              },
              {
                type: "text",
                value:
                  "## Tips Menjaga Keamanan Akun\n\n### DO (Yang Harus Dilakukan):\n• Aktifkan biometrik untuk login cepat\n• Gunakan PIN yang kuat dan unik\n• Update aplikasi secara berkala\n• Aktifkan notifikasi transaksi\n• Gunakan jaringan internet yang aman\n• Logout setelah selesai transaksi\n• Ganti PIN secara berkala",
              },
              {
                type: "text",
                value:
                  "### DON'T (Yang Tidak Boleh Dilakukan):\n• Jangan bagikan User ID, Password, atau PIN\n• Jangan simpan PIN di notes handphone\n• Jangan login di WiFi public\n• Jangan klik link mencurigakan\n• Jangan install aplikasi dari luar Play Store\n• Jangan berikan kode OTP ke siapapun\n• Jangan screenshot data sensitif",
              },
              {
                type: "text",
                value:
                  "## Apa yang Harus Dilakukan Jika...\n\n### Handphone Hilang\n1. Segera hubungi BRI Call Center 14017/1500017\n2. Blokir aplikasi BRImo\n3. Ganti PIN dan password\n4. Laporkan ke kantor cabang terdekat",
              },
              {
                type: "text",
                value:
                  "### Lupa PIN\n1. Buka aplikasi BRImo\n2. Pilih 'Lupa PIN'\n3. Verifikasi dengan data pribadi\n4. Buat PIN baru\n5. Konfirmasi dengan OTP",
              },
              {
                type: "text",
                value:
                  "### Transaksi Mencurigakan\n1. Screenshot bukti transaksi\n2. Segera hubungi BRI Call Center\n3. Laporkan detail transaksi\n4. Blokir akun jika perlu\n5. Datang ke kantor cabang terdekat\n\nDengan memahami dan memanfaatkan fitur keamanan BRImo dengan baik, Anda dapat bertransaksi dengan tenang dan aman.",
              },
            ],
          },
          {
            lang: "en",
            title: "BRImo Security Features You Must Know",
            slug: "brimo-security-features",
            content: [
              {
                type: "text",
                value:
                  "Security is the top priority in digital transactions. BRImo is equipped with various multi-layer security features to protect your data and financial transactions. Let's discuss the security features that make BRImo safe to use.",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&q=80",
                caption: "Multi-layer security in BRImo",
              },
              {
                type: "text",
                value:
                  "## Multi-Layer Security System\n\n### 1. End-to-End Encryption\nAll data sent between the BRImo app and BRI servers is encrypted using 256-bit SSL technology. This ensures your data cannot be read by third parties.",
              },
              {
                type: "text",
                value:
                  "### 2. Biometric Authentication\n• Fingerprint\n• Face Recognition\n• Faster and more secure than passwords\n• Cannot be duplicated or stolen",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1563986768711-b3bde3dc821e?w=800&q=80",
                caption: "Login with biometrics for maximum security",
              },
              {
                type: "text",
                value:
                  "### 3. 6-Digit Transaction PIN\nEach transaction requires a special PIN different from your ATM PIN. This PIN:\n• Must be 6 digits\n• Cannot be sequential numbers (123456)\n• Cannot be all same numbers (111111)\n• Can be changed anytime\n• Will be locked after 3 wrong attempts",
              },
              {
                type: "text",
                value:
                  "### 4. OTP Verification (One Time Password)\nFor certain transactions or important data changes, BRImo will send an OTP code via SMS to your registered number. This code:\n• Valid for 3 minutes\n• Single use only\n• Cannot be guessed\n• Must be kept confidential",
              },
              {
                type: "text",
                value:
                  "## Additional Security Features\n\n### Auto Logout\nThe app will automatically logout if:\n• No activity for 3 minutes\n• App minimized too long\n• Suspicious activity detected",
              },
              {
                type: "text",
                value:
                  "### Anti Screenshot\nBRImo blocks screenshots on sensitive pages such as:\n• PIN input\n• Balance details\n• Account information\n• Personal data",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80",
                caption: "Real-time notifications for every transaction",
              },
              {
                type: "text",
                value:
                  "### Real-Time Notifications\nYou will receive instant notifications for:\n• Every successful transaction\n• Login from new device\n• Account data changes\n• Suspicious activities",
              },
              {
                type: "text",
                value:
                  "### Device Binding\nBRImo will recognize the device you use:\n• Maximum 2 active devices\n• Notification for login from new device\n• Can remote logout from other devices\n• Extra verification for new devices",
              },
              {
                type: "text",
                value:
                  "## Tips for Keeping Your Account Safe\n\n### DO (What to Do):\n• Enable biometrics for quick login\n• Use strong and unique PIN\n• Update app regularly\n• Enable transaction notifications\n• Use secure internet connection\n• Logout after transactions\n• Change PIN regularly",
              },
              {
                type: "text",
                value:
                  "### DON'T (What Not to Do):\n• Don't share User ID, Password, or PIN\n• Don't save PIN in phone notes\n• Don't login on public WiFi\n• Don't click suspicious links\n• Don't install apps from outside Play Store\n• Don't give OTP code to anyone\n• Don't screenshot sensitive data",
              },
              {
                type: "text",
                value:
                  "## What to Do If...\n\n### Phone Lost\n1. Immediately contact BRI Call Center 14017/1500017\n2. Block BRImo app\n3. Change PIN and password\n4. Report to nearest branch office",
              },
              {
                type: "text",
                value:
                  "### Forgot PIN\n1. Open BRImo app\n2. Select 'Forgot PIN'\n3. Verify with personal data\n4. Create new PIN\n5. Confirm with OTP",
              },
              {
                type: "text",
                value:
                  "### Suspicious Transaction\n1. Screenshot transaction proof\n2. Immediately contact BRI Call Center\n3. Report transaction details\n4. Block account if necessary\n5. Visit nearest branch office\n\nBy understanding and utilizing BRImo security features properly, you can transact with peace of mind and safety.",
              },
            ],
          },
        ],
        category: "Keamanan",
        author: "Tim Security BRI",
        coverImage:
          "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80",
        status: "published",
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },

      // Article 5: Investasi & Tabungan
      {
        translations: [
          {
            lang: "id",
            title: "Mengenal Produk Tabungan dan Investasi di BRImo",
            slug: "produk-tabungan-investasi-brimo",
            content: [
              {
                type: "text",
                value:
                  "BRImo tidak hanya untuk transaksi harian, tetapi juga menyediakan berbagai produk tabungan dan investasi yang dapat membantu Anda merencanakan keuangan masa depan. Artikel ini akan membahas produk-produk yang tersedia dan cara mengaksesnya melalui BRImo.",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
                caption: "Kelola tabungan dan investasi di BRImo",
              },
              {
                type: "text",
                value:
                  "## Produk Tabungan BRI\n\n### 1. Tabungan BritAma\n• Setoran awal minimal Rp 250.000\n• Suku bunga kompetitif\n• Gratis biaya admin untuk saldo ≥ Rp 500.000\n• Dapat diakses melalui BRImo, ATM, dan EDC\n• Asuransi kecelakaan hingga Rp 250 juta",
              },
              {
                type: "text",
                value:
                  "### 2. Simpedes\n• Khusus untuk masyarakat pedesaan\n• Setoran awal Rp 100.000\n• Program undian berhadiah\n• Gratis biaya admin\n• Suku bunga menarik",
              },
              {
                type: "text",
                value:
                  "### 3. TabunganKu\n• Setoran awal hanya Rp 20.000\n• Tanpa biaya admin bulanan\n• Cocok untuk pemula\n• Dapat dibuka di semua kantor BRI\n• Mudah dikelola via BRImo",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=80",
                caption: "Berbagai pilihan produk tabungan BRI",
              },
              {
                type: "text",
                value:
                  "## Produk Investasi BRI\n\n### 1. Deposito BRI\n• Minimal Rp 10 juta\n• Tenor 1, 3, 6, 12, atau 24 bulan\n• Suku bunga hingga 3.25% per tahun\n• Dijamin LPS hingga Rp 2 miliar\n• Dapat diperpanjang otomatis (ARO)\n• Bisa dibuka via BRImo",
              },
              {
                type: "text",
                value:
                  "### 2. Reksa Dana\n• Dikelola oleh Manajer Investasi profesional\n• Minimal investasi Rp 100.000\n• Berbagai pilihan produk:\n  - Reksa Dana Pasar Uang\n  - Reksa Dana Pendapatan Tetap\n  - Reksa Dana Campuran\n  - Reksa Dana Saham\n• Return lebih tinggi dari tabungan\n• Risiko sesuai profil investor",
              },
              {
                type: "text",
                value:
                  "### 3. Obligasi Negara (SBN)\n• Investasi aman dijamin pemerintah\n• Minimal Rp 1 juta\n• Kupon/bunga tetap\n• Dapat diperdagangkan\n• Cocok untuk investasi jangka menengah-panjang",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
                caption: "Investasi mudah melalui aplikasi BRImo",
              },
              {
                type: "text",
                value:
                  "## Cara Membuka Produk via BRImo\n\n### Membuka Deposito\n1. Login ke BRImo\n2. Pilih menu 'Deposito'\n3. Pilih 'Buka Deposito Baru'\n4. Tentukan nominal dan tenor\n5. Pilih sumber dana (dari rekening tabungan)\n6. Konfirmasi dengan PIN\n7. Deposito aktif",
              },
              {
                type: "text",
                value:
                  "### Membeli Reksa Dana\n1. Login ke BRImo\n2. Pilih menu 'Investasi'\n3. Pilih 'Reksa Dana'\n4. Browse produk reksa dana\n5. Lihat detail dan performa\n6. Tentukan nominal pembelian\n7. Konfirmasi transaksi\n8. Selesai",
              },
              {
                type: "text",
                value:
                  "## Tips Memilih Produk yang Tepat\n\n### Untuk Pemula:\n• Mulai dengan TabunganKu atau BritAma\n• Coba deposito dengan tenor pendek\n• Pelajari reksa dana pasar uang\n• Jangan terburu-buru investasi berisiko tinggi",
              },
              {
                type: "text",
                value:
                  "### Untuk Profil Konservatif:\n• Deposito dengan tenor sesuai kebutuhan\n• Reksa dana pasar uang atau pendapatan tetap\n• Obligasi negara\n• Fokus pada capital preservation",
              },
              {
                type: "text",
                value:
                  "### Untuk Profil Agresif:\n• Reksa dana saham\n• Kombinasi deposito dan reksa dana\n• Diversifikasi portfolio\n• Siap dengan volatilitas pasar",
              },
              {
                type: "text",
                value:
                  "## Simulasi Perhitungan\n\n### Contoh Deposito:\nModal: Rp 10.000.000\nBunga: 3% per tahun\nTenor: 12 bulan\nReturn: Rp 10.300.000 (setelah pajak)\n\n### Contoh Reksa Dana:\nInvestasi: Rp 1.000.000/bulan\nReturn: 10% per tahun\nJangka waktu: 5 tahun\nTotal: Rp 77 juta (estimasi)",
              },
              {
                type: "text",
                value:
                  "## Kesimpulan\n\nBRImo menyediakan akses mudah ke berbagai produk tabungan dan investasi. Pilih produk yang sesuai dengan:\n• Tujuan keuangan Anda\n• Profil risiko\n• Jangka waktu investasi\n• Kemampuan finansial\n\nMulai investasi dari sekarang dan wujudkan tujuan keuangan Anda!",
              },
            ],
          },
          {
            lang: "en",
            title: "Understanding Savings and Investment Products in BRImo",
            slug: "savings-investment-products-brimo",
            content: [
              {
                type: "text",
                value:
                  "BRImo is not just for daily transactions, but also provides various savings and investment products that can help you plan your financial future. This article will discuss available products and how to access them through BRImo.",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
                caption: "Manage savings and investments in BRImo",
              },
              {
                type: "text",
                value:
                  "## BRI Savings Products\n\n### 1. BritAma Savings\n• Minimum initial deposit IDR 250,000\n• Competitive interest rates\n• Free admin fee for balance ≥ IDR 500,000\n• Accessible via BRImo, ATM, and EDC\n• Accident insurance up to IDR 250 million",
              },
              {
                type: "text",
                value:
                  "### 2. Simpedes\n• Specially for rural communities\n• Initial deposit IDR 100,000\n• Prize draw program\n• Free admin fee\n• Attractive interest rates",
              },
              {
                type: "text",
                value:
                  "### 3. TabunganKu\n• Initial deposit only IDR 20,000\n• No monthly admin fee\n• Suitable for beginners\n• Can be opened at all BRI offices\n• Easy to manage via BRImo",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=80",
                caption: "Various BRI savings product options",
              },
              {
                type: "text",
                value:
                  "## BRI Investment Products\n\n### 1. BRI Time Deposit\n• Minimum IDR 10 million\n• Tenure 1, 3, 6, 12, or 24 months\n• Interest rate up to 3.25% per year\n• Guaranteed by LPS up to IDR 2 billion\n• Can be automatically rolled over (ARO)\n• Can be opened via BRImo",
              },
              {
                type: "text",
                value:
                  "### 2. Mutual Funds\n• Managed by professional Investment Managers\n• Minimum investment IDR 100,000\n• Various product options:\n  - Money Market Mutual Funds\n  - Fixed Income Mutual Funds\n  - Balanced Mutual Funds\n  - Equity Mutual Funds\n• Higher returns than savings\n• Risk according to investor profile",
              },
              {
                type: "text",
                value:
                  "### 3. Government Bonds (SBN)\n• Safe investment guaranteed by government\n• Minimum IDR 1 million\n• Fixed coupon/interest\n• Can be traded\n• Suitable for medium-long term investment",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
                caption: "Easy investment through BRImo app",
              },
              {
                type: "text",
                value:
                  "## How to Open Products via BRImo\n\n### Opening Time Deposit\n1. Login to BRImo\n2. Select 'Deposito' menu\n3. Choose 'Open New Deposit'\n4. Determine amount and tenure\n5. Select fund source (from savings account)\n6. Confirm with PIN\n7. Deposit active",
              },
              {
                type: "text",
                value:
                  "### Buying Mutual Funds\n1. Login to BRImo\n2. Select 'Investment' menu\n3. Choose 'Mutual Funds'\n4. Browse mutual fund products\n5. View details and performance\n6. Determine purchase amount\n7. Confirm transaction\n8. Done",
              },
              {
                type: "text",
                value:
                  "## Tips for Choosing the Right Product\n\n### For Beginners:\n• Start with TabunganKu or BritAma\n• Try short-term deposits\n• Learn money market mutual funds\n• Don't rush into high-risk investments",
              },
              {
                type: "text",
                value:
                  "### For Conservative Profile:\n• Deposits with suitable tenure\n• Money market or fixed income mutual funds\n• Government bonds\n• Focus on capital preservation",
              },
              {
                type: "text",
                value:
                  "### For Aggressive Profile:\n• Equity mutual funds\n• Combination of deposits and mutual funds\n• Portfolio diversification\n• Ready for market volatility",
              },
              {
                type: "text",
                value:
                  "## Calculation Simulation\n\n### Deposit Example:\nCapital: IDR 10,000,000\nInterest: 3% per year\nTenure: 12 months\nReturn: IDR 10,300,000 (after tax)\n\n### Mutual Fund Example:\nInvestment: IDR 1,000,000/month\nReturn: 10% per year\nPeriod: 5 years\nTotal: IDR 77 million (estimated)",
              },
              {
                type: "text",
                value:
                  "## Conclusion\n\nBRImo provides easy access to various savings and investment products. Choose products that suit:\n• Your financial goals\n• Risk profile\n• Investment timeframe\n• Financial capability\n\nStart investing now and achieve your financial goals!",
              },
            ],
          },
        ],
        category: "Investasi",
        author: "Tim Financial Planning BRI",
        coverImage:
          "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=80",
        status: "published",
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },

      // Article 6: Tips Mengelola Keuangan
      {
        translations: [
          {
            lang: "id",
            title: "Tips Mengelola Keuangan dengan Bijak Menggunakan BRImo",
            slug: "tips-mengelola-keuangan-brimo",
            content: [
              {
                type: "text",
                value:
                  "Mengelola keuangan dengan baik adalah kunci kesejahteraan finansial. BRImo menyediakan berbagai fitur yang dapat membantu Anda mengatur dan memantau keuangan dengan lebih mudah. Berikut adalah tips dan trik mengelola keuangan menggunakan BRImo.",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=800&q=80",
                caption: "Kelola keuangan dengan smart menggunakan BRImo",
              },
              {
                type: "text",
                value:
                  "## Fitur BRImo untuk Pengelolaan Keuangan\n\n### 1. Cek Saldo Real-Time\n• Pantau saldo kapan saja\n• Notifikasi setiap transaksi\n• Histori transaksi lengkap\n• Grafik pengeluaran bulanan",
              },
              {
                type: "text",
                value:
                  "### 2. Mutasi Rekening Digital\n• Lihat riwayat transaksi 3 bulan terakhir\n• Download e-statement PDF\n• Filter transaksi by kategori\n• Cari transaksi spesifik dengan mudah",
              },
              {
                type: "text",
                value:
                  "### 3. Fitur Pembayaran Terjadwal\n• Set reminder pembayaran tagihan\n• Auto-debit untuk tagihan rutin\n• Tidak akan lupa bayar tagihan\n• Hindari denda keterlambatan",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1559589689-577aabd1db4f?w=800&q=80",
                caption: "Pantau keuangan real-time di BRImo",
              },
              {
                type: "text",
                value:
                  "## Metode 50/30/20 dengan BRImo\n\nMetode ini membagi pendapatan menjadi 3 kategori:\n\n### 50% - Kebutuhan (Needs)\n• Sewa/cicilan rumah\n• Listrik, air, internet\n• Transportasi\n• Bahan makanan\n• Asuransi\n\nGunakan BRImo untuk auto-debit semua tagihan ini.",
              },
              {
                type: "text",
                value:
                  "### 30% - Keinginan (Wants)\n• Hiburan\n• Makan di luar\n• Shopping\n• Hobi\n• Liburan\n\nPantau pengeluaran ini melalui histori transaksi BRImo.",
              },
              {
                type: "text",
                value:
                  "### 20% - Tabungan & Investasi (Savings)\n• Dana darurat\n• Tabungan tujuan\n• Investasi jangka panjang\n• Pensiun\n\nManfaatkan fitur auto-transfer BRImo ke rekening tabungan atau investasi.",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1633158829875-e5316a358c6f?w=800&q=80",
                caption: "Alokasi keuangan dengan metode 50/30/20",
              },
              {
                type: "text",
                value:
                  "## Tips Menghemat dengan BRImo\n\n### 1. Manfaatkan Promo & Cashback\n• Cek promo merchant di BRImo\n• Gunakan QRIS untuk transaksi\n• Dapatkan poin rewards\n• Ikuti program undian BRI",
              },
              {
                type: "text",
                value:
                  "### 2. Gunakan Fitur Budgeting\n• Tentukan budget bulanan\n• Set alert jika mendekati limit\n• Review pengeluaran setiap minggu\n• Adjust budget sesuai kebutuhan",
              },
              {
                type: "text",
                value:
                  "### 3. Otomasi Tabungan\n• Set auto-transfer ke rekening tabungan\n• Tentukan tanggal transfer (setelah gajian)\n• Sisihkan minimal 20% pendapatan\n• Treat savings as expense",
              },
              {
                type: "text",
                value:
                  "### 4. Hindari Hutang Konsumtif\n• Gunakan kartu debit bukan kredit\n• Bayar tagihan tepat waktu\n• Jangan berutang untuk lifestyle\n• Prioritaskan kebutuhan vs keinginan",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&q=80",
                caption: "Hemat dan bijak kelola keuangan",
              },
              {
                type: "text",
                value:
                  "## Dana Darurat: Berapa yang Ideal?\n\n### Single/Belum Menikah:\n• 3-6 bulan pengeluaran\n• Contoh: pengeluaran Rp 5 juta/bulan\n• Dana darurat: Rp 15-30 juta\n\n### Sudah Menikah:\n• 6-9 bulan pengeluaran\n• Contoh: pengeluaran Rp 8 juta/bulan\n• Dana darurat: Rp 48-72 juta\n\n### Punya Anak:\n• 9-12 bulan pengeluaran\n• Contoh: pengeluaran Rp 10 juta/bulan\n• Dana darurat: Rp 90-120 juta",
              },
              {
                type: "text",
                value:
                  "## Cara Membuat Financial Goals di BRImo\n\n### 1. Tentukan Tujuan\n• Beli rumah\n• Dana pendidikan anak\n• Dana pensiun\n• Liburan keluarga\n• Beli kendaraan",
              },
              {
                type: "text",
                value:
                  "### 2. Hitung Target & Waktu\nContoh:\n• Tujuan: Beli mobil\n• Target: Rp 200 juta\n• Waktu: 5 tahun\n• Tabungan/bulan: Rp 3.3 juta",
              },
              {
                type: "text",
                value:
                  "### 3. Pilih Instrumen yang Tepat\n• Jangka pendek (<1 tahun): Tabungan/Deposito\n• Jangka menengah (1-5 tahun): Deposito/Reksa Dana\n• Jangka panjang (>5 tahun): Reksa Dana/Saham",
              },
              {
                type: "text",
                value:
                  "### 4. Monitor Progress\n• Cek progress setiap bulan\n• Review dan adjust jika perlu\n• Celebrate small wins\n• Stay consistent",
              },
              {
                type: "text",
                value:
                  "## Kesalahan Umum yang Harus Dihindari\n\n### ❌ Tidak Punya Budget\nBanyak orang tidak tahu kemana uang mereka pergi. Solusi: Buat budget dan track pengeluaran di BRImo.",
              },
              {
                type: "text",
                value:
                  "### ❌ Lifestyle Inflation\nSaat gaji naik, pengeluaran juga naik. Solusi: Naikkan tabungan, bukan lifestyle.",
              },
              {
                type: "text",
                value:
                  "### ❌ Tidak Punya Dana Darurat\nLangsung investasi tanpa dana darurat. Solusi: Bangun dana darurat dulu, baru investasi.",
              },
              {
                type: "text",
                value:
                  "### ❌ Impulsive Buying\nBeli barang yang tidak direncanakan. Solusi: Terapkan aturan 24 jam sebelum beli barang non-esensial.",
              },
              {
                type: "text",
                value:
                  "### ❌ Tidak Review Keuangan\nJarang cek kondisi keuangan. Solusi: Review minimal sebulan sekali via BRImo.",
              },
              {
                type: "text",
                value:
                  "## Action Plan: Mulai dari Sekarang!\n\n### Week 1:\n• Download mutasi rekening 3 bulan terakhir\n• Kategorikan pengeluaran\n• Hitung rata-rata pengeluaran bulanan\n• Identifikasi pengeluaran yang bisa dikurangi",
              },
              {
                type: "text",
                value:
                  "### Week 2:\n• Buat budget dengan metode 50/30/20\n• Set auto-transfer untuk tabungan\n• Aktifkan auto-debit untuk tagihan rutin\n• Set reminder di BRImo",
              },
              {
                type: "text",
                value:
                  "### Week 3:\n• Mulai bangun dana darurat\n• Riset produk investasi di BRImo\n• Tentukan financial goals\n• Buat timeline pencapaian",
              },
              {
                type: "text",
                value:
                  "### Week 4:\n• Review progress minggu 1-3\n• Adjust budget jika perlu\n• Mulai investasi jika dana darurat sudah cukup\n• Konsisten jalankan rencana\n\nIngat: Financial freedom dimulai dari kebiasaan kecil yang konsisten. Manfaatkan BRImo untuk mempermudah perjalanan finansial Anda!",
              },
            ],
          },
          {
            lang: "en",
            title: "Tips for Managing Finances Wisely Using BRImo",
            slug: "tips-managing-finances-brimo",
            content: [
              {
                type: "text",
                value:
                  "Managing finances well is the key to financial well-being. BRImo provides various features that can help you manage and monitor your finances more easily. Here are tips and tricks for managing finances using BRImo.",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=800&q=80",
                caption: "Smart financial management using BRImo",
              },
              {
                type: "text",
                value:
                  "## BRImo Features for Financial Management\n\n### 1. Real-Time Balance Check\n• Monitor balance anytime\n• Notification for every transaction\n• Complete transaction history\n• Monthly expense charts",
              },
              {
                type: "text",
                value:
                  "### 2. Digital Account Statement\n• View transaction history for the last 3 months\n• Download e-statement PDF\n• Filter transactions by category\n• Search specific transactions easily",
              },
              {
                type: "text",
                value:
                  "### 3. Scheduled Payment Feature\n• Set bill payment reminders\n• Auto-debit for recurring bills\n• Never forget to pay bills\n• Avoid late payment penalties",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1559589689-577aabd1db4f?w=800&q=80",
                caption: "Monitor finances real-time in BRImo",
              },
              {
                type: "text",
                value:
                  "## The 50/30/20 Method with BRImo\n\nThis method divides income into 3 categories:\n\n### 50% - Needs\n• Rent/mortgage\n• Electricity, water, internet\n• Transportation\n• Groceries\n• Insurance\n\nUse BRImo for auto-debit all these bills.",
              },
              {
                type: "text",
                value:
                  "### 30% - Wants\n• Entertainment\n• Dining out\n• Shopping\n• Hobbies\n• Vacation\n\nMonitor these expenses through BRImo transaction history.",
              },
              {
                type: "text",
                value:
                  "### 20% - Savings & Investment\n• Emergency fund\n• Goal-based savings\n• Long-term investment\n• Retirement\n\nUtilize BRImo auto-transfer feature to savings or investment accounts.",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1633158829875-e5316a358c6f?w=800&q=80",
                caption: "Financial allocation with 50/30/20 method",
              },
              {
                type: "text",
                value:
                  "## Money-Saving Tips with BRImo\n\n### 1. Utilize Promos & Cashback\n• Check merchant promos in BRImo\n• Use QRIS for transactions\n• Earn reward points\n• Join BRI lottery programs",
              },
              {
                type: "text",
                value:
                  "### 2. Use Budgeting Features\n• Set monthly budget\n• Set alerts when approaching limits\n• Review expenses weekly\n• Adjust budget as needed",
              },
              {
                type: "text",
                value:
                  "### 3. Automate Savings\n• Set auto-transfer to savings account\n• Determine transfer date (after payday)\n• Save at least 20% of income\n• Treat savings as expense",
              },
              {
                type: "text",
                value:
                  "### 4. Avoid Consumptive Debt\n• Use debit card not credit\n• Pay bills on time\n• Don't borrow for lifestyle\n• Prioritize needs vs wants",
              },
              {
                type: "image",
                value:
                  "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&q=80",
                caption: "Save and wisely manage finances",
              },
              {
                type: "text",
                value:
                  "## Emergency Fund: What's Ideal?\n\n### Single/Unmarried:\n• 3-6 months expenses\n• Example: expenses IDR 5 million/month\n• Emergency fund: IDR 15-30 million\n\n### Married:\n• 6-9 months expenses\n• Example: expenses IDR 8 million/month\n• Emergency fund: IDR 48-72 million\n\n### With Children:\n• 9-12 months expenses\n• Example: expenses IDR 10 million/month\n• Emergency fund: IDR 90-120 million",
              },
              {
                type: "text",
                value:
                  "## How to Create Financial Goals in BRImo\n\n### 1. Define Goals\n• Buy house\n• Children's education fund\n• Retirement fund\n• Family vacation\n• Buy vehicle",
              },
              {
                type: "text",
                value:
                  "### 2. Calculate Target & Time\nExample:\n• Goal: Buy car\n• Target: IDR 200 million\n• Time: 5 years\n• Savings/month: IDR 3.3 million",
              },
              {
                type: "text",
                value:
                  "### 3. Choose Right Instrument\n• Short-term (<1 year): Savings/Deposit\n• Medium-term (1-5 years): Deposit/Mutual Funds\n• Long-term (>5 years): Mutual Funds/Stocks",
              },
              {
                type: "text",
                value:
                  "### 4. Monitor Progress\n• Check progress monthly\n• Review and adjust if needed\n• Celebrate small wins\n• Stay consistent",
              },
              {
                type: "text",
                value:
                  "## Common Mistakes to Avoid\n\n### ❌ No Budget\nMany people don't know where their money goes. Solution: Create budget and track expenses in BRImo.",
              },
              {
                type: "text",
                value:
                  "### ❌ Lifestyle Inflation\nWhen salary increases, expenses also increase. Solution: Increase savings, not lifestyle.",
              },
              {
                type: "text",
                value:
                  "### ❌ No Emergency Fund\nInvesting directly without emergency fund. Solution: Build emergency fund first, then invest.",
              },
              {
                type: "text",
                value:
                  "### ❌ Impulsive Buying\nBuying unplanned items. Solution: Apply 24-hour rule before buying non-essential items.",
              },
              {
                type: "text",
                value:
                  "### ❌ Not Reviewing Finances\nRarely checking financial condition. Solution: Review at least once a month via BRImo.",
              },
              {
                type: "text",
                value:
                  "## Action Plan: Start Now!\n\n### Week 1:\n• Download account statements for last 3 months\n• Categorize expenses\n• Calculate average monthly expenses\n• Identify expenses that can be reduced",
              },
              {
                type: "text",
                value:
                  "### Week 2:\n• Create budget with 50/30/20 method\n• Set auto-transfer for savings\n• Activate auto-debit for recurring bills\n• Set reminders in BRImo",
              },
              {
                type: "text",
                value:
                  "### Week 3:\n• Start building emergency fund\n• Research investment products in BRImo\n• Define financial goals\n• Create achievement timeline",
              },
              {
                type: "text",
                value:
                  "### Week 4:\n• Review progress from week 1-3\n• Adjust budget if needed\n• Start investing if emergency fund is sufficient\n• Consistently execute plan\n\nRemember: Financial freedom starts with small consistent habits. Utilize BRImo to ease your financial journey!",
              },
            ],
          },
        ],
        category: "Tips & Trik",
        author: "Tim Financial Planning BRI",
        coverImage:
          "https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=1200&q=80",
        status: "published",
        publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
    ];

    // Insert articles
    const createdArticles = await Article.insertMany(articles);
    console.log(`✅ ${createdArticles.length} articles created successfully!`);
    
    createdArticles.forEach((article, index) => {
      console.log(`\n📄 Article ${index + 1}:`);
      console.log(`   ID: ${article._id}`);
      console.log(`   Title (ID): ${article.translations[0].title}`);
      console.log(`   Slug (ID): ${article.translations[0].slug}`);
      console.log(`   Category: ${article.category}`);
    });
  } catch (error) {
    console.error("❌ Error seeding articles:", error.message);
    throw error;
  }
};

// ==================== MAIN SEEDER ====================
const seedAll = async () => {
  try {
    console.log("🌱 Starting database seeding...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Connect to MongoDB
    await connectDB();

    // Seed users
    await seedUsers();

    // Seed articles
    await seedArticles();

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📋 Summary:");
    console.log("  - Users: 4 (1 admin + 3 users)");
    console.log("  - Articles: 6 (all bilingual)");
    console.log("\n📚 Article Categories:");
    console.log("  - Tutorial: 3 articles");
    console.log("  - Keamanan: 1 article");
    console.log("  - Investasi: 1 article");
    console.log("  - Tips & Trik: 1 article");
    console.log("\n🔐 Default Credentials:");
    console.log("  Admin: admin@brimo.com / password123");
    console.log("  User: ahmad.fadli@example.com / password123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }
};

// Run seeder
seedAll();