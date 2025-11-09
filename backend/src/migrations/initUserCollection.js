import mongoose from "mongoose";
import User from "../models/User.js";

/**
 * Migration script untuk inisialisasi koleksi User
 * Membuat collection dan index yang diperlukan
 */
async function initUserCollection() {
  try {
    // Connect ke MongoDB
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect("mongodb://localhost:27017/brimo_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB successfully");

    // Inisialisasi koleksi User dan buat index
    console.log("🔄 Initializing User collection and creating indexes...");
    await User.init();

    // Verifikasi indexes
    const indexes = await User.collection.getIndexes();
    console.log("📋 Created indexes:", Object.keys(indexes));

    console.log("✅ Migration success - User collection initialized");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    // Disconnect dari MongoDB
    await mongoose.connection.close();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
}

// Jalankan migration
initUserCollection();
