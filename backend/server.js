require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- KONEKSI DATABASE ---
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'gli-project-web'
});

db.connect((err) => {
    if (err) return console.error('❌ Koneksi Laragon Gagal: ' + err.message);
    console.log('✅ Backend GLI Terhubung ke Laragon');

    // Buat Tabel Users & Actions Otomatis
    db.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255) UNIQUE, password VARCHAR(255), role ENUM('user', 'admin') DEFAULT 'user', points INT DEFAULT 0, level VARCHAR(50) DEFAULT 'Eco-Newbie')`);
    db.query(`CREATE TABLE IF NOT EXISTS actions (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, action_name VARCHAR(255), description TEXT, status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending', points_earned INT DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`);
});

// --- AUTH API ---
// --- BAGIAN REGISTER ---
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validasi input
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Data tidak lengkap" });
        }

        // Cek apakah email sudah ada
        const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email sudah terdaftar!" });
        }

        // Hash password agar aman
        const hashedPassword = await bcrypt.hash(password, 10);

        // DEFAULT ROLE: Semua yang daftar otomatis jadi 'user'
        const role = 'user'; 

        // Simpan ke database
        await db.promise().query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        res.status(201).json({ message: "Registrasi Berhasil! Silakan hubungi Admin untuk akses khusus." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ message: "User tidak ditemukan!" });
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Password salah!" });

        // Pakai JWT_SECRET dari .env
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, name: user.name, role: user.role, points: user.points, level: user.level } });
    });
});

// --- ACTION API ---
app.post('/api/actions/report', (req, res) => {
    const { user_id, action_name, description } = req.body;
    db.query('INSERT INTO actions (user_id, action_name, description) VALUES (?, ?, ?)', [user_id, action_name, description], (err) => {
        if (err) return res.status(500).json({ message: "Gagal kirim laporan" });
        res.status(201).json({ message: "Laporan terkirim!" });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server Aktif di Port ${PORT}`));