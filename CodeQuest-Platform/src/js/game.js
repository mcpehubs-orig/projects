const LEVELS = ["Beginner", "Junior", "Middle", "Advanced"];
const LANGS = ["JavaScript", "Python", "C#", "Java", "C++"];
const TEMPLATES = [
  {
    type: "Predict output",
    title: "Loop sum",
    code: "let s = 0;\nfor (let i = 1; i <= 4; i++) s += i;\nconsole.log(s);",
    options: ["8", "9", "10", "11"],
    answer: "10",
    hint: "1+2+3+4",
    explanation: "The loop adds values from 1 to 4."
  },
  {
    type: "Fix bug",
    title: "Comparison bug",
    code: "if (score = 100) {\n console.log('Perfect');\n}",
    options: ["Use ==", "Use ===", "Use <=", "Use !=="],
    answer: "Use ===",
    hint: "Assignment vs comparison",
    explanation: "Use strict comparison instead of assignment in conditions."
  },
  {
    type: "Fill missing code",
    title: "Variable declaration",
    code: "___ total = price * qty;",
    options: ["let", "class", "switch", "return"],
    answer: "let",
    hint: "Create a variable",
    explanation: "Use let for mutable local variables."
  },
  {
    type: "Choose syntax",
    title: "Function syntax",
    code: "Create add(a,b) that returns sum.",
    options: [
      "function add(a, b) { return a + b; }",
      "def add(a, b): return a + b",
      "func add(a,b)=>a+b",
      "add := (a,b) => a+b"
    ],
    answer: "function add(a, b) { return a + b; }",
    hint: "JavaScript function declaration",
    explanation: "Only one option is valid JavaScript declaration syntax."
  }
];

const pathSkills = [
  { id: "n1", label: "JS Basics", level: "Beginner", lang: "JavaScript", unlockAt: 0 },
  { id: "n2", label: "Python Basics", level: "Beginner", lang: "Python", unlockAt: 40 },
  { id: "n3", label: "Bug Hunter", level: "Junior", lang: "JavaScript", unlockAt: 120 },
  { id: "n4", label: "Logic Tracing", level: "Junior", lang: "Java", unlockAt: 220 },
  { id: "n5", label: "Advanced Patterns", level: "Middle", lang: "C#", unlockAt: 360 },
  { id: "n6", label: "Algorithm Arena", level: "Advanced", lang: "C++", unlockAt: 520 }
];

const state = loadState();
let currentNode = null;
let currentQuestion = null;

function buildQuestion(node) {
  const t = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  return {
    ...t,
    xp: 20 + LEVELS.indexOf(node.level) * 12,
    title: `${t.title} (${node.lang})`,
    code: `${t.code}\n\n// ${node.lang} mission`,
    level: node.level,
    lang: node.lang
  };
}

function levelName(xp) {
  if (xp >= 550) return "Advanced";
  if (xp >= 340) return "Middle";
  if (xp >= 150) return "Junior";
  return "Beginner";
}

function loadState() {
  const raw = localStorage.getItem("codequest_game_v2");
  const base = { xp: 0, streak: 0, hints: 3, completed: [], lastDay: "" };
  if (!raw) return base;
  try { return { ...base, ...JSON.parse(raw) }; } catch { return base; }
}
function saveState() { localStorage.setItem("codequest_game_v2", JSON.stringify(state)); }

function today() { return new Date().toISOString().slice(0, 10); }
function resetDaily() {
  if (state.lastDay !== today()) {
    state.hints = 3;
    state.lastDay = today();
  }
}

function renderStats() {
  document.getElementById("xp").textContent = state.xp;
  document.getElementById("level").textContent = levelName(state.xp);
  document.getElementById("streak").textContent = state.streak;
  document.getElementById("hints").textContent = state.hints;
}

