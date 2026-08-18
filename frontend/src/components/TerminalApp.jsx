import React, { useState, useRef, useEffect, useCallback } from 'react';
import useStore from '../store/useStore';
import { formatFullDate } from '../utils/timeUtils';
import { replacePlaceholders, DEFAULT_TERMINAL_COMMANDS, getCommandOutput } from '../utils/terminalCommands';
import { initGame, getGameIntro, processGameInput } from '../utils/terminalGames';

const PROMPT = (user, activeGame) => {
  if (activeGame) {
    return `🎮 ${activeGame.name}:~$ `;
  }
  return `🐧 ${user?.name?.toLowerCase().replace(/\s+/g, '') || 'abhishek'}:~$ `;
};

const COMMAND_HELP = `
📋 SYSTEM COMMANDS:
  whoami         — display user profile details
  help           — show this help menu
  skills         — show skill breakdown & percentages
  projects       — list all portfolio projects
  certs          — list certifications & issuers
  education      — show education history & CGPA
  contact        — show contact info & social links
  theme [name]   — switch theme (dark|light|ocean|rose|forest)
  open [app]     — open app window (bento|projects|certs|terminal|admin)
  date           — current date & time
  ls             — list directory contents
  cat [file]     — display file contents (profile.json, skills.txt)
  pwd            — print working directory
  uname          — system kernel & OS info
  echo [text]    — print text to terminal
  history        — show command history
  clear          — clear terminal screen
  sudo admin     — open admin dashboard

🎮 INTERACTIVE MINI-GAMES:
  tictactoe (ttt) — ❌ ⭕ 3x3 Tic-Tac-Toe vs AI bot
  guess          — 🎯 number guessing game (1 - 100)
  rps            — 🪨 📄 ✂️ rock paper scissors championship
  typeracer      — ⌨️ ⚡ speed typing code challenge
  hangman [cat]  — 🔤 💀 tech hangman with hints & key points (cats: sql|java|python|db|cs)
  bingo          — 🎰 5x5 terminal bingo challenge

🎭 FUN & EMOJI COMMANDS:
  joke           — 🤣 random dev joke
  fortune        — 🔮 developer fortune cookie
  coffee         — ☕ virtual espresso & caffeine boost
  party          — 🎉 terminal party celebration
  cat            — 🐱 cute terminal ASCII cat
  hack           — 💻 Hollywood hacker sequence
  quote          — 💬 motivational tech quote
  weather        — 🌤️ developer ecosystem weather
  roast          — 🔥 lighthearted dev roast
  matrix         — 🟢 matrix green digital rain
  rock [choice]  — 🪨 quick rock paper scissors
  pizza          — 🍕 fresh hot dev pizza generator
  donut          — 🍩 Homer's classic dev donut
  magic          — 🪄 magic 8-ball tech oracle
  rocket         — 🚀 SpaceX style terminal launch
  alien          — 👽 intergalactic signal decoder
  beer           — 🍺 after-hours cold brew cheers
  doge           — 🐕 much wow! very terminal!
  boba           — 🧋 sweet tapioca boba tea
  music          — 🎵 terminal lofi chill beats
  ramen          — 🍜 piping hot dev ramen bowl
  arcade         — 🕹️ retro 8-bit arcade machine
  dice           — 🎲 dev RNG dice roll
  dino           — 🦖 Chrome offline T-Rex runner
  ghost          — 👻 spooky memory leak detector
  taco           — 🌮 Tuesday dev taco special
`;

