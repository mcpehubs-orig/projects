// ============= STATE MANAGEMENT =============
let gameState = {
  user: null,
  xp: parseInt(localStorage.getItem('codequest_xp')) || 0,
  level: parseInt(localStorage.getItem('codequest_level')) || 1,
  streak: parseInt(localStorage.getItem('codequest_streak')) || 0,
  completedTasks: parseInt(localStorage.getItem('codequest_tasks')) || 0,
  achievements: JSON.parse(localStorage.getItem('codequest_achievements')) || [],
  hintsLeft: 3,
  questsCompleted: JSON.parse(localStorage.getItem('codequest_quests')) || [],
  currentQuestionIndex: 0,
};

// ============= QUEST DATA =============
const questLevels = [
  {
    id: 1,
    category: 'JavaScript',
    difficulty: 'Beginner',
    title: 'Hello World - Your First Quest',
    question: 'Which statement outputs text to the console?',
    code: `// Which function logs text?
console.log('Hello World');`,
    options: ['console.log()', 'print()', 'write()', 'output()'],
    correct: 0,
    explanation: 'console.log() is the correct way to output text in JavaScript.',
    xp: 10,
  },
  {
    id: 2,
    category: 'JavaScript',
    difficulty: 'Beginner',
    title: 'Variables Basics',
    question: 'How do you declare a variable in JavaScript?',
    code: `const name = "CodeQuest";
let age = 25;
var city = "Earth";`,
    options: ['const/let/var', 'define', 'var only', 'declare'],
    correct: 0,
    explanation: 'Use const, let, or var to declare variables.',
    xp: 15,
  },
  {
    id: 3,
    category: 'JavaScript',
    difficulty: 'Beginner',
    title: 'Data Types Quiz',
    question: 'What is the type of [1, 2, 3]?',
    code: `const arr = [1, 2, 3];
typeof arr; // ?`,
    options: ['object', 'array', 'list', 'string'],
    correct: 0,
    explanation: 'Arrays are objects in JavaScript. typeof returns "object".',
    xp: 15,
  },
  {
    id: 4,
    category: 'Python',
    difficulty: 'Beginner',
    title: 'Python Print Function',
    question: 'What prints "Hello" in Python?',
    code: `# Python output
print("Hello")`,
    options: ['print()', 'console.log()', 'write()', 'output()'],
    correct: 0,
    explanation: 'Use print() function in Python to output text.',
    xp: 10,
  },
  {
    id: 5,
    category: 'JavaScript',
    difficulty: 'Intermediate',
    title: 'Arrow Functions',
    question: 'What does this arrow function do?',
    code: `const add = (a, b) => a + b;
add(2, 3); // ?`,
    options: ['Returns 5', 'Returns error', 'Returns undefined', 'Returns NaN'],
    correct: 0,
    explanation: 'Arrow functions return the expression implicitly. 2 + 3 = 5',
    xp: 25,
  },
];

