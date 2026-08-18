import React, { useEffect, useState, useRef, useCallback } from 'react';
import useStore from '../store/useStore';
import { formatTime, formatDateLong } from '../utils/timeUtils';
import Window from './Window';
import MenuBar from './MenuBar';
import Dock from './Dock';
import { useIsMobile } from '../utils/responsive';
import TerminalApp from './TerminalApp';
import AdminApp from './AdminApp';
import BentoApp from './BentoApp';
import ProjectsApp from './ProjectsApp';
import CertificatesApp from './CertificatesApp';
import ResumeApp from './ResumeApp';
import ContactApp from './ContactApp';
import SettingsApp from './SettingsApp';
import PortfolioApp from './PortfolioApp';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocialLogo } from '../utils/icons';

const LinkIcon = ({ size = 24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>;

const appRegistry = {
  admin:        { title: 'Admin Dashboard',  emoji: '⚙️',  defaultSize: { width: 880, height: 640 },  component: AdminApp },
  terminal:     { title: 'Terminal',          emoji: '⬛',  defaultSize: { width: 700, height: 460 },  component: TerminalApp },
  bento:        { title: 'About Me',          emoji: '👤',  defaultSize: { width: 800, height: 640 },  component: BentoApp },
  projects:     { title: 'Projects',          emoji: '📁',  defaultSize: { width: 1040, height: 720 }, component: ProjectsApp },
  certificates: { title: 'Certificates',      emoji: '🏆',  defaultSize: { width: 900, height: 640 },  component: CertificatesApp },
  resume:       { title: 'Resume Viewer',     emoji: '📄',  defaultSize: { width: 680, height: 860 },  component: ResumeApp },
  contact:      { title: 'Contact',           emoji: '📞',  defaultSize: { width: 600, height: 400 },  component: ContactApp },
  settings:     { title: 'Settings',          emoji: '⚙️',  defaultSize: { width: 650, height: 500 },  component: SettingsApp },
  portfolio:    { title: 'Website',           emoji: '🌐',  defaultSize: { width: 1024, height: 768 }, component: PortfolioApp },
};

const GlitchCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const glitchColors = ['#2D1B69', '#7C3AED', '#A78BFA', '#4B0082', '#6A0DAD'];
    const fontSize = 16;
    const charWidth = 10;
    const charHeight = 20;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};<>.,0123456789abcdefghijklmnopqrstuvwxyz';
    const chars = Array.from(characters);

    let letters = [];
    let grid = { columns: 0, rows: 0 };
    let animId;

    const randChar = () => chars[Math.floor(Math.random() * chars.length)];
    const randColor = () => glitchColors[Math.floor(Math.random() * glitchColors.length)];

    function hexToRgb(hex) {
      hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => r+r+g+g+b+b);
      const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
    }

    function lerpColor(a, b, t) {
      return `rgb(${Math.round(a.r+(b.r-a.r)*t)},${Math.round(a.g+(b.g-a.g)*t)},${Math.round(a.b+(b.b-a.b)*t)})`;
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const W = window.innerWidth, H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cols = Math.ceil(W / charWidth);
      const rows = Math.ceil(H / charHeight);
      grid = { columns: cols, rows: rows };
      letters = Array.from({ length: cols * rows }, () => ({
        char: randChar(), color: randColor(),
        targetColor: randColor(), colorProgress: 1,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = fontSize + 'px "JetBrains Mono", monospace';
      ctx.textBaseline = 'top';
      letters.forEach((l, i) => {
        ctx.fillStyle = l.color;
        ctx.fillText(l.char, (i % grid.columns) * charWidth, Math.floor(i / grid.columns) * charHeight);
      });
    }

    function update() {
      const count = Math.max(1, Math.floor(letters.length * 0.035));
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * letters.length);
        letters[idx].char = randChar();
        letters[idx].targetColor = randColor();
        letters[idx].colorProgress = 0;
      }
    }

    let lastTime = 0;
    function animate(ts) {
      if (ts - lastTime > 45) {
        update();
        // Smooth color transitions
        letters.forEach(l => {
          if (l.colorProgress < 1) {
            l.colorProgress = Math.min(1, l.colorProgress + 0.04);
            const s = hexToRgb(typeof l.color === 'string' && l.color.startsWith('#') ? l.color : '#2D1B69');
            const e = hexToRgb(l.targetColor);
            if (s && e) l.color = lerpColor(s, e, l.colorProgress);
          }
        });
        draw();
        lastTime = ts;
      }
      animId = requestAnimationFrame(animate);
    }

    resize();
    const handleResize = () => { cancelAnimationFrame(animId); resize(); animate(0); };
    window.addEventListener('resize', handleResize);
    animate(0);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        opacity: 0.12,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

const ContextMenu = ({ x, y, onClose, onOpenApp }) => {
  const { openWindow } = useStore();

  const items = [
    { label: '⬛ Open Terminal', action: () => onOpenApp('terminal') },
    { label: '👤 About Me', action: () => onOpenApp('bento') },
    { label: '📁 Projects', action: () => onOpenApp('projects') },
    { label: '🏆 Certificates', action: () => onOpenApp('certificates') },
    { label: '🌐 Website', action: () => onOpenApp('portfolio') },
    { type: 'sep' },
    { label: '🔄 Refresh', action: () => window.location.reload() },
    { label: '🎨 Cycle Theme', action: () => {
      const themes = ['dark', 'light', 'ocean', 'rose', 'forest'];
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = themes[(themes.indexOf(current) + 1) % themes.length];
      document.documentElement.setAttribute('data-theme', next);
    }},
    { type: 'sep' },
    { label: '⚙️ Settings', action: () => onOpenApp('settings') },
    { type: 'sep' },
    { label: '🔒 Admin: sudo admin (Terminal)', action: () => onOpenApp('terminal') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.12 }}
      className="ctx-menu"
      style={{ left: x, top: y }}
      onMouseLeave={onClose}
    >
      {items.map((item, idx) =>
        item.type === 'sep'
          ? <div key={idx} className="ctx-sep" />
          : (
            <div
              key={idx}
              className="ctx-item"
              onClick={() => { item.action(); onClose(); }}
            >
              {item.label}
            </div>
          )
      )}
    </motion.div>
  );
};

