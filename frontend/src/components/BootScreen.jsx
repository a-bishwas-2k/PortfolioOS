import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import { motion } from 'framer-motion';

const bootMessages = [
  { text: '[  OK  ] Started D-Bus System Message Bus', type: 'ok' },
  { text: '[  OK  ] Started Network Manager', type: 'ok' },
  { text: '[  OK  ] Reached target Network', type: 'ok' },
  { text: '[ WARN ] Loading portfolio modules...', type: 'warn' },
  { text: '[  OK  ] Loaded Projects (3 entries)', type: 'ok' },
  { text: '[  OK  ] Loaded Skills (15 skills)', type: 'ok' },
  { text: '[  OK  ] Started Terminal Emulator v4.2', type: 'ok' },
  { text: '[  OK  ] Mounted filesystem: /home/abhishek/', type: 'ok' },
  { text: '[  OK  ] Desktop environment ready', type: 'ok' },
];

const BootScreen = () => {
  const { setBooting, loadUser } = useStore();
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const bootSequence = async () => {
      // Fetch user data in background
      loadUser();

      for (let i = 0; i < bootMessages.length; i++) {
        await new Promise(r => setTimeout(r, 280 + Math.random() * 120));
        setLogs(prev => [...prev, bootMessages[i]]);
        setProgress(Math.round(((i + 1) / bootMessages.length) * 90));
      }

      setProgress(100);
      await new Promise(r => setTimeout(r, 500));
      setBooting(false);
    };

    bootSequence();
  }, [setBooting, loadUser]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      className="fixed inset-0 bg-black z-[99999] flex flex-col"
      style={{ fontFamily: 'JetBrains Mono, monospace' }}
    >
      {/* Logo area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="text-5xl font-bold mb-2" style={{
            background: 'linear-gradient(90deg, #7C3AED, #A78BFA, #22D3EE)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Syne, sans-serif',
          }}>
            PortfolioOS
          </div>
          <div className="text-xs text-gray-500" style={{ letterSpacing: '0.3em' }}>
            v2.0 — REACT EDITION
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="w-64 mb-8">
          <div className="h-[2px] bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #7C3AED, #A78BFA)',
                width: `${progress}%`,
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="text-center text-xs text-gray-600 mt-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {progress}%
          </div>
        </div>
      </div>

      {/* Boot log */}
      <div className="px-8 pb-8 max-h-48 overflow-hidden">
        {logs.map((log, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs mb-0.5"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            <span className={log.type === 'ok' ? 'text-green-500' : log.type === 'warn' ? 'text-yellow-500' : 'text-red-400'}>
              {log.text.split(']')[0]}]
            </span>
            <span className="text-gray-400">{log.text.split(']').slice(1).join(']')}</span>
          </motion.div>
        ))}
        <div className="text-xs text-green-500 mt-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          <span className="boot-cursor">▌</span>
        </div>
      </div>
    </motion.div>
  );
};

export default BootScreen;
