<div align="center">

# 🚀 PortfolioOS
### A Linux-Inspired Interactive Developer Portfolio

<img src="https://i.postimg.cc/vH1Hr8TD/Gemini-Generated-Image-nfqkzqnfqkzqnfqk.png" alt="PortfolioOS Banner" width="100%">

<br>
<br>
<br>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![LocalStorage](https://img.shields.io/badge/Storage-LocalStorage-orange?style=for-the-badge)
![Responsive](https://img.shields.io/badge/Responsive-Yes-success?style=for-the-badge)

<br>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-PortfolioOS-8A2BE2?style=for-the-badge)](https://www.abhishekbishwas.com.np/)
[![GitHub Repo](https://img.shields.io/badge/Source_Code-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/a-bishwas-2k/PortfolioOS.git)

</div>

---

<div align="center">

### 💬 Not just a portfolio — a fully working desktop OS in your browser.

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=800&color=A855F7&center=true&vCenter=true&width=650&lines=Draggable+%26+Resizable+Windows;A+Real+Scriptable+CLI+Terminal;macOS-Style+Animated+Dock;Bcrypt+%2B+Email+OTP+Admin+Security;Hangman+-+Bingo+-+TicTacToe+Arcade" alt="Typing SVG" />

</div>

---

## 🖥️ About

**PortfolioOS** started as "just show my projects" and got a little out of hand. It's a full-stack, browser-based **desktop operating system simulation** — complete with draggable windows, a live terminal you can actually type commands into, an animated dock with hover magnification physics, and an admin control panel locked behind enterprise-grade **two-factor authentication**.

Explore it like you'd explore a real desktop. Open apps. Run `sudo`. Play a game. Try to break it. 😉

---

## ✨ Features

<table align="center">
<tr>
<td width="50%" align="center">

### 🐧 Desktop OS Engine
- Draggable & resizable windows (`react-rnd`)
- Z-index focus stacking
- Mac-style traffic light controls
- Right-click glassmorphism context menu
- Instant wallpaper & theme switching

</td>
<td width="50%" align="center">

### 🐳 Animated Dock
- Hover magnification physics (Framer Motion)
- Live app status indicators
- Minimize / restore on click
- 60fps fluid animations

</td>
</tr>
<tr>
<td width="50%" align="center">

### 💻 Terminal CLI Engine
- Custom command interpreter
- `matrix` → full-screen digital rain 🟢
- `sudo` → admin auth trigger
- `theme` → live CSS variable swap
- Educational Hangman, Bingo & TicTacToe (Minimax AI)

</td>
<td width="50%" align="center">

### 🔐 Security Center
- 10-round salted **Bcrypt** PIN hashing
- **Double Authentication**: PIN + Email OTP
- IP-based rate limiting & auto-lockout
- Session token isolation
- CSP, XSS & clickjacking defense headers

</td>
</tr>
</table>

### 📱 Fully Responsive
Optimized across desktop, tablet, and mobile — the OS experience adapts without losing its identity.

### 🎨 Design System
- 5 built-in color presets (Cyberpunk Neon, Dracula Violet, Retro OS & more)
- 5 typography presets (Inter, Fira Code, JetBrains Mono...)
- Live CSS variable injection — zero page reloads

---

## 🧠 Terminal Guide

The portfolio includes a fully interactive, command-driven terminal.

### Available Commands

| Command | Description |
|:---:|:---:|
| `help` | Display all available commands |
| `about` | Render developer bio in styled terminal text |
| `skills` | List categorized technical competencies |
| `projects` | Display interactive project links & summaries |
| `hangman [topic]` | Launch educational Hangman (SQL, Java, Python...) |
| `bingo` | Launch turn-based Bingo vs AI Bot |
| `matrix` | Trigger full-screen green digital rain 🟢 |
| `theme` | List & switch OS color presets live |
| `sudo` | Prompt admin authentication (PIN + OTP) |
| `clear` | Purge terminal scroll history |

### Example

```bash
portfolio@abhishek:~$ help

Available Commands:
  about       → developer bio
  skills      → technical skills
  projects    → project showcase
  hangman     → educational word game
  bingo       → arcade game vs AI
  matrix      → 🟢 enter the matrix
  theme       → switch color presets
  sudo        → admin authentication
  clear       → clear terminal
```

---

## 🔐 Double Authentication Flow

Sensitive admin actions (PIN reset, email update, data wipe) require **two verified steps** before executing:

```
1️⃣  PIN Verification     →  Bcrypt.compare(pin, storedHash)
2️⃣  Email OTP Verification →  6-digit code, 10-min TTL, sent via Nodemailer
✅  Action Executed        →  Only after BOTH steps succeed
```

Failed attempts are rate-limited by IP — 10 strikes and you're locked out for 2 minutes. 🚫

---

## 🏗️ Tech Stack

<div align="center">

**Frontend**

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-433E38?style=for-the-badge&logo=react&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

**Backend**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Bcrypt](https://img.shields.io/badge/Bcrypt.js-338033?style=for-the-badge&logo=letsencrypt&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-22B573?style=for-the-badge&logo=gmail&logoColor=white)

</div>

<div align="center">

| Layer | Technology | Purpose |
|:---:|:---:|:---:|
| Frontend Core | React 19 | Component hierarchy & window state |
| Build Tool | Vite | HMR + optimized bundling |
| Styling | Tailwind CSS 4 | Utility-first, dynamic CSS variables |
| State Store | Zustand | Window layering, theming, auth state |
| Animations | Framer Motion | Dock magnification, window transitions |
| Layout | React-Rnd | Drag & resize windows |
| Backend | Node.js + Express 5 | REST API, security middleware |
| Database | MongoDB + Mongoose | Users, sessions, OTP tokens |
| Security | Bcrypt.js | 10-round salted PIN hashing |
| Email | Nodemailer | OTP dispatch via SMTP |

</div>

---

## 📂 Project Structure

```bash
PortfolioOS/
├── backend/
│   ├── models/          # User, Otp, Session (Mongoose schemas)
│   ├── services/        # Nodemailer SMTP service
│   └── server.js        # Express API + security middleware
│
├── frontend/
│   └── src/
│       ├── components/  # Desktop, Dock, Terminal, Admin, Windows
│       ├── store/       # Zustand global state
│       └── utils/       # Game engines & helpers
│
└── README.md
```

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/a-bishwas-2k/PortfolioOS.git
cd PortfolioOS

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Configure backend/.env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/portfolioos
ADMIN_PASSWORD=your_secure_admin_pin
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# 4. Run it
cd backend && npm start        # Terminal 1 — API on :5000
cd frontend && npm run dev     # Terminal 2 — App on :5173
```

Then open **http://localhost:5173** and try typing `matrix` in the terminal. 🟢

---

## 🗺️ Future Improvements

- [ ] Visitor Analytics Dashboard
- [ ] Blog System
- [ ] Real-time Notifications
- [ ] Multi-language Support
- [ ] More Arcade Games
- [ ] Public API for Portfolio Data

---

## 👨‍💻 Developer

<div align="center">

### Abhishek Bishwas
**Data Analyst • Full Stack Developer • CSE Graduate**

[![Email](https://img.shields.io/badge/Email-bishwasabhi9596%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:bishwasabhi9596@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-abhishek--9k96-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](http://www.linkedin.com/in/abhishek-9k96)

</div>

---

<div align="center">

### ⭐ If you like this project, don't forget to star the repository!

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%">

**Made with ❤️ and ☕ by Abhishek Bishwas**

</div>
