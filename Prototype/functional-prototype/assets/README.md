# Borrowed Eyes — replacement `assets/` folder (V2)

**Installation:** Unzip, then copy the enclosed `assets/` folder into the root of your VS Code project, beside `index.html`. The package contains NO app source-code changes. You can delete the old `assets/` only after making a backup. The six old `card*.jpg` / `card*ans.*` paths are preserved.

## Data and asset paths

- `assets/data/challenges.json`: 20 approved challenge drafts. Includes `artworkId`, `fragmentImage`, five-level `stars`, `areaPercentOfArtwork`, `fragmentBoxInArtworkPx`, `comment`, `clues` and `answerArtworkId`.
- `assets/data/artworks.json`: artwork master records: title/artist, full image, artist perspective, provenance, source photo and review status.
- `assets/data/source_photos.json`: ALL 15 original unmodified museum photographs, including unused pictures.
- `assets/images/artworks/`: 18 derived artwork images, PLUS original six legacy `card*ans.*` files.
- `assets/images/fragments/`: 20 new challenge fragments, PLUS original six `card*.jpg` files.
- `assets/images/source_photos/`: 15 original photo files with stable names `photo-01.jpg` to `photo-15.jpg`.
- `assets/PATH_MANIFEST.json`: paths, legacy compatibility, migration information, known issues.
- `assets/docs/review-1.jpg` to `review-4.jpg`: visual index of source/full/fragment, for reference only.

## Integration notes for Codex (later)

1. Keep all paths relative to PROJECT ROOT. Example: `assets/images/fragments/challenge-001.jpg`.
2. New JSON data files are NOT automatically consumed by the current app. Codex must later adjust imports/loading, game state and views.
3. NEVER show an artwork title, artist or full image as part of an unsolved game. Show them only in the library/admin review or after solving.
4. Star rules: 1 star = 80–100%, 2 = 60–<80%, 3 = 40–<60%, 4 = 20–<40%, 5 = >0–<20%. Exactly N clues and N formal attempts for N stars.
5. Artist's Perspective is a field on the artwork record, distinct from Comment and Clues. Unverified fields are null and are NOT fabricated quotes.
6. All fragments and artwork rectangles were generated from the user's actual photo files or old ZIP. Photograph angles and imperfections mean ratio estimates need geometric QA before treating them as exact measurements.
7. **Known old data error:** `card6ans.jpg` is a horse / person / sheep / dog image, NOT `Four-fold lacquer screen`, despite the legacy `js/data.js` metadata. It remains preserved with its original filename, but its new artwork entry is named provisionally and flagged.
8. All originals preserved. Photos 08, 09, 15 not assigned to these 20 challenges and may contain additional artworks. Photos showing multiple works are kept as original sources; artwork crops for active challenges target only one painting.

Do not overwrite any JS file or rewrite application paths until a separate Codex instruction is approved.