const Toast = ({ emoji, title, msg, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40 }}
      className="toast"
    >
      <span style={{ fontSize: '20px' }}>{emoji}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: '12px', color: 'var(--text)' }}>{title}</div>
        <div style={{ fontSize: '10px', color: 'var(--text3)' }}>{msg}</div>
      </div>
    </motion.div>
  );
};

const Desktop = () => {
  const { windows, openWindow, user, settings } = useStore();
  const [ctxMenu, setCtxMenu] = useState(null);
  const [toasts, setToasts] = useState([]);
  const isMobileOrTablet = useIsMobile(768);

  // Handle app opening via dock events
  useEffect(() => {
    const handleOpenApp = (e) => {
      let id, forceNew = false;
      if (typeof e.detail === 'object' && e.detail !== null) {
        id = e.detail.id;
        forceNew = e.detail.forceNew || false;
      } else {
        id = e.detail;
      }
      const app = appRegistry[id];
      if (app) openWindow(id, app.title, forceNew);
    };
    window.addEventListener('open-app', handleOpenApp);
    return () => window.removeEventListener('open-app', handleOpenApp);
  }, [openWindow]);

  // Handle toast events
  useEffect(() => {
    const handleToast = (e) => {
      const { emoji, title, msg } = e.detail;
      const id = Date.now();
      setToasts(prev => [...prev, { id, emoji, title, msg }]);
    };
    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  // Context menu
  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    // Only on desktop area (not on windows)
    if (e.target.closest('.os-window') || e.target.closest('.dock') || e.target.closest('.menubar')) return;
    setCtxMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const closeCtxMenu = useCallback(() => setCtxMenu(null), []);

  // Open terminal on boot
  useEffect(() => {
    setTimeout(() => {
      openWindow('terminal', 'Terminal');
    }, 300);
  }, []);

  const openAppFromCtx = (id, forceNew = false) => {
    const app = appRegistry[id];
    if (app) {
      openWindow(id, app.title, forceNew);
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { emoji: app.emoji, title: app.title, msg: forceNew ? 'New Instance Opened' : 'Launched' }
      }));
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        background: 'var(--bg)',
        userSelect: 'none',
      }}
      onContextMenu={handleContextMenu}
      onClick={closeCtxMenu}
    >
      {/* Background Image / Glitch Matrix */}
      {settings.wallpaper ? (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${settings.wallpaper})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }} />
      ) : (
        <GlitchCanvas />
      )}

      {/* Gradient overlays for depth */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,58,237,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 40% at 80% 80%, rgba(34,211,238,0.04) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Scanline effect */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* MenuBar */}
      <MenuBar />

      {/* Window layer */}
      <div style={{ position: 'fixed', inset: '28px 0 0 0', zIndex: 100 }}>
        {windows.map(win => {
          if (win.isMinimized) return null;
          const appKey = win.appId || win.id;
          const app = appRegistry[appKey];
          if (!app) return null;
          const AppComponent = app.component;
          return (
            <Window
              key={win.id}
              id={win.id}
              appId={appKey}
              title={win.title}
              emoji={app.emoji}
              defaultSize={app.defaultSize}
            >
              <AppComponent windowId={win.id} appId={appKey} />
            </Window>
          );
        })}
      </div>

      {/* Dock */}
      <Dock />

      {/* Context Menu */}
      <AnimatePresence>
        {ctxMenu && (
          <ContextMenu
            x={ctxMenu.x}
            y={ctxMenu.y}
            onClose={closeCtxMenu}
            onOpenApp={openAppFromCtx}
          />
        )}
      </AnimatePresence>

      {/* Floating Social Nav — hide on mobile to avoid overlap with full-screen windows */}
      {!isMobileOrTablet && (() => {
        // Priority: user.socialLinks → legacy user.links
        let socialContacts = [];
        if (user?.socialLinks && user.socialLinks.length > 0) {
          socialContacts = user.socialLinks.filter(c => c.value && c.value !== '#');
        } else if (user?.links) {
          socialContacts = Object.entries(user.links)
            .filter(([, url]) => url && url !== '#')
            .map(([platform, url]) => ({ type: platform, value: url, label: platform }));
        }

        if (socialContacts.length === 0) return null;

        return (
          <div style={{
            position: 'fixed',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 50,
          }}>
            {socialContacts.map((contact, idx) => {
              const svgStr = getSocialLogo(contact.type);
              const raw = contact.value || '';
              let hrefUrl = '#';
              if (contact.type === 'email' || contact.type === 'gmail') {
                const emailStr = raw.startsWith('mailto:') ? raw.replace('mailto:', '') : raw;
                hrefUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailStr}`;
              } else if (contact.type === 'phone') {
                hrefUrl = raw.startsWith('tel:') ? raw : `tel:${raw}`;
              } else if (raw.startsWith('http') || raw.startsWith('mailto:') || raw.startsWith('tel:')) {
                hrefUrl = raw;
              } else {
                hrefUrl = `https://${raw}`;
              }

              return (
                <motion.a
                  key={idx}
                  href={hrefUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={contact.label || contact.type}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.07, type: 'spring', stiffness: 200 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30px',
                    height: '30px',
                    color: 'rgba(255,255,255,0.35)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease, transform 0.2s ease, filter 0.2s ease',
                    borderRadius: '6px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'var(--lavender)';
                    e.currentTarget.style.transform = 'scale(1.3) translateX(-3px)';
                    e.currentTarget.style.filter = 'drop-shadow(0 0 6px rgba(167,139,250,0.8))';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.35)';
                    e.currentTarget.style.transform = 'scale(1) translateX(0)';
                    e.currentTarget.style.filter = 'none';
                  }}
                >
                  {svgStr ? (
                    <div
                      style={{ width: 22, height: 22, color: 'currentColor' }}
                      dangerouslySetInnerHTML={{ __html: svgStr }}
                    />
                  ) : (
                    <LinkIcon size={22} />
                  )}
                </motion.a>
              );
            })}
          </div>
        );
      })()}

      {/* Toast Container */}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map(t => (
            <Toast
              key={t.id}
              emoji={t.emoji}
              title={t.title}
              msg={t.msg}
              onDone={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Desktop clock overlay (bottom left) — hidden on mobile */}
      {!isMobileOrTablet && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          left: '20px',
          zIndex: 10,
          pointerEvents: 'none',
          opacity: 0.25,
        }}>
          <DesktopClock />
        </div>
      )}
    </div>
  );
};

const DesktopClock = () => {
  const [time, setTime] = useState(new Date());
  const { settings } = useStore();
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-3xl)',
      fontWeight: 700,
      color: 'var(--text)',
      lineHeight: 1,
    }}>
      {formatTime(time, settings)}
      <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 400, letterSpacing: '0.2em', marginTop: '4px' }}>
        {formatDateLong(time, settings)}
      </div>
    </div>
  );
};

export default Desktop;
