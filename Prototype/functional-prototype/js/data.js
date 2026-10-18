// Borrowed Eyes Phase 2 database loader.
// Paths are resolved from the project-root manifest rather than duplicated here.

const FALLBACK_DATA_FILES = [
  "assets/data/artworks.json",
  "assets/data/challenges.json",
];

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path} (${response.status})`);
  return response.json();
}

export async function loadArtworkDatabase() {
  const manifest = await loadJson("assets/PATH_MANIFEST.json");
  const dataFiles = manifest.dataFiles || FALLBACK_DATA_FILES;
  const artworkPath = dataFiles.find((path) => path.endsWith("/artworks.json"));
  const challengePath = dataFiles.find((path) => path.endsWith("/challenges.json"));

  if (!artworkPath || !challengePath) {
    throw new Error("Artwork or challenge data is missing from PATH_MANIFEST.json");
  }

  const [artworks, challenges] = await Promise.all([
    loadJson(artworkPath),
    loadJson(challengePath),
  ]);
  const artworkById = new Map(artworks.map((artwork) => [artwork.id, artwork]));
  const invalidChallenges = challenges.filter((challenge) => {
    const artwork = artworkById.get(challenge.answerArtworkId);
    return !artwork || challenge.artworkId !== challenge.answerArtworkId;
  });

  if (invalidChallenges.length) {
    throw new Error(`Invalid challenge artwork references: ${invalidChallenges.map((challenge) => challenge.id).join(", ")}`);
  }

  return { manifest, artworks, artworkById, challenges };
}
