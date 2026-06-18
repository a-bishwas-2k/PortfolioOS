You are editing a single-file portfolio HTML called PortfolioOS. The file has one large <style> block,
one HTML body, and one large <script> block. You will make surgical edits — no rewriting from scratch.
All existing JS logic (terminal engine, drag/resize, boot sequence, admin auth, localStorage persistence,
WebGL fluid cursor, letter glitch canvas) stays completely intact. Only the sections explicitly listed
below are changed.

════════════════════════════════════════════════════
PLAN 1 — THEME SYSTEM (Dark / Light / 5 Presets)
════════════════════════════════════════════════════

STEP 1 — CSS VARIABLES:
Replace the existing :root { } block with this structure:

  :root, [data-theme="dark"] { ...existing dark vars... }

  [data-theme="light"] {
    --bg:#F0EBF8; --bg2:#E8E0F4; --bg3:#DDD4F0; --purple:#C4B5FD;
    --violet:#7C3AED; --lavender:#6D28D9; --electric:#5B21B6;
    --pink:#DB2777; --cyan:#0891B2; --green:#059669;
    --text:#1E1033; --text2:#4C3A7A; --text3:#8B7DB5;
    --border:rgba(124,58,237,0.2); --border2:rgba(109,40,217,0.12);
    --glow:rgba(124,58,237,0.25); --glow2:rgba(124,58,237,0.12);
    --window-bg:rgba(240,235,248,0.96); --titlebar:rgba(232,224,244,0.99);
    --scanline-opacity:0.008;
  }

  [data-theme="ocean"] {
    --bg:#020B18; --bg2:#041422; --bg3:#071E32; --purple:#0C2A44;
    --violet:#0EA5E9; --lavender:#38BDF8; --electric:#7DD3FC;
    --pink:#F472B6; --cyan:#06B6D4; --green:#34D399;
    --text:#E0F2FE; --text2:#7DD3FC; --text3:#2563EB;
    --border:rgba(14,165,233,0.25); --border2:rgba(56,189,248,0.15);
    --glow:rgba(14,165,233,0.4); --window-bg:rgba(2,11,24,0.92);
    --titlebar:rgba(4,20,34,0.98); --scanline-opacity:0.03;
  }

  [data-theme="rose"] {
    --bg:#1A0A12; --bg2:#240E18; --bg3:#301220; --purple:#4C1628;
    --violet:#E11D48; --lavender:#FB7185; --electric:#FDA4AF;
    --pink:#F472B6; --cyan:#22D3EE; --green:#4ADE80;
    --text:#FFF1F2; --text2:#FECDD3; --text3:#9F1239;
    --border:rgba(225,29,72,0.25); --glow:rgba(225,29,72,0.4);
    --window-bg:rgba(26,10,18,0.92); --titlebar:rgba(36,14,24,0.98);
    --scanline-opacity:0.03;
  }

  [data-theme="forest"] {
    --bg:#021A0A; --bg2:#042210; --bg3:#062E16; --purple:#064E1E;
    --violet:#059669; --lavender:#34D399; --electric:#6EE7B7;
    --pink:#F472B6; --cyan:#22D3EE; --green:#4ADE80;
    --text:#ECFDF5; --text2:#6EE7B7; --text3:#065F46;
    --border:rgba(5,150,105,0.25); --glow:rgba(5,150,105,0.4);
    --window-bg:rgba(2,26,10,0.92); --titlebar:rgba(4,34,16,0.98);
    --scanline-opacity:0.03;
  }

STEP 2 — TRANSITION: Add to * selector:
  transition: background-color 0.35s ease, border-color 0.35s ease,
              color 0.35s ease, box-shadow 0.35s ease;

STEP 3 — LIGHT MODE FIXES:
  [data-theme="light"] #menubar { background: rgba(232,224,244,0.95); }
  [data-theme="light"] #dock { background: rgba(232,224,244,0.9); }
  [data-theme="light"] #stars-canvas { opacity: 0; }
  [data-theme="light"] #glitch-canvas { opacity: 0.3; }
  [data-theme="light"] #terminal-body, [data-theme="light"] #win-terminal .win-body
    { background: rgba(15,5,35,0.97) !important; }
  [data-theme="light"] .os-window { background: rgba(240,235,248,0.96); }
  [data-theme="light"] .about-tabs { background: rgba(232,224,244,0.97); }
  [data-theme="light"] .ap-bento-card, [data-theme="light"] .sk-card,
  [data-theme="light"] .ab-sk-card, [data-theme="light"] .edu-card-v2,
  [data-theme="light"] .cert-card-v2, [data-theme="light"] .proj-card-wrap
    { background: rgba(215,205,235,0.85); }
  [data-theme="light"] #ctx-menu { background: rgba(232,224,244,0.97); }

STEP 4 — THEME TOGGLE BUTTON in #menubar HTML, placed between 🔊 icon and #clock:
  <div id="theme-toggle-btn" onclick="cycleTheme()" title="Toggle Theme"
    style="width:28px;height:18px;border-radius:10px;cursor:pointer;
    display:flex;align-items:center;justify-content:center;font-size:14px;
    transition:all 0.2s;background:rgba(124,58,237,0.15);border:1px solid var(--border);">
    🌙
  </div>

STEP 5 — JS THEME ENGINE (add near top of script, after USER config):
  const THEMES = ['dark','light','ocean','rose','forest'];
  const THEME_ICONS = { dark:'🌙', light:'☀️', ocean:'🌊', rose:'🌸', forest:'🌿' };
  const THEME_LABELS = { dark:'Dark Purple', light:'Light Lavender',
    ocean:'Ocean Blue', rose:'Rose Garden', forest:'Forest' };
  const THEME_SWATCHES = {
    dark:  ['#7C3AED','#A78BFA','#EC4899','#22D3EE','#0B0614'],
    light: ['#7C3AED','#6D28D9','#DB2777','#0891B2','#F0EBF8'],
    ocean: ['#0EA5E9','#38BDF8','#F472B6','#06B6D4','#020B18'],
    rose:  ['#E11D48','#FB7185','#F472B6','#22D3EE','#1A0A12'],
    forest:['#059669','#34D399','#F472B6','#22D3EE','#021A0A'],
  };
  let currentTheme = localStorage.getItem('portfolioOS_theme') || 'dark';

  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolioOS_theme', theme);
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.textContent = THEME_ICONS[theme] || '🎨';
    const saved = JSON.parse(localStorage.getItem('adm_theme') || '{}');
    Object.entries(saved).forEach(([k,v]) => document.documentElement.style.setProperty(k,v));
  }

  function cycleTheme() {
    const idx = THEMES.indexOf(currentTheme);
    applyTheme(THEMES[(idx + 1) % THEMES.length]);
    showToast(THEME_ICONS[currentTheme], 'Theme', THEME_LABELS[currentTheme] + ' activated');
  }

  applyTheme(currentTheme); // call on load

