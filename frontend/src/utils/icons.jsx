import React from 'react';
import {
  User, Briefcase, Award, FolderGit2, Mail, Terminal, Settings, ShieldCheck, Sparkles, LayoutGrid
} from 'lucide-react';

/* ─── Existing Social & Skill Logos ─────────────────────────────── */

export const SKILL_LOGOS = [
  { name: 'Python', color: '#3776AB', svg: `<svg viewBox="0 0 24 24"><path d="M12 2C8.8 2 7 3.3 7 5v2h5v1H5C3.3 8 2 9.8 2 12s1.3 4 3 4h2v-2c0-1.7 1.8-3 4-3h6c1.7 0 3-1.3 3-3V5c0-1.7-1.8-3-4-3h-4zm-1.5 1.5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" fill="#3776AB"/><path d="M12 22c3.2 0 5-1.3 5-3v-2h-5v-1h7c1.7 0 3-1.8 3-4s-1.3-4-3-4h-2v2c0 1.7-1.8 3-4 3H7c-1.7 0-3 1.3-3 3v3c0 1.7 1.8 3 4 3h4zm1.5-1.5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" fill="#FFD43B"/></svg>` },
  { name: 'SQL', color: '#336791', svg: `<svg viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="7" rx="7" ry="4" stroke="#336791" stroke-width="1.5" fill="none"/><path d="M5 7v6c0 2.2 3.1 4 7 4s7-1.8 7-4V7" stroke="#336791" stroke-width="1.5" fill="none"/><path d="M5 13v4c0 2.2 3.1 4 7 4s7-1.8 7-4v-4" stroke="#336791" stroke-width="1.5" fill="none"/></svg>` },
  { name: 'React', color: '#61DAFB', svg: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="2.1" fill="#61DAFB"/><ellipse cx="12" cy="12" rx="10" ry="3.5" fill="none" stroke="#61DAFB" stroke-width="1.2"/><ellipse cx="12" cy="12" rx="10" ry="3.5" fill="none" stroke="#61DAFB" stroke-width="1.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="3.5" fill="none" stroke="#61DAFB" stroke-width="1.2" transform="rotate(120 12 12)"/></svg>` },
  { name: 'JavaScript', color: '#F7DF1E', svg: `<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2" fill="#F7DF1E"/><text x="5.5" y="17" font-size="10" font-weight="bold" fill="#000" font-family="monospace">JS</text></svg>` },
  { name: 'HTML/CSS', color: '#E34F26', svg: `<svg viewBox="0 0 24 24"><path d="M4 3l1.5 17L12 22l6.5-2L20 3H4z" fill="#E34F26"/><path d="M12 5v14l5-1.5 1.3-14.5H12z" fill="#EF652A"/><path d="M12 10H8.5l.2 2H12v2H9l.3 3 2.7.7V19l-4-1.2-.4-4.8H9l.1 1h1.9V10z" fill="white"/></svg>` },
  { name: 'Power BI', color: '#F2C811', svg: `<svg viewBox="0 0 24 24"><rect x="2" y="14" width="4" height="8" rx="1" fill="#F2C811"/><rect x="7" y="10" width="4" height="12" rx="1" fill="#F2C811"/><rect x="12" y="6"  width="4" height="16" rx="1" fill="#F2C811"/><rect x="17" y="2"  width="4" height="20" rx="1" fill="#F2C811"/></svg>` },
  { name: 'Excel', color: '#217346', svg: `<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2" fill="#217346"/><text x="4.5" y="16" font-size="9" font-weight="bold" fill="white" font-family="monospace">XLS</text></svg>` },
  { name: 'GitHub', color: '#fff', svg: `<svg viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85.004 1.71.115 2.51.337 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z"/></svg>` },
  { name: 'Linux', color: '#FCC624', svg: `<svg viewBox="0 0 24 24" fill="#FCC624"><path d="M12 2C9 2 7 4 7 7c0 1.5.5 3 1.5 4.2L8 15h8l-.5-3.8C16.5 10 17 8.5 17 7c0-3-2-5-5-5zm-2 13l-.5 3h5l-.5-3H10zm2 4c-1.5 0-3 .5-4 1.5C8.5 21 9.5 22 12 22s3.5-1 4-1.5c-1-1-2.5-1.5-4-1.5z"/></svg>` },
  { name: 'MongoDB', color: '#47A248', svg: `<svg viewBox="0 0 24 24" fill="#47A248"><path d="M12 2C10 2 8.5 4 8 7c-.5 3 .5 6 1.5 8l1 5c.2.8.5 2 1.5 2s1.3-1.2 1.5-2l1-5c1-2 2-5 1.5-8C15.5 4 14 2 12 2z"/></svg>` },
  { name: 'C++', color: '#00599C', svg: `<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2" fill="#00599C"/><text x="3.5" y="16" font-size="9" font-weight="bold" fill="white" font-family="monospace">C++</text></svg>` },
  { name: 'Jupyter', color: '#F37626', svg: `<svg viewBox="0 0 24 24" fill="#F37626"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="4"  r="2"/><circle cx="12" cy="20" r="2"/><circle cx="4"  cy="8"  r="2"/><circle cx="20" cy="8"  r="2"/><circle cx="4"  cy="16" r="2"/><circle cx="20" cy="16" r="2"/></svg>` },
];

export const SOCIAL_LOGOS = {
  linkedin: `<svg viewBox="0 0 24 24" fill="#0077B5"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" fill="#25D366"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="#E1306C"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="#1877F2"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="#1DA1F2"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>`,
  gmail: `<svg viewBox="0 0 24 24"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/><path d="M12 9.548L5.455 4.64 3.927 3.493C2.309 2.28 0 3.434 0 5.457v13.909c0 .904.732 1.636 1.636 1.636h3.819V11.73l6.545 4.91L12 9.548z" fill="#C5221F"/><path d="M24 5.457c0-2.023-2.309-3.178-3.927-1.964l-1.528 1.145L12 9.548l6.545 7.091V21h3.819c.904 0 1.636-.732 1.636-1.636V5.457z" fill="#FABB05"/><path d="M12 16.64l6.545-4.91v9.273h-3.819C23.268 21 24 20.268 24 19.366V5.457c0-2.023-2.309-3.178-3.927-1.964l-1.528 1.145L12 9.548V16.64z" fill="#34A853"/><path d="M0 5.457v13.909c0 .904.732 1.636 1.636 1.636h3.819V11.73l6.545 4.91L12 9.548 5.455 4.64 3.927 3.493C2.309 2.28 0 3.434 0 5.457z" fill="#4285F4"/></svg>`,
  behance: `<svg viewBox="0 0 24 24" fill="#1769FF"><path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.546-1.436-2.352-2.461-2.352-1.036 0-2.167.708-2.504 2.352zm-8.931-9h-7.109v16h7.543c3.832 0 5.705-2.024 5.705-4.705 0-1.944-1.464-3.535-3.013-3.864 1.258-.456 2.457-1.896 2.457-3.666 0-2.482-1.904-3.765-5.583-3.765zm-2.463 6.3h-2.18v-4.3h2.383c2.327 0 2.977.838 2.977 2.152 0 1.268-.535 2.148-3.18 2.148zm.215 7.6h-2.394v-5.5h2.517c2.378 0 3.364 1.056 3.364 2.768 0 1.91-1.127 2.732-3.487 2.732z"/></svg>`,
  telegram: `<svg viewBox="0 0 24 24" fill="#26A5E4"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.123-2.678-1.799-1.185-.78-.415-1.21.258-1.91.176-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
  discord: `<svg viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>`,
  portfolio: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm-7 14.5c-2.481 0-4.5-2.019-4.5-4.5s2.019-4.5 4.5-4.5 4.5 2.019 4.5 4.5-2.019 4.5-4.5 4.5zm0-7c-1.378 0-2.5 1.122-2.5 2.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5-1.122-2.5-2.5-2.5z"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
  location: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`
};

export const getSkillLogo = (name) => {
  const item = SKILL_LOGOS.find(s => s.name.toLowerCase() === (name || '').toLowerCase());
  return item ? item.svg : '';
};

export const getSocialLogo = (platform) => {
  if (!platform) return SOCIAL_LOGOS['linkedin'];
  return SOCIAL_LOGOS[platform.toLowerCase()] || SOCIAL_LOGOS['linkedin'];
};

/* ─── Realistic & Detailed Custom SVG Brand App Icons ───────────────── */

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

/* Icon Resolver Component (default export) */
export default function AppIcon({ appId, id, size = 32, className = '' }) {
  const targetId = appId || id;
  switch (targetId) {
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
