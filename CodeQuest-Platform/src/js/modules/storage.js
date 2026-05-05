const STORAGE_KEY = "codequest_profile_v1";

const defaultProfile = {
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

export function getDefaultProfile() {
  return structuredClone(defaultProfile);
}

export function loadProfile() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return getDefaultProfile();
  try {
    return { ...getDefaultProfile(), ...JSON.parse(raw) };
  } catch {
    return getDefaultProfile();
  }
}

export function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
