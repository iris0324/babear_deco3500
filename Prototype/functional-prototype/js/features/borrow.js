export const CHALLENGE_DISPLAY_TITLES = Object.freeze({
  "challenge-001": "Edges in Conversation", "challenge-002": "A Restless Geometry",
  "challenge-003": "Between Light and Shadow", "challenge-004": "The Divided Glance",
  "challenge-005": "A Distant Passage", "challenge-006": "Beneath a Quiet Canopy",
  "challenge-007": "A Study in Green", "challenge-008": "Figure and Contrast",
  "challenge-009": "Along the Waterline", "challenge-010": "Moonlit Country",
  "challenge-011": "A Moment of Stillness", "challenge-012": "Within the Garland",
  "challenge-013": "Stories Across a Screen", "challenge-014": "The Pale Silhouette",
  "challenge-015": "Through the Looking Glass", "challenge-016": "A Horizon Above",
  "challenge-017": "The Waiting Figure", "challenge-018": "A Small Distant World",
  "challenge-019": "A Study of Two", "challenge-020": "Movement at the Edge",
});

export function normaliseAnswer(value) {
  return String(value).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
}
