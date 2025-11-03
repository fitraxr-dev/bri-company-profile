import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeftIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

const ArticleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [slug, i18n.language]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/articles/slug/${slug}?lang=${i18n.language}`
      );
      const data = await response.json();

      if (data.success) {
        setArticle(data.data);
      } else {
        setError("Article not found");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching article:", err);
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

  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: `${article.title} - BRImo`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert(i18n.language === "id" ? "Link disalin!" : "Link copied!");
    }
  };

  const renderContent = (content) => {
    if (!content || content.length === 0) return null;

    return content.map((block, index) => {
      if (block.type === "text") {
        // Handle markdown-style formatting
        const formattedText = block.value.split("\n").map((line, i) => {
          // Headers
          if (line.startsWith("## ")) {
            return (
              <h2
                key={i}
                className="text-2xl font-bold mt-8 mb-4 text-bri-charcoal"
              >
                {line.replace("## ", "")}
              </h2>
            );
          }
          if (line.startsWith("### ")) {
            return (
              <h3
                key={i}
                className="text-xl font-semibold mt-6 mb-3 text-bri-charcoal"
              >
                {line.replace("### ", "")}
              </h3>
            );
          }
          // Bullet points
          if (line.startsWith("• ")) {
            return (
              <li key={i} className="ml-6 mb-2 text-bri-charcoal">
                {line.replace("• ", "")}
              </li>
            );
          }
          // Regular paragraph
          if (line.trim() !== "") {
            return (
              <p key={i} className="mb-4 leading-relaxed text-bri-charcoal">
                {line}
              </p>
            );
          }
          return null;
        });

        return (
          <div key={index} className="prose prose-lg max-w-none mb-6">
            {formattedText}
          </div>
        );
      } else if (block.type === "image") {
        return (
          <figure key={index} className="my-8">
            <img
              src={block.value}
              alt={block.caption || "Article image"}
              className="w-full rounded-lg shadow-lg"
            />
            {block.caption && (
              <figcaption className="text-center text-sm text-base-content/60 mt-3 italic">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );
      }
      return null;
    });
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F4F6F8" }}
      >
        <span
          className="loading loading-spinner loading-lg"
          style={{ color: "#00529B" }}
        ></span>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F4F6F8" }}
      >
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold mb-4 text-bri-primary">
            {i18n.language === "id"
              ? "Artikel Tidak Ditemukan"
              : "Article Not Found"}
          </h2>
          <p className="font-body text-bri-charcoal/70 mb-6">
            {error ||
              (i18n.language === "id"
                ? "Artikel yang Anda cari tidak ditemukan."
                : "The article you are looking for was not found.")}
          </p>
          <button
            onClick={() => navigate("/")}
            className="btn text-white border-none hover:scale-105 transition-transform duration-300 font-body"
            style={{ backgroundColor: "#00529B" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#003B73";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#00529B";
            }}
          >
            {i18n.language === "id" ? "Kembali ke Beranda" : "Back to Home"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F4F6F8" }}>
      {/* Header with Back Button */}
      <div
        className="py-4 sticky top-0 z-50 shadow-lg"
        style={{ backgroundColor: "#00529B" }}
      >
        <div className="container mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-sm gap-2 font-body border-none"
            style={{
              backgroundColor: "white",
              color: "#000000",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
            }}
          >
            <ArrowLeftIcon className="w-5 h-5" style={{ color: "#000000" }} />
            {i18n.language === "id" ? "Kembali" : "Back"}
          </button>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, #F4F6F8 0%, transparent 60%)",
          }}
        ></div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-6 -mt-32 relative z-10">
        <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100">
          {/* Category Badge */}
          <div
            className="badge badge-lg mb-4 gap-1"
            style={{
              backgroundColor: "#F58220",
              color: "white",
              border: "none",
            }}
          >
            <TagIcon className="w-4 h-4 mr-1" />
            {article.category}
          </div>

          {/* Title */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-bri-primary">
            {article.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-6 mb-8 text-sm text-bri-charcoal/70 border-b border-gray-200 pb-6 font-body">
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 hover:text-bri-orange transition-colors"
            >
              <ShareIcon className="w-5 h-5" />
              <span>{i18n.language === "id" ? "Bagikan" : "Share"}</span>
            </button>
          </div>

          {/* Article Content */}
          <div className="article-content text-base-content">
            {renderContent(article.content)}
          </div>

          {/* Divider */}
          <div className="divider my-8"></div>
        </article>
      </div>

      {/* Custom Styles for Article Content */}
      <style jsx>{`
        .article-content {
          font-size: 1.125rem;
          line-height: 1.75;
        }

        .article-content h2 {
          scroll-margin-top: 80px;
        }

        .article-content h3 {
          scroll-margin-top: 80px;
        }

        .article-content img {
          max-width: 100%;
          height: auto;
        }

        .article-content li {
          list-style-type: disc;
        }
      `}</style>
    </div>
  );
};

export default ArticleDetail;
