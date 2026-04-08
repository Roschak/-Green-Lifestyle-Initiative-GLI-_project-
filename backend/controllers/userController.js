// backend/controllers/userController.js
const db = require('../config/db');
const cloudinary = require('cloudinary').v2;
const admin = require('firebase-admin');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper serialize action dengan timezone handling
const serializeAction = (id, data) => {
  const toISO = (v) => {
    if (!v) return null;
    if (v?.toDate) return v.toDate().toISOString();
    if (v instanceof Date) return v.toISOString();
    return v;
  };
  return {
    id,
    user_id: data.user_id || '',
    action_name: data.action_name || '',
    description: data.description || '',
    location: data.location || '',
    img: data.img || null,
    status: data.status || 'pending',
    points: data.points || 0,
    points_earned: data.points_earned || 0,
    admin_note: data.admin_note || '',
    rejection_reason: data.rejection_reason || '',
    created_at: toISO(data.created_at),
    updated_at: toISO(data.updated_at)
  };
};

// ================= CREATE ACTION =================
exports.createAction = async (req, res) => {
  try {
    console.log('=== CREATE ACTION ===');
    const { user_id, action_name, description, location } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'User tidak valid' });
    }
    if (!action_name) {
      return res.status(400).json({ success: false, message: 'Nama aksi wajib diisi' });
    }

    let imageUrl = null;
    
    // Upload ke Cloudinary jika ada file
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'gli_actions',
          transformation: [{ width: 800, height: 600, crop: 'limit' }]
        });
        imageUrl = result.secure_url;
        console.log('✅ IMAGE UPLOADED TO CLOUDINARY:', imageUrl);
      } catch (uploadError) {
        console.error('❌ Cloudinary upload error:', uploadError);
      }
    }

    const actionData = {
      user_id: user_id,
      action_name: action_name,
      description: description || '',
      location: location || '',
      img: imageUrl || null,
      status: 'pending',
      points: 0,
      points_earned: 0,
      admin_note: '',
      rejection_reason: '',
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('actions').add(actionData);
    console.log('✅ Action created with ID:', docRef.id);

    return res.status(201).json({ 
      success: true, 
      message: 'Aksi berhasil dilaporkan!', 
      actionId: docRef.id 
    });

  } catch (err) {
    console.error('❌ ERROR CREATE ACTION:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ================= GET USER ACTIONS =================
exports.getUserActions = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID tidak ditemukan' });
    }

    console.log('=== GET USER ACTIONS:', userId);

    const snapshot = await db.collection('actions')
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .get();

    const actions = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      actions.push(serializeAction(doc.id, data));
    });

    console.log('✅ TOTAL ACTIONS:', actions.length);
    return res.json(actions);

  } catch (err) {
    console.error('❌ ERROR GET USER ACTIONS:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ================= GET USER STATS =================
exports.getUserStats = async (req, res) => {
  const { id } = req.params;
  try {
    console.log('=== GET USER STATS:', id);

    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    const user = userDoc.data();

    const snapshot = await db.collection('actions').where('user_id', '==', id).get();
    const actions = [];
    snapshot.forEach(doc => actions.push(doc.data()));

    const approved = actions.filter(a => a.status === 'approved').length;
    const pending = actions.filter(a => a.status === 'pending').length;
    const rejected = actions.filter(a => a.status === 'rejected').length;

    const stats = {
      totalPoints: user.points || 0,
      totalActions: actions.length,
      approved,
      pending,
      rejected
    };

    console.log('✅ USER STATS:', stats);
    return res.json(stats);
  } catch (err) {
    console.error('❌ ERROR STATS:', err);
    return res.status(500).json({ message: 'Gagal ambil stats user' });
  }
};

// ================= GET USER PROFILE =================
exports.getUserProfile = async (req, res) => {
  const { id } = req.params;
  try {
    console.log('=== GET USER PROFILE:', id);

    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    const user = userDoc.data();

    const actSnap = await db.collection('actions').where('user_id', '==', id).get();
    const actions = [];
    actSnap.forEach(doc => actions.push(doc.data()));
    
    const approved = actions.filter(a => a.status === 'approved').length;
    const pending = actions.filter(a => a.status === 'pending').length;
    const rejected = actions.filter(a => a.status === 'rejected').length;

    // Hitung ranking
    const rankSnap = await db.collection('users')
      .where('role', '==', 'user')
      .where('monthly_points', '>', user.monthly_points || 0)
      .get();
    const ranking = rankSnap.size + 1;

    const medals = user.medal ? user.medal.split(',').map(m => m.trim()).filter(Boolean) : [];

    const profile = {
      id: id,
      name: user.name || '',
      email: user.email || '',
      points: user.points || 0,
      monthlyPoints: user.monthly_points || 0,
      level: user.level || 'Eco-Newbie',
      medals,
      ranking,
      approved,
      rejected,
      pending,
      totalActions: actions.length
    };

    console.log('✅ USER PROFILE:', profile.name);
    return res.json(profile);

  } catch (err) {
    console.error('❌ ERROR USER PROFILE:', err);
    return res.status(500).json({ message: 'Gagal ambil profil user' });
  }
};