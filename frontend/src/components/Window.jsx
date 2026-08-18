import React, { useState, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { useIsMobile } from '../utils/responsive';

const Window = ({ id, title, icon, emoji, children, defaultSize = { width: 700, height: 500 }, defaultPosition }) => {
  const { windows, closeWindow, minimizeWindow, maximizeWindow, focusWindow, activeWindow } = useStore();
  const [isClosing, setIsClosing] = useState(false);
  const isMobile = useIsMobile(768); // <= 768px → mobile mode

  // Use local state to fully control the react-rnd component for dragging/resizing
  const [pos, setPos] = useState({
    x: defaultPosition?.x ?? (Math.random() * 80 + 60),
    y: defaultPosition?.y ?? (Math.random() * 40 + 40),
  });
  const [size, setSize] = useState({
    width: defaultSize.width,
    height: defaultSize.height,
  });

  const windowState = windows.find(w => w.id === id);
  if (!windowState || windowState.isMinimized) return null;

  const { isMaximized, zIndex } = windowState;
  const isActive = activeWindow === id;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => closeWindow(id), 200);
  };

  // ── Mobile: render as a full-screen fixed overlay (no drag/resize) ──
  if (isMobile) {
    return (
      <AnimatePresence>
        {!isClosing && (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
            className="os-window"
            style={{
              position: 'fixed',
              top: 32,        // below MenuBar (32px on mobile)
              left: 0,
              right: 0,
              bottom: 80,     // above Dock (~80px)
              zIndex: zIndex,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 0,
              border: 'none',
              borderTop: '1px solid rgba(124, 58, 237, 0.3)',
              boxShadow: '0 -4px 30px rgba(0,0,0,0.5)',
            }}
            onMouseDown={() => focusWindow(id)}
          >
            {/* Mobile Title Bar */}
            <div
              className="win-titlebar"
              style={{ cursor: 'default' }}
            >
              {/* Traffic lights */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginRight: '14px' }}>
                <button
                  className="traffic-btn close"
                  onClick={(e) => { e.stopPropagation(); handleClose(); }}
                  onMouseDown={(e) => e.stopPropagation()}
                  title="Close"
                />
                <button
                  className="traffic-btn minimize"
                  onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
                  onMouseDown={(e) => e.stopPropagation()}
                  title="Minimize"
                />
                <button
                  className="traffic-btn maximize"
                  onClick={(e) => { e.stopPropagation(); maximizeWindow(id); }}
                  onMouseDown={(e) => e.stopPropagation()}
                  title="Maximize"
                />
              </div>

              {/* Title */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                {emoji && <span style={{ fontSize: 'var(--fs-base)' }}>{emoji}</span>}
                {icon && <span style={{ fontSize: 'var(--fs-base)' }}>{icon}</span>}
                <span style={{
                  fontSize: 'var(--fs-sm)',
                  fontWeight: 600,
                  color: 'var(--text)',
                  fontFamily: 'Syne, sans-serif',
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {title}
                </span>
              </div>

              {/* Active indicator */}
              {isActive && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '8px' }}>
                  <span className="status-dot" />
                </div>
              )}
            </div>

            {/* Window content */}
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // ── Desktop: original react-rnd draggable/resizable window ──
  return (
    <AnimatePresence>
      {!isClosing && (
        <Rnd
          key={id}
          size={isMaximized ? { width: '100vw', height: 'calc(100vh - 28px)' } : size}
          position={isMaximized ? { x: 0, y: 28 } : pos}
          onDrag={(e, d) => {
            if (!isMaximized) setPos({ x: d.x, y: d.y });
          }}
          onDragStop={(e, d) => {
            if (!isMaximized) setPos({ x: d.x, y: d.y });
          }}
          onResize={(e, direction, ref, delta, position) => {
            if (!isMaximized) {
              setSize({ width: ref.style.width, height: ref.style.height });
              setPos(position);
            }
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            if (!isMaximized) {
              setSize({ width: ref.style.width, height: ref.style.height });
              setPos(position);
            }
          }}
          disableDragging={isMaximized}
          enableResizing={!isMaximized}
          minWidth={320}
          minHeight={240}
          dragHandleClassName="window-handle"
          cancel=".traffic-btn"
          style={{
            zIndex,
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
          }}
          onMouseDown={() => focusWindow(id)}
          onDragStart={() => focusWindow(id)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28, duration: 0.25 }}
            className="os-window"
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              border: isActive
                ? '1px solid rgba(124, 58, 237, 0.4)'
                : '1px solid rgba(124, 58, 237, 0.15)',
              boxShadow: isActive
                ? '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.15), 0 0 40px rgba(124,58,237,0.05)'
                : '0 12px 40px rgba(0,0,0,0.5)',
            }}
          >
            {/* Title Bar */}
            <div
              className="window-handle win-titlebar"
              style={{ cursor: isMaximized ? 'default' : 'grab' }}
            >
              {/* Traffic lights */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginRight: '14px' }}>
                <button
                  className="traffic-btn close"
                  onClick={(e) => { e.stopPropagation(); handleClose(); }}
                  onMouseDown={(e) => e.stopPropagation()}
                  title="Close"
                />
                <button
                  className="traffic-btn minimize"
                  onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
                  onMouseDown={(e) => e.stopPropagation()}
                  title="Minimize"
                />
                <button
                  className="traffic-btn maximize"
                  onClick={(e) => { e.stopPropagation(); maximizeWindow(id); }}
                  onMouseDown={(e) => e.stopPropagation()}
                  title={isMaximized ? 'Restore' : 'Maximize'}
                />
              </div>

              {/* Title */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                {emoji && <span style={{ fontSize: 'var(--fs-base)' }}>{emoji}</span>}
                {icon && <span style={{ fontSize: 'var(--fs-base)' }}>{icon}</span>}
                <span style={{
                  fontSize: 'var(--fs-sm)',
                  fontWeight: 600,
                  color: 'var(--text)',
                  fontFamily: 'Syne, sans-serif',
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {title}
                </span>
              </div>

              {/* Active indicator */}
              {isActive && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '8px' }}>
                  <span className="status-dot" />
                </div>
              )}
            </div>

            {/* Window content */}
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {children}
            </div>
          </motion.div>
        </Rnd>
      )}
    </AnimatePresence>
  );
};

export default Window;
