import { buildQuestionBank } from "../data/questions.js";

const QUESTION_BANK = buildQuestionBank();

function toDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function getQuestionBank() {
  return QUESTION_BANK;
}

export function computeLevel(xp) {
  if (xp >= 1800) return "Advanced";
  if (xp >= 1000) return "Middle";
  if (xp >= 450) return "Junior";
  return "Beginner";
}

export function nextLevelProgress(xp) {
  const steps = [
    { level: "Beginner", min: 0, max: 450 },
    { level: "Junior", min: 450, max: 1000 },
    { level: "Middle", min: 1000, max: 1800 },
    { level: "Advanced", min: 1800, max: 2600 }
  ];
  const step = steps.find((s) => xp >= s.min && xp < s.max) || steps[steps.length - 1];
  const value = Math.min(100, Math.round(((xp - step.min) / (step.max - step.min)) * 100));
  return value;
}

export function getDailyChallenge(profile) {
  const key = toDateKey();
  const seed = key.split("-").join("");
  const index = Number(seed) % QUESTION_BANK.length;
  const question = QUESTION_BANK[index];
  const done = profile.dailyChallengeDoneAt === key;
  return { ...question, isDone: done, key };
}

export function updateStreak(profile) {
  const today = toDateKey();
  if (!profile.lastActiveDate) {
    profile.streak = 1;
    profile.lastActiveDate = today;
    return profile;
  }
  const prev = new Date(profile.lastActiveDate);
  const now = new Date(today);
  const diff = Math.round((now - prev) / 86400000);
  if (diff === 1) profile.streak += 1;
  else if (diff > 1) profile.streak = 1;
  profile.lastActiveDate = today;
  return profile;
}

export function computeMultiplier(streak) {
  if (streak >= 30) return 2;
  if (streak >= 14) return 1.5;
  if (streak >= 7) return 1.25;
  return 1;
}

export function applyAchievements(profile) {
  const list = new Set(profile.achievements);
  if (profile.streak >= 7) list.add("7-day streak");
  if (profile.xp >= 500) list.add("500 XP reached");
  if (profile.xp >= 1200) list.add("Middle tier unlocked");
  if (profile.completedIds.length >= 25) list.add("25 quests completed");
  if (profile.completedIds.length >= 75) list.add("75 quests completed");
  profile.achievements = [...list];
}

export function pickQuestion(language, level, excludeIds = []) {
  const pool = QUESTION_BANK.filter(
    (q) =>
      (language === "All" || q.language === language) &&
      (level === "All" || q.level === level) &&
      !excludeIds.includes(q.id)
  );
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