STEP 6 — ADMIN THEME SECTION (replace admRenderTheme() function entirely):
  Render 5 preset cards in a grid (grid-template-columns: repeat(5,1fr), gap 10px).
  Each preset card shows: theme name, 5 color swatches as small circles, "Apply" button.
  Clicking apply calls applyTheme(themeName) and highlights the card with border-color:var(--violet).
  Below presets, keep the existing custom color pickers (admApplyColor, admResetTheme).
  Below color pickers, keep the Custom CSS textarea (admApplyCss, admClearCss).
  Add a "Current: [theme name]" indicator at the top.
  Preset card CSS class .theme-preset-card: border-radius 12px, border 1px solid rgba(124,58,237,0.15),
  padding 12px, cursor pointer, transition all 0.2s, text-align center.
  Active/current card gets: border-color var(--violet), box-shadow 0 0 16px rgba(124,58,237,0.3).

STEP 7 — Add cycleTheme to right-click context menu as new item:
  <div class="ctx-item" onclick="cycleTheme(); hideCtx()">🎨 Toggle Theme</div>

════════════════════════════════════════════════════
PLAN 2 — CONTACT WINDOW: EXTENDED ICON SET
════════════════════════════════════════════════════

STEP 1 — Add SOCIAL_ICONS object to JS (add before USER config):
  const SOCIAL_ICONS = {
    email:     /* red envelope SVG with #EA4335 rect, white path */,
    phone:     /* green rect phone SVG */,
    github:    /* standard GitHub octocat SVG, fill white */,
    linkedin:  /* blue rect #0A66C2 with L path */,
    location:  /* pin outline SVG #EC4899 */,
    instagram: /* radialGradient purple/red/orange, camera outline */,
    facebook:  /* #1877F2 rect with F path */,
    twitter:   /* black rect #000 with X logo path */,
    youtube:   /* #FF0000 rect with play triangle */,
    google:    /* white circle with 4-color G segments */,
    whatsapp:  /* #25D366 circle with phone path */,
    discord:   /* #5865F2 rect with blob path */,
    telegram:  /* #26A5E4 circle with paper-plane path */,
    tiktok:    /* #000 rect with note path */,
    snapchat:  /* #FFFC00 rect with ghost path */,
    pinterest: /* #E60023 circle with P path */,
    reddit:    /* #FF4500 circle with alien head */,
    medium:    /* #000 rect with M path */,
    behance:   /* #1769FF rect with Be text */,
    dribbble:  /* #EA4C89 circle with stroke lines */,
    stackoverflow: /* #F58025 stacked bars */,
    leetcode:  /* #FFA116 rect with bracket icon */,
    hashnode:  /* #2962FF rect rounded with H dot */,
    devto:     /* #000 rect with DEV text */,
  };
  Each value is a raw inline SVG string (no external deps). Viewbox 0 0 24 24. Size 20-22px when rendered.

STEP 2 — Add helper function getSocialIcon(label):
  function getSocialIcon(label) {
    const l = label.toLowerCase().replace(/[^a-z]/g,'');
    for (const [key, svg] of Object.entries(SOCIAL_ICONS)) {
      if (l.includes(key)) return svg;
    }
    return null;
  }

STEP 3 — Update renderContact() to handle both SVG strings and emoji icons:
  For each link, detect if icon starts with '<svg' → render as raw innerHTML in .contact-icon-wrap
  If icon is emoji string → render in a <span class="social-emoji"> inside .contact-icon-wrap
  Update .contact-icon-wrap CSS: width 50px, height 50px min, display flex, align-items center,
  justify-content center. SVG inside gets width 22px height 22px.

STEP 4 — CORE links in renderContact() (always shown, in order):
  1. email    — SOCIAL_ICONS.email
  2. phone    — SOCIAL_ICONS.phone
  3. github   — SOCIAL_ICONS.github  (from USER.links.github)
  4. linkedin — SOCIAL_ICONS.linkedin (from USER.links.linkedin)
  5. location — SOCIAL_ICONS.location (from USER.location, links to Google Maps)
  Then append USER.contactLinks[] custom links below, each using lk.icon field
  (auto-detect SVG from SOCIAL_ICONS if lk.icon matches a key, otherwise render as emoji).

STEP 5 — Update admOpenContactLinkModal() in admin panel:
  Replace the simple emoji text field with a two-section icon picker:
  Section A — "Platform Logos": a flex-wrap grid showing SVG icons for all SOCIAL_ICONS keys.
    Each is a 40x40px clickable tile with the SVG centered. On click: sets lk.icon = key name
    (e.g. "instagram"), NOT the raw SVG. Store only the key, resolve at render time.
  Section B — "Custom Emoji": a text input for emoji fallback if platform not in SOCIAL_ICONS.
  Icon picker built with DOM manipulation after admOpenModal() renders (setTimeout 60ms).
  When saving (admSaveContactLink), if icon matches a SOCIAL_ICONS key, store the key string.
  When rendering, renderContact() checks: if SOCIAL_ICONS[lk.icon] exists, use SVG; else render as emoji.

STEP 6 — Update admBuildContactList() to show SVG preview:
  In the icon column of each list item, detect SVG vs emoji same way as renderContact().
  Show a 32x32px icon preview square per link.

════════════════════════════════════════════════════
PLAN 3 — ABOUT.APP: PROFILE TAB REDESIGN (Bento Layout)
════════════════════════════════════════════════════

