import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Transfer() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successTx, setSuccessTx] = useState(null);

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

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    const numericAmount = Number(amount);
    if (!toAccount || !numericAmount || numericAmount <= 0) {
      setError(
        "Mohon isi nomor rekening tujuan dan jumlah transfer yang valid."
      );
      return;
    }
    if (user && user.balance < numericAmount) {
      setError("Saldo tidak mencukupi");
      return;
    }

    setLoading(true);
    try {
      const body = { toAccount, amount: numericAmount, description };
      const res = await axios.post(`${API_URL}/transfer`, body);
      if (res.data?.success) {
        setSuccessTx(res.data.data.transaction);
        // clear form
        setToAccount("");
        setAmount("");
        setDescription("");
      } else {
        setError(res.data?.message || "Transfer gagal");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Terjadi kesalahan saat transfer"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bri-primary to-bri-deep p-6">
      <div className="max-w-3xl mx-auto">
        <header className="bg-white rounded-md p-4 mb-6 shadow">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-bri-primary">
              Transfer Uang
            </h1>
            <div className="text-right">
              <div className="text-sm text-gray-500">Rekening Anda</div>
              <div className="font-mono font-semibold">
                {user?.accountNumber || "-"}
              </div>
              <div className="text-lg font-bold text-bri-primary">
                {formatCurrency(user?.balance || 0)}
              </div>
            </div>
          </div>
        </header>

        <main className="bg-white rounded-2xl p-6 shadow">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nomor Rekening Tujuan
              </label>
              <input
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-bri-primary focus:border-transparent"
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                placeholder="contoh: 1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Jumlah (IDR)
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-bri-primary focus:border-transparent"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50000"
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Keterangan (opsional)
              </label>
              <textarea
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-bri-primary focus:border-transparent"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Misal: Pembayaran tagihan"
              />
            </div>

            {error && <div className="text-red-600">{error}</div>}

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-bri-primary text-white rounded-lg hover:bg-bri-primary-dark disabled:opacity-60"
              >
                {loading ? "Memproses..." : "Kirim Transfer"}
              </button>

              <Link to="/dashboard" className="text-sm text-gray-600 underline">
                Kembali ke Dashboard
              </Link>
            </div>
          </form>

          {successTx && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="font-semibold text-green-700">
                Transfer Berhasil
              </h3>
              <p className="text-sm text-gray-700">
                Anda berhasil mentransfer {formatCurrency(successTx.amount)} ke
                rekening{" "}
                <span className="font-mono">{successTx.toAccount}</span>.
              </p>
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => navigate("/history")}
                  className="px-4 py-2 bg-bri-primary text-white rounded"
                >
                  Lihat Riwayat
                </button>
                <button
                  onClick={() => setSuccessTx(null)}
                  className="px-4 py-2 border rounded"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
