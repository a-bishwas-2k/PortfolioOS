const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Allow large payloads for base64 images

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// MongoDB Connection with fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolioos';
let isDbConnected = false;

console.log('[Backend] Connecting to MongoDB at:', MONGO_URI);
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('[Backend] Successfully connected to MongoDB.');
    isDbConnected = true;
})
.catch(err => {
    console.error('[Backend] MongoDB connection failed. Running in static/localStorage fallback mode.');
    console.error(err.message);
});

// Schema definition for the USER portfolio state
const UserSchema = new mongoose.Schema({
    id: { type: String, default: 'single_user' },
    data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

const UserConfig = mongoose.model('UserConfig', UserSchema);

// In-memory fallback in case DB is disconnected
let memoryUserCache = null;

// Route: GET current USER configuration
app.get('/api/user', async (req, res) => {
    try {
        if (isDbConnected) {
            const config = await UserConfig.findOne({ id: 'single_user' });
            if (config) {
                return res.json({ success: true, db: true, user: config.data });
            }
        }
        
        if (memoryUserCache) {
            return res.json({ success: true, db: false, cache: true, user: memoryUserCache });
        }
        
        return res.json({ success: true, db: isDbConnected, user: null, msg: 'No saved configuration found' });
    } catch (err) {
        console.error('[Backend] GET /api/user error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route: POST update USER configuration
app.post('/api/user', async (req, res) => {
    try {
        const { user } = req.body;
        if (!user) {
            return res.status(400).json({ success: false, error: 'No user data provided' });
        }

        // Basic security header check: x-admin-password (default: "2130")
        const passwordHeader = req.headers['x-admin-password'];
        if (!passwordHeader) {
            return res.status(401).json({ success: false, error: 'Authorization password required' });
        }
        // In full-stack mode, password must match 2130 or the stored USER password
        const expectedPassword = "2130";
        if (passwordHeader !== expectedPassword && passwordHeader !== String(user.admin_password || '')) {
            return res.status(403).json({ success: false, error: 'Invalid admin password' });
        }

        memoryUserCache = user;

        if (isDbConnected) {
            const updated = await UserConfig.findOneAndUpdate(
                { id: 'single_user' },
                { data: user },
                { upsert: true, new: true }
            );
            return res.json({ success: true, db: true, user: updated.data });
        }

        return res.json({ success: true, db: false, cache: true, user, msg: 'Saved to server memory cache (MongoDB offline)' });
    } catch (err) {
        console.error('[Backend] POST /api/user error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route: status check
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        database: isDbConnected ? 'connected' : 'offline',
        port: PORT,
        uptime: process.uptime()
    });
});

// Fallback to serving index.html for single page app routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`[Backend] PortfolioOS server running at http://localhost:${PORT}`);
});
