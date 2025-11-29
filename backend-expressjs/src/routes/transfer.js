import express from "express";
import {
  transferMoney,
  getTransactions,
} from "../controllers/transferController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/transfer", authMiddleware, transferMoney);
router.get("/transactions", authMiddleware, getTransactions);

export default router;