const renderFormattedText = (text, defaultColor = 'inherit') => {
  if (typeof text !== 'string') return text;
  if (!text.includes('<')) return text;

  const regex = /(<(?:cut|red|green|accent|gold|cyan)>[\s\S]*?<\/(?:cut|red|green|accent|gold|cyan)>)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith('<cut>')) {
      const content = part.slice(5, -6);
      return (
        <span
          key={i}
          style={{
            color: '#F87171',
            textDecoration: 'line-through',
            textDecorationColor: '#EF4444',
            textDecorationThickness: '2px',
            fontWeight: 'bold',
          }}
        >
          {content}
        </span>
      );
    }
    if (part.startsWith('<red>')) {
      return <span key={i} style={{ color: '#F87171', fontWeight: 'bold' }}>{part.slice(5, -6)}</span>;
    }
    if (part.startsWith('<green>')) {
      return <span key={i} style={{ color: '#4ADE80', fontWeight: 'bold' }}>{part.slice(7, -8)}</span>;
    }
    if (part.startsWith('<gold>')) {
      return <span key={i} style={{ color: '#F59E0B', fontWeight: 'bold' }}>{part.slice(6, -7)}</span>;
    }
    if (part.startsWith('<cyan>')) {
      return <span key={i} style={{ color: '#38BDF8', fontWeight: 'bold' }}>{part.slice(6, -7)}</span>;
    }
    if (part.startsWith('<accent>')) {
      return <span key={i} style={{ color: 'var(--lavender)', fontWeight: 'bold' }}>{part.slice(8, -9)}</span>;
    }
    return part;
  });
};

