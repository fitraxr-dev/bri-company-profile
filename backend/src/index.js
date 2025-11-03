import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import stockService from "./services/stockService.js";
import authRoutes from "./routes/auth.js";
import transferRoutes from "./routes/transfer.js";
import User from "./models/User.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS Configuration for Production
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : [
      'http://localhost:3000',
      'http://localhost:5173',
    ];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
