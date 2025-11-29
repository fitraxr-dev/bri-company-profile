import connectDB from "../db/connect.js";
import User from "../models/User.js";
import Article from "../models/Article.js";

/**
 * Master Migration Script
 * Creates necessary collections and indexes for the application
 */

const migrateUsers = async () => {
  try {
    console.log("\n👥 Migrating Users collection...");

    // Check if users collection exists
    const collections = await User.db.db
      .listCollections({ name: "users" })
      .toArray();

    if (collections.length > 0) {
      console.log("⚠️  Users collection already exists. Skipping...");
      return;
    }

    // Create users collection with schema validation
    await User.db.db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["email", "password", "fullName"],
          properties: {
            email: {
              bsonType: "string",
              pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
              description: "must be a valid email and is required",
            },
            password: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            fullName: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            role: {
              enum: ["user", "admin"],
              description: "must be either user or admin",
            },
          },
        },
      },
    });

    // Create indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ accountNumber: 1 }, { unique: true });

    console.log("✅ Users collection created successfully");
    console.log("✅ Email unique index created");
    console.log("✅ Account number unique index created");
  } catch (error) {
    console.error("❌ Error migrating users:", error.message);
    throw error;
  }
};

const migrateArticles = async () => {
  try {
    console.log("\n📰 Migrating Articles collection...");

    // Check if articles collection exists
    const collections = await Article.db.db
      .listCollections({ name: "articles" })
      .toArray();

    if (collections.length > 0) {
      console.log("⚠️  Articles collection already exists. Skipping...");
      return;
    }

    // Create articles collection
    await Article.db.db.createCollection("articles");

    // Create indexes for better query performance
    await Article.collection.createIndex({ status: 1 });
    await Article.collection.createIndex({ category: 1 });
    await Article.collection.createIndex({ publishedAt: -1 });
    await Article.collection.createIndex({ "translations.slug": 1 });
    await Article.collection.createIndex({ "translations.lang": 1 });

    console.log("✅ Articles collection created successfully");
    console.log("✅ Status index created");
    console.log("✅ Category index created");
    console.log("✅ PublishedAt index created");
    console.log("✅ Translations.slug index created");
    console.log("✅ Translations.lang index created");
  } catch (error) {
    console.error("❌ Error migrating articles:", error.message);
    throw error;
  }
};

const runMigrations = async () => {
  try {
    console.log("🔄 Starting database migrations...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Connect to MongoDB
    await connectDB();

    // Run migrations
    await migrateUsers();
    await migrateArticles();

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎉 All migrations completed successfully!");
    console.log("\n📋 Summary:");
    console.log("  - Users collection: ✅");
    console.log("  - Articles collection: ✅");
    console.log("  - All indexes created: ✅");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
};

// Run migrations
runMigrations();
