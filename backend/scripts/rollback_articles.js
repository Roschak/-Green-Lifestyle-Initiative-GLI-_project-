// backend/scripts/rollback_articles.js
// Rollback articles to original state:
// 1. Delete the 4 seeded articles
// 2. Reset the one original article back to null/empty

const db = require('../config/db');

const SEEDED_IDS = [
  '7vob19BSU6HBEpZKvA8V',  // Manfaat Menanam Pohon
  'OBGIRmqPH0BV0ZwJBxfY',  // Hemat Air
  'eTwb4S7pzic12epBOUNM',  // Cara Menghemat Energi
  'evUsAVz0dMmI0FJOKOOJ',  // Daur Ulang
];

const ORIGINAL_ARTICLE = 'cgKQkMzl4oRq0Oy1vldi';  // testartickle3

(async function main() {
  try {
    console.log('🔄 Rollback articles to original state...');

    // Delete seeded articles
    for (const id of SEEDED_IDS) {
      await db.collection('articles').doc(id).delete();
      console.log('❌ Deleted seeded article:', id);
    }

    // Reset original article image/thumbnail to null
    await db.collection('articles').doc(ORIGINAL_ARTICLE).update({
      image: null,
      thumbnail: null,
      summary: 'testartickle3testartickle3testartickle3testartickle3',
    });
    console.log('🔄 Reset original article to null:', ORIGINAL_ARTICLE);

    console.log('✅ Rollback complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
})();
