import React from 'react'
import { AnimatePresence } from 'framer-motion'
import useStore from './store/useStore'
import BootScreen from './components/BootScreen'
import Desktop from './components/Desktop'

/**
 * Applies ALL settings to the document root as CSS custom properties.
 * This is the SINGLE source of truth for bridging Zustand state → DOM styles.
 *
 * Font-size scale: every size is derived from the base fontSize so the
 * entire UI scales proportionally when the user drags the slider.
 */
function applySettings(settings) {
  const root = document.documentElement;

  // ── Theme ──
  if (settings.theme) {
    root.setAttribute('data-theme', settings.theme);
  }

  // ── Density ──
  root.setAttribute('data-density', settings.density || 'comfortable');

  // ── Font Size Scale ──
  // Parse as number, default 14, clamp 10-40
  const base = Math.min(40, Math.max(10, parseInt(settings.fontSize) || 14));
  const ratio = base / 14; // scale factor relative to default 14px

  root.style.fontSize = `${base}px`;
  root.style.setProperty('--base-font-size', `${base}px`);

  // Proportional type scale — all components use these instead of hardcoded px
  root.style.setProperty('--fs-xs',  `${Math.round(9  * ratio)}px`);   // tiny labels, badges
  root.style.setProperty('--fs-sm',  `${Math.round(11 * ratio)}px`);   // terminal, secondary text
  root.style.setProperty('--fs-base', `${base}px`);                     // body text
  root.style.setProperty('--fs-md',  `${Math.round(15 * ratio)}px`);   // subtitles, roles
  root.style.setProperty('--fs-lg',  `${Math.round(18 * ratio)}px`);   // section headers
  root.style.setProperty('--fs-xl',  `${Math.round(22 * ratio)}px`);   // page titles
  root.style.setProperty('--fs-2xl', `${Math.round(30 * ratio)}px`);   // hero name
  root.style.setProperty('--fs-3xl', `${Math.round(42 * ratio)}px`);   // desktop clock

  // Legacy alias used by older styles
  root.style.setProperty('--title-font-size', `${Math.round(16 * ratio)}px`);

  // ── Font Family ──
  if (settings.fontStyle) {
    root.style.setProperty('--font-ui', `'${settings.fontStyle}', sans-serif`);
  } else {
    root.style.removeProperty('--font-ui');
  }

  // ── Font Color ──
  if (settings.fontColor) {
    root.style.setProperty('--custom-font-color', settings.fontColor);
  } else {
    root.style.removeProperty('--custom-font-color');
  }

  // ── Animations: reduce motion ──
  if (settings.reduceMotion) {
    root.style.setProperty('--transition-speed', '0ms');
    root.setAttribute('data-reduce-motion', 'true');
  } else {
    root.style.removeProperty('--transition-speed');
    root.removeAttribute('data-reduce-motion');
  }

  // ── Cursor style ──
  if (settings.cursorStyle && settings.cursorStyle !== 'default') {
    root.style.cursor = settings.cursorStyle;
  } else {
    root.style.removeProperty('cursor');
  }
}

function App() {
  const { isBooting, settings, loadUser } = useStore()

  React.useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Apply settings on every settings change AND on initial mount
  React.useEffect(() => {
    applySettings(settings);
  }, [settings]);

  return (
    <>
      <AnimatePresence>
        {isBooting && <BootScreen key="boot" />}
      </AnimatePresence>
      {!isBooting && <Desktop />}
    </>
  )
}

export default App
