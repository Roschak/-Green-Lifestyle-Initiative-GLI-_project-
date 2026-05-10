// One-off script to generate Firebase password reset link for testing
// Usage: node scripts/gen_reset_link.js user@example.com

const path = require('path');
// Ensure backend config initializes Firebase Admin
try {
  require('../config/db');
} catch (e) {
  // continue; config/db logs errors
}

const admin = require('firebase-admin');

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node scripts/gen_reset_link.js <email>');
    process.exit(1);
  }

  try {
    console.log('Generating password reset link for:', email);
    const actionCodeSettings = {
      url: process.env.FRONTEND_URL || 'http://localhost:5173/login',
      handleCodeInApp: false
    };

    const link = await admin.auth().generatePasswordResetLink(email, actionCodeSettings);
    console.log('SUCCESS_LINK:' + link);
  } catch (err) {
    console.error('ERROR:', err.code || err.message || err);
    process.exit(2);
  }
}

main();
