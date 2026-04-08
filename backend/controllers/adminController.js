// controllers/adminController.js
const db = require('../config/db');

// Helper format tanggal dd/mm
const ddmm = (date) => {
    const d = date instanceof Date ? date : date.toDate?.() || new Date(date);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
};

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

// ================= DASHBOARD STATS =================
exports.getDashboardStats = async (req, res) => {
    try {
        console.log('=== GET DASHBOARD STATS ===');
        
        const now          = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear  = now.getFullYear();

        // ── Reset bulanan monthly_points ──────────────────────────────────
        const usersSnap = await db.collection('users').where('role', '==', 'user').get();
        const batch     = db.batch();
        let   needCommit = false;

        usersSnap.docs.forEach(doc => {
            const data      = doc.data();
            const lastReset = data.last_reset ? data.last_reset.toDate() : null;
            const sameMonth = lastReset &&
                lastReset.getMonth() + 1 === currentMonth &&
                lastReset.getFullYear()   === currentYear;

            if (!sameMonth) {
                batch.update(doc.ref, { monthly_points: 0, last_reset: now });
                needCommit = true;
            }
        });
        if (needCommit) await batch.commit();

        // ── Basic stats ─────────────────────────────────────────────────��─
        const totalUsers  = usersSnap.size;
        const actSnap     = await db.collection('actions').get();
        const actions     = actSnap.docs.map(d => d.data());
        const pending     = actions.filter(a => a.status === 'pending').length;
        const rejected    = actions.filter(a => a.status === 'rejected').length;
        const approved    = actions.filter(a => a.status === 'approved').length;
        const onlineSnap  = await db.collection('users').where('status', '==', 'online').get();
        const onlineUsers = onlineSnap.size;

        // ── Top leaderboard ───────────────────────────────────────────────
        const topSnap = await db.collection('users')
            .where('role', '==', 'user')
            .orderBy('monthly_points', 'desc')
            .limit(1)
            .get();
        const topUser = topSnap.empty ? null : { ...topSnap.docs[0].data() };

        // ── Chart data (7 hari terakhir) ──────────────────────────────────
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const chartSnap = await db.collection('actions')
            .where('created_at', '>=', sevenDaysAgo)
            .get();

        // Group by date
        const dateMap = {};
        chartSnap.docs.forEach(doc => {
            const createdAt = doc.data().created_at;
            const d = createdAt ? (createdAt.toDate ? createdAt.toDate() : new Date(createdAt)) : now;
            const key  = ddmm(d);
            const raw  = d.toISOString().split('T')[0];
            if (!dateMap[key]) dateMap[key] = { name: key, rawDate: raw, value: 0 };
            dateMap[key].value++;
        });
        const chartData = Object.values(dateMap).sort((a, b) => a.rawDate.localeCompare(b.rawDate));

        // ── Recent pending actions (limit 5) ──────────────────────────────
        const recentSnap = await db.collection('actions')
            .where('status', '==', 'pending')
            .orderBy('created_at', 'desc')
            .limit(5)
            .get();

        // Ambil nama user untuk setiap action
        const recent = await Promise.all(recentSnap.docs.map(async doc => {
            const action   = serializeAction(doc.id, doc.data());
            try {
                const userDoc  = await db.collection('users').doc(action.user_id).get();
                action.user_name = userDoc.exists ? userDoc.data().name : 'Unknown';
            } catch (err) {
                action.user_name = 'Unknown';
            }
            return action;
        }));

        const response = {
            totalUsers,
            pending,
            rejected,
            approved,
            onlineUsers,
            topLeaderboard: topUser ? topUser.name           : 'Belum Ada',
            topPoints:      topUser ? topUser.monthly_points : 0,
            currentSeason:  now.toLocaleString('id-ID', { month: 'long', year: 'numeric' }),
            chartData,
            recent
        };

        console.log('✅ DASHBOARD STATS:', response);
        return res.json(response);

    } catch (err) {
        console.error('❌ ERROR DASHBOARD:', err);
        return res.status(500).json({ success: false, message: 'Gagal ambil statistik', error: err.message });
    }
};

// ================= ADMIN PROFILE STATS =================
exports.getAdminStats = async (req, res) => {
    try {
        console.log('=== GET ADMIN STATS ===');
        
        const actSnap    = await db.collection('actions').get();
        const actions    = actSnap.docs.map(d => d.data());
        const approved   = actions.filter(a => a.status === 'approved').length;
        const rejected   = actions.filter(a => a.status === 'rejected').length;
        const pending    = actions.filter(a => a.status === 'pending').length;

        const userSnap   = await db.collection('users').where('role', '==', 'user').get();
        const onlineSnap = await db.collection('users').where('status', '==', 'online').get();

        const response = {
            totalVerified: approved + rejected,
            approved,
            rejected,
            pending,
            totalUsers:  userSnap.size,
            onlineUsers: onlineSnap.size
        };

        console.log('✅ ADMIN STATS:', response);
        return res.json(response);
    } catch (err) {
        console.error('❌ ERROR ADMIN STATS:', err);
        return res.status(500).json({ success: false, message: 'Gagal ambil statistik admin', error: err.message });
    }
};

// ================= GET ALL USERS =================
exports.getUsers = async (req, res) => {
    try {
        console.log('=== GET ALL USERS ===');
        
        const snap  = await db.collection('users').where('role', '==', 'user').get();
        const users = snap.docs.map(doc => ({ 
          id: doc.id, 
          name: doc.data().name || '',
          email: doc.data().email || '',
          phone: doc.data().phone || '',
          level: doc.data().level || 'Eco-Newbie',
          medal: doc.data().medal || '',
          points: doc.data().points || 0,
          monthly_points: doc.data().monthly_points || 0,
          status: doc.data().status || 'offline',
          created_at: doc.data().created_at
        }));
        
        // Urutkan by monthly_points desc
        users.sort((a, b) => (b.monthly_points || 0) - (a.monthly_points || 0));
        
        console.log(`✅ TOTAL USERS: ${users.length}`);
        return res.json(users);
    } catch (err) {
        console.error('❌ ERROR GET USERS:', err);
        return res.status(500).json({ success: false, message: 'Gagal mengambil data user', error: err.message });
    }
};

