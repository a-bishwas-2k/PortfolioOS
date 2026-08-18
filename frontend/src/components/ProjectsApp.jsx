import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

const ProjectCard = ({ project, onOpen }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className="glass-card"
    style={{
      overflow: 'hidden',
      cursor: 'pointer',
      position: 'relative',
    }}
    onClick={() => onOpen(project)}
  >
    {/* Thumbnail */}
    <div style={{ height: '160px', background: 'rgba(124,58,237,0.1)', position: 'relative', overflow: 'hidden' }}>
      {project.image ? (
        <img src={project.image} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `linear-gradient(135deg, ${project.color || 'rgba(124,58,237,0.2)'}, rgba(0,0,0,0))`,
          fontSize: 'var(--fs-3xl)',
        }}>
          {project.emoji || '📁'}
        </div>
      )}
      {/* Status badge */}
      <div style={{
        position: 'absolute', top: '10px', right: '10px',
        padding: '3px 10px',
        background: project.status === 'Live' ? 'rgba(74,222,128,0.15)' : 'rgba(124,58,237,0.15)',
        border: `1px solid ${project.status === 'Live' ? 'rgba(74,222,128,0.4)' : 'rgba(124,58,237,0.4)'}`,
        borderRadius: '99px',
        fontSize: 'var(--fs-xs)',
        fontFamily: 'JetBrains Mono, monospace',
        color: project.status === 'Live' ? 'var(--green)' : 'var(--lavender)',
      }}>
        {project.status || 'Active'}
      </div>
    </div>

    {/* Content */}
    <div style={{ padding: '16px' }}>
      <div style={{ fontSize: 'var(--fs-base)', fontWeight: 700, color: 'var(--text)', fontFamily: 'Syne, sans-serif', marginBottom: '6px' }}>
        {project.name}
      </div>
      <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', lineHeight: 1.6, fontFamily: 'JetBrains Mono, monospace', marginBottom: '12px', minHeight: '36px' }}>
        {project.desc}
      </p>
      {/* Tags */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {project.tags?.slice(0, 4).map(tag => (
          <span key={tag} style={{
            padding: '2px 8px',
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.15)',
            borderRadius: '4px',
            fontSize: 'var(--fs-xs)',
            color: 'var(--text3)',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }} onClick={e => e.stopPropagation()}>
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" style={{
            padding: '5px 10px',
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: '6px',
            color: 'var(--lavender)',
            fontSize: 'var(--fs-xs)',
            fontFamily: 'JetBrains Mono, monospace',
            textDecoration: 'none',
          }}>
            🐱 GitHub
          </a>
        )}
        {project.live && (
          <a href={project.live} target="_blank" rel="noopener noreferrer" style={{
            padding: '5px 10px',
            background: 'rgba(74,222,128,0.08)',
            border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: '6px',
            color: 'var(--green)',
            fontSize: 'var(--fs-xs)',
            fontFamily: 'JetBrains Mono, monospace',
            textDecoration: 'none',
          }}>
            🚀 Live
          </a>
        )}
      </div>
    </div>
  </motion.div>
);

const ProjectModal = ({ project, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      position: 'fixed', inset: 0, zIndex: 99990,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="os-window"
      style={{ maxWidth: '600px', width: '100%', maxHeight: '80vh', overflow: 'auto' }}
      onClick={e => e.stopPropagation()}
    >
      {project.image && (
        <img src={project.image} alt={project.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      )}
      <div style={{ padding: '24px' }}>
        <div style={{ fontSize: 'var(--fs-xl)', fontWeight: 800, color: 'var(--text)', fontFamily: 'Syne, sans-serif', marginBottom: '8px' }}>
          {project.name}
        </div>
        <p style={{ color: 'var(--text2)', fontSize: 'var(--fs-sm)', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace', marginBottom: '16px' }}>
          {project.longDesc || project.desc}
        </p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {project.tags?.map(tag => (
            <span key={tag} style={{
              padding: '4px 10px',
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(124,58,237,0.25)',
              borderRadius: '6px',
              fontSize: 'var(--fs-xs)',
              color: 'var(--lavender)',
              fontFamily: 'JetBrains Mono, monospace',
            }}>{tag}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" style={{
              padding: '8px 16px', background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.3)', borderRadius: '8px',
              color: 'var(--lavender)', fontSize: 'var(--fs-sm)',
              fontFamily: 'JetBrains Mono, monospace', textDecoration: 'none',
            }}>🐱 GitHub</a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" style={{
              padding: '8px 16px', background: 'rgba(74,222,128,0.1)',
              border: '1px solid rgba(74,222,128,0.3)', borderRadius: '8px',
              color: 'var(--green)', fontSize: 'var(--fs-sm)',
              fontFamily: 'JetBrains Mono, monospace', textDecoration: 'none',
            }}>🚀 Live Demo</a>
          )}
          <button onClick={onClose} style={{
            marginLeft: 'auto', padding: '8px 16px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
            borderRadius: '8px', color: 'var(--text3)', fontSize: 'var(--fs-sm)',
            fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer',
          }}>Close</button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const ALL_FILTERS = ['All'];

const ProjectsApp = () => {
  const { user } = useStore();
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const projects = user?.projects || [];
  const allTags = ['All', ...new Set(projects.flatMap(p => p.tags || []))].slice(0, 8);
  const filtered = projects.filter(p => {
    const matchesFilter = filter === 'All' || p.tags?.includes(filter);
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.desc?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--window-bg)' }}>
      {/* Toolbar */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        flexShrink: 0,
      }}>
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="adm-input"
          style={{ maxWidth: '220px' }}
        />
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              style={{
                padding: '5px 12px',
                borderRadius: '99px',
                border: `1px solid ${filter === tag ? 'rgba(124,58,237,0.5)' : 'var(--border)'}`,
                background: filter === tag ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                color: filter === tag ? 'var(--lavender)' : 'var(--text3)',
                fontSize: 'var(--fs-xs)',
                fontFamily: 'JetBrains Mono, monospace',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tag}
            </button>
          ))}
        </div>
        <span style={{ color: 'var(--text3)', fontSize: 'var(--fs-xs)', fontFamily: 'JetBrains Mono, monospace' }}>
          {filtered.length} projects
        </span>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace', fontSize: 'var(--fs-sm)' }}>
            No projects found
          </div>
        ) : (
          <motion.div
            layout
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}
          >
            {filtered.map((project, idx) => (
              <ProjectCard key={project.name + idx} project={project} onOpen={setSelectedProject} />
            ))}
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsApp;
