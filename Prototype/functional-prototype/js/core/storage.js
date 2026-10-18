export const STORAGE_KEYS = Object.freeze({
  progress: "borrowedEyes.challengeProgress.v1",
  team: "borrowedEyes.teamState.v1",
  openTeams: "borrowedEyes.openTeams.v1",
  blind: "borrowedEyes.blindState.v1",
  chat: "borrowedEyes.galleryChat.v1",
  submissions: "borrowedEyes.creatorSubmissions.v1",
  solo: "borrowedEyes.soloSession.v1",
  profile: "borrowedEyes.profile.v1",
  creatorDraft: "borrowedEyes.creatorDraft.v2",
  session: "borrowedEyes.demoSession.v1",
});

export function readJson(key, fallback) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    return saved ?? (typeof fallback === "function" ? fallback() : fallback);
  } catch {
    return typeof fallback === "function" ? fallback() : fallback;
  }
}

export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function removeJson(key) {
  try { localStorage.removeItem(key); return true; }
  catch (error) { console.error(error); return false; }
}

export function readArray(key) {
  const value = readJson(key, []);
  return Array.isArray(value) ? value : [];
}

export function readObject(key) {
  const value = readJson(key, {});
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
