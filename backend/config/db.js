// config/db.js
const admin = require('firebase-admin');

// Inisialisasi hanya sekali
if (!admin.apps.length) {
    try {
        const serviceAccount = require('../serviceAccountKey.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('✅ Firebase Admin SDK initialized');
    } catch (error) {
        console.error('❌ Firebase initialization error:', error.message);
        console.error('⚠️ Make sure serviceAccountKey.json exists in backend folder');
        process.exit(1);
    }
}

const db = admin.firestore();

module.exports = db;