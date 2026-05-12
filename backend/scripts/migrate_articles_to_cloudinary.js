// backend/scripts/migrate_articles_to_cloudinary.js
// Run with: node migrate_articles_to_cloudinary.js

const db = require('../config/db');
const admin = require('firebase-admin');

(async function main() {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dmgypsno6';
    console.log('Cloudinary cloud name:', cloudName);

    const snapshot = await db.collection('articles').get();
    console.log('Found', snapshot.size, 'articles');

    let updated = 0;
    let skipped = 0;
    let cleared = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const id = doc.id;
      const fields = ['img', 'image', 'thumbnail'];
      const updates = {};

      for (const f of fields) {
        const raw = data[f];
        if (raw === undefined || raw === null) continue;
        const s = String(raw).trim();
        if (!s) continue;

        // If already a full http url and not cloudinary 'undefined', keep
        if (s.startsWith('http')) {
          if (s.includes('/upload/undefined')) {
            updates[f] = null;
            cleared++;
          } else {
            // leave as-is
          }
          continue;
        }

        // If it looks like a Cloudinary public id path stored as '/uploads/gli_actions/<publicId>'
        if (s.includes('/uploads/gli_actions/')) {
          const publicId = s.split('/uploads/gli_actions/')[1].replace(/^\/+/, '');
          if (!publicId || publicId === 'undefined' || publicId === 'null') {
            updates[f] = null;
            cleared++;
          } else {
            updates[f] = `https://res.cloudinary.com/${cloudName}/image/upload/gli_actions/${publicId}`;
            updated++;
          }
          continue;
        }

        // If contains 'undefined' or is literally 'undefined'
        if (s === 'undefined' || s === 'null' || s.includes('undefined')) {
          updates[f] = null;
          cleared++;
          continue;
        }

        // Otherwise if looks like a relative uploads path
        const uploadsIndex = s.lastIndexOf('/uploads/');
        if (uploadsIndex >= 0) {
          updates[f] = `${s.slice(uploadsIndex)}`; // leave relative (frontend will resolve)
          skipped++;
          continue;
        }

        // Otherwise leave as-is
        skipped++;
      }

      if (Object.keys(updates).length > 0) {
        await doc.ref.update(updates);
        console.log('Updated', id, updates);
      }
    }

    console.log('Done. updated=', updated, 'cleared=', cleared, 'skipped=', skipped);
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(2);
  }
})();
