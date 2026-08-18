import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import DoubleAuthModal from './DoubleAuthModal';

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

/* ─── Avatar ─── */
const Avatar = ({ src, name, size = 80, isAdmin }) => {
  const initials = name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: src ? 'transparent' : (isAdmin ? 'linear-gradient(135deg,#7C3AED,#4F46E5)' : 'linear-gradient(135deg,#6366F1,#8B5CF6)'),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, color: 'white',
      fontFamily: 'Syne,sans-serif', border: '2px solid rgba(124,58,237,0.4)',
      overflow: 'hidden', flexShrink: 0, boxShadow: '0 0 24px rgba(124,58,237,0.3)',
    }}>
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
    </div>
  );
};

/* ─── Section Title ─── */
const ST = ({ icon, children }) => (
  <div style={{
    fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
    color: 'var(--violet)', fontFamily: 'JetBrains Mono,monospace',
    fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px',
  }}>
    {icon && <span>{icon}</span>}
    <span style={{ color: 'var(--text3)' }}>//</span> {children}
  </div>
);

/* ─── Button ─── */
const Btn = ({ children, onClick, danger, secondary, disabled, style }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: '9px 18px',
    border: `1px solid ${danger ? 'rgba(239,68,68,0.4)' : secondary ? 'var(--border)' : 'rgba(124,58,237,0.4)'}`,
    borderRadius: '9px',
    background: danger ? 'rgba(239,68,68,0.1)' : secondary ? 'rgba(255,255,255,0.04)' : 'rgba(124,58,237,0.12)',
    color: danger ? '#F87171' : secondary ? 'var(--text2)' : 'var(--lavender)',
    fontSize: '12px', fontFamily: 'JetBrains Mono,monospace',
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
    transition: 'all 0.15s', ...style,
  }}>{children}</button>
);

/* ─── Status Banner ─── */
const StatusMsg = ({ msg }) => (
  <AnimatePresence>
    {msg && (
      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        style={{
          marginTop: '10px', padding: '8px 12px', borderRadius: '8px', fontSize: '12px',
          fontFamily: 'JetBrains Mono,monospace',
          background: msg.startsWith('✅') ? 'rgba(74,222,128,0.08)' : 'rgba(239,68,68,0.08)',
          border: `1px solid ${msg.startsWith('✅') ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)'}`,
          color: msg.startsWith('✅') ? 'var(--green)' : '#F87171',
        }}>{msg}</motion.div>
    )}
  </AnimatePresence>
);

/* ─── OTP Step Input ─── */
const OtpInput = ({ value, onChange, onBack, label }) => (
  <div>
    <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'JetBrains Mono,monospace', marginBottom: '8px' }}>
      ✉️ {label}
    </div>
    <input value={value} onChange={onChange} maxLength={6} autoFocus
      placeholder="6-digit OTP" className="adm-input"
      style={{ letterSpacing: '6px', textAlign: 'center', fontSize: '16px', marginBottom: '8px' }} />
    <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: 'var(--text3)', fontFamily: 'JetBrains Mono,monospace', textDecoration: 'underline' }}>← Back</button>
  </div>
);

