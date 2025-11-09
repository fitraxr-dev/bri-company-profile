import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Lock,
  Phone,
  CreditCard,
  Eye,
  EyeOff,
  UserPlus,
  Home,
} from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    accountNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Nama lengkap minimal 3 karakter";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password harus mengandung huruf besar, huruf kecil, dan angka";
    }

    // Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    // Phone Number validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Nomor telepon harus 10-15 digit";
    }

    // Account Number validation
    if (
      formData.accountNumber.length < 10 ||
      formData.accountNumber.length > 16
    ) {
      newErrors.accountNumber = "Nomor rekening harus 10-16 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...userData } = formData;

    const result = await signup(userData);

    if (result.success) {
      // Redirect to dashboard after successful signup
      navigate("/dashboard");
    } else {
      // Handle backend errors
      if (result.errors && Array.isArray(result.errors)) {
        const backendErrors = {};
        result.errors.forEach((err) => {
          backendErrors[err.path || "general"] = err.msg;
        });
        setErrors(backendErrors);
      } else {
        setErrors({
          general: result.message || "Pendaftaran gagal. Silakan coba lagi.",
        });
      }
    }

    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bri-primary to-bri-deep">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bri-primary to-bri-deep px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Back to Home Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white hover:text-bri-orange transition-colors duration-300 mb-4"
        >
          <Home size={20} />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            BRI<span className="text-bri-orange">mo</span>
          </h1>
          <p className="text-blue-100">Digital Banking Solution</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-bri-primary mb-2">
            Daftar Akun Baru
          </h2>
          <p className="text-gray-600 mb-6">
            Lengkapi formulir di bawah untuk membuat akun BRImo
          </p>

          {/* General Error Alert */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-4 py-3 bg-white text-gray-900 border rounded-lg focus:ring-2 focus:ring-bri-primary focus:border-transparent outline-none transition ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-4 py-3 bg-white text-gray-900 border rounded-lg focus:ring-2 focus:ring-bri-primary focus:border-transparent outline-none transition ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="nama@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-12 py-3 bg-white text-gray-900 border rounded-lg focus:ring-2 focus:ring-bri-primary focus:border-transparent outline-none transition ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Min. 8 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password *
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-12 py-3 bg-white text-gray-900 border rounded-lg focus:ring-2 focus:ring-bri-primary focus:border-transparent outline-none transition ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Ulangi password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon *
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-4 py-3 bg-white text-gray-900 border rounded-lg focus:ring-2 focus:ring-bri-primary focus:border-transparent outline-none transition ${
                      errors.phoneNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="08123456789"
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Rekening *
                </label>
                <div className="relative">
                  <CreditCard
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-4 py-3 bg-white text-gray-900 border rounded-lg focus:ring-2 focus:ring-bri-primary focus:border-transparent outline-none transition ${
                      errors.accountNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="1234567890"
                  />
                </div>
                {errors.accountNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.accountNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-1 text-bri-primary border-gray-300 rounded focus:ring-bri-primary"
              />
              <label className="ml-2 text-sm text-gray-600">
                Saya setuju dengan{" "}
                <Link
                  to="/terms"
                  className="text-bri-primary hover:text-bri-deep"
                >
                  Syarat & Ketentuan
                </Link>{" "}
                dan{" "}
                <Link
                  to="/privacy"
                  className="text-bri-primary hover:text-bri-deep"
                >
                  Kebijakan Privasi
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-bri-primary text-white py-3 rounded-lg font-semibold hover:bg-bri-deep transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mendaftar...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Daftar
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Sudah punya akun?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="block w-full text-center py-3 border-2 border-bri-primary text-bri-primary rounded-lg font-semibold hover:bg-bri-primary hover:text-white transition duration-300"
          >
            Login Sekarang
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-100 text-sm mt-6">
          © 2024 BRI. All rights reserved.
        </p>
      </div>
    </div>
  );
}
