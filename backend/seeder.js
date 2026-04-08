// backend/seeder.js
const db = require('./config/db');
const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');

const seedData = async () => {
  try {
    console.log('🌱 Starting Firestore seeder...');

    // 1. CREATE ADMIN USER
    try {
      const adminEmail = 'admin@gli.com';
      const existing = await db.collection('users')
        .where('email', '==', adminEmail)
        .limit(1)
        .get();

      if (existing.empty) {
        const hashed = await bcrypt.hash('admin123456', 10);
        const adminRef = await db.collection('users').add({
          email: adminEmail,
          name: 'Admin GLI',
          password: hashed,
          role: 'admin',
          points: 1000,
          monthly_points: 500,
          level: 'Admin',
          medal: 'PAHLAWAN ENERGI, HEMAT AIR',
          status: 'offline',
          created_at: admin.firestore.FieldValue.serverTimestamp(),
          updated_at: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log('✅ Admin user created:', adminRef.id);
      } else {
        console.log('ℹ️ Admin user already exists');
      }
    } catch (err) {
      console.error('❌ Admin creation error:', err.message);
    }

    // 2. CREATE TEST USER
    try {
      const userEmail = 'user@gli.com';
      const existing = await db.collection('users')
        .where('email', '==', userEmail)
        .limit(1)
        .get();

      if (existing.empty) {
        const hashed = await bcrypt.hash('user123456', 10);
        const userRef = await db.collection('users').add({
          email: userEmail,
          name: 'Test User',
          password: hashed,
          role: 'user',
          points: 150,
          monthly_points: 50,
          level: 'Eco-Newbie',
          medal: 'PENANAM POHON',
          status: 'offline',
          created_at: admin.firestore.FieldValue.serverTimestamp(),
          updated_at: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log('✅ Test user created:', userRef.id);
      } else {
        console.log('ℹ️ Test user already exists');
      }
    } catch (err) {
      console.error('❌ Test user creation error:', err.message);
    }

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder
if (require.main === module) {
  seedData();
}

module.exports = seedData;