/* ─── Erase Confirm Modal (PIN-only) ───────────────────────────────── */
const EraseConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [typed, setTyped] = useState(false);

  const reset = () => { setPin(''); setErr(''); setLoading(false); setTyped(false); setShowPin(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pin.trim()) { setErr('Enter your access PIN to confirm.'); return; }
    setLoading(true); setErr('');
    const res = await onConfirm(pin);
    setLoading(false);
    if (res?.ok) { reset(); onClose(); }
    else setErr(res?.error || 'Incorrect PIN. Try again.');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 9999,
        }}>
          <motion.div onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              background: 'var(--window-bg)', border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: '18px', padding: '32px 28px', width: '360px', maxWidth: '94vw',
              boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(239,68,68,0.08)',
            }}>
            {/* Warning icon */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <motion.div animate={{ rotate: [0, -8, 8, -8, 0] }} transition={{ delay: 0.2, duration: 0.5 }}
                style={{ fontSize: '40px', display: 'inline-block' }}>⚠️</motion.div>
            </div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '17px', color: '#F87171', textAlign: 'center', marginBottom: '6px' }}>
              Erase All Portfolio Data?
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'JetBrains Mono,monospace', textAlign: 'center', marginBottom: '20px', lineHeight: 1.7 }}>
              This will permanently delete <span style={{ color: '#F87171', fontWeight: 700 }}>ALL</span> projects, skills,<br />
              education, and certificates. <span style={{ color: '#F87171' }}>This cannot be undone.</span><br /><br />
              Enter your <strong style={{ color: 'var(--text)' }}>Access PIN</strong> to confirm.
            </div>

            {/* Danger stripe */}
            <div style={{
              display: 'flex', gap: '3px', marginBottom: '18px', overflow: 'hidden', borderRadius: '6px',
            }}>
              {Array.from({ length: 18 }).map((_, i) => (
                <motion.div key={i}
                  initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  style={{ flex: 1, height: '4px', background: i % 2 === 0 ? 'rgba(239,68,68,0.6)' : 'rgba(239,68,68,0.15)', borderRadius: '2px' }} />
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <input
                  type={showPin ? 'text' : 'password'} value={pin}
                  onChange={e => { setPin(e.target.value); setTyped(true); setErr(''); }}
                  placeholder="Enter your Access PIN" autoFocus className="adm-input"
                  style={{ width: '100%', textAlign: 'center', letterSpacing: showPin ? '1px' : '4px', paddingRight: '40px', boxSizing: 'border-box',
                    borderColor: err ? 'rgba(239,68,68,0.6)' : undefined }}
                />
                <button type="button" onClick={() => setShowPin(v => !v)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', opacity: 0.5 }}>
                  {showPin ? '🙈' : '👁️'}
                </button>
              </div>

              {err && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  style={{ fontSize: '11px', color: '#F87171', fontFamily: 'JetBrains Mono,monospace', marginBottom: '12px', textAlign: 'center' }}>
                  ❌ {err}
                </motion.div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => { reset(); onClose(); }}
                  style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text2)', fontSize: '12px', fontFamily: 'JetBrains Mono,monospace', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={loading || !pin.trim()}
                  style={{ flex: 1, padding: '10px', background: loading || !pin.trim() ? 'rgba(239,68,68,0.2)' : 'linear-gradient(135deg,#EF4444,#B91C1C)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, fontSize: '12px', fontFamily: 'Syne,sans-serif', cursor: loading || !pin.trim() ? 'not-allowed' : 'pointer', opacity: loading || !pin.trim() ? 0.6 : 1 }}>
                  {loading ? '⏳ Verifying...' : '🗑️ Erase Everything'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════════════════════ */
const AccountProfile = ({ onLogout }) => {
  const {
    currentUser, fetchProfile, updateProfile,
    resetPin, eraseData,
    sendChangeEmailOldOtp, verifyChangeEmailOld,
    sendNewEmailOtp, confirmChangeEmail,
    sendOtp,
  } = useStore();

  const avatarInputRef = useRef();
  const isSudoAdmin = currentUser?.mailId === 'single_user' || currentUser?.isAdmin;
  const displayMailId = currentUser?.mailId === 'single_user' ? 'sudo@portfolioos.local' : (currentUser?.mailId || '—');

  /* ── Profile state ── */
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || '');
  const [editingName, setEditingName] = useState(false);
  const [profileStatus, setProfileStatus] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  /* ── PIN change ── */
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [pinStatus, setPinStatus] = useState('');

  /* ── Double-auth modal (PIN change only) ── */
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  /* ── Erase confirm modal ── */
  const [eraseModalOpen, setEraseModalOpen] = useState(false);
  const [eraseStatus, setEraseStatus] = useState('');

  /* ── Email change wizard ── */
  // emailStep: 'idle' | 'verify_old' | 'enter_old_otp' | 'enter_new' | 'enter_new_otp' | 'done'
  const [emailStep, setEmailStep] = useState('idle');
  const [oldOtp, setOldOtp] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newEmailOtp, setNewEmailOtp] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  useEffect(() => { fetchProfile(); }, []);
  useEffect(() => {
    if (currentUser?.displayName) setDisplayName(currentUser.displayName);
    if (currentUser?.avatar !== undefined) setAvatarPreview(currentUser.avatar);
  }, [currentUser]);

  const flash = (setter, msg) => { setter(msg); setTimeout(() => setter(''), 5000); };

  /* ── Avatar ── */
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { flash(setProfileStatus, '❌ Image must be under 2MB'); return; }
    const b64 = await toBase64(file);
    setAvatarPreview(b64);
  };

  /* ── Save profile ── */
  const handleSaveProfile = async () => {
    if (!displayName.trim()) { flash(setProfileStatus, '❌ Display name cannot be empty'); return; }
    setSavingProfile(true); setProfileStatus('');
    const updates = { displayName: displayName.trim() };
    if (avatarPreview !== currentUser?.avatar) updates.avatar = avatarPreview;
    const res = await updateProfile(updates);
    setSavingProfile(false);
    flash(setProfileStatus, res.ok ? '✅ Profile saved!' : `❌ ${res.error || 'Failed to save.'}`);
    if (res.ok) setEditingName(false);
  };

  /* ── PIN change via double-auth ── */
  const requestAction = (action) => {
    if (action === 'change_pin') {
      if (!newPw || newPw !== confirmPw) { setPinStatus('❌ PINs do not match.'); return; }
      if (newPw.length < 4) { setPinStatus('❌ PIN must be at least 4 characters.'); return; }
    }
    setPendingAction(action);
    setAuthModalOpen(true);
    setPinStatus('');
  };

  const handleActionSuccess = async (otp) => {
    if (pendingAction === 'change_pin') {
      const res = await resetPin(currentUser?.mailId || 'admin', otp, newPw);
      flash(setPinStatus, res.ok ? '✅ PIN changed successfully.' : `❌ ${res.error || 'Failed to change PIN.'}`);
      if (res.ok) { setNewPw(''); setConfirmPw(''); }
    }
  };

  /* ── Erase handler (PIN-based) ── */
  const handleEraseConfirm = async (pin) => {
    const res = await eraseData(pin);
    if (res.ok) {
      flash(setEraseStatus, `✅ ${res.msg || 'All data erased.'}`);
      return { ok: true };
    }
    return { ok: false, error: res.error };
  };

  /* ══ Email wizard handlers ══ */
  const startEmailChange = async () => {
    setEmailLoading(true); setEmailStatus('');
    const res = await sendChangeEmailOldOtp();
    setEmailLoading(false);
    if (res.ok) {
      if (res.notLinked) {
        // No email yet — skip old verification
        setEmailStep('enter_new');
        setEmailStatus('ℹ️ No email linked yet. Enter the new email address.');
      } else {
        setEmailStep('enter_old_otp');
        setEmailStatus('✅ OTP sent to your current email.');
      }
    } else {
      flash(setEmailStatus, `❌ ${res.error || 'Failed to send OTP.'}`);
    }
  };

  const verifyOldEmail = async () => {
    if (!oldOtp.trim()) { flash(setEmailStatus, '❌ Enter the OTP.'); return; }
    setEmailLoading(true); setEmailStatus('');
    const res = await verifyChangeEmailOld(oldOtp);
    setEmailLoading(false);
    if (res.ok) { setEmailStep('enter_new'); setEmailStatus('✅ Current email verified.'); }
    else flash(setEmailStatus, `❌ ${res.error || 'Invalid OTP.'}`);
  };

  const sendNewEmail = async () => {
    if (!newEmail.trim()) { flash(setEmailStatus, '❌ Enter new email address.'); return; }
    setEmailLoading(true); setEmailStatus('');
    const res = await sendNewEmailOtp(newEmail);
    setEmailLoading(false);
    if (res.ok) { setEmailStep('enter_new_otp'); setEmailStatus('✅ OTP sent to new email.'); }
    else flash(setEmailStatus, `❌ ${res.error || 'Failed.'}`);
  };

  const confirmNewEmail = async () => {
    if (!newEmailOtp.trim()) { flash(setEmailStatus, '❌ Enter the OTP.'); return; }
    setEmailLoading(true); setEmailStatus('');
    const res = await confirmChangeEmail(newEmail, newEmailOtp);
    setEmailLoading(false);
    if (res.ok) {
      setEmailStep('idle');
      flash(setEmailStatus, '✅ Email updated successfully!');
      setOldOtp(''); setNewEmail(''); setNewEmailOtp('');
    } else flash(setEmailStatus, `❌ ${res.error || 'Failed.'}`);
  };

  const cancelEmailChange = () => {
    setEmailStep('idle'); setOldOtp(''); setNewEmail(''); setNewEmailOtp(''); setEmailStatus('');
  };

  const badge = isSudoAdmin ? { label: '👑 Sudo Admin', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)' }
    : { label: '👤 User', color: 'var(--lavender)', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.35)' };

  const cardStyle = {
    background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(79,70,229,0.05) 100%)',
    border: '1px solid rgba(124,58,237,0.2)', borderRadius: '16px',
    padding: '20px', marginBottom: '28px', position: 'relative', overflow: 'hidden',
  };

  return (
    <div style={{ maxWidth: '580px' }}>

      {/* ─── IDENTITY CARD ─── */}
      <ST icon="🪪">Identity</ST>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '140px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          {/* Avatar + upload */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Avatar src={avatarPreview} name={displayName} size={86} isAdmin={isSudoAdmin} />
            <button onClick={() => avatarInputRef.current?.click()}
              style={{
                position: 'absolute', bottom: -2, right: -2, width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(124,58,237,0.9)', border: '2px solid var(--window-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '13px',
              }} title="Upload photo">📷</button>
            <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>

          {/* Name / email / badge */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              {editingName ? (
                <input value={displayName} onChange={e => setDisplayName(e.target.value)} autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') handleSaveProfile(); if (e.key === 'Escape') { setEditingName(false); setDisplayName(currentUser?.displayName || ''); } }}
                  style={{
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(124,58,237,0.4)',
                    borderRadius: '6px', padding: '4px 8px', color: 'var(--text)',
                    fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '18px', outline: 'none', width: '100%',
                  }} />
              ) : (
                <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', fontFamily: 'Syne,sans-serif', wordBreak: 'break-word' }}>
                  {displayName || '—'}
                </span>
              )}
              {!editingName && (
                <button onClick={() => setEditingName(true)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', padding: '2px', opacity: 0.5, color: 'var(--text2)' }}
                  title="Edit name">✏️</button>
              )}
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'JetBrains Mono,monospace', marginBottom: '10px', wordBreak: 'break-all' }}>
              📧 {displayMailId}
            </div>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '3px 10px', borderRadius: '100px',
              background: badge.bg, border: `1px solid ${badge.border}`,
              color: badge.color, fontSize: '11px', fontFamily: 'JetBrains Mono,monospace', fontWeight: 700,
            }}>{badge.label}</div>
          </div>
        </div>

        {/* Action row */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
          {editingName && (
            <>
              <Btn onClick={handleSaveProfile} disabled={savingProfile}>{savingProfile ? '⏳ Saving...' : '💾 Save Name'}</Btn>
              <Btn secondary onClick={() => { setEditingName(false); setDisplayName(currentUser?.displayName || ''); }}>Cancel</Btn>
            </>
          )}
          {avatarPreview !== (currentUser?.avatar || '') && !editingName && (
            <Btn onClick={handleSaveProfile} disabled={savingProfile}>{savingProfile ? '⏳...' : '💾 Save Photo'}</Btn>
          )}
          {avatarPreview && (
            <Btn secondary onClick={() => setAvatarPreview('')}>🗑️ Remove Photo</Btn>
          )}
        </div>
        <StatusMsg msg={profileStatus} />
      </motion.div>

      {/* ─── EMAIL MANAGEMENT ─── */}
      <ST icon="📧">Email Management</ST>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
        borderRadius: '14px', padding: '20px', marginBottom: '28px',
      }}>
        {emailStep === 'idle' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'JetBrains Mono,monospace', marginBottom: '4px' }}>Linked Email</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', fontFamily: 'JetBrains Mono,monospace' }}>
                  {currentUser?.mailId === 'single_user' ? <span style={{ color: 'var(--text3)', fontStyle: 'italic' }}>No email linked</span> : displayMailId}
                </div>
              </div>
              <Btn onClick={startEmailChange} disabled={emailLoading}>
                {emailLoading ? '⏳...' : currentUser?.mailId === 'single_user' ? '🔗 Link Email' : '✏️ Change Email'}
              </Btn>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'JetBrains Mono,monospace', marginTop: '10px', padding: '8px 10px', background: 'rgba(124,58,237,0.06)', borderRadius: '8px' }}>
              ⚠️ Changing email requires OTP verification on both current and new addresses.
            </div>
          </>
        )}

        {emailStep === 'enter_old_otp' && (
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', fontFamily: 'Syne,sans-serif', marginBottom: '12px' }}>
              Step 1 of 3 — Verify Current Email
            </div>
            <OtpInput value={oldOtp} onChange={e => setOldOtp(e.target.value)}
              onBack={cancelEmailChange} label={`OTP sent to ${displayMailId}`} />
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <Btn onClick={verifyOldEmail} disabled={emailLoading}>{emailLoading ? '⏳...' : '✅ Verify OTP'}</Btn>
              <Btn secondary onClick={cancelEmailChange}>Cancel</Btn>
            </div>
          </div>
        )}

        {emailStep === 'enter_new' && (
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', fontFamily: 'Syne,sans-serif', marginBottom: '12px' }}>
              {currentUser?.mailId === 'single_user' ? 'Link Email Address' : 'Step 2 of 3 — Enter New Email'}
            </div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>📧</span>
              <input value={newEmail} onChange={e => setNewEmail(e.target.value)} type="email"
                placeholder="New email address" className="adm-input"
                style={{ paddingLeft: '36px', marginBottom: '12px' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Btn onClick={sendNewEmail} disabled={emailLoading}>{emailLoading ? '⏳...' : '📨 Send OTP →'}</Btn>
              <Btn secondary onClick={cancelEmailChange}>Cancel</Btn>
            </div>
          </div>
        )}

        {emailStep === 'enter_new_otp' && (
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', fontFamily: 'Syne,sans-serif', marginBottom: '12px' }}>
              Step 3 of 3 — Verify New Email
            </div>
            <OtpInput value={newEmailOtp} onChange={e => setNewEmailOtp(e.target.value)}
              onBack={() => setEmailStep('enter_new')} label={`OTP sent to ${newEmail}`} />
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <Btn onClick={confirmNewEmail} disabled={emailLoading}>{emailLoading ? '⏳...' : '🔗 Confirm & Link'}</Btn>
              <Btn secondary onClick={cancelEmailChange}>Cancel</Btn>
            </div>
          </div>
        )}

        <StatusMsg msg={emailStatus} />
      </motion.div>

      {/* ─── CHANGE PIN ─── */}
      <ST icon="🔐">Change Access PIN</ST>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
        borderRadius: '14px', padding: '20px', marginBottom: '28px',
      }}>
        <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'JetBrains Mono,monospace', marginBottom: '14px' }}>
          Requires double authentication (PIN + Email OTP). Minimum 4 characters.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
          <div style={{ position: 'relative' }}>
            <input type={showNewPw ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)}
              placeholder="New PIN (min 4 chars)" className="adm-input"
              style={{ paddingRight: '40px', letterSpacing: showNewPw ? '1px' : '4px' }} />
            <button type="button" onClick={() => setShowNewPw(v => !v)}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', opacity: 0.5 }}>
              {showNewPw ? '🙈' : '👁️'}
            </button>
          </div>
          <input type={showNewPw ? 'text' : 'password'} value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
            placeholder="Confirm new PIN" className="adm-input"
            style={{ letterSpacing: showNewPw ? '1px' : '4px' }} />
        </div>
        <StatusMsg msg={pinStatus} />
        <Btn onClick={() => requestAction('change_pin')} style={{ marginTop: '12px' }}>🔐 Change PIN</Btn>
      </motion.div>

      {/* ─── DANGER ZONE ─── */}
      <ST icon="⚠️">Danger Zone</ST>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
        background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.25)',
        borderRadius: '14px', padding: '20px', marginBottom: '28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', color: '#F87171', fontWeight: 700, marginBottom: '4px', fontFamily: 'Syne,sans-serif' }}>
              🗑️ Erase All Portfolio Data
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'JetBrains Mono,monospace', lineHeight: 1.7 }}>
              Permanently deletes all projects, education, skills, and certificates.<br />
              <span style={{ color: 'rgba(239,68,68,0.7)' }}>This action cannot be undone.</span>
            </div>
          </div>
          <Btn danger onClick={() => setEraseModalOpen(true)} style={{ flexShrink: 0 }}>Erase Data</Btn>
        </div>
        <StatusMsg msg={eraseStatus} />
      </motion.div>

      {/* ─── LOGOUT ─── */}
      <Btn danger onClick={onLogout} style={{ marginTop: '4px' }}>🚩 Sign Out</Btn>

      {/* ─── Double Auth Modal (PIN change) ─── */}
      <DoubleAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        actionName="Change PIN"
        onSuccess={handleActionSuccess}
      />

      {/* ─── Erase Confirm Modal ─── */}
      <EraseConfirmModal
        isOpen={eraseModalOpen}
        onClose={() => setEraseModalOpen(false)}
        onConfirm={handleEraseConfirm}
      />
    </div>
  );
};

export default AccountProfile;
