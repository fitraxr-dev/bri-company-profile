import connectDB from "../db/connect.js";
import Article from "../models/Article.js";

const createArticlesCollection = async () => {
  try {
    console.log("🔄 Running migration: createArticlesCollection...");

    await connectDB();

    // Check if collection already exists
    const collections = await Article.db.db
      .listCollections({ name: "articles" })
      .toArray();

    if (collections.length > 0) {
      console.log('✅ Collection "articles" already exists. Skipping...');
    } else {
      // Create collection explicitly
      await Article.createCollection();
      console.log('✅ Collection "articles" created successfully');
    }

    // Ensure indexes are created
    await Article.createIndexes();
    console.log("✅ Indexes created successfully");

    console.log("✅ Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
};

createArticlesCollection();
