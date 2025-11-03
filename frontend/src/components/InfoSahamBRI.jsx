import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  Activity,
} from "lucide-react";

/**
 * Komponen untuk menampilkan informasi saham BRI (BBRI) secara real-time
 * Data di-refresh setiap kali halaman dimuat ulang
 */
const InfoSahamBRI = () => {
  const { t } = useTranslation();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Fungsi untuk format angka ke rupiah dengan koma
  const formatRupiah = (number) => {
    if (!number && number !== 0) return "-";
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(number);
  };

  // Fungsi untuk format persentase
  const formatPercent = (number) => {
    if (!number && number !== 0) return "-";
    const formatted = new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      signDisplay: "always",
    }).format(number);
    return formatted + "%";
  };

  // Fungsi untuk format waktu
  const formatTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Fetch data saham dari backend
  const fetchStockData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/stock/bbri`, {
        timeout: 15000, // 15 detik timeout
      });

      if (response.data.success) {
        setStockData(response.data.data);
        setLastUpdate(new Date().toISOString());
      } else {
        setError("Gagal memuat data saham");
      }
    } catch (err) {
      console.error("Error fetching stock:", err);
      setError("Gagal memuat data saham. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  // Load data saat komponen mount (setiap refresh halaman)
  useEffect(() => {
    fetchStockData();
  }, []);

  // Tentukan warna berdasarkan perubahan harga
  const getPriceColor = () => {
    if (!stockData || !stockData.change) return "text-gray-700";
    return stockData.change >= 0 ? "text-green-600" : "text-red-600";
  };

  const getPriceBgColor = () => {
    if (!stockData || !stockData.change) return "bg-gray-50";
    return stockData.change >= 0 ? "bg-green-50" : "bg-red-50";
  };

  // Skeleton Loader
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header Skeleton */}
          <div className="bg-gradient-to-r from-[#0043A4] to-[#0056D6] p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-white/20 rounded w-48 mb-3"></div>
              <div className="h-4 bg-white/20 rounded w-64"></div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="p-6 space-y-6 animate-pulse">
            <div className="text-center py-8">
              <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-red-200">
          <div className="bg-gradient-to-r from-[#0043A4] to-[#0056D6] p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6" />
              {t("stock.title")}
            </h2>
          </div>

          <div className="p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t("stock.error")}
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchStockData}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0043A4] text-white rounded-lg hover:bg-[#003380] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-5 h-5" />
              {t("stock.tryAgain")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Component
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0043A4] to-[#0056D6] p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
                <Activity className="w-6 h-6" />
                {t("stock.title")}
              </h2>
              <p className="text-blue-100 text-sm">
                {stockData?.name || "Bank Rakyat Indonesia (Persero) Tbk"}
              </p>
              <p className="text-blue-200 text-xs mt-1 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Kode: {stockData?.symbol || "BBRI"}
              </p>
            </div>
            <button
              onClick={fetchStockData}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
              title={t("stock.refresh")}
            >
              <RefreshCw className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Last Update */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-blue-100 text-xs">
              {t("stock.lastUpdate")}: {stockData?.lastUpdate || lastUpdate}
            </p>
          </div>
        </div>

        {/* Price Section */}
        <div
          className={`p-6 text-center ${getPriceBgColor()} transition-colors duration-500`}
        >
          <div className="space-y-2">
            <p className="text-gray-600 text-sm font-medium">
              {t("stock.currentPrice")}
            </p>
            <div
              className={`text-5xl font-bold ${getPriceColor()} transition-all duration-500 animate-fade-in`}
            >
              Rp {formatRupiah(stockData?.price)}
            </div>

            {/* Change Indicator */}
            <div
              className={`flex items-center justify-center gap-2 text-lg font-semibold ${getPriceColor()}`}
            >
              {stockData?.change >= 0 ? (
                <TrendingUp className="w-6 h-6 animate-bounce" />
              ) : (
                <TrendingDown className="w-6 h-6 animate-bounce" />
              )}
              <span>{formatRupiah(Math.abs(stockData?.change || 0))}</span>
              <span className="text-base">
                ({formatPercent(stockData?.changePercent)})
              </span>
            </div>
          </div>
        </div>

        {/* Stock Details Grid */}
        <div className="p-6 space-y-4">
          {/* Volume - Full Width at Top */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              {t("stock.volume")}
            </p>
            <p className="text-3xl font-bold text-[#0043A4]">
              {stockData?.volume || "-"}
            </p>
          </div>

          {/* Day's Range and 52 Week Range - Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Day Range */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-600 mb-1 font-medium">
                {t("stock.daysRange")}
              </p>
              <p className="text-xl font-bold text-purple-700">
                {stockData?.dayRange || "-"}
              </p>
            </div>

            {/* 52 Week Range */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-600 mb-1 font-medium">
                {t("stock.fiftyTwoWeekRange")}
              </p>
              <p className="text-xl font-bold text-green-700">
                {stockData?.fiftyTwoWeekRange || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default InfoSahamBRI;
