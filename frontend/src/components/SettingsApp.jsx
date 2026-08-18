import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime, formatDateLong } from '../utils/timeUtils';

/* ── reusable styles ── */
const sectionTitle = { fontSize: 'var(--fs-md)', fontWeight: 600, marginBottom: '14px', color: 'var(--lavender)' };
const hint = { color: 'var(--text3)', fontSize: 'var(--fs-xs)', marginTop: '6px' };
const cardStyle = {
  background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
  borderRadius: '12px', padding: '16px', marginBottom: '12px'
};
const rowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' };
const btnStyle = {
  background: 'rgba(124,58,237,0.15)', border: '1px solid var(--border)',
  color: 'var(--lavender)', padding: '6px 14px', borderRadius: '8px',
  cursor: 'pointer', fontSize: 'var(--fs-sm)', fontWeight: 600, transition: 'all 0.2s'
};

/* ── Toggle Switch ── */
const Toggle = ({ checked, onChange }) => (
  <div onClick={() => onChange(!checked)} style={{
    width: '40px', height: '22px', borderRadius: '11px', cursor: 'pointer',
    background: checked ? 'var(--violet)' : 'rgba(255,255,255,0.15)',
    position: 'relative', transition: 'background 0.2s', flexShrink: 0
  }}>
    <div style={{
      width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
      position: 'absolute', top: '2px', left: checked ? '20px' : '2px',
      transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
    }} />
  </div>
);

/* ── Section Row ── */
const SettingRow = ({ label, desc, children }) => (
  <div style={{ ...cardStyle }}>
    <div style={rowStyle}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text)' }}>{label}</div>
        {desc && <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', marginTop: '2px' }}>{desc}</div>}
      </div>
      {children}
    </div>
  </div>
);

