import mongoose from "mongoose";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

/**
 * POST /api/transfer
 * Uses atomic operations instead of multi-document transactions for standalone MongoDB compatibility
 */
export const transferMoney = async (req, res) => {
  try {
    const { toAccount, amount, description } = req.body;
    const senderId = req.user.userId;

    if (!toAccount || !amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Data transfer tidak valid" });
    }

    // Load sender and recipient
    const sender = await User.findById(senderId);
    const recipient = await User.findOne({ accountNumber: toAccount });

    if (!sender) {
      return res
        .status(404)
        .json({ success: false, message: "Pengirim tidak ditemukan" });
    }
    if (!recipient) {
      return res
        .status(404)
        .json({ success: false, message: "Rekening tujuan tidak ditemukan" });
    }
    if (recipient.accountNumber === sender.accountNumber) {
      return res.status(400).json({
        success: false,
        message: "Tidak bisa transfer ke rekening sendiri",
      });
    }

    if (sender.balance < amount) {
      return res
        .status(400)
        .json({ success: false, message: "Saldo tidak mencukupi" });
    }

    // Atomic debit sender (with balance check to prevent negative balance)
    const senderUpdate = await User.findOneAndUpdate(
      { _id: senderId, balance: { $gte: amount } },
      { $inc: { balance: -amount } },
      { new: true }
    );

    if (!senderUpdate) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Saldo tidak mencukupi atau perubahan saldo gagal",
        });
    }

    // Atomic credit recipient
    await User.findByIdAndUpdate(
      recipient._id,
      { $inc: { balance: amount } },
      { new: true }
    );

    // Create transaction record
    const trx = new Transaction({
      fromAccount: sender.accountNumber,
      toAccount: recipient.accountNumber,
      amount,
      description: description || "",
      status: "success",
      initiatedBy: sender._id,
    });

    await trx.save();

    return res.status(200).json({
      success: true,
      message: "Transfer berhasil",
      data: { transaction: trx },
    });
  } catch (error) {
    console.error("Transfer error:", error);

    // Best-effort failed transaction record
    try {
      const failedTrx = new Transaction({
        fromAccount: req.user?.accountNumber || "",
        toAccount: req.body?.toAccount || "",
        amount: req.body?.amount || 0,
        description: req.body?.description || "",
        status: "failed",
        initiatedBy: req.user?.userId,
      });
      await failedTrx.save();
    } catch (e) {
      console.error("Failed to save failed transaction:", e);
    }

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat transfer",
      error: error.message,
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("accountNumber");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User tidak ditemukan" });

    const limit = parseInt(req.query.limit, 10) || 50;
    const transactions = await Transaction.find({
      $or: [
        { fromAccount: user.accountNumber },
        { toAccount: user.accountNumber },
      ],
    })
      .sort({ date: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json({ success: true, data: { transactions } });
  } catch (error) {
    console.error("Get transactions error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil riwayat transaksi",
      error: error.message,
    });
  }
};
