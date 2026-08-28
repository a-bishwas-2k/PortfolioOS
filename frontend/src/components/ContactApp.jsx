import React from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { getSocialLogo } from '../utils/icons';

const LinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

// Type-to-color mapping for the icon bubbles
// Type-to-color mapping for the card hover borders and glows
const TYPE_COLORS = {
  email:     { border: 'rgba(234,88,12,0.4)',  glow: 'rgba(234,88,12,0.2)'  },
  gmail:     { border: 'rgba(234,67,53,0.4)',  glow: 'rgba(234,67,53,0.2)'  },
  phone:     { border: 'rgba(22,163,74,0.4)',  glow: 'rgba(22,163,74,0.2)'  },
  location:  { border: 'rgba(59,130,246,0.4)', glow: 'rgba(59,130,246,0.2)' },
  github:    { border: 'rgba(255,255,255,0.3)',glow: 'rgba(255,255,255,0.15)' },
  linkedin:  { border: 'rgba(10,102,194,0.4)', glow: 'rgba(10,102,194,0.2)' },
  twitter:   { border: 'rgba(29,161,242,0.4)', glow: 'rgba(29,161,242,0.2)' },
  instagram: { border: 'rgba(214,41,118,0.4)', glow: 'rgba(214,41,118,0.2)' },
  whatsapp:  { border: 'rgba(37,211,102,0.4)', glow: 'rgba(37,211,102,0.2)' },
  telegram:  { border: 'rgba(38,165,228,0.4)', glow: 'rgba(38,165,228,0.2)' },
  discord:   { border: 'rgba(88,101,242,0.4)', glow: 'rgba(88,101,242,0.2)' },
  facebook:  { border: 'rgba(24,119,242,0.4)', glow: 'rgba(24,119,242,0.2)' },
  youtube:   { border: 'rgba(255,0,0,0.4)',     glow: 'rgba(255,0,0,0.2)'    },
  default:   { border: 'rgba(124,58,237,0.4)', glow: 'rgba(124,58,237,0.2)' },
};

const getBubbleStyle = (type) => {
  const brandColors = {
    email:     { bg: '#ffffff', color: '#ea580c' },
    gmail:     { bg: '#ffffff', color: '#ea4335' },
    phone:     { bg: '#ffffff', color: '#16a34a' },
    location:  { bg: '#ffffff', color: '#3b82f6' },
    github:    { bg: '#181717', color: '#ffffff' },
    linkedin:  { bg: '#ffffff', color: '#0077b5' },
    twitter:   { bg: '#ffffff', color: '#1da1f2' },
    instagram: { bg: '#ffffff', color: '#e1306c' },
    whatsapp:  { bg: '#ffffff', color: '#25d366' },
    telegram:  { bg: '#ffffff', color: '#26a5e4' },
    discord:   { bg: '#ffffff', color: '#5865f2' },
    facebook:  { bg: '#ffffff', color: '#1877f2' },
    youtube:   { bg: '#ffffff', color: '#ff0000' },
  };
  return brandColors[type.toLowerCase()] || { bg: '#ffffff', color: '#7c3aed' };
};

const getTypeColor = (type) => TYPE_COLORS[type] || TYPE_COLORS.default;

