// POST to /api/auth/send-reset using node fetch
const fetch = global.fetch || require('node-fetch');

async function main() {
  const email = process.argv[2];
  if (!email) return console.error('Usage: node post_reset.js <email>');

  try {
    const res = await fetch('http://localhost:5000/api/auth/send-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const text = await res.text();
    console.log('STATUS', res.status);
    console.log(text);
  } catch (err) {
    console.error('ERROR', err);
  }
}

main();