function renderPath() {
  const root = document.getElementById("path-map");
  root.innerHTML = pathSkills.map((node) => {
    const locked = state.xp < node.unlockAt;
    const done = state.completed.includes(node.id);
    const active = currentNode && currentNode.id === node.id;
    return `<button class="node ${locked ? "locked" : ""} ${done ? "done" : ""} ${active ? "active" : ""}" data-id="${node.id}">
      ${node.label} - ${node.level}
    </button>`;
  }).join("");

  root.querySelectorAll(".node").forEach((btn) => {
    btn.addEventListener("click", () => {
      const node = pathSkills.find((x) => x.id === btn.dataset.id);
      if (!node || state.xp < node.unlockAt) return;
      currentNode = node;
      currentQuestion = buildQuestion(node);
      showQuestion();
      renderPath();
    });
  });
}

function showQuestion() {
  if (!currentQuestion) return;
  document.getElementById("meta").textContent = `${currentQuestion.lang} • ${currentQuestion.level} • +${currentQuestion.xp} XP`;
  document.getElementById("title").textContent = currentQuestion.title;
  document.getElementById("code").textContent = currentQuestion.code;
  document.getElementById("options").innerHTML = currentQuestion.options
    .map((o) => `<label class="option"><input type="radio" name="a" value="${o}"/>${o}</label>`)
    .join("");
  paint("", "");
  hideHint();
}

function paint(msg, kind) {
  const fb = document.getElementById("feedback");
  fb.textContent = msg;
  fb.classList.remove("ok", "bad");
  if (kind) fb.classList.add(kind);
}
function hideHint() {
  const h = document.getElementById("hint-box");
  h.classList.add("hidden");
  h.textContent = "";
}

function submit() {
  if (!currentQuestion || !currentNode) return;
  const selected = document.querySelector('input[name="a"]:checked');
  if (!selected) return paint("Choose an answer first.", "bad");

  const ok = selected.value === currentQuestion.answer;
  if (ok) {
    state.xp += currentQuestion.xp;
    if (!state.completed.includes(currentNode.id)) state.completed.push(currentNode.id);
    state.streak += 1;
    paint(`Correct. +${currentQuestion.xp} XP. ${currentQuestion.explanation}`, "ok");
    document.getElementById("status-line").textContent = "Great momentum. Keep pushing your streak.";
  } else {
    state.streak = 0;
    paint(`Not correct. Answer: ${currentQuestion.answer}. ${currentQuestion.explanation}`, "bad");
    document.getElementById("status-line").textContent = "Keep going. Every wrong answer is feedback.";
  }
  saveState();
  renderStats();
  renderPath();
}

function useHint() {
  if (!currentQuestion) return;
  const box = document.getElementById("hint-box");
  if (state.hints <= 0) {
    box.textContent = "No hints left today.";
    box.classList.remove("hidden");
    return;
  }
  state.hints -= 1;
  box.textContent = currentQuestion.hint;
  box.classList.remove("hidden");
  saveState();
  renderStats();
}

function nextQuestion() {
  if (!currentNode) return;
  currentQuestion = buildQuestion(currentNode);
  showQuestion();
}

function runJS() {
  const code = document.getElementById("editor").value;
  const out = [];
  const fake = { log: (...args) => out.push(args.join(" ")) };
  try {
    new Function("console", `"use strict";\n${code}`)(fake);
    document.getElementById("output").textContent = out.join("\n") || "Executed with no output.";
  } catch (e) {
    document.getElementById("output").textContent = `Runtime error: ${e.message}`;
  }
}

resetDaily();
saveState();
renderStats();
renderPath();

const first = pathSkills.find((x) => state.xp >= x.unlockAt) || pathSkills[0];
currentNode = first;
currentQuestion = buildQuestion(first);
showQuestion();
renderPath();

document.getElementById("submit").addEventListener("click", submit);
document.getElementById("hint-btn").addEventListener("click", useHint);
document.getElementById("next").addEventListener("click", nextQuestion);
document.getElementById("run").addEventListener("click", runJS);
document.getElementById("clear").addEventListener("click", () => {
  document.getElementById("editor").value = "";
  document.getElementById("output").textContent = "";
});