const bookLibrary = [
  {
    id: 1,
    title: 'Задачи по программированию',
    author: 'С. С. ��брамян',
    category: 'C/C++',
    level: 'Beginner to Advanced',
    description: 'Классический сборник задач по программированию. Более 900 задач для развития навыков программирования.',
    pages: 800,
    year: 2021,
    pdf: 'abramiyan_zadachi.pdf',
    url: '#',
  },
  {
    id: 2,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Best Practices',
    level: 'Intermediate to Advanced',
    description: 'A Handbook of Agile Software Craftsmanship. Learn to write code that is readable, maintainable, and professional.',
    pages: 464,
    year: 2008,
    pdf: 'clean_code.pdf',
    url: '#',
  },
  {
    id: 3,
    title: 'You Don\'t Know JS',
    author: 'Kyle Simpson',
    category: 'JavaScript',
    level: 'Intermediate',
    description: 'Deep dive into JavaScript fundamentals, scope, closures, and async patterns.',
    pages: 1500,
    year: 2014,
    pdf: 'you_dont_know_js.pdf',
    url: '#',
  },
  {
    id: 4,
    title: 'Python Crash Course',
    author: 'Eric Matthes',
    category: 'Python',
    level: 'Beginner',
    description: 'Learn Python programming from scratch. Perfect for beginners with hands-on projects.',
    pages: 544,
    year: 2019,
    pdf: 'python_crash_course.pdf',
    url: '#',
  },
  {
    id: 5,
    title: 'Introduction to Algorithms',
    author: 'Cormen, Leiserson, Rivest, Stein',
    category: 'Algorithms',
    level: 'Advanced',
    description: 'The comprehensive guide to algorithms. Essential for competitive programming and interviews.',
    pages: 1292,
    year: 2009,
    pdf: 'introduction_to_algorithms.pdf',
    url: '#',
  },
  {
    id: 6,
    title: 'Design Patterns',
    author: 'Gang of Four',
    category: 'Software Design',
    level: 'Advanced',
    description: 'Elements of Reusable Object-Oriented Software. Master 23 essential design patterns.',
    pages: 395,
    year: 1994,
    pdf: 'design_patterns.pdf',
    url: '#',
  },
  {
    id: 7,
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    category: 'JavaScript',
    level: 'Beginner to Intermediate',
    description: 'A Modern Introduction to Programming. Learn JavaScript through interactive exercises.',
    pages: 472,
    year: 2018,
    pdf: 'eloquent_javascript.pdf',
    url: '#',
  },
  {
    id: 8,
    title: 'Learning SQL',
    author: 'Alan Beaulieu',
    category: 'Database',
    level: 'Beginner to Intermediate',
    description: 'Master SQL for data analysis and database management. Practical examples included.',
    pages: 320,
    year: 2020,
    pdf: 'learning_sql.pdf',
    url: '#',
  },
  {
    id: 9,
    title: 'Web Development with Node.js',
    author: 'Alexander Q. Whitaker',
    category: 'Web Development',
    level: 'Intermediate',
    description: 'Build scalable web applications with Node.js, Express, and modern JavaScript.',
    pages: 400,
    year: 2019,
    pdf: 'nodejs_web_dev.pdf',
    url: '#',
  },
  {
    id: 10,
    title: 'The Pragmatic Programmer',
    author: 'Dave Thomas, Andy Hunt',
    category: 'Programming Philosophy',
    level: 'All Levels',
    description: 'Your Journey to Mastery. Timeless tips and best practices for professional developers.',
    pages: 352,
    year: 2019,
    pdf: 'pragmatic_programmer.pdf',
    url: '#',
  },
  {
    id: 11,
    title: 'Code Complete',
    author: 'Steve McConnell',
    category: 'Software Construction',
    level: 'Intermediate to Advanced',
    description: 'A Practical Handbook of Software Construction. The definitive guide to writing better code.',
    pages: 960,
    year: 2004,
    pdf: 'code_complete.pdf',
    url: '#',
  },
];

const qaData = [
  {
    id: 1,
    question: 'What is the difference between let and const?',
    category: 'JavaScript',
    answers: [
      { text: 'const is block-scoped and cannot be reassigned. let is block-scoped but can be reassigned.', votes: 234 },
      { text: 'They are the same thing.', votes: 2 },
    ],
  },
  {
    id: 2,
    question: 'How does async/await work?',
    category: 'JavaScript',
    answers: [
      { text: 'async functions return a Promise. await pauses execution until the Promise resolves.', votes: 189 },
    ],
  },
  {
    id: 3,
    question: 'What are the SOLID principles?',
    category: 'Best Practices',
    answers: [
      { text: 'S-Single Responsibility, O-Open/Closed, L-Liskov Substitution, I-Interface Segregation, D-Dependency Inversion', votes: 156 },
    ],
  },
  {
    id: 4,
    question: 'How to optimize React performance?',
    category: 'React',
    answers: [
      { text: 'Use React.memo, useMemo, useCallback, and lazy loading.', votes: 128 },
    ],
  },
  {
    id: 5,
    question: 'Explain the event loop in JavaScript',
    category: 'JavaScript Advanced',
    answers: [
      { text: 'The event loop continuously checks the call stack and callback queue, executing callbacks when the stack is empty.', votes: 201 },
    ],
  },
];

// ============= UI UTILITIES =============
function switchPanel(panelId) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  
  document.getElementById(panelId).classList.add('active');
  document.querySelector(`a[href="#${panelId}"]`).classList.add('active');
}

function addXP(amount) {
  gameState.xp += amount;
  gameState.completedTasks++;
  const nextLevelXP = gameState.level * 100;
  
  if (gameState.xp >= nextLevelXP) {
    gameState.level++;
    showNotification(`🎉 Level Up! You are now Level ${gameState.level}!`);
  }
  
  saveGameState();
  updateStats();
}

function showNotification(message) {
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.textContent = message;
  notif.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 15px 20px; border-radius: 8px; z-index: 9999; animation: slideIn 0.3s ease-in-out;';
  document.body.appendChild(notif);
  
  setTimeout(() => notif.remove(), 3000);
}

