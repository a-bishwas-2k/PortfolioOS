const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Otp = require('./models/Otp');
const Session = require('./models/Session');
const { sendOTP } = require('./services/email');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    const _prodOrigin = process.env.PROD_ORIGIN || '';
    const _connectSrc = _prodOrigin
        ? `'self' http://localhost:5000 ${_prodOrigin}`
        : `'self' http://localhost:5000`;
    res.setHeader('Content-Security-Policy',
        `default-src 'self'; ` +
        `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; ` +
        `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ` +
        `font-src 'self' https://fonts.gstatic.com; ` +
        `img-src 'self' data: blob: https:; ` +
        `connect-src ${_connectSrc};`
    );
    res.removeHeader('X-Powered-By');
    next();
});

const PROD_ORIGIN = process.env.PROD_ORIGIN || null;

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return callback(null, true);
        if (PROD_ORIGIN && origin === PROD_ORIGIN) return callback(null, true);
        return callback(new Error('CORS policy violation'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-admin-password', 'x-session-token', 'x-mail-id'],
    credentials: false,
}));

// Rate Limiter
const loginAttempts = new Map();
const MAX_ATTEMPTS = 10;
const LOCK_DURATION_MS = 2 * 60 * 1000;

function rateLimitAuth(req, res, next) {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const record = loginAttempts.get(ip) || { count: 0, lockedUntil: 0 };

    if (record.lockedUntil > 0 && record.lockedUntil <= now) {
        loginAttempts.delete(ip);
        req._authIP = ip;
        return next();
    }

    if (record.lockedUntil > now) {
        const waitSec = Math.ceil((record.lockedUntil - now) / 1000);
        return res.status(429).json({
            success: false,
            lockedOut: true,
            waitSeconds: waitSec,
            error: `Too many failed attempts. Try again in ${waitSec}s.`
        });
    }

    req._authIP = ip;
    next();
}

function recordFailedAttempt(ip) {
    const record = loginAttempts.get(ip) || { count: 0, lockedUntil: 0 };
    record.count += 1;
    if (record.count >= MAX_ATTEMPTS) {
        record.lockedUntil = Date.now() + LOCK_DURATION_MS;
        record.count = 0;
    }
    loginAttempts.set(ip, record);
}

function recordSuccessfulLogin(ip) {
    loginAttempts.delete(ip);
}

// Session Token Store
const activeSessions = new Map();
const SESSION_DURATION_MS = 60 * 60 * 1000;

function generateToken() {
    const arr = new Uint8Array(32);
    for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
    return Buffer.from(arr).toString('hex');
}

function createSession(mailId = null, isAdmin = false) {
    const token = generateToken();
    const effectiveMailId = mailId || 'single_user';
    const expires = Date.now() + SESSION_DURATION_MS;
    activeSessions.set(token, { expires, mailId: effectiveMailId, isAdmin: !!isAdmin });
    if (isDbConnected) {
        Session.create({
            token,
            mailId: effectiveMailId,
            isAdmin: !!isAdmin,
            expiresAt: new Date(expires)
        }).catch(err => console.error('[Session Error]', err.message));
    }
    return token;
}

async function validateSession(token) {
    if (!token) return null;
    let session = activeSessions.get(token);
    if (session) {
        if (session.expires < Date.now()) {
            activeSessions.delete(token);
            if (isDbConnected) Session.deleteOne({ token }).catch(() => {});
            return null;
        }
        session.expires = Date.now() + SESSION_DURATION_MS;
        if (isDbConnected) {
            Session.updateOne({ token }, { expiresAt: new Date(session.expires) }).catch(() => {});
        }
        return session;
    }
    if (isDbConnected) {
        try {
            const dbSession = await Session.findOne({ token, expiresAt: { $gt: new Date() } });
            if (dbSession) {
                const restored = {
                    expires: Date.now() + SESSION_DURATION_MS,
                    mailId: dbSession.mailId,
                    isAdmin: dbSession.isAdmin
                };
                activeSessions.set(token, restored);
                dbSession.expiresAt = new Date(restored.expires);
                await dbSession.save();
                return restored;
            }
        } catch (_) {}
    }
    return null;
}

async function requireSession(req, res, next) {
    const token = req.headers['x-session-token'];
    const session = await validateSession(token);
    if (!session) {
        return res.status(401).json({ success: false, error: 'Session expired or invalid.' });
    }
    req.session = session;
    next();
}

const apiCallLog = new Map();
const API_WINDOW_MS = 60 * 1000;
const API_MAX_CALLS = 60;

function generalRateLimit(req, res, next) {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const timestamps = (apiCallLog.get(ip) || []).filter(t => now - t < API_WINDOW_MS);
    timestamps.push(now);
    apiCallLog.set(ip, timestamps);
    if (timestamps.length > API_MAX_CALLS) {
        return res.status(429).json({ success: false, error: 'Rate limit exceeded.' });
    }
    next();
}

app.use('/api', generalRateLimit);
app.use(express.json({ limit: '50mb' }));
// Frontend is deployed on Vercel — no static file serving needed here.

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolioos';
let isDbConnected = false;