STEP 1 — Replace the entire #ap-profile panel HTML:
  Remove the old .ap-profile (left card col + right info col) structure entirely.
  Replace with .ap-profile-v3 (display flex, flex-direction column, overflow-y auto):

  A) HERO BANNER (.ap-hero-banner):
     Height auto, padding 28px 28px 22px.
     Background: linear-gradient(135deg, rgba(45,27,105,0.5), rgba(124,58,237,0.15) 40%, rgba(236,72,153,0.1)).
     ::before pseudo: two radial gradients (purple ellipse 30% 60%, pink ellipse 80% 20%),
       animation heroGradientShift 8s ease-in-out infinite (opacity + scale).
     Inside .ap-hero-inner (flex row, gap 22px, align-items center):
       Left: .ap-avatar-wrap (76x76px, position relative):
         .ap-avatar-ring-outer: position absolute, inset -6px, border-radius 50%,
           border 2px solid rgba(124,58,237,0.4), animation ringPulse 2.5s ease-in-out infinite
           (scale 1→1.1, opacity 0.6→1).
         .ap-avatar-ring-inner: fills 100%, border-radius 50%, border 2px solid var(--violet),
           background linear-gradient(135deg, rgba(45,27,105,0.6), rgba(124,58,237,0.3)),
           display flex, align-items center, justify-content center, font-size 36px (the 🧑‍💻 emoji),
           box-shadow 0 0 24px rgba(124,58,237,0.4), inset 0 0 16px rgba(124,58,237,0.2).
       Right: .ap-hero-text (flex 1):
         .ap-hero-name: font-family Syne 800, font-size clamp(20px,2.5vw,30px), letter-spacing -0.5px,
           background gradient (electric→lavender→pink), -webkit-background-clip text,
           -webkit-text-fill-color transparent. ID="ap-name-el", decryptText animates into it.
         .ap-hero-role: font-size 11.5px, color var(--lavender), ::before content "//" in violet.
           ID="ap-role-el", decryptText animates into it.
         .ap-hero-chips: flex row, gap 8px, flex-wrap wrap:
           Three .ap-chip spans: "📍 Bhubaneswar, India", "🎓 KIIT · 8.22 CGPA",
           and the animated .status-pill ("Open to Work" with green dot).

  B) BENTO GRID (.ap-bento):
     CSS: display grid, grid-template-columns 1fr 180px 200px, grid-template-rows auto auto,
     gap 12px, padding 16px 20px 20px, flex 1.
     Mobile override: grid-template-columns 1fr, all cards grid-row auto.

     Card base class .ap-bento-card:
       background rgba(13,7,26,0.8), border 1px solid var(--border2), border-radius 14px,
       padding 16px, position relative, overflow hidden.
       Hover: border-color rgba(124,58,237,0.4), transform translateY(-2px),
         box-shadow 0 8px 28px rgba(0,0,0,0.3).
       Entry animation: bentoIn — from opacity 0, translateY(12px) scale(0.97) → normal.
         Each card gets animation-delay 0.05s increments.

     Card 1 — BIO CARD (.ap-bio-card, grid-column 1, grid-row 1/3):
       ::before: left border 3px, linear-gradient(var(--violet), var(--pink)).
       .ap-bento-label (section heading style): font-size 9px, color rgba(124,58,237,0.7),
         uppercase, letter-spacing 2.5px, ::after is a flex-1 gradient line.
       Large decorative quote mark: position absolute, top -8px, right 14px, font-size 28px,
         color rgba(124,58,237,0.25), font-family Georgia.
       .ap-bio-text: font-size 11.5px, line-height 1.9, color var(--text2), padding-right 8px.
         Populated by renderAbout() → element id="ap-bio-el".

     Card 2 — STATS CARD (.ap-stats-card, grid-column 2, grid-row 1):
       Label "// stats". Then id="ap-stats-el" populated by renderAbout().
       Each stat (.ap-stat-v3): flex row, gap 10px, padding 9px 0,
         border-bottom 1px solid rgba(124,58,237,0.08), last-child no border.
         .ap-stat-icon-wrap: 32x32px, border-radius 9px, emoji icon,
           background rgba(124,58,237,0.12), border 1px solid rgba(124,58,237,0.2).
         .ap-stat-num-v3: font-family Syne 800, font-size 22px, color var(--electric),
           animated by countUp() on render.
         .ap-stat-lbl-v3: font-size 9px, color var(--text3), uppercase.
       Three stats: Projects (count), Skills (count), Certs (count).

     Card 3 — CONTACTS CARD (.ap-contacts-card, grid-column 3, grid-row 1/3):
       Label "// reach out". Then id="ap-contacts-el" populated by renderAbout().
       Each .ap-clink-v3: flex row, gap 9px, padding 9px 10px, border-radius 10px,
         border 1px solid rgba(124,58,237,0.1), text-decoration none, margin-bottom 7px.
         ::before: left 0, width 2px, background var(--border-left-color), opacity 0 → 1 on hover.
         Hover: border-color rgba(124,58,237,0.45), color var(--electric), translateX(4px).
         .ap-clink-icon-v3: 26x26px, border-radius 7px, SVG icon centered.
           Hover: scale(1.1) rotate(-4deg), background rgba(124,58,237,0.25).
         .ap-clink-info-v3: label (8px uppercase) + value (10px mono, truncated).
       Four links: email, phone, github, linkedin. SVGs from SOCIAL_ICONS.

     Card 4 — STATUS CARD (.ap-status-row, grid-column 2, grid-row 2):
       Shows .status-pill ("Available for opportunities" with blinking green dot).
       Below it: a "✉️ Contact Me" button calling openWindow('contact').

STEP 2 — Remove all old .ap-card-col, .pc-wrap, .pc-card, .pc-behind, .pc-shine, .pc-glare,
  .ap-info-col, .ap-hero, .ap-name, .ap-role, .ap-meta-row, .ap-stats, .ap-bio, .ap-contacts,
  .ap-clink CSS — these are no longer used.

STEP 3 — Remove the 3D profile card JS function initProfileCardTilt() entirely.

STEP 4 — renderAbout() function updates:
  Still uses ids: ap-name-el, ap-role-el, ap-bio-el, ap-stats-el, ap-contacts-el.
  Name: decryptText(nameEl, USER.name) — same as before.
  Role: decryptText(roleEl, USER.role, delay 300ms) — same.
  Bio: direct textContent assignment — same.
  Stats: now renders .ap-stat-v3 rows (icon wrap + number + label) instead of grid cards.
  Contacts: now renders .ap-clink-v3 rows with SVGs from SOCIAL_ICONS.
  Remove all 3D card init code from renderAbout().

════════════════════════════════════════════════════
PLAN 4 — ABOUT.APP: SKILLS TAB REDESIGN (Card Grid + Border Glow)
════════════════════════════════════════════════════

