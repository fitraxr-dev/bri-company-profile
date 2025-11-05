import connectDB from "../db/connect.js";
import Article from "../models/Article.js";

const seedArticles = async () => {
  try {
    console.log("🌱 Seeding articles...");

    await connectDB();

    // Check if article already exists
    const existingArticle = await Article.findOne({
      "translations.slug": "cara-membuat-akun-brimo",
    });

    if (existingArticle) {
      console.log(
        '⚠️  Article "Cara Membuat Akun BRImo" already exists. Skipping...'
      );
      process.exit(0);
    }

    // Sample article data
    const sampleArticle = {
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
                "BRImo is a mobile banking application from Bank BRI that makes it easy for customers to carry out various banking transactions anytime and anywhere. With BRImo, you can transfer money, pay bills, purchase credit, and much more, all from your smartphone.",
            },
            {
              type: "text",
              value:
                "## Benefits of Using BRImo\n\n• 24/7 transactions without having to go to a branch office\n• Free transfer fees between BRI accounts\n• Multi-layered security with PIN and biometrics\n• Real-time notifications for every transaction\n• User-friendly and easy-to-use interface",
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
                "## Steps to Create a BRImo Account\n\n### 1. Download the BRImo Application\n\nDownload the BRImo application from Google Play Store (Android) or App Store (iOS). Make sure you download the official app from PT Bank Rakyat Indonesia (Persero) Tbk.",
            },
            {
              type: "text",
              value:
                '### 2. Open the App and Select "Register"\n\nAfter the app is installed, open the BRImo app and select the "Register" button on the home page.',
            },
            {
              type: "image",
              value:
                "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
              caption: "BRImo application registration page display",
            },
            {
              type: "text",
              value:
                "### 3. Enter Personal Data\n\nFill out the registration form with your personal data:\n• BRI account number\n• BRI ATM card number\n• ATM PIN\n• Phone number registered with BRI\n• Active email\n\nMake sure all the data you enter matches the data registered with Bank BRI.",
            },
            {
              type: "text",
              value:
                "### 4. Verify Phone Number\n\nAfter filling out the form, you will receive an OTP (One Time Password) code via SMS. Enter the OTP code into the application for verification.",
            },
            {
              type: "text",
              value:
                "### 5. Create User ID and Password\n\nCreate a User ID and Password to login to the BRImo application. Use a strong and memorable combination. User ID minimum 8 characters and Password minimum 8 characters with a combination of uppercase letters, lowercase letters, and numbers.",
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
                "### 7. Done!\n\nYour BRImo account is now active and ready to use. You can now perform various banking transactions through the BRImo application easily and safely.",
            },
            {
              type: "text",
              value:
                "## Security Tips\n\n• Never share your User ID, Password, or PIN with anyone\n• Make sure to use a secure internet connection\n• Always logout after completing transactions\n• Update the application regularly\n• Enable transaction notifications for monitoring\n\nHappy using BRImo! Enjoy the convenience of banking transactions at your fingertips.",
            },
          ],
        },
      ],
      category: "Tutorial",
      author: "Tim BRI Digital",
      coverImage:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80",
      publishedAt: new Date(),
      status: "published",
    };

    // Create the article
    const article = await Article.create(sampleArticle);

    console.log("✅ Article created successfully!");
    console.log(`📝 Article ID: ${article._id}`);
    console.log(`📌 Indonesian slug: ${article.translations[0].slug}`);
    console.log(`📌 English slug: ${article.translations[1].slug}`);
    console.log("🎉 Seeding completed!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    console.error(error);
    process.exit(1);
  }
};

seedArticles();
