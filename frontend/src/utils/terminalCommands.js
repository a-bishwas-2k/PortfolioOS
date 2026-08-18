export const replacePlaceholders = (text, user) => {
  if (!text) return '';
  return String(text)
    .replace(/\{name\}/gi, user?.name || 'Abhishek')
    .replace(/\{role\}/gi, user?.role || 'Full-Stack Engineer')
    .replace(/\{email\}/gi, user?.email || 'admin@portfolio.os')
    .replace(/\{location\}/gi, user?.location || 'India')
    .replace(/\{phone\}/gi, user?.phone || 'N/A')
    .replace(/\{github\}/gi, user?.links?.github || user?.links?.GitHub || 'https://github.com');
};

export const DEFAULT_TERMINAL_COMMANDS = [
  {
    cmd: 'whoami',
    category: 'System',
    description: 'Display user profile details',
    defaultOutput: 'Name:     {name}\nRole:     {role}\nEmail:    {email}\nLocation: {location}\nGitHub:   {github}'
  },
  {
    cmd: 'contact',
    category: 'System',
    description: 'Show contact info & social links',
    defaultOutput: 'Email:    {email}\nPhone:    {phone}\nLocation: {location}\nGitHub:   {github}'
  },
  {
    cmd: 'skills',
    category: 'System',
    description: 'Show skill breakdown & percentages',
    defaultOutput: '⚡ TECHNICAL SKILLS:\n- Frontend: React, Vite, Tailwind CSS, Framer Motion\n- Backend: Node.js, Express, MongoDB, REST APIs\n- Tools & OS: Git, Linux, Docker, VS Code'
  },
  {
    cmd: 'projects',
    category: 'System',
    description: 'List all portfolio projects',
    defaultOutput: '📁 PORTFOLIO PROJECTS:\n1. React PortfolioOS — Cyberpunk Desktop Operating System\n2. Admin Dashboard — Real-time MongoDB & State Sync\n3. Fullstack Web Suite — High Performance React Apps'
  },
  {
    cmd: 'certs',
    category: 'System',
    description: 'List certifications & issuers',
    defaultOutput: '🏆 CERTIFICATIONS:\n- AWS Certified Developer — Associate\n- Meta Front-End Developer Professional Certificate\n- Fullstack Web Development Specialization'
  },
  {
    cmd: 'education',
    category: 'System',
    description: 'Show education history & CGPA',
    defaultOutput: '🎓 EDUCATION:\n- Bachelor of Technology in Computer Science\n- CGPA: 9.2 / 10.0\n- High School (Senior Secondary): 95%'
  },
  {
    cmd: 'ls',
    category: 'System',
    description: 'List directory contents',
    defaultOutput: 'drwxr-xr-x  projects/     certificates/  resume/\n-rw-r--r--  profile.json  skills.txt     gitlog.txt'
  },
  {
    cmd: 'pwd',
    category: 'System',
    description: 'Print working directory',
    defaultOutput: '/home/{name}'
  },
  {
    cmd: 'uname',
    category: 'System',
    description: 'System kernel & OS info',
    defaultOutput: 'PortfolioOS v2.0.0 React x86_64 Chromium/Node.js'
  },
  {
    cmd: 'pizza',
    category: 'Fun & Emoji',
    description: 'Fresh hot dev pizza generator',
    defaultOutput: '   // \\\n  //   \\    🍕 FRESH HOT DEV PIZZA!\n //  ●  \\   Extra Cheese & Pepperoni Slices!\n//  ●  ● \\  Fueling {name}\'s late-night coding sessions... 🧀\n//_________\\\n[ PIZZA SLICES LEFT: 8/8 🍕 ]'
  },
  {
    cmd: 'coffee',
    category: 'Fun & Emoji',
    description: 'Virtual espresso & caffeine boost',
    defaultOutput: '  (  )   (   )  )\n (  ) )  (  (  (\n______  _______\n|      |/       | ☕\n|  C8H10N4O2   |\n|  ESPRESSO    |\n|______________|\n[ CAFFEINE LEVEL: 99.9% ⚡ ]\nStatus: {name}\'s code machine refueled! Ready to deploy. 🚀'
  },
  {
    cmd: 'music',
    category: 'Fun & Emoji',
    description: 'Terminal lofi chill beats',
    defaultOutput: '🎵 TERMINAL LOFI BEATS:\n---------------------------\n▶ ⏸ ⏹ 🔊 [====================] 100%\nNow Playing: 🎧 Lofi Chill Beats to Code/Relax To ☕\nTrack: "Late Night Syntax & Synthwave Sunset" 🌅'
  },
  {
    cmd: 'magic',
    category: 'Fun & Emoji',
    description: 'Magic 8-ball tech oracle',
    defaultOutput: '🪄 MAGIC 8-BALL ORACLE:\n--------------------------\nQuestion: Will {name}\'s build pass tests?\nAnswer: 🔮 "Signs point to YES! Deploy with confidence!" 🚀'
  },
  {
    cmd: 'rocket',
    category: 'Fun & Emoji',
    description: 'SpaceX style terminal launch',
    defaultOutput: '🚀 SPACEX TERMINAL LAUNCH SEQUENCE:\nT-minus 3... 2... 1... 💥 IGNITION!\n   /\\\n  /  \\    🚀 PORTFOLIO OS IS LIFTOFF!\n |    |   Destination: The Moon 🌕\n | OS |   Pilot: {name}\n /|    |\\\n/ |====| \\\n  (::::)'
  },
  {
    cmd: 'alien',
    category: 'Fun & Emoji',
    description: 'Intergalactic signal decoder',
    defaultOutput: '👽 INTERGALACTIC SIGNAL DECODED:\n-----------------------------------\n🛸 "Greetings, Earthling Developer {name}! We come in peace."\n🌌 "We detected high concentrations of clean code in this sector."'
  },
  {
    cmd: 'beer',
    category: 'Fun & Emoji',
    description: 'After-hours cold brew cheers',
    defaultOutput: '🍺 AFTER-HOURS COLD BREW:\n   .~~~~~~~~.\n  (  PROD   )\n  |  DEPLOY | 🍺\n  |  SUCCESS|\n  \\________/\nCheers to {name} for 0 unresolved production bugs! 🥂✨'
  },
  {
    cmd: 'doge',
    category: 'Fun & Emoji',
    description: 'Much wow! Very terminal!',
    defaultOutput: '🐕 MUCH WOW! VERY TERMINAL!\n-----------------------------\nSuch React! ⚛️\nVery Vite! ⚡\nMuch Animating! 🌌\nSo Portfolio! 💼\nWOW {name}! 🚀'
  },
  {
    cmd: 'boba',
    category: 'Fun & Emoji',
    description: 'Sweet tapioca boba tea',
    defaultOutput: '🧋 TAIPEI BOBA TEA REFRESH:\n  (====)\n |      | 🧋 Brown Sugar Milk Tea\n | o o  |    With chewy tapioca pearls!\n |o o o |\n \\______/\nSweetness 100% | Ice 50% | Fuel for {name}! 💖'
  },
  {
    cmd: 'donut',
    category: 'Fun & Emoji',
    description: 'Homer\'s classic dev donut',
    defaultOutput: '   .---.    🍩 HOMER\'S DEV DONUT!\n  /  o  \\   Mmm... Sprinkle-covered Code Donut!\n |  ( )  |  Sweet, sugary, zero-bug energy for {name}! ✨\n  \\  o  /\n   `---\''
  },
  {
    cmd: 'ramen',
    category: 'Fun & Emoji',
    description: 'Piping hot dev ramen bowl',
    defaultOutput: '🍜 TOKYO DEV RAMEN BOWL:\n   (  ♨️  ♨️  )\n  |~~~~~~~~~~|\n  | 🍥 🥚 🥩  |  Rich Tonkotsu Broth & Fresh Scallions!\n  \\__________/\nStatus: Delicious noodles ready for {name}! 🥢'
  },
  {
    cmd: 'arcade',
    category: 'Fun & Emoji',
    description: 'Retro 8-bit arcade machine',
    defaultOutput: '🕹️ RETRO 8-BIT ARCADE CABINET:\n _________________\n|  PORTFOLIO OS  |\n|  HIGH SCORE:   |\n|  {name} 999990 |\n|________________|\n|   O    O   O   |\n|  [X]  [Y] [Z]  |\n|________________|\nINSERT COIN TO CONTINUE 🪙'
  },
  {
    cmd: 'dice',
    category: 'Fun & Emoji',
    description: 'Dev RNG dice roll',
    defaultOutput: '🎲 DICE ROLL RESULT:\n┌───────┐\n│ █   █ │\n│   █   │  You rolled a 5!\n│ █   █ │  Critical hit on your code review! 💥\n└───────┘'
  },
  {
    cmd: 'dino',
    category: 'Fun & Emoji',
    description: 'Chrome offline T-Rex runner',
    defaultOutput: 'REX CHROME OFFLINE T-REX RUNNER:\n             🦖\n    🌵   🌵     🌵   🌵\n===============================\nScore: 4040 pts! Jump over syntax errors! 🎮'
  },
  {
    cmd: 'ghost',
    category: 'Fun & Emoji',
    description: 'Spooky memory leak detector',
    defaultOutput: '👻 SPOOKY TERMINAL GHOST:\n    .-.\n   (o.o)\n   |=|/   "Boo! I checked memory leaks!"\n  || ||   "Result: 0 ghosts found in {name}\'s code!" ✨'
  },
  {
    cmd: 'taco',
    category: 'Fun & Emoji',
    description: 'Tuesday dev taco special',
    defaultOutput: '🌮 DEV TACO TUESDAY:\n  __/\`\\__  Crispy Shell, Spicy Guacamole & Jalapeños!\n (  🌮  ) Loaded with extra fullstack flavor for {name}!\n  \\____/'
  },
  {
    cmd: 'joke',
    category: 'Fun & Emoji',
    description: 'Random dev joke',
    defaultOutput: '🤣 DEV JOKE OF THE DAY:\nWhy do programmers prefer dark mode?\nBecause light attracts bugs! 🐛✨\n\nCode hard {name}, bug soft! 💻🔥'
  },
  {
    cmd: 'fortune',
    category: 'Fun & Emoji',
    description: 'Developer fortune cookie',
    defaultOutput: '🔮 YOUR DEVELOPER FORTUNE:\n"A git commit a day keeps the production bugs away!" 🚀\n✨ Lucky Stack: React + Vite + Tailwind + Framer Motion\n🍀 Lucky Developer: {name}'
  },
  {
    cmd: 'party',
    category: 'Fun & Emoji',
    description: 'Terminal party celebration',
    defaultOutput: '🎉 🥳 🎈 PARTY TIME AT PORTFOLIO OS! 🎈 🥳 🎉\n└─► 👯‍♂️ 🕺 💃 🕺 💃 🕺 💃 👯‍♀️ ◄─┘\n✨ High FPS Animations, Smooth Transitions & Good Vibes! ✨\n🎊 Keep coding {name}! 🎊'
  },
  {
    cmd: 'hack',
    category: 'Fun & Emoji',
    description: 'Hollywood hacker sequence',
    defaultOutput: '💻 INITIATING HOLLYWOOD HACK SEQUENCE...\n[████████████████████] 100% COMPLETE 🔓\n----------------------------------------\nACCESS GRANTED: Mainframe Bypass Active 🟢\nTarget: Cyber-space Portfolio 🪐\nSystem Status: Supercharged by {name} 🛡️'
  },
  {
    cmd: 'quote',
    category: 'Fun & Emoji',
    description: 'Motivational tech quote',
    defaultOutput: '💬 INSPIRING TECH QUOTE:\n"First, solve the problem. Then, write the code." — John Johnson 💡\n"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra ⚡'
  },
  {
    cmd: 'weather',
    category: 'Fun & Emoji',
    description: 'Developer ecosystem weather',
    defaultOutput: '🌤️ DEVELOPER ECOSYSTEM WEATHER:\n----------------------------------\nLocation: Full-Stack Cloud ☁️\nTemperature: 100% Hot Reloading 🔥\nWind: 15 knots of Fast API Requests 💨\nForecast: 99.9% Uptime with clear skies for {name}! ☀️'
  },
  {
    cmd: 'roast',
    category: 'Fun & Emoji',
    description: 'Lighthearted dev roast',
    defaultOutput: '🔥 DEV ROAST:\n{name}, you have 47 browser tabs open right now, and 42 of them are Stack Overflow. 😉\nDon\'t worry, PortfolioOS handles it like a champ! 💻⚡'
  },
  {
    cmd: 'matrix',
    category: 'Fun & Emoji',
    description: 'Matrix green digital rain',
    defaultOutput: '🟢 MATRIX DIGITAL RAIN:\n01000001 01000010 01001000 01001001 01010011 01001000 01000101 01001011\n░▒▓█ ⚡ REACT ⚡ VITE ⚡ MONGODB ⚡ TAILWIND ⚡ FRAMER MOTION █▓▒░\nWake up, {name}... PortfolioOS has you. 🕶️'
  },
  {
    cmd: 'cat',
    category: 'Fun & Emoji',
    description: 'Cyber kitty ASCII & meow',
    defaultOutput: ' /\\_/\\\n( o.o )\n > ^ <   🐾 CYBER KITTY IS MEOWING!\n"Purrr... {name}\'s code is clean and cute!" 🐱✨'
  },
  {
    cmd: 'rock',
    category: 'Fun & Emoji',
    description: 'Dev rockstar guitarist status',
    defaultOutput: '🎸 DEV ROCKSTAR STATUS:\n ⚡ (🎸) ⚡  SHREDDING SOLO ON THE KEYBOARD!\n{name} is rockin\' production with zero crash bugs! 🤘🔥'
  },
  {
    cmd: 'ninja',
    category: 'Fun & Emoji',
    description: 'Silent code ninja',
    defaultOutput: '🥷 SILENT CODE NINJA:\n  (🥷)\n-==[===>  Sneaking past bugs & refactoring quietly!\nShadow Operator: {name} ⚔️'
  },
  {
    cmd: 'dragon',
    category: 'Fun & Emoji',
    description: 'Cyber dragon fire breather',
    defaultOutput: '🐉 CYBER DRAGON FIRE BREATHER:\n     /\\_/\\\n    ( 🔥 🔥 )\n===<[  DRAGON FIRE!  ]>===\nSlaying legacy spaghetti code for {name}! 🐲🔥'
  },
  {
    cmd: 'cookie',
    category: 'Fun & Emoji',
    description: 'Warm chocolate chip cookie',
    defaultOutput: '🍪 CHOCOLATE CHIP DEV COOKIE:\n   .---.\n  ( 🍪  )\n   `---\'\nFreshly baked token cookie for {name}! Yum! 😋'
  },
  {
    cmd: 'whiskey',
    category: 'Fun & Emoji',
    description: 'Aged single malt on the rocks',
    defaultOutput: '🥃 AGED SINGLE MALT ON THE ROCKS:\n   |~~~~~|\n   | 🥃  |\n   |_____|\nSmooth sip after pushing features to master! Cheers {name}! 🥂'
  },
  {
    cmd: 'space',
    category: 'Fun & Emoji',
    description: 'Cosmic nebula star travel',
    defaultOutput: '🌌 COSMIC NEBULA TRAVEL:\n ✨   *  .  🌟  .  *   ✨\n🚀 Traversing hyperspace with {name} at lightspeed! 💫'
  },
  {
    cmd: 'synthwave',
    category: 'Fun & Emoji',
    description: '80s Cyberpunk synthwave sunset',
    defaultOutput: '🌅 SYNTHWAVE SUNSET 1984:\n  .---.   \n /  🌅  \\  [====================] 100% RETRO VIBES\n/________\\ Neon Grid Activated for {name}! 🌴🕶️'
  },
  {
    cmd: 'zen',
    category: 'Fun & Emoji',
    description: 'Mindful developer meditation',
    defaultOutput: '🧘 MINDFUL DEVELOPER MEDITATION:\n     🧘‍♂️\n  "Inhale peace, exhale bugs..."\n{name} is at 100% inner harmony with full test coverage. ☯️'
  }
];

