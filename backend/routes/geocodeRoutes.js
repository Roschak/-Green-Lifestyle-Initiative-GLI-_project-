const express = require('express');
const router = express.Router();

// Simple in-memory cache to reduce repeat requests (key -> { ts, data })
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

const buildCacheKey = (prefix, params) => `${prefix}:${Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')}`;

const forwardFetch = async (url) => {
  const headers = {
    'User-Agent': process.env.NOMINATIM_USER_AGENT || 'GLI-Project-Web/1.0 (contact@example.com)'
  };
  
  await new Promise(resolve => setTimeout(resolve, 100));
  
  try {
    const res = await fetch(url, { headers });
    
    if (!res.ok) {
      const errText = await res.text();
      console.error(`Nominatim error ${res.status}:`, errText.substring(0, 100));
      return [];
    }
    
    const text = await res.text();
    if (!text) return [];
    
    try {
      const data = JSON.parse(text);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.warn('JSON parse error, returning empty array');
      return [];
    }
  } catch (err) {
    console.error('❌ forwardFetch error:', err.message);
    return [];
  }
};

// Reverse geocode proxy
router.get('/reverse', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ success: false, message: 'lat and lon required' });

    const key = buildCacheKey('reverse', { lat, lon });
    const cached = cache.get(key);
    if (cached && (Date.now() - cached.ts) < CACHE_TTL_MS) {
      return res.json(cached.data);
    }

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&zoom=18&addressdetails=1&accept-language=id`;
    const data = await forwardFetch(url);

    cache.set(key, { ts: Date.now(), data });
    res.json(data);
  } catch (err) {
    console.error('Geocode reverse error:', err.message || err);
    res.status(502).json({ success: false, message: 'Geocoding service error' });
  }
});

// Search proxy
router.get('/search', async (req, res) => {
  try {
    const { q, countrycodes } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'q required' });

    const key = buildCacheKey('search', { q, countrycodes: countrycodes || '' });
    const cached = cache.get(key);
    if (cached && (Date.now() - cached.ts) < CACHE_TTL_MS) {
      return res.json(cached.data);
    }

    let url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}&addressdetails=1&dedupe=1&limit=8&accept-language=id`;
    if (countrycodes) {
      url += `&countrycodes=${encodeURIComponent(countrycodes)}`;
    }
    console.log('🔍 Geocode search for:', q, 'url:', url.substring(0, 100));
    const data = await forwardFetch(url);
    console.log('✅ Got', Array.isArray(data) ? data.length + ' items' : 'no items');
    cache.set(key, { ts: Date.now(), data });
    res.json(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('❌ Search error:', err.message);
    res.json([]);
  }
});

module.exports = router;
