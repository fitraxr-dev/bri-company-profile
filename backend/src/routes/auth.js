import express from "express";
import { body } from "express-validator";
import {
  signup,
  login,
  getCurrentUser,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register user baru
 * @access  Public
 */
router.post(
  "/signup",
  [
    body("fullName")
      .trim()
      .notEmpty()
      .withMessage("Nama lengkap wajib diisi")
      .isLength({ min: 3 })
      .withMessage("Nama lengkap minimal 3 karakter"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email wajib diisi")
      .isEmail()
      .withMessage("Format email tidak valid")
      .normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("Password wajib diisi")
      .isLength({ min: 8 })
      .withMessage("Password minimal 8 karakter")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        "Password harus mengandung huruf besar, huruf kecil, dan angka"
      ),
    body("phoneNumber")
      .trim()
      .notEmpty()
      .withMessage("Nomor telepon wajib diisi")
      .matches(/^[0-9]{10,15}$/)
      .withMessage("Nomor telepon harus 10-15 digit angka"),
    body("accountNumber")
      .trim()
      .notEmpty()
      .withMessage("Nomor rekening wajib diisi")
      .isLength({ min: 10, max: 16 })
      .withMessage("Nomor rekening harus 10-16 digit"),
  ],
  signup
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  "/login",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email wajib diisi")
      .isEmail()
      .withMessage("Format email tidak valid")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password wajib diisi"),
  ],
  login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private (requires JWT token)
 */
router.get("/me", authMiddleware, getCurrentUser);

export default router;
