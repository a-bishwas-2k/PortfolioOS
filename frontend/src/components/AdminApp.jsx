import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import AccountProfile from './AccountProfile';
import { useIsMobile } from '../utils/responsive';
import { DEFAULT_TERMINAL_COMMANDS, replacePlaceholders } from '../utils/terminalCommands';

/* ─── Shared helpers ─────────────────────────────── */
const Input = (props) => (
  <input {...props} className="adm-input" style={{ marginBottom: '8px', ...props.style }} />
);

const Textarea = (props) => (
  <textarea {...props} className="adm-input" style={{ resize: 'vertical', minHeight: '80px', marginBottom: '8px', ...props.style }} />
);

const Btn = ({ children, onClick, danger, style }) => (
  <button
    onClick={onClick}
    style={{
      padding: '7px 14px',
      border: `1px solid ${danger ? 'rgba(239,68,68,0.4)' : 'rgba(124,58,237,0.4)'}`,
      borderRadius: '7px',
      background: danger ? 'rgba(239,68,68,0.1)' : 'rgba(124,58,237,0.12)',
      color: danger ? '#F87171' : 'var(--lavender)',
      fontSize: 'var(--fs-xs)',
      fontFamily: 'JetBrains Mono, monospace',
      cursor: 'pointer',
      transition: 'all 0.15s',
      ...style,
    }}
  >
    {children}
  </button>
);

const SectionTitle = ({ children }) => (
  <div style={{
    fontSize: 'var(--fs-xs)', letterSpacing: '2px', textTransform: 'uppercase',
    color: 'var(--violet)', fontFamily: 'JetBrains Mono, monospace',
    fontWeight: 700, marginBottom: '14px',
    display: 'flex', alignItems: 'center', gap: '8px',
  }}>
    <span style={{ color: 'var(--text3)' }}>//</span> {children}
  </div>
);

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

/* ─── Animated Bar Background ─────────────────────── */
const AnimatedBars = ({ active, error }) => {
  const bars = [
    { h: '45%', delay: 0 },
    { h: '65%', delay: 0.1 },
    { h: '80%', delay: 0.2 },
    { h: '55%', delay: 0.15 },
    { h: '35%', delay: 0.05 },
    { h: '70%', delay: 0.25 },
    { h: '50%', delay: 0.08 },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: '100%', display: 'flex', alignItems: 'flex-end',
      gap: '8px', padding: '0 20px', pointerEvents: 'none', overflow: 'hidden',
      opacity: 0.18,
    }}>
      {bars.map((b, i) => (
        <motion.div
          key={i}
          animate={{
            height: active ? [`${parseInt(b.h) * 0.6}%`, b.h, `${parseInt(b.h) * 0.8}%`] : `${parseInt(b.h) * 0.4}%`,
            opacity: error ? [1, 0.3, 1] : 1,
          }}
          transition={{
            duration: active ? 0.8 : 1.5,
            delay: b.delay,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          style={{
            flex: 1,
            background: error
              ? 'linear-gradient(to top, rgba(239,68,68,0.8), rgba(239,68,68,0.2))'
              : 'linear-gradient(to top, rgba(124,58,237,0.9), rgba(167,139,250,0.3))',
            borderRadius: '4px 4px 0 0',
            minWidth: '28px',
          }}
        />
      ))}
    </div>
  );
};

