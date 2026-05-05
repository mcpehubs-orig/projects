const LEVELS = ["Beginner", "Junior", "Middle", "Advanced"];
const LANGUAGES = ["JavaScript", "Python", "C#", "Java", "C++"];
const TYPES = [
  "Predict output",
  "Fix bug",
  "Fill missing code",
  "Choose syntax",
  "Logic tracing"
];

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

const languageSnippets = {
  JavaScript: "console.log(arr.length);",
  Python: "print(len(arr))",
  "C#": "Console.WriteLine(arr.Length);",
  Java: "System.out.println(arr.length);",
  "C++": "std::cout << arr.size();"
};

export function getLanguages() {
  return LANGUAGES;
}

export function getLevels() {
  return LEVELS;
}

export function buildQuestionBank() {
  const questions = [];
  let id = 1;
  for (const level of LEVELS) {
    for (const language of LANGUAGES) {
      for (let i = 0; i < templatePool.length; i++) {
        const tpl = templatePool[i];
        questions.push({
          id: `q-${id++}`,
          level,
          language,
          type: tpl.type || TYPES[i % TYPES.length],
          title: `${tpl.title} (${language})`,
          code: `${tpl.code}\n\n// ${language} reference:\n${languageSnippets[language]}`,
          options: [...tpl.options],
          answer: tpl.answer,
          hint: tpl.hint,
          explanation: `${tpl.explanation} This challenge is adapted for ${language} at ${level} level.`,
          xp: 15 + LEVELS.indexOf(level) * 10
        });
      }
    }
  }
  return questions; // 4 * 5 * 5 = 100 tasks
}
