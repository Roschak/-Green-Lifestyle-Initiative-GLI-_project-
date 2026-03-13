/** * Komentar: Ragah, ini file Seeder (Pengisi Data Otomatis).
 * Gunanya agar database "gli-project-web" langsung ada isinya.
 */
require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'gli-project-web'
});

async function runSeeder() {
    try {
        console.log("⏳ Menghubungkan ke Laragon untuk isi data...");

        // Buat password dummy (admin123)
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash('admin123', salt);

        // Data yang akan dimasukkan (Kamu sebagai Admin)
        const values = [
            'Ragah Admin', 
            'ragah@gli.com', 
            hashedPass, 
            'admin', 
            1000, 
            'Eco-Master'
        ];

        const sql = `INSERT IGNORE INTO users (name, email, password, role, points, level) VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(sql, values, (err, result) => {
            if (err) throw err;
            if (result.affectedRows > 0) {
                console.log("✅ Berhasil! Akun Admin Ragah sudah masuk ke database.");
            } else {
                console.log("ℹ️ Akun sudah ada, tidak perlu ditambah lagi.");
            }
            process.exit(); 
        });

    } catch (error) {
        console.error("❌ Seeder Gagal:", error);
        process.exit(1);
    }
}

runSeeder();