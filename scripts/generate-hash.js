/**
 * Helper utility to generate a secure bcrypt password hash for ADMIN_PASSWORD_HASH.
 *
 * Usage:
 *   node scripts/generate-hash.js "your-secure-password"
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Error: Please provide a password as an argument.');
  console.error('Example: node scripts/generate-hash.js "MySecurePass123!"');
  process.exit(1);
}

bcrypt.genSalt(10, (err, salt) => {
  if (err) {
    console.error('Error generating salt:', err);
    process.exit(1);
  }
  bcrypt.hash(password, salt, (err, hash) => {
    if (err) {
      console.error('Error generating hash:', err);
      process.exit(1);
    }
    console.log('\n========================================');
    console.log('Bcrypt Password Hash:');
    console.log(hash);
    console.log('========================================');
    console.log('Copy this hash to your .env.local as:');
    console.log(`ADMIN_PASSWORD_HASH="${hash}"\n`);
  });
});
