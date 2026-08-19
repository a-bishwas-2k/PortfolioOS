import React from 'react';
import {
  User, Briefcase, Award, FolderGit2, Mail, Terminal, Settings, ShieldCheck, Sparkles, LayoutGrid
} from 'lucide-react';

/* ─── Realistic & Detailed Custom SVG Brand Icons ───────────────── */

export const AskMeIcon = ({ size = 32, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-pink-500 shadow-lg shadow-indigo-500/30 border border-white/20 overflow-hidden group ${className}`}
    style={{ width: size, height: size }}
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)]" />
    <Sparkles className="w-1/2 h-1/2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] animate-pulse" />
  </div>
);

export const PortfolioIcon = ({ size = 32, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 shadow-lg shadow-blue-500/30 border border-white/20 overflow-hidden ${className}`}
    style={{ width: size, height: size }}
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
    <User className="w-1/2 h-1/2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
  </div>
);

export const ResumeIcon = ({ size = 32, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-500 to-red-400 shadow-lg shadow-rose-500/30 border border-white/20 overflow-hidden ${className}`}
    style={{ width: size, height: size }}
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
    <Briefcase className="w-1/2 h-1/2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
  </div>
);

export const CertificatesIcon = ({ size = 32, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-orange-500 shadow-lg shadow-amber-500/30 border border-white/20 overflow-hidden ${className}`}
    style={{ width: size, height: size }}
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)]" />
    <Award className="w-1/2 h-1/2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
  </div>
);

export const ProjectsIcon = ({ size = 32, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-green-400 shadow-lg shadow-emerald-500/30 border border-white/20 overflow-hidden ${className}`}
    style={{ width: size, height: size }}
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
    <FolderGit2 className="w-1/2 h-1/2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
  </div>
);

export const ContactIcon = ({ size = 32, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-blue-600 shadow-lg shadow-sky-500/30 border border-white/20 overflow-hidden ${className}`}
    style={{ width: size, height: size }}
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
    <Mail className="w-1/2 h-1/2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
  </div>
);

export const TerminalIcon = ({ size = 32, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-900 via-zinc-800 to-slate-900 shadow-lg shadow-black/50 border border-slate-700/80 overflow-hidden ${className}`}
    style={{ width: size, height: size }}
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
    <Terminal className="w-1/2 h-1/2 text-emerald-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
  </div>
);

export const SettingsIcon = ({ size = 32, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-600 via-gray-500 to-slate-700 shadow-lg shadow-slate-600/30 border border-white/20 overflow-hidden ${className}`}
    style={{ width: size, height: size }}
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
    <Settings className="w-1/2 h-1/2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
  </div>
);

export const AdminIcon = ({ size = 32, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-600 shadow-lg shadow-purple-600/30 border border-white/20 overflow-hidden ${className}`}
    style={{ width: size, height: size }}
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)]" />
    <ShieldCheck className="w-1/2 h-1/2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
  </div>
);

export const BentoIcon = ({ size = 32, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-red-500 shadow-lg shadow-orange-500/30 border border-white/20 overflow-hidden ${className}`}
    style={{ width: size, height: size }}
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
    <LayoutGrid className="w-1/2 h-1/2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
  </div>
);

/* Icon Resolver */
export function AppIcon({ id, size = 32, className = '' }) {
  switch (id) {
    case 'ask-me':
      return <AskMeIcon size={size} className={className} />;
    case 'portfolio':
      return <PortfolioIcon size={size} className={className} />;
    case 'resume':
      return <ResumeIcon size={size} className={className} />;
    case 'certificates':
      return <CertificatesIcon size={size} className={className} />;
    case 'projects':
      return <ProjectsIcon size={size} className={className} />;
    case 'contact':
      return <ContactIcon size={size} className={className} />;
    case 'terminal':
      return <TerminalIcon size={size} className={className} />;
    case 'settings':
      return <SettingsIcon size={size} className={className} />;
    case 'admin':
      return <AdminIcon size={size} className={className} />;
    case 'bento':
      return <BentoIcon size={size} className={className} />;
    default:
      return <AskMeIcon size={size} className={className} />;
  }
}
