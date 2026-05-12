// backend/scripts/seed_articles_with_images.js
// Creates sample articles with image URLs for testing

const db = require('../config/db');
const admin = require('firebase-admin');

const sampleArticles = [
  {
    title: 'Cara Menghemat Energi di Rumah',
    description: 'Tips praktis untuk mengurangi penggunaan energi listrik dan biaya tagihan bulanan Anda.',
    content: '<h2>Menghemat Energi Dimulai dari Rumah</h2><p>Energi adalah sumber daya yang berharga. Berikut adalah cara-cara mudah untuk menghemat energi di rumah Anda:</p><ol><li>Gunakan lampu LED</li><li>Matikan perangkat elektronik yang tidak digunakan</li><li>Gunakan AC secara efisien</li><li>Perbaiki kerusakan pada isolasi rumah</li></ol>',
    category: 'tips',
    featured: true,
    status: 'published',
    image: 'https://images.unsplash.com/photo-1508444806084-d228d0f3f1bc?w=600&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1508444806084-d228d0f3f1bc?w=200&h=200&fit=crop'
  },
  {
    title: 'Manfaat Menanam Pohon untuk Lingkungan',
    description: 'Pohon adalah paru-paru planet kita. Ketahui mengapa menanam pohon sangat penting.',
    content: '<h2>Mengapa Menanam Pohon?</h2><p>Pohon memberikan banyak manfaat bagi lingkungan dan kehidupan kita:</p><ul><li>Mengurangi polusi udara</li><li>Menyimpan air hujan</li><li>Memberikan habitat untuk satwa liar</li><li>Mengatur iklim lokal</li></ul>',
    category: 'berita',
    featured: true,
    status: 'published',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop'
  },
  {
    title: 'Daur Ulang: Limbah Menjadi Berkah',
    description: 'Pelajari bagaimana limbah dapat diubah menjadi produk berharga melalui daur ulang.',
    content: '<h2>Daur Ulang untuk Masa Depan</h2><p>Daur ulang adalah cara terbaik untuk mengurangi sampah dan melindungi lingkungan. Dengan mendaur ulang, kita dapat:</p><ul><li>Mengurangi volume sampah di TPA</li><li>Menghemat sumber daya alam</li><li>Menciptakan lapangan kerja baru</li><li>Menghemat energi</li></ul>',
    category: 'tips',
    featured: false,
    status: 'published',
    image: 'https://images.unsplash.com/photo-1532996122724-8f3c2cd83c5d?w=600&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1532996122724-8f3c2cd83c5d?w=200&h=200&fit=crop'
  },
  {
    title: 'Hemat Air: Setiap Tetes Berharga',
    description: 'Air adalah kehidupan. Temukan cara praktis untuk menghemat air di kehidupan sehari-hari.',
    content: '<h2>Pentingnya Menghemat Air</h2><p>Air bersih semakin langka. Mari kita hemat air dengan cara:</p><ol><li>Matikan keran saat sikat gigi</li><li>Gunakan shower daripada mandi air hangat</li><li>Perbaiki kebocoran</li><li>Gunakan air bekas cuci untuk menyiram tanaman</li></ol>',
    category: 'tips',
    featured: true,
    status: 'published',
    image: 'https://images.unsplash.com/photo-1559028615-cd4628902d4a?w=600&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1559028615-cd4628902d4a?w=200&h=200&fit=crop'
  }
];

(async function main() {
  try {
    const adminUser = await db.collection('users')
      .where('role', '==', 'admin')
      .limit(1)
      .get();

    if (adminUser.empty) {
      console.error('❌ No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    const admin_id = adminUser.docs[0].id;
    const admin_data = adminUser.docs[0].data();

    console.log(`✅ Using admin: ${admin_data.name} (${admin_id})`);

    let created = 0;
    for (const article of sampleArticles) {
      const existingArticle = await db.collection('articles')
        .where('title', '==', article.title)
        .limit(1)
        .get();

      if (!existingArticle.empty) {
        console.log(`⏭️  Skipping "${article.title}" - already exists`);
        continue;
      }

      await db.collection('articles').add({
        ...article,
        author_id: admin_id,
        author_name: admin_data.name,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
        views: 0
      });

      console.log(`✅ Created article: "${article.title}"`);
      created++;
    }

    console.log(`\n✅ Done! Created ${created} articles with images.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
})();
