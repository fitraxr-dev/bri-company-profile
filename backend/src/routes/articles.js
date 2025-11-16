import express from "express";
import {
  getAllArticles,
  getArticleBySlug,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesByCategory,
} from "../controllers/articleController.js";

const router = express.Router();

// Public routes
router.get("/", getAllArticles);
router.get("/slug/:slug", getArticleBySlug);
router.get("/category/:category", getArticlesByCategory);
router.get("/:id", getArticleById);

// Protected routes (uncomment when auth is needed)
router.post('/', authMiddleware, createArticle);
router.put('/:id', authMiddleware, updateArticle);
router.delete('/:id', authMiddleware, deleteArticle);

// For now, allow public creation/update/delete for testing
// router.post("/", createArticle);
// router.put("/:id", updateArticle);
// router.delete("/:id", deleteArticle);

export default router;
