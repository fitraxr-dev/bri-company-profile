import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import stockService from "./services/stockService.js";
import authRoutes from "./routes/auth.js";
import transferRoutes from "./routes/transfer.js";
import articleRoutes from "./routes/articles.js";
import User from "./models/User.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mongoUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/brimo_db";
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Health check
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong", timestamp: new Date().toISOString() });
});

// Auth routes
app.use("/api/auth", authRoutes);

// Transfer & transaction routes
app.use("/api", transferRoutes);

// Articles routes
app.use("/api/articles", articleRoutes);

// Stock API Endpoint
app.get("/api/stock/bbri", async (req, res) => {
  try {
    const stockData = await stockService.getStockData();
    res.json(stockData);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({
      success: false,
      error: "Gagal mengambil data saham",
      message: error.message,
    });
  }
});

// Users API endpoints (using imported User model)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").limit(20);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const u = new User(req.body);
    await u.save();
    res.status(201).json(u);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