STEP 1 — New CSS for skills tab content:
  .ab-skill-cat-label: font-size 9px, color rgba(124,58,237,0.7), uppercase, letter-spacing 2.5px,
    margin 12px 0 8px, flex row with ::after gradient line, font-family mono.
  .ab-skills-grid: display grid, grid-template-columns repeat(auto-fill, minmax(175px,1fr)), gap 9px.

  Skill card class .ab-sk-card (same border-glow engine as .sk-card in win-skills):
    CSS custom props: --sk-edge:0, --sk-angle:45deg.
    padding 13px 14px, border-radius 12px, background rgba(13,7,26,0.9),
    border 1px solid rgba(124,58,237,0.1), position relative, overflow visible,
    isolation isolate, cursor default.
    Transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), border-color, box-shadow.
    Animation: skCardIn 0.4s cubic-bezier both (same keyframe as existing).

    ::before (gradient border via conic mask):
      content '', position absolute, inset 0, border-radius inherit, z-index -1,
      border 1px solid transparent,
      background: padding-box background + border-box gradients (g1, g2, violet fallback),
      opacity: calc((var(--sk-edge) - 50) / 50),
      mask-image: conic-gradient(from var(--sk-angle) at center, black 22%, transparent 37%,
        transparent 63%, black 78%).

    .ab-sk-glow (outer glow ring):
      position absolute, inset -18px, opacity calc((var(--sk-edge) - 30) / 70),
      mix-blend-mode plus-lighter, conic mask same angles.
      ::before: inset 18px, box-shadow inset+outer using var(--sk-glow).

    Hover state: translateY(-4px) scale(1.02), border-color rgba(124,58,237,0.35).

    Inner .ab-sk-card-bg: absolute, inset 0, background var(--sk-grad), opacity 0 → 1 on hover.

    Card content layout same as .sk-card in win-skills:
      .ab-sk-top: flex row, space-between.
        .ab-sk-left: flex row, gap 8px.
          .ab-sk-icon: 29x29px, border-radius 7px, SVG icon (14x14px). Hover: rotate -6deg scale 1.1.
          .ab-sk-name: 11px mono 600, color var(--text) → var(--electric) on hover.
        .ab-sk-pct: Syne 800 18px, color var(--electric). Hover: scale 1.12, text-shadow glow.
      .ab-sk-bar-bg: 3px height, bar-fill with shimmer animation.
      .ab-sk-footer: level label (b colored by level) + category label.

STEP 2 — renderAboutSkills() function full replacement:
  Render ab-marquee-track first (same as before, [...SKILL_LOGOS,...SKILL_LOGOS] doubled).
  For ab-skills-bars: loop Object.entries(USER.skills).
    For each category: render .ab-skill-cat-label then .ab-skills-grid.
    For each skill in category: render .ab-sk-card with all CSS vars set inline:
      --sk-bar, --sk-glow, --sk-g1, --sk-g2, --sk-icon-bg, --sk-icon-bd from SK_CAT_CFG[cat].
      --sk-grad: linear-gradient using ibg color.
      animation-delay: si * 0.04s.
    Find matching logo from SKILL_LOGOS array (name match).
    Apply profLabel(pct) for level text and color.
  After innerHTML set: attach pointermove/pointerleave border glow listeners to each .ab-sk-card
    (same initSkCardGlow logic — updates --sk-edge and --sk-angle CSS vars).
  After paint (double rAF): set all .ab-sk-bar-fill widths from data-pct.
  Guard: dataset.rendered on bars element, but RESET this guard in admApplyToPortfolio().

STEP 3 — Re-use existing SK_CAT_CFG, SK_DEFAULT_CFG, SKILL_LOGOS, profLabel() — no changes needed.

════════════════════════════════════════════════════
PLAN 5 — ABOUT.APP: EDUCATION TAB + LOGO UPLOAD
════════════════════════════════════════════════════

STEP 1 — Add USER.education array to USER config (parallel to existing hardcoded HTML):
  education: [
    { degree:"B.Tech — Computer Science & Engineering",
      school:"KIIT Deemed to be University, Bhubaneswar, Odisha",
      year:"2021 – 2025", cgpa:"8.22 / 10", location:"Bhubaneswar, India",
      logo:"", initials:"KIIT" },
    { degree:"12th Grade — Science",
      school:"Capital Secondary School, Kathmandu",
      year:"YOP 2019", cgpa:"3.13 / 4.0", location:"Kathmandu, Nepal",
      logo:"", initials:"CSS" },
    { degree:"10th Grade",
      school:"Bal Kalyan Vidhya Mandir Ma Vi, Biratnagar",
      year:"YOP 2017", cgpa:"3.45 / 4.0", location:"Biratnagar, Nepal",
      logo:"", initials:"BKV" },
  ]
  logo field stores base64 string or hosted URL. initials is fallback display.
  loadUSER() must merge parsed.education into USER.education.

STEP 2 — Replace hardcoded education HTML in #ap-education panel with an empty div:
  <div class="ap-edu-panel" id="ap-edu-panel-inner"></div>
  Content rendered dynamically by renderAboutEducation().

STEP 3 — New CSS for education redesign:
  .edu-timeline::before: animated dashed line.
    content '', position absolute, left 8px, top 14px, bottom 14px, width 2px,
    background: repeating-linear-gradient(to bottom, var(--violet) 0px, var(--violet) 6px,
      transparent 6px, transparent 12px), opacity 0.6.
  .edu-timeline::after: traveling dot.
    content '', position absolute, left 7px, top 14px, width 4px, height 16px,
    background var(--lavender), box-shadow 0 0 8px var(--violet),
    animation timelineDot 3s linear infinite.
    @keyframes timelineDot: top 14px → top calc(100% - 14px), opacity 1 → 0.

  .edu-dot-v2: position absolute, left -26px, top 14px, 16x16px, border-radius 50%,
    gradient fill, border 3px solid var(--bg),
    box-shadow 0 0 0 2px var(--violet), 0 0 16px rgba(124,58,237,0.5).
    Hover (via .edu-item:hover .edu-dot-v2): scale 1.3, stronger glow.

  .edu-card-v2: border-radius 14px, background rgba(13,7,26,0.85), overflow hidden.
    Hover: border-color rgba(124,58,237,0.5), translateX(6px), box-shadow.

  .edu-card-strip (top section of each card, flex row, padding 14px 16px 12px):
    background linear-gradient(135deg, rgba(45,27,105,0.2), transparent).
    ::before: left 0, width 3px, gradient border accent.
    .edu-logo-wrap: 46x46px, border-radius 10px, overflow hidden,
      border 1px solid rgba(124,58,237,0.2), flex-shrink 0.
      If logo set: <img> with object-fit cover.
      If no logo: .edu-logo-initials (Syne 800 16px, color var(--lavender)).
      Hover (via .edu-card-v2:hover .edu-logo-wrap): scale 1.05.
    .edu-strip-right: flex 1.
      .edu-degree-v2: Syne 700 13px, color var(--electric).
      .edu-school-v2: 11px, color var(--lavender).
    .edu-year-v2: pill badge, right side.
  .edu-card-body: padding 10px 16px 14px.
    .edu-badges: same as before (cgpa green, loc cyan).

  .extra-item: update icon to be a 34x34px rounded square (background rgba(124,58,237,0.12),
    border, centered emoji) instead of raw font. Title 11px 600 lavender, sub 10px text3.