/* ─── Pin Step-Up Modal (overlay for sensitive actions) ───────────── */
const PinStepUpModal = ({ isOpen, onClose, onSuccess, title = 'Confirm Identity', description = 'Enter your PIN to access this section.' }) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const { currentUser } = useStore();
  const BACKEND = (window.location.protocol === 'file:') ? 'http://localhost:5000' : (import.meta.env.VITE_API_URL || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pin.trim()) { setErr('PIN is required'); return; }
    setLoading(true); setErr('');
    try {
      // Use currentUser.mailId from store (set after login)
      // If mailId is 'single_user' (legacy sudo-admin), send 'admin' so the
      // backend routes it through verifyPassword() — the same PIN used to log in.
      const rawMailId = currentUser?.mailId || 'admin';
      const mailId = rawMailId === 'single_user' ? 'admin' : rawMailId;
      const res = await fetch(`${BACKEND}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mailId, pin }),
      });
      const data = await res.json();
      if (data.success || data.ok) {
        setPin(''); setErr('');
        onSuccess();
      } else {
        setPin('');
        setShake(true);
        setTimeout(() => setShake(false), 600);
        setErr(data.error || data.message || 'Incorrect PIN — try again.');
      }
    } catch {
      setErr('Verification failed. Check your connection and try again.');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'absolute', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(6,4,16,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 16 }}
          animate={shake ? { scale: 1, opacity: 1, y: 0, x: [-8, 8, -6, 6, -4, 4, 0] } : { scale: 1, opacity: 1, y: 0, x: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 16 }}
          transition={{ duration: shake ? 0.45 : 0.28, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            background: 'linear-gradient(160deg, rgba(14,10,30,0.98) 0%, rgba(8,6,20,0.98) 100%)',
            border: `1px solid ${err ? 'rgba(239,68,68,0.4)' : 'rgba(124,58,237,0.35)'}`,
            borderRadius: '24px',
            padding: '36px 32px 32px',
            width: '92%', maxWidth: '380px',
            boxShadow: `0 0 0 1px rgba(124,58,237,0.06), 0 32px 64px rgba(0,0,0,0.7), 0 0 60px ${err ? 'rgba(239,68,68,0.08)' : 'rgba(124,58,237,0.1)'}`,
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Top accent line */}
          <div style={{
            position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
            background: err
              ? 'linear-gradient(90deg,transparent,rgba(239,68,68,0.9),transparent)'
              : 'linear-gradient(90deg,transparent,rgba(124,58,237,0.9),transparent)',
            transition: 'background 0.3s',
          }} />
          {/* Ambient glow */}
          <div style={{
            position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
            width: '200px', height: '200px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Lock icon */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.12))',
                border: '1px solid rgba(124,58,237,0.3)',
                fontSize: '24px', marginBottom: '12px',
                boxShadow: '0 0 24px rgba(124,58,237,0.2)',
              }}
            >
              🔒
            </motion.div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '17px', color: 'var(--text)', marginBottom: '6px' }}>
              {title}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', color: 'var(--text3)', lineHeight: 1.6 }}>
              {description}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* PIN input */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <div style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text3)', fontSize: '15px', pointerEvents: 'none',
              }}>🔑</div>
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="Enter your PIN"
                autoFocus
                className="adm-input"
                style={{
                  paddingLeft: '40px', paddingRight: '44px',
                  letterSpacing: showPin ? '2px' : '6px',
                  fontSize: '14px', textAlign: 'center',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPin(v => !v)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text3)', fontSize: '14px', opacity: 0.6, padding: '2px',
                  lineHeight: 1, transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
              >
                {showPin ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Error */}
            <AnimatePresence>
              {err && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{
                    color: '#F87171', fontSize: '11px', fontFamily: 'JetBrains Mono,monospace',
                    marginBottom: '12px', padding: '8px 12px',
                    background: 'rgba(239,68,68,0.07)', borderRadius: '8px',
                    border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center',
                  }}
                >⚠ {err}</motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => { setPin(''); setErr(''); onClose(); }}
                style={{
                  flex: 1, padding: '11px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px', color: 'var(--text2)',
                  fontSize: '13px', fontFamily: 'Syne,sans-serif', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                style={{
                  flex: 1, padding: '11px',
                  background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg,#7C3AED,#4F46E5)',
                  border: 'none', borderRadius: '12px', color: 'white',
                  fontSize: '13px', fontFamily: 'Syne,sans-serif', fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(124,58,237,0.4)',
                  transition: 'background 0.2s',
                }}
              >
                {loading ? (
                  <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                    Verifying...
                  </motion.span>
                ) : 'Verify PIN'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Auth Gate (Login / Register / Forgot PIN) ────── */
const AuthGate = ({ onAuth }) => {
  const [mode, setMode] = useState('login');
  const [step, setStep] = useState(1);
  const [mailId, setMailId] = useState('');
  const [pin, setPin] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [otp, setOtp] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [avatarData, setAvatarData] = useState(null); // { avatar, displayName }
  const [avatarFetching, setAvatarFetching] = useState(false);

  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [inputActive, setInputActive] = useState(false);

  const [lockedOut, setLockedOut] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);
  const countdownRef = useRef(null);

  const { login, register, sendOtp, resetPin } = useStore();

  // Fetch user avatar/name when email is entered on login mode
  const BACKEND_BASE_GATE = (window.location.protocol === 'file:') ? 'http://localhost:5000' : (import.meta.env.VITE_API_URL || '');
  const fetchUserPreview = React.useCallback(async (email) => {
    if (mode !== 'login') { setAvatarData(null); return; }
    setAvatarFetching(true);
    try {
      // For 'admin' keyword or empty, fetch the admin/single_user profile
      const lookupId = (!email || email === 'admin') ? 'single_user' : email.toLowerCase();
      const res = await fetch(`${BACKEND_BASE_GATE}/api/user`, { headers: { 'x-mail-id': lookupId } });
      const data = await res.json();
      if (data.success && data.user && (data.user.avatar || data.user.displayName)) {
        setAvatarData({ avatar: data.user.avatar || '', displayName: data.user.displayName || email || 'Admin' });
      } else { setAvatarData(null); }
    } catch { setAvatarData(null); }
    setAvatarFetching(false);
  }, [mode, BACKEND_BASE_GATE]);

  // Auto-load admin preview on mount (so avatar shows without typing)
  React.useEffect(() => {
    if (mode === 'login') fetchUserPreview('');
  }, [mode]);

  // Debounced email preview
  const emailPreviewTimer = React.useRef(null);
  const handleMailIdChange = (val) => {
    setMailId(val);
    clearTimeout(emailPreviewTimer.current);
    if (!val || val === 'admin') {
      // Show admin preview for empty or 'admin' keyword
      emailPreviewTimer.current = setTimeout(() => fetchUserPreview(val), 300);
    } else if (val.includes('@')) {
      emailPreviewTimer.current = setTimeout(() => fetchUserPreview(val.trim()), 600);
    } else { setAvatarData(null); }
  };

  React.useEffect(() => {
    if (lockCountdown > 0) {
      countdownRef.current = setTimeout(() => setLockCountdown(s => s - 1), 1000);
    } else if (lockCountdown === 0 && lockedOut) {
      setLockedOut(false);
      setErr('');
    }
    return () => clearTimeout(countdownRef.current);
  }, [lockCountdown, lockedOut]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!mailId.trim()) { setErr('Mail ID required'); return; }
    if (mode === 'register' && (!displayName.trim() || !pin.trim())) { setErr('All fields required'); return; }
    if (mode === 'forgot' && !pin.trim()) { setErr('New PIN required'); return; }

    setLoading(true); setErr(''); setMsg('');
    const purpose = mode === 'register' ? 'register' : 'reset_pin';
    const res = await sendOtp(mailId, purpose);
    setLoading(false);
    
    if (res.ok) {
      setStep(2);
      setMsg('OTP sent to your email.');
    } else {
      setErr(res.error || 'Failed to send OTP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr(''); setMsg('');
    
    if (mode === 'login') {
      const res = await login(mailId || 'admin', pin);
      setLoading(false);
      if (res.ok) {
        onAuth();
      } else if (res.lockedOut) {
        setLockedOut(true);
        setLockCountdown(res.waitSeconds || 120);
      } else {
        setErr(res.error || 'Login failed.');
        setPin('');
      }
    } else if (mode === 'register') {
      const res = await register(mailId, displayName, pin, otp);
      setLoading(false);
      if (res.ok) onAuth();
      else setErr(res.error || 'Registration failed.');
    } else if (mode === 'forgot') {
      const res = await resetPin(mailId, otp, pin);
      setLoading(false);
      if (res.ok) {
        setMode('login');
        setStep(1);
        setPin('');
        setOtp('');
        setMsg('PIN reset successful. Please login.');
      } else {
        setErr(res.error || 'Reset failed.');
      }
    }
  };

  const formatCountdown = (s) => s >= 60 ? `${Math.ceil(s / 60)}m ${s % 60}s` : `${s}s`;

  // Trigger shake + error bar on error
  const triggerError = (msg) => {
    setErr(msg);
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleSendOtpWithShake = async (e) => {
    e.preventDefault();
    if (!mailId.trim()) { triggerError('Mail ID required'); return; }
    if (mode === 'register' && (!displayName.trim() || !pin.trim())) { triggerError('All fields required'); return; }
    if (mode === 'forgot' && !pin.trim()) { triggerError('New PIN required'); return; }
    setLoading(true); setErr(''); setMsg('');
    const purpose = mode === 'register' ? 'register' : 'reset_pin';
    const res = await sendOtp(mailId, purpose);
    setLoading(false);
    if (res.ok) { setStep(2); setMsg('OTP sent to your email.'); }
    else triggerError(res.error || 'Failed to send OTP');
  };

  const handleSubmitWithShake = async (e) => {
    e.preventDefault();
    setLoading(true); setErr(''); setMsg('');
    if (mode === 'login') {
      const res = await login(mailId || 'admin', pin);
      setLoading(false);
      if (res.ok) { onAuth(); }
      else if (res.lockedOut) { setLockedOut(true); setLockCountdown(res.waitSeconds || 120); }
      else { triggerError(res.error || 'Login failed.'); setPin(''); }
    } else if (mode === 'register') {
      const res = await register(mailId, displayName, pin, otp);
      setLoading(false);
      if (res.ok) onAuth();
      else triggerError(res.error || 'Registration failed.');
    } else if (mode === 'forgot') {
      const res = await resetPin(mailId, otp, pin);
      setLoading(false);
      if (res.ok) { setMode('login'); setStep(1); setPin(''); setOtp(''); setMsg('PIN reset. Please login.'); }
      else triggerError(res.error || 'Reset failed.');
    }
  };

  const modeIcon = lockedOut ? '🔒' : mode === 'register' ? '✨' : mode === 'forgot' ? '🔑' : null;
  const modeTitle = lockedOut ? 'Locked Out' : mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Reset PIN';

  // Remove unused vars (kept for logic compat)
  void modeIcon; void modeTitle;

  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--window-bg)', position: 'relative', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
      {/* Background animated bars */}
      <AnimatedBars active={inputActive} error={shake} />

      {/* ── LEFT BRANDING PANEL (hidden on very small height) ── */}
      <div style={{
        display: 'none',
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '42%',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '32px',
        background: 'linear-gradient(160deg, rgba(124,58,237,0.12) 0%, rgba(79,70,229,0.06) 100%)',
        borderRight: '1px solid rgba(124,58,237,0.15)',
      }} />

      <motion.div
        animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'relative', zIndex: 2,
          background: 'rgba(10, 8, 20, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${shake ? 'rgba(239,68,68,0.5)' : lockedOut ? 'rgba(239,68,68,0.4)' : 'rgba(124,58,237,0.3)'}`,
          borderRadius: '20px',
          padding: '32px 28px',
          width: '90%', maxWidth: '380px',
          textAlign: 'center',
          boxShadow: shake
            ? '0 0 40px rgba(239,68,68,0.15), 0 20px 60px rgba(0,0,0,0.5)'
            : '0 0 40px rgba(124,58,237,0.12), 0 20px 60px rgba(0,0,0,0.5)',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
      >
        {/* Top glow line */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
          background: shake
            ? 'linear-gradient(90deg, transparent, rgba(239,68,68,0.8), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(124,58,237,0.8), transparent)',
          borderRadius: '100px',
          transition: 'background 0.3s',
        }} />

        {/* Header: Avatar or animated icon */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {mode === 'login' && !lockedOut && avatarData?.avatar ? (
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, ease: [0.34,1.56,0.64,1] }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 76, height: 76, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(124,58,237,0.5)', boxShadow: '0 0 30px rgba(124,58,237,0.35), 0 0 0 4px rgba(124,58,237,0.1)' }}>
                <img src={avatarData.avatar} alt={avatarData.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', fontFamily: 'Syne,sans-serif' }}>{avatarData.displayName}</div>
            </motion.div>
          ) : (
            <motion.div
              animate={loading ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={{ duration: 0.8, repeat: loading ? Infinity : 0, ease: 'easeInOut' }}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 60, height: 60, borderRadius: '18px', fontSize: '26px',
                background: lockedOut
                  ? 'linear-gradient(135deg,rgba(239,68,68,0.2),rgba(239,68,68,0.08))'
                  : mode === 'register'
                    ? 'linear-gradient(135deg,rgba(74,222,128,0.2),rgba(74,222,128,0.08))'
                    : 'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(79,70,229,0.12))',
                border: `1px solid ${lockedOut ? 'rgba(239,68,68,0.3)' : 'rgba(124,58,237,0.3)'}`,
                boxShadow: `0 0 24px ${lockedOut ? 'rgba(239,68,68,0.2)' : 'rgba(124,58,237,0.2)'}`,
              }}
            >
              {lockedOut ? '🔒' : mode === 'register' ? '✨' : mode === 'forgot' ? '🔑' : '🔐'}
            </motion.div>
          )}
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '18px', color: 'var(--text)', marginTop: '12px', marginBottom: '3px' }}>
            {modeTitle}
          </div>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', color: 'var(--text3)', letterSpacing: '3px', textTransform: 'uppercase' }}>
            PortfolioOS Admin
          </div>
        </div>

        {/* Mode Tabs */}
        {!lockedOut && step === 1 && (
          <div style={{ display: 'flex', gap: '3px', marginBottom: '22px', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: '10px' }}>
            {[{id:'login',label:'Sign In'},{id:'register',label:'Sign Up'},{id:'forgot',label:'Reset'}].map(t => (
              <button
                key={t.id}
                onClick={() => { setMode(t.id); setErr(''); setMsg(''); setShake(false); }}
                style={{
                  flex: 1, padding: '7px 4px', border: 'none', borderRadius: '8px',
                  fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: mode === t.id ? 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(79,70,229,0.25))' : 'transparent',
                  color: mode === t.id ? 'var(--lavender)' : 'var(--text3)',
                  boxShadow: mode === t.id ? 'inset 0 1px 0 rgba(167,139,250,0.2)' : 'none',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {lockedOut ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 700, color: '#F87171', fontFamily: 'Syne, sans-serif', marginBottom: '6px' }}>Too many failed attempts</div>
            <div style={{ padding: '20px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', marginBottom: '10px' }}>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#F87171', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '3px' }}>
                {formatCountdown(lockCountdown)}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace', marginTop: '4px', letterSpacing: '1px' }}>
                UNTIL UNLOCKED
              </div>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={step === 1 && mode !== 'login' ? handleSendOtpWithShake : handleSubmitWithShake}>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div key="step1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {/* Email field with label */}
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontFamily: 'JetBrains Mono,monospace', color: 'var(--text3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '5px', textAlign: 'left' }}>
                      {mode === 'login' ? 'Email / Username' : 'Email Address'}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', pointerEvents: 'none', opacity: 0.7 }}>📧</span>
                      <input
                        type="text" value={mailId} onChange={e => handleMailIdChange(e.target.value)}
                        placeholder={mode === 'login' ? 'Email or "admin"' : 'your@email.com'} className="adm-input"
                        onFocus={() => setInputActive(true)} onBlur={() => setInputActive(false)}
                        style={{ paddingLeft: '36px', fontSize: '13px', textAlign: 'left' }}
                      />
                    </div>
                  </div>
                  {mode === 'register' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontFamily: 'JetBrains Mono,monospace', color: 'var(--text3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '5px', textAlign: 'left' }}>Display Name</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', pointerEvents: 'none', opacity: 0.7 }}>👤</span>
                        <input
                          type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                          placeholder="Your Name" className="adm-input"
                          onFocus={() => setInputActive(true)} onBlur={() => setInputActive(false)}
                          style={{ paddingLeft: '36px', fontSize: '13px', textAlign: 'left' }}
                        />
                      </div>
                    </div>
                  )}
                  {/* PIN field with label */}
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontFamily: 'JetBrains Mono,monospace', color: 'var(--text3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '5px', textAlign: 'left' }}>
                      {mode === 'forgot' ? 'New PIN' : 'Access PIN'}
                    </label>
                    <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', pointerEvents: 'none', opacity: 0.7 }}>🔑</span>
                    <input
                      type={showPin ? 'text' : 'password'} value={pin} onChange={e => setPin(e.target.value)}
                      placeholder={mode === 'forgot' ? 'Set a new PIN' : '••••••••'} className="adm-input"
                      onFocus={() => setInputActive(true)} onBlur={() => setInputActive(false)}
                      style={{ paddingLeft: '36px', paddingRight: '42px', letterSpacing: showPin ? '2px' : '4px', fontSize: '14px', textAlign: 'left' }}
                    />
                    <button type="button" onClick={() => setShowPin(v => !v)}
                      style={{
                        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px',
                        opacity: 0.5, padding: '2px', lineHeight: 1,
                      }}
                      title={showPin ? 'Hide PIN' : 'Show PIN'}
                    >
                      {showPin ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {mode === 'login' && (
                   <div style={{ textAlign: 'right', marginTop: '5px' }}>
                   <button type="button"
                   onClick={() => { setMode('forgot'); setErr(''); setMsg(''); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: 'var(--text3)', fontFamily: 'JetBrains Mono,monospace', textDecoration: 'underline', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--lavender)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
                  >
                   Forgot PIN? Reset it →
                  </button>
                  </div>
                  )}
                  </div>
                  </motion.div>
              ) : (
                <motion.div key="step2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace', padding: '8px 12px', background: 'rgba(74,222,128,0.08)', borderRadius: '8px', border: '1px solid rgba(74,222,128,0.2)' }}>
                    ✉️ OTP sent to <strong style={{ color: 'var(--lavender)' }}>{mailId}</strong>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', pointerEvents: 'none' }}>🔢</span>
                    <input
                      type="text" value={otp} onChange={e => setOtp(e.target.value)}
                      placeholder="6-digit OTP" className="adm-input" autoFocus maxLength={6}
                      onFocus={() => setInputActive(true)} onBlur={() => setInputActive(false)}
                      style={{ paddingLeft: '36px', letterSpacing: '8px', fontSize: '18px', textAlign: 'center' }}
                    />
                  </div>
                  <button type="button" onClick={() => setStep(1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace', textDecoration: 'underline' }}>
                    ← Back
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {err && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ color: '#F87171', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '10px', padding: '8px', background: 'rgba(239,68,68,0.08)', borderRadius: '8px' }}>
                  ⚠ {err}
                </motion.div>
              )}
              {msg && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ color: 'var(--green)', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '10px', padding: '8px', background: 'rgba(74,222,128,0.08)', borderRadius: '8px' }}>
                  ✓ {msg}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              style={{
                width: '100%', padding: '12px', marginTop: '6px',
                background: loading ? 'rgba(124,58,237,0.45)' : 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                border: 'none', borderRadius: '12px', color: 'white',
                fontWeight: 700, fontSize: '13px',
                fontFamily: 'Syne, sans-serif',
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.5px',
                boxShadow: loading ? 'none' : '0 4px 24px rgba(124,58,237,0.4)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block' }}>⟳</motion.span>
                  Processing...
                </span>
              ) : (
                step === 1 && mode !== 'login' ? 'Send OTP →' :
                mode === 'login' ? 'Sign In →' :
                mode === 'register' ? 'Create Account →' : 'Reset PIN →'
              )}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

