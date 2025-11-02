import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Wallet,
  LogOut,
  Calendar,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, loading, loadUser } = useAuth();

  useEffect(() => {
    // Load user data when component mounts (only once)
    if (!user && !loading) {
      loadUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bri-primary to-bri-deep">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bri-primary to-bri-deep">
        <div className="text-white text-xl">No user data available</div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bri-primary to-bri-deep">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-bri-primary">
              BRI<span className="text-bri-orange">mo</span> Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-bri-primary mb-2">
            Selamat Datang, {user.fullName}! 👋
          </h2>
          <p className="text-gray-600">
            Kelola akun BRImo Anda dengan mudah dan aman
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Balance Card */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-bri-primary to-bri-deep rounded-2xl shadow-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Wallet size={32} />
                <h3 className="text-2xl font-bold">Saldo Rekening</h3>
              </div>
              <div className="mb-4">
                <p className="text-blue-100 text-sm mb-2">Total Saldo</p>
                <p className="text-5xl font-bold">
                  {formatCurrency(user.balance || 0)}
                </p>
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <CreditCard size={20} />
                <span className="font-mono text-lg">{user.accountNumber}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-bri-primary mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Link
                  to="/transfer"
                  className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                >
                  <div className="w-12 h-12 bg-bri-primary rounded-full flex items-center justify-center text-white">
                    💸
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Transfer
                  </span>
                </Link>

                <button className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                  <div className="w-12 h-12 bg-bri-primary rounded-full flex items-center justify-center text-white">
                    📱
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Pulsa
                  </span>
                </button>

                <button className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                  <div className="w-12 h-12 bg-bri-primary rounded-full flex items-center justify-center text-white">
                    💡
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Listrik
                  </span>
                </button>

                <Link
                  to="/history"
                  className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                >
                  <div className="w-12 h-12 bg-bri-primary rounded-full flex items-center justify-center text-white">
                    📄
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Mutasi
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-bri-primary mb-6">
                Profil Saya
              </h3>
              <div className="space-y-4">
                {/* Avatar */}
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-bri-primary to-bri-orange rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="text-bri-primary" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Nama Lengkap</p>
                      <p className="font-semibold text-gray-700">
                        {user.fullName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="text-bri-primary" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-semibold text-gray-700 break-all">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="text-bri-primary" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Nomor Telepon</p>
                      <p className="font-semibold text-gray-700">
                        {user.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CreditCard className="text-bri-primary" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Nomor Rekening</p>
                      <p className="font-semibold text-gray-700 font-mono">
                        {user.accountNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="text-bri-primary" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Member Sejak</p>
                      <p className="font-semibold text-gray-700">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-700">
                      Status Akun
                    </span>
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                      {user.isActive ? "AKTIF" : "NONAKTIF"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
