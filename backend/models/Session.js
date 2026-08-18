const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    mailId: { type: String },
    isAdmin: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);
