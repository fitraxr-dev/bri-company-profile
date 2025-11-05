import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import FooterBRI from "../components/FooterBRI";
import { TagIcon, CalendarIcon, UserIcon } from "@heroicons/react/24/outline";

const Articles = () => {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, [i18n.language, selectedCategory]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const categoryParam =
        selectedCategory !== "all" ? `&category=${selectedCategory}` : "";
      const response = await fetch(
        `${API_URL}/articles?lang=${i18n.language}&status=published${categoryParam}`
      );
      const data = await response.json();

      if (data.success) {
        setArticles(data.data);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(data.data.map((article) => article.category)),
        ];
        setCategories(uniqueCategories);
      } else {
        setError("Failed to fetch articles");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === "id" ? "id-ID" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getContentPreview = (content) => {
    if (!content || content.length === 0) return "";

    const firstTextBlock = content.find((block) => block.type === "text");
    if (!firstTextBlock) return "";

    const text = firstTextBlock.value.replace(/#+\s/g, "").replace(/\n/g, " ");
    return text.length > 200 ? text.substring(0, 200) + "..." : text;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F4F6F8" }}>
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative text-white py-20 md:py-28 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #00529B 0%, #003B73 100%)",
        }}
      >
        {/* Decorative elements */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background: "radial-gradient(circle, #F58220 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            {i18n.language === "id" ? "Artikel & Tips" : "Articles & Tips"}
          </h1>
          <p className="font-body text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            {i18n.language === "id"
              ? "Pelajari lebih lanjut tentang layanan perbankan digital BRI dan tips keuangan untuk membantu Anda mengelola keuangan dengan lebih baik"
              : "Learn more about BRI digital banking services and financial tips to help you manage your finances better"}
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white py-6 sticky top-0 z-40 shadow-md border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`btn btn-sm font-body transition-all duration-300 ${
                selectedCategory === "all"
                  ? "text-white border-none"
                  : "btn-outline"
              }`}
              style={
                selectedCategory === "all"
                  ? { backgroundColor: "#00529B" }
                  : { borderColor: "#00529B", color: "#00529B" }
              }
            >
              {i18n.language === "id" ? "Semua" : "All"}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`btn btn-sm font-body transition-all duration-300 ${
                  selectedCategory === category
                    ? "text-white border-none"
                    : "btn-outline"
                }`}
                style={
                  selectedCategory === category
                    ? { backgroundColor: "#00529B" }
                    : { borderColor: "#00529B", color: "#00529B" }
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-6 py-16 md:py-20">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <span
              className="loading loading-spinner loading-lg"
              style={{ color: "#00529B" }}
            ></span>
          </div>
        ) : error ? (
          <div className="alert max-w-2xl mx-auto bg-red-50 border border-red-200">
            <span className="text-red-800">
              Error loading articles: {error}
            </span>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="font-heading text-3xl font-bold mb-4 text-bri-primary">
              {i18n.language === "id"
                ? "Tidak Ada Artikel"
                : "No Articles Found"}
            </h2>
            <p className="font-body text-lg text-bri-charcoal/70">
              {i18n.language === "id"
                ? "Belum ada artikel dalam kategori ini."
                : "There are no articles in this category yet."}
            </p>
          </div>
        ) : (
          <>
            {/* Articles Count */}
            <div className="mb-8">
              <p className="font-body text-bri-charcoal/70">
                {i18n.language === "id"
                  ? `Menampilkan ${articles.length} artikel`
                  : `Showing ${articles.length} articles`}
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <div
                  key={article._id}
                  className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden border border-gray-100"
                >
                  {/* Cover Image */}
                  <figure className="h-56 overflow-hidden relative">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </figure>

                  <div className="card-body p-6">
                    {/* Category Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="badge badge-sm gap-1"
                        style={{
                          backgroundColor: "#F58220",
                          color: "white",
                          border: "none",
                        }}
                      >
                        <TagIcon className="w-3 h-3" />
                        {article.category}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="card-title text-lg hover:text-bri-orange transition-colors line-clamp-2 font-heading text-bri-primary">
                      <Link to={`/article/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    {/* Preview */}
                    <p className="text-sm text-bri-charcoal/70 line-clamp-4 font-body leading-relaxed">
                      {getContentPreview(article.contentPreview)}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-col gap-2 mt-4 text-xs text-bri-charcoal/60 font-body">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <div className="card-actions justify-end mt-4">
                      <Link
                        to={`/article/${article.slug}`}
                        className="btn btn-sm text-white border-none hover:scale-105 transition-transform duration-300 font-body"
                        style={{ backgroundColor: "#00529B" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#003B73";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#00529B";
                        }}
                      >
                        {i18n.language === "id"
                          ? "Baca Selengkapnya"
                          : "Read More"}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <FooterBRI />
    </div>
  );
};

export default Articles;
