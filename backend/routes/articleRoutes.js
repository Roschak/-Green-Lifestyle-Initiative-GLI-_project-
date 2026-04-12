const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const multer = require('../config/multer');

// Public routes
router.get('/articles', articleController.getAllArticles);
router.get('/articles/:id', articleController.getArticleById);

// Admin routes (protected)
router.post('/articles', protect, adminOnly, multer.single('image'), articleController.createArticle);
router.put('/articles/:id', protect, adminOnly, multer.single('image'), articleController.updateArticle);
router.delete('/articles/:id', protect, adminOnly, articleController.deleteArticle);
router.put('/articles/:id/status', protect, adminOnly, articleController.toggleArticleStatus);
router.get('/admin/articles', protect, adminOnly, articleController.getAdminArticles);

module.exports = router;
