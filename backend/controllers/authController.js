// backend/controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');

const makeToken = (id, role) =>
    jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
    }

    try {
        const emailLower = email.toLowerCase().trim();

        // ✅ Check if email already exists in Firestore
        const existing = await db.collection('users')
            .where('email', '==', emailLower)
            .limit(1)
            .get();

        // ✅ If email already exists, LOGIN instead of error
        if (!existing.empty) {
            console.log('ℹ️ Email sudah terdaftar, login langsung:', email);
            const existingUser = existing.docs[0];
            const userId = existingUser.id;
            const userData = existingUser.data();

            // Update user status
            try {
                await db.collection('users').doc(userId).update({
                    status: 'online',
                    last_seen: admin.firestore.FieldValue.serverTimestamp()
                });
            } catch (updateErr) {
                console.warn('⚠️ Could not update user status:', updateErr.message);
            }

            // Return custom token for existing user
            const customToken = await admin.auth().createCustomToken(userId);
            const { password: _, ...safeUser } = userData;

            return res.json({
                success: true,
                message: 'Selamat datang kembali! Login berhasil.',
                token: customToken,
                user: { id: userId, ...safeUser }
            });
        }

        // ✅ Create NEW Firebase Auth user
        let firebaseUser;
        try {
            firebaseUser = await admin.auth().createUser({
                email: emailLower,
                password: password,
                displayName: name.trim()
            });
            console.log('✅ Firebase Auth user created:', firebaseUser.uid);
        } catch (firebaseErr) {
            if (firebaseErr.code === 'auth/email-already-exists') {
                console.log('⚠️ Email exists in Firebase but not in Firestore:', emailLower);
                // Try to get the Firebase user and login
                try {
                    const userRecord = await admin.auth().getUserByEmail(emailLower);
                    const customToken = await admin.auth().createCustomToken(userRecord.uid);
                    return res.json({
                        success: true,
                        message: 'Selamat datang kembali! Login berhasil.',
                        token: customToken,
                        user: {
                            id: userRecord.uid,
                            email: emailLower,
                            name: name.trim(),
                            role: 'user'
                        }
                    });
                } catch (getErr) {
                    return res.status(400).json({ success: false, message: 'Email sudah terdaftar. Silakan coba login.' });
                }
            }
            throw firebaseErr;
        }

        // ✅ Create NEW Firestore user record
        const hashed = await bcrypt.hash(password, 10);

        await db.collection('users').doc(firebaseUser.uid).set({
            name: name.trim(),
            email: emailLower,
            password: hashed,
            role: 'user',
            points: 0,
            monthly_points: 0,
            level: 'Eco-Newbie',
            medal: '',
            status: 'online',
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log('✅ User registered with Firebase UID:', firebaseUser.uid);

        // Return custom token
        const customToken = await admin.auth().createCustomToken(firebaseUser.uid);

        return res.status(201).json({
            success: true,
            message: 'Registrasi berhasil! Selamat datang.',
            token: customToken,
            user: {
                id: firebaseUser.uid,
                email: emailLower,
                name: name.trim(),
                role: 'user'
            }
        });

    } catch (err) {
        console.error('❌ Register Error:', err.message);
        return res.status(500).json({ success: false, message: 'Gagal registrasi: ' + err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
    }

    try {
        // ✅ FIX #2: Use Firebase Auth instead of Firestore lookup
        try {
            const userRecord = await admin.auth().getUserByEmail(email.toLowerCase().trim());
            console.log('✅ Firebase Auth user found:', userRecord.uid);

            // Get user data from Firestore using Firebase UID
            const userDoc = await db.collection('users').doc(userRecord.uid).get();

            if (!userDoc.exists) {
                console.log('⚠️ Firebase user exists but no Firestore record:', userRecord.uid);
                return res.status(401).json({ success: false, message: 'Email atau password salah' });
            }

            const user = userDoc.data();

            // Update user status
            try {
                await db.collection('users').doc(userRecord.uid).update({
                    status: 'online',
                    last_seen: admin.firestore.FieldValue.serverTimestamp()
                });
            } catch (updateErr) {
                console.warn('⚠️ Warning: Could not update user status:', updateErr.message);
            }

            // ✅ FIX #2: Return Firebase custom token (not JWT)
            const customToken = await admin.auth().createCustomToken(userRecord.uid);

            const { password: _, ...safeUser } = user;

            console.log('✅ Login berhasil:', email);

            return res.json({
                success: true,
                message: 'Login berhasil',
                token: customToken,
                user: { id: userRecord.uid, ...safeUser }
            });

        } catch (firebaseErr) {
            if (firebaseErr.code === 'auth/user-not-found') {
                console.log('❌ Firebase user not found:', email);
            } else {
                console.error('❌ Firebase error:', firebaseErr.code, firebaseErr.message);
            }
            return res.status(401).json({ success: false, message: 'Email atau password salah' });
        }

    } catch (err) {
        console.error('❌ Login Error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (userId) {
            await db.collection('users').doc(userId).update({
                status: 'offline',
                last_seen: admin.firestore.FieldValue.serverTimestamp()
            });
        }

        return res.json({ success: true, message: 'Logout berhasil' });

    } catch (err) {
        console.error('❌ Logout Error:', err);
        return res.status(500).json({ success: false, message: 'Gagal logout' });
    }
};

/**
 * Google Register - Registrasi user melalui Google OAuth
 * ✅ Checks email uniqueness first
 * ✅ Prevents duplicate accounts
 */
exports.googleRegister = async (req, res) => {
    const { email, name, photoURL } = req.body;

    if (!email || !name) {
        return res.status(400).json({ success: false, message: 'Email dan name wajib diisi' });
    }

    try {
        const emailLower = email.toLowerCase().trim();

        // ✅ Check if user already exists in Firestore by email
        const existing = await db.collection('users')
            .where('email', '==', emailLower)
            .limit(1)
            .get();

        // ✅ If email already exists, just LOGIN instead of error
        if (!existing.empty) {
            console.log('ℹ️ Google email sudah terdaftar, login langsung:', email);
            const existingUser = existing.docs[0];
            const userId = existingUser.id;
            const userData = existingUser.data();

            // Update user status
            try {
                await db.collection('users').doc(userId).update({
                    status: 'online',
                    last_seen: admin.firestore.FieldValue.serverTimestamp()
                });
            } catch (updateErr) {
                console.warn('⚠️ Could not update user status:', updateErr.message);
            }

            // Return custom token for existing user
            const customToken = await admin.auth().createCustomToken(userId);
            const { password: _, ...safeUser } = userData;

            return res.json({
                success: true,
                message: 'Login Google berhasil!',
                token: customToken,
                userId: userId,
                user: { id: userId, ...safeUser }
            });
        }

        // ✅ Create NEW Firebase Auth user (provider: Google)
        let firebaseUser;
        try {
            firebaseUser = await admin.auth().createUser({
                email: emailLower,
                displayName: name.trim(),
                photoURL: photoURL || null
            });
            console.log('✅ Firebase Auth user created (Google):', firebaseUser.uid);
        } catch (firebaseErr) {
            if (firebaseErr.code === 'auth/email-already-exists') {
                console.log('⚠️ Email exists in Firebase but not in Firestore:', emailLower);
                // Try to get the Firebase user and login
                try {
                    const userRecord = await admin.auth().getUserByEmail(emailLower);
                    const customToken = await admin.auth().createCustomToken(userRecord.uid);
                    return res.json({
                        success: true,
                        message: 'Login Google berhasil!',
                        token: customToken,
                        userId: userRecord.uid,
                        user: {
                            id: userRecord.uid,
                            email: emailLower,
                            name: name.trim(),
                            role: 'user',
                            provider: 'google'
                        }
                    });
                } catch (getErr) {
                    return res.status(400).json({ success: false, message: 'Email sudah terdaftar. Silakan login dengan akun Anda.' });
                }
            }
            throw firebaseErr;
        }

        // ✅ Create NEW Firestore user record
        await db.collection('users').doc(firebaseUser.uid).set({
            name: name.trim(),
            email: emailLower,
            photoURL: photoURL || null,
            provider: 'google',
            role: 'user',
            points: 0,
            monthly_points: 0,
            level: 'Eco-Newbie',
            medal: '',
            status: 'online',
            last_activity: admin.firestore.FieldValue.serverTimestamp(),
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log('✅ Google user registered:', firebaseUser.uid);

        // ✅ Return custom token
        const customToken = await admin.auth().createCustomToken(firebaseUser.uid);

        return res.status(201).json({
            success: true,
            message: 'Registrasi Google berhasil!',
            token: customToken,
            userId: firebaseUser.uid,
            user: {
                id: firebaseUser.uid,
                email: emailLower,
                name: name.trim(),
                role: 'user',
                provider: 'google'
            }
        });

    } catch (err) {
        console.error('❌ Google Register Error:', err.message);
        return res.status(500).json({ success: false, message: 'Gagal registrasi Google: ' + err.message });
    }
};

/**
 * Send password reset link (SECURE)
 * ✅ Rate limited: max 3 requests per email per hour
 * ✅ Audit logged to Firestore
 * ✅ If SendGrid configured: send via email
 * ✅ If SendGrid not configured: return link (still secure with rate limit + audit)
 */
exports.sendResetEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email wajib diisi' });

    const emailLower = email.toLowerCase().trim();

    try {
        // ✅ RATE LIMITING: Check if user requested reset too many times in last hour
        const resetRef = db.collection('password_resets');
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        
        const recentRequestsSnapshot = await resetRef
            .where('email', '==', emailLower)
            .get();

        const recentRequests = recentRequestsSnapshot.docs.filter((doc) => {
            const data = doc.data() || {};
            const createdAt = data.created_at && typeof data.created_at.toDate === 'function'
                ? data.created_at.toDate()
                : data.created_at;
            return createdAt instanceof Date ? createdAt >= oneHourAgo : false;
        });

        if (recentRequests.length >= 3) {
            console.warn(`⚠️ Rate limit exceeded for email: ${emailLower}`);
            return res.status(429).json({ 
                success: false, 
                message: 'Terlalu banyak permintaan reset. Coba lagi dalam 1 jam.' 
            });
        }

        // ✅ Ensure the email exists in Firebase Auth before generating a reset link
        try {
            await admin.auth().getUserByEmail(emailLower);
        } catch (lookupErr) {
            console.warn('⚠️ Reset requested for non-existent Firebase user:', emailLower);
            return res.status(404).json({ success: false, message: 'Email tidak terdaftar di sistem' });
        }

        // ✅ Generate reset link
        const actionCodeSettings = {
            url: process.env.FRONTEND_URL || 'http://localhost:5173/login',
            handleCodeInApp: false
        };

        const link = await admin.auth().generatePasswordResetLink(emailLower, actionCodeSettings);

        // ✅ LOG ATTEMPT to Firestore (audit trail)
        const logRef = await resetRef.add({
            email: emailLower,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            ip: req.ip || 'unknown',
            status: 'initiated'
        });

        // If requested, immediately return the link (useful for testing/debugging).
        // Accept either query param `?showLink=1` or JSON body `{ showLink: true }`.
        const wantShowLink = (req.query && String(req.query.showLink) === '1') || (req.body && req.body.showLink === true);
        if (wantShowLink) {
            await logRef.update({ status: 'fallback' });
            return res.json({
                success: true,
                message: 'Reset link telah dibuat (ditampilkan untuk pengujian).',
                link
            });
        }

        // ✅ TRY TO SEND via Mailtrap SMTP (nodemailer) if configured
        if (process.env.MAILTRAP_HOST && process.env.MAILTRAP_USER && process.env.MAILTRAP_PASS && process.env.MAIL_FROM) {
            try {
                const nodemailer = require('nodemailer');
                const transporter = nodemailer.createTransport({
                    host: process.env.MAILTRAP_HOST,
                    port: parseInt(process.env.MAILTRAP_PORT || '2525', 10),
                    auth: {
                        user: process.env.MAILTRAP_USER,
                        pass: process.env.MAILTRAP_PASS
                    },
                    secure: false
                });

                const mailOptions = {
                    from: process.env.MAIL_FROM,
                    to: emailLower,
                    subject: 'Reset Password - GLI Project',
                    html: `<p>Halo,</p><p>Silakan klik link di bawah untuk mereset password Anda:</p><p><a href="${link}" style="background:#1B4332;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block">Reset Password</a></p><p>Link ini berlaku selama 24 jam.</p><p>Jika Anda tidak meminta ini, abaikan saja email ini.</p>`
                };

                await transporter.sendMail(mailOptions);
                await logRef.update({ status: 'sent', provider: 'mailtrap' });
                console.log('✅ Reset email (Mailtrap) sent to:', emailLower);
                return res.json({ success: true, message: 'Link reset password telah dikirim ke email Anda. Cek inbox (atau folder spam).' });
            } catch (smtpErr) {
                console.error('❌ Mailtrap send error:', smtpErr && smtpErr.message ? smtpErr.message : smtpErr);
                // fall through to other methods
            }
        }

        // ✅ TRY TO SEND via SendGrid if configured
        if (process.env.SENDGRID_API_KEY && process.env.MAIL_FROM) {
            try {
                const sgMail = require('@sendgrid/mail');
                sgMail.setApiKey(process.env.SENDGRID_APIKey || process.env.SENDGRID_API_KEY);

                const msg = {
                    to: emailLower,
                    from: process.env.MAIL_FROM,
                    subject: 'Reset Password - GLI Project',
                    html: `<p>Halo,</p><p>Silakan klik link di bawah untuk mereset password Anda:</p><p><a href="${link}" style="background:#1B4332;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block">Reset Password</a></p><p>Link ini berlaku selama 24 jam.</p><p>Jika Anda tidak meminta ini, abaikan saja email ini.</p>`
                };

                await sgMail.send(msg);
                await logRef.update({ status: 'sent', provider: 'sendgrid' });

                console.log('✅ Reset email sent successfully to:', emailLower);
                return res.json({ success: true, message: 'Link reset password telah dikirim ke email Anda. Cek inbox (atau folder spam).' });
            } catch (sendErr) {
                console.error('❌ SendGrid send error:', sendErr && (sendErr.message || sendErr.toString()) ? (sendErr.message || sendErr.toString()) : sendErr);
                // Fall through to return link as fallback
            }
        } else {
            console.warn('⚠️ No email provider configured - will return link as fallback');
        }

        // ✅ FALLBACK: Return link if SendGrid not configured or failed
        await logRef.update({ status: 'fallback' });
        return res.json({ 
            success: true, 
            message: 'Reset link telah dibuat. Silakan klik tombol di bawah atau buka link di browser Anda.',
            link 
        });

    } catch (err) {
        console.error('❌ Password reset error:', err.code || err.message || err);
        if (err.code === 'auth/user-not-found' || err.code === 9 || err.code === '9') {
            return res.status(404).json({ success: false, message: 'Email tidak terdaftar di sistem' });
        }
        return res.status(500).json({ success: false, message: 'Terjadi kesalahan. Coba lagi nanti.' });
    }
};