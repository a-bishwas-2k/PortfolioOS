import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocialLogo } from '../utils/icons';
const getSkillIconUrl = (name) => {
  const normalized = name.toLowerCase().replace(/[^a-z0-9+.-]/g, '');

  // Custom mapping for icons missing from simple-icons due to trademark issues
  // or needing specific URLs. We use Devicon for these.
  const customMap = {
    'c++': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
    'cpp': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
    'c#': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg',
    'csharp': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg',
    'java': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
    'aws': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
    'amazonaws': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
    'mysql': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg',
    'oracle': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/oracle/oracle-original.svg'
  };

  if (customMap[normalized]) {
    return customMap[normalized];
  }

  const slugMap = {
    'f#': 'fsharp',
    'js': 'javascript',
    'ts': 'typescript',
    'node': 'nodedotjs',
    'nodejs': 'nodedotjs',
    'html': 'html5',
    'css': 'css',
    'css3': 'css',
    'reactjs': 'react',
    'vuejs': 'vuedotjs',
    'vue': 'vuedotjs',
    'next': 'nextdotjs',
    'nextjs': 'nextdotjs',
    'tailwind': 'tailwindcss',
    'postgres': 'postgresql',
    'mongo': 'mongodb',
    'k8s': 'kubernetes',
    'framermotion': 'framer',
    'framer': 'framer'
  };

  const slug = slugMap[normalized] || normalized;
  return `https://cdn.simpleicons.org/${slug}`;
};