function saveGameState() {
  localStorage.setItem('codequest_xp', gameState.xp);
  localStorage.setItem('codequest_level', gameState.level);
  localStorage.setItem('codequest_streak', gameState.streak);
  localStorage.setItem('codequest_tasks', gameState.completedTasks);
  localStorage.setItem('codequest_achievements', JSON.stringify(gameState.achievements));
  localStorage.setItem('codequest_quests', JSON.stringify(gameState.questsCompleted));
}

function updateStats() {
  document.getElementById('xp-value').textContent = gameState.xp;
  document.getElementById('level-value').textContent = `Level ${gameState.level}`;
  document.getElementById('streak-value').textContent = gameState.streak + ' days';
  document.getElementById('completed-value').textContent = gameState.completedTasks + ' tasks';
  
  const nextLevelXP = gameState.level * 100;
  const progress = (gameState.xp % 100) / (nextLevelXP / 100) * 100;
  document.getElementById('progress-bar').value = progress;
  document.getElementById('progress-label').textContent = Math.round(progress) + '% to next level';
}

// ============= QUESTS SYSTEM =============
function initQuestSystem() {
  const languages = [...new Set(questLevels.map(q => q.category))];
  const difficulties = [...new Set(questLevels.map(q => q.difficulty))];
  
  const langFilter = document.getElementById('language-filter');
  const diffFilter = document.getElementById('level-filter');
  
  languages.forEach(lang => {
    const opt = document.createElement('option');
    opt.value = lang;
    opt.textContent = lang;
    langFilter.appendChild(opt);
  });
  
  difficulties.forEach(diff => {
    const opt = document.createElement('option');
    opt.value = diff;
    opt.textContent = diff;
    diffFilter.appendChild(opt);
  });
  
  document.getElementById('next-question-btn').addEventListener('click', loadNextQuestion);
  document.getElementById('submit-answer-btn').addEventListener('click', submitAnswer);
  document.getElementById('use-hint-btn').addEventListener('click', useHint);
}

function loadNextQuestion() {
  if (questLevels.length === 0) return;
  
  gameState.currentQuestionIndex = Math.floor(Math.random() * questLevels.length);
  const q = questLevels[gameState.currentQuestionIndex];
  
  document.getElementById('question-meta').textContent = `${q.category} • ${q.difficulty} • +${q.xp} XP`;
  document.getElementById('question-title').textContent = q.question;
  document.getElementById('question-code').textContent = q.code;
  
  const optContainer = document.getElementById('options-container');
  optContainer.innerHTML = '';
  
  q.options.forEach((opt, idx) => {
    const label = document.createElement('label');
    label.className = 'option-label';
    label.innerHTML = `<input type="radio" name="answer" value="${idx}" /> ${opt}`;
    optContainer.appendChild(label);
  });
  
  document.getElementById('hint-box').classList.add('hidden');
  document.getElementById('answer-feedback').innerHTML = '';
}

function submitAnswer() {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) {
    alert('Select an answer first!');
    return;
  }
  
  const q = questLevels[gameState.currentQuestionIndex];
  const isCorrect = parseInt(selected.value) === q.correct;
  
  const feedback = document.getElementById('answer-feedback');
  feedback.innerHTML = `
    <div class="feedback-box ${isCorrect ? 'correct' : 'incorrect'}">
      <strong>${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</strong>
      <p>${q.explanation}</p>
      ${isCorrect ? `<p>+${q.xp} XP earned!</p>` : ''}
    </div>
  `;
  
  if (isCorrect) {
    addXP(q.xp);
    gameState.questsCompleted.push(q.id);
  }
}

function useHint() {
  if (gameState.hintsLeft <= 0) {
    alert('No hints left today!');
    return;
  }
  
  const q = questLevels[gameState.currentQuestionIndex];
  const hintBox = document.getElementById('hint-box');
  hintBox.classList.remove('hidden');
  hintBox.innerHTML = `<strong>💡 Hint:</strong> The correct answer is option: "${q.options[q.correct]}"`;
  gameState.hintsLeft--;
}