/* ─── Profile Section ────────────────────────────── */
const ProfileSection = ({ user, onSave }) => {
  const [form, setForm] = useState({ ...user });
  const resumeRef = useRef();

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const updateLink = (key, val) => setForm(f => ({ ...f, links: { ...f.links, [key]: val } }));

  const handleResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const b64 = await toBase64(file);
    update('resume', b64);
  };

  return (
    <div>
      <SectionTitle>Profile</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div>
          <label style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>Name</label>
          <Input value={form.name || ''} onChange={e => update('name', e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>Role</label>
          <Input value={form.role || ''} onChange={e => update('role', e.target.value)} />
        </div>
      </div>
      <div>
        <label style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>Bio</label>
        <Textarea value={form.bio || ''} onChange={e => update('bio', e.target.value)} rows={3} />
      </div>

      <SectionTitle>Resume</SectionTitle>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
        <Btn onClick={() => resumeRef.current?.click()}>📎 Upload PDF</Btn>
        {form.resume && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--green)', fontFamily: 'JetBrains Mono, monospace' }}>✓ Resume uploaded</span>}
        <input ref={resumeRef} type="file" accept=".pdf,application/pdf" style={{ display: 'none' }} onChange={handleResume} />
      </div>

      <Btn onClick={() => onSave(form)} style={{ width: '100%', padding: '10px', marginTop: '8px' }}>
        💾 Save Profile
      </Btn>
    </div>
  );
};

/* ─── Contacts Section (two separate sub-panels) ─── */
const emptyContact = { type: 'github', value: '', label: '' };
const emptySocialLink = { type: 'github', value: '', label: '' };

// Shared accordion item for a contact entry (used in both sub-panels)
const ContactItem = ({ c, idx, editing, setEditing, updateFn, deleteFn, typeOptions }) => (
  <div style={{
    background: editing === idx ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)',
    border: `1px solid ${editing === idx ? 'rgba(124,58,237,0.4)' : 'var(--border)'}`,
    borderRadius: '10px', overflow: 'hidden',
  }}>
    <div
      style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      onClick={() => setEditing(editing === idx ? null : idx)}
    >
      <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text)', fontFamily: 'Syne, sans-serif', flex: 1, fontWeight: 600 }}>
        {c.label || c.type || 'New Entry'}
      </span>
      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>
        {editing === idx ? '▲' : '▼'}
      </span>
    </div>
    {editing === idx && (
      <div style={{ padding: '0 14px 14px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <select
            value={c.type}
            onChange={e => updateFn(idx, 'type', e.target.value)}
            className="adm-input"
            style={{ marginBottom: 0, width: '120px' }}
          >
            {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <Input
            placeholder="Label (e.g. Work Email)"
            value={c.label}
            onChange={e => updateFn(idx, 'label', e.target.value)}
            style={{ flex: 1, marginBottom: 0 }}
          />
        </div>
        <Input
          placeholder="Value (URL, email address, phone...)"
          value={c.value}
          onChange={e => updateFn(idx, 'value', e.target.value)}
        />
        <Btn danger onClick={() => deleteFn(idx)}>🗑 Remove</Btn>
      </div>
    )}
  </div>
);

const SubPanelDivider = ({ label, description }) => (
  <div style={{
    padding: '14px 16px',
    background: 'rgba(124,58,237,0.06)',
    border: '1px solid rgba(124,58,237,0.2)',
    borderRadius: '10px',
    marginBottom: '12px',
  }}>
    <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, color: 'var(--lavender)', fontFamily: 'Syne, sans-serif', marginBottom: '4px' }}>
      {label}
    </div>
    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.5 }}>
      {description}
    </div>
  </div>
);