const SettingsApp = () => {
  const { settings, updateSetting } = useStore();
  const [activeTab, setActiveTab] = useState('appearance');
  const [clock, setClock] = useState('');

  const change = (key, value) => updateSetting(key, value);

  // Live clock
  useEffect(() => {
    const tick = () => {
      setClock(formatTime(new Date(), settings));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [settings]);

  const themes = [
    { id: 'dark', label: 'Dark Void', color: '#0B0614' },
    { id: 'light', label: 'Light Pearl', color: '#F0EBF8' },
    { id: 'ocean', label: 'Deep Ocean', color: '#020B18' },
    { id: 'rose', label: 'Rose Quartz', color: '#1A0A12' },
    { id: 'forest', label: 'Emerald Forest', color: '#021A0A' },
  ];

  const fontStyles = [
    { id: 'Syne', label: 'Syne (Default)' },
    { id: 'Inter', label: 'Inter' },
    { id: 'Roboto', label: 'Roboto' },
    { id: 'Poppins', label: 'Poppins' },
    { id: 'Outfit', label: 'Outfit' },
    { id: 'Space Grotesk', label: 'Space Grotesk' },
    { id: 'Nunito', label: 'Nunito' },
    { id: 'Playfair Display', label: 'Playfair Display' },
    { id: 'Fira Code', label: 'Fira Code' },
    { id: 'JetBrains Mono', label: 'JetBrains Mono' },
  ];

  const timezones = [
    'Asia/Kolkata', 'UTC', 'America/New_York', 'America/Chicago',
    'America/Los_Angeles', 'Europe/London', 'Europe/Berlin',
    'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney',
    'Asia/Dubai', 'Pacific/Auckland'
  ];

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'typography', label: 'Typography', icon: '🔤' },
    { id: 'datetime', label: 'Date & Time', icon: '🕐' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿' },
    { id: 'background', label: 'Wallpaper', icon: '🖼️' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ];

  const fontSize = typeof settings.fontSize === 'number' ? settings.fontSize : parseInt(settings.fontSize) || 14;

  const anim = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 } };

  return (
    <div style={{ display: 'flex', height: '100%', color: 'var(--text)', fontFamily: 'var(--font-ui)', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{
        width: '190px', borderRight: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)',
        padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto'
      }}>
        <h2 className="gradient-text" style={{ fontSize: 'var(--fs-lg)', fontWeight: 700, marginBottom: '12px', paddingLeft: '10px' }}>Settings</h2>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '8px',
            background: activeTab === tab.id ? 'rgba(124,58,237,0.2)' : 'transparent',
            color: activeTab === tab.id ? 'var(--lavender)' : 'var(--text2)',
            border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 'var(--fs-sm)',
            fontWeight: activeTab === tab.id ? 600 : 500, transition: 'all 0.2s', fontFamily: 'inherit'
          }}>
            <span style={{ fontSize: 'var(--fs-md)' }}>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        <AnimatePresence mode="wait">

          {/* ═══ APPEARANCE ═══ */}
          {activeTab === 'appearance' && (
            <motion.div key="appearance" {...anim} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <section>
                <h3 style={sectionTitle}>System Theme</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px' }}>
                  {themes.map(t => (
                    <motion.div key={t.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => change('theme', t.id)} style={{
                        ...cardStyle, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                        border: settings.theme === t.id ? '2px solid var(--lavender)' : '1px solid var(--border)',
                        boxShadow: settings.theme === t.id ? '0 0 15px rgba(124,58,237,0.2)' : 'none'
                      }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: t.color, border: '1px solid rgba(255,255,255,0.2)' }} />
                      <span style={{ fontSize: 'var(--fs-sm)', fontWeight: settings.theme === t.id ? 700 : 500 }}>{t.label}</span>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section>
                <h3 style={sectionTitle}>UI Density</h3>
                {['compact', 'comfortable', 'spacious'].map(d => (
                  <label key={d} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: 'var(--fs-sm)', marginBottom: '8px', textTransform: 'capitalize' }}>
                    <input type="radio" name="density" checked={settings.density === d} onChange={() => change('density', d)}
                      style={{ accentColor: 'var(--violet)', width: '15px', height: '15px' }} />
                    {d}
                  </label>
                ))}
              </section>

              <SettingRow label="Animations" desc="Enable or disable UI transition effects">
                <Toggle checked={settings.animations !== false} onChange={(v) => change('animations', v)} />
              </SettingRow>
            </motion.div>
          )}

          {/* ═══ TYPOGRAPHY ═══ */}
          {activeTab === 'typography' && (
            <motion.div key="typography" {...anim} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <section>
                <h3 style={sectionTitle}>Font Size — {fontSize}px</h3>
                <div style={{ maxWidth: '420px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <button onClick={() => change('fontSize', Math.max(10, fontSize - 1))} style={btnStyle}>−</button>
                    <input type="range" min="10" max="40" step="1"
                      value={fontSize}
                      onChange={(e) => change('fontSize', Number(e.target.value))}
                      style={{ flex: 1, accentColor: 'var(--violet)' }} />
                    <button onClick={() => change('fontSize', Math.min(40, fontSize + 1))} style={btnStyle}>+</button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', ...hint }}><span>10px</span><span>40px</span></div>
                </div>
                <div style={{ marginTop: '12px', padding: '12px', ...cardStyle }}>
                  <span style={{ fontSize: `${fontSize}px` }}>The quick brown fox jumps over the lazy dog.</span>
                </div>
              </section>

              <section>
                <h3 style={sectionTitle}>Font Family</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px', maxWidth: '520px' }}>
                  {fontStyles.map(f => (
                    <motion.div key={f.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => change('fontStyle', f.id)} style={{
                        ...cardStyle, cursor: 'pointer', padding: '10px 14px', textAlign: 'center',
                        fontFamily: `'${f.id}', sans-serif`, fontSize: 'var(--fs-sm)',
                        border: settings.fontStyle === f.id ? '2px solid var(--lavender)' : '1px solid var(--border)',
                        boxShadow: settings.fontStyle === f.id ? '0 0 12px rgba(124,58,237,0.15)' : 'none'
                      }}>
                      {f.label}
                    </motion.div>
                  ))}
                </div>
              </section>

              <section>
                <h3 style={sectionTitle}>Text Color Override</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '400px' }}>
                  <input type="color" value={settings.fontColor || '#E2D9F3'}
                    onChange={(e) => change('fontColor', e.target.value)}
                    style={{ width: '36px', height: '36px', padding: 0, border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} />
                  <input type="text" className="adm-input" placeholder="#E2D9F3" value={settings.fontColor || ''}
                    onChange={(e) => change('fontColor', e.target.value)} style={{ flex: 1 }} />
                  <button onClick={() => change('fontColor', '')} style={btnStyle}>Reset</button>
                </div>
                <p style={hint}>Overrides the theme's default text color.</p>
              </section>
            </motion.div>
          )}

          {/* ═══ DATE & TIME ═══ */}
          {activeTab === 'datetime' && (
            <motion.div key="datetime" {...anim} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <section>
                <h3 style={sectionTitle}>Live Clock</h3>
                <div style={{ ...cardStyle, textAlign: 'center', padding: '24px' }}>
                  <div style={{ fontSize: 'var(--fs-3xl)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--lavender)', letterSpacing: '2px' }}>
                    {clock}
                  </div>
                  <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text2)', marginTop: '8px' }}>
                    {formatDateLong(new Date(), settings)}
                  </div>
                </div>
              </section>

              <SettingRow label="Clock Format" desc="Choose between 12-hour and 24-hour display">
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['12h', '24h'].map(f => (
                    <button key={f} onClick={() => change('clockFormat', f)} style={{
                      ...btnStyle,
                      background: settings.clockFormat === f ? 'var(--violet)' : 'rgba(255,255,255,0.08)',
                      color: settings.clockFormat === f ? '#fff' : 'var(--text2)'
                    }}>{f}</button>
                  ))}
                </div>
              </SettingRow>

              <SettingRow label="Show Seconds" desc="Display seconds in the clock">
                <Toggle checked={!!settings.showSeconds} onChange={(v) => change('showSeconds', v)} />
              </SettingRow>

              <section>
                <h3 style={sectionTitle}>Timezone</h3>
                <select className="adm-input" style={{ maxWidth: '400px', cursor: 'pointer' }}
                  value={settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
                  onChange={(e) => change('timezone', e.target.value)}>
                  {timezones.map(tz => <option key={tz} value={tz} style={{ background: 'var(--bg)', color: 'var(--text)' }}>{tz.replace(/_/g, ' ')}</option>)}
                </select>
              </section>

              <section>
                <h3 style={sectionTitle}>Date Format</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['MMM DD, YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY'].map(fmt => (
                    <button key={fmt} onClick={() => change('dateFormat', fmt)} style={{
                      ...btnStyle,
                      background: settings.dateFormat === fmt ? 'var(--violet)' : 'rgba(255,255,255,0.08)',
                      color: settings.dateFormat === fmt ? '#fff' : 'var(--text2)'
                    }}>{fmt}</button>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* ═══ ACCESSIBILITY ═══ */}
          {activeTab === 'accessibility' && (
            <motion.div key="accessibility" {...anim} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <SettingRow label="Reduce Motion" desc="Minimize animations for motion sensitivity">
                <Toggle checked={!!settings.reduceMotion} onChange={(v) => change('reduceMotion', v)} />
              </SettingRow>

              <section>
                <h3 style={sectionTitle}>Cursor Style</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['default', 'crosshair', 'pointer', 'text', 'wait', 'help'].map(c => (
                    <motion.div key={c} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => change('cursorStyle', c)} style={{
                        ...cardStyle, cursor: c, padding: '10px 18px', fontSize: 'var(--fs-sm)', textTransform: 'capitalize',
                        border: settings.cursorStyle === c ? '2px solid var(--lavender)' : '1px solid var(--border)'
                      }}>
                      {c}
                    </motion.div>
                  ))}
                </div>
              </section>

              <section>
                <h3 style={sectionTitle}>Quick Font Size</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[{ label: 'Small (12px)', size: 12 }, { label: 'Default (14px)', size: 14 }, { label: 'Large (18px)', size: 18 }, { label: 'XL (22px)', size: 22 }].map(p => (
                    <button key={p.size} onClick={() => change('fontSize', p.size)} style={{
                      ...btnStyle,
                      background: fontSize === p.size ? 'var(--violet)' : 'rgba(255,255,255,0.08)',
                      color: fontSize === p.size ? '#fff' : 'var(--text2)'
                    }}>{p.label}</button>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* ═══ WALLPAPER ═══ */}
          {activeTab === 'background' && (
            <motion.div key="background" {...anim} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <section>
                <h3 style={sectionTitle}>Wallpaper URL</h3>
                <input type="text" className="adm-input" placeholder="https://example.com/image.jpg"
                  value={settings.wallpaper || ''} onChange={(e) => change('wallpaper', e.target.value)}
                  style={{ width: '100%', maxWidth: '500px' }} />
                <p style={hint}>Enter an image URL or leave empty for default theme background.</p>
                {settings.wallpaper && (
                  <div style={{ marginTop: '14px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', height: '180px', maxWidth: '500px' }}>
                    <img src={settings.wallpaper} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                )}
                {settings.wallpaper && (
                  <button onClick={() => change('wallpaper', '')} style={{ ...btnStyle, marginTop: '10px' }}>Clear Wallpaper</button>
                )}
              </section>
            </motion.div>
          )}

          {/* ═══ ABOUT ═══ */}
          {activeTab === 'about' && (
            <motion.div key="about" {...anim} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ ...cardStyle, padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--fs-2xl)', marginBottom: '8px' }}>💻</div>
                <h3 className="gradient-text" style={{ fontSize: 'var(--fs-xl)', fontWeight: 700 }}>PortfolioOS</h3>
                <p style={{ color: 'var(--text2)', fontSize: 'var(--fs-sm)', marginTop: '6px' }}>Version 2.0 — React Edition</p>
              </div>

              {[
                ['System', 'PortfolioOS v2.0'],
                ['Framework', 'React 19 + Vite 8'],
                ['Styling', 'Tailwind CSS v4 + Custom CSS'],
                ['Animations', 'Framer Motion'],
                ['State', 'Zustand'],
                ['Backend', 'Node.js + Express + MongoDB'],
              ].map(([k, v]) => (
                <div key={k} style={{ ...cardStyle, padding: '10px 14px' }}>
                  <div style={rowStyle}>
                    <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text3)', fontWeight: 600 }}>{k}</span>
                    <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{v}</span>
                  </div>
                </div>
              ))}

              <button onClick={() => {
                localStorage.clear();
                window.location.reload();
              }} style={{ ...btnStyle, background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', padding: '10px 20px', fontSize: 'var(--fs-sm)' }}>
                🔄 Reset All Settings
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default SettingsApp;
