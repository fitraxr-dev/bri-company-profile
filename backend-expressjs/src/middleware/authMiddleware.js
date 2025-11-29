import jwt from "jsonwebtoken";

/**
 * Auth Middleware
 * Memvalidasi JWT token untuk protected routes
 */

const authMiddleware = (req, res, next) => {
  try {
    // Ambil token dari header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan. Silakan login terlebih dahulu.",
      });
    }

    // Extract token (format: "Bearer <token>")
    const token = authHeader.substring(7);

    // Verifikasi token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key-change-in-production"
    );

    // Simpan data user dari token ke request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    // Lanjutkan ke next middleware/route handler
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    // Handle different JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Silakan login kembali.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Autentikasi gagal",
      error: error.message,
    });
  }
};

export default authMiddleware;