export const getEffectiveCommands = (customCommandsList = []) => {
  const customMap = new Map();
  if (Array.isArray(customCommandsList)) {
    customCommandsList.forEach(item => {
      if (item && item.cmd) {
        customMap.set(item.cmd.toLowerCase().trim(), item);
      }
    });
  }

  const result = DEFAULT_TERMINAL_COMMANDS.map(def => {
    const key = def.cmd.toLowerCase().trim();
    if (customMap.has(key)) {
      const override = customMap.get(key);
      return {
        ...def,
        output: override.output ?? override.defaultOutput ?? def.defaultOutput,
        isCustomized: true
      };
    }
    return {
      ...def,
      output: def.defaultOutput,
      isCustomized: false
    };
  });

  // Include purely custom commands (not built-in)
  const defaultKeys = new Set(DEFAULT_TERMINAL_COMMANDS.map(d => d.cmd.toLowerCase().trim()));
  if (Array.isArray(customCommandsList)) {
    customCommandsList.forEach(c => {
      if (c && c.cmd) {
        const key = c.cmd.toLowerCase().trim();
        if (!defaultKeys.has(key)) {
          result.push({
            cmd: c.cmd,
            category: c.category || 'Custom',
            description: c.description || 'Custom user command',
            defaultOutput: c.output || '',
            output: c.output || '',
            isCustomized: true,
            isPureCustom: true
          });
        }
      }
    });
  }

  return result;
};

export const getCommandOutput = (cmdName, user, customCommandsList = []) => {
  const effectiveList = getEffectiveCommands(customCommandsList);
  const found = effectiveList.find(c => c.cmd.toLowerCase().trim() === cmdName.toLowerCase().trim());
  if (!found) return null;
  return replacePlaceholders(found.output, user);
};

