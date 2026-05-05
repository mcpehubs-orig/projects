import { getLanguages, getLevels } from "./data/questions.js";
import {
  applyAchievements,
  computeLevel,
  computeMultiplier,
  getDailyChallenge,
  nextLevelProgress,
  pickQuestion,
  updateStreak
} from "./modules/game.js";
import { initFirebaseAuth } from "./modules/auth.js";
import { runJavaScript } from "./modules/editor.js";
import { getDefaultProfile, loadProfile, saveProfile } from "./modules/storage.js";
import { navPanels, paintFeedback, setMotivation } from "./modules/ui.js";

const profile = loadProfile();
updateStreak(profile);
profile.level = computeLevel(profile.xp);
saveProfile(profile);

let currentQuestion = null;
let authApi = null;
let cloudSyncTimeout = null;
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
  progressLabel: document.getElementById("progress-label")
};

function fillSelect(node, items) {
  node.innerHTML = `<option>All</option>${items.map((x) => `<option>${x}</option>`).join("")}`;
}

function persistProfile() {
  saveProfile(profile);
  if (profile.mode !== "firebase" || !authApi?.enabled || !profile.uid) return;
  clearTimeout(cloudSyncTimeout);
  cloudSyncTimeout = setTimeout(() => {
    authApi.saveCloudProfile(profile.uid, profile).catch(() => null);
  }, 250);
}

function renderProfile() {
  applyAchievements(profile);
  persistProfile();
  els.xp.textContent = String(profile.xp);
  els.level.textContent = profile.level;
  els.streak.textContent = `${profile.streak} days`;
  els.completed.textContent = `${profile.completedIds.length} tasks`;
  els.achievements.innerHTML = profile.achievements.length
    ? profile.achievements.map((a) => `<li>${a}</li>`).join("")
    : "<li>No achievements yet.</li>";

  els.profileUser.textContent = profile.name || "Guest";
  els.profileMode.textContent = profile.mode === "firebase" ? "Google account + cloud ready" : "Local guest profile";
  els.hintsLeft.textContent = String(profile.hintsLeft);
  const mult = computeMultiplier(profile.streak);
  els.multiplier.textContent = `x${mult}`;
  const progress = nextLevelProgress(profile.xp);
  els.progressBar.value = progress;
  els.progressLabel.textContent = `${progress}% to next level`;
}

function showQuestion(question) {
  if (!question) {
    els.questionTitle.textContent = "No matching question found.";
    return;
  }
  currentQuestion = question;
  els.questionMeta.textContent = `${question.language} • ${question.level} • ${question.type} • +${question.xp} XP`;
  els.questionTitle.textContent = question.title;
  els.questionCode.textContent = question.code;
  els.optionsContainer.innerHTML = question.options
    .map(
      (option) =>
        `<label class="option"><input type="radio" name="answer" value="${option}"/>${option}</label>`
    )
    .join("");
  paintFeedback(els.feedback, "", false);
  els.hintBox.classList.add("hidden");
  els.hintBox.textContent = "";
}

function loadRandomQuestion() {
  isDailyQuestion = false;
  const question = pickQuestion(
    els.languageFilter.value || "All",
    els.levelFilter.value || "All",
    []
  );
  showQuestion(question);
}

function onSubmitAnswer(isDaily = false) {
  if (!currentQuestion) return;
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) {
    paintFeedback(els.feedback, "Choose an option first.", false);
    return;
  }
  const correct = selected.value === currentQuestion.answer;
  if (correct) {
    const gainedXp = Math.round(currentQuestion.xp * computeMultiplier(profile.streak));
    profile.xp += gainedXp;
    if (!profile.completedIds.includes(currentQuestion.id)) {
      profile.completedIds.push(currentQuestion.id);
    }
    profile.level = computeLevel(profile.xp);
    if (isDaily) profile.dailyChallengeDoneAt = new Date().toISOString().slice(0, 10);
    setMotivation("Great job. Momentum is building.");
    paintFeedback(
      els.feedback,
      `Correct! +${gainedXp} XP. ${currentQuestion.explanation}`,
      true
    );
  } else {
    setMotivation("Wrong answers are data. Try again and keep streak alive.");
    paintFeedback(
      els.feedback,
      `Not quite. Correct answer: ${currentQuestion.answer}. ${currentQuestion.explanation}`,
      false
    );
  }
  renderProfile();
}

function setupDailyChallenge() {
  const daily = getDailyChallenge(profile);
  els.dailyTitle.textContent = `${daily.title} (${daily.language}, ${daily.level})`;
  document.getElementById("start-daily-btn").addEventListener("click", () => {
    isDailyQuestion = true;
    showQuestion(daily);
    const questLink = document.querySelector('a[href="#quest"]');
    questLink.click();
  });
}

function resetDailyHints() {
  const today = new Date().toISOString().slice(0, 10);
  if (profile.lastHintReset !== today) {
    profile.hintsLeft = 3;
    profile.lastHintReset = today;
  }
}

function setupEvents() {
  document.getElementById("next-question-btn").addEventListener("click", loadRandomQuestion);
  document.getElementById("submit-answer-btn").addEventListener("click", () => {
    onSubmitAnswer(isDailyQuestion);
    isDailyQuestion = false;
  });
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
    const code = document.getElementById("code-editor").value;
    document.getElementById("code-output").textContent = runJavaScript(code);
  });
  document.getElementById("clear-code-btn").addEventListener("click", () => {
    document.getElementById("code-editor").value = "";
    document.getElementById("code-output").textContent = "";
  });
}

async function setupAuth() {
  const googleBtn = document.getElementById("google-login-btn");
  const guestBtn = document.getElementById("guest-login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  authApi = await initFirebaseAuth(async (user) => {
    if (!user) return;
    profile.uid = user.uid;
    profile.name = user.displayName || "Google User";
    profile.mode = "firebase";
    const cloudData = await authApi.loadCloudProfile(user.uid);
    if (cloudData && cloudData.uid === user.uid) {
      Object.assign(profile, cloudData);
      profile.uid = user.uid;
      profile.mode = "firebase";
      profile.name = user.displayName || profile.name || "Google User";
    }
    guestBtn.classList.add("hidden");
    googleBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    renderProfile();
    persistProfile();
  });

  googleBtn.addEventListener("click", async () => {
    if (!authApi.enabled) {
      alert("Firebase config is missing. Edit src/js/firebase-config.example.js.");
      return;
    }
    await authApi.loginWithGoogle();
  });

  guestBtn.addEventListener("click", () => {
    profile.mode = "guest";
    profile.name = "Guest";
    renderProfile();
  });

  logoutBtn.addEventListener("click", async () => {
    await authApi.logout();
    Object.assign(profile, getDefaultProfile());
    saveProfile(profile);
    googleBtn.classList.remove("hidden");
    guestBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
    renderProfile();
  });
}

function init() {
  navPanels();
  fillSelect(els.languageFilter, getLanguages());
  fillSelect(els.levelFilter, getLevels());
  resetDailyHints();
  setupDailyChallenge();
  setupEvents();
  renderProfile();
  loadRandomQuestion();
}

init();
setupAuth();
