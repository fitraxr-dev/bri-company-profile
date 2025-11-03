import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const ArticlesSection = () => {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, [i18n.language]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/articles?lang=${i18n.language}&status=published`
      );
      const data = await response.json();

      if (data.success) {
        setArticles(data.data);
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

  const scrollLeft = () => {
    document.getElementById("articles-carousel").scrollBy({
      left: -400,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    document.getElementById("articles-carousel").scrollBy({
      left: 400,
      behavior: "smooth",
    });
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
    return text.length > 150 ? text.substring(0, 150) + "..." : text;
  };

  if (loading) {
    return (
      <section
        className="relative py-16 md:py-24 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #E6F0FA 50%, #F4F6F8 100%)",
        }}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <span
              className="loading loading-spinner loading-lg"
              style={{ color: "#00529B" }}
            ></span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="relative py-16 md:py-24 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #E6F0FA 50%, #F4F6F8 100%)",
        }}
      >
        <div className="container mx-auto px-6">
          <div className="alert alert-error max-w-2xl mx-auto bg-red-50 border border-red-200">
            <span className="text-red-800">
              Error loading articles: {error}
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <section
      id="articles"
      className="relative py-16 md:py-24 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #ffffff 0%, #E6F0FA 50%, #F4F6F8 100%)",
      }}
      aria-label="Artikel dan Tips BRI"
    >
      {/* Subtle background decoration */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #F58220 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-bri-primary mb-4">
            {i18n.language === "id" ? "Artikel & Tips" : "Articles & Tips"}
          </h2>
          <p className="font-body text-lg md:text-xl text-bri-charcoal max-w-3xl mx-auto">
            {i18n.language === "id"
              ? "Pelajari lebih lanjut tentang layanan perbankan digital BRI dan tips keuangan"
              : "Learn more about BRI digital banking services and financial tips"}
          </p>
        </div>

        {/* Articles Carousel */}
        <div className="relative">
          {/* Navigation Buttons - Only show if more than 3 articles */}
          {articles.length > 3 && (
            <>
              <button
                onClick={scrollLeft}
                className="btn btn-circle bg-bri-orange hover:bg-bri-orange/90 text-white border-none absolute left-0 top-1/2 -translate-y-1/2 z-10 shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Previous"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <button
                onClick={scrollRight}
                className="btn btn-circle bg-bri-orange hover:bg-bri-orange/90 text-white border-none absolute right-0 top-1/2 -translate-y-1/2 z-10 shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Next"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Carousel Container */}
          <div
            id="articles-carousel"
            className={`flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 ${
              articles.length <= 3 ? "justify-center" : ""
            }`}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitScrollbar: { display: "none" },
            }}
          >
            {articles.map((article) => (
              <div
                key={article._id}
                className="card bg-white shadow-xl snap-start flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] hover:shadow-2xl transition-all duration-300 group overflow-hidden border border-gray-100"
              >
                {/* Cover Image */}
                <figure className="h-48 overflow-hidden relative">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </figure>

                <div className="card-body p-6">
                  {/* Category Badge */}
                  <div
                    className="badge badge-sm mb-3"
                    style={{
                      backgroundColor: "#F58220",
                      color: "white",
                      border: "none",
                    }}
                  >
                    {article.category}
                  </div>

                  {/* Title */}
                  <h3 className="card-title text-lg line-clamp-2 font-heading text-bri-primary group-hover:text-bri-orange transition-colors duration-300">
                    {article.title}
                  </h3>

                  {/* Preview */}
                  <p className="text-sm text-bri-charcoal/70 line-clamp-3 font-body leading-relaxed">
                    {getContentPreview(article.contentPreview)}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between mt-4 text-xs text-bri-charcoal/60 font-body">
                    <span>{article.author}</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>

                  {/* Read More Button */}
                  <div className="card-actions justify-end mt-4">
                    <Link
                      to={`/article/${article.slug}`}
                      className="btn btn-sm border-none text-white hover:scale-105 transition-transform duration-300"
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
        </div>

        {/* View All Button */}
        {articles.length > 3 && (
          <div className="text-center mt-12">
            <Link
              to="/articles"
              className="btn btn-outline border-2 hover:scale-105 transition-all duration-300 font-body"
              style={{
                borderColor: "#00529B",
                color: "#00529B",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#00529B";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#00529B";
              }}
            >
              {i18n.language === "id"
                ? "Lihat Semua Artikel"
                : "View All Articles"}
            </Link>
          </div>
        )}
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        #articles-carousel::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ArticlesSection;
