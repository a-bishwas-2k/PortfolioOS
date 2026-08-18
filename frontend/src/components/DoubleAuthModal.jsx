import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

const DoubleAuthModal = ({ isOpen, onClose, actionName, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: PIN, 2: OTP
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  
  const { login, sendOtp, verifyOtp, currentUser } = useStore();

  const handleVerifyPin = async (e) => {
    e.preventDefault();
    if (!pin.trim()) { setErr('PIN is required'); return; }
    
    setLoading(true); setErr('');
    // Use the login endpoint to verify PIN for the current user
    const res = await login(currentUser?.mailId || 'admin', pin);
    if (res.ok) {
      // Send OTP for sensitive action
      const otpRes = await sendOtp(currentUser?.mailId || 'admin', actionName.replace(/\s+/g, '_').toLowerCase());
      setLoading(false);
      if (otpRes.ok) {
        setStep(2);
      } else {
        setErr(otpRes.error || 'Failed to send OTP');
      }
    } else {
      setLoading(false);
      setErr(res.error || 'Incorrect PIN');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) { setErr('OTP is required'); return; }
    
    // Instead of verifying here, we pass the OTP to the parent action
    // so the parent can consume it in a secure endpoint.
    onSuccess(otp);
    onClose();
    setStep(1);
    setPin('');
    setOtp('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            style={{
              background: 'var(--window-bg)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '32px', width: '380px',
              textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ fontSize: 'var(--fs-3xl)', marginBottom: '12px' }}>
              {step === 1 ? '🔐' : '✉️'}
            </div>
            
            <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 800, color: 'var(--text)', fontFamily: 'Syne, sans-serif', marginBottom: '8px' }}>
              Authentication Required
            </div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace', marginBottom: '24px' }}>
              To proceed with "{actionName}", verify your identity.
            </div>

            <form onSubmit={step === 1 ? handleVerifyPin : handleVerifyOtp}>
              {step === 1 ? (
                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="password" value={pin} onChange={e => setPin(e.target.value)}
                    placeholder="Enter current PIN" className="adm-input"
                    style={{ textAlign: 'center', fontSize: 'var(--fs-sm)', letterSpacing: '2px', width: '100%' }}
                    autoFocus
                  />
                </div>
              ) : (
                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="text" value={otp} onChange={e => setOtp(e.target.value)}
                    placeholder="Enter OTP from email" className="adm-input"
                    style={{ textAlign: 'center', fontSize: 'var(--fs-sm)', letterSpacing: '2px', width: '100%' }}
                    autoFocus
                  />
                </div>
              )}

              {err && <div style={{ color: '#F87171', fontSize: 'var(--fs-xs)', fontFamily: 'JetBrains Mono, monospace', marginBottom: '16px' }}>⚠ {err}</div>}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => { onClose(); setStep(1); setPin(''); setOtp(''); setErr(''); }}
                  style={{
                    flex: 1, padding: '10px', background: 'transparent',
                    border: '1px solid var(--border)', borderRadius: '8px',
                    color: 'var(--text)', fontSize: 'var(--fs-xs)', fontFamily: 'JetBrains Mono, monospace',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={loading}
                  style={{
                    flex: 1, padding: '10px', background: 'linear-gradient(135deg, var(--violet), #5B21B6)',
                    border: 'none', borderRadius: '8px', color: 'white', fontWeight: 700,
                    fontSize: 'var(--fs-xs)', fontFamily: 'Syne, sans-serif',
                    cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? 'Processing...' : (step === 1 ? 'Next' : 'Verify')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DoubleAuthModal;
