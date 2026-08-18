import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

const CertModal = ({ cert, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99990,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 20 }}
        onClick={e => e.stopPropagation()}
        style={{ 
          maxWidth: '850px', width: '100%', maxHeight: '90vh', 
          display: 'flex', flexWrap: 'wrap', gap: '16px',
          overflowY: 'auto', padding: '4px' // padding for shadow clip
        }}
      >
        {/* Left/Top Side: Document Viewer (PDF or Image) */}
        <div style={{ 
          flex: '2 1 400px', // takes up more space if available
          overflow: 'hidden', borderRadius: '12px', 
          border: '1px solid var(--border)', 
          boxShadow: '0 24px 60px rgba(0,0,0,0.7)', 
          background: 'var(--window-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <img
            src={cert.imageUrl || cert.image}
            alt={cert.name}
            style={{ width: '100%', height: '100%', maxHeight: '80vh', objectFit: 'contain', display: (cert.imageUrl || cert.image) ? 'block' : 'none' }}
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextElementSibling) {
                e.target.nextElementSibling.style.display = 'block';
              }
            }}
          />
          <div style={{ display: (cert.imageUrl || cert.image) ? 'none' : 'block', padding: '60px 40px', textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--fs-3xl)', marginBottom: '16px' }}>🏆</div>
            <div style={{ fontSize: 'var(--fs-xl)', fontWeight: 800, color: 'var(--text)', fontFamily: 'Syne, sans-serif', marginBottom: '8px' }}>
              {cert.name}
            </div>
            <div style={{ color: 'var(--lavender)', fontFamily: 'JetBrains Mono, monospace', marginBottom: '12px' }}>
              {cert.issuer}
            </div>
            <div style={{ color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace', fontSize: 'var(--fs-sm)' }}>
              Issued: {cert.date}
            </div>
          </div>
        </div>

        {/* Right/Bottom Side: Sidebar (Metadata + Buttons) */}
        <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Certificate Metadata Details */}
          <div style={{
            flex: 1, // expands if the image is tall
            padding: '24px 20px',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 800, color: 'var(--text)', margin: '0 0 8px 0', fontFamily: 'Syne, sans-serif' }}>
              {cert.name}
            </h3>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--lavender)', margin: '0 0 16px 0', fontFamily: 'JetBrains Mono, monospace' }}>
              Issued by: {cert.issuer}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: 'var(--fs-xs)', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text3)' }}>
              <div>📅 Issue Date:<br/><span style={{ color: 'var(--text)', display: 'block', marginTop: '4px' }}>{cert.date || 'N/A'}</span></div>
              {cert.credentialId && (
                <div>
                  🔑 Credential ID:<br/><span style={{ color: 'var(--text)', wordBreak: 'break-all', display: 'block', marginTop: '4px' }}>{cert.credentialId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            {cert.link && (
              <motion.a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(124,58,237,0.25)', borderColor: 'rgba(124,58,237,0.6)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '12px 20px', background: 'rgba(124,58,237,0.15)',
                  border: '1px solid rgba(124,58,237,0.4)', borderRadius: '8px',
                  color: 'var(--lavender)', textDecoration: 'none',
                  fontSize: 'var(--fs-sm)', fontFamily: 'JetBrains Mono, monospace',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                  transition: 'border-color 0.2s, background-color 0.2s',
                  fontWeight: 600
                }}
              >
                🔗 View Credential URL
              </motion.a>
            )}
            <motion.button 
              onClick={onClose} 
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '12px 20px', background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)', borderRadius: '8px',
                color: 'var(--text3)', cursor: 'pointer',
                fontSize: 'var(--fs-sm)', fontFamily: 'JetBrains Mono, monospace',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                transition: 'background-color 0.2s',
                fontWeight: 600
              }}
            >
              Close
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CertificatesApp = () => {
  const { user, sessionCertificates } = useStore();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const dbCerts = user?.certificates || [];
  // Merge certificates marking their session status
  const certs = [
    ...dbCerts.map(c => ({ ...c, isSession: false })),
    ...sessionCertificates.map(c => ({ ...c, isSession: true }))
  ];

  const filtered = certs.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.issuer?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--window-bg)' }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0,
      }}>
        <input
          type="text"
          placeholder="Search certificates..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="adm-input"
          style={{ maxWidth: '240px' }}
        />
        <span style={{ color: 'var(--text3)', fontSize: 'var(--fs-xs)', fontFamily: 'JetBrains Mono, monospace', marginLeft: 'auto' }}>
          {filtered.length} certificates
        </span>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>
            No certificates found
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
            {filtered.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="glass-card"
                style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
                onClick={() => setSelected(cert)}
              >
                {/* Cert thumbnail */}
                <div style={{ height: '130px', background: 'rgba(124,58,237,0.08)', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={cert.imageUrl || cert.image}
                    alt={cert.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(3px) brightness(0.8)', display: (cert.imageUrl || cert.image) ? 'block' : 'none' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextElementSibling) {
                        e.target.nextElementSibling.style.display = 'flex';
                      }
                    }}
                  />
                  <div style={{
                    width: '100%', height: '100%',
                    display: (cert.imageUrl || cert.image) ? 'none' : 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(34,211,238,0.05))',
                  }}>
                    <div style={{ fontSize: 'var(--fs-3xl)', marginBottom: '6px' }}>🏆</div>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace', textAlign: 'center', padding: '0 12px' }}>
                      {cert.issuer}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div style={{
                    position: 'absolute', top: '8px', right: '8px',
                    padding: '3px 6px', borderRadius: '4px',
                    fontSize: 'var(--fs-xs)', fontFamily: 'JetBrains Mono, monospace',
                    background: cert.isSession ? 'rgba(59,130,246,0.25)' : cert.addedAt ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.2)',
                    border: `1px solid ${cert.isSession ? 'rgba(59,130,246,0.5)' : cert.addedAt ? 'rgba(245,158,11,0.5)' : 'rgba(16,185,129,0.4)'}`,
                    color: cert.isSession ? '#93C5FD' : cert.addedAt ? '#FCD34D' : '#6EE7B7',
                    textTransform: 'uppercase', fontWeight: 600,
                    zIndex: 10,
                    backdropFilter: 'blur(2px)'
                  }}>
                    {cert.isSession ? 'Session' : cert.addedAt ? 'Temp DB' : 'DB'}
                  </div>

                  {/* Hover overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(124,58,237,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    fontSize: 'var(--fs-xl)',
                    zIndex: 5
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                  >
                    🔍 View
                  </div>
                </div>

                <div style={{ padding: '14px' }}>
                  <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--text)', fontFamily: 'Syne, sans-serif', marginBottom: '4px', lineHeight: 1.3 }}>
                    {cert.name}
                  </div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--lavender)', fontFamily: 'JetBrains Mono, monospace', marginBottom: '6px' }}>
                    {cert.issuer}
                  </div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>
                    📅 {cert.date}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && <CertModal cert={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default CertificatesApp;
