export function creatorStarsForRatio(ratio) {
  if (ratio >= 80 && ratio <= 100) return 1;
  if (ratio >= 60) return 2;
  if (ratio >= 40) return 3;
  if (ratio >= 20) return 4;
  if (ratio > 0) return 5;
  return 0;
}

export function freshCreatorDraft() {
  return { version: 3, step: 1, fragmentData: "", fullData: "", crop: null, stars: 0, ratio: 0, clueIndex: 0, details: { title: "", artist: "", year: "", comment: "", perspective: "", clues: [] }, editingSubmissionId: null, sourceSubmissionId: null, savedAt: null };
}

export function migrateCreatorDraft(saved) {
  if (!saved || typeof saved !== "object") return freshCreatorDraft();
  const fresh = freshCreatorDraft();
  const details = { ...fresh.details, ...(saved.details || {}) };
  if (Number(saved.version || 0) < 3 && Array.isArray(details.clues) && Number(saved.stars) > 0) {
    const legacy = details.clues.filter(Boolean), mapped = [];
    legacy.slice(0, Number(saved.stars)).forEach((clue, index) => { mapped[5 - Number(saved.stars) + index] = clue; });
    details.clues = mapped;
  }
  return { ...fresh, ...saved, version: 3, step: Math.min(6, Math.max(1, Number(saved.step) || 1)), details, crop: saved.crop && saved.crop.w > 0 && saved.crop.h > 0 ? saved.crop : null };
}

export function validateCreatorDraft(draft) {
  if (!draft.fullData || !draft.fragmentData) return "Add the complete artwork and select a valid detail.";
  if (!draft.crop || draft.crop.w * draft.crop.h <= 0 || !draft.stars) return "Mark a valid area on the complete artwork.";
  const details = draft.details || {}, requiredIndexes = [0, 1, 2, 3, 4].slice(5 - Number(draft.stars)), clues = requiredIndexes.map((index) => String(details.clues?.[index] || "").trim()).filter(Boolean);
  if (!String(details.title || "").trim() || !String(details.artist || "").trim()) return "Add the artwork title and artist without inventing unknown details.";
  if (!String(details.comment || "").trim()) return "Add at least one personal Comment.";
  if (!/[A-Za-z]/.test(details.comment)) return "Write the personal Comment in English.";
  if (clues.length !== draft.stars) return `Add exactly ${draft.stars} English ${draft.stars === 1 ? "Clue" : "Clues"}.`;
  if (clues.some((clue) => !/[A-Za-z]/.test(clue))) return "Write every Clue in English.";
  return "";
}
