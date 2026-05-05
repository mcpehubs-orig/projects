(function () {
  const LEVELS = ["Beginner", "Junior", "Middle", "Advanced"];
  const LANGUAGES = ["JavaScript", "Python", "C#", "Java", "C++"];
  const templatePool = [
    {
      title: "Loop output",
      type: "Predict output",
      code: "let sum = 0;\nfor (let i = 1; i <= 3; i++) sum += i;\nconsole.log(sum);",
      options: ["3", "6", "7", "undefined"],
      answer: "6",
      hint: "The loop adds 1 + 2 + 3.",
      explanation: "The final sum is 6."
    },
    {
      title: "Fix strict comparison",
      type: "Fix bug",
      code: "if (value = 5) {\n  console.log('Equal');\n}",
      options: ["Use == instead of =", "Use === instead of =", "Remove if", "Set value to 0"],
      answer: "Use === instead of =",
      hint: "This is assignment vs comparison.",
      explanation: "Assignment sets a value, strict comparison checks equality."
    },
    {
      title: "Fill missing declaration",
      type: "Fill missing code",
      code: "___ total = price * count;",
      options: ["let", "function", "if", "class"],
      answer: "let",
      hint: "You need a variable declaration.",
      explanation: "A local variable uses let."
    },
    {
      title: "Correct function syntax",
      type: "Choose syntax",
      code: "Create function add(a, b) that returns sum.",
      options: [
        "function add(a, b) { return a + b; }",
        "func add(a, b) => a + b",
        "def add(a, b): return a + b",
        "add = function[a,b] {a+b}"
      ],
      answer: "function add(a, b) { return a + b; }",
      hint: "Standard JavaScript function syntax.",
      explanation: "The first option is valid JS function declaration."
    },
    {
      title: "Trace condition order",
      type: "Logic tracing",
      code: "let role = 'user';\nlet isAdmin = role === 'admin';\nconsole.log(isAdmin ? 'A' : 'U');",
      options: ["A", "U", "true", "false"],
      answer: "U",
      hint: "role is not admin.",
      explanation: "Condition is false, so ternary returns U."
    }
  ];

  const snippets = {
    JavaScript: "console.log(arr.length);",
    Python: "print(len(arr))",
    "C#": "Console.WriteLine(arr.Length);",
    Java: "System.out.println(arr.length);",
    "C++": "std::cout << arr.size();"
  };

  function buildQuestionBank() {
    const questions = [];
    let id = 1;
    for (const level of LEVELS) {
      for (const language of LANGUAGES) {
        for (const tpl of templatePool) {
          questions.push({
            id: `q-${id++}`,
            level,
            language,
            type: tpl.type,
            title: `${tpl.title} (${language})`,
            code: `${tpl.code}\n\n// ${language} reference:\n${snippets[language]}`,
            options: [...tpl.options],
            answer: tpl.answer,
            hint: tpl.hint,
            explanation: `${tpl.explanation} This challenge is adapted for ${language} at ${level} level.`,
            xp: 15 + LEVELS.indexOf(level) * 10
          });
        }
      }
    }
    return questions;
  }

  const QUESTION_BANK = buildQuestionBank();
  const STORAGE_KEY = "codequest_profile_v1";
  const GUIDES = [
    {
      title: "JavaScript Career Path",
      level: "Beginner to Middle",
      description:
        "Roadmap with syntax, async patterns, DOM engineering, and project delivery milestones.",
      tags: ["JavaScript", "Frontend", "Projects"]
    },
    {
      title: "Python Problem Solving Track",
      level: "Beginner to Advanced",
      description:
        "Data structures, algorithmic thinking, debugging patterns, and scripting workflow.",
      tags: ["Python", "Algorithms", "Automation"]
    },
    {
      title: "C# and .NET Foundations",
      level: "Junior to Middle",
      description:
        "Type system, API architecture, clean service boundaries, and production debugging strategy.",
      tags: ["C#", ".NET", "Backend"]
    },
    {
      title: "Java Engineering Track",
      level: "Junior to Advanced",
      description:
        "Object modeling, collections, architecture fundamentals, and interview-ready practice.",
      tags: ["Java", "OOP", "Backend"]
    }
  ];

  const BOOKS = [
    {
      title: "Eloquent JavaScript",
      author: "Marijn Haverbeke",
      description: "Strong fundamentals with modern JavaScript practices and exercises.",
      tags: ["JavaScript", "Core"]
    },
    {
      title: "Python Crash Course",
      author: "Eric Matthes",
      description: "Fast practical introduction with project-oriented examples.",
      tags: ["Python", "Beginner"]
    },
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      description: "Timeless principles for maintainable and readable codebases.",
      tags: ["Architecture", "Code Quality"]
    },
    {
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      description: "Advanced systems thinking for scalable production software.",
      tags: ["System Design", "Advanced"]
    }
  ];

  const ARTICLES = [
    {
      title: "How to Build a Consistent Coding Habit",
      category: "Productivity",
      description:
        "A realistic 30-day strategy with streak systems, daily loops, and anti-burnout patterns.",
      tags: ["Habits", "Learning"]
    },
    {
      title: "Debugging Playbook for Junior Developers",
      category: "Engineering",
      description:
        "Step-by-step method for reproducing bugs, isolating causes, and validating fixes safely.",
      tags: ["Debugging", "Workflow"]
    },
    {
      title: "Frontend Performance Basics",
      category: "Web",
      description:
        "Critical rendering path, asset strategy, and practical metrics to ship faster interfaces.",
      tags: ["Performance", "Frontend"]
    },
    {
      title: "Interview Prep: Explain Your Code Clearly",
      category: "Career",
      description:
        "Turn solution writing into communication skills that employers look for in interviews.",
      tags: ["Interviews", "Career"]
    }
  ];

  function getDefaultProfile() {
    return {
      uid: "guest",
      name: "Guest",
      mode: "guest",
      xp: 0,
      streak: 0,
      level: "Beginner",
      completedIds: [],
      achievements: [],
      hintsLeft: 3,
      lastActiveDate: "",
      dailyChallengeDoneAt: ""
    };
  }

  function loadProfile() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProfile();
    try {
      return { ...getDefaultProfile(), ...JSON.parse(raw) };
    } catch {
      return getDefaultProfile();
    }
  }

  function saveProfile(profile) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }

  function computeLevel(xp) {
    if (xp >= 1800) return "Advanced";
    if (xp >= 1000) return "Middle";
    if (xp >= 450) return "Junior";
    return "Beginner";
  }

  function nextLevelProgress(xp) {
    const steps = [
      { min: 0, max: 450 },
      { min: 450, max: 1000 },
      { min: 1000, max: 1800 },
      { min: 1800, max: 2600 }
    ];
    const step = steps.find((s) => xp >= s.min && xp < s.max) || steps[3];
    return Math.min(100, Math.round(((xp - step.min) / (step.max - step.min)) * 100));
  }

  function dateKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function updateStreak(profile) {
    const today = dateKey();
    if (!profile.lastActiveDate) {
      profile.streak = 1;
      profile.lastActiveDate = today;
      return;
    }
    const diff = Math.round((new Date(today) - new Date(profile.lastActiveDate)) / 86400000);
    if (diff === 1) profile.streak += 1;
    else if (diff > 1) profile.streak = 1;
    profile.lastActiveDate = today;
  }

  function computeMultiplier(streak) {
    if (streak >= 30) return 2;
    if (streak >= 14) return 1.5;
    if (streak >= 7) return 1.25;
    return 1;
  }

  function applyAchievements(profile) {
    const list = new Set(profile.achievements);
    if (profile.streak >= 7) list.add("7-day streak");
    if (profile.xp >= 500) list.add("500 XP reached");
    if (profile.xp >= 1200) list.add("Middle tier unlocked");
    if (profile.completedIds.length >= 25) list.add("25 quests completed");
    if (profile.completedIds.length >= 75) list.add("75 quests completed");
    profile.achievements = [...list];
  }

  function pickQuestion(language, level) {
    const pool = QUESTION_BANK.filter(
      (q) => (language === "All" || q.language === language) && (level === "All" || q.level === level)
    );
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function dailyQuestion(profile) {
    const key = dateKey().split("-").join("");
    const idx = Number(key) % QUESTION_BANK.length;
    const q = QUESTION_BANK[idx];
    return { ...q, isDone: profile.dailyChallengeDoneAt === dateKey() };
  }

  function runJavaScript(code) {
    const output = [];
    const fakeConsole = { log: (...args) => output.push(args.map(String).join(" ")) };
    try {
      new Function("console", `"use strict";\n${code}`)(fakeConsole);
      return output.join("\n") || "Executed successfully with no output.";
    } catch (error) {
      return `Runtime error: ${error.message}`;
    }
  }

  function navPanels() {
    const links = document.querySelectorAll(".nav-link");
    const panels = document.querySelectorAll(".panel");
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        links.forEach((x) => x.classList.remove("active"));
        link.classList.add("active");
        const id = link.getAttribute("href").slice(1);
        panels.forEach((p) => p.classList.toggle("active", p.id === id));
      });
    });

    const inline = document.querySelectorAll(".nav-link-inline");
    inline.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.getAttribute("href");
        const navTarget = document.querySelector(`.nav-link[href="${target}"]`);
        if (navTarget) navTarget.click();
      });
    });
  }

  const profile = loadProfile();
  updateStreak(profile);
  profile.level = computeLevel(profile.xp);
  saveProfile(profile);

  let currentQuestion = null;
  let isDailyQuestion = false;

  const els = {
    xp: document.getElementById("xp-value"),
    level: document.getElementById("level-value"),
    streak: document.getElementById("streak-value"),
    completed: document.getElementById("completed-value"),
    achievements: document.getElementById("achievements-list"),
    languageFilter: document.getElementById("language-filter"),
    levelFilter: document.getElementById("level-filter"),
    questionMeta: document.getElementById("question-meta"),
    questionTitle: document.getElementById("question-title"),
    questionCode: document.getElementById("question-code"),
    optionsContainer: document.getElementById("options-container"),
    feedback: document.getElementById("answer-feedback"),
    hintBox: document.getElementById("hint-box"),
    dailyTitle: document.getElementById("daily-challenge-title"),
    profileUser: document.getElementById("profile-user"),
    profileMode: document.getElementById("profile-mode"),
    hintsLeft: document.getElementById("hints-left"),
    multiplier: document.getElementById("xp-multiplier"),
    progressBar: document.getElementById("progress-bar"),
    progressLabel: document.getElementById("progress-label"),
    guidesGrid: document.getElementById("guides-grid"),
    booksGrid: document.getElementById("books-grid"),
    articlesGrid: document.getElementById("articles-grid")
  };

  function fillSelect(node, items) {
    node.innerHTML = `<option>All</option>${items.map((x) => `<option>${x}</option>`).join("")}`;
  }

  function renderProfile() {
    applyAchievements(profile);
    saveProfile(profile);
    els.xp.textContent = String(profile.xp);
    els.level.textContent = profile.level;
    els.streak.textContent = `${profile.streak} days`;
    els.completed.textContent = `${profile.completedIds.length} tasks`;
    els.achievements.innerHTML = profile.achievements.length
      ? profile.achievements.map((a) => `<li>${a}</li>`).join("")
      : "<li>No achievements yet.</li>";
    els.profileUser.textContent = profile.name || "Guest";
    els.profileMode.textContent =
      profile.mode === "firebase" ? "Google account + cloud ready" : "Local guest profile";
    els.hintsLeft.textContent = String(profile.hintsLeft);
    els.multiplier.textContent = `x${computeMultiplier(profile.streak)}`;
    const progress = nextLevelProgress(profile.xp);
    els.progressBar.value = progress;
    els.progressLabel.textContent = `${progress}% to next level`;
  }

  function paintFeedback(text, ok) {
    els.feedback.textContent = text;
    els.feedback.classList.remove("correct", "wrong");
    if (text) els.feedback.classList.add(ok ? "correct" : "wrong");
  }

  function showQuestion(q) {
    if (!q) return;
    currentQuestion = q;
    els.questionMeta.textContent = `${q.language} • ${q.level} • ${q.type} • +${q.xp} XP`;
    els.questionTitle.textContent = q.title;
    els.questionCode.textContent = q.code;
    els.optionsContainer.innerHTML = q.options
      .map((o) => `<label class="option"><input type="radio" name="answer" value="${o}" />${o}</label>`)
      .join("");
    paintFeedback("", false);
    els.hintBox.classList.add("hidden");
    els.hintBox.textContent = "";
  }

  function loadRandomQuestion() {
    isDailyQuestion = false;
    showQuestion(pickQuestion(els.languageFilter.value || "All", els.levelFilter.value || "All"));
  }

  function submitAnswer() {
    if (!currentQuestion) return;
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) return paintFeedback("Choose an option first.", false);
    const correct = selected.value === currentQuestion.answer;
    if (correct) {
      const gained = Math.round(currentQuestion.xp * computeMultiplier(profile.streak));
      profile.xp += gained;
      if (!profile.completedIds.includes(currentQuestion.id)) profile.completedIds.push(currentQuestion.id);
      profile.level = computeLevel(profile.xp);
      if (isDailyQuestion) profile.dailyChallengeDoneAt = dateKey();
      paintFeedback(`Correct! +${gained} XP. ${currentQuestion.explanation}`, true);
      document.getElementById("motivation-message").textContent = "Great job. Momentum is building.";
    } else {
      paintFeedback(`Not quite. Correct answer: ${currentQuestion.answer}. ${currentQuestion.explanation}`, false);
      document.getElementById("motivation-message").textContent =
        "Wrong answers are data. Try again and keep streak alive.";
    }
    isDailyQuestion = false;
    renderProfile();
  }

  function resetDailyHints() {
    if (profile.lastHintReset !== dateKey()) {
      profile.hintsLeft = 3;
      profile.lastHintReset = dateKey();
      saveProfile(profile);
    }
  }

  function setupAuthButtons() {
    const googleBtn = document.getElementById("google-login-btn");
    const guestBtn = document.getElementById("guest-login-btn");
    const logoutBtn = document.getElementById("logout-btn");

    if (googleBtn)
      googleBtn.addEventListener("click", () => {
        alert("Google login works after deploy on a real domain. file:// runs in guest mode.");
      });
    if (guestBtn)
      guestBtn.addEventListener("click", () => {
        profile.mode = "guest";
        profile.name = "Guest";
        renderProfile();
      });
    if (logoutBtn)
      logoutBtn.addEventListener("click", () => {
        Object.assign(profile, getDefaultProfile());
        saveProfile(profile);
        renderProfile();
      });
  }

  function renderResources(container, list, builder) {
    if (!container) return;
    container.innerHTML = list
      .map((item) => {
        const data = builder(item);
        return `<article class="card resource-card">
          <h3>${data.title}</h3>
          <p class="resource-meta">${data.meta}</p>
          <p>${data.description}</p>
          <div class="tag-list">${data.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
        </article>`;
      })
      .join("");
  }

  function init() {
    navPanels();
    fillSelect(els.languageFilter, LANGUAGES);
    fillSelect(els.levelFilter, LEVELS);
    resetDailyHints();
    const daily = dailyQuestion(profile);
    els.dailyTitle.textContent = `${daily.title} (${daily.language}, ${daily.level})`;
    document.getElementById("start-daily-btn").addEventListener("click", () => {
      isDailyQuestion = true;
      showQuestion(daily);
      document.querySelector('a[href="#quest"]').click();
    });
    const startJourneyBtn = document.getElementById("start-journey-btn");
    if (startJourneyBtn) {
      startJourneyBtn.addEventListener("click", () => {
        const questLink = document.querySelector('.nav-link[href="#quest"]');
        if (questLink) questLink.click();
      });
    }
    document.getElementById("next-question-btn").addEventListener("click", loadRandomQuestion);
    document.getElementById("submit-answer-btn").addEventListener("click", submitAnswer);
    document.getElementById("use-hint-btn").addEventListener("click", () => {
      if (!currentQuestion) return;
      if (profile.hintsLeft <= 0) {
        els.hintBox.classList.remove("hidden");
        els.hintBox.textContent = "No hints left today.";
        return;
      }
      profile.hintsLeft -= 1;
      els.hintBox.classList.remove("hidden");
      els.hintBox.textContent = currentQuestion.hint;
      renderProfile();
    });
    document.getElementById("run-code-btn").addEventListener("click", () => {
      document.getElementById("code-output").textContent = runJavaScript(
        document.getElementById("code-editor").value
      );
    });
    document.getElementById("clear-code-btn").addEventListener("click", () => {
      document.getElementById("code-editor").value = "";
      document.getElementById("code-output").textContent = "";
    });
    setupAuthButtons();
    renderResources(els.guidesGrid, GUIDES, (item) => ({
      title: item.title,
      meta: item.level,
      description: item.description,
      tags: item.tags
    }));
    renderResources(els.booksGrid, BOOKS, (item) => ({
      title: item.title,
      meta: `by ${item.author}`,
      description: item.description,
      tags: item.tags
    }));
    renderResources(els.articlesGrid, ARTICLES, (item) => ({
      title: item.title,
      meta: item.category,
      description: item.description,
      tags: item.tags
    }));
    renderProfile();
    loadRandomQuestion();
  }

  init();
})();