STEP 4 — renderAboutEducation() function (new):
  function renderAboutEducation() {
    const panel = document.getElementById('ap-edu-panel-inner');
    if (!panel || panel.dataset.rendered) return;
    panel.dataset.rendered = '1';
    const edu = USER.education || [];
    let html = '<div class="edu-timeline">';
    edu.forEach((e, i) => {
      const logoHtml = e.logo
        ? `<img src="${e.logo}" alt="${e.initials}" onerror="this.style.display='none'">`
        : `<div class="edu-logo-initials">${e.initials||'?'}</div>`;
      html += `
        <div class="edu-item" style="animation:bentoIn 0.4s ease ${i*0.1}s both">
          <div class="edu-dot-v2"></div>
          <div class="edu-card-v2">
            <div class="edu-card-strip">
              <div class="edu-logo-wrap">${logoHtml}</div>
              <div class="edu-strip-right">
                <div class="edu-degree-v2">${e.degree}</div>
                <div class="edu-school-v2">🏛️ ${e.school}</div>
              </div>
              <span class="edu-year-v2">${e.year}</span>
            </div>
            <div class="edu-card-body">
              <div class="edu-badges">
                <span class="edu-badge cgpa">📈 CGPA: ${e.cgpa}</span>
                <span class="edu-badge loc">📍 ${e.location}</span>
              </div>
            </div>
          </div>
        </div>`;
    });
    html += '</div>';
    html += /* extracurricular grid HTML, same 4 items as original */;
    panel.innerHTML = html;
  }

STEP 5 — Call renderAboutEducation() in switchAboutTab() when id==='education'.

STEP 6 — ADMIN PANEL: Add new sidebar item "🎓 Education" between Certificates and Notes.
  Add admRenderEducation() function:
    Renders 3 fixed education entry cards (one per USER.education[]).
    Each card shows: degree title, school name, year, cgpa, location.
    Below each: two upload inputs (same pattern as project thumbnail):
      Input A: file input (accept="image/*") → FileReader → base64 → USER.education[i].logo.
      Input B: URL text input → USER.education[i].logo.
      Preview <img> tag (100% width, 80px height, object-fit cover, border-radius 8px).
      Helper functions: admHandleEduLogo(i) for file upload, admEduLinkPreview(i) for URL paste.
    "💾 Save Education" button → saves USER.education array → saveUSER() → admApplyToPortfolio().
    admApplyToPortfolio() must reset panel.dataset.rendered for ap-edu-panel-inner.

════════════════════════════════════════════════════
PLAN 6 — ABOUT.APP: CERTIFICATES TAB REDESIGN
════════════════════════════════════════════════════

STEP 1 — Replace #ap-certs-inner content rendering (renderAboutCerts() function):
  Layout: .cert-grid-v2 (display grid, grid-template-columns repeat(auto-fill, minmax(280px,1fr)),
    gap 14px). Renders USER.certs[] dynamically.

STEP 2 — New .cert-card-v2 CSS:
  border-radius 15px, background rgba(13,7,26,0.9), border 1px solid rgba(124,58,237,0.12),
  overflow hidden, flex-direction column, cursor pointer.
  Hover: border-color rgba(124,58,237,0.55), translateY(-5px),
    box-shadow 0 16px 48px rgba(0,0,0,0.5), 0 0 40px rgba(124,58,237,0.08).

STEP 3 — Each card structure:
  A) .cert-preview-area (width 100%, height 160px, position relative, overflow hidden):
     If c.src is set and c.isImage === true:
       <img src="{c.src}" object-fit cover, transition transform 0.4s ease.
       Hover (via .cert-card-v2:hover img): scale 1.06.
       .cert-overlay-gradient: absolute inset, linear-gradient(to top,
         rgba(13,7,26,0.95) 0%, rgba(13,7,26,0.3) 55%, transparent 100%).
       .cert-overlay-badge: top-right, "✓ Verified" in green pill.
     If c.src is set but c.isImage === false (web link / iframe):
       Show .cert-preview-placeholder with large icon + pulsing "Click to Preview" CTA button.
       CTA animation: border pulses violet 0.4 → 0.8 opacity every 2s.
     If no c.src or c.src === '#':
       Show .cert-preview-placeholder with large icon + "No preview URL set" in text3.
     .cert-preview-placeholder: full area, flex column center, gap 8px,
       background linear-gradient(135deg, rgba(45,27,105,0.3), rgba(236,72,153,0.1)).
     .cert-big-icon: font-size 52px, filter drop-shadow violet.
     .cert-preview-cta: inline-flex, padding 6px 16px, border-radius 20px, font-mono 10px,
       border 1px animated.

  B) .cert-body-v2 (padding 14px 16px 16px, flex 1, flex-direction column):
     .cert-name-v2: Syne 700 13.5px, color var(--electric), line-height 1.3, margin-bottom 4px.
     .cert-issuer-v2: 11px, color var(--lavender), with 🏢 emoji, margin-bottom 8px.
     .cert-tags-v2: flex wrap, gap 5px, margin-bottom 10px, flex 1.
       .cert-tag-v2: same as before but hover-aware via parent card hover.
     .cert-actions-v2: flex row, space-between, margin-top auto.
       .cert-date-v2: 10px mono text3.
       .cert-btn-row: flex gap 6px.
         .cert-btn-preview: gradient violet→pink background, "👁 Preview" text.
           Hover: solid gradient, white text, translateY(-1px).
           Only rendered if c.src && c.src !== '#'.
         .cert-btn-open: cyan tinted, "↗" only, <a> tag to c.src target="_blank".
           Only rendered if c.src && c.src !== '#'.
         Both buttons call event.stopPropagation() to avoid double-triggering card click.

