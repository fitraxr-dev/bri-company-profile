import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

/**
 * Seeding script untuk menambahkan data user contoh
 * Password default: password123 (ter-hash dengan bcrypt)
 */
async function seedUsers() {
  try {
    // Connect ke MongoDB
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect("mongodb://localhost:27017/brimo_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB successfully");

    // Hapus semua data lama
    console.log("🗑️  Clearing existing user data...");
    await User.deleteMany({});
    console.log("✅ Old data cleared");

    // Hash password dengan bcrypt
    const defaultPassword = "password123";
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
    console.log("🔐 Password hashed successfully");

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

    // Insert data ke database
    console.log("🌱 Seeding user data...");
    const createdUsers = await User.insertMany(users);

    // Tampilkan summary
    console.log("\n✅ Seeding success!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📊 Total users created: ${createdUsers.length}`);
    console.log("\n👥 User List:");
    createdUsers.forEach((user, index) => {
      console.log(
        `\n${index + 1}. ${user.fullName} ${
          user.role === "admin" ? "👑 (ADMIN)" : ""
        }`
      );
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   📱 Phone: ${user.phoneNumber}`);
      console.log(`   💳 Account: ${user.accountNumber}`);
      console.log(`   💰 Balance: ${user.formattedBalance}`);
      console.log(`   👤 Role: ${user.role}`);
      console.log(`   🔑 Password: password123 (default)`);
    });
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    if (error.code === 11000) {
      console.error("⚠️  Duplicate key error - Data mungkin sudah ada");
    }
    process.exit(1);
  } finally {
    // Disconnect dari MongoDB
    await mongoose.connection.close();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
}

// Jalankan seeding
seedUsers();
