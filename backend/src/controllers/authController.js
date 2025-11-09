import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";

/**
 * Auth Controller
 * Menangani registrasi dan login user
 */

/**
 * @route   POST /api/auth/signup
 * @desc    Register user baru
 * @access  Public
 */
export const signup = async (req, res) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: errors.array(),
      });
    }

    const { fullName, email, password, phoneNumber, accountNumber } = req.body;

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    // Cek apakah nomor rekening sudah digunakan
    const existingAccount = await User.findOne({ accountNumber });
    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: "Nomor rekening sudah terdaftar",
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Buat user baru
    const newUser = new User({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phoneNumber,
      accountNumber,
      balance: 0,
      isActive: true,
    });

    // Simpan ke database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
      },
      process.env.JWT_SECRET || "your-secret-key-change-in-production",
      { expiresIn: "7d" }
    );

    // Response sukses (password sudah dihapus otomatis oleh toJSON method)
    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: {
        token,
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          accountNumber: newUser.accountNumber,
          balance: newUser.balance,
          isActive: newUser.isActive,
          role: newUser.role,
        },
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat registrasi",
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user dan generate JWT token
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Cek apakah user dengan email tersebut ada
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    // Cek apakah akun aktif
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Akun Anda tidak aktif. Hubungi administrator.",
      });
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET || "your-secret-key-change-in-production",
      { expiresIn: "7d" }
    );

    // Response sukses
    res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          accountNumber: user.accountNumber,
          balance: user.balance,
          formattedBalance: user.formattedBalance,
          isActive: user.isActive,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat login",
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private (requires JWT token)
 */
export const getCurrentUser = async (req, res) => {
  try {
    // req.user sudah diset oleh authMiddleware
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          accountNumber: user.accountNumber,
          balance: user.balance,
          formattedBalance: user.formattedBalance,
          isActive: user.isActive,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data user",
      error: error.message,
    });
  }
};
