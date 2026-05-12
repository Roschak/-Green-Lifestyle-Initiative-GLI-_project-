// backend/scripts/repair_articles_fields.js
// Non-destructive repair for `articles` collection:
// - Replace 'undefined'/'null'/empty strings with safe defaults only for missing/problematic fields
// - Do not overwrite existing valid values

const db = require('../config/db');

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=500&fit=crop';
const DEFAULT_THUMB = 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=300&h=200&fit=crop';
const DEFAULT_TITLE = 'Untitled';
const DEFAULT_SUMMARY = 'Tidak ada deskripsi.';

function isBadValue(v) {
  if (v === undefined || v === null) return true;
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase();
    if (s === '' || s === 'undefined' || s === 'null') return true;
  }
  return false;
}

(async function main(){
  try{
    const snap = await db.collection('articles').get();
    console.log('Found', snap.size, 'articles');

    let updated = 0;
    const updatesLog = [];

    const docs = [];
    snap.forEach(d=> docs.push({id:d.id, data:d.data()}));

    for (const doc of docs) {
      const id = doc.id;
      const data = doc.data;
      const changes = {};

      // title
      if (isBadValue(data.title)) changes.title = DEFAULT_TITLE;

      // summary or excerpt
      if (isBadValue(data.summary) && !isBadValue(data.content)) {
        changes.summary = data.content.slice(0,120) || DEFAULT_SUMMARY;
      } else if (isBadValue(data.summary)) {
        changes.summary = DEFAULT_SUMMARY;
      }

      // image and thumbnail
      const imageKeys = ['image','img','photo','photo_url','thumbnail'];
      let imageSet = false;
      for (const k of imageKeys) {
        if (k in data && isBadValue(data[k])) {
          // for thumbnail prefer DEFAULT_THUMB
          if (k === 'thumbnail') changes[k] = DEFAULT_THUMB;
          else changes[k] = DEFAULT_IMAGE;
          imageSet = true;
        }
      }

      if (Object.keys(changes).length > 0) {
        await db.collection('articles').doc(id).update(changes);
        updated++;
        updatesLog.push({id, changes});
        console.log('Updated', id, changes);
      }
    }

    console.log('Done. updated =', updated);
    if (updated>0) console.log('Updated docs:', JSON.stringify(updatesLog,null,2));
    process.exit(0);
  }catch(err){
    console.error(err);
    process.exit(1);
  }
})();
