// backend/scripts/fill_default_article_images.js
// Set default image/thumbnail for articles missing them (non-destructive)

const db = require('../config/db');
const admin = require('firebase-admin');

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=500&fit=crop';
const DEFAULT_THUMB = 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=300&h=200&fit=crop';

(async function main() {
  try {
    const snap = await db.collection('articles').get();
    console.log('Found', snap.size, 'articles');

    let updated = 0;
    snap.forEach(async (doc) => {
      const data = doc.data();
      const id = doc.id;
      const image = data.image;
      const thumbnail = data.thumbnail;

      const needsImage = (!image || (typeof image === 'string' && !image.trim()));
      const needsThumb = (!thumbnail || (typeof thumbnail === 'string' && !thumbnail.trim()));

      const updates = {};
      if (needsImage) updates.image = DEFAULT_IMAGE;
      if (needsThumb) updates.thumbnail = DEFAULT_THUMB;

      if (Object.keys(updates).length > 0) {
        await db.collection('articles').doc(id).update(updates);
        console.log('Updated', id, updates);
        updated++;
      }
    });

    // Wait briefly to allow updates to finish
    setTimeout(() => {
      console.log('Done. updated =', updated);
      process.exit(0);
    }, 1500);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
