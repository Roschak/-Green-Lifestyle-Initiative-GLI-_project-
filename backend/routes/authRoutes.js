// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', protect, authController.logout);
router.post('/google-register', authController.googleRegister);  // ✅ NEW
router.post('/send-reset', authController.sendResetEmail);
// GET endpoint for quick testing via browser or PowerShell (query param)
router.get('/send-reset', (req, res) => {
	const email = req.query.email;
	if (!email) return res.status(400).json({ success: false, message: 'Query param email is required' });
	// Temporarily override body to pass email from query param
	const originalBody = req.body;
	req.body = { email };
	authController.sendResetEmail(req, res);
	req.body = originalBody; // Restore original body
});

module.exports = router;