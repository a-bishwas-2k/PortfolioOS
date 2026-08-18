import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { getSocialLogo } from '../utils/icons';
import { FiDownload, FiMail, FiPhone } from 'react-icons/fi';

const PortfolioApp = () => {
  const { user } = useStore();
  const containerRef = useRef(null);

  if (!user) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#fff' }}>Loading...</div>;

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: '#0a0a0a',
        color: '#fff',
        fontFamily: 'Syne, sans-serif'
      }}
    >
      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50, padding: '20px 40px',
        background: 'rgba(10, 10, 10, 0.8)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--cyan)' }}>
          {user.name?.split(' ')[0] || 'Portfolio'}.
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
           <a href="#about" style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--cyan)'} onMouseLeave={e => e.target.style.color = '#aaa'}>About</a>
           <a href="#skills" style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--cyan)'} onMouseLeave={e => e.target.style.color = '#aaa'}>Skills</a>
           <a href="#education" style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--cyan)'} onMouseLeave={e => e.target.style.color = '#aaa'}>Education</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" style={{ 
        minHeight: '80vh', display: 'flex', flexDirection: 'column', 
        justifyContent: 'center', alignItems: 'center', padding: '40px',
        textAlign: 'center', position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'var(--violet)', filter: 'blur(150px)', opacity: 0.3, borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '300px', height: '300px', background: 'var(--cyan)', filter: 'blur(150px)', opacity: 0.2, borderRadius: '50%', pointerEvents: 'none' }}></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', zIndex: 10 }}
        >
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ fontSize: 'clamp(40px, 8vw, 80px)', fontWeight: 900, marginBottom: '20px', background: 'linear-gradient(90deg, var(--cyan), var(--violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px' }}>
            {user.name || 'ABHISHEK BISHWAS'}
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ fontSize: 'clamp(20px, 4vw, 32px)', color: '#aaa', marginBottom: '40px', fontWeight: 500 }}>
            {user.role || 'Data Analyst | Full-Stack Developer'}
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            {user.resume && (
              <a href={user.resume} download
                style={{
                  padding: '16px 32px', borderRadius: '30px', background: 'var(--violet)', color: '#fff',
                  textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px',
                  boxShadow: '0 10px 30px rgba(124,58,237,0.3)', transition: 'transform 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <FiDownload /> Download Resume
              </a>
            )}
            <a href="#contact"
              style={{
                padding: '16px 32px', borderRadius: '30px', background: 'rgba(255,255,255,0.05)', color: '#fff',
                textDecoration: 'none', fontWeight: 600, border: '2px solid rgba(255,255,255,0.1)',
                transition: 'all 0.2s', backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              Contact Me
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '100px 40px', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}
        >
          <h3 style={{ fontSize: '36px', marginBottom: '30px', color: 'var(--cyan)', fontWeight: 800 }}>About Me</h3>
          <p style={{ fontSize: '18px', lineHeight: 1.8, color: '#ccc', fontFamily: 'JetBrains Mono, monospace' }}>
            {user.bio}
          </p>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section id="skills" style={{ padding: '100px 40px' }}>
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.6 }}
           style={{ maxWidth: '1000px', margin: '0 auto' }}
        >
          <h3 style={{ fontSize: '36px', marginBottom: '60px', color: 'var(--violet)', fontWeight: 800, textAlign: 'center' }}>Technical Skills</h3>
          {user.skills && Object.entries(user.skills).map(([category, skillsList], idx) => (
            <motion.div 
              key={category} 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              style={{ marginBottom: '50px' }}
            >
              <h4 style={{ fontSize: '22px', color: '#fff', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>{category}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px' }}>
                {skillsList.map(([name, level]) => (
                  <motion.div 
                    key={name}
                    whileHover={{ scale: 1.05, y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}
                    style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>{name}</div>
                      <div style={{ fontSize: '14px', color: 'var(--cyan)' }}>{level}%</div>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.5)', borderRadius: '3px', overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        style={{ height: '100%', background: 'linear-gradient(90deg, var(--violet), var(--cyan))', boxShadow: '0 0 10px rgba(34,211,238,0.5)' }}
                      ></motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Education Section */}
      <section id="education" style={{ padding: '100px 40px', background: 'rgba(255,255,255,0.02)' }}>
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.6 }}
           style={{ maxWidth: '800px', margin: '0 auto' }}
        >
          <h3 style={{ fontSize: '36px', marginBottom: '50px', color: 'var(--cyan)', fontWeight: 800, textAlign: 'center' }}>Education</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '30px', top: '30px', bottom: '30px', width: '2px', background: 'linear-gradient(to bottom, var(--violet), rgba(124,58,237,0.1))' }}></div>
            {user.education?.map((edu, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 + 0.2, duration: 0.5 }}
                whileHover={{ x: 10 }}
                style={{ background: 'rgba(20,10,40,0.5)', padding: '30px 30px 30px 60px', borderRadius: '20px', border: '1px solid rgba(124,58,237,0.2)', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', left: '26px', top: '40px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 10px var(--cyan)' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h4 style={{ fontSize: '22px', color: '#fff', margin: '0 0 8px 0', fontFamily: 'Syne, sans-serif' }}>{edu.degree}</h4>
                    <div style={{ fontSize: '16px', color: 'var(--lavender)', marginBottom: '15px', fontFamily: 'JetBrains Mono, monospace' }}>{edu.school}</div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ color: '#fff', fontWeight: 600, background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '20px', fontSize: '14px' }}>{edu.year}</div>
                    <div style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>📍 {edu.location}</div>
                  </div>
                </div>
                {edu.cgpa && (
                  <div style={{ display: 'inline-block', marginTop: '15px', padding: '6px 14px', background: 'rgba(34,211,238,0.1)', color: 'var(--cyan)', borderRadius: '20px', fontSize: '14px', fontWeight: 600, border: '1px solid rgba(34,211,238,0.2)' }}>
                    ⭐ CGPA: {edu.cgpa}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: '120px 40px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '400px', background: 'var(--violet)', filter: 'blur(200px)', opacity: 0.15, pointerEvents: 'none' }}></div>
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 10 }}
        >
          <h3 style={{ fontSize: '40px', marginBottom: '20px', color: 'var(--violet)', fontWeight: 800 }}>Get In Touch</h3>
          <p style={{ fontSize: '18px', color: '#aaa', marginBottom: '50px', lineHeight: 1.6 }}>
            Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {user.email && (
              <motion.a 
                whileHover={{ scale: 1.05 }}
                href={`mailto:${user.email}`} 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 30px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', color: '#fff', textDecoration: 'none', backdropFilter: 'blur(10px)' }}
              >
                <FiMail size={20} color="var(--cyan)" /> {user.email}
              </motion.a>
            )}
            {user.phone && (
              <motion.a 
                whileHover={{ scale: 1.05 }}
                href={`tel:${user.phone}`} 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 30px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', color: '#fff', textDecoration: 'none', backdropFilter: 'blur(10px)' }}
              >
                <FiPhone size={20} color="var(--cyan)" /> {user.phone}
              </motion.a>
            )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', marginTop: '50px' }}>
             {user.contacts?.filter(c => !['email', 'phone', 'location'].includes(c.type)).map((contact, i) => (
                <motion.a 
                   key={i} 
                   whileHover={{ y: -5, background: 'var(--cyan)', color: '#000' }}
                   href={contact.value} target="_blank" rel="noreferrer"
                   style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'background 0.3s, color 0.3s' }}
                >
                   <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} dangerouslySetInnerHTML={{ __html: getSocialLogo(contact.type) }} />
                </motion.a>
             ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '30px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#666', fontSize: '14px', background: 'rgba(0,0,0,0.5)' }}>
        <p style={{ margin: '0 0 5px 0' }}>Built with React, Vite & Framer Motion</p>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} {user.name || 'ABHISHEK BISHWAS'}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PortfolioApp;