const DynamicSkillIcon = ({ name, size = 18 }) => {
  const [error, setError] = useState(false);
  const iconUrl = getSkillIconUrl(name);

  if (error) {
    return <span style={{ fontSize: `${size}px`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>⚡</span>;
  }

  return (
    <img
      src={iconUrl}
      width={size}
      height={size}
      alt={`${name} icon`}
      onError={() => setError(true)}
      style={{ objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
    />
  );
};

const LinkIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>;

const FileTextIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;

const DownloadIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
import useStore from '../store/useStore';

const TABS = [
  { id: 'about', label: '👤 Profile' },
  { id: 'skills', label: '⚡ Skills' },
  { id: 'education', label: '🎓 Education' },
  { id: 'facts', label: '✨ Fun Facts' },
  { id: 'gitlog', label: '🕐 Git Log' },
];

const SkillBar = ({ name, level, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2, scale: 1.02 }}
      style={{
        padding: '12px 16px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px',
            borderRadius: '8px',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <DynamicSkillIcon name={name} size={18} />
          </div>
          <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text)', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>{name}</span>
        </div>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>{level}%</span>
      </div>
      <div style={{
        height: '6px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '99px',
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: index * 0.1 + 0.2 }}
          style={{
            height: '100%',
            borderRadius: '99px',
            background: `linear-gradient(90deg, var(--violet), var(--lavender))`,
            boxShadow: '0 0 10px rgba(124, 58, 237, 0.5)'
          }}
        />
      </div>
    </motion.div>
  );
};

const BentoApp = () => {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState('about');

  if (!user) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace', fontSize: 'var(--fs-sm)' }}>
      Loading user data...
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--window-bg)' }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        gap: '2px',
        padding: '10px 12px 0',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(0,0,0,0.2)',
        overflowX: 'auto',
        flexShrink: 0,
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '7px 14px',
              borderRadius: '8px 8px 0 0',
              border: 'none',
              background: activeTab === tab.id ? 'rgba(124,58,237,0.15)' : 'transparent',
              color: activeTab === tab.id ? 'var(--lavender)' : 'var(--text3)',
              fontSize: 'var(--fs-xs)',
              fontFamily: 'Syne, sans-serif',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              borderBottom: activeTab === tab.id ? '2px solid var(--violet)' : '2px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ height: '100%' }}
          >

            {/* PROFILE TAB */}
            {activeTab === 'about' && (
              <div style={{
                position: 'relative', width: '100%', minHeight: '600px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', background: '#050510', overflow: 'hidden',
                borderRadius: '24px', padding: '60px 40px', border: '1px solid rgba(124,58,237,0.2)', gap: '40px'
              }}>
                {/* Space Background Nodes Effect */}
                <div style={{ position: 'absolute', inset: 0, opacity: 0.6, backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(124,58,237,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(34,211,238,0.1) 0%, transparent 50%)', pointerEvents: 'none' }}></div>
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.2, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
                  <circle cx="15%" cy="25%" r="1.5" fill="#fff" />
                  <circle cx="25%" cy="15%" r="1" fill="#fff" />
                  <line x1="15%" y1="25%" x2="25%" y2="15%" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                  <circle cx="85%" cy="75%" r="1.5" fill="#fff" />
                  <circle cx="75%" cy="85%" r="1" fill="#fff" />
                  <line x1="85%" y1="75%" x2="75%" y2="85%" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                  <circle cx="80%" cy="20%" r="2" fill="var(--cyan)" />
                  <line x1="25%" y1="15%" x2="80%" y2="20%" stroke="rgba(34,211,238,0.2)" strokeWidth="0.5" />
                  <circle cx="20%" cy="80%" r="2" fill="var(--violet)" />
                  <line x1="75%" y1="85%" x2="20%" y2="80%" stroke="rgba(124,58,237,0.2)" strokeWidth="0.5" />
                </svg>

                <div style={{ display: 'flex', width: '100%', gap: '60px', position: 'relative', zIndex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>

                  {/* Left side / Center: The glowing name ring */}
                  <div style={{ position: 'relative', width: '320px', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* SVG for Rotating Text */}
                    <motion.svg animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} viewBox="0 0 200 200" style={{ position: 'absolute', width: '100%', height: '100%' }}>
                      <path id="innerCurve" fill="transparent" d="M 100, 100 m -85, 0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0" />
                      <text fill="var(--cyan)" fontSize="9" letterSpacing="1.5" fontWeight="600" fontFamily="JetBrains Mono, monospace">
                        <textPath href="#innerCurve" startOffset="0%">
                          $ {user.role || 'Data Analyst | Full-Stack Developer | CS Graduate'} •  {user.role || 'Data Analyst | Full-Stack Developer | CS Graduate'} •
                        </textPath>
                      </text>
                    </motion.svg>

                    {/* Center Glowing Border */}
                    <div style={{ position: 'absolute', width: '220px', height: '220px', borderRadius: '50%', border: '1px solid rgba(34,211,238,0.4)', boxShadow: '0 0 30px rgba(34,211,238,0.1), inset 0 0 30px rgba(124,58,237,0.2)' }}></div>
                    <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', width: '240px', height: '240px', borderRadius: '50%', border: '1px dashed rgba(124,58,237,0.3)', opacity: 0.5 }}></motion.div>

                    {/* Connecting dots on the circle */}
                    <div style={{ position: 'absolute', width: '220px', height: '220px', borderRadius: '50%' }}>
                      <div style={{ position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%)', width: '8px', height: '8px', background: 'var(--cyan)', borderRadius: '50%', boxShadow: '0 0 10px var(--cyan)' }}></div>
                      <div style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', width: '8px', height: '8px', background: 'var(--violet)', borderRadius: '50%', boxShadow: '0 0 10px var(--violet)' }}></div>
                      <div style={{ position: 'absolute', top: '50%', left: '-4px', transform: 'translateY(-50%)', width: '8px', height: '8px', background: 'var(--cyan)', borderRadius: '50%', boxShadow: '0 0 10px var(--cyan)' }}></div>
                      <div style={{ position: 'absolute', top: '50%', right: '-4px', transform: 'translateY(-50%)', width: '8px', height: '8px', background: 'var(--violet)', borderRadius: '50%', boxShadow: '0 0 10px var(--violet)' }}></div>
                    </div>

                    {/* Name */}
                    <div style={{ textAlign: 'center', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(user.name ? user.name : 'ABHISHEK BISHWAS').split(' ').map((n, i) => (
                        <div key={i} style={{
                          fontSize: 'clamp(28px, 4vw, 36px)',
                          fontWeight: 900,
                          fontFamily: '"Syncopate", "Orbitron", sans-serif',
                          color: 'var(--cyan)',
                          textShadow: '0 0 15px rgba(34,211,238,0.6)',
                          lineHeight: 1,
                          letterSpacing: '2px'
                        }}>
                          {n.toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right side: Contact Details */}
                  {(() => {
                    let infoItems = [];
                    if (user.contacts && user.contacts.length > 0) {
                      user.contacts.forEach(c => {
                        if (['email', 'phone', 'location'].includes(c.type)) {
                          let icon;
                          if (c.type === 'location') icon = '📍';
                          else if (c.type === 'phone') icon = '📞';
                          else icon = <div style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }} dangerouslySetInnerHTML={{ __html: getSocialLogo('gmail') }} />;
                          infoItems.push({ icon, label: c.label || c.type, value: c.value, type: c.type });
                        }
                      });
                    } else {
                      if (user.location) infoItems.push({ icon: '📍', label: 'Location', value: user.location, type: 'location' });
                      if (user.email) infoItems.push({
                        icon: <div style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }} dangerouslySetInnerHTML={{ __html: getSocialLogo('gmail') }} />,
                        label: 'Email', value: user.email, type: 'email'
                      });
                      if (user.phone) infoItems.push({ icon: '📞', label: 'Phone', value: user.phone, type: 'phone' });
                    }

                    if (infoItems.length === 0) return null;
                    const getHref = (item) => {
                      if (item.type === 'email') return `mailto:${item.value}`;
                      if (item.type === 'phone') return `tel:${item.value}`;
                      return null;
                    };

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '280px' }}>
                        {infoItems.map((item, i) => {
                          const href = getHref(item);
                          const ContentTag = href ? 'a' : 'div';
                          return (
                            <motion.div
                              key={item.label}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              style={{
                                position: 'relative', padding: '16px 24px', background: 'rgba(20, 10, 40, 0.4)',
                                border: '1px solid rgba(124,58,237,0.2)', borderRadius: '16px', display: 'flex',
                                alignItems: 'center', gap: '16px', backdropFilter: 'blur(10px)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                              }}
                            >
                              <div style={{ position: 'absolute', top: '8px', left: '8px', color: 'var(--cyan)', fontSize: '10px', fontWeight: 900 }}>+</div>
                              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--violet)', fontSize: '16px', border: '1px solid rgba(124,58,237,0.3)' }}>
                                {item.icon}
                              </div>
                              <div>
                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>{item.label}</div>
                                <ContentTag href={href || undefined} style={{ fontSize: '13px', color: '#fff', fontFamily: 'JetBrains Mono, monospace', textDecoration: 'none', ...(href ? { cursor: 'pointer' } : {}) }}>
                                  {item.value}
                                </ContentTag>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Bio at the bottom - Readable layout */}
                <div style={{
                  maxWidth: '800px', width: '100%', padding: '24px 32px',
                  background: 'rgba(20, 10, 40, 0.3)', borderTop: '1px solid rgba(34,211,238,0.2)',
                  borderBottom: '1px solid rgba(124,58,237,0.2)', borderRadius: '20px',
                  textAlign: 'center', position: 'relative', zIndex: 1
                }}>
                  <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#050510', padding: '0 16px', color: 'var(--cyan)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>About Me</div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
                    {user.bio}
                  </p>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '24px', zIndex: 1, position: 'relative', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {user.resume && (
                    <div style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.8), rgba(34,211,238,0.8))', padding: '2px', borderRadius: '16px', display: 'inline-block' }}>
                      <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-app', { detail: 'resume' }))}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '12px 28px', background: '#050510', border: 'none', borderRadius: '14px',
                          color: '#fff', fontSize: '14px', fontWeight: 700, fontFamily: 'Syne, sans-serif',
                          cursor: 'pointer', transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#050510'; }}
                      >
                        <FileTextIcon /> View Resume
                      </button>
                    </div>
                  )}
                  {user.resume && (
                    <div style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.4), rgba(34,211,238,0.4))', padding: '2px', borderRadius: '16px', display: 'inline-block' }}>
                      <a
                        href={user.resume} download="resume.pdf"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none',
                          padding: '12px 28px', background: '#050510', border: 'none', borderRadius: '14px',
                          color: '#fff', fontSize: '14px', fontWeight: 600, fontFamily: 'Syne, sans-serif',
                          cursor: 'pointer', transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,211,238,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#050510'; }}
                      >
                        <DownloadIcon /> Save PDF
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SKILLS TAB */}
            {activeTab === 'skills' && (
              <div>
                <div style={{
                  fontSize: 'var(--fs-xs)', color: 'var(--text3)',
                  fontFamily: 'JetBrains Mono, monospace',
                  marginBottom: '20px',
                }}>
                  $ cat skills.txt
                </div>
                {user.skills && Object.entries(user.skills).map(([category, skillsList]) => (
                  <div key={category} style={{ marginBottom: '28px' }}>
                    <div style={{
                      fontSize: 'var(--fs-xs)',
                      fontWeight: 700,
                      color: 'var(--violet)',
                      fontFamily: 'JetBrains Mono, monospace',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      marginBottom: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <span style={{ color: 'var(--text3)' }}>//</span> {category}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px 24px' }}>
                      {skillsList.map(([name, level], idx) => (
                        <SkillBar key={name} name={name} level={level} index={idx} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EDUCATION TAB */}
            {activeTab === 'education' && (
              <div style={{ maxWidth: '720px' }}>
                <div style={{
                  fontSize: 'var(--fs-xs)', color: 'var(--text3)',
                  fontFamily: 'JetBrains Mono, monospace',
                  marginBottom: '24px',
                }}>
                  $ ls ~/education/
                </div>
                <div style={{ position: 'relative' }}>
                  {/* Timeline line */}
                  <div style={{
                    position: 'absolute',
                    left: '24px',
                    top: '24px',
                    bottom: '24px',
                    width: '1px',
                    background: 'linear-gradient(to bottom, var(--violet), transparent)',
                  }} />

                  {user.education?.map((edu, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      style={{
                        display: 'flex',
                        gap: '20px',
                        marginBottom: '24px',
                        paddingLeft: '0',
                      }}
                    >
                      {/* Dot */}
                      <div style={{
                        width: '48px', height: '48px',
                        borderRadius: '12px',
                        background: 'rgba(124,58,237,0.15)',
                        border: '2px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: 'var(--fs-sm)',
                        fontWeight: 800,
                        color: 'var(--lavender)',
                        fontFamily: 'JetBrains Mono, monospace',
                        zIndex: 1,
                        position: 'relative',
                        overflow: 'hidden',
                      }}>
                        {edu.logo
                          ? <img src={edu.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : edu.initials
                        }
                      </div>

                      {/* Content */}
                      <div className="glass-card" style={{ flex: 1, padding: '16px 18px' }}>
                        <div style={{ fontSize: 'var(--fs-base)', fontWeight: 700, color: 'var(--text)', fontFamily: 'Syne, sans-serif', marginBottom: '4px' }}>
                          {edu.degree}
                        </div>
                        <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--lavender)', fontFamily: 'JetBrains Mono, monospace', marginBottom: '8px' }}>
                          {edu.school}
                        </div>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>
                            📅 {edu.year}
                          </span>
                          {edu.cgpa && (
                            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--green)', fontFamily: 'JetBrains Mono, monospace' }}>
                              ⭐ CGPA: {edu.cgpa}
                            </span>
                          )}
                          {edu.location && (
                            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>
                              📍 {edu.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* FUN FACTS TAB */}
            {activeTab === 'facts' && (
              <div>
                <div style={{
                  fontSize: 'var(--fs-xs)', color: 'var(--text3)',
                  fontFamily: 'JetBrains Mono, monospace',
                  marginBottom: '20px',
                }}>
                  $ cat fun_facts.txt
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
                  {user.funFacts?.map((fact, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.08 }}
                      className="glass-card"
                      style={{ padding: '18px' }}
                    >
                      <div style={{ fontSize: 'var(--fs-base)', fontWeight: 700, color: 'var(--text)', fontFamily: 'Syne, sans-serif', marginBottom: '8px' }}>
                        {fact.title}
                      </div>
                      <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text2)', lineHeight: 1.6, fontFamily: 'JetBrains Mono, monospace' }}>
                        {fact.text}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* GIT LOG TAB */}
            {activeTab === 'gitlog' && (
              <div style={{ maxWidth: '800px' }}>
                <div style={{
                  fontSize: 'var(--fs-xs)', color: 'var(--text3)',
                  fontFamily: 'JetBrains Mono, monospace',
                  marginBottom: '20px',
                }}>
                  $ git log --oneline --graph
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'var(--fs-sm)' }}>
                  {user.gitLog?.map(([date, msg], idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      style={{
                        display: 'flex',
                        gap: '16px',
                        padding: '10px 0',
                        borderBottom: '1px solid rgba(124,58,237,0.08)',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span style={{ color: 'var(--violet)', flexShrink: 0, fontSize: 'var(--fs-xs)' }}>
                        * {date.substring(0, 7)}
                      </span>
                      <span style={{ color: 'var(--text2)' }}>{msg}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BentoApp;
