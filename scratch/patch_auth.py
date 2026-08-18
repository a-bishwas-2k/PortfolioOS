#!/usr/bin/env python3
"""Patch AdminApp.jsx: replace AuthGate return JSX + add PinStepUpModal + update AdminApp sidebar."""

import re

path = "frontend/src/components/AdminApp.jsx"
with open(path, "r") as f:
    content = f.read()

# ── 1. Replace AuthGate return block (lines 481-690) with modern design ─────
OLD_RETURN = """  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'var(--window-bg)', position: 'relative', overflow: 'hidden' }}>
      {/* Full background bars */}
      <AnimatedBars active={inputActive} error={shake} />"""

NEW_RETURN = """  // Remove unused vars (kept for logic compat)
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
      }} />"""

if OLD_RETURN in content:
    content = content.replace(OLD_RETURN, NEW_RETURN, 1)
    print("✓ Replaced AuthGate return opening")
else:
    print("✗ Could not find AuthGate return opening")

# ── 2. Update the tab labels from Login/Register/Reset → Sign In/Sign Up/Reset ──
content = content.replace(
    "{[{id:'login',label:'Login'},{id:'register',label:'Register'},{id:'forgot',label:'Reset'}]",
    "{[{id:'login',label:'Sign In'},{id:'register',label:'Sign Up'},{id:'forgot',label:'Reset'}]"
)
print("✓ Updated tab labels")

# ── 3. Add 'Forgot PIN' link below the PIN field in login mode ──
OLD_PIN_SECTION = """                    <button type="button" onClick={() => setShowPin(v => !v)}
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
                </motion.div>"""

NEW_PIN_SECTION = """                    <button type="button" onClick={() => setShowPin(v => !v)}
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
                    <div style={{ textAlign: 'right', marginTop: '4px' }}>
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
                </motion.div>"""

if OLD_PIN_SECTION in content:
    content = content.replace(OLD_PIN_SECTION, NEW_PIN_SECTION, 1)
    print("✓ Added 'Forgot PIN' link")
else:
    print("✗ Could not find PIN section to add forgot link")

# ── 4. Update CTA button text: 'Authenticate →' → 'Sign In →' ──
content = content.replace(
    "mode === 'login' ? 'Authenticate →' :",
    "mode === 'login' ? 'Sign In →' :"
)
print("✓ Updated CTA button text")

# ── 5. Improve OTP input styling ──
content = content.replace(
    "style={{ paddingLeft: '36px', letterSpacing: '6px', fontSize: 'var(--fs-sm)', textAlign: 'center' }}",
    "style={{ paddingLeft: '36px', letterSpacing: '8px', fontSize: '18px', textAlign: 'center' }}"
)
print("✓ Updated OTP input styling")

# ── 6. Update modeTitle to be friendlier ──
content = content.replace(
    "const modeTitle = lockedOut ? 'Locked Out' : mode === 'login' ? 'Admin Access' : mode === 'register' ? 'Create Account' : 'Reset PIN';",
    "const modeTitle = lockedOut ? 'Locked Out' : mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Reset PIN';"
)
print("✓ Updated modeTitle")

# ── 7. Add PinStepUpModal state + security gate in AdminApp ──
OLD_SECTION_STATE = """  const [locking, setLocking] = useState(false);
  const isMobile = useIsMobile(768);"""

NEW_SECTION_STATE = """  const [locking, setLocking] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [securityUnlocked, setSecurityUnlocked] = useState(false);
  const isMobile = useIsMobile(768);"""

if OLD_SECTION_STATE in content:
    content = content.replace(OLD_SECTION_STATE, NEW_SECTION_STATE, 1)
    print("✓ Added pinModalOpen state")
else:
    print("✗ Could not find locking state")

# ── 8. Gate Security section behind PinStepUpModal ──
OLD_SECURITY_NAV = """              onClick={() => setSection(s.id)}
              className={`adm-sidebar-item ${section === s.id ? 'active' : ''}`}"""

NEW_SECURITY_NAV = """              onClick={() => {
                if (s.id === 'security' && !securityUnlocked) {
                  setPinModalOpen(true);
                } else {
                  setSection(s.id);
                }
              }}
              className={`adm-sidebar-item ${section === s.id ? 'active' : ''}`}"""

if OLD_SECURITY_NAV in content:
    content = content.replace(OLD_SECURITY_NAV, NEW_SECURITY_NAV, 1)
    print("✓ Gated Security section behind PinStepUpModal")
else:
    print("✗ Could not find Security section nav")

# ── 9. Add PinStepUpModal + admin profile to AdminApp return ──
OLD_RETURN_DIV = """  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100%', background: 'var(--window-bg)' }}>"""

NEW_RETURN_DIV = """  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100%', background: 'var(--window-bg)', position: 'relative' }}>
      {/* PIN Step-Up Modal for Security section */}
      <PinStepUpModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onSuccess={() => { setPinModalOpen(false); setSecurityUnlocked(true); setSection('security'); }}
        title="Security Access"
        description="Verify your PIN to access security settings."
      />"""

if OLD_RETURN_DIV in content:
    content = content.replace(OLD_RETURN_DIV, NEW_RETURN_DIV, 1)
    print("✓ Added PinStepUpModal to AdminApp return")
else:
    print("✗ Could not find AdminApp return div")

# ── 10. Add admin profile in desktop sidebar ──
OLD_SIDEBAR_LABEL = """          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '2px', textTransform: 'uppercase', padding: '0 8px', marginBottom: '8px' }}>
            Dashboard
          </div>"""

NEW_SIDEBAR_LABEL = """          {/* Admin profile preview */}
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
          </div>"""

if OLD_SIDEBAR_LABEL in content:
    content = content.replace(OLD_SIDEBAR_LABEL, NEW_SIDEBAR_LABEL, 1)
    print("✓ Added admin profile to sidebar")
else:
    print("✗ Could not find sidebar Dashboard label")

# ── Write out ──
with open(path, "w") as f:
    f.write(content)

print("\n✅ All patches applied to", path)
