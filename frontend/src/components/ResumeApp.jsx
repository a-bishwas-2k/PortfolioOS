import React from 'react';
import useStore from '../store/useStore';

const ResumeApp = () => {
  const { user } = useStore();
  const resumeUrl = user?.resume;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--window-bg)' }}>
      {/* Toolbar */}
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text2)', fontFamily: 'JetBrains Mono, monospace', flex: 1 }}>
          📄 {user?.name}'s Resume
        </span>
        {resumeUrl && (
          <a
            href={resumeUrl}
            download="resume.pdf"
            style={{
              padding: '6px 14px',
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: '7px',
              color: 'var(--lavender)',
              fontSize: 'var(--fs-xs)',
              fontFamily: 'JetBrains Mono, monospace',
              textDecoration: 'none',
            }}
          >
            ⬇ Download
          </a>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {resumeUrl ? (
          <iframe
            src={resumeUrl}
            title="Resume"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: '100%', color: 'var(--text3)',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 'var(--fs-sm)', gap: '12px',
          }}>
            <span style={{ fontSize: 'var(--fs-3xl)' }}>📄</span>
            <span>No resume uploaded yet.</span>
            <span style={{ fontSize: 'var(--fs-xs)' }}>Admin → Profile to upload a resume.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeApp;
