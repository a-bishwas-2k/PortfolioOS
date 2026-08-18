import { create } from 'zustand'

const BACKEND_BASE = (window.location.protocol === 'file:')
    ? 'http://localhost:5000'
    : (import.meta.env.VITE_API_URL || '');

/* ─── Session Token Helpers ─────────────────────────────────────
   Token is stored in localStorage with an explicit expiry so it
   survives page refreshes.  We still validate against the server
   on startup, so a server-restart forces one re-login (correct).
──────────────────────────────────────────────────────────────── */
const SESSION_KEY = 'adm_session_v2';

function loadStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const { token, expires } = JSON.parse(raw);
    if (!token || !expires) return null;
    if (Date.now() > expires) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

function persistSession(token, ttlMs = 3600 * 1000) {
  if (!token) { localStorage.removeItem(SESSION_KEY); return; }
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    token,
    expires: Date.now() + ttlMs,
  }));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSessionToken() {
  return loadStoredSession();
}

/* ─── Store ─────────────────────────────────────────────────── */
const useStore = create((set, get) => ({
  user: null,
  adminAuthed: false,   // will be updated by validateStoredSession on mount
  currentUser: null,    // NEW: { mailId, isAdmin, displayName }
  isBooting: true,
  windows: [],
  activeWindow: null,
  sessionCertificates: [],

  settings: {
    theme: localStorage.getItem('os_theme') || 'dark',
    wallpaper: localStorage.getItem('os_wallpaper') || '',
    fontSize: Number(localStorage.getItem('os_fontSize')) || 14,
    fontStyle: localStorage.getItem('os_fontStyle') || 'Syne',
    fontColor: localStorage.getItem('os_fontColor') || '',
    density: localStorage.getItem('os_density') || 'comfortable',
    reduceMotion: localStorage.getItem('os_reduceMotion') === 'true',
    cursorStyle: localStorage.getItem('os_cursorStyle') || 'default',
    accentColor: localStorage.getItem('os_accentColor') || '',
    borderRadius: localStorage.getItem('os_borderRadius') || 'medium',
    animations: localStorage.getItem('os_animations') !== 'false',
    clockFormat: localStorage.getItem('os_clockFormat') || '12h',
    timezone: localStorage.getItem('os_timezone') || Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: localStorage.getItem('os_dateFormat') || 'MMM DD, YYYY',
    showSeconds: localStorage.getItem('os_showSeconds') === 'true',
  },

  updateSetting: (key, value) => {
    set((state) => {
      localStorage.setItem(`os_${key}`, value);
      if (key === 'theme') document.documentElement.setAttribute('data-theme', value);
      const updatedSettings = { ...state.settings, [key]: value };

      // Sync settings to MongoDB backend asynchronously
      fetch(`${BACKEND_BASE}/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-token': loadStoredSession() || ''
        },
        body: JSON.stringify({ settings: updatedSettings })
      }).catch(err => console.warn('[PortfolioOS] Failed to save settings to backend:', err));

      return { settings: updatedSettings };
    });
  },

  saveSettings: async (newSettings) => {
    try {
      const state = get();
      const merged = { ...state.settings, ...(newSettings || {}) };
      Object.entries(merged).forEach(([k, v]) => localStorage.setItem(`os_${k}`, v));
      set({ settings: merged });
      const res = await fetch(`${BACKEND_BASE}/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-token': loadStoredSession() || ''
        },
        body: JSON.stringify({ settings: merged })
      });
      const data = await res.json();
      return data.success;
    } catch {
      return false;
    }
  },

  setBooting: (status) => set({ isBooting: status }),

  // ── Window Management (Single-Instance per App — Ubuntu Style) ──
  openWindow: (appId, title) => set((state) => {
    const existing = state.windows.find(w => w.id === appId || w.appId === appId);

    if (existing) {
      // If currently active and not minimized -> minimize it (Ubuntu dock click toggle)
      if (state.activeWindow === existing.id && !existing.isMinimized) {
        const remainingVisible = state.windows.filter(w => w.id !== existing.id && !w.isMinimized);
        const nextActive = remainingVisible.length > 0
          ? remainingVisible.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), remainingVisible[0]).id
          : null;

        return {
          windows: state.windows.map(w => w.id === existing.id ? { ...w, isMinimized: true } : w),
          activeWindow: nextActive,
        };
      }

      // Otherwise bring to front & restore focus
      return {
        windows: state.windows.map(w => w.id === existing.id ? { ...w, isMinimized: false, zIndex: Date.now() } : w),
        activeWindow: existing.id,
      };
    }

    // Launch single instance window
    const newWindow = {
      id: appId,
      appId: appId,
      title: title,
      zIndex: Date.now(),
      isMinimized: false,
      isMaximized: false,
    };

    return {
      windows: [...state.windows, newWindow],
      activeWindow: appId,
    };
  }),

  closeWindow: (winId) => set((state) => {
    const remainingWins = state.windows.filter(w => w.id !== winId && w.appId !== winId);
    let nextActive = state.activeWindow;
    if (state.activeWindow === winId) {
      if (remainingWins.length > 0) {
        const visible = remainingWins.filter(w => !w.isMinimized);
        if (visible.length > 0) {
          const topWin = visible.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), visible[0]);
          nextActive = topWin.id;
        } else {
          nextActive = null;
        }
      } else {
        nextActive = null;
      }
    }
    return {
      windows: remainingWins,
      activeWindow: nextActive,
    };
  }),

  minimizeWindow: (winId) => set((state) => {
    const updatedWins = state.windows.map(w => w.id === winId ? { ...w, isMinimized: true } : w);
    let nextActive = state.activeWindow;
    if (state.activeWindow === winId) {
      const visibleWins = updatedWins.filter(w => !w.isMinimized);
      if (visibleWins.length > 0) {
        const topWin = visibleWins.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), visibleWins[0]);
        nextActive = topWin.id;
      } else {
        nextActive = null;
      }
    }
    return {
      windows: updatedWins,
      activeWindow: nextActive,
    };
  }),

  maximizeWindow: (winId) => set((state) => ({
    windows: state.windows.map(w => w.id === winId ? { ...w, isMaximized: !w.isMaximized, isMinimized: false, zIndex: Date.now() } : w),
    activeWindow: winId,
  })),

  focusWindow: (winId) => set((state) => {
    const win = state.windows.find(w => w.id === winId);
    if (!win) return state;
    return {
      windows: state.windows.map(w => w.id === winId ? { ...w, isMinimized: false, zIndex: Date.now() } : w),
      activeWindow: winId,
    };
  }),

  setUser: (newUser) => set({ user: newUser }),

  // ── Certificates ──
  addSessionCertificate: (cert) => set((state) => ({ sessionCertificates: [...state.sessionCertificates, cert] })),
  deleteSessionCertificate: (idx) => set((state) => ({ sessionCertificates: state.sessionCertificates.filter((_, i) => i !== idx) })),
  updateSessionCertificate: (idx, updated) => set((state) => ({ sessionCertificates: state.sessionCertificates.map((c, i) => i === idx ? updated : c) })),
  setSessionCertificates: (certs) => set({ sessionCertificates: certs }),

  // ── Load public user data ──
  loadUser: async (mailId = null) => {
    try {
      const headers = {};
      if (mailId) headers['x-mail-id'] = mailId;
      const res = await fetch(`${BACKEND_BASE}/api/user`, { headers });
      const data = await res.json();
      if (data.success && data.user) {
        const dbSettings = data.user.settings;
        if (dbSettings && typeof dbSettings === 'object' && Object.keys(dbSettings).length > 0) {
          set((state) => {
            const mergedSettings = { ...state.settings, ...dbSettings };
            Object.entries(mergedSettings).forEach(([k, v]) => {
              localStorage.setItem(`os_${k}`, v);
            });
            return { user: data.user, settings: mergedSettings };
          });
        } else {
          set({ user: data.user });
        }
      }
    } catch {
      console.warn('[PortfolioOS] Backend offline.');
    }
  },

  /* ── validateStoredSession ──────────────────────────────────
     Called once on AdminApp mount.
     Checks if a token is saved in localStorage AND still accepted
     by the server.  If the server restarted, it will return 401
     and we clear the stale token so the user sees the login gate.
  ──────────────────────────────────────────────────────────── */
  validateStoredSession: async () => {
    const token = loadStoredSession();
    if (!token) {
      set({ adminAuthed: false, currentUser: null });
      return false;
    }
    try {
      const res = await fetch(`${BACKEND_BASE}/api/validate-session`, {
        headers: { 'x-session-token': token },
      });
      const data = await res.json();
      if (data.valid) {
        // Refresh expiry in localStorage to another hour from now
        persistSession(token, 3600 * 1000);
        set({ adminAuthed: true, currentUser: { mailId: data.mailId, isAdmin: data.isAdmin, displayName: data.displayName || data.mailId, avatar: data.avatar || '' } });
        return true;
      } else {
        // Server restarted or token expired server-side
        clearSession();
        set({ adminAuthed: false, currentUser: null });
        return false;
      }
    } catch {
      // Server unreachable — keep local token but don't mark authed
      clearSession();
      set({ adminAuthed: false, currentUser: null });
      return false;
    }
  },

  /* ── Auth Methods (Login, Register, OTP) ────────────────── */
  login: async (mailId, pin) => {
    try {
      const res = await fetch(`${BACKEND_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mailId, pin })
      });
      const data = await res.json();
      if (data.success && data.sessionToken) {
        persistSession(data.sessionToken, 3600 * 1000);
        const cu = { ...data.user, displayName: data.user.displayName || data.user.mailId, avatar: data.user.avatar || '' };
        set({ adminAuthed: true, currentUser: cu });
        return { ok: true };
      }
      if (res.status === 429) {
        return { ok: false, lockedOut: true, waitSeconds: data.waitSeconds || 120, error: data.error || 'Too many attempts.' };
      }
      return { ok: false, lockedOut: false, error: data.error || 'Login failed.' };
    } catch {
      return { ok: false, lockedOut: false, error: 'Cannot reach server.' };
    }
  },

  register: async (mailId, displayName, pin, otp) => {
    try {
      const res = await fetch(`${BACKEND_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mailId, displayName, pin, otp })
      });
      const data = await res.json();
      if (data.success && data.sessionToken) {
        persistSession(data.sessionToken, 3600 * 1000);
        const cu = { ...data.user, displayName: data.user.displayName || data.user.mailId, avatar: data.user.avatar || '' };
        set({ adminAuthed: true, currentUser: cu });
        return { ok: true };
      }
      return { ok: false, error: data.error || 'Registration failed.' };
    } catch {
      return { ok: false, error: 'Cannot reach server.' };
    }
  },

  sendOtp: async (mailId, purpose) => {
    try {
      const res = await fetch(`${BACKEND_BASE}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mailId, purpose })
      });
      const data = await res.json();
      return { ok: data.success, error: data.error };
    } catch {
      return { ok: false, error: 'Cannot reach server.' };
    }
  },

  verifyOtp: async (otp, purpose, mailId = null) => {
    try {
      const token = loadStoredSession();
      const payload = { otp, purpose };
      if (mailId) payload.mailId = mailId;
      const res = await fetch(`${BACKEND_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-token': token || '' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      return { ok: data.success, error: data.error };
    } catch {
      return { ok: false, error: 'Cannot reach server.' };
    }
  },

  resetPin: async (mailId, otp, newPin) => {
    try {
      const res = await fetch(`${BACKEND_BASE}/api/auth/reset-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mailId, otp, newPin })
      });
      const data = await res.json();
      return { ok: data.success, error: data.error };
    } catch {
      return { ok: false, error: 'Cannot reach server.' };
    }
  },

  eraseData: async (pin) => {
    try {
      const token = loadStoredSession();
      const res = await fetch(`${BACKEND_BASE}/api/profile/erase-data`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-session-token': token || '' },
        body: JSON.stringify({ pin })
      });
      const data = await res.json();
      return { ok: data.success, error: data.error, msg: data.msg };
    } catch {
      return { ok: false, error: 'Cannot reach server.' };
    }
  },

  sendChangeEmailOldOtp: async () => {
    try {
      const token = loadStoredSession();
      const res = await fetch(`${BACKEND_BASE}/api/profile/send-change-email-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-token': token || '' }
      });
      const data = await res.json();
      return { ok: data.success, notLinked: data.notLinked, error: data.error, msg: data.msg };
    } catch {
      return { ok: false, error: 'Cannot reach server.' };
    }
  },

  verifyChangeEmailOld: async (otp) => {
    try {
      const token = loadStoredSession();
      const res = await fetch(`${BACKEND_BASE}/api/profile/verify-change-email-old`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-token': token || '' },
        body: JSON.stringify({ otp })
      });
      const data = await res.json();
      return { ok: data.success, error: data.error, msg: data.msg };
    } catch {
      return { ok: false, error: 'Cannot reach server.' };
    }
  },

  sendNewEmailOtp: async (newEmail) => {
    try {
      const token = loadStoredSession();
      const res = await fetch(`${BACKEND_BASE}/api/profile/send-new-email-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-token': token || '' },
        body: JSON.stringify({ newEmail })
      });
      const data = await res.json();
      return { ok: data.success, error: data.error, msg: data.msg };
    } catch {
      return { ok: false, error: 'Cannot reach server.' };
    }
  },

  confirmChangeEmail: async (newEmail, otp) => {
    try {
      const token = loadStoredSession();
      const res = await fetch(`${BACKEND_BASE}/api/profile/confirm-change-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-token': token || '' },
        body: JSON.stringify({ newEmail, otp })
      });
      const data = await res.json();
      if (data.success && data.user) {
        // Refresh session token so next validate-session uses the new mailId
        if (data.sessionToken) persistSession(data.sessionToken, 3600 * 1000);
        set(state => ({
          currentUser: {
            ...state.currentUser,
            mailId: data.user.mailId,
            displayName: data.user.displayName || state.currentUser?.displayName,
            avatar: data.user.avatar || state.currentUser?.avatar || '',
          }
        }));
        return { ok: true, msg: data.msg };
      }
      return { ok: false, error: data.error };
    } catch {
      return { ok: false, error: 'Cannot reach server.' };
    }
  },

  fetchProfile: async () => {
    try {
      const token = loadStoredSession();
      const res = await fetch(`${BACKEND_BASE}/api/profile/me`, {
        headers: { 'x-session-token': token || '' },
      });
      const data = await res.json();
      if (data.success && data.user) {
        set(state => ({
          currentUser: {
            ...state.currentUser,
            displayName: data.user.displayName || state.currentUser?.mailId,
            avatar: data.user.avatar || '',
          }
        }));
        return { ok: true, user: data.user };
      }
      return { ok: false, error: data.error };
    } catch {
      return { ok: false, error: 'Cannot reach server.' };
    }
  },

  updateProfile: async (updates) => {
    try {
      const token = loadStoredSession();
      const res = await fetch(`${BACKEND_BASE}/api/profile/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-session-token': token || '' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        set(state => ({
          currentUser: {
            ...state.currentUser,
            displayName: data.user.displayName || state.currentUser?.displayName,
            avatar: data.user.avatar !== undefined ? data.user.avatar : state.currentUser?.avatar,
          }
        }));
        return { ok: true };
      }
      return { ok: false, error: data.error };
    } catch {
      return { ok: false, error: 'Cannot reach server.' };
    }
  },

  /* ── syncBackend ────────────────────────────────────────────
     Uses session token to POST updated user data.
     If 401 → token invalid → force re-login.
  ──────────────────────────────────────────────────────────── */
  syncBackend: async (userObject) => {
    try {
      const token = loadStoredSession();
      const currentSettings = get().settings;
      const payloadUser = {
        ...userObject,
        settings: { ...(currentSettings || {}), ...(userObject.settings || {}) }
      };
      const res = await fetch(`${BACKEND_BASE}/api/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-token': token || '' },
        body: JSON.stringify({ user: payloadUser }),
      });
      const data = await res.json();
      if (data.success) {
        set({ user: data.user || payloadUser });
        return true;
      }
      if (res.status === 401) { clearSession(); set({ adminAuthed: false }); return false; }
      return false;
    } catch {
      console.warn('[PortfolioOS] Backend unreachable.');
      return false;
    }
  },

  /* ── changePasswordSecure ───────────────────────────────── */
  changePasswordSecure: async (newPassword) => {
    try {
      const token = loadStoredSession();
      const res = await fetch(`${BACKEND_BASE}/api/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-token': token || '' },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (data.success) return { success: true };
      if (res.status === 401) { clearSession(); set({ adminAuthed: false }); }
      return { success: false, error: data.error || 'Failed' };
    } catch {
      return { success: false, error: 'Backend unreachable' };
    }
  },

  /* ── Change / Link Email (duplicate removed — first definitions kept above) ── */

  /* ── logoutAdmin ─────────────────────────────────────────── */
  logoutAdmin: async () => {
    try {
      const token = loadStoredSession();
      if (token) {
        await fetch(`${BACKEND_BASE}/api/logout`, {
          method: 'POST',
          headers: { 'x-session-token': token },
        });
      }
    } catch { /* silent */ }
    clearSession();
    set({ adminAuthed: false, currentUser: null });
  },
}));

export default useStore;
