export function normaliseBlindClueProgress(saved = {}, clueCount = 0) {
  const attemptsUsed = Math.max(0, Number(saved.attemptsUsed) || 0);
  const stored = Math.max(0, Number(saved.cluesUnlocked) || 0);
  return Math.min(Math.max(0, Number(clueCount) || 0), Math.max(stored, attemptsUsed));
}

export function advanceBlindWrongGuess(session = {}, clueCount = 0) {
  const attemptsUsed = Math.max(0, Number(session.attemptsUsed) || 0);
  const previousClues = Math.max(0, Number(session.cluesUnlocked) || 0);
  const cluesUnlocked = Math.min(Math.max(0, Number(clueCount) || 0), Math.max(previousClues, attemptsUsed));
  return { cluesUnlocked, newlyUnlocked: cluesUnlocked > previousClues, clueIndex: cluesUnlocked - 1 };
}