const TerminalApp = () => {
  const { user, settings } = useStore();
  const [lines, setLines] = useState([
    { type: 'info', text: 'Type "help" to see available commands.' },
    { type: 'spacer' },
  ]);
  const [input, setInput] = useState('');
  const [historyList, setHistoryList] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);
  const [bannerText1, setBannerText1] = useState('');
  const [bannerText2, setBannerText2] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [activeGame, setActiveGame] = useState(null);

  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  const defaultCommands = Array.from(new Set([
    'whoami', 'help', 'ls', 'cat', 'clear', 'skills',
    'projects', 'certs', 'education', 'contact', 'theme',
    'open', 'date', 'echo', 'history', 'sudo', 'pwd', 'uname',
    'tictactoe', 'ttt', 'guess', 'numberguess', 'rps', 'typeracer', 'speedtype', 'hangman', 'bingo',
    'joke', 'fortune', 'coffee', 'party', 'cat', 'hack',
    'quote', 'weather', 'roast', 'matrix', 'rock',
    'pizza', 'donut', 'magic', 'rocket', 'alien', 'beer',
    'doge', 'boba', 'music', 'ramen', 'arcade', 'dice',
    'dino', 'ghost', 'taco',
    ...DEFAULT_TERMINAL_COMMANDS.map(c => c.cmd)
  ]));

  const customCmdNames = (user?.customCommands || [])
    .map(c => c && c.cmd ? String(c.cmd).trim() : '')
    .filter(Boolean);

  const commands = Array.from(new Set([...defaultCommands, ...customCmdNames]));

  // Scroll to bottom on new output
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines, isTyping]);

  // Keep input focused
  useEffect(() => {
    if (!isTyping) {
      inputRef.current?.focus();
    }
  }, [isTyping]);

  // Typewriter effect for welcome banner
  useEffect(() => {
    const fullText1 = 'PORTFOLIO OS — INTERACTIVE SHELL';
    const fullText2 = 'Type "help" for a list of available commands & interactive games.';
    let currentIdx1 = 0;
    let currentIdx2 = 0;

    const timer1 = setInterval(() => {
      if (currentIdx1 < fullText1.length) {
        setBannerText1(fullText1.slice(0, currentIdx1 + 1));
        currentIdx1++;
      } else {
        clearInterval(timer1);
        const timer2 = setInterval(() => {
          if (currentIdx2 < fullText2.length) {
            setBannerText2(fullText2.slice(0, currentIdx2 + 1));
            currentIdx2++;
          } else {
            clearInterval(timer2);
            setIsTyping(false);
          }
        }, 20);
      }
    }, 25);

    return () => {
      clearInterval(timer1);
    };
  }, []);

  const addLine = (text, type = 'output') =>
    setLines(prev => [...prev, { type, text }]);

  const processCommand = useCallback((cmdStr) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setHistoryList(prev => [trimmed, ...prev.filter(h => h !== trimmed)]);
    setHistIdx(-1);

    addLine(trimmed, 'input');

    // If an interactive game is currently active, delegate input handling to terminalGames engine
    if (activeGame) {
      const { outputLines, nextState } = processGameInput(trimmed, activeGame);
      outputLines.forEach(line => {
        if (line.startsWith('⚠️') || line.startsWith('💀')) addLine(line, 'error');
        else if (line.startsWith('🎉') || line.startsWith('🌟') || line.startsWith('🏆') || line.startsWith('🏁') || line.startsWith('🎮') || line.startsWith('🎰')) addLine(line, 'accent');
        else addLine(line, 'output');
      });
      setActiveGame(nextState);
      return;
    }

    const parts = trimmed.split(/\s+/);
    const base = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Interactive Game trigger commands
    if (['tictactoe', 'ttt', 'guess', 'numberguess', 'rps', 'typeracer', 'speedtype', 'hangman', 'bingo'].includes(base)) {
      const newGameState = initGame(base, args);
      if (newGameState) {
        const introLines = getGameIntro(newGameState);
        introLines.forEach(line => addLine(line, 'accent'));
        setActiveGame(newGameState);
        return;
      }
    }

    // Check custom user commands first (takes precedence)
    const customCmd = (user?.customCommands || []).find(c => {
      if (!c || !c.cmd) return false;
      const cStr = String(c.cmd).toLowerCase().trim();
      return cStr === trimmed.toLowerCase() || cStr === base;
    });

    if (customCmd) {
      const outputLines = replacePlaceholders(String(customCmd.output || ''), user).split('\n');
      outputLines.forEach(line => {
        addLine(line || ' ', 'output');
      });
      return;
    }

    switch (base) {
      case 'help':
        addLine(COMMAND_HELP);
        break;

      case 'whoami':
        addLine(`Name:     ${user?.name || 'Abhishek'}`);
        addLine(`Role:     ${user?.role || 'Full-Stack Engineer'}`);
        addLine(`Email:    ${user?.email || 'admin@portfolio.os'}`);
        addLine(`Location: ${user?.location || 'India'}`);
        break;

      case 'ls':
        addLine('drwxr-xr-x  projects/     certificates/  resume/');
        addLine('-rw-r--r--  profile.json  skills.txt     gitlog.txt');
        break;

      case 'cat':
        if (args[0] === 'profile.json' || args[0] === 'profile') {
          addLine(JSON.stringify({ name: user?.name, role: user?.role, email: user?.email }, null, 2));
        } else if (args[0] === 'skills.txt') {
          Object.entries(user?.skills || {}).forEach(([catName, skillItems]) => {
            addLine(`[${catName}]`, 'accent');
            skillItems.forEach(([n, l]) =>
              addLine(`  ${n.padEnd(20)} ${'█'.repeat(Math.round(l / 10))} ${l}%`)
            );
            addLine('');
          });
        } else if (args[0] === undefined) {
          addLine('   /\\_/\\  ', 'accent');
          addLine('  ( o.o )  Meow! 🐾 Welcome to Abhishek\'s Terminal!');
          addLine('   > ^ <   "Feed me clean code and GitHub stars! ⭐"');
        } else {
          addLine(`cat: ${args[0] || '(no file)'}: No such file or directory`, 'error');
        }
        break;

      case 'skills':
        Object.entries(user?.skills || {}).forEach(([catName, skillItems]) => {
          addLine(`[${catName}]`, 'accent');
          skillItems.forEach(([name, level]) =>
            addLine(`  ${name.padEnd(20)} ${'▓'.repeat(Math.round(level / 10))}${'░'.repeat(10 - Math.round(level / 10))} ${level}%`)
          );
        });
        break;

      case 'projects':
        (user?.projects || []).forEach((p, i) =>
          addLine(`${String(i + 1).padStart(2, '0')}. ${p.name.padEnd(30)} ${p.tags?.slice(0, 3).join(', ')}`, 'output')
        );
        break;

      case 'certs':
        (user?.certificates || []).forEach((c, i) =>
          addLine(`${String(i + 1).padStart(2, '0')}. ${c.name.padEnd(40)} — ${c.issuer}`)
        );
        break;

      case 'education':
        (user?.education || []).forEach(e => {
          addLine(`${e.degree} — ${e.school} (${e.year})`);
          if (e.cgpa) addLine(`     CGPA: ${e.cgpa}`, 'accent');
        });
        break;

      case 'contact':
        addLine(`Email:    ${user?.email}`);
        addLine(`Phone:    ${user?.phone}`);
        addLine(`Location: ${user?.location}`);
        Object.entries(user?.links || {}).forEach(([k, v]) =>
          v && v !== '#' && addLine(`${k}:`.padEnd(10) + v)
        );
        break;

      case 'theme':
        if (args[0] && ['dark', 'light', 'ocean', 'rose', 'forest'].includes(args[0])) {
          document.documentElement.setAttribute('data-theme', args[0]);
          addLine(`Theme changed to: ${args[0]}`, 'accent');
        } else {
          addLine('Available themes: dark | light | ocean | rose | forest');
          addLine('Usage: theme <name>');
        }
        break;

      case 'open':
        if (args[0]) {
          window.dispatchEvent(new CustomEvent('open-app', { detail: args[0] }));
          addLine(`Opening ${args[0]}...`, 'accent');
        } else {
          addLine('Usage: open <appname>');
          addLine('Apps: bento | projects | certificates | resume | terminal');
        }
        break;

      case 'date':
        addLine(formatFullDate(new Date(), settings));
        break;

      case 'echo':
        addLine(args.join(' ') || '');
        break;

      case 'pwd':
        addLine(`/home/${user?.name?.toLowerCase().replace(/\s+/g, '') || 'user'}`);
        break;

      case 'uname':
        addLine('PortfolioOS v2.0.0 React x86_64 Chromium/Node.js');
        break;

      case 'history':
        historyList.forEach((h, i) => addLine(`${String(i + 1).padStart(4, ' ')}  ${h}`));
        break;

      case 'clear':
        setLines([{ type: 'info', text: 'Terminal cleared. Type "help" for commands.' }, { type: 'spacer' }]);
        return;

      case 'joke':
        addLine('🤣 DEV JOKE OF THE DAY:', 'accent');
        addLine('Why do programmers prefer dark mode?');
        addLine('Because light attracts bugs! 🐛✨');
        addLine(' ');
        addLine('Code hard, bug soft! 💻🔥', 'info');
        break;

      case 'fortune':
        addLine('🔮 YOUR DEVELOPER FORTUNE:', 'accent');
        addLine('"A git commit a day keeps the production bugs away!" 🚀');
        addLine('✨ Lucky Stack: React + Vite + Tailwind + Framer Motion');
        addLine('🍀 Lucky Number: 404');
        break;

      case 'coffee':
        addLine('  (  )   (   )  )', 'accent');
        addLine(' (  ) )  (  (  (');
        addLine('______  _______');
        addLine('|      |/       | ☕');
        addLine('|  C8H10N4O2   |');
        addLine('|  ESPRESSO    |');
        addLine('|______________|\n[ CAFFEINE LEVEL: 99.9% ⚡ ]', 'accent');
        addLine('Status: Code machine refueled! Ready to deploy. 🚀');
        break;

      case 'party':
        addLine('🎉 🥳 🎈 PARTY TIME AT PORTFOLIO OS! 🎈 🥳 🎉', 'accent');
        addLine('└─► 👯‍♂️ 🕺 💃 🕺 💃 🕺 💃 👯‍♀️ ◄─┘');
        addLine('✨ High FPS Animations, Smooth Transitions & Good Vibes! ✨');
        addLine('🎊 Keep coding and celebrating! 🎊', 'info');
        break;

      case 'hack':
        addLine('💻 INITIATING HOLLYWOOD HACK SEQUENCE...', 'error');
        addLine('[████████████████████] 100% COMPLETE 🔓', 'accent');
        addLine('----------------------------------------');
        addLine('ACCESS GRANTED: Mainframe Bypass Active 🟢', 'accent');
        addLine('Target: Cyber-space Portfolio 🪐');
        addLine('System Status: Supercharged & Secure 🛡️');
        break;

      case 'quote':
        addLine('💬 INSPIRING TECH QUOTE:', 'accent');
        addLine('"First, solve the problem. Then, write the code." — John Johnson 💡');
        addLine('"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra ⚡');
        break;

      case 'weather':
        addLine('🌤️ DEVELOPER ECOSYSTEM WEATHER:', 'accent');
        addLine('----------------------------------');
        addLine('Location: Full-Stack Cloud ☁️');
        addLine('Temperature: 100% Hot Reloading 🔥');
        addLine('Wind: 15 knots of Fast API Requests 💨');
        addLine('Forecast: 99.9% Uptime with clear skies! ☀️');
        break;

      case 'roast':
        addLine('🔥 DEV ROAST:', 'error');
        addLine('You have 47 browser tabs open right now, and 42 of them are Stack Overflow. 😉');
        addLine('Don\'t worry, PortfolioOS handles it like a champ! 💻⚡', 'accent');
        break;

      case 'matrix':
        addLine('🟢 MATRIX DIGITAL RAIN:', 'accent');
        addLine('01000001 01000010 01001000 01001001 01010011 01001000 01000101 01001011', 'info');
        addLine('░▒▓█ ⚡ REACT ⚡ VITE ⚡ MONGODB ⚡ TAILWIND ⚡ FRAMER MOTION █▓▒░', 'accent');
        addLine('Wake up, Neo... PortfolioOS has you. 🕶️');
        break;

      case 'rock':
        {
          const userChoice = args[0] ? args[0].toLowerCase() : 'scissors';
          const aiChoice = '🪨 Rock';
          addLine('🪨 📄 ✂️ ROCK PAPER SCISSORS:', 'accent');
          addLine(`You played: ${userChoice === 'rock' ? '🪨 Rock' : userChoice === 'paper' ? '📄 Paper' : '✂️ Scissors'}`);
          addLine(`PortfolioOS played: ${aiChoice}`);
          addLine('Result: PortfolioOS wins! 🤖 (Type "rps" to play interactive mode!)', 'info');
        }
        break;

      case 'pizza':
        addLine('   // \\', 'accent');
        addLine('  //   \\    🍕 FRESH HOT DEV PIZZA!');
        addLine(' //  ●  \\   Extra Cheese & Pepperoni Slices!');
        addLine('//  ●  ● \\  Fueling late-night coding sessions... 🧀');
        addLine('//_________\\');
        addLine('[ PIZZA SLICES LEFT: 8/8 🍕 ]', 'info');
        break;

      case 'donut':
        addLine('   .---.    🍩 HOMER\'S DEV DONUT!', 'accent');
        addLine('  /  o  \\   Mmm... Sprinkle-covered Code Donut!');
        addLine(' |  ( )  |  Sweet, sugary, zero-bug energy! ✨');
        addLine('  \\  o  /');
        addLine('   `---\'');
        break;

      case 'magic':
        {
          const answers = [
            '🔮 "Outlooks look cloudy... Tests suggest: NO!" 🛑',
            '🔮 "Signs point to YES! Deploy with confidence!" 🚀',
            '🔮 "Reply hazy, ask again after coffee." ☕',
            '🔮 "Cannot predict now... clear browser cache." 🧹',
            '🔮 "Without a doubt, 100% bug-free!" ✨'
          ];
          const chosen = answers[Math.floor(Math.random() * answers.length)];
          addLine('🪄 MAGIC 8-BALL ORACLE:', 'accent');
          addLine('--------------------------');
          addLine(`Question: ${args.join(' ') || 'Should I push to production?'}`);
          addLine(`Answer: ${chosen}`, 'info');
        }
        break;

      case 'rocket':
        addLine('🚀 SPACEX TERMINAL LAUNCH SEQUENCE:', 'accent');
        addLine('T-minus 3... 2... 1... 💥 IGNITION!', 'error');
        addLine('   /\\');
        addLine('  /  \\    🚀 PORTFOLIO OS IS LIFTOFF!');
        addLine(' |    |   Destination: The Moon 🌕');
        addLine(' | OS |   Speed: Mach 10 Speed & 60FPS!');
        addLine(' /|    |\\');
        addLine('/ |====| \\');
        addLine('  (::::)', 'info');
        break;

      case 'alien':
        addLine('👽 INTERGALACTIC SIGNAL DECODED:', 'accent');
        addLine('-----------------------------------');
        addLine('🛸 "Greetings, Earthling Developer! We come in peace."');
        addLine('🌌 "We detected high concentrations of clean code in this sector."', 'info');
        break;

      case 'beer':
        addLine('🍺 AFTER-HOURS COLD BREW:', 'accent');
        addLine('   .~~~~~~~~.');
        addLine('  (  PROD   )');
        addLine('  |  DEPLOY | 🍺');
        addLine('  |  SUCCESS|');
        addLine('  \\________/');
        addLine('Cheers to 0 unresolved production bugs! 🥂✨', 'info');
        break;

      case 'doge':
        addLine('🐕 MUCH WOW! VERY TERMINAL!', 'accent');
        addLine('-----------------------------');
        addLine('Such React! ⚛️');
        addLine('Very Vite! ⚡');
        addLine('Much Animating! 🌌');
        addLine('So Portfolio! 💼');
        addLine('WOW! 🚀', 'info');
        break;

      case 'boba':
        addLine('🧋 TAIPEI BOBA TEA REFRESH:', 'accent');
        addLine('  (====)');
        addLine(' |      | 🧋 Brown Sugar Milk Tea');
        addLine(' | o o  |    With chewy tapioca pearls!');
        addLine(' |o o o |');
        addLine(' \\______/');
        addLine('Sweetness 100% | Ice 50% | Happiness 1000% 💖', 'info');
        break;

      case 'music':
        addLine('🎵 TERMINAL LOFI BEATS:', 'accent');
        addLine('---------------------------');
        addLine('▶ ⏸ ⏹ 🔊 [====================] 100%');
        addLine('Now Playing: 🎧 Lofi Chill Beats to Code/Relax To ☕');
        addLine('Track: "Late Night Syntax & Synthwave Sunset" 🌅', 'info');
        break;

      case 'ramen':
        addLine('🍜 TOKYO DEV RAMEN BOWL:', 'accent');
        addLine('   (  ♨️  ♨️  )');
        addLine('  |~~~~~~~~~~|');
        addLine('  | 🍥 🥚 🥩  |  Rich Tonkotsu Broth & Fresh Scallions!');
        addLine('  \\__________/');
        addLine(`Status: Delicious noodles ready for ${user?.name || 'you'}! 🥢`, 'info');
        break;

      case 'arcade':
        addLine('🕹️ RETRO 8-BIT ARCADE CABINET:', 'accent');
        addLine(' _________________');
        addLine('|  PORTFOLIO OS  |');
        addLine('|  HIGH SCORE:   |');
        addLine(`|  ${(user?.name || 'DEV').toUpperCase().padEnd(10)} 999990 |`);
        addLine('|________________|');
        addLine('|   O    O   O   |');
        addLine('|  [X]  [Y] [Z]  |');
        addLine('|________________|');
        addLine('INSERT COIN TO CONTINUE 🪙', 'info');
        break;

      case 'dice':
        addLine('🎲 DEV RNG DICE ROLL:', 'accent');
        addLine('┌───────┐');
        addLine('│ █   █ │');
        addLine('│   █   │  You rolled a 5!');
        addLine('│ █   █ │  Critical hit on your code review! 💥');
        addLine('└───────┘', 'info');
        break;

      case 'dino':
        addLine('🦖 CHROME OFFLINE T-REX RUNNER:', 'accent');
        addLine('             🦖');
        addLine('    🌵   🌵     🌵   🌵');
        addLine('===============================');
        addLine('Score: 4040 pts! Jump over syntax errors! 🎮', 'info');
        break;

      case 'ghost':
        addLine('👻 SPOOKY TERMINAL GHOST:', 'accent');
        addLine('    .-.');
        addLine('   (o.o)');
        addLine('   |=|/   "Boo! I checked memory leaks!"');
        addLine(`  || ||   "Result: 0 ghosts found in ${user?.name || 'your'}'s code!" ✨`, 'info');
        break;

      case 'taco':
        addLine('🌮 DEV TACO TUESDAY:', 'accent');
        addLine('  __/\`\\__  Crispy Shell, Spicy Guacamole & Jalapeños!');
        addLine(' (  🌮  ) Loaded with extra fullstack flavor!');
        addLine('  \\____/', 'info');
        break;

      case 'sudo':
        if (args[0] === 'admin') {
          addLine('Launching Admin Dashboard...', 'accent');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-app', { detail: 'admin' }));
          }, 300);
        } else {
          addLine(`[sudo] password for ${user?.name?.toLowerCase().replace(/\s+/g, '') || 'user'}:`, 'error');
          setTimeout(() => addLine('Permission denied. Hint: try "sudo admin"', 'error'), 400);
        }
        break;

      default: {
        const fallbackOutput = getCommandOutput(base, user, user?.customCommands);
        if (fallbackOutput) {
          fallbackOutput.split('\n').forEach(line => addLine(line || ' ', 'output'));
        } else {
          addLine(`${base}: command not found. Type "help" for commands.`, 'error');
        }
        break;
      }
    }
  }, [user, historyList, settings, activeGame]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      processCommand(input);
      setInput('');
      setSuggestions([]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, historyList.length - 1);
      setHistIdx(idx);
      setInput(historyList[idx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? '' : historyList[idx]);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const matches = commands.filter(c => c.startsWith(input));
      if (matches.length === 1) {
        setInput(matches[0] + ' ');
        setSuggestions([]);
      } else if (matches.length > 1) {
        setSuggestions(matches);
      }
    }
  };

  const termSettings = user?.terminalSettings || {};
  const tFontSize = termSettings.fontSize ? `${termSettings.fontSize}px` : 'var(--fs-sm)';
  const tFontColor = termSettings.fontColor || '#9B84CC';
  const tFontStyle = termSettings.fontStyle || 'JetBrains Mono, monospace';

  return (
    <div
      className="terminal-body"
      style={{ height: '100%', overflow: 'auto', padding: '16px 20px', cursor: 'text' }}
      onClick={() => { if (!isTyping) inputRef.current?.focus(); }}
    >
      {/* Typewriter Banner */}
      <div style={{
        marginBottom: '24px',
        marginTop: '16px',
        fontFamily: tFontStyle,
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <style>
          {`
            @keyframes terminal-blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
          `}
        </style>
        <div style={{ fontWeight: 'bold', color: 'var(--violet)', fontSize: 'var(--fs-base)', minHeight: '1.5em', textAlign: 'center' }}>
          {bannerText1}
        </div>
        <div style={{ fontWeight: 'bold', color: 'var(--lavender)', fontSize: 'var(--fs-lg)', minHeight: '1.5em', letterSpacing: '2px', textAlign: 'center' }}>
          {bannerText2}{isTyping && <span style={{ animation: 'terminal-blink 1s step-end infinite' }}>_</span>}
        </div>
      </div>

      {/* Output lines */}
      {!isTyping && lines.map((line, idx) => (
        <div
          key={idx}
          style={{
            fontFamily: tFontStyle,
            fontSize: tFontSize,
            lineHeight: '1.65',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            minHeight: line.type === 'spacer' ? '8px' : undefined,
          }}
        >
          {line.type === 'input' && (
            <span>
              <span style={{ color: '#4ADE80' }}>{PROMPT(user, activeGame)}</span>
              <span style={{ color: '#E2D9F3' }}>{line.text}</span>
            </span>
          )}
          {line.type === 'error' && <span style={{ color: '#F87171' }}>{renderFormattedText(line.text, '#F87171')}</span>}
          {line.type === 'accent' && <span style={{ color: 'var(--lavender)' }}>{renderFormattedText(line.text, 'var(--lavender)')}</span>}
          {line.type === 'output' && <span style={{ color: tFontColor }}>{renderFormattedText(line.text, tFontColor)}</span>}
          {line.type === 'info' && <span style={{ color: '#64748B' }}>{renderFormattedText(line.text, '#64748B')}</span>}
        </div>
      ))}

      {/* Autocomplete suggestions (inline, above the prompt) */}
      {!isTyping && suggestions.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '4px 0' }}>
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => { setInput(s + ' '); setSuggestions([]); inputRef.current?.focus(); }}
              style={{
                padding: '2px 8px',
                background: 'rgba(124,58,237,0.12)',
                border: '1px solid rgba(124,58,237,0.25)',
                borderRadius: '4px',
                color: 'var(--lavender)',
                fontSize: tFontSize,
                fontFamily: tFontStyle,
                cursor: 'pointer',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Inline prompt input — lives in the document flow */}
      {!isTyping && (
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
          <span style={{
            color: '#4ADE80',
            fontFamily: tFontStyle,
            fontSize: tFontSize,
            flexShrink: 0,
            userSelect: 'none',
          }}>
            {PROMPT(user, activeGame)}
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => { setInput(e.target.value); setSuggestions([]); }}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#E2D9F3',
              fontFamily: tFontStyle,
              fontSize: tFontSize,
              caretColor: '#A78BFA',
            }}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
          />
        </div>
      )}

      {/* Invisible anchor to scroll to */}
      <div ref={bottomRef} style={{ height: '4px' }} />
    </div>
  );
};

export default TerminalApp;
