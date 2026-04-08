// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ============ ROUTE STATS & DASHBOARD ============
router.get('/stats', protect, adminOnly, adminController.getDashboardStats);
router.get('/profile/stats', protect, adminOnly, adminController.getAdminStats);

// ============ ROUTE DATA ============
router.get('/users', protect, adminOnly, adminController.getUsers);
router.get('/users/:id', protect, adminOnly, adminController.getUserDetail);
router.get('/actions', protect, adminOnly, adminController.getAllActions);
router.get('/leaderboard', protect, adminOnly, adminController.getLeaderboard);

// ============ ROUTE VERIFIKASI ============
router.put('/actions/:id', protect, adminOnly, adminController.verifyAction);

module.exports = router;