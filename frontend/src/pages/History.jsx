import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function History() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/transactions`);
        if (res.data?.success)
          setTransactions(res.data.data.transactions || []);
        else setError(res.data?.message || "Gagal memuat transaksi");
      } catch (err) {
        setError(
          err.response?.data?.message || "Terjadi kesalahan saat memuat"
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatCurrency = (value) => {
    try {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(value);
    } catch (e) {
      return value;
    }
  };

  const formatDate = (d) => {
    return new Date(d).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bri-primary to-bri-deep p-6">
      <div className="max-w-4xl mx-auto">
        <header className="bg-white rounded-md p-4 mb-6 shadow">
          <h1 className="text-xl font-bold text-bri-primary">
            Riwayat Transaksi
          </h1>
          <p className="text-sm text-gray-500">
            Menampilkan transaksi terakhir yang melibatkan rekening Anda
          </p>
        </header>

        <main className="bg-white rounded-2xl p-6 shadow">
          {loading && <div>Memuat...</div>}
          {error && <div className="text-red-600">{error}</div>}

          {!loading && !error && (
            <div className="space-y-4">
              {transactions.length === 0 && (
                <div className="text-gray-600">Belum ada transaksi</div>
              )}

              {transactions.map((t) => {
                const isOutgoing = t.fromAccount === user?.accountNumber;
                return (
                  <div
                    key={t._id}
                    className="p-4 border rounded flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm text-gray-500">
                        {isOutgoing ? "Dikirim ke" : "Diterima dari"}{" "}
                        <span className="font-mono">
                          {isOutgoing ? t.toAccount : t.fromAccount}
                        </span>
                      </div>
                      <div className="font-semibold">
                        {formatCurrency(t.amount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`px-3 py-1 rounded-full text-xs ${
                          t.status === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {t.status.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {formatDate(t.date)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