STEP 4 — Card onclick calls certClick(c.src, c.name, c.isImage) — keep existing function.

STEP 5 — certLightbox enhancement:
  Add loading spinner while image loads (absolute centered, spinning border animation).
  Add ESC key listener: document.addEventListener('keydown', e => { if(e.key==='Escape') lb.remove(); }).
  Add fade-in animation on lb: animation apIn 0.2s ease.

STEP 6 — Admin panel certs: admSaveCert() must reset ap-certs-inner.dataset.rendered
  and call inner.innerHTML = '' so re-render picks up changes.
  Ensure cert thumbnail upload follows same pattern as project thumbnail:
    admHandleThumb-style function for cert image, base64 stored in c.src.

STEP 7 — Cert hint card at bottom:
  .cert-hint-v2: padding 11px 15px, border 1px dashed rgba(124,58,237,0.2),
    border-radius 10px, font-size 10.5px, mono, centered, text3.
  Text: "💡 Set src in USER.certs[] or upload via Admin Panel to enable previews".

════════════════════════════════════════════════════
PLAN 7 — PROJECTS WINDOW: FULL DASHBOARD REDESIGN
════════════════════════════════════════════════════

STEP 1 — New CSS (add to <style> block):

  #win-projects { width:900px; height:680px; top:50px; left:100px; }
  .proj-dash { display:flex; flex-direction:column; height:100%; overflow:hidden;
    background:linear-gradient(160deg,var(--bg2) 0%,var(--bg) 100%); }

  .proj-header { flex-shrink:0; padding:18px 22px 14px;
    background:linear-gradient(180deg,rgba(45,27,105,0.2),transparent);
    border-bottom:1px solid rgba(124,58,237,0.15);
    display:flex; align-items:center; justify-content:space-between; position:relative; }
  .proj-header::before { radial glow at 10% 50% violet }
  .proj-header-title { Syne 800 18px, color var(--electric) }
  .proj-header-sub { 10px text3 uppercase letter-spacing 2px }
  .proj-header-stats { flex row, gap 8px }
  .proj-hstat { pill: padding 6px 14px, border-radius 20px, font-mono 10.5px,
    bg rgba(124,58,237,0.1), border rgba(124,58,237,0.25), color var(--lavender) }

  .proj-filters { flex-shrink:0; overflow-x:auto; padding:0 18px;
    border-bottom:1px solid rgba(124,58,237,0.1);
    background:rgba(8,4,18,0.9); display:flex; }
  .proj-filter { same as .sk-tab: 10px mono uppercase, cursor pointer,
    border-bottom 2px transparent, hover color var(--text2),
    active: color var(--lavender), border-bottom-color var(--violet) }

  .proj-grid-wrap { flex:1; overflow-y:auto; padding:18px; scrollbar-width thin; }
  .proj-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; }

  .proj-card-wrap (BorderGlow engine):
    --bgc-edge:0 (set by pointermove), --bgc-angle:45deg, --bgc-glow set per project.
    border-radius:16px; background rgba(12,6,24,0.92); border 1px solid rgba(124,58,237,0.1);
    position relative; overflow visible; isolation isolate; cursor pointer.
    Transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), border-color, box-shadow.
    @keyframes cardIn: from opacity 0, translateY(16px) scale(0.95) → normal. Stagger via delay.
    ::before (gradient border, conic mask same as .sk-card):
      opacity calc((var(--bgc-edge) - 50) / 50).
    .proj-card-glow (outer glow ring):
      inset -20px, opacity calc((var(--bgc-edge) - 30) / 70),
      mix-blend-mode plus-lighter, conic mask.
      ::before box-shadow using var(--bgc-glow).
    Hover: translateY(-6px) scale(1.01), border-color rgba(124,58,237,0.3),
      box-shadow 0 20px 60px rgba(0,0,0,0.5).

  .proj-card-top: height 190px, position relative, overflow hidden, border-radius 16px 16px 0 0,
    flex-direction column, justify-content flex-end, padding 14px 16px.
    .proj-thumb-img: absolute inset, object-fit cover, transition transform 0.4s.
      Hover (via .proj-card-wrap:hover .proj-thumb-img): scale 1.05.
    .proj-thumb-overlay: absolute inset, gradient to top (black 95%→transparent).
    .proj-emoji-bg (no thumbnail fallback): absolute inset, flex center.
      Background: two radial gradients using project color array.
      .proj-emoji-large: 60px font-size, drop-shadow, animation emojiFloat 4s (translateY 0→-8px).
      Three .proj-particle spans: 3x3px circles, opacity 0.4, animation particleDrift 5s.
    .proj-status-badge: top-left, absolute z-index 2. Classes .completed/.wip/.archived
      with appropriate color combos (green/yellow/red). Contains pulsing dot + text.
    .proj-card-name-v2: Syne 800 16px, white, text-shadow, z-index 2.
    .proj-card-meta: 10px, rgba(255,255,255,0.65), mono, z-index 2.
    .proj-card-hl: 9.5px, rgba(167,139,250,0.8), mono, z-index 2.

  .proj-card-body: padding 14px 16px 16px.
    .proj-card-desc: 11.5px, line-height 1.7, color var(--text2),
      -webkit-line-clamp 3, -webkit-box-orient vertical, overflow hidden.
    .proj-card-tags: flex wrap, gap 5px. .proj-card-tag: pill 9.5px, violet tint.
    .proj-card-actions: flex row, gap 8px, margin-top 10px.
      .proj-btn-demo: flex 1, gradient border+bg, hover: solid gradient white text.
      .proj-btn-gh: 36x36px square, icon button, hover: scale 1.1.

  .proj-detail-panel:
    position absolute, top 0, right 0, bottom 0, width 380px.
    background rgba(8,3,18,0.98), border-left 1px solid rgba(124,58,237,0.2),
    backdrop-filter blur(20px), z-index 20, overflow-y auto.
    transform: translateX(100%), transition transform 0.3s cubic-bezier(0.34,1.56,0.64,1).
    .open class: transform translateX(0).
    Contains: .proj-detail-header (flex, border-bottom, close button),
      .proj-detail-body (padding 16px).
    Close button (.proj-detail-close): 28x28px circle, hover: red X style.

