import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import { formatTime, formatDate } from '../utils/timeUtils';
import { useIsMobile } from '../utils/responsive';

const THEMES = ['dark', 'light', 'ocean', 'rose', 'forest'];
const THEME_ICONS = { dark: '🌙', light: '☀️', ocean: '🌊', rose: '🌹', forest: '🌲' };

const MenuBar = () => {
  const [time, setTime] = useState(new Date());
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showHamburger, setShowHamburger] = useState(false); // mobile hamburger drawer

  const { activeWindow, windows, openWindow, closeWindow, minimizeWindow, user, settings } = useStore();
  const activeApp = windows.find(w => w.id === activeWindow);

  const isMobile = useIsMobile(640);

  const themeRef = useRef(null);
  const menuRef = useRef(null);

  // Get current theme
  const [currentTheme, setCurrentTheme] = useState(() =>
    document.documentElement.getAttribute('data-theme') || 'dark'
  );

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (themeRef.current && !themeRef.current.contains(e.target)) {
        setShowThemeMenu(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    setCurrentTheme(theme);
    setShowThemeMenu(false);
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const executeAction = (action) => {
    action();
    setActiveMenu(null);
    setShowHamburger(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  };

  const MENUS = {
    File: [
      { label: 'New Terminal', action: () => openWindow('terminal', 'Terminal') },
      { label: 'Preferences...', action: () => openWindow('settings', 'Settings') },
      { type: 'sep' },
      { label: 'Close Window', action: () => activeWindow && closeWindow(activeWindow) },
      { label: 'Refresh OS', action: () => window.location.reload() },
    ],
    Edit: [
      { label: 'Undo', action: () => console.log('Undo') },
      { label: 'Redo', action: () => console.log('Redo') },
      { type: 'sep' },
      { label: 'Cut', action: () => document.execCommand('cut') },
      { label: 'Copy', action: () => document.execCommand('copy') },
      { label: 'Paste', action: () => document.execCommand('paste') },
    ],
    View: [
      { label: 'Toggle Fullscreen', action: toggleFullscreen },
      { label: 'Cycle Theme', action: () => {
          const next = THEMES[(THEMES.indexOf(currentTheme) + 1) % THEMES.length];
          applyTheme(next);
      }},
    ],
    Window: [
      { label: 'Minimize', action: () => activeWindow && minimizeWindow(activeWindow) },
      { label: 'Close', action: () => activeWindow && closeWindow(activeWindow) },
      { type: 'sep' },
      { label: 'Show Desktop', action: () => windows.forEach(w => minimizeWindow(w.id)) },
    ],
    Help: [
      { label: 'About PortfolioOS', action: () => openWindow('bento', 'About Me') },
      { label: 'Contact Developer', action: () => openWindow('contact', 'Contact') },
    ]
  };

  return (
    <>
      <div className="menubar" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}>
        {/* Left side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '14px' }} ref={menuRef}>
          {/* Logo */}
          <span style={{
            fontSize: isMobile ? '11px' : 'var(--fs-md)', fontWeight: 800,
            background: 'linear-gradient(90deg, var(--electric), var(--lavender))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', cursor: 'default',
            fontFamily: 'Syne, sans-serif',
            whiteSpace: 'nowrap',
          }}>
            🐧 {isMobile ? 'PortOS' : 'PortfolioOS'}
          </span>

          {/* Active app label */}
          <span style={{
            color: 'var(--text)',
            fontSize: 'var(--fs-sm)',
            fontWeight: 700,
            cursor: 'default',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: isMobile ? '90px' : 'none',
          }}>
            {activeApp ? activeApp.title : 'Desktop'}
          </span>

          {/* Menu Items — only on desktop */}
          {!isMobile && Object.keys(MENUS).map(m => (
            <div key={m} style={{ position: 'relative' }}>
              <span
                onClick={() => handleMenuClick(m)}
                onMouseEnter={() => {
                  if (activeMenu && activeMenu !== m) setActiveMenu(m);
                }}
                style={{
                  color: activeMenu === m ? 'var(--lavender)' : 'var(--text2)',
                  fontSize: 'var(--fs-sm)',
                  cursor: 'pointer',
                  display: 'block',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: activeMenu === m ? 'rgba(124,58,237,0.2)' : 'transparent'
                }}
              >
                {m}
              </span>
              {activeMenu === m && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, marginTop: '8px',
                  background: 'rgba(11, 6, 20, 0.95)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px', padding: '6px 0',
                  minWidth: '180px', backdropFilter: 'blur(20px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                  zIndex: 99999,
                }}>
                  {MENUS[m].map((item, idx) =>
                    item.type === 'sep' ? (
                      <div key={idx} style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
                    ) : (
                      <button
                        key={idx}
                        onClick={() => executeAction(item.action)}
                        style={{
                          display: 'block', width: '100%', padding: '6px 16px',
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          color: 'var(--text2)', fontSize: 'var(--fs-sm)',
                          textAlign: 'left', fontFamily: 'Inter, sans-serif'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(124,58,237,0.15)';
                          e.currentTarget.style.color = 'var(--text)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--text2)';
                        }}
                      >
                        {item.label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '12px' }}>
          {/* Theme toggle */}
          <div ref={themeRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowThemeMenu(v => !v)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text2)', fontSize: 'var(--fs-base)', padding: '0 2px',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}
              title="Switch Theme"
            >
              {THEME_ICONS[currentTheme]}
            </button>
            {showThemeMenu && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: '4px',
                background: 'rgba(11, 6, 20, 0.95)',
                border: '1px solid var(--border)',
                borderRadius: '10px', padding: '6px 0',
                minWidth: '140px', backdropFilter: 'blur(20px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                zIndex: 99999,
              }}>
                {THEMES.map(t => (
                  <button
                    key={t}
                    onClick={() => applyTheme(t)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      width: '100%', padding: '7px 14px',
                      background: currentTheme === t ? 'rgba(124,58,237,0.15)' : 'none',
                      border: 'none', cursor: 'pointer',
                      color: currentTheme === t ? 'var(--lavender)' : 'var(--text2)',
                      fontSize: 'var(--fs-sm)', fontFamily: 'Syne, sans-serif',
                      textAlign: 'left',
                    }}
                  >
                    <span>{THEME_ICONS[t]}</span>
                    <span style={{ textTransform: 'capitalize' }}>{t}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* WiFi icon — hide on mobile */}
          {!isMobile && <span style={{ color: 'var(--text2)', fontSize: 'var(--fs-sm)' }}>📶</span>}

          {/* Time + Date */}
          <span style={{ color: 'var(--text)', fontSize: 'var(--fs-sm)', cursor: 'default', whiteSpace: 'nowrap' }}>
            {isMobile ? formatTime(time, settings) : `${formatDate(time, settings)}   ${formatTime(time, settings)}`}
          </span>

          {/* User indicator — hide on mobile to save space */}
          {!isMobile && user && (
            <span style={{
              fontSize: 'var(--fs-xs)', color: 'var(--green)',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <span className="status-dot" style={{ width: '5px', height: '5px' }} />
              {user.name?.split(' ')[0]}
            </span>
          )}

          {/* Hamburger menu — only on mobile */}
          {isMobile && (
            <button
              onClick={() => setShowHamburger(v => !v)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text)', fontSize: '16px', padding: '2px 4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                lineHeight: 1,
              }}
              title="Menu"
            >
              {showHamburger ? '✕' : '☰'}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Hamburger Drawer */}
      {isMobile && showHamburger && (
        <div
          style={{
            position: 'fixed',
            top: 32,
            left: 0,
            right: 0,
            background: 'rgba(11, 6, 20, 0.98)',
            border: '1px solid var(--border)',
            borderTop: 'none',
            borderRadius: '0 0 12px 12px',
            padding: '8px 0',
            zIndex: 99998,
            backdropFilter: 'blur(20px)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.7)',
          }}
        >
          {Object.entries(MENUS).map(([menuName, items]) => (
            <div key={menuName}>
              {/* Section header */}
              <div style={{
                padding: '8px 16px 4px',
                fontSize: '10px',
                color: 'var(--violet)',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                {menuName}
              </div>
              {items.map((item, idx) =>
                item.type === 'sep' ? null : (
                  <button
                    key={idx}
                    onClick={() => executeAction(item.action)}
                    style={{
                      display: 'block', width: '100%', padding: '10px 24px',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: 'var(--text2)', fontSize: '13px',
                      textAlign: 'left', fontFamily: 'Inter, sans-serif',
                    }}
                    onTouchStart={(e) => { e.currentTarget.style.background = 'rgba(124,58,237,0.15)'; }}
                    onTouchEnd={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    {item.label}
                  </button>
                )
              )}
              <div style={{ height: '1px', background: 'var(--border)', margin: '4px 16px' }} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default MenuBar;