mongoose.connect(MONGO_URI)
.then(async () => {
    console.log('[Backend] Successfully connected to MongoDB.');
    isDbConnected = true;
    await initializePasswordIfNeeded();
})
.catch(err => {
    console.error('[Backend] MongoDB connection failed.', err.message);
});

const UserSchemaConfig = new mongoose.Schema({
    id: { type: String, default: 'single_user' },
    data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });
const UserConfig = mongoose.model('UserConfig', UserSchemaConfig);
let memoryUserCache = {};

function pruneExpiredCertificates(data) {
    if (data && Array.isArray(data.certificates)) {
        const now = Date.now();
        const initialCount = data.certificates.length;
        data.certificates = data.certificates.filter(cert => {
            if (cert.addedAt) {
                const addedTime = new Date(cert.addedAt).getTime();
                if (now - addedTime > 10 * 60 * 1000) return false;
            }
            return true;
        });
        return data.certificates.length !== initialCount;
    }
    return false;
}

const BCRYPT_ROUNDS = 10;
let _cachedHash = null;

async function getStoredHash() {
    if (isDbConnected) {
        try {
            const adminUser = await User.findOne({ accountType: 'admin' });
            if (adminUser) {
                return adminUser.accessPinHash;
            }
            const dbDoc = await UserConfig.findOne({ id: 'single_user' });
            if (dbDoc?.data?.admin_password_hash) {
                _cachedHash = dbDoc.data.admin_password_hash;
                return _cachedHash;
            }
        } catch (err) { }
    }
    return _cachedHash || null;
}

async function verifyPassword(plaintext) {
    const hash = await getStoredHash();
    if (!hash) return false;
    return bcrypt.compare(String(plaintext).trim(), hash);
}

async function saveNewPasswordHash(plaintext) {
    const hash = await bcrypt.hash(String(plaintext).trim(), BCRYPT_ROUNDS);
    _cachedHash = hash;
    if (isDbConnected) {
        try {
            const adminUser = await User.findOne({ accountType: 'admin' });
            if (adminUser) {
                adminUser.accessPinHash = hash;
                await adminUser.save();
            }
            
            const adminIds = ['single_user'];
            if (adminUser && adminUser.mailId) {
                adminIds.push(adminUser.mailId);
            }
            
            for (const id of adminIds) {
                let doc = await UserConfig.findOne({ id });
                if (doc) {
                    doc.data = { ...doc.data, admin_password_hash: hash };
                    delete doc.data.admin_password;
                    doc.markModified('data');
                    await doc.save();
                }
            }
            // If doc single_user did not exist, let's create it
            let docExist = await UserConfig.findOne({ id: 'single_user' });
            if (!docExist) {
                await UserConfig.create({ id: 'single_user', data: { admin_password_hash: hash } });
            }
        } catch (err) { }
    }
    return hash;
}

async function initializePasswordIfNeeded() {
    try {
        const existing = await getStoredHash();
        if (existing) {
            const dbDoc = await UserConfig.findOne({ id: 'single_user' });
            if (dbDoc?.data?.admin_password && !dbDoc?.data?.admin_password_hash) {
                await saveNewPasswordHash(dbDoc.data.admin_password);
            }
            return;
        }
        const seedPw = process.env.ADMIN_PASSWORD;
        if (seedPw && seedPw.trim()) {
            await saveNewPasswordHash(seedPw);
        }
    } catch (err) {}
}

function generateOtpCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/* ══════════════════════════════════════════════
   PUBLIC ROUTES
══════════════════════════════════════════════ */
app.get('/api/user', async (req, res) => {
    try {
        let mailId = req.headers['x-mail-id'];
        
        if (isDbConnected) {
            // If no specific mailId passed, look up admin user's mailId
            if (!mailId) {
                try {
                    const adminUser = await User.findOne({ accountType: 'admin' });
                    if (adminUser && adminUser.mailId && adminUser.mailId !== 'single_user') {
                        mailId = adminUser.mailId;
                    } else {
                        mailId = 'single_user';
                    }
                } catch (_) {
                    mailId = 'single_user';
                }
            }

            let profileExtras = { displayName: null, avatar: null };
            try {
                let userRecord = await User.findOne({ mailId }).select('displayName avatar');
                if (!userRecord && mailId === 'single_user') {
                    userRecord = await User.findOne({ accountType: 'admin' }).select('displayName avatar');
                }
                if (userRecord) {
                    profileExtras.displayName = userRecord.displayName || null;
                    profileExtras.avatar = userRecord.avatar || null;
                }
            } catch (_) {}

            let config = await UserConfig.findOne({ id: mailId });
            // Fallback 1: Try single_user if custom mailId config not found
            if (!config && mailId !== 'single_user') {
                config = await UserConfig.findOne({ id: 'single_user' });
            }
            // Fallback 2: Retrieve the most recent UserConfig if still not found
            if (!config) {
                config = await UserConfig.findOne().sort({ updatedAt: -1 });
            }

            if (config) {
                const hasChanged = pruneExpiredCertificates(config.data);
                if (hasChanged) { config.markModified('data'); await config.save(); }
                const publicData = { ...config.data };
                delete publicData.admin_password;
                delete publicData.admin_password_hash;
                delete publicData.security_answer;
                if (profileExtras.displayName) publicData.displayName = profileExtras.displayName;
                if (profileExtras.avatar) publicData.avatar = profileExtras.avatar;
                return res.json({ success: true, db: true, user: publicData });
            }

            if (profileExtras.displayName || profileExtras.avatar) {
                return res.json({ success: true, db: true, user: { displayName: profileExtras.displayName, avatar: profileExtras.avatar } });
            }
        }

        const cacheKey = mailId || 'single_user';
        if (memoryUserCache[cacheKey]) {
            pruneExpiredCertificates(memoryUserCache[cacheKey]);
            const publicData = { ...memoryUserCache[cacheKey] };
            delete publicData.admin_password;
            delete publicData.admin_password_hash;
            delete publicData.security_answer;
            return res.json({ success: true, db: false, cache: true, user: publicData });
        }
        return res.json({ success: true, db: isDbConnected, user: null });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// POST /api/settings - Store OS display & system settings permanently in MongoDB
app.post('/api/settings', async (req, res) => {
    try {
        const { settings } = req.body;
        if (!settings || typeof settings !== 'object') {
            return res.status(400).json({ success: false, error: 'Invalid settings object' });
        }

        let mailId = null;
        const token = req.headers['x-session-token'];
        const session = token ? await validateSession(token) : null;
        if (session && session.mailId) {
            mailId = session.mailId;
        }

        if (!mailId && isDbConnected) {
            try {
                const adminUser = await User.findOne({ accountType: 'admin' });
                if (adminUser && adminUser.mailId && adminUser.mailId !== 'single_user') {
                    mailId = adminUser.mailId;
                }
            } catch (_) {}
        }
        if (!mailId) mailId = 'single_user';

        if (isDbConnected) {
            let doc = await UserConfig.findOne({ id: mailId });
            if (!doc && mailId !== 'single_user') {
                doc = await UserConfig.findOne({ id: 'single_user' });
            }
            if (!doc) {
                doc = new UserConfig({ id: mailId, data: {} });
            }
            doc.id = mailId;
            doc.data = doc.data || {};
            doc.data.settings = { ...(doc.data.settings || {}), ...settings };
            doc.markModified('data');
            await doc.save();
            memoryUserCache[mailId] = doc.data;
            return res.json({ success: true, db: true, settings: doc.data.settings });
        }

        memoryUserCache[mailId] = memoryUserCache[mailId] || {};
        memoryUserCache[mailId].settings = { ...(memoryUserCache[mailId].settings || {}), ...settings };
        return res.json({ success: true, db: false, cache: true, settings: memoryUserCache[mailId].settings });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/status', (req, res) => res.json({ success: true, status: 'online' }));

// POST /api/ai/ask - Comprehensive Portfolio & General Knowledge AI Assistant
app.post('/api/ai/ask', async (req, res) => {
    try {
        const { question } = req.body;
        if (!question || typeof question !== 'string') {
            return res.status(400).json({ success: false, error: 'Question is required' });
        }

        const rawQ = question.trim();
        const q = rawQ.toLowerCase();

        // Fetch User Data from DB / cache for comprehensive portfolio context
        let userData = memoryUserCache['single_user'] || {};
        if (isDbConnected) {
            try {
                const doc = await UserConfig.findOne({ id: 'single_user' });
                if (doc && doc.data) userData = doc.data;
            } catch (_) {}
        }

        // External API Helper for Live Weather
        async function fetchWeather(city = 'Kolkata') {
            try {
                const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
                const geoData = await geoRes.json();
                if (geoData.results && geoData.results.length > 0) {
                    const { latitude, longitude, name, country } = geoData.results[0];
                    const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
                    const wData = await wRes.json();
                    if (wData.current_weather) {
                        const cw = wData.current_weather;
                        return `• **Weather in ${name}, ${country}**:\n  - **Temperature**: ${cw.temperature}°C\n  - **Wind Speed**: ${cw.windspeed} km/h\n  - **Condition**: ${cw.weathercode === 0 ? 'Clear sky ☀️' : cw.weathercode < 4 ? 'Partly Cloudy ⛅' : 'Cloudy / Rainy 🌧️'}`;
                    }
                }
            } catch (_) {}
            return `• **Current Weather**: Unable to fetch live weather details right now. Please specify a city or try again shortly.`;
        }

        // External API Helper for Wikipedia / General Knowledge
        async function fetchWikiInfo(queryTerm) {
            try {
                const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(queryTerm)}`);
                if (wikiRes.ok) {
                    const data = await wikiRes.json();
                    if (data.extract) {
                        const cleanExtract = data.extract.length > 350 ? data.extract.substring(0, 350) + '...' : data.extract;
                        return `• **Overview of ${data.title}**:\n  - ${cleanExtract}`;
                    }
                }
            } catch (_) {}
            return null;
        }

        let answer = "";

        // 1. Live Time & Date Queries
        if (q.includes('time') || q.includes('date') || q.includes('day') || q.includes('clock')) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
            const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            answer = `• **Current Time**: ${timeStr}\n• **Date**: ${dateStr}\n• **Timezone**: ${tz}`;
        }

        // 2. Weather Queries
        else if (q.includes('weather') || q.includes('temperature') || q.includes('climate')) {
            const words = q.replace(/weather|temperature|climate|in|for|the|what|is|how|like|today|current/g, ' ').trim().split(/\s+/);
            const targetCity = words.find(w => w.length > 2) || 'Kolkata';
            answer = await fetchWeather(targetCity);
        }

        // 3. Abhishek's Full Portfolio Details (Bio, Experience, Tech Stack, Projects, Contact, Certs)
        else if (q.includes('who is') || q.includes('about abhishek') || q.includes('bio') || q.includes('about')) {
            const bio = userData.bio || "Full Stack Web & AI Developer specializing in scalable MERN stack apps, interactive OS-like interfaces, and AI engine integrations.";
            answer = `• **Name**: Abhishek Biswas\n• **Role**: Full Stack Web & AI Engineer\n• **Summary**: ${bio}\n• **Highlights**: Developer of PortfolioOS, expert in React, Node.js, Express, MongoDB, and UI micro-animations.`;
        }
        else if (q.includes('project') || q.includes('built') || q.includes('work') || q.includes('portfolioos')) {
            answer = `• **Key Featured Projects**:\n  1. **PortfolioOS**: A full-featured macOS/Ubuntu-inspired portfolio operating system built with React 19, Vite, Framer Motion, and Tailwind CSS.\n  2. **Ask Me AI Assistant**: Embedded multi-functional AI model engine with live web & knowledge lookup capabilities.\n  3. **Enterprise Portals & Web Apps**: Production MongoDB REST API backends, session management, and admin dashboards.`;
        }
        else if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('language') || q.includes('framework')) {
            answer = `• **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, JavaScript (ES6+), HTML5/CSS3.\n• **Backend & DB**: Node.js, Express.js, MongoDB (Mongoose), RESTful APIs, Session Security, Bcrypt.\n• **DevOps & Tools**: Git, GitHub, Linux, Vercel, Postman.`;
        }
        else if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('reach') || q.includes('phone') || q.includes('social')) {
            const email = userData.email || 'a.bishwas2000@gmail.com';
            answer = `• **Email**: ${email}\n• **Contact App**: Open the Contact icon on the dock to send a direct message.\n• **Social Links**: Available in the About Me app and top MenuBar links.`;
        }
        else if (q.includes('certif') || q.includes('award') || q.includes('degree') || q.includes('education')) {
            answer = `• **Education & Certifications**:\n  - Full Stack Web Development Certifications & Projects.\n  - Professional expertise in Web Architecture, Database Systems, and UI/UX Design.\n  - Explore the **Certificates** app on the dock to view full credentials.`;
        }

        // 4. History, General Knowledge, Science & Concepts (via Wikipedia API + Fallbacks)
        else {
            const cleanQuery = rawQ.replace(/^(what is|who is|tell me about|explain|how does|search|where is|when was|define|meaning of)\s+/i, '').trim();
            const wikiAnswer = await fetchWikiInfo(cleanQuery || rawQ);
            
            if (wikiAnswer) {
                answer = wikiAnswer;
            } else {
                answer = `• **Response for "${rawQ}"**:\n  - Abhishek Biswas is a Full Stack Developer building cutting-edge web applications like PortfolioOS.\n  - For specific inquiries, ask about Abhishek's **Projects**, **Tech Stack**, **Contact Info**, **Live Time**, or **Weather**!`;
            }
        }

        return res.json({
            success: true,
            answer,
            model: 'PortfolioOS-GoogleAI-v3.0'
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/validate-session', async (req, res) => {
    const token = req.headers['x-session-token'];
    const session = await validateSession(token);
    if (!session) return res.json({ valid: false });
    
    let displayName = session.isAdmin ? 'Sudo Admin' : session.mailId;
    let avatar = '';
    
    if (isDbConnected) {
        try {
            if (session.isAdmin && session.mailId === 'single_user') {
                const adminUser = await User.findOne({ accountType: 'admin' });
                if (adminUser) {
                    session.mailId = adminUser.mailId;
                    displayName = adminUser.displayName || displayName;
                    avatar = adminUser.avatar || '';
                }
            } else {
                const user = await User.findOne({ mailId: session.mailId }).select('displayName avatar');
                if (user) {
                    displayName = user.displayName || displayName;
                    avatar = user.avatar || '';
                }
            }
        } catch (_) {}
    }
    
    return res.json({ valid: true, mailId: session.mailId, isAdmin: session.isAdmin, displayName, avatar });
});

// Update profile (displayName, avatar)
app.put('/api/profile/update', requireSession, async (req, res) => {
    try {
        const { displayName, avatar } = req.body;
        let mailId = req.session.mailId;
        let user = await User.findOne({ mailId });
        
        if (!user && req.session.isAdmin) {
            user = await User.findOne({ accountType: 'admin' });
            if (!user) {
                const accessPinHash = await getStoredHash();
                user = new User({
                    mailId: 'single_user',
                    displayName: displayName || 'Sudo Admin',
                    accessPinHash,
                    isVerified: true,
                    verifiedAt: new Date(),
                    accountType: 'admin'
                });
            }
        }
        
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        if (displayName !== undefined) user.displayName = String(displayName).trim();
        if (avatar !== undefined) user.avatar = avatar;
        await user.save();
        res.json({ success: true, user: { mailId: user.mailId, displayName: user.displayName, avatar: user.avatar } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/* ══════════════════════════════════════════════
   AUTH ROUTES
══════════════════════════════════════════════ */

app.post('/api/auth/send-otp', rateLimitAuth, async (req, res) => {
    try {
        const { mailId, purpose } = req.body;
        if (!mailId || !purpose) return res.status(400).json({ success: false, error: 'Missing mailId or purpose' });
        
        const otpCode = generateOtpCode();
        const otpHash = await bcrypt.hash(otpCode, 10);
        
        await Otp.create({
            mailId: mailId.toLowerCase(),
            otpHash,
            purpose,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        });
        
        await sendOTP(mailId, otpCode, purpose);
        console.log('[DEBUG] OTP generated:', otpCode, 'for purpose:', purpose);
        res.json({ success: true, msg: 'OTP sent successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/auth/register', rateLimitAuth, async (req, res) => {
    try {
        const { mailId, displayName, pin, otp } = req.body;
        if (!mailId || !pin || !otp || !displayName) return res.status(400).json({ success: false, error: 'Missing fields' });
        
        const otpRecord = await Otp.findOne({ mailId: mailId.toLowerCase(), purpose: 'register', isUsed: false, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });
        if (!otpRecord) return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        
        const isValid = await bcrypt.compare(otp.toString(), otpRecord.otpHash);
        if (!isValid) return res.status(400).json({ success: false, error: 'Invalid OTP' });
        
        otpRecord.isUsed = true;
        await otpRecord.save();
        
        const existing = await User.findOne({ mailId: mailId.toLowerCase() });
        if (existing) return res.status(400).json({ success: false, error: 'User already exists' });
        
        const accessPinHash = await bcrypt.hash(pin.toString(), 10);
        const user = await User.create({
            mailId: mailId.toLowerCase(),
            displayName,
            accessPinHash,
            isVerified: true,
            verifiedAt: new Date(),
            accountType: 'user'
        });
        
        await UserConfig.create({ id: user.mailId, data: {} });
        
        const token = createSession(user.mailId, false);
        res.json({ success: true, sessionToken: token, user: { mailId: user.mailId, displayName: user.displayName } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/auth/login', rateLimitAuth, async (req, res) => {
    try {
        const { mailId, pin } = req.body;
        
        if (!mailId || mailId === 'admin') {
            const passwordHeader = req.headers['x-admin-password'] || pin;
            if (!passwordHeader) return res.status(401).json({ success: false, error: 'PIN required' });
            
            const isValid = await verifyPassword(passwordHeader);
            if (!isValid) {
                recordFailedAttempt(req._authIP);
                return res.status(403).json({ success: false, error: 'Invalid admin PIN' });
            }
            recordSuccessfulLogin(req._authIP);
            // Look up the admin's real User record to get linked email, displayName, avatar
            let adminMailId = 'single_user';
            let adminDisplayName = 'Sudo Admin';
            let adminAvatar = '';
            if (isDbConnected) {
                try {
                    const adminUser = await User.findOne({ accountType: 'admin' });
                    if (adminUser && adminUser.mailId && adminUser.mailId !== 'single_user') {
                        adminMailId = adminUser.mailId;
                        adminDisplayName = adminUser.displayName || 'Sudo Admin';
                        adminAvatar = adminUser.avatar || '';
                    } else if (adminUser) {
                        adminDisplayName = adminUser.displayName || 'Sudo Admin';
                        adminAvatar = adminUser.avatar || '';
                    }
                } catch (_) {}
            }
            const token = createSession(adminMailId, true);
            return res.json({ success: true, sessionToken: token, user: { mailId: adminMailId, isAdmin: true, displayName: adminDisplayName, avatar: adminAvatar } });
        }
        
        const user = await User.findOne({ mailId: mailId.toLowerCase() });
        if (!user) return res.status(403).json({ success: false, error: 'Invalid credentials' });
        
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            return res.status(429).json({ success: false, error: 'Account locked. Try again later.' });
        }
        
        const isValid = await bcrypt.compare(pin.toString(), user.accessPinHash);
        if (!isValid) {
            user.failedAttempts += 1;
            if (user.failedAttempts >= MAX_ATTEMPTS) {
                user.lockedUntil = new Date(Date.now() + LOCK_DURATION_MS);
                user.failedAttempts = 0;
            }
            await user.save();
            recordFailedAttempt(req._authIP);
            return res.status(403).json({ success: false, error: 'Invalid credentials' });
        }
        
        user.failedAttempts = 0;
        user.lockedUntil = null;
        user.lastLogin = new Date();
        await user.save();
        
        recordSuccessfulLogin(req._authIP);
        const token = createSession(user.mailId, user.accountType === 'admin');
        res.json({ success: true, sessionToken: token, user: { mailId: user.mailId, displayName: user.displayName, isAdmin: user.accountType === 'admin' } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/auth/verify-otp', requireSession, async (req, res) => {
    try {
        const { otp, purpose } = req.body;
        const mailId = req.session.mailId === 'single_user' ? req.body.mailId : req.session.mailId;
        
        const otpRecord = await Otp.findOne({ mailId: mailId.toLowerCase(), purpose, isUsed: false, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });
        if (!otpRecord) return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        
        const isValid = await bcrypt.compare(otp.toString(), otpRecord.otpHash);
        if (!isValid) return res.status(400).json({ success: false, error: 'Invalid OTP' });
        
        otpRecord.isUsed = true;
        await otpRecord.save();
        
        res.json({ success: true, msg: 'OTP verified' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/auth/reset-pin', rateLimitAuth, async (req, res) => {
    try {
        const { mailId, otp, newPin } = req.body;
        if (!mailId || !otp || !newPin || newPin.length < 4) return res.status(400).json({ success: false, error: 'Invalid input' });
        
        const otpRecord = await Otp.findOne({ mailId: mailId.toLowerCase(), purpose: { $in: ['reset_pin', 'change_pin'] }, isUsed: false, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });
        if (!otpRecord) return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        
        const isValid = await bcrypt.compare(otp.toString(), otpRecord.otpHash);
        if (!isValid) return res.status(400).json({ success: false, error: 'Invalid OTP' });
        
        otpRecord.isUsed = true;
        await otpRecord.save();
        
        let isForAdmin = mailId === 'single_user' || mailId === 'admin';
        let user = null;
        if (!isForAdmin) {
            user = await User.findOne({ mailId: mailId.toLowerCase() });
            if (user && user.accountType === 'admin') {
                isForAdmin = true;
            }
        }
        
        if (isForAdmin) {
            await saveNewPasswordHash(newPin);
        } else {
            if (!user) {
                user = await User.findOne({ mailId: mailId.toLowerCase() });
            }
            if (!user) return res.status(404).json({ success: false, error: 'User not found' });
            user.accessPinHash = await bcrypt.hash(newPin.toString(), 10);
            await user.save();
        }
        
        res.json({ success: true, msg: 'PIN reset successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/* ══════════════════════════════════════════════
   PROTECTED ROUTES
══════════════════════════════════════════════ */
app.post('/api/user', requireSession, async (req, res) => {
    try {
        const { user } = req.body;
        if (!user) return res.status(400).json({ success: false, error: 'No user data provided' });

        pruneExpiredCertificates(user);
        const mailId = req.session.mailId || 'single_user';

        if (isDbConnected) {
            let doc = await UserConfig.findOne({ id: mailId });
            if (!doc && mailId !== 'single_user') {
                doc = await UserConfig.findOne({ id: 'single_user' });
            }
            if (!doc) {
                doc = new UserConfig({ id: mailId, data: {} });
            }
            const existingData = doc.data || {};
            const mergedSettings = { ...(existingData.settings || {}), ...(user.settings || {}) };
            const mergedData = {
                ...existingData,
                ...user,
                settings: mergedSettings
            };
            if (existingData.admin_password_hash && !mergedData.admin_password_hash) {
                mergedData.admin_password_hash = existingData.admin_password_hash;
            }
            doc.id = mailId;
            doc.data = mergedData;
            doc.markModified('data');
            await doc.save();

            memoryUserCache[mailId] = doc.data;
            return res.json({ success: true, db: true, user: doc.data });
        }

        memoryUserCache[mailId] = { ...(memoryUserCache[mailId] || {}), ...user };
        return res.json({ success: true, db: false, cache: true, user: memoryUserCache[mailId], msg: 'Saved to cache' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

app.get('/api/profile/me', requireSession, async (req, res) => {
    try {
        let user = null;
        if (isDbConnected) {
            user = await User.findOne({ mailId: req.session.mailId }).select('-accessPinHash');
            if (!user && req.session.isAdmin) {
                user = await User.findOne({ accountType: 'admin' }).select('-accessPinHash');
            }
        }
        if (user) {
            return res.json({ success: true, user });
        }
        if (req.session.mailId === 'single_user') {
            return res.json({ success: true, user: { mailId: 'single_user', displayName: 'Sudo Admin', accountType: 'admin' } });
        }
        res.status(404).json({ success: false, error: 'User not found' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/profile/send-change-email-otp
app.post('/api/profile/send-change-email-otp', requireSession, async (req, res) => {
    try {
        let mailId = req.session.mailId;
        let user = await User.findOne({ mailId });
        if (!user && req.session.isAdmin) {
            user = await User.findOne({ accountType: 'admin' });
        }
        
        if (!user || user.mailId === 'single_user') {
            return res.json({ success: true, notLinked: true, msg: 'No email linked yet. Skipping old email verification.' });
        }
        
        const otpCode = generateOtpCode();
        const otpHash = await bcrypt.hash(otpCode, 10);
        
        await Otp.create({
            mailId: user.mailId,
            otpHash,
            purpose: 'change_email_old',
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        });
        
        await sendOTP(user.mailId, otpCode, 'change_email_old');
        res.json({ success: true, msg: 'OTP sent to current email address.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/profile/verify-change-email-old
app.post('/api/profile/verify-change-email-old', requireSession, async (req, res) => {
    try {
        const { otp } = req.body;
        if (!otp) return res.status(400).json({ success: false, error: 'OTP is required' });
        
        let mailId = req.session.mailId;
        let user = await User.findOne({ mailId });
        if (!user && req.session.isAdmin) {
            user = await User.findOne({ accountType: 'admin' });
        }
        
        if (!user || user.mailId === 'single_user') {
            req.session.oldEmailVerified = true;
            return res.json({ success: true, msg: 'No email linked yet. Verification skipped.' });
        }
        
        const otpRecord = await Otp.findOne({
            mailId: user.mailId,
            purpose: 'change_email_old',
            isUsed: false,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });
        
        if (!otpRecord) return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        
        const isValid = await bcrypt.compare(otp.toString(), otpRecord.otpHash);
        if (!isValid) return res.status(400).json({ success: false, error: 'Invalid OTP' });
        
        otpRecord.isUsed = true;
        await otpRecord.save();
        
        req.session.oldEmailVerified = true;
        res.json({ success: true, msg: 'Current email verified.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/profile/send-new-email-otp
app.post('/api/profile/send-new-email-otp', requireSession, async (req, res) => {
    try {
        const { newEmail } = req.body;
        if (!newEmail || !newEmail.trim()) return res.status(400).json({ success: false, error: 'New email is required' });
        
        const cleanNewEmail = newEmail.trim().toLowerCase();
        
        let currentMailId = req.session.mailId;
        let currentUserRecord = await User.findOne({ mailId: currentMailId });
        if (!currentUserRecord && req.session.isAdmin) {
            currentUserRecord = await User.findOne({ accountType: 'admin' });
        }
        
        if (currentUserRecord && currentUserRecord.mailId !== 'single_user') {
            if (!req.session.oldEmailVerified) {
                return res.status(400).json({ success: false, error: 'Please verify your current email first.' });
            }
        }
        
        const existingUser = await User.findOne({ mailId: cleanNewEmail });
        if (existingUser && (!currentUserRecord || existingUser._id.toString() !== currentUserRecord._id.toString())) {
            return res.status(400).json({ success: false, error: 'Email is already linked to another account.' });
        }
        
        const otpCode = generateOtpCode();
        const otpHash = await bcrypt.hash(otpCode, 10);
        
        await Otp.create({
            mailId: cleanNewEmail,
            otpHash,
            purpose: 'change_email_new',
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        });
        
        await sendOTP(cleanNewEmail, otpCode, 'change_email_new');
        res.json({ success: true, msg: 'OTP sent to new email address.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/profile/confirm-change-email
app.post('/api/profile/confirm-change-email', requireSession, async (req, res) => {
    try {
        const { newEmail, otp } = req.body;
        if (!newEmail || !otp) return res.status(400).json({ success: false, error: 'Missing required fields' });
        
        const cleanNewEmail = newEmail.trim().toLowerCase();
        
        let currentMailId = req.session.mailId;
        let currentUserRecord = await User.findOne({ mailId: currentMailId });
        if (!currentUserRecord && req.session.isAdmin) {
            currentUserRecord = await User.findOne({ accountType: 'admin' });
        }
        
        if (currentUserRecord && currentUserRecord.mailId !== 'single_user') {
            if (!req.session.oldEmailVerified) {
                return res.status(400).json({ success: false, error: 'Please verify your current email first.' });
            }
        }
        
        const otpRecord = await Otp.findOne({
            mailId: cleanNewEmail,
            purpose: 'change_email_new',
            isUsed: false,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });
        
        if (!otpRecord) return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        
        const isValid = await bcrypt.compare(otp.toString(), otpRecord.otpHash);
        if (!isValid) return res.status(400).json({ success: false, error: 'Invalid OTP' });
        
        otpRecord.isUsed = true;
        await otpRecord.save();
        
        const accessPinHash = await getStoredHash();
        if (currentUserRecord) {
            const oldId = currentUserRecord.mailId;
            currentUserRecord.mailId = cleanNewEmail;
            await currentUserRecord.save();
            
            const config = await UserConfig.findOne({ id: oldId });
            if (config) {
                config.id = cleanNewEmail;
                config.markModified('id');
                await config.save();
            } else {
                await UserConfig.create({ id: cleanNewEmail, data: {} });
            }
        } else if (req.session.isAdmin) {
            currentUserRecord = await User.create({
                mailId: cleanNewEmail,
                displayName: 'Sudo Admin',
                accessPinHash,
                isVerified: true,
                verifiedAt: new Date(),
                accountType: 'admin'
            });
            
            const config = await UserConfig.findOne({ id: 'single_user' });
            if (config) {
                config.id = cleanNewEmail;
                config.markModified('id');
                await config.save();
            } else {
                await UserConfig.create({ id: cleanNewEmail, data: {} });
            }
        }
        
        req.session.mailId = cleanNewEmail;
        delete req.session.oldEmailVerified;
        
        // Issue a fresh session token with the new mailId so the client
        // can persist it — this survives server restarts correctly.
        const newSessionToken = createSession(cleanNewEmail, req.session.isAdmin || false);
        
        res.json({
            success: true,
            msg: 'Email linked/changed successfully.',
            sessionToken: newSessionToken,
            user: {
                mailId: cleanNewEmail,
                displayName: currentUserRecord ? currentUserRecord.displayName : 'Sudo Admin',
                avatar: currentUserRecord ? currentUserRecord.avatar : ''
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.delete('/api/profile/erase-data', requireSession, async (req, res) => {
    try {
        const mailId = req.session.mailId;
        const { pin } = req.body;
        if (!pin) return res.status(400).json({ success: false, error: 'Access PIN is required' });

        // Verify PIN before erasing
        let userRecord = await User.findOne({ mailId: mailId.toLowerCase() });
        if (!userRecord && req.session.isAdmin) {
            userRecord = await User.findOne({ accountType: 'admin' });
        }

        // For legacy admin (single_user), check stored hash
        let pinValid = false;
        if (req.session.isAdmin && !userRecord) {
            const storedHash = await getStoredHash();
            pinValid = storedHash ? await bcrypt.compare(pin.toString(), storedHash) : false;
        } else if (userRecord) {
            pinValid = await bcrypt.compare(pin.toString(), userRecord.pinHash);
        }

        if (!pinValid) return res.status(401).json({ success: false, error: 'Incorrect PIN. Data not erased.' });

        await UserConfig.findOneAndUpdate({ id: mailId }, { data: {} });
        memoryUserCache[mailId] = {};
        res.json({ success: true, msg: 'All portfolio data erased successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.delete('/api/profile/delete-account', requireSession, async (req, res) => {
    try {
        if (req.session.mailId === 'single_user') return res.status(403).json({ success: false, error: 'Cannot delete sudo admin' });
        const mailId = req.session.mailId;
        await User.findOneAndDelete({ mailId });
        await UserConfig.findOneAndDelete({ id: mailId });
        delete memoryUserCache[mailId];
        activeSessions.forEach((val, key) => {
            if (val.mailId === mailId) activeSessions.delete(key);
        });
        res.json({ success: true, msg: 'Account deleted' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// AI Assistant Endpoint ("Ask Me")
app.post('/api/ai/ask', async (req, res) => {
    try {
        const { question } = req.body;
        if (!question || typeof question !== 'string') {
            return res.status(400).json({ success: false, error: 'Question is required' });
        }

        const qLower = question.toLowerCase();
        let answer = "";

        // Intelligence knowledge base for Abhishek's PortfolioOS
        if (qLower.includes('who') || qLower.includes('abhishek') || qLower.includes('about') || qLower.includes('intro')) {
            answer = "I am Abhishek Biswas, a passionate Full Stack Software Engineer & UI/UX Craftsman. I build interactive web applications, operating systems, and scalable backend services with React, Node.js, and modern cloud technologies.";
        } else if (qLower.includes('project') || qLower.includes('work') || qLower.includes('built')) {
            answer = "Abhishek has developed several key projects including:\n• **PortfolioOS**: A full-featured web desktop operating system with window management, custom apps, and live admin synchronization.\n• **AI Intelligence Hub**: Real-time multi-agent workflows and automated tools.\n• **Full-Stack Dashboard**: Enterprise analytics and certificate verification system.";
        } else if (qLower.includes('skill') || qLower.includes('stack') || qLower.includes('tech') || qLower.includes('experience')) {
            answer = "Abhishek's core tech stack includes:\n• **Frontend**: React, Vite, Framer Motion, Tailwind CSS, JavaScript/TypeScript, UI/UX Design.\n• **Backend**: Node.js, Express, REST APIs, Python.\n• **Database**: MongoDB Atlas, Redis, PostgreSQL.\n• **DevOps & Cloud**: Docker, Vercel, Render, AWS, Git/GitHub.";
        } else if (qLower.includes('contact') || qLower.includes('email') || qLower.includes('hire') || qLower.includes('reach')) {
            answer = "You can get in touch with Abhishek via:\n• **Email**: a.bishwas2000@gmail.com\n• **Website**: [abhishekbishwas.com.np](https://abhishekbishwas.com.np)\n• **GitHub**: [github.com/a-bishwas-2k](https://github.com/a-bishwas-2k)\n• Or open the **Contact App** right here inside PortfolioOS!";
        } else if (qLower.includes('certificate') || qLower.includes('degree') || qLower.includes('education')) {
            answer = "Abhishek holds degrees and certifications in Computer Science and Software Engineering. You can inspect all verified credentials in the **Certificates App** on the desktop!";
        } else {
            answer = `Thanks for asking! As Abhishek's AI Assistant ("Ask Me"), I can help you explore his skills, background, projects, or credentials. Feel free to ask: "What are Abhishek's top projects?", "How can I contact Abhishek?", or "What is his tech stack?"`;
        }

        res.json({ success: true, answer });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/logout', (req, res) => {
    const token = req.headers['x-session-token'];
    if (token) activeSessions.delete(token);
    return res.json({ success: true });
});

app.post('/api/clear-lockout', (req, res) => {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const hadRecord = loginAttempts.has(ip);
    loginAttempts.delete(ip);
    return res.json({ success: true, cleared: hadRecord, ip });
});

// 404 handler for unknown API routes
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'API route not found' });
});

app.listen(PORT, () => {
    console.log(`[Backend] PortfolioOS server running at http://localhost:${PORT}`);
});
