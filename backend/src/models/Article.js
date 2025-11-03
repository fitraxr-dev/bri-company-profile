import mongoose from "mongoose";

// Sub-schema untuk content block
const contentBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["text", "image"],
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: false,
    },
  },
  { _id: false }
);

// Sub-schema untuk translations
const translationSchema = new mongoose.Schema(
  {
    lang: {
      type: String,
      enum: ["id", "en"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    content: {
      type: [contentBlockSchema],
      default: [],
    },
  },
  { _id: false }
);

// Main Article schema
const articleSchema = new mongoose.Schema(
  {
    translations: {
      type: [translationSchema],
      required: true,
      validate: {
        validator: function (translations) {
          return translations.length > 0;
        },
        message: "At least one translation is required",
      },
    },
    category: {
      type: String,
      required: true,
      default: "Tutorial",
    },
    author: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk pencarian berdasarkan slug dan bahasa
articleSchema.index({ "translations.slug": 1, "translations.lang": 1 });
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ category: 1 });

// Method untuk mendapatkan artikel berdasarkan bahasa
articleSchema.methods.getByLanguage = function (lang) {
  const translation = this.translations.find((t) => t.lang === lang);
  if (!translation) {
    return null;
  }
  return {
    _id: this._id,
    ...translation.toObject(),
    category: this.category,
    author: this.author,
    coverImage: this.coverImage,
    publishedAt: this.publishedAt,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Static method untuk mencari artikel berdasarkan slug dan bahasa
articleSchema.statics.findBySlugAndLang = async function (slug, lang) {
  return this.findOne({
    "translations.slug": slug,
    "translations.lang": lang,
  });
};

// Prevent model recompilation in development (hot-reload)
const Article =
  mongoose.models.Article || mongoose.model("Article", articleSchema);

export default Article;