// ================= GET USER DETAIL =================
exports.getUserDetail = async (req, res) => {
    const { id } = req.params;
    try {
        console.log('=== GET USER DETAIL:', id);
        
        const userDoc = await db.collection('users').doc(id).get();
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }
        
        const user = { 
          id: userDoc.id, 
          ...userDoc.data(),
          name: userDoc.data().name || '',
          email: userDoc.data().email || '',
          phone: userDoc.data().phone || '',
          level: userDoc.data().level || 'Eco-Newbie',
          medal: userDoc.data().medal || '',
          points: userDoc.data().points || 0,
          monthly_points: userDoc.data().monthly_points || 0
        };

        // Total approved actions
        const actSnap = await db.collection('actions')
            .where('user_id', '==', id)
            .where('status', '==', 'approved')
            .get();
        user.total_actions = actSnap.size;

        // All actions
        const allActSnap = await db.collection('actions')
            .where('user_id', '==', id)
            .get();
        user.all_actions = allActSnap.size;

        // Ranking
        const rankSnap = await db.collection('users')
            .where('role', '==', 'user')
            .where('monthly_points', '>', user.monthly_points || 0)
            .get();
        user.ranking = rankSnap.size + 1;

        console.log('✅ USER DETAIL:', user.name);
        return res.status(200).json(user);
    } catch (err) {
        console.error('❌ ERROR DETAIL:', err.message);
        return res.status(500).json({ success: false, message: 'Gagal mengambil detail user', error: err.message });
    }
};

// ================= VERIFY ACTION =================
exports.verifyAction = async (req, res) => {
  const { id } = req.params;
  const { status, points_earned, admin_note, rejection_reason } = req.body;

  console.log(`=== VERIFY ACTION ID: ${id} === STATUS: ${status}, POINTS: ${points_earned}`);

  try {
    const actionRef = db.collection('actions').doc(id);
    const actionDoc = await actionRef.get();
    
    if (!actionDoc.exists) {
      console.log('❌ ACTION NOT FOUND:', id);
      return res.status(404).json({ success: false, message: 'Aksi tidak ditemukan' });
    }

    const actionData = actionDoc.data();
    const userId = actionData.user_id;

    // Update action
    const updateData = { 
      status: status || 'pending',
      admin_note: admin_note || '',
      updated_at: new Date()
    };
    
    if (status === 'approved') {
      updateData.points_earned = Number(points_earned) || 0;
    }
    
    if (status === 'rejected' && rejection_reason) {
      updateData.rejection_reason = rejection_reason;
    }
    
    await actionRef.update(updateData);
    console.log('✅ ACTION UPDATED:', status);

    // Tambah poin jika approved
    if (status === 'approved' && Number(points_earned) > 0) {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (userDoc.exists) {
        const userData = userDoc.data();
        const currentPoints = userData.points || 0;
        const currentMonthly = userData.monthly_points || 0;
        
        await userRef.update({
          points: currentPoints + Number(points_earned),
          monthly_points: currentMonthly + Number(points_earned),
          last_reset: userData.last_reset || new Date(),
          updated_at: new Date()
        });
        
        console.log(`✅ POIN +${points_earned} ke user ID: ${userId}`);
      }
    }

    return res.json({ 
      success: true, 
      message: `Aksi berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}` 
    });

  } catch (err) {
    console.error('❌ ERROR VERIFY:', err);
    return res.status(500).json({ success: false, message: 'Gagal verifikasi', error: err.message });
  }
};

// ================= LEADERBOARD =================
exports.getLeaderboard = async (req, res) => {
    try {
        console.log('=== GET LEADERBOARD ===');
        
        const snap  = await db.collection('users')
            .where('role', '==', 'user')
            .orderBy('monthly_points', 'desc')
            .limit(10)
            .get();

        const data = snap.docs.map(doc => ({
            id:     doc.id,
            name:   doc.data().name || '',
            points: doc.data().monthly_points || 0,
            medal:  doc.data().medal || '',
            level:  doc.data().level || 'Eco-Newbie'
        }));

        const response = {
            period: new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' }),
            data
        };

        console.log('✅ LEADERBOARD:', response);
        return res.json(response);
    } catch (err) {
        console.error('❌ ERROR LEADERBOARD:', err);
        return res.status(500).json({ success: false, message: 'Gagal ambil leaderboard', error: err.message });
    }
};

// ================= GET ALL ACTIONS =================
exports.getAllActions = async (req, res) => {
    try {
        console.log('=== GET ALL ACTIONS ===');
        
        const snap    = await db.collection('actions').orderBy('created_at', 'desc').get();
        const actions = await Promise.all(snap.docs.map(async doc => {
            const action  = serializeAction(doc.id, doc.data());
            try {
                const userDoc = await db.collection('users').doc(action.user_id).get();
                action.user_name = userDoc.exists ? userDoc.data().name : 'Unknown';
            } catch (err) {
                action.user_name = 'Unknown';
            }
            return action;
        }));

        console.log(`✅ TOTAL ACTIONS: ${actions.length}`);
        return res.json(actions);
    } catch (err) {
        console.error('❌ ERROR GET ALL ACTIONS:', err);
        return res.status(500).json({ success: false, message: 'Gagal ambil data actions', error: err.message });
    }
};