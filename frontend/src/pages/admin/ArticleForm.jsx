import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeftIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const ArticleForm = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    coverImage: "",
    category: "Tutorial",
    author: "Admin BRImo",
    status: "draft",
    publishedAt: new Date().toISOString().split("T")[0],
    translations: [
      {
        lang: "id",
        title: "",
        slug: "",
        content: [{ type: "text", value: "", caption: "" }],
      },
      {
        lang: "en",
        title: "",
        slug: "",
        content: [{ type: "text", value: "", caption: "" }],
      },
    ],
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTranslationChange = (langIndex, field, value) => {
    const newTranslations = [...formData.translations];
    newTranslations[langIndex][field] = value;

    // Auto-generate slug from title
    if (field === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      newTranslations[langIndex].slug = slug;
    }

    setFormData({
      ...formData,
      translations: newTranslations,
    });
  };

  const handleContentChange = (langIndex, contentIndex, field, value) => {
    const newTranslations = [...formData.translations];
    newTranslations[langIndex].content[contentIndex][field] = value;
    setFormData({
      ...formData,
      translations: newTranslations,
    });
  };

  const addContentBlock = (langIndex, type) => {
    const newTranslations = [...formData.translations];
    newTranslations[langIndex].content.push({
      type,
      value: "",
      caption: "",
    });
    setFormData({
      ...formData,
      translations: newTranslations,
    });
  };

  const removeContentBlock = (langIndex, contentIndex) => {
    const newTranslations = [...formData.translations];
    newTranslations[langIndex].content.splice(contentIndex, 1);
    setFormData({
      ...formData,
      translations: newTranslations,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${API_URL}/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          i18n.language === "id"
            ? "Artikel berhasil dibuat!"
            : "Article created successfully!"
        );
        navigate("/admin");
      } else {
        alert(
          data.message ||
            (i18n.language === "id"
              ? "Gagal membuat artikel"
              : "Failed to create article")
        );
      }
    } catch (error) {
      console.error("Error creating article:", error);
      alert(i18n.language === "id" ? "Terjadi kesalahan" : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F4F6F8" }}>
      {/* Header */}
      <div className="shadow-lg" style={{ backgroundColor: "#00529B" }}>
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => navigate("/admin")}
            className="btn btn-sm gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 mb-3"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            {i18n.language === "id" ? "Kembali" : "Back"}
          </button>
          <h1 className="font-heading text-2xl font-bold text-white">
            {i18n.language === "id"
              ? "Buat Artikel Baru"
              : "Create New Article"}
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* General Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="font-heading text-xl font-bold text-bri-primary mb-4">
              {i18n.language === "id"
                ? "Informasi Umum"
                : "General Information"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cover Image */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-body font-semibold text-gray-700">
                    Cover Image URL
                  </span>
                </label>
                <input
                  type="url"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/..."
                  className="input input-bordered w-full font-body bg-white text-gray-900 hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Category */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-body font-semibold text-gray-700">
                    {i18n.language === "id" ? "Kategori" : "Category"}
                  </span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="select select-bordered w-full font-body bg-white text-gray-900 hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Tutorial">Tutorial</option>
                  <option value="Tips">Tips</option>
                  <option value="Berita">Berita</option>
                  <option value="Panduan">Panduan</option>
                </select>
              </div>

              {/* Author */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-body font-semibold text-gray-700">
                    {i18n.language === "id" ? "Penulis" : "Author"}
                  </span>
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="input input-bordered w-full font-body bg-white text-gray-900 hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Status */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-body font-semibold text-gray-700">
                    Status
                  </span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="select select-bordered w-full font-body bg-white text-gray-900 hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* Published Date */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-body font-semibold text-gray-700">
                    {i18n.language === "id"
                      ? "Tanggal Publikasi"
                      : "Published Date"}
                  </span>
                </label>
                <input
                  type="date"
                  name="publishedAt"
                  value={formData.publishedAt}
                  onChange={handleInputChange}
                  className="input input-bordered w-full font-body bg-white text-gray-900 hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Translations */}
          {formData.translations.map((translation, langIndex) => (
            <div
              key={langIndex}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <h2 className="font-heading text-xl font-bold text-bri-primary mb-4">
                {translation.lang === "id"
                  ? "🇮🇩 Bahasa Indonesia"
                  : "🇬🇧 English"}
              </h2>

              {/* Title */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-body font-semibold text-gray-700">
                    {i18n.language === "id" ? "Judul" : "Title"}
                  </span>
                </label>
                <input
                  type="text"
                  value={translation.title}
                  onChange={(e) =>
                    handleTranslationChange(langIndex, "title", e.target.value)
                  }
                  placeholder={
                    translation.lang === "id"
                      ? "Cara Membuat Akun BRImo"
                      : "How to Create a BRImo Account"
                  }
                  className="input input-bordered w-full font-body bg-white text-gray-900 hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Slug */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-body font-semibold text-gray-700">
                    Slug
                  </span>
                </label>
                <input
                  type="text"
                  value={translation.slug}
                  onChange={(e) =>
                    handleTranslationChange(langIndex, "slug", e.target.value)
                  }
                  placeholder="cara-membuat-akun-brimo"
                  className="input input-bordered w-full font-body bg-white text-gray-900 hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Content Blocks */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-body font-semibold text-gray-700">
                    {i18n.language === "id" ? "Konten" : "Content"}
                  </span>
                </label>

                {translation.content.map((block, contentIndex) => (
                  <div
                    key={contentIndex}
                    className="mb-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="badge badge-primary font-body">
                        {block.type === "text" ? "📝 Text" : "🖼️ Image"}
                      </span>
                      {translation.content.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeContentBlock(langIndex, contentIndex)
                          }
                          className="btn btn-xs btn-error btn-outline"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {block.type === "text" ? (
                      <textarea
                        value={block.value}
                        onChange={(e) =>
                          handleContentChange(
                            langIndex,
                            contentIndex,
                            "value",
                            e.target.value
                          )
                        }
                        placeholder={
                          translation.lang === "id"
                            ? "Tuliskan konten artikel di sini... (gunakan ## untuk heading, ### untuk subheading, • untuk bullet points)"
                            : "Write article content here... (use ## for headings, ### for subheadings, • for bullet points)"
                        }
                        className="textarea textarea-bordered w-full h-32 font-body bg-white text-gray-900 hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    ) : (
                      <>
                        <input
                          type="url"
                          value={block.value}
                          onChange={(e) =>
                            handleContentChange(
                              langIndex,
                              contentIndex,
                              "value",
                              e.target.value
                            )
                          }
                          placeholder="https://images.unsplash.com/..."
                          className="input input-bordered w-full mb-2 font-body bg-white text-gray-900 hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <input
                          type="text"
                          value={block.caption}
                          onChange={(e) =>
                            handleContentChange(
                              langIndex,
                              contentIndex,
                              "caption",
                              e.target.value
                            )
                          }
                          placeholder={
                            translation.lang === "id"
                              ? "Caption gambar (opsional)"
                              : "Image caption (optional)"
                          }
                          className="input input-bordered w-full font-body bg-white text-gray-900 hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </>
                    )}
                  </div>
                ))}

                {/* Add Content Block Buttons */}
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => addContentBlock(langIndex, "text")}
                    className="btn btn-sm btn-outline gap-2 font-body"
                  >
                    <PlusIcon className="w-4 h-4" />
                    {i18n.language === "id" ? "Tambah Teks" : "Add Text"}
                  </button>
                  <button
                    type="button"
                    onClick={() => addContentBlock(langIndex, "image")}
                    className="btn btn-sm btn-outline gap-2 font-body"
                  >
                    <PhotoIcon className="w-4 h-4" />
                    {i18n.language === "id" ? "Tambah Gambar" : "Add Image"}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="btn btn-outline font-body"
              disabled={loading}
            >
              {i18n.language === "id" ? "Batal" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn text-white border-none font-body"
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
                  {i18n.language === "id" ? "Menyimpan..." : "Saving..."}
                </>
              ) : (
                <>
                  <PlusIcon className="w-5 h-5" />
                  {i18n.language === "id" ? "Buat Artikel" : "Create Article"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleForm;
