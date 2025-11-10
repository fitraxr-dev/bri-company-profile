import connectDB from "../db/connect.js";
import Article from "../models/Article.js";

const seedArticles = async () => {
  try {
    console.log("🌱 Seeding articles (multiple dummy items)...");

    await connectDB();

    // Multiple sample articles (each has id + en translations)
    const sampleArticles = [
      {
        translations: [
          {
            lang: "id",
            title: "Cara Membuat Akun BRImo",
            slug: "cara-membuat-akun-brimo",
            content: [
              { type: "text", value: "Panduan singkat membuat akun BRImo untuk nasabah BRI." },
            ],
          },
          {
            lang: "en",
            title: "How to Create a BRImo Account",
            slug: "how-to-create-brimo-account",
            content: [{ type: "text", value: "A short guide to create a BRImo account for BRI customers." }],
          },
        ],
        category: "Tutorial",
        author: "Tim BRI Digital",
        coverImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80",
        publishedAt: new Date(),
        status: "published",
      },

      {
        translations: [
          {
            lang: "id",
            title: "Panduan KPR untuk Pemula",
            slug: "panduan-kpr-untuk-pemula",
            content: [{ type: "text", value: "Penjelasan dasar dan langkah-langkah mengajukan KPR di BRI." }],
          },
          {
            lang: "en",
            title: "Mortgage (KPR) Guide for Beginners",
            slug: "kpr-guide-for-beginners",
            content: [{ type: "text", value: "Basic explanation and steps to apply for mortgage at BRI." }],
          },
        ],
        category: "Finance",
        author: "Tim Kredit",
        coverImage: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80",
        publishedAt: new Date(),
        status: "published",
      },

      {
        translations: [
          {
            lang: "id",
            title: "Cara Transfer Antar Bank",
            slug: "cara-transfer-antar-bank",
            content: [{ type: "text", value: "Langkah cepat melakukan transfer ke bank lain menggunakan BRI." }],
          },
          {
            lang: "en",
            title: "How to Transfer to Other Banks",
            slug: "how-to-transfer-to-other-banks",
            content: [{ type: "text", value: "Quick steps to transfer to other banks using BRI services." }],
          },
        ],
        category: "How-to",
        author: "Tim Operasional",
        coverImage: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=1200&q=80",
        publishedAt: new Date(),
        status: "published",
      },

      {
        translations: [
          {
            lang: "id",
            title: "Informasi Saham BRI Terbaru",
            slug: "informasi-saham-bri-terbaru",
            content: [{ type: "text", value: "Ringkasan performa saham BRI dan informasi penting untuk investor." }],
          },
          {
            lang: "en",
            title: "Latest BRI Stock Information",
            slug: "latest-bri-stock-information",
            content: [{ type: "text", value: "Summary of BRI stock performance and key info for investors." }],
          },
        ],
        category: "Market",
        author: "Tim Investor Relations",
        coverImage: "https://images.unsplash.com/photo-1516822003754-cca485356ecb?w=1200&q=80",
        publishedAt: new Date(),
        status: "published",
      },

      {
        translations: [
          {
            lang: "id",
            title: "Menggunakan Simulator KPR di Situs BRI",
            slug: "menggunakan-simulator-kpr-bri",
            content: [{ type: "text", value: "Cara menggunakan fitur simulator KPR untuk menghitung cicilan." }],
          },
          {
            lang: "en",
            title: "Using the Mortgage Simulator on BRI Site",
            slug: "using-kpr-simulator-bri",
            content: [{ type: "text", value: "How to use the mortgage simulator to estimate installments." }],
          },
        ],
        category: "Tools",
        author: "Tim Digital",
        coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
        publishedAt: new Date(),
        status: "draft",
      },
    ];

    let created = 0;
    let skipped = 0;

    for (const sample of sampleArticles) {
      const slugId = sample.translations.find((t) => t.lang === "id")?.slug;
      const slugEn = sample.translations.find((t) => t.lang === "en")?.slug;

      // Skip if either translation slug already exists
      const existing = await Article.findOne({
        $or: [{ "translations.slug": slugId }, { "translations.slug": slugEn }],
      });

      if (existing) {
        console.log(`⚠️  Skipping existing article (slug: ${slugId || slugEn})`);
        skipped++;
        continue;
      }

      const article = await Article.create(sample);
      console.log(`✅ Created article: ${article._id} (${slugId} / ${slugEn})`);
      created++;
    }

    console.log(`🎉 Seeding completed. Created: ${created}, Skipped: ${skipped}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error?.message || error);
    console.error(error);
    process.exit(1);
  }
};

seedArticles();
