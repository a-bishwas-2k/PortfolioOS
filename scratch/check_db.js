const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  const User = require('../models/User');
  
  const users = await User.find({});
  console.log('All Users in DB:');
  users.forEach(u => {
    console.log({
      id: u._id,
      mailId: u.mailId,
      displayName: u.displayName,
      accountType: u.accountType,
      accessPinHash: u.accessPinHash,
      failedAttempts: u.failedAttempts,
      lockedUntil: u.lockedUntil
    });
  });

  const configs = await mongoose.connection.collection('userconfigs').find({}).toArray();
  console.log('\nAll UserConfigs in DB:');
  configs.forEach(c => {
    console.log({
      id: c.id,
      admin_password_hash: c.data?.admin_password_hash,
      keys: Object.keys(c.data || {})
    });
  });

  await mongoose.disconnect();
}

check().catch(console.error);