STEP 2 — renderProjects() full replacement:
  Build header stats (total, shipped, live count) — check if already rendered.
  Build filter tabs from all unique tags — check if already rendered.
  Filter USER.projects by projFilter.
  For each project, build .proj-card-wrap with all inline CSS vars:
    --bgc-g1, --bgc-g2 from p.color array.
    --bgc-glow from p.color[0] with 60% opacity.
    --proj-grad gradient using p.color[0].
    animation-delay: i * 0.07s.
  Top area: if p.thumbnail set → <img class="proj-thumb-img"> + overlay.
    If not → .proj-emoji-bg with radial gradients + emoji + particles.
  Status badge uses p.status for class.
  Action buttons: demo link + github icon.
  After rendering: call initBorderGlow(el) on each .proj-card-wrap.

STEP 3 — openProjectDetail(slug) update:
  Panel slides in: panel.classList.add('open') instead of panel.style.display = 'flex'.
  closeProjectDetail(): panel.classList.remove('open').
  Detail uses p.thumbnail2 → p.thumbnail → live iframe → emoji placeholder.

STEP 4 — Admin thumbnail (admOpenProjModal):
  Two thumb blocks (card thumb + detail thumb) using admHandleThumb(n) and admThumbLinkPreview(n).
  All existing logic kept.
  Add inline "Card Preview" note showing recommended size (800x500px for card, 1200x700px for detail).

STEP 5 — admApplyToPortfolio() must reset proj-grid.dataset.rendered
  and proj-grid.dataset.lastFilter, proj-header-stats.dataset.rendered,
  proj-filters.dataset.rendered to allow full re-render.

════════════════════════════════════════════════════
PRESERVATION RULES (apply to ALL plans above)
════════════════════════════════════════════════════

KEEP INTACT — Do not modify these:
  - Terminal engine (all COMMANDS, keydown handler, appendLine, history, autocomplete)
  - WebGL fluid cursor (entire initSplashCursor IIFE)
  - Letter glitch canvas (entire initLetterGlitch IIFE)
  - Boot sequence (runBoot, bootMessages)
  - Drag and resize (initDrag, all mousemove/mouseup listeners)
  - Window management (openWindow, closeWindow, minimizeWindow, restoreWindow, maximizeWindow)
  - Admin panel auth (admLogin, admLogout, ADM_PASS, admLogin, admLogout)
  - Admin CRUD functions (admSaveProj, admSaveSkill, admSaveCert, admSaveNote, admSaveProfile, etc.)
  - Admin tag widget (admTagKey, admRemTag)
  - Admin modal (admOpenModal, admCloseModal, admConfirm)
  - localStorage persistence (saveUSER, loadUSER, USER_KEY)
  - Clock (updateClock)
  - Toast (showToast)
  - Context menu (ctxMenu, hideCtx)
  - Taskbar (addToTaskbar, removeFromTaskbar, createTaskbar IIFE)
  - Dock icon state (updateDockIcon)
  - Border glow engine (initBorderGlow — keep exactly as is)
  - Skills window rendering (animateSkills, renderSkillGrid, setSkillTab, SKILL_LOGOS,
      SK_CAT_CFG, SK_DEFAULT_CFG, profLabel, initSkCardGlow)
  - Contact render (renderContact — only update SVG detection per Plan 2)
  - Notes render (renderNotes — unchanged)
  - neofetch, git log, history, all terminal commands
  - decrypt text, countUp

ADMAPPLYTOPORTFOLIO() must reset ALL render guards:
  ap-certs-inner.dataset.rendered = ''
  ab-skills-bars.dataset.rendered = ''
  ab-marquee-track.dataset.rendered = ''
  contact-body.dataset.rendered = ''
  proj-grid.dataset.rendered = ''
  proj-grid.dataset.lastFilter = ''
  proj-header-stats.dataset.rendered = ''
  proj-filters.dataset.rendered = ''
  sk-tabs.dataset.rendered = ''
  ap-edu-panel-inner.dataset.rendered = ''
  Then innerHTML = '' on: ap-certs-inner, ab-skills-bars, contact-body,
    proj-grid, sk-grid, notes-body, ap-edu-panel-inner.
  Then re-render all open windows.

════════════════════════════════════════════════════
EXECUTION ORDER WITHIN A SINGLE FILE EDIT
════════════════════════════════════════════════════

1. Add SOCIAL_ICONS object and getSocialIcon() before USER config.
2. Add USER.education array inside USER config.
3. Add THEMES, THEME_ICONS, applyTheme(), cycleTheme() after loadUSER() call.
4. Call applyTheme(currentTheme) at end of theme setup.
5. Add all new CSS to <style> block (theme vars, bento layout, edu redesign,
   cert redesign, project redesign, ab-sk-card, social icon styles).
6. Update HTML: theme toggle button in menubar, Education tab points to empty panel,
   project detail panel uses class-based .open instead of inline display.
7. Replace renderAbout() — bento layout, SVG contact icons.
8. Add renderAboutSkills() with card grid and border glow.
9. Add renderAboutEducation() reading USER.education[].
10. Replace renderAboutCerts() with new cert-card-v2 layout.
11. Replace renderProjects() with new card grid and border glow.
12. Replace openProjectDetail() with slide-in panel.
13. Replace renderContact() with SVG icon support.
14. Replace admRenderTheme() with preset cards.
15. Add admRenderEducation() function.
16. Add sidebar item for Education in admin HTML.
17. Update switchAboutTab() to call renderAboutEducation() for 'education'.
18. Update admApplyToPortfolio() to reset all guards listed above.
19. Add ESC key listener for cert lightbox.
20. Add cycleTheme to context menu HTML.


11:21Claude responded: Single Execution PromptSingle Execution Prompt

You are editing a single-file HTML portfolio called PortfolioOS. Make all changes below surgically. Keep terminal engine, WebGL cursor, letter glitch, boot sequence, drag/resize, admin CRUD, localStorage, and all window management completely untouched.

