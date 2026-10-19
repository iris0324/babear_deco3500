# Borrowed Eyes V3 — 12 Original Artworks / 60 Detail Challenges

## How to Open

Open `index.html` directly. All artwork and interface images are stored locally and do not require an internet connection to load. Internet access is required to open collection source links.

## Changes in This Version

- **Image quality update:** All 12 artworks have been replaced with official original images, with long-edge dimensions of approximately 1,937–4,000 pixels. Detail images are displayed at approximately 1.5 times the source-pixel density, with a maximum display size of 480 × 420 CSS pixels, to prevent tiny cropped regions from being stretched across a large screen. Crop regions, areas, and star ratings remain unchanged.
- The 12 artworks feature detailed group, interior, urban, and natural scenes. Easily recognisable images from the previous version—including Van Gogh's portrait, Van Gogh's wheat field, *The Great Wave*, and Vermeer scenes featuring a single person—have been removed.
- The first three artworks each have eight challenges, and the remaining nine artworks each have four, giving a total of 60 challenges. Each challenge has its own ID, crop rectangle, area, difficulty level, task title, personal response, and clues.
- **Artwork IDs** are used to validate answers; **detail IDs** are used to track tasks, progress, and rewards. Different details from the same artwork accept the same correct artwork answer. Repeating the same detail does not award rewards again.
- Creators can add new details to existing artworks without creating duplicate original-artwork entries.
- Five-star details have been visually inspected. They mainly feature small distant buildings, straw, tree bark, furniture, plants, objects, fabrics, ice, and boat edges, while avoiding complete faces and iconic main subjects. Unrecognisable regions, such as empty sky or flooring, have been replaced.
- Challenges are sorted by higher star ratings by default. Combined filtering by category and star rating is supported, with 12 challenges per page.

## Automatic Difficulty Calculation by Percentage

Crop percentage = (crop width × crop height) ÷ (original artwork image width × original artwork image height) × 100%.

| Difficulty (Easy to Hard) | Crop Area as a Percentage of the Artwork | Number in This Version |
|---|---|---:|
| ★ | 80%–100% | 3 |
| ★★ | 60% to less than 80% | 3 |
| ★★★ | 40% to less than 60% | 12 |
| ★★★★ | 20% to less than 40% | 12 |
| ★★★★★ | Greater than 0% to less than 20% | 30 |

A crop area of 0% is invalid. The difficulty bands retain the previously confirmed 20% boundaries. High-difficulty challenges can use very small regions, such as 0.42% of an artwork. Lower-star challenges deliberately show more of the full composition, making them easier entry-level tasks.

The valid image area of each original artwork is defined by the `imageBounds` configuration, which excludes picture frames and colour calibration bars visible in the source photographs. Star ratings are calculated using this valid area as the denominator. Crop rendering and the creation page use the same bounds. Source image files remain unchanged; the page uses SVG to display the selected region as an exact rectangle, without additional cropping or stretching to fit a standardised card aspect ratio.

## Existing Rules Retained

- **Borrow mode:** Allowed answer attempts = difficulty rating + 1 − number of players.
- **Blind mode:** Allowed answer attempts = difficulty rating + 1.
- Checking in and viewing the gallery map do not use up answer attempts.
- In Borrow mode, each team member can unlock only one clue by submitting a comment.
- In Blind mode, clues are unlocked sequentially after incorrect answers.
- Q5 indicates only one of the four gallery areas.

## Scope of the Demo

All six front-end flows remain available. Accounts, real multiplayer matching, chat, and location verification are still local demonstrations without server-side services. Successfully granting real browser geolocation permission does not automatically simulate successful classroom/gallery verification.

A new V3 storage key is used on first launch to prevent IDs and progress from the previous eight-artwork version from being incorrectly applied to the new collection.

## Validation and Checks

Checks passed for the completeness of the 12-artwork / 60-detail dataset, crop boundaries, actual crop percentages and star ratings, all five difficulty bands, answer validation and rewards for multiple challenges linked to the same artwork, 35 page states, seven creation steps, and the existing gameplay rules. The original artworks and all 30 five-star crop selections were also visually inspected.

A local web server could not be run in the validation environment. Therefore, **browser-based visual testing and end-to-end testing on a real mobile device are not claimed to have been completed**.

Sources and the mappings between original artworks and challenges are recorded in `artworks.json`, `challenges.json`, and `Detail_Index.csv`. Collection information is based on the `source` field for each original artwork. Personal responses and clues are original, fictional demonstration content and are **not quotations from the artists**.
