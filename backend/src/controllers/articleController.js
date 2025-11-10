import Article from "../models/Article.js";

// Get all articles
export const getAllArticles = async (req, res) => {
  try {
    const { lang = "id", status, category } = req.query;

    const filter = {};
    // Only filter by status if explicitly provided and not empty string
    if (status && status !== "") {
      filter.status = status;
    }
    if (category) {
      filter.category = category;
    }

    const articles = await Article.find(filter).sort({ publishedAt: -1 });

    // Transform to include only requested language
    const transformedArticles = articles
      .map((article) => {
        const translation = article.translations.find((t) => t.lang === lang);
        if (!translation) return null;

        return {
          _id: article._id,
          title: translation.title,
          slug: translation.slug,
          contentPreview: translation.content.slice(0, 2), // First 2 blocks as preview
          category: article.category,
          author: article.author,
          coverImage: article.coverImage,
          publishedAt: article.publishedAt,
          status: article.status,
        };
      })
      .filter(Boolean);

    res.json({
      success: true,
      count: transformedArticles.length,
      data: transformedArticles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching articles",
      error: error.message,
    });
  }
};

// Get article by slug
export const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { lang = "id" } = req.query;

    const article = await Article.findOne({
      "translations.slug": slug,
      "translations.lang": lang,
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    const articleData = article.getByLanguage(lang);

    res.json({
      success: true,
      data: articleData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching article",
      error: error.message,
    });
  }
};

// Get article by ID (with all languages)
export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching article",
      error: error.message,
    });
  }
};

// Create new article
export const createArticle = async (req, res) => {
  try {
    const articleData = req.body;

    const article = await Article.create(articleData);

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: article,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating article",
      error: error.message,
    });
  }
};

// Update article
export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const article = await Article.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.json({
      success: true,
      message: "Article updated successfully",
      data: article,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating article",
      error: error.message,
    });
  }
};

// Delete article
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findByIdAndDelete(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting article",
      error: error.message,
    });
  }
};

// Get articles by category
export const getArticlesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { lang = "id" } = req.query;

    const articles = await Article.find({
      category,
      status: "published",
    }).sort({ publishedAt: -1 });

    const transformedArticles = articles
      .map((article) => {
        const translation = article.translations.find((t) => t.lang === lang);
        if (!translation) return null;

        return {
          _id: article._id,
          title: translation.title,
          slug: translation.slug,
          contentPreview: translation.content.slice(0, 2),
          category: article.category,
          author: article.author,
          coverImage: article.coverImage,
          publishedAt: article.publishedAt,
        };
      })
      .filter(Boolean);

    res.json({
      success: true,
      count: transformedArticles.length,
      data: transformedArticles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching articles by category",
      error: error.message,
    });
  }
};
