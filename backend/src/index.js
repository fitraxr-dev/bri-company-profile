require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const stockService = require("./services/stockService");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mongoUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/goto-dev";
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

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

// Example simple model & route
const { Schema, model } = mongoose;
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const User = model("User", UserSchema);

app.get("/api/users", async (req, res) => {
  const users = await User.find().limit(20);
  res.json(users);
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
  console.log(`Server running on http://localhost:${port}`);
});