// ============= BOOKS LIBRARY =============
function initBooksLibrary() {
  const grid = document.getElementById('books-grid');
  grid.innerHTML = '';
  
  bookLibrary.forEach(book => {
    const card = document.createElement('div');
    card.className = 'resource-card book-card';
    card.innerHTML = `
      <div class="book-cover">
        <h4>${book.title}</h4>
      </div>
      <div class="book-info">
        <p class="author">${book.author}</p>
        <p class="meta">${book.category} • ${book.level}</p>
        <p class="description">${book.description}</p>
        <div class="book-stats">
          <span>${book.pages} pages</span>
          <span>${book.year}</span>
        </div>
        <button class="btn btn-primary download-btn" onclick="downloadBook('${book.pdf}')">
          📥 Download PDF
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function downloadBook(filename) {
  showNotification(`📚 ${filename} ready to download (simulated)`);
}

// ============= Q&A SECTION =============
function initQASection() {
  const grid = document.getElementById('qa-grid');
  if (!grid) {
    const panel = document.createElement('section');
    panel.id = 'qa';
    panel.className = 'panel';
    panel.innerHTML = `
      <header class="panel-header">
        <h2>Q&A - Knowledge Hub</h2>
        <p>Ask and answer programming questions from the community.</p>
      </header>
      <div class="qa-container">
        <div class="qa-controls">
          <input type="text" id="qa-search" placeholder="Search questions..." class="search-input">
          <select id="qa-filter" class="category-filter">
            <option value="">All Categories</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="React">React</option>
            <option value="Best Practices">Best Practices</option>
          </select>
        </div>
        <div id="qa-grid" class="qa-grid"></div>
      </div>
    `;
    document.querySelector('main.content').appendChild(panel);
  }
  
  const qaGrid = document.getElementById('qa-grid');
  qaGrid.innerHTML = '';
  
  qaData.forEach(qa => {
    const card = document.createElement('div');
    card.className = 'qa-card';
    card.innerHTML = `
      <h3>${qa.question}</h3>
      <p class="qa-category">${qa.category}</p>
      <div class="qa-answers">
        ${qa.answers.map(ans => `
          <div class="qa-answer">
            <p>${ans.text}</p>
            <button class="btn btn-small">👍 ${ans.votes}</button>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-secondary add-answer">Add Answer</button>
    `;
    qaGrid.appendChild(card);
  });
}

// ============= CODE EDITOR =============
function initCodeEditor() {
  document.getElementById('run-code-btn').addEventListener('click', () => {
    const code = document.getElementById('code-editor').value;
    try {
      const output = [];
      const originalLog = console.log;
      console.log = (...args) => output.push(args.join(' '));
      
      eval(code);
      
      console.log = originalLog;
      document.getElementById('code-output').textContent = output.join('\n') || 'No output';
    } catch (e) {
      document.getElementById('code-output').textContent = '❌ Error: ' + e.message;
    }
  });
  
  document.getElementById('clear-code-btn').addEventListener('click', () => {
    document.getElementById('code-editor').value = '';
    document.getElementById('code-output').textContent = '';
  });
}

// ============= GUIDES LIBRARY =============
function initGuidesLibrary() {
  const guides = [
    { title: 'JavaScript Fundamentals', level: 'Beginner', duration: '3 hours' },
    { title: 'ES6+ Features Deep Dive', level: 'Intermediate', duration: '5 hours' },
    { title: 'Async Programming Mastery', level: 'Advanced', duration: '4 hours' },
    { title: 'DOM Manipulation & Events', level: 'Beginner', duration: '2.5 hours' },
    { title: 'React Hooks & State Management', level: 'Intermediate', duration: '6 hours' },
    { title: 'Performance Optimization', level: 'Advanced', duration: '4 hours' },
  ];
  
  const grid = document.getElementById('guides-grid');
  grid.innerHTML = '';
  
  guides.forEach(guide => {
    const card = document.createElement('div');
    card.className = 'resource-card';
    card.innerHTML = `
      <h3>${guide.title}</h3>
      <p class="meta">${guide.level} • ${guide.duration}</p>
      <button class="btn btn-primary">Start Learning</button>
    `;
    grid.appendChild(card);
  });
}

// ============= INITIALIZATION =============
document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  initQuestSystem();
  initBooksLibrary();
  initCodeEditor();
  initGuidesLibrary();
  
  // Add Q&A to nav
  const navLink = document.createElement('a');
  navLink.href = '#qa';
  navLink.className = 'nav-link';
  navLink.textContent = 'Q&A';
  navLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchPanel('qa');
    initQASection();
  });
  document.querySelector('.nav').appendChild(navLink);
  
  // Navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const panelId = link.getAttribute('href').substring(1);
      switchPanel(panelId);
    });
  });
  
  // Guest mode
  document.getElementById('guest-login-btn').addEventListener('click', () => {
    gameState.user = 'Guest Player';
    showNotification('Welcome to CodeQuest!');
  });
});
