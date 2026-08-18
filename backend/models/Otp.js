const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    mailId: { type: String, required: true, trim: true, lowercase: true },
    otpHash: { type: String, required: true },
    purpose: { type: String, required: true, enum: ['register', 'login', 'reset_pin', 'sensitive_action', 'change_email_old', 'change_email_new', 'change_pin', 'erase_data'] },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    isUsed: { type: Boolean, default: false }
}, { timestamps: true });

// TTL index to automatically remove documents 5 minutes after expiresAt
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model('Otp', OtpSchema);
