import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/* ══════════════════════════════════════════════════════
   🔐 CLIENT-SIDE SECURITY SHIELD
   Deters casual inspection / scraping / reverse engineering
══════════════════════════════════════════════════════ */

(function applySecurityShield() {
  // ── 1. Disable right-click context menu ──
  document.addEventListener('contextmenu', (e) => e.preventDefault(), { capture: true });

  // ── 2. Disable common keyboard shortcuts to DevTools / View Source ──
  document.addEventListener('keydown', (e) => {
    const key = e.key?.toLowerCase();

    // F12 – DevTools
    if (e.key === 'F12') { e.preventDefault(); return; }

    // Ctrl/Cmd + Shift + I/J/C/K – DevTools panels
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c', 'k'].includes(key)) {
      e.preventDefault(); return;
    }

    // Ctrl/Cmd + U – View Page Source
    if ((e.ctrlKey || e.metaKey) && key === 'u') { e.preventDefault(); return; }

    // Ctrl/Cmd + S – Save Page
    if ((e.ctrlKey || e.metaKey) && key === 's') { e.preventDefault(); return; }

    // Ctrl/Cmd + A – Select All (prevent mass DOM scraping)
    if ((e.ctrlKey || e.metaKey) && key === 'a') { e.preventDefault(); return; }

    // Ctrl/Cmd + P – Print (can expose content)
    if ((e.ctrlKey || e.metaKey) && key === 'p') { e.preventDefault(); return; }
  }, { capture: true });

  // ── 3. DevTools open detection (heuristic: console timing trick) ──
  let devtoolsOpen = false;
  const threshold = 160;

  const detectDevTools = () => {
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        // Clear console repeatedly when devtools is open
        console.clear();
        console.log('%c🔒 Access Restricted', 'font-size:32px; color:#7C3AED; font-weight:bold;');
        console.log('%cThis is a private portfolio system. Unauthorized inspection is not permitted.', 'font-size:14px; color:#888;');
      }
    } else {
      devtoolsOpen = false;
    }
  };

  setInterval(detectDevTools, 1000);
  window.addEventListener('resize', detectDevTools);

  // ── 4. Disable text selection on the whole app (CSS is added to body) ──
  // We only disable selection on non-interactive elements via CSS, not here.
  // This is handled in index.css to preserve input usability.

  // ── 5. Anti-drag of images ──
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') e.preventDefault();
  });

  // ── 6. Console warning to deter curious visitors ──
  console.clear();
  console.log('%c🛡️ PortfolioOS Security Notice', 'font-size:22px; font-weight:bold; color:#7C3AED;');
  console.log('%cThis is a private portfolio system. All actions are logged.', 'font-size:14px; color:#888;');

})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
