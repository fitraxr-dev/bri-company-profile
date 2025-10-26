import InfoSahamBRI from "./components/InfoSahamBRI";
import "./index.css";

/**
 * Contoh implementasi komponen InfoSahamBRI
 *
 * Cara pakai:
 * 1. Jalankan backend: cd backend && npm run dev
 * 2. Jalankan frontend: cd frontend && npm run dev
 * 3. Buka browser di http://localhost:5173
 * 4. Refresh halaman untuk update data saham
 */
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Portal Investor BRI
          </h1>
          <p className="text-gray-600 mt-1">
            Informasi Saham Terkini Bank Rakyat Indonesia
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <InfoSahamBRI />
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-500 text-sm">
        <p>© 2025 BRI Redesign Project - Politeknik Negeri Bandung</p>
        <p className="mt-1">
          Data saham hanya untuk informasi, bukan rekomendasi investasi
        </p>
      </footer>
    </div>
  );
}

export default App;
