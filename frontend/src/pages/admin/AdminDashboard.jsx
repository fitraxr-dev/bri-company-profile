import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import {
  NewspaperIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { i18n } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/articles?lang=${i18n.language}`
      );
      const data = await response.json();

      if (data.success) {
        const articlesData = data.data;
        setArticles(articlesData);

        // Calculate stats
        setStats({
          total: articlesData.length,
          published: articlesData.filter((a) => a.status === "published")
            .length,
          draft: articlesData.filter((a) => a.status === "draft").length,
        });
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (
      !window.confirm(
        i18n.language === "id"
          ? `Apakah Anda yakin ingin menghapus artikel "${title}"?`
          : `Are you sure you want to delete article "${title}"?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/articles/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        alert(
          i18n.language === "id"
            ? "Artikel berhasil dihapus!"
            : "Article deleted successfully!"
        );
        fetchArticles();
      } else {
        alert(
          i18n.language === "id"
            ? "Gagal menghapus artikel"
            : "Failed to delete article"
        );
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert(i18n.language === "id" ? "Terjadi kesalahan" : "An error occurred");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === "id" ? "id-ID" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F4F6F8" }}>
      {/* Header */}
      <div className="shadow-lg" style={{ backgroundColor: "#00529B" }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NewspaperIcon className="w-8 h-8 text-white" />
              <div>
                <h1 className="font-heading text-2xl font-bold text-white">
                  Admin Dashboard
                </h1>
                <p className="font-body text-sm text-white/80">
                  {i18n.language === "id"
                    ? "Kelola Artikel BRImo"
                    : "Manage BRImo Articles"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-body text-sm text-white/80">
                  {i18n.language === "id" ? "Masuk sebagai" : "Logged in as"}
                </p>
                <p className="font-body font-semibold text-white">
                  {user?.fullName}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-sm gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                {i18n.language === "id" ? "Keluar" : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Articles */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-bri-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm text-gray-600 mb-1">
                  {i18n.language === "id" ? "Total Artikel" : "Total Articles"}
                </p>
                <p className="font-heading text-3xl font-bold text-bri-primary">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-bri-primary/10 flex items-center justify-center">
                <NewspaperIcon className="w-6 h-6 text-bri-primary" />
              </div>
            </div>
          </div>

          {/* Published */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm text-gray-600 mb-1">
                  {i18n.language === "id" ? "Dipublikasi" : "Published"}
                </p>
                <p className="font-heading text-3xl font-bold text-green-500">
                  {stats.published}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <EyeIcon className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          {/* Draft */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm text-gray-600 mb-1">
                  {i18n.language === "id" ? "Draft" : "Draft"}
                </p>
                <p className="font-heading text-3xl font-bold text-yellow-500">
                  {stats.draft}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <PencilIcon className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div
            className="px-6 py-4 border-b flex items-center justify-between"
            style={{ backgroundColor: "#F4F6F8" }}
          >
            <h2 className="font-heading text-xl font-bold text-bri-primary">
              {i18n.language === "id" ? "Daftar Artikel" : "Articles List"}
            </h2>
            <button
              onClick={() => navigate("/admin/articles/create")}
              className="btn btn-sm gap-2 text-white border-none hover:scale-105 transition-transform"
              style={{ backgroundColor: "#00529B" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#003B73")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#00529B")
              }
            >
              <PlusIcon className="w-5 h-5" />
              {i18n.language === "id" ? "Buat Artikel" : "Create Article"}
            </button>
          </div>

          {/* Table Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <span
                className="loading loading-spinner loading-lg"
                style={{ color: "#00529B" }}
              ></span>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <NewspaperIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="font-body text-gray-500">
                {i18n.language === "id"
                  ? "Belum ada artikel. Buat artikel pertama Anda!"
                  : "No articles yet. Create your first article!"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="font-body">
                      {i18n.language === "id" ? "Judul" : "Title"}
                    </th>
                    <th className="font-body">
                      {i18n.language === "id" ? "Kategori" : "Category"}
                    </th>
                    <th className="font-body">
                      {i18n.language === "id" ? "Penulis" : "Author"}
                    </th>
                    <th className="font-body">
                      {i18n.language === "id" ? "Status" : "Status"}
                    </th>
                    <th className="font-body">
                      {i18n.language === "id" ? "Tanggal" : "Date"}
                    </th>
                    <th className="font-body">
                      {i18n.language === "id" ? "Aksi" : "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr
                      key={article._id}
                      className="hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img
                                src={article.coverImage}
                                alt={article.title}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-body font-bold">
                              {article.title}
                            </div>
                            <div className="font-body text-sm text-gray-500">
                              {article.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className="badge font-body text-white border-none"
                          style={{ backgroundColor: "#F58220" }}
                        >
                          {article.category}
                        </span>
                      </td>
                      <td className="font-body">{article.author}</td>
                      <td>
                        {article.status === "published" ? (
                          <span className="badge badge-success gap-2 text-white font-body">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                            {i18n.language === "id" ? "Publish" : "Published"}
                          </span>
                        ) : (
                          <span className="badge badge-warning gap-2 font-body">
                            <div className="w-2 h-2 rounded-full bg-yellow-800"></div>
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="font-body">
                        {formatDate(article.publishedAt)}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/article/${article.slug}`)}
                            className="btn btn-sm btn-ghost btn-square"
                            title={i18n.language === "id" ? "Lihat" : "View"}
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin/articles/edit/${article._id}`)
                            }
                            className="btn btn-sm btn-ghost btn-square text-blue-600"
                            title={i18n.language === "id" ? "Edit" : "Edit"}
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(article._id, article.title)
                            }
                            className="btn btn-sm btn-ghost btn-square text-red-600"
                            title={i18n.language === "id" ? "Hapus" : "Delete"}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
