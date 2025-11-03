import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, user } = useAuth();
  const { i18n } = useTranslation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && user.role === "admin") {
      const redirectTo = searchParams.get("redirect") || "/admin";
      navigate(redirectTo);
    }
  }, [user, navigate, searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Check if user is admin
      if (result.data.data.user.role === "admin") {
        const redirectTo = searchParams.get("redirect") || "/admin";
        navigate(redirectTo);
      } else {
        setError(
          i18n.language === "id"
            ? "Anda tidak memiliki akses admin"
            : "You do not have admin access"
        );
        setLoading(false);
      }
    } else {
      setError(result.message || "Login gagal");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        background:
          "linear-gradient(135deg, #00529B 0%, #003B73 50%, #1F203B 100%)",
      }}
    >
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center">
          <div
            className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: "#00529B" }}
          >
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="font-heading text-3xl font-bold text-bri-primary">
            Admin Login
          </h2>
          <p className="mt-2 font-body text-sm text-gray-600">
            {i18n.language === "id"
              ? "Masuk ke dashboard admin BRImo"
              : "Sign in to BRImo admin dashboard"}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-body font-semibold text-gray-700">
                  Email Admin
                </span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@brimo.com"
                className="input input-bordered w-full font-body bg-white text-gray-900 hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-body font-semibold text-gray-700">
                  Password
                </span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input input-bordered w-full font-body bg-white text-gray-900 hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn w-full text-white border-none hover:scale-[1.02] transition-transform duration-300 font-body"
            style={{ backgroundColor: "#00529B" }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#003B73";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#00529B";
            }}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {i18n.language === "id" ? "Memproses..." : "Processing..."}
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                {i18n.language === "id" ? "Masuk" : "Sign In"}
              </>
            )}
          </button>
        </form>

        {/* Back to Home */}
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="font-body text-sm text-gray-600 hover:text-bri-primary transition-colors"
          >
            ← {i18n.language === "id" ? "Kembali ke Beranda" : "Back to Home"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
