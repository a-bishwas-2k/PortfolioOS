const bcrypt = require('bcryptjs');

const hash = '$2b$10$87wtum5z1t7fWLmZWeoNQes9wdf4cICBdZ0cLmH41Y6I9XMkiuDUG';

async function run() {
  const pin1 = '3421';
  const match1 = await bcrypt.compare(pin1, hash);
  console.log(`Pin: ${pin1}, Match: ${match1}`);

  const pin2 = 'admin';
  const match2 = await bcrypt.compare(pin2, hash);
  console.log(`Pin: ${pin2}, Match: ${match2}`);

  const pin3 = '1234';
  const match3 = await bcrypt.compare(pin3, hash);
  console.log(`Pin: ${pin3}, Match: ${match3}`);

  const pin4 = '0000';
  const match4 = await bcrypt.compare(pin4, hash);
  console.log(`Pin: ${pin4}, Match: ${match4}`);
}

run().catch(console.error);