const ContactsSection = ({ user, onSave }) => {
  // ── Contact App items (shown inside the ContactApp window) ──
  const [contacts, setContacts] = useState([]);
  const [editingC, setEditingC] = useState(null);

  // ── Desktop Social Bar items (shown on the right-side floating icons) ──
  const [socialLinks, setSocialLinks] = useState([]);
  const [editingS, setEditingS] = useState(null);

  React.useEffect(() => {
    // Contact App items
    if (user.contacts && user.contacts.length > 0) {
      setContacts(user.contacts);
    } else {
      const migrated = [];
      if (user.email)    migrated.push({ type: 'email',    value: user.email,    label: 'Email'    });
      if (user.phone)    migrated.push({ type: 'phone',    value: user.phone,    label: 'Phone'    });
      if (user.location) migrated.push({ type: 'location', value: user.location, label: 'Location' });
      if (user.links) {
        Object.entries(user.links).forEach(([platform, url]) => {
          if (url && url !== '#')
            migrated.push({ type: platform, value: url, label: platform.charAt(0).toUpperCase() + platform.slice(1) });
        });
      }
      setContacts(migrated);
    }

    // Desktop social bar items
    if (user.socialLinks && user.socialLinks.length > 0) {
      setSocialLinks(user.socialLinks);
    } else if (!user.contacts && user.links) {
      // Migrate legacy links also into desktop bar
      const migrated = Object.entries(user.links)
        .filter(([, url]) => url && url !== '#')
        .map(([platform, url]) => ({ type: platform, value: url, label: platform.charAt(0).toUpperCase() + platform.slice(1) }));
      setSocialLinks(migrated);
    }
  }, [user]);

  // Contact App handlers
  const addContact    = () => { setContacts(p => [...p, { ...emptyContact }]); setEditingC(contacts.length); };
  const updateContact = (i, k, v) => setContacts(p => p.map((c, idx) => idx === i ? { ...c, [k]: v } : c));
  const deleteContact = (i) => { setContacts(p => p.filter((_, idx) => idx !== i)); setEditingC(null); };

  // Desktop social bar handlers
  const addSocial    = () => { setSocialLinks(p => [...p, { ...emptySocialLink }]); setEditingS(socialLinks.length); };
  const updateSocial = (i, k, v) => setSocialLinks(p => p.map((c, idx) => idx === i ? { ...c, [k]: v } : c));
  const deleteSocial = (i) => { setSocialLinks(p => p.filter((_, idx) => idx !== i)); setEditingS(null); };

  const contactAppTypes  = ['email', 'gmail', 'phone', 'location', 'github', 'linkedin', 'twitter', 'instagram', 'whatsapp', 'telegram', 'discord', 'facebook', 'youtube', 'portfolio', 'link'];
  const socialBarTypes   = ['github', 'linkedin', 'twitter', 'instagram', 'whatsapp', 'telegram', 'discord', 'facebook', 'youtube', 'portfolio', 'behance', 'dribbble', 'link'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* ── Panel 1: Contact App ─────────────────────── */}
      <div>
        <SubPanelDivider
          label="📱 Contact App"
          description="Entries shown inside the Contact App window (beside Terminal in the Dock). Supports email, phone, location and social links."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          {contacts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text3)', fontSize: 'var(--fs-xs)', fontFamily: 'JetBrains Mono, monospace' }}>
              No entries yet. Add your first contact below.
            </div>
          )}
          {contacts.map((c, idx) => (
            <ContactItem
              key={idx} c={c} idx={idx}
              editing={editingC} setEditing={setEditingC}
              updateFn={updateContact} deleteFn={deleteContact}
              typeOptions={contactAppTypes}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Btn onClick={addContact}>＋ Add Entry</Btn>
          <Btn
            onClick={() => onSave({ ...user, contacts })}
            style={{ flex: 1, background: 'rgba(124,58,237,0.18)', fontWeight: 700 }}
          >
            💾 Save Contact App
          </Btn>
        </div>
      </div>

      {/* ── Panel 2: Desktop Social Bar ──────────────── */}
      <div>
        <SubPanelDivider
          label="🖥️ Desktop Social Bar"
          description="Icons shown on the right-side floating nav on the desktop. Each icon redirects to the assigned URL on click. Social platforms only."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          {socialLinks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text3)', fontSize: 'var(--fs-xs)', fontFamily: 'JetBrains Mono, monospace' }}>
              No social links yet. Add your profiles below.
            </div>
          )}
          {socialLinks.map((c, idx) => (
            <ContactItem
              key={idx} c={c} idx={idx}
              editing={editingS} setEditing={setEditingS}
              updateFn={updateSocial} deleteFn={deleteSocial}
              typeOptions={socialBarTypes}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Btn onClick={addSocial}>＋ Add Social Link</Btn>
          <Btn
            onClick={() => onSave({ ...user, socialLinks })}
            style={{ flex: 1, background: 'rgba(34,211,238,0.1)', borderColor: 'rgba(34,211,238,0.35)', color: 'var(--cyan)', fontWeight: 700 }}
          >
            💾 Save Desktop Bar
          </Btn>
        </div>
      </div>

    </div>
  );
};

/* ─── Projects Section ───────────────────────────── */
const emptyProject = { name: '', desc: '', tags: [], github: '', live: '', status: 'Active', image: '' };

const ProjectsSection = ({ user, onSave }) => {
  const [projects, setProjects] = useState(user.projects || []);
  const [editing, setEditing] = useState(null);
  const imgRef = useRef();

  const addProject = () => {
    const p = { ...emptyProject, id: Date.now() };
    setProjects(prev => [...prev, p]);
    setEditing(p.id || projects.length);
  };

  const updateProject = (idx, key, val) => {
    setProjects(prev => prev.map((p, i) => i === idx ? { ...p, [key]: val } : p));
  };

  const deleteProject = (idx) => {
    setProjects(prev => prev.filter((_, i) => i !== idx));
    setEditing(null);
  };

  const handleImg = async (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const b64 = await toBase64(file);
    updateProject(idx, 'image', b64);
  };

  return (
    <div>
      <SectionTitle>Projects</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
        {projects.map((p, idx) => (
          <div
            key={idx}
            style={{
              background: editing === idx ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${editing === idx ? 'rgba(124,58,237,0.4)' : 'var(--border)'}`,
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
              onClick={() => setEditing(editing === idx ? null : idx)}
            >
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text)', fontFamily: 'Syne, sans-serif', flex: 1, fontWeight: 600 }}>{p.name || 'Untitled Project'}</span>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>{editing === idx ? '▲' : '▼'}</span>
            </div>
            {editing === idx && (
              <div style={{ padding: '0 14px 14px' }}>
                <Input placeholder="Name" value={p.name} onChange={e => updateProject(idx, 'name', e.target.value)} />
                <Textarea placeholder="Description" value={p.desc} onChange={e => updateProject(idx, 'desc', e.target.value)} rows={2} />
                <Input placeholder="Tags (comma separated)" value={p.tags?.join(', ') || ''} onChange={e => updateProject(idx, 'tags', e.target.value.split(',').map(t => t.trim()))} />
                <Input placeholder="GitHub URL" value={p.github} onChange={e => updateProject(idx, 'github', e.target.value)} />
                <Input placeholder="Live URL" value={p.live} onChange={e => updateProject(idx, 'live', e.target.value)} />
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  <select value={p.status || 'Active'} onChange={e => updateProject(idx, 'status', e.target.value)} className="adm-input" style={{ marginBottom: 0, width: 'auto' }}>
                    {['Active', 'Live', 'Archived', 'WIP'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <Btn onClick={() => document.getElementById(`img-${idx}`)?.click()}>🖼 Image</Btn>
                  <input id={`img-${idx}`} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImg(idx, e)} />
                  {p.image && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--green)', fontFamily: 'JetBrains Mono, monospace' }}>✓ img</span>}
                </div>
                <Btn danger onClick={() => deleteProject(idx)}>🗑 Remove</Btn>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Btn onClick={addProject}>＋ Add Project</Btn>
        <Btn onClick={() => onSave({ ...user, projects })} style={{ flex: 1 }}>💾 Save Projects</Btn>
      </div>
    </div>
  );
};

/* ─── Certificates Section ───────────────────────── */
const CertsSection = ({ user, onSave }) => {
  const { sessionCertificates, setSessionCertificates } = useStore();
  const [certs, setCerts] = useState(() => {
    const dbCerts = (user.certificates || []).map(c => ({
      ...c,
      storageType: c.addedAt ? 'temp' : 'persistent'
    }));
    const sCerts = sessionCertificates.map(c => ({
      ...c,
      storageType: 'session'
    }));
    return [...dbCerts, ...sCerts];
  });
  const [editing, setEditing] = useState(null);
  const [activeTab, setActiveTab] = useState('linkedin');

  const addCert = () => {
    const newCert = {
      name: '',
      issuer: '',
      date: '',
      expirationDate: '',
      doesNotExpire: true,
      credentialId: '',
      link: '',
      image: '',
      storageType: 'persistent'
    };
    setCerts(prev => [...prev, newCert]);
    setEditing(certs.length);
    setActiveTab('linkedin');
  };

  const updateCert = (idx, key, val) => setCerts(prev => prev.map((c, i) => i === idx ? { ...c, [key]: val } : c));
  const deleteCert = (idx) => { setCerts(prev => prev.filter((_, i) => i !== idx)); setEditing(null); };

  const handleImg = async (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const b64 = await toBase64(file);
    updateCert(idx, 'image', b64);
  };

  const handleEditClick = (idx) => {
    if (editing === idx) {
      setEditing(null);
    } else {
      setEditing(idx);
      const cert = certs[idx];
      if (cert.link || cert.credentialId) {
        setActiveTab('linkedin');
      } else if (cert.image) {
        setActiveTab('upload');
      } else {
        setActiveTab('linkedin');
      }
    }
  };

  const handleSaveAll = () => {
    const dbCerts = [];
    const sCerts = [];

    certs.forEach(c => {
      const { storageType, doesNotExpire, ...rest } = c;
      if (storageType === 'session') {
        sCerts.push({ ...rest, isSession: true });
      } else if (storageType === 'temp') {
        const addedAt = rest.addedAt || new Date().toISOString();
        dbCerts.push({ ...rest, addedAt });
      } else {
        const { addedAt, ...persistentCert } = rest;
        dbCerts.push(persistentCert);
      }
    });

    setSessionCertificates(sCerts);
    onSave({ ...user, certificates: dbCerts });
  };

  return (
    <div>
      <SectionTitle>Certificates</SectionTitle>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
        {certs.map((c, idx) => {
          const isSelected = editing === idx;
          const isNoExpire = c.doesNotExpire || c.expirationDate === 'Does not expire' || !c.expirationDate;
          
          return (
            <div key={idx} style={{
              background: isSelected ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${isSelected ? 'rgba(124,58,237,0.4)' : 'var(--border)'}`,
              borderRadius: '10px', overflow: 'hidden',
              transition: 'all 0.2s',
            }}>
              {/* Header block of the item */}
              <div 
                style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} 
                onClick={() => handleEditClick(idx)}
              >
                <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text)', fontFamily: 'Syne, sans-serif', flex: 1, fontWeight: 600 }}>
                  {c.name || 'Untitled Certificate'}
                </span>
                
                {/* Storage Badge */}
                <span style={{
                  fontSize: 'var(--fs-xs)',
                  fontFamily: 'JetBrains Mono, monospace',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  background: c.storageType === 'session' ? 'rgba(59,130,246,0.15)' : c.storageType === 'temp' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.12)',
                  color: c.storageType === 'session' ? '#93C5FD' : c.storageType === 'temp' ? '#FCD34D' : '#6EE7B7',
                  border: `1px solid ${c.storageType === 'session' ? 'rgba(59,130,246,0.3)' : c.storageType === 'temp' ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.2)'}`
                }}>
                  {c.storageType === 'session' ? 'Session' : c.storageType === 'temp' ? 'Temp DB' : 'DB'}
                </span>
                
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {isSelected ? '▲' : '▼'}
                </span>
              </div>

              {isSelected && (
                <div style={{ padding: '0 14px 14px' }}>
                  {/* Storage Type Selector */}
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace', marginBottom: '6px' }}>
                    STORAGE MEDIA:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    {[
                      { id: 'persistent', label: '🔒 Persistent DB', desc: 'Saved permanently' },
                      { id: 'temp', label: '⏳ Temp DB (10m)', desc: 'Auto-prunes in 10m' },
                      { id: 'session', label: '🌐 Session Only', desc: 'Volatile in memory' }
                    ].map(t => (
                      <div
                        key={t.id}
                        onClick={() => updateCert(idx, 'storageType', t.id)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          background: c.storageType === t.id ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.01)',
                          border: `1px solid ${c.storageType === t.id ? 'var(--violet)' : 'var(--border)'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, color: c.storageType === t.id ? 'var(--text)' : 'var(--text2)', fontFamily: 'Syne, sans-serif' }}>
                          {t.label}
                        </div>
                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px' }}>
                          {t.desc}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mode Tabs */}
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '14px', background: 'rgba(0,0,0,0.2)', padding: '3px', borderRadius: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab('linkedin')}
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: 'var(--fs-xs)',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: activeTab === 'linkedin' ? 'rgba(124,58,237,0.2)' : 'transparent',
                        color: activeTab === 'linkedin' ? 'var(--lavender)' : 'var(--text3)',
                        transition: 'all 0.15s'
                      }}
                    >
                      🔗 LinkedIn Credential
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('upload')}
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: 'var(--fs-xs)',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: activeTab === 'upload' ? 'rgba(124,58,237,0.2)' : 'transparent',
                        color: activeTab === 'upload' ? 'var(--lavender)' : 'var(--text3)',
                        transition: 'all 0.15s'
                      }}
                    >
                      📁 Direct Upload (Image/PDF)
                    </button>
                  </div>

                  {/* Mode Fields */}
                  {activeTab === 'linkedin' ? (
                    <div>
                      <Input placeholder="Certificate Name" value={c.name} onChange={e => updateCert(idx, 'name', e.target.value)} />
                      <Input placeholder="Issuing Organization (e.g. Google, AWS)" value={c.issuer} onChange={e => updateCert(idx, 'issuer', e.target.value)} />
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <Input placeholder="Issue Date (e.g. Jan 2024)" value={c.date} onChange={e => updateCert(idx, 'date', e.target.value)} />
                        
                        <div>
                          {isNoExpire ? (
                            <div style={{ height: '34px', display: 'flex', alignItems: 'center' }}>
                              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>Does not expire</span>
                            </div>
                          ) : (
                            <Input 
                              placeholder="Expiration Date (e.g. Dec 2026)" 
                              value={c.expirationDate === 'Does not expire' ? '' : c.expirationDate} 
                              onChange={e => updateCert(idx, 'expirationDate', e.target.value)} 
                            />
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', marginTop: '-4px' }}>
                        <input
                          type="checkbox"
                          id={`no-expire-${idx}`}
                          checked={isNoExpire}
                          onChange={e => {
                            updateCert(idx, 'doesNotExpire', e.target.checked);
                            if (e.target.checked) {
                              updateCert(idx, 'expirationDate', 'Does not expire');
                            } else {
                              updateCert(idx, 'expirationDate', '');
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                        <label htmlFor={`no-expire-${idx}`} style={{ fontSize: 'var(--fs-xs)', color: 'var(--text2)', fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer', userSelect: 'none' }}>
                          This credential does not expire
                        </label>
                      </div>

                      <Input placeholder="Credential ID (Optional)" value={c.credentialId || ''} onChange={e => updateCert(idx, 'credentialId', e.target.value)} />
                      <Input placeholder="Credential URL / Verify Link" value={c.link || ''} onChange={e => updateCert(idx, 'link', e.target.value)} />
                      
                      {/* File Upload Zone for Preview */}
                      <div style={{ marginTop: '12px' }}>
                        <label style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace', marginBottom: '8px', display: 'block' }}>
                          Preview Image (Optional, for Grid/Modal)
                        </label>
                        {c.image ? (
                          <div style={{
                            padding: '12px',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            background: 'rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px'
                          }}>
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                              <img src={c.image} alt="Uploaded Preview" style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>Preview Image Attached</span>
                            </div>
                            <Btn danger style={{ width: '100%', padding: '5px' }} onClick={() => updateCert(idx, 'image', '')}>
                              🗑 Remove Preview
                            </Btn>
                          </div>
                        ) : (
                          <div
                            onClick={() => document.getElementById(`linkedin-cert-upload-${idx}`)?.click()}
                            style={{
                              border: '1.5px dashed var(--border)',
                              borderRadius: '8px',
                              padding: '16px',
                              textAlign: 'center',
                              background: 'rgba(255,255,255,0.01)',
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--violet)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                          >
                            <span style={{ fontSize: 'var(--fs-lg)', display: 'block', marginBottom: '8px' }}>🖼️</span>
                            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--lavender)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                              Upload Preview Image
                            </span>
                            <input
                              id={`linkedin-cert-upload-${idx}`}
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={e => handleImg(idx, e)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Input placeholder="Certificate Name" value={c.name} onChange={e => updateCert(idx, 'name', e.target.value)} />
                      <Input placeholder="Issuing Organization" value={c.issuer} onChange={e => updateCert(idx, 'issuer', e.target.value)} />
                      <Input placeholder="Issue Date (e.g. Jan 2024)" value={c.date} onChange={e => updateCert(idx, 'date', e.target.value)} />

                      {/* File Upload Zone */}
                      <div style={{ marginBottom: '12px' }}>
                        {c.image ? (
                          <div style={{
                            padding: '12px',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            background: 'rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px'
                          }}>
                            {c.image.startsWith('data:application/pdf') ? (
                              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: 'var(--fs-2xl)' }}>📄</span>
                                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--lavender)', fontFamily: 'JetBrains Mono, monospace' }}>PDF Achievement Attached</span>
                                <iframe src={c.image} style={{ width: '100%', height: '140px', border: 'none', borderRadius: '4px', background: '#fff' }} title="PDF Preview" />
                              </div>
                            ) : (
                              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                <img src={c.image} alt="Uploaded Cert" style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>Image Achievement Attached</span>
                              </div>
                            )}
                            <Btn danger style={{ width: '100%', padding: '5px' }} onClick={() => updateCert(idx, 'image', '')}>
                              🗑 Remove Attachment
                            </Btn>
                          </div>
                        ) : (
                          <div
                            onClick={() => document.getElementById(`cert-upload-${idx}`)?.click()}
                            style={{
                              border: '1.5px dashed var(--border)',
                              borderRadius: '8px',
                              padding: '24px 16px',
                              textAlign: 'center',
                              background: 'rgba(255,255,255,0.01)',
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--violet)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                          >
                            <span style={{ fontSize: 'var(--fs-xl)', display: 'block', marginBottom: '8px' }}>📤</span>
                            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--lavender)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                              Upload Image or PDF
                            </span>
                            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', display: 'block', marginTop: '4px' }}>
                              Supports PNG, JPG, or PDF (Base64)
                            </span>
                            <input
                              id={`cert-upload-${idx}`}
                              type="file"
                              accept="image/*,application/pdf"
                              style={{ display: 'none' }}
                              onChange={e => handleImg(idx, e)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <Btn danger onClick={() => deleteCert(idx)} style={{ marginTop: '8px' }}>🗑 Remove Certificate</Btn>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <Btn onClick={addCert}>＋ Add Certificate</Btn>
        <Btn onClick={handleSaveAll} style={{ flex: 1 }}>💾 Save Certificates</Btn>
      </div>
    </div>
  );
};

/* ─── Education Section ──────────────────────────── */
const emptyEdu = { degree: '', school: '', year: '', cgpa: '', location: '', initials: '', logo: '' };

const EducationSection = ({ user, onSave }) => {
  const [education, setEducation] = useState(user.education || []);
  const [editing, setEditing] = useState(null);

  const addEdu = () => { setEducation(prev => [...prev, { ...emptyEdu }]); setEditing(education.length); };
  const updateEdu = (idx, key, val) => setEducation(prev => prev.map((e, i) => i === idx ? { ...e, [key]: val } : e));
  const deleteEdu = (idx) => { setEducation(prev => prev.filter((_, i) => i !== idx)); setEditing(null); };

  const handleLogo = async (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const b64 = await toBase64(file);
    updateEdu(idx, 'logo', b64);
  };

  return (
    <div>
      <SectionTitle>Education</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
        {education.map((e, idx) => (
          <div key={idx} style={{
            background: editing === idx ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${editing === idx ? 'rgba(124,58,237,0.4)' : 'var(--border)'}`,
            borderRadius: '10px', overflow: 'hidden',
          }}>
            <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setEditing(editing === idx ? null : idx)}>
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text)', fontFamily: 'Syne, sans-serif', flex: 1, fontWeight: 600 }}>{e.degree || 'Untitled'}</span>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>{editing === idx ? '▲' : '▼'}</span>
            </div>
            {editing === idx && (
              <div style={{ padding: '0 14px 14px' }}>
                <Input placeholder="Degree / Qualification" value={e.degree} onChange={ev => updateEdu(idx, 'degree', ev.target.value)} />
                <Input placeholder="School / University" value={e.school} onChange={ev => updateEdu(idx, 'school', ev.target.value)} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <Input placeholder="Year (e.g. 2020-2024)" value={e.year} onChange={ev => updateEdu(idx, 'year', ev.target.value)} />
                  <Input placeholder="CGPA" value={e.cgpa} onChange={ev => updateEdu(idx, 'cgpa', ev.target.value)} />
                  <Input placeholder="Initials (e.g. MIT)" value={e.initials} onChange={ev => updateEdu(idx, 'initials', ev.target.value)} />
                </div>
                <Input placeholder="Location" value={e.location} onChange={ev => updateEdu(idx, 'location', ev.target.value)} />
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  <Btn onClick={() => document.getElementById(`edu-logo-${idx}`)?.click()}>🖼 Upload Logo</Btn>
                  <input id={`edu-logo-${idx}`} type="file" accept="image/*" style={{ display: 'none' }} onChange={ev => handleLogo(idx, ev)} />
                  {e.logo && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--green)', fontFamily: 'JetBrains Mono, monospace' }}>✓ logo</span>}
                </div>
                <Btn danger onClick={() => deleteEdu(idx)}>🗑 Remove</Btn>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Btn onClick={addEdu}>＋ Add Education</Btn>
        <Btn onClick={() => onSave({ ...user, education })} style={{ flex: 1 }}>💾 Save Education</Btn>
      </div>
    </div>
  );
};

/* ─── Skills Section ─────────────────────────────── */
const SkillsSection = ({ user, onSave }) => {
  const [skills, setSkills] = useState(user.skills || {});
  const [editingCat, setEditingCat] = useState(null);
  
  const addCategory = () => {
    const catName = prompt('Enter new category name:');
    if (catName && !skills[catName]) {
      setSkills(prev => ({ ...prev, [catName]: [] }));
      setEditingCat(catName);
    }
  };

  const deleteCategory = (cat) => {
    if(confirm(`Delete category ${cat}?`)) {
      const newSkills = { ...skills };
      delete newSkills[cat];
      setSkills(newSkills);
      setEditingCat(null);
    }
  };

  const addSkill = (cat) => {
    const newSkills = { ...skills };
    newSkills[cat] = [...newSkills[cat], ['New Skill', 50]];
    setSkills(newSkills);
  };

  const updateSkill = (cat, idx, key, val) => {
    const newSkills = { ...skills };
    const skillList = [...newSkills[cat]];
    skillList[idx] = key === 'name' ? [val, skillList[idx][1]] : [skillList[idx][0], parseInt(val) || 0];
    newSkills[cat] = skillList;
    setSkills(newSkills);
  };

  const deleteSkill = (cat, idx) => {
    const newSkills = { ...skills };
    newSkills[cat] = newSkills[cat].filter((_, i) => i !== idx);
    setSkills(newSkills);
  };

  return (
    <div>
      <SectionTitle>Skills</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
        {Object.entries(skills).map(([category, skillList]) => (
          <div key={category} style={{
            background: editingCat === category ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${editingCat === category ? 'rgba(124,58,237,0.4)' : 'var(--border)'}`,
            borderRadius: '10px', overflow: 'hidden',
          }}>
            <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setEditingCat(editingCat === category ? null : category)}>
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text)', fontFamily: 'Syne, sans-serif', flex: 1, fontWeight: 600 }}>{category}</span>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>{editingCat === category ? '▲' : '▼'}</span>
            </div>
            {editingCat === category && (
              <div style={{ padding: '0 14px 14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
                  {skillList.map((skill, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Input placeholder="Skill Name" value={skill[0]} onChange={e => updateSkill(category, idx, 'name', e.target.value)} style={{ flex: 1, marginBottom: 0 }} />
                      <Input type="number" placeholder="%" value={skill[1]} onChange={e => updateSkill(category, idx, 'level', e.target.value)} style={{ width: '60px', marginBottom: 0 }} />
                      <Btn danger onClick={() => deleteSkill(category, idx)}>🗑</Btn>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Btn onClick={() => addSkill(category)}>＋ Add Skill to {category}</Btn>
                  <Btn danger onClick={() => deleteCategory(category)}>🗑 Delete Category</Btn>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Btn onClick={addCategory}>＋ Add Category</Btn>
        <Btn onClick={() => onSave({ ...user, skills })} style={{ flex: 1 }}>💾 Save Skills</Btn>
      </div>
    </div>
  );
};

/* ─── Fun Facts Section ──────────────────────────── */
const FunFactsSection = ({ user, onSave }) => {
  const [facts, setFacts] = useState(user.funFacts || []);
  const [editing, setEditing] = useState(null);

  const addFact = () => { setFacts(prev => [...prev, { title: 'New Fact', text: '' }]); setEditing(facts.length); };
  const updateFact = (idx, key, val) => setFacts(prev => prev.map((f, i) => i === idx ? { ...f, [key]: val } : f));
  const deleteFact = (idx) => { setFacts(prev => prev.filter((_, i) => i !== idx)); setEditing(null); };

  return (
    <div>
      <SectionTitle>Fun Facts</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
        {facts.map((fact, idx) => (
          <div key={idx} style={{
            background: editing === idx ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${editing === idx ? 'rgba(124,58,237,0.4)' : 'var(--border)'}`,
            borderRadius: '10px', overflow: 'hidden',
          }}>
            <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setEditing(editing === idx ? null : idx)}>
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text)', fontFamily: 'Syne, sans-serif', flex: 1, fontWeight: 600 }}>{fact.title || 'Untitled'}</span>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>{editing === idx ? '▲' : '▼'}</span>
            </div>
            {editing === idx && (
              <div style={{ padding: '0 14px 14px' }}>
                <Input placeholder="Fact Title" value={fact.title} onChange={e => updateFact(idx, 'title', e.target.value)} />
                <Textarea placeholder="Fact Description" value={fact.text} onChange={e => updateFact(idx, 'text', e.target.value)} rows={3} />
                <Btn danger onClick={() => deleteFact(idx)}>🗑 Remove</Btn>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Btn onClick={addFact}>＋ Add Fact</Btn>
        <Btn onClick={() => onSave({ ...user, funFacts: facts })} style={{ flex: 1 }}>💾 Save Facts</Btn>
      </div>
    </div>
  );
};

/* ─── Git Log Section ────────────────────────────── */
const GitLogSection = ({ user, onSave }) => {
  const [gitLog, setGitLog] = useState(user.gitLog || []);
  const [editing, setEditing] = useState(null);

  const addLog = () => { 
    const hash = Math.random().toString(16).substr(2, 7);
    setGitLog(prev => [...prev, [hash, 'New commit message']]); 
    setEditing(gitLog.length); 
  };
  const updateLog = (idx, key, val) => setGitLog(prev => {
    const updated = [...prev];
    updated[idx] = key === 'date' ? [val, updated[idx][1]] : [updated[idx][0], val];
    return updated;
  });
  const deleteLog = (idx) => { setGitLog(prev => prev.filter((_, i) => i !== idx)); setEditing(null); };

  return (
    <div>
      <SectionTitle>Git Log</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
        {gitLog.map((log, idx) => (
          <div key={idx} style={{
            background: editing === idx ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${editing === idx ? 'rgba(124,58,237,0.4)' : 'var(--border)'}`,
            borderRadius: '10px', overflow: 'hidden',
          }}>
            <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setEditing(editing === idx ? null : idx)}>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--violet)', fontFamily: 'JetBrains Mono, monospace' }}>* {log[0]}</span>
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log[1]}</span>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>{editing === idx ? '▲' : '▼'}</span>
            </div>
            {editing === idx && (
              <div style={{ padding: '0 14px 14px' }}>
                <Input placeholder="Hash / Date" value={log[0]} onChange={e => updateLog(idx, 'date', e.target.value)} />
                <Input placeholder="Commit Message" value={log[1]} onChange={e => updateLog(idx, 'msg', e.target.value)} />
                <Btn danger onClick={() => deleteLog(idx)}>🗑 Remove</Btn>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Btn onClick={addLog}>＋ Add Commit</Btn>
        <Btn onClick={() => onSave({ ...user, gitLog })} style={{ flex: 1 }}>💾 Save Git Log</Btn>
      </div>
    </div>
  );
};

/* ─── Terminal Section ────────────────────────────── */
const TerminalSection = ({ user, onSave }) => {
  const [terminalSettings, setTerminalSettings] = useState(user.terminalSettings || { fontSize: 14, fontColor: '#E2D9F3', fontStyle: 'JetBrains Mono, monospace' });
  const [customCommands, setCustomCommands] = useState(user.customCommands || []);
  const [editingCmd, setEditingCmd] = useState(null);
  const [showPresets, setShowPresets] = useState(false);

  const updateSetting = (k, v) => setTerminalSettings(p => ({ ...p, [k]: v }));

  const addCmd = () => { 
    setCustomCommands(prev => [...prev, { cmd: 'new_command', output: 'Custom output here' }]); 
    setEditingCmd(customCommands.length); 
  };

  const customizePreset = (presetCmd) => {
    const existingIdx = customCommands.findIndex(c => c && c.cmd && c.cmd.toLowerCase().trim() === presetCmd.cmd.toLowerCase().trim());
    if (existingIdx >= 0) {
      setEditingCmd(existingIdx);
    } else {
      const defaultOutput = replacePlaceholders(presetCmd.defaultOutput, user);
      const updated = [...customCommands, { cmd: presetCmd.cmd, output: defaultOutput }];
      setCustomCommands(updated);
      setEditingCmd(updated.length - 1);
    }
  };

  const updateCmd = (idx, key, val) => setCustomCommands(prev => prev.map((c, i) => i === idx ? { ...c, [key]: val } : c));
  const deleteCmd = (idx) => { setCustomCommands(prev => prev.filter((_, i) => i !== idx)); setEditingCmd(null); };

  const handleSave = () => {
    const uniqueCommands = [];
    const seen = new Set();
    
    customCommands.forEach(c => {
      if (!c.cmd || !String(c.cmd).trim()) return;
      const cmdKey = String(c.cmd).trim().toLowerCase();
      if (!seen.has(cmdKey)) {
        seen.add(cmdKey);
        uniqueCommands.push({ ...c, cmd: String(c.cmd).trim() });
      }
    });
    
    setCustomCommands(uniqueCommands);
    onSave({ ...user, terminalSettings, customCommands: uniqueCommands });
  };

  const customCmdKeys = new Set(customCommands.map(c => c && c.cmd ? c.cmd.toLowerCase().trim() : ''));

  return (
    <div>
      <SectionTitle>Terminal Appearance</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
        <div>
          <label style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>Font Size ({terminalSettings.fontSize}px)</label>
          <input 
            type="range" 
            min="10" max="24" 
            value={terminalSettings.fontSize} 
            onChange={e => updateSetting('fontSize', Number(e.target.value))} 
            style={{ width: '100%', marginBottom: '8px' }}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>Font Color</label>
            <Input type="color" value={terminalSettings.fontColor} onChange={e => updateSetting('fontColor', e.target.value)} style={{ height: '40px', padding: '2px' }} />
          </div>
          <div>
            <label style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>Font Style</label>
            <select value={terminalSettings.fontStyle} onChange={e => updateSetting('fontStyle', e.target.value)} className="adm-input" style={{ marginBottom: 0 }}>
              <option value="JetBrains Mono, monospace">JetBrains Mono</option>
              <option value="Fira Code, monospace">Fira Code</option>
              <option value="Consolas, monospace">Consolas</option>
              <option value="Courier New, monospace">Courier New</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <SectionTitle style={{ marginBottom: 0 }}>Terminal Commands Manager</SectionTitle>
        <Btn onClick={() => setShowPresets(!showPresets)} style={{ fontSize: 'var(--fs-xs)' }}>
          {showPresets ? '🙈 Hide Presets' : '📋 Browse All Preset Commands'}
        </Btn>
      </div>

      {showPresets && (
        <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border)', borderRadius: '10px' }}>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text2)', marginBottom: '10px', fontFamily: 'JetBrains Mono, monospace' }}>
            Click <strong>"✏️ Customize"</strong> next to any command (e.g. <code>whoami</code>) to edit its output.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
            {DEFAULT_TERMINAL_COMMANDS.map((preset, pIdx) => {
              const isOverridden = customCmdKeys.has(preset.cmd.toLowerCase().trim());
              return (
                <div key={pIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--violet)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>${preset.cmd}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text3)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>{preset.category || 'System'}</span>
                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{preset.description}</span>
                  </div>
                  <button
                    onClick={() => customizePreset(preset)}
                    style={{
                      padding: '3px 8px',
                      fontSize: '11px',
                      borderRadius: '5px',
                      border: isOverridden ? '1px solid var(--violet)' : '1px solid rgba(255,255,255,0.1)',
                      background: isOverridden ? 'rgba(124,58,237,0.2)' : 'transparent',
                      color: isOverridden ? 'var(--lavender)' : 'var(--text2)',
                      cursor: 'pointer',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  >
                    {isOverridden ? '✏️ Edit Customization' : '✏️ Customize'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <SectionTitle>Active & Custom Commands ({customCommands.length})</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
        {customCommands.length === 0 && (
          <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text3)', fontSize: 'var(--fs-xs)', fontFamily: 'JetBrains Mono, monospace' }}>
            No custom or overridden commands yet. Browse presets above or click "＋ Add Command".
          </div>
        )}
        {customCommands.map((cmd, idx) => (
          <div key={idx} style={{
            background: editingCmd === idx ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${editingCmd === idx ? 'rgba(124,58,237,0.4)' : 'var(--border)'}`,
            borderRadius: '10px', overflow: 'hidden',
          }}>
            <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setEditingCmd(editingCmd === idx ? null : idx)}>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--violet)', fontFamily: 'JetBrains Mono, monospace' }}>$</span>
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace', flex: 1, fontWeight: 600 }}>{cmd.cmd || 'Untitled'}</span>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>{editingCmd === idx ? '▲' : '▼'}</span>
            </div>
            {editingCmd === idx && (
              <div style={{ padding: '0 14px 14px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text3)', display: 'block', marginBottom: '4px', fontFamily: 'JetBrains Mono, monospace' }}>Command Name</label>
                <Input placeholder="Command (e.g. whoami or sudo update)" value={cmd.cmd} onChange={e => updateCmd(idx, 'cmd', e.target.value)} />
                <label style={{ fontSize: '11px', color: 'var(--text3)', display: 'block', marginBottom: '4px', fontFamily: 'JetBrains Mono, monospace' }}>Output Content (Supports placeholders like &#123;name&#125;, &#123;role&#125;, &#123;email&#125;)</label>
                <Textarea placeholder="Output (multi-line supported)" value={cmd.output} onChange={e => updateCmd(idx, 'output', e.target.value)} rows={5} />
                <Btn danger onClick={() => deleteCmd(idx)}>🗑 Remove Command Override</Btn>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Btn onClick={addCmd}>＋ Add Command</Btn>
        <Btn onClick={handleSave} style={{ flex: 1 }}>💾 Save Terminal Settings</Btn>
      </div>
    </div>
  );
};



/* ─── Main AdminApp ──────────────────────────────── */
const SECTIONS = [
  { id: 'profile', label: '👤 Profile' },
  { id: 'contacts', label: '📞 Contacts' },
  { id: 'projects', label: '📁 Projects' },
  { id: 'certificates', label: '🏆 Certificates' },
  { id: 'education', label: '🎓 Education' },
  { id: 'skills', label: '⚡ Skills' },
  { id: 'facts', label: '✨ Fun Facts' },
  { id: 'gitlog', label: '🕐 Git Log' },
  { id: 'terminal', label: '💻 Terminal' },
  { id: 'security', label: '🔐 Security' },
];

const AdminApp = () => {
  const { user, syncBackend, logoutAdmin, validateStoredSession } = useStore();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [section, setSection] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [locking, setLocking] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [securityUnlocked, setSecurityUnlocked] = useState(false);
  const isMobile = useIsMobile(768);

  // ── Validate stored session on every mount (covers page refresh) ──
  React.useEffect(() => {
    let cancelled = false;
    validateStoredSession().then((valid) => {
      if (!cancelled) {
        setAuthed(valid);
        setChecking(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  // ── AUTO-LOCK ON WINDOW CLOSE ─────────────────────────────────────
  // When the OS window is closed, React unmounts AdminApp.
  // The cleanup function fires synchronously on unmount — it clears the
  // localStorage token immediately (no await needed for the guarantee).
  // The server logout is fire-and-forget so it doesn't block unmount.
  React.useEffect(() => {
    return () => {
      // Synchronous: wipe the stored token immediately
      try { localStorage.removeItem('adm_session_v2'); } catch (_) {}
      // Fire-and-forget: tell the server to invalidate too
      try {
        const raw = null; // token already wiped — send empty to clean server side
        navigator.sendBeacon('/api/logout'); // best-effort beacon (works even during unload)
      } catch (_) {}
    };
  }, []);

  if (checking) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'var(--window-bg)' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'var(--fs-xs)', color: 'var(--text3)' }}>🔐 Verifying session...</div>
      </div>
    );
  }

  if (!authed) {
    return <AuthGate onAuth={() => setAuthed(true)} />;
  }

  const handleSave = async (updatedUser) => {
    setSaving(true);
    setSaveStatus('');
    const ok = await syncBackend(updatedUser);
    setSaving(false);
    setSaveStatus(ok ? '✅ Saved to database' : '❌ Save failed — session may have expired');
    setTimeout(() => setSaveStatus(''), 4000);
  };

  // ── Manual lock: wipes token + server session, shows password gate ──
  const handleLock = async () => {
    setLocking(true);
    try { localStorage.removeItem('adm_session_v2'); } catch (_) {}
    await logoutAdmin().catch(() => {});
    setLocking(false);
    setAuthed(false);
  };

  const handleLogout = handleLock; // Security section reuses the same handler

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100%', background: 'var(--window-bg)', position: 'relative' }}>
      {/* PIN Step-Up Modal for Security section */}
      <PinStepUpModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onSuccess={() => { setPinModalOpen(false); setSecurityUnlocked(true); setSection('security'); }}
        title="Security Access"
        description="Verify your PIN to access security settings."
      />

      {/* ── Sidebar (desktop) / Tab-bar (mobile) ── */}
      {isMobile ? (
        /* Mobile: horizontal scrolling tab-bar */
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '4px',
          padding: '8px',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(0,0,0,0.25)',
          scrollbarWidth: 'none',
          flexShrink: 0,
        }}>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => {
                if (s.id === 'security' && !securityUnlocked) {
                  setPinModalOpen(true);
                } else {
                  setSection(s.id);
                }
              }}
              style={{
                flexShrink: 0,
                padding: '6px 12px',
                borderRadius: '8px',
                border: `1px solid ${section === s.id ? 'rgba(124,58,237,0.5)' : 'var(--border)'}`,
                background: section === s.id ? 'rgba(124,58,237,0.18)' : 'rgba(255,255,255,0.03)',
                color: section === s.id ? 'var(--lavender)' : 'var(--text3)',
                fontSize: 'var(--fs-xs)',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {s.label}
            </button>
          ))}
          {/* Lock button in tab-bar */}
          <button
            onClick={handleLock}
            disabled={locking}
            style={{
              flexShrink: 0,
              marginLeft: 'auto',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(239,68,68,0.35)',
              background: 'rgba(239,68,68,0.08)',
              color: '#F87171',
              fontSize: 'var(--fs-xs)',
              fontFamily: 'JetBrains Mono, monospace',
              cursor: locking ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            🔒
          </button>
        </div>
      ) : (
        /* Desktop: vertical sidebar */
        <div style={{
          width: '180px',
          borderRight: '1px solid var(--border)',
          padding: '16px 8px',
          background: 'rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          flexShrink: 0,
        }}>
          {/* Admin profile preview */}
          {user && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 8px 14px',
              borderBottom: '1px solid var(--border)',
              marginBottom: '10px',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: user.avatar ? 'transparent' : 'linear-gradient(135deg,#7C3AED,#4F46E5)',
                border: '2px solid rgba(124,58,237,0.4)',
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', color: 'white', fontFamily: 'Syne,sans-serif', fontWeight: 700,
              }}>
                {user.avatar
                  ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : (user.displayName || user.name || 'A')[0].toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', fontFamily: 'Syne,sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.displayName || user.name || 'Admin'}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'JetBrains Mono,monospace', letterSpacing: '1px' }}>
                  ADMIN
                </div>
              </div>
            </div>
          )}
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '2px', textTransform: 'uppercase', padding: '0 8px', marginBottom: '8px' }}>
            Dashboard
          </div>

          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => {
                if (s.id === 'security' && !securityUnlocked) {
                  setPinModalOpen(true);
                } else {
                  setSection(s.id);
                }
              }}
              className={`adm-sidebar-item ${section === s.id ? 'active' : ''}`}
            >
              {s.label}
            </button>
          ))}

          {/* ── Save status toast ── */}
          {saveStatus && (
            <div style={{
              marginTop: '8px', padding: '8px',
              background: saveStatus.startsWith('✅') ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${saveStatus.startsWith('✅') ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.25)'}`,
              borderRadius: '8px', fontSize: 'var(--fs-xs)',
              color: saveStatus.startsWith('✅') ? 'var(--green)' : '#F87171',
              fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.4,
            }}>
              {saveStatus}
            </div>
          )}

          {/* ── 🔒 LOCK BUTTON — always pinned at sidebar bottom ── */}
          <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
            <button
              onClick={handleLock}
              disabled={locking}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(239,68,68,0.35)',
                background: locking ? 'rgba(239,68,68,0.05)' : 'rgba(239,68,68,0.08)',
                color: '#F87171',
                fontSize: 'var(--fs-xs)',
                fontFamily: 'JetBrains Mono, monospace',
                cursor: locking ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'background 0.15s, border-color 0.15s',
                opacity: locking ? 0.6 : 1,
              }}
              onMouseEnter={e => { if (!locking) e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = locking ? 'rgba(239,68,68,0.05)' : 'rgba(239,68,68,0.08)'; }}
            >
              {locking ? '⏳ Locking...' : '🔒 Lock Panel'}
            </button>
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <div style={{ flex: 1, overflow: 'auto', padding: isMobile ? '14px 16px' : '20px 24px' }}>
        {/* Mobile save status */}
        {isMobile && saveStatus && (
          <div style={{
            marginBottom: '10px', padding: '8px 12px',
            background: saveStatus.startsWith('✅') ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.08)',
            border: `1px solid ${saveStatus.startsWith('✅') ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.25)'}`,
            borderRadius: '8px', fontSize: 'var(--fs-xs)',
            color: saveStatus.startsWith('✅') ? 'var(--green)' : '#F87171',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            {saveStatus}
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18 }}
          >
            {section === 'profile' && <ProfileSection user={user || {}} onSave={handleSave} />}
            {section === 'contacts' && <ContactsSection user={user || {}} onSave={handleSave} />}
            {section === 'projects' && <ProjectsSection user={user || {}} onSave={handleSave} />}
            {section === 'certificates' && <CertsSection user={user || {}} onSave={handleSave} />}
            {section === 'education' && <EducationSection user={user || {}} onSave={handleSave} />}
            {section === 'skills' && <SkillsSection user={user || {}} onSave={handleSave} />}
            {section === 'facts' && <FunFactsSection user={user || {}} onSave={handleSave} />}
            {section === 'gitlog' && <GitLogSection user={user || {}} onSave={handleSave} />}
            {section === 'terminal' && <TerminalSection user={user || {}} onSave={handleSave} />}
            {section === 'security' && <AccountProfile onLogout={handleLogout} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminApp;

