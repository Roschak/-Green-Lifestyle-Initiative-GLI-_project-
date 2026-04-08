// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protect = async (req, res, next) => {
    console.log('=== AUTH CHECK ===');

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('❌ TOKEN TIDAK ADA');
        return res.status(401).json({ 
            success: false, 
            message: 'Akses ditolak, token tidak ditemukan!' 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        console.log('✅ TOKEN VALID, uid:', decoded.id);

        // Ambil data user dari Firestore
        const userDoc = await db.collection('users').doc(decoded.id).get();

        if (!userDoc.exists) {
            console.log('❌ USER NOT FOUND IN FIRESTORE');
            return res.status(404).json({ 
                success: false, 
                message: 'User tidak ditemukan' 
            });
        }

        const userData = userDoc.data();

        req.user = {
            id: decoded.id,
            role: userData.role || 'user',
            email: userData.email,
            name: userData.name
        };

        console.log('✅ USER ROLE:', req.user.role);
        next();
    } catch (error) {
        console.error('❌ TOKEN ERROR:', error.message);
        return res.status(401).json({ 
            success: false, 
            message: 'Sesi tidak valid, silakan login ulang!' 
        });
    }
};

const adminOnly = (req, res, next) => {
    console.log('=== ADMIN CHECK ===');

    if (!req.user) {
        console.log('❌ USER TIDAK TERAUTENTIKASI');
        return res.status(401).json({ 
            success: false, 
            message: 'User tidak terautentikasi' 
        });
    }

    if (req.user.role !== 'admin') {
        console.log(`❌ USER ${req.user.id} BUKAN ADMIN (role: ${req.user.role})`);
        return res.status(403).json({ 
            success: false, 
            message: 'Anda tidak memiliki akses admin!' 
        });
    }

    console.log(`✅ ADMIN AKSES: ${req.user.id}`);
    next();
};

module.exports = { protect, adminOnly };