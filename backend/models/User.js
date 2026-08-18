const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    mailId: { type: String, required: true, unique: true, trim: true, lowercase: true },
    displayName: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
    accessPinHash: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    lastLogin: { type: Date },
    lastDevice: { type: String },
    accountType: { type: String, enum: ['admin', 'user'], default: 'user' },
    isActive: { type: Boolean, default: true },
    failedAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
