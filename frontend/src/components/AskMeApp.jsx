import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Bot, User, RefreshCw, Copy, Check, Command } from 'lucide-react';
import useStore from '../store/useStore';

const SUGGESTIONS = [
  "Who is Abhishek Biswas?",
  "What are Abhishek's key projects?",
  "What tech stack does he use?",
  "How can I contact or hire Abhishek?"
];

export default function AskMeApp() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am **Ask Me** — Abhishek's AI Assistant. Ask me anything about Abhishek's background, skills, projects, or how to get in touch!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const BACKEND_BASE = (window.location.protocol === 'file:') ? 'http://localhost:5000' : (import.meta.env.VITE_API_URL || '');
      const res = await fetch(`${BACKEND_BASE}/api/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query })
      });
      const data = await res.json();

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.success ? data.answer : "I couldn't retrieve an answer right now. Please try again later!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "I am Abhishek's AI model. Currently offline from backend, but I can tell you Abhishek is a Full Stack Developer specializing in React, Node.js, and modern UX design!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0f17]/95 text-slate-100 font-sans backdrop-blur-md select-text">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              Ask Me AI
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v2.5 LLM
              </span>
            </h2>
            <p className="text-xs text-slate-400">Powered by Abhishek's Knowledge Engine</p>
          </div>
        </div>
        <button
          onClick={() => setMessages([messages[0]])}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Reset Conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 max-w-[88%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`group relative p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600/90 text-white rounded-tr-none shadow-lg shadow-blue-600/10'
                  : 'bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-tl-none shadow-lg'
              }`}
            >
              <div className="space-y-1.5 text-xs leading-relaxed">
                {msg.text.split('\n').map((line, idx) => {
                  const renderFormattedText = (txt) => {
                    const parts = txt.split(/(\*\*.*?\*\*)/g);
                    return parts.map((part, i) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} className="font-semibold text-indigo-200">{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    });
                  };

                  if (line.startsWith('• ') || line.startsWith('- ')) {
                    return (
                      <div key={idx} className="flex gap-2 items-start pl-1">
                        <span className="text-indigo-400 font-bold select-none">•</span>
                        <div className="flex-1">{renderFormattedText(line.slice(2))}</div>
                      </div>
                    );
                  }

                  if (!line.trim()) return <div key={idx} className="h-1" />;

                  return <div key={idx}>{renderFormattedText(line)}</div>;
                })}
              </div>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/10 text-[10px] text-slate-400">
                <span>{msg.timestamp}</span>
                {msg.sender === 'ai' && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="opacity-0 group-hover:opacity-100 hover:text-white transition"
                    title="Copy text"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      {messages.length === 1 && (
        <div className="px-4 py-2 flex flex-wrap gap-2">
          {SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug)}
              className="text-xs bg-slate-800/90 hover:bg-indigo-600/40 border border-slate-700/80 hover:border-indigo-500/50 text-slate-300 hover:text-white px-3 py-1.5 rounded-full transition shadow-sm"
            >
              ✨ {sug}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/70 focus-within:border-indigo-500/80 rounded-xl px-3 py-2 transition"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about weather, history, time, or Abhishek..."
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 transition shadow-md shadow-indigo-600/30"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
