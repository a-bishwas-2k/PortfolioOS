const bcrypt = require('bcryptjs');

const hashes = {
  'admin': '$2b$10$87wtum5z1t7fWLmZWeoNQes9wdf4cICBdZ0cLmH41Y6I9XMkiuDUG',
  'abhishek': '$2b$10$V3YV.PPhHozvyyyxQUApNeeTDWloEHifX7j59xrBCHz0clC7Hk0km',
  'watcher': '$2b$10$1zJ4NuZiul1H6P8fb9N1.egLBxtFFiBvZLgLoMbx7LnwJGIQh4jD2'
};

async function crack() {
  console.log('Testing 4-digit PINs (0000-9999)...');
  for (let i = 0; i <= 9999; i++) {
    const pin = i.toString().padStart(4, '0');
    for (const [name, hash] of Object.entries(hashes)) {
      const match = await bcrypt.compare(pin, hash);
      if (match) {
        console.log(`FOUND! ${name} PIN is: ${pin}`);
      }
    }
  }
  
  // Also try 6-digit PINs if not found, or other passwords?
  const common = ['admin', 'password', '123456', '12345678', 'admin123'];
  for (const word of common) {
    for (const [name, hash] of Object.entries(hashes)) {
      const match = await bcrypt.compare(word, hash);
      if (match) {
        console.log(`FOUND! ${name} password is: ${word}`);
      }
    }
  }
  console.log('Done.');
}

crack();
