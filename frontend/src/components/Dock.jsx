import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { FcAbout, FcFolder, FcDiploma1, FcDocument, FcCommandLine, FcContacts, FcSettings, FcGlobe } from 'react-icons/fc';
import { useBreakpoint } from '../utils/responsive';

const dockItems = [
  { id: 'bento', label: 'About', icon: null, FcIcon: FcAbout, color: '#60A5FA', emoji: '👤' },
  { id: 'projects', label: 'Projects', icon: null, FcIcon: FcFolder, color: '#F472B6', emoji: '📁' },
  { id: 'certificates', label: 'Certs', icon: null, FcIcon: FcDiploma1, color: '#FBBF24', emoji: '🏆' },
  { id: 'resume', label: 'Resume', icon: null, FcIcon: FcDocument, color: '#34D399', emoji: '📄' },
  { id: 'contact', label: 'Contact', icon: null, FcIcon: FcContacts, color: '#FB923C', emoji: '📞' },
  { id: 'portfolio', label: 'Website', icon: null, FcIcon: FcGlobe, color: '#10B981', emoji: '🌐' },
  { id: 'terminal', label: 'Terminal', icon: null, FcIcon: FcCommandLine, color: '#A78BFA', emoji: '⬛' },
  { id: 'settings', label: 'Settings', icon: null, FcIcon: FcSettings, color: '#9CA3AF', emoji: '⚙️' },
];

