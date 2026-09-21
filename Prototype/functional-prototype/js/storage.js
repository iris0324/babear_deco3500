// =========================================================
// BORROWED EYES
// Storage Layer
// =========================================================
//
// Week 9:
// Small text-based prototype data uses localStorage.
//
// Important:
// Large uploaded images are NOT stored directly in
// localStorage. The UI can preview them during the session.
//
// Week 12:
// This layer can later be replaced with backend storage.
// =========================================================

const STORAGE_KEYS = {
  myViews: "borrowedEyes.myViews",
  contributions: "borrowedEyes.contributions",
};

// ---------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------

function readStorage(key) {
  try {
    const storedValue = localStorage.getItem(key);

    if (!storedValue) {
      return [];
    }

    const parsed = JSON.parse(storedValue);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Could not read ${key} from localStorage.`, error);

    return [];
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));

    return true;
  } catch (error) {
    console.error(`Could not save ${key} to localStorage.`, error);

    return false;
  }
}

// ---------------------------------------------------------
// My View
// ---------------------------------------------------------

export function getMyViews() {
  return readStorage(STORAGE_KEYS.myViews);
}

export function saveMyView({ experienceId, artworkId, text, extraText = "" }) {
  const myViews = getMyViews();

  const newMyView = {
    id: createLocalId("view"),

    experienceId,
    artworkId,

    text,
    extraText,

    createdAt: new Date().toISOString(),
  };

  myViews.push(newMyView);

  const saved = writeStorage(STORAGE_KEYS.myViews, myViews);

  return saved ? newMyView : null;
}

export function getLatestMyViewForExperience(experienceId) {
  const matchingViews = getMyViews().filter(
    (view) => view.experienceId === experienceId,
  );

  return matchingViews.at(-1) ?? null;
}

// ---------------------------------------------------------
// Contributions
// ---------------------------------------------------------

export function getContributions() {
  return readStorage(STORAGE_KEYS.contributions);
}

export function saveContribution({
  sourceExperienceId,
  sourceArtworkId,

  fragmentImageName = "",
  fullArtworkImageName = "",

  location = "",

  clue1 = "",
  clue2 = "",

  view = "",

  anonymous = true,
}) {
  const contributions = getContributions();

  const newContribution = {
    id: createLocalId("contribution"),

    sourceExperienceId,
    sourceArtworkId,

    fragmentImageName,
    fullArtworkImageName,

    location,

    clue1,
    clue2,

    view,

    anonymous,

    createdAt: new Date().toISOString(),
  };

  contributions.push(newContribution);

  const saved = writeStorage(STORAGE_KEYS.contributions, contributions);

  return saved ? newContribution : null;
}

// ---------------------------------------------------------
// Local prototype ID
// ---------------------------------------------------------

function createLocalId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}