CHANGE 1 — THEME SYSTEM
Replace the single CSS root block with five themed blocks activating via data-theme attribute on the html element — dark (existing values), light (soft lavender whites, deep purple accents), ocean (dark navy, sky blue accents), rose (dark wine, crimson accents), forest (dark green, emerald accents). Every block defines all existing CSS variables. Add a scanline-opacity variable used by the scanline overlay. Add 0.35s color transitions globally. Add light mode overrides keeping the terminal always dark. Add a theme toggle emoji button in the menubar between the sound icon and clock. In JavaScript add cycleTheme and applyTheme functions, load saved theme from localStorage on startup, call applyTheme immediately on load. In the admin theme section add five clickable preset cards at the top showing color swatches, keep existing color pickers and CSS textarea below them. Add Toggle Theme to the right-click context menu.

CHANGE 2 — CONTACT ICONS
Add a SOCIAL_ICONS object in JavaScript before USER config containing inline SVG strings for these platforms — email, phone, github, linkedin, location, instagram, facebook, twitter, youtube, google, whatsapp, discord, telegram, tiktok, snapchat, pinterest, reddit, medium, behance, dribbble, stackoverflow, leetcode, hashnode, devto. Each SVG is 24x24 viewbox, self-contained, no external dependencies. Add a getSocialIcon helper that matches a label string to a key in SOCIAL_ICONS. Update renderContact to resolve icons from SOCIAL_ICONS keys, raw SVG strings, or emoji fallback. Update the admin contact link modal to show a grid of all platform SVG tiles as an icon picker, storing only the key name, resolving to SVG at render time.

CHANGE 3 — PROFILE TAB
Remove the old left card column and three-dimensional card entirely from the profile panel HTML and all its CSS. Remove initProfileCardTilt function from JavaScript. Replace with a new layout having two sections stacked vertically. Top section is a hero banner with animated gradient mesh background, a circular avatar with double pulsing ring animation showing the emoji, name in large Syne 800 gradient text animated by the existing decryptText function, role below it also animated, and three chip badges showing location, university, and open to work status. Bottom section is a bento grid with three columns — a tall bio card spanning both rows in column one with a left accent border and decorative quote mark, a stats card in column two row one showing project count, skill count, and cert count each with an icon and count-up animation, and a contacts card in column three spanning both rows showing four contact links with brand SVG icons from SOCIAL_ICONS with a colored left border reveal on hover. Column two row two shows the available status pill and a contact me button. All bento cards have glassmorphism background, subtle border, and lift on hover. Keep all existing element IDs so renderAbout still populates them — ap-name-el, ap-role-el, ap-bio-el, ap-stats-el, ap-contacts-el.

CHANGE 4 — SKILLS TAB IN ABOUT
Replace the flat bar rows in the skills tab with a card grid identical in structure and behavior to the skill cards in the separate skills window. Group cards by category with a small uppercase category label and gradient line separator above each group. Each card has the tech logo SVG, skill name, percentage number, progress bar with shimmer, and proficiency level label. Attach the same border glow engine already used by the skills window — pointermove updates CSS variables sk-edge and sk-angle on each card driving the conic gradient border effect. Animate bars after the first paint using double requestAnimationFrame. Use the existing SK_CAT_CFG, SK_DEFAULT_CFG, SKILL_LOGOS, and profLabel from the skills window — no duplication. Reset the render guard in admApplyToPortfolio so admin changes reflect immediately.

CHANGE 5 — EDUCATION TAB
Add a USER.education array with three entries for KIIT, Capital Secondary School, and Bal Kalyan Vidhya Mandir, each having degree, school, year, cgpa, location, logo (empty string), and initials fields. Update loadUSER to merge saved education data. Replace hardcoded education HTML with an empty div rendered by a new renderAboutEducation function called when the education tab activates. Each education card gets a horizontal strip at the top containing a 46x46 logo square — showing an uploaded image if logo is set, otherwise showing the initials in Syne bold as fallback — next to the degree title, school name, and year badge. Below the strip shows CGPA and location badges. The timeline line becomes an animated dashed line with a small glowing dot traveling from top to bottom in a loop. The timeline dot beside each card pulses on hover. Add a new Education section in the admin sidebar. The admin education page shows the three entries with image upload and URL paste inputs per entry using the same pattern as project thumbnails, with a live preview. Saving stores base64 or URL in USER.education and calls saveUSER and admApplyToPortfolio.

CHANGE 6 — CERTIFICATES TAB
Replace the certificate cards with a new two-column grid layout. Each card has a 160px preview area at the top — if src is set and isImage is true show the image with zoom on hover, a gradient overlay, and a verified badge; if src is set but isImage is false show a placeholder with the large cert icon and a pulsing click to preview CTA button; if no src show the icon and a no preview text. Below the preview area show the cert name in Syne bold, issuer with building emoji, tag pills, and a bottom row with date on the left and two buttons on the right — a preview button opening the existing certClick lightbox and an open button linking directly to the src in a new tab. Both buttons only appear when src is set. The card lifts and border glows on hover. Add ESC key listener to close the lightbox. The cert hint card at the bottom stays. Reset the render guard in admApplyToPortfolio.

CHANGE 7 — PROJECTS DASHBOARD
Replace all existing project card CSS and HTML rendering. New layout has a header bar with title and three stat chips showing total, shipped, and live counts. Below is a filter tab row showing All and each unique tag, styled like the skills window category tabs. Below is a scrollable grid of project cards sized at minimum 280px per column. Each card uses the BorderGlow engine — pointermove drives CSS variables bgc-edge and bgc-angle triggering a conic gradient border that glows in the project's accent color. The card top area is 190px tall — if a thumbnail is set show it as a cover image with zoom on hover and a dark gradient overlay; if no thumbnail show an animated gradient background using the project's three colors with the emoji floating on a bob animation and three small particle dots drifting. A status badge sits top-left. Project name, year, and highlight text sit at the bottom of the top area over the overlay. Below the top area show a three-line clamped description, tag pills, and an action row with a demo button and GitHub icon button. The project detail panel slides in from the right using transform translateX rather than display none — add and remove an open class to trigger the slide. The detail panel shows the thumbnail or iframe or emoji placeholder, full description, tech stack pills, and action buttons. In the admin project modal keep the existing thumbnail upload inputs working exactly as before — file upload converts to base64, URL paste updates a hidden field and shows a preview image. Reset all project render guards in admApplyToPortfolio.

ADMAPPLYTOPORTFOLIO RESET LIST
This function must clear dataset.rendered and innerHTML on — ap-certs-inner, ab-skills-bars, ab-marquee-track, contact-body, proj-grid, proj-header-stats, proj-filters, sk-tabs, ap-edu-panel-inner, sk-grid, notes-body — then re-render all currently open windows.