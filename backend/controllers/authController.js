// controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');

// ── Helper: cari user by email ───────────────────────────────────────────────
const getUserByEmail = async (email) => {
    try {
        const snap = await db.collection('users').where('email', '==', email).limit(1).get();
        if (snap.empty) return null;
        const doc = snap.docs[0];
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        console.error('Error getting user by email:', error);
        return null;
    }
};

// ── Helper: buat token ───────────────────────────────────────────────────────
const makeToken = (id, role) => 
    jwt.sign(
        { id, role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
    );

// ================= REGISTER =================
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!email || !password || !name) {
        return res.status(400).json({ success: false, message: 'Nama, email, dan password wajib diisi!' });
    }

    try {
        const existing = await getUserByEmail(email);
        if (existing) {
            return res.status(400).json({ success: false, message: 'Email sudah terdaftar!' });
        }

        const hashed = await bcrypt.hash(password, 10);

        // ✅ Pakai add() agar Firestore generate ID otomatis
        const docRef = await db.collection('users').add({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashed,
            role: 'user',
            points: 0,
            monthly_points: 0,
            level: 'Eco-Newbie',
            status: 'offline',
            medal: '',
            last_reset: null,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log('✅ User registered:', docRef.id);

        return res.status(201).json({ 
            success: true, 
            message: 'Registrasi Berhasil! Silakan Login.' 
        });
    } catch (err) {
        console.error('❌ Error Register:', err);
        return res.status(500).json({ 
            success: false, 
            message: 'Gagal melakukan pendaftaran' 
        });
    }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email dan password wajib diisi!' });
    }

    try {
        console.log('=== LOGIN ===', email);

        const user = await getUserByEmail(email.toLowerCase().trim());
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Email atau password salah' 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Email atau password salah' 
            });
        }

        // Update status online dan lastSeen
        await db.collection('users').doc(user.id).update({ 
            status: 'online',
            last_seen: admin.firestore.FieldValue.serverTimestamp()
        });

        const token = makeToken(user.id, user.role);

        // Kirim user tanpa password
        const { password: _, ...safeUser } = user;

        console.log('✅ LOGIN BERHASIL, role:', user.role);
        return res.json({ 
            success: true, 
            message: 'Login berhasil', 
            token, 
            user: safeUser 
        });

    } catch (err) {
        console.error('❌ ERROR LOGIN:', err);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// ================= LOGOUT =================
exports.logout = async (req, res) => {
    try {
        const userId = req.user?.id || req.body?.userId;
        
        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID tidak ditemukan' 
            });
        }

        console.log('=== LOGOUT === USER ID:', userId);
        
        await db.collection('users').doc(userId).update({ 
            status: 'offline',
            last_seen: admin.firestore.FieldValue.serverTimestamp()
        });

        return res.json({ 
            success: true, 
            message: 'Berhasil logout' 
        });
    } catch (err) {
        console.error('❌ ERROR LOGOUT:', err);
        return res.status(500).json({ 
            success: false, 
            message: 'Gagal logout' 
        });
    }
};

// ================= GOOGLE LOGIN =================
exports.googleLogin = async (req, res) => {
    const { name, email, googleId } = req.body;
    
    if (!email || !googleId) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email dan Google ID wajib diisi!' 
        });
    }

    try {
        console.log('=== GOOGLE LOGIN ===', email);

        let user = await getUserByEmail(email.toLowerCase().trim());

        if (user) {
            // User sudah ada
            await db.collection('users').doc(user.id).update({ 
                status: 'online',
                last_seen: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ USER LAMA LOGIN GOOGLE, role:', user.role);
        } else {
            // User baru
            const hashed = await bcrypt.hash(googleId + Date.now(), 10);
            const docRef = await db.collection('users').add({
                name: name?.trim() || email.split('@')[0],
                email: email.toLowerCase().trim(),
                password: hashed,
                role: 'user',
                points: 0,
                monthly_points: 0,
                level: 'Eco-Newbie',
                status: 'online',
                medal: '',
                last_reset: null,
                provider: 'google',
                created_at: admin.firestore.FieldValue.serverTimestamp(),
                updated_at: admin.firestore.FieldValue.serverTimestamp()
            });
            
            user = {
                id: docRef.id,
                name: name || email.split('@')[0],
                email: email.toLowerCase().trim(),
                role: 'user',
                points: 0,
                monthly_points: 0,
                level: 'Eco-Newbie',
                status: 'online'
            };
            console.log('✅ USER BARU REGISTER VIA GOOGLE, ID:', docRef.id);
        }

        const token = makeToken(user.id, user.role);
        const { password: _, ...safeUser } = user;

        return res.json({ 
            success: true, 
            message: 'Google Login berhasil', 
            token, 
            user: safeUser 
        });
    } catch (err) {
        console.error('❌ ERROR GOOGLE LOGIN:', err);
        return res.status(500).json({ 
            success: false, 
            message: 'Gagal login dengan Google' 
        });
    }
};

// ================= GOOGLE REGISTER =================
exports.googleRegister = async (req, res) => {
    const { name, email, googleId } = req.body;
    
    if (!email || !googleId) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email dan Google ID wajib diisi!' 
        });
    }

    try {
        const existing = await getUserByEmail(email.toLowerCase().trim());
        if (existing) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email sudah terdaftar. Silakan login.' 
            });
        }

        const hashed = await bcrypt.hash(googleId + Date.now() + Math.random(), 10);
        const docRef = await db.collection('users').add({
            name: name?.trim() || email.split('@')[0],
            email: email.toLowerCase().trim(),
            password: hashed,
            role: 'user',
            points: 0,
            monthly_points: 0,
            level: 'Eco-Newbie',
            status: 'online',
            medal: '',
            last_reset: null,
            provider: 'google',
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp()
        });

        const user = {
            id: docRef.id,
            name: name || email.split('@')[0],
            email: email.toLowerCase().trim(),
            role: 'user',
            points: 0,
            level: 'Eco-Newbie',
            status: 'online'
        };
        
        const token = makeToken(user.id, user.role);

        console.log('✅ USER REGISTER VIA GOOGLE, ID:', docRef.id);

        return res.status(201).json({ 
            success: true, 
            message: 'Registrasi dengan Google berhasil!', 
            token, 
            user 
        });
    } catch (err) {
        console.error('❌ ERROR GOOGLE REGISTER:', err);
        return res.status(500).json({ 
            success: false, 
            message: 'Gagal registrasi dengan Google.' 
        });
    }
};