const Dock = () => {
  const { openWindow, windows, activeWindow, focusWindow, minimizeWindow, closeWindow } = useStore();
  const [hoveredId, setHoveredId] = useState(null);
  const [contextMenuApp, setContextMenuApp] = useState(null); // { appId, x, y }
  const [isDockVisible, setIsDockVisible] = useState(true);
  const bp = useBreakpoint(); // 'mobile' | 'tablet' | 'desktop'

  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';
  const isSmall = isMobile || isTablet;

  // Icon size: smaller on mobile/tablet
  const iconSize = isMobile ? 26 : isTablet ? 32 : 36;
  const iconBoxSize = isMobile ? 44 : isTablet ? 54 : 72;
  const dockGap = isMobile ? 4 : isTablet ? 10 : 20;
  const dockPad = isMobile ? '8px 10px' : isTablet ? '12px 20px' : '16px 36px';

  // Auto-hide dock logic — desktop only (mouse-based)
  const isDockVisibleRef = React.useRef(isDockVisible);
  React.useEffect(() => {
    isDockVisibleRef.current = isDockVisible;
  }, [isDockVisible]);

  React.useEffect(() => {
    if (isSmall) return; // No auto-hide on touch devices
    let hideTimeout;
    const handleMouseMove = (e) => {
      const showZone = window.innerHeight - 30;
      const dockZone = window.innerHeight - 180;

      if (e.clientY >= showZone) {
        clearTimeout(hideTimeout);
        if (!isDockVisibleRef.current) setIsDockVisible(true);
      } else if (e.clientY >= dockZone && isDockVisibleRef.current) {
        clearTimeout(hideTimeout);
      } else {
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
          setIsDockVisible(false);
        }, 250);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(hideTimeout);
    };
  }, [isSmall]);

  const handleOpen = (item) => {
    window.dispatchEvent(new CustomEvent('open-app', { detail: item.id }));
    const win = windows.find(w => w.id === item.id || w.appId === item.id);
    let msg = 'Launched';
    if (win) {
      if (activeWindow === win.id && !win.isMinimized) msg = 'Minimized';
      else if (win.isMinimized) msg = 'Restored';
      else msg = 'Focused';
    }
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: { emoji: item.emoji, title: item.label, msg }
    }));
  };

  const handleDockItemContextMenu = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenuApp({
      item,
      x: rect.left + rect.width / 2,
      y: rect.top - 12,
    });
  };

  return (
    <>
      <motion.div
        initial={{ y: 0, x: '-50%' }}
        animate={{ y: isDockVisible || isSmall ? 0 : 120, x: '-50%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="dock"
        onMouseEnter={() => !isSmall && setIsDockVisible(true)}
        style={{
          position: 'fixed',
          bottom: isMobile ? '8px' : '12px',
          left: '50%',
          display: 'flex',
          gap: `${dockGap}px`,
          padding: dockPad,
          alignItems: 'flex-end',
          background: 'rgba(18, 18, 24, 0.72)',
          borderRadius: isMobile ? '16px' : '24px',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          maxWidth: 'calc(100vw - 16px)',
          overflowX: isSmall ? 'auto' : 'visible',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          zIndex: 9990,
        }}
      >
        {dockItems.map((item) => {
          const win = windows.find(w => (w.appId || w.id) === item.id);
          const isRunning = !!win;
          const isMinimized = win ? win.isMinimized : false;
          const isActive = win ? win.id === activeWindow && !isMinimized : false;
          const isHovered = hoveredId === item.id;
          const isAdjacent = !isSmall && hoveredId && (
            dockItems.findIndex(d => d.id === hoveredId) ===
            dockItems.findIndex(d => d.id === item.id) + 1 ||
            dockItems.findIndex(d => d.id === hoveredId) ===
            dockItems.findIndex(d => d.id === item.id) - 1
          );

          const IconComp = item.FcIcon;

          return (
            <div
              key={item.id}
              className="dock-item"
              onMouseEnter={() => !isSmall && setHoveredId(item.id)}
              onMouseLeave={() => !isSmall && setHoveredId(null)}
              onClick={() => handleOpen(item)}
              onContextMenu={(e) => handleDockItemContextMenu(e, item)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: isMobile ? '2px' : '4px',
                flexShrink: 0,
                position: 'relative',
              }}
            >
              {/* Tooltip — desktop only */}
              {!isSmall && (
                <AnimatePresence>
                  {isHovered && !contextMenuApp && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.85 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                      style={{
                        position: 'absolute',
                        top: '-54px',
                        background: 'rgba(18, 14, 28, 0.95)',
                        border: '1px solid rgba(233, 84, 32, 0.35)',
                        borderRadius: '10px',
                        padding: '6px 12px',
                        color: 'var(--text)',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.6), 0 0 12px rgba(233,84,32,0.15)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px' }}>{item.emoji}</span>
                        <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
                          {item.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: isActive ? '#E95420' : isRunning ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)',
                          boxShadow: isActive ? '0 0 6px #E95420' : 'none',
                        }} />
                        <span style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>
                          {isActive ? 'Active' : isMinimized ? 'Minimized' : isRunning ? 'Running' : 'Closed'}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {/* Icon */}
              <motion.div
                animate={!isSmall ? {
                  scale: isHovered ? 1.32 : isAdjacent ? 1.12 : 1,
                  y: isHovered ? -10 : isAdjacent ? -5 : 0,
                } : {
                  scale: 1,
                  y: 0,
                }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                style={{
                  width: `${iconBoxSize}px`,
                  height: `${iconBoxSize}px`,
                  borderRadius: isMobile ? '12px' : '18px',
                  background: isActive
                    ? `linear-gradient(135deg, ${item.color}35, rgba(233, 84, 32, 0.25))`
                    : isRunning
                      ? 'rgba(255,255,255,0.1)'
                      : 'rgba(255,255,255,0.05)',
                  border: isActive
                    ? '1.5px solid #E95420'
                    : isRunning
                      ? '1px solid rgba(255,255,255,0.2)'
                      : '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isActive
                    ? `0 0 20px ${item.color}44, 0 0 10px rgba(233, 84, 32, 0.4)`
                    : isRunning
                      ? '0 4px 14px rgba(0,0,0,0.4)'
                      : '0 4px 10px rgba(0,0,0,0.25)',
                }}
              >
                <IconComp size={iconSize} />
                {/* Glossy overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, height: '50%',
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.14), transparent)',
                  borderRadius: isMobile ? '10px 10px 0 0' : '16px 16px 0 0',
                  pointerEvents: 'none',
                }} />
              </motion.div>

              {/* Label below icon — hide on mobile */}
              {!isMobile && (
                <div style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: isActive ? '#E95420' : 'var(--text)',
                  fontFamily: 'Syne, sans-serif',
                  textShadow: '0 1px 3px rgba(0,0,0,0.6)',
                  whiteSpace: 'nowrap',
                }}>
                  {item.label}
                </div>
              )}

              {/* Ubuntu Yaru Orange Running Indicator Dot */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '6px',
                marginTop: '1px',
              }}>
                {isRunning ? (
                  <span
                    style={{
                      width: isActive ? '7px' : '5px',
                      height: isActive ? '7px' : '5px',
                      borderRadius: '50%',
                      background: isActive
                        ? '#E95420'
                        : isMinimized
                          ? 'rgba(255,255,255,0.35)'
                          : 'rgba(233, 84, 32, 0.75)',
                      boxShadow: isActive ? '0 0 8px #E95420, 0 0 2px #E95420' : 'none',
                      transition: 'all 0.25s ease',
                    }}
                  />
                ) : (
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'transparent' }} />
                )}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Dock Item Context Menu (Ubuntu Style) */}
      <AnimatePresence>
        {contextMenuApp && (() => {
          const win = windows.find(w => (w.appId || w.id) === contextMenuApp.item.id);
          const isRunning = !!win;

          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8 }}
              transition={{ duration: 0.12 }}
              style={{
                position: 'fixed',
                left: `${contextMenuApp.x}px`,
                top: `${contextMenuApp.y}px`,
                transform: 'translate(-50%, -100%)',
                background: 'rgba(22, 18, 30, 0.96)',
                border: '1px solid rgba(233, 84, 32, 0.3)',
                borderRadius: '12px',
                padding: '6px 0',
                minWidth: '160px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 12px 36px rgba(0,0,0,0.7), 0 0 15px rgba(233,84,32,0.15)',
                zIndex: 99999,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{
                padding: '6px 14px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#E95420',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>{contextMenuApp.item.emoji}</span>
                <span>{contextMenuApp.item.label}</span>
              </div>

              {/* Action items */}
              {!isRunning ? (
                <button
                  onClick={() => {
                    handleOpen(contextMenuApp.item);
                    setContextMenuApp(null);
                  }}
                  style={{
                    display: 'block', width: '100%', padding: '6px 14px',
                    background: 'none', border: 'none', color: 'var(--text)',
                    fontSize: 'var(--fs-sm)', textAlign: 'left', cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(233,84,32,0.18)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  ▶️ Open App
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      focusWindow(win.id);
                      setContextMenuApp(null);
                    }}
                    style={{
                      display: 'block', width: '100%', padding: '6px 14px',
                      background: 'none', border: 'none', color: 'var(--text)',
                      fontSize: 'var(--fs-sm)', textAlign: 'left', cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(233,84,32,0.18)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    👁️ Focus Window
                  </button>

                  <button
                    onClick={() => {
                      if (win.isMinimized) focusWindow(win.id);
                      else minimizeWindow(win.id);
                      setContextMenuApp(null);
                    }}
                    style={{
                      display: 'block', width: '100%', padding: '6px 14px',
                      background: 'none', border: 'none', color: 'var(--text2)',
                      fontSize: 'var(--fs-sm)', textAlign: 'left', cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(233,84,32,0.18)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    {win.isMinimized ? '↗️ Restore' : '➖ Minimize'}
                  </button>

                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />

                  <button
                    onClick={() => {
                      closeWindow(win.id);
                      setContextMenuApp(null);
                    }}
                    style={{
                      display: 'block', width: '100%', padding: '6px 14px',
                      background: 'none', border: 'none', color: '#F87171',
                      fontSize: 'var(--fs-sm)', textAlign: 'left', cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    ✖️ Quit
                  </button>
                </>
              )}
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Backdrop listener to close context menu */}
      {contextMenuApp && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99998 }}
          onClick={() => setContextMenuApp(null)}
          onContextMenu={(e) => { e.preventDefault(); setContextMenuApp(null); }}
        />
      )}
    </>
  );
};

export default Dock;
