const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI;
console.log('Connecting to:', mongoUri);

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('Connected.');
    
    // Define schema inline to avoid imports if they are tricky
    const userSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.model('User', userSchema, 'users');
    const UserConfig = mongoose.model('UserConfig', userSchema, 'userconfigs');
    
    const users = await User.find({});
    console.log('--- Users ---');
    console.log(users.map(u => ({
      _id: u._id,
      mailId: u.mailId,
      displayName: u.displayName,
      accountType: u.accountType,
      isVerified: u.isVerified,
      accessPinHash: u.accessPinHash
    })));
    
    const configs = await UserConfig.find({ id: 'single_user' });
    console.log('--- UserConfigs (single_user) ---');
    console.log(configs.map(c => ({
      id: c.id,
      hasAdminPasswordHash: !!c.data?.admin_password_hash,
      adminPasswordHash: c.data?.admin_password_hash
    })));
    
    await mongoose.disconnect();
    console.log('Disconnected.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