const buildHref = (type, value) => {
  if (!value) return '#';
  if (type === 'email' || type === 'gmail') {
    const emailStr = value.startsWith('mailto:') ? value.replace('mailto:', '') : value;
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${emailStr}`;
  }
  if (type === 'phone' || type === 'location') return '#';
  if (value.startsWith('http') || value.startsWith('mailto:') || value.startsWith('tel:')) return value;
  return `https://${value}`;
};

const ContactCard = ({ contact, idx }) => {
  const colors = getTypeColor(contact.type);
  const bubble = getBubbleStyle(contact.type);
  const href = buildHref(contact.type, contact.value);
  const svgStr = getSocialLogo(contact.type);
  const isLink = href !== '#';

  const typeEmoji = {
    email: null, phone: '📞', location: '📍',
  }[contact.type];

  return (
    <motion.a
      key={idx}
      href={isLink ? href : undefined}
      target={isLink && !href.startsWith('mailto:') && !href.startsWith('tel:') ? '_blank' : undefined}
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.06, type: 'spring', stiffness: 220 }}
      style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '12px 16px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        color: 'var(--text)',
        textDecoration: 'none',
        cursor: isLink ? 'pointer' : 'default',
        userSelect: 'none',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)',
        transition: 'border-color 0.2s ease, background-color 0.2s ease',
      }}
      whileHover={isLink ? {
        scale: 1.02,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderColor: colors.border,
        boxShadow: `0 8px 24px -6px ${colors.glow}, inset 0 1px 1px rgba(255,255,255,0.05)`,
      } : {}}
      whileTap={isLink ? { scale: 0.98 } : {}}
      onClick={(e) => {
        if (!isLink) {
          e.preventDefault();
          return;
        }
        e.stopPropagation();
      }}
    >
      {/* Icon bubble */}
      <div style={{
        width: '38px', height: '38px', flexShrink: 0,
        background: bubble.bg,
        color: bubble.color,
        borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
      }}>
        {svgStr ? (
          <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }} dangerouslySetInnerHTML={{ __html: svgStr }} />
        ) : typeEmoji ? (
          <span style={{ fontSize: 'var(--fs-lg)' }}>{typeEmoji}</span>
        ) : (
          <LinkIcon />
        )}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 'var(--fs-sm)', fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 600, color: 'var(--text)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          textTransform: ['email', 'gmail', 'phone', 'location'].includes(contact.type) ? 'none' : 'capitalize'
        }}>
          {['email', 'gmail', 'phone', 'location'].includes(contact.type) ? contact.value : (contact.label || contact.type)}
        </div>
      </div>
    </motion.a>
  );
};

const ContactApp = () => {
  const { user } = useStore();

  // Build the contacts list: prefer new user.contacts, fallback to legacy user.links
  const buildContacts = () => {
    if (user?.contacts && user.contacts.length > 0) {
      return user.contacts;
    }
    // Legacy fallback
    const legacy = [];
    if (user?.email) legacy.push({ type: 'email', value: user.email, label: 'Email' });
    if (user?.phone) legacy.push({ type: 'phone', value: user.phone, label: 'Phone' });
    if (user?.location) legacy.push({ type: 'location', value: user.location, label: 'Location' });
    if (user?.links) {
      Object.entries(user.links).forEach(([platform, url]) => {
        if (url && url !== '#') {
          legacy.push({ type: platform, value: url, label: platform.charAt(0).toUpperCase() + platform.slice(1) });
        }
      });
    }
    return legacy;
  };

  const contacts = buildContacts();

  if (!user || contacts.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%', gap: '12px', color: 'var(--text3)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 'var(--fs-sm)',
      }}>
        <div style={{ fontSize: 'var(--fs-2xl)' }}>📭</div>
        <div>No contact info available.</div>
        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', opacity: 0.6 }}>
          Add contacts via the Admin Panel
        </div>
      </div>
    );
  }

  // Separate pinned (email/phone/location) from social links for layout
  const pinned  = contacts.filter(c => ['email', 'phone', 'location'].includes(c.type));
  const socials = contacts.filter(c => !['email', 'phone', 'location'].includes(c.type));

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--window-bg)', overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        padding: '28px 28px 0',
        background: 'linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 100%)',
      }}>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 'var(--fs-xl)', fontWeight: 800, fontFamily: 'Syne, sans-serif',
            color: 'var(--text)', marginBottom: '6px',
          }}
        >
          Let's Connect
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: 'var(--fs-sm)', color: 'var(--text3)',
            fontFamily: 'JetBrains Mono, monospace', marginBottom: '24px',
          }}
        >
          // {contacts.length} contact{contacts.length !== 1 ? 's' : ''} available
        </motion.p>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border)', marginBottom: '0' }} />
      </div>

      {/* Content */}
      <div style={{ padding: '24px 28px 28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Pinned: Email, Phone, Location */}
        {pinned.length > 0 && (
          <div>
            <div style={{
              fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace',
              textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px',
            }}>
              Direct Contact
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pinned.map((c, i) => <ContactCard key={i} contact={c} idx={i} />)}
            </div>
          </div>
        )}

        {/* Social Links */}
        {socials.length > 0 && (
          <div>
            <div style={{
              fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace',
              textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px',
            }}>
              Social & Online
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '10px',
            }}>
              {socials.map((c, i) => <ContactCard key={i} contact={c} idx={pinned.length + i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactApp;
