# Classroom exhibition — 18 works

Scope: this update belongs on `Binyan_Zhang`. It does not change `main` or the GitHub Pages deployment workflow.

## Placement

Orientation matches the supplied room plan: A is top, B right, C bottom, D left. Follow station numbers clockwise. The room outline, two desk banks, central round table and front desks are simplified orientation guides, not a measured architectural plan.

| Label | Wall / slot | Artwork file |
|---|---|---|
| BE01 | A / 1 | `assets/images/artworks/artwork-001.jpg` |
| BE02 | A / 2 | `assets/images/artworks/artwork-002.jpg` |
| BE03 | A / 3 | `assets/images/artworks/artwork-003.jpg` |
| BE04 | A / 4 | `assets/images/artworks/artwork-004.jpg` |
| BE05 | A / 5 | `assets/images/artworks/artwork-005.jpg` |
| BE06 | B / 1 | `assets/images/artworks/artwork-006.jpg` |
| BE07 | B / 2 | `assets/images/artworks/artwork-photo-01.jpg` |
| BE08 | B / 3 | `assets/images/artworks/artwork-photo-02.jpg` |
| BE09 | B / 4 | `assets/images/artworks/artwork-photo-03.jpg` |
| BE10 | C / 1 | `assets/images/artworks/artwork-photo-04.jpg` |
| BE11 | C / 2 | `assets/images/artworks/artwork-photo-05.jpg` |
| BE12 | C / 3 | `assets/images/artworks/artwork-photo-06.jpg` |
| BE13 | C / 4 | `assets/images/artworks/artwork-photo-07.jpg` |
| BE14 | C / 5 | `assets/images/artworks/artwork-photo-10-upper.jpg` |
| BE15 | D / 1 | `assets/images/artworks/artwork-photo-11-lower.jpg` |
| BE16 | D / 2 | `assets/images/artworks/artwork-photo-12-upper.jpg` |
| BE17 | D / 3 | `assets/images/artworks/artwork-photo-13.jpg` |
| BE18 | D / 4 | `assets/images/artworks/artwork-photo-14.jpg` |

## Use

1. Place each full artwork beside its matching BE label. Do not use the classroom team numbers as artwork numbers.
2. Serve this branch’s `Prototype/functional-prototype` over HTTP/HTTPS. ES modules need a server.
3. Start a challenge; open Classroom Map; scan a label in supported browsers or enter BE01–BE18.
4. A check-in updates the last known location and visited count locally without consuming attempts. Selecting a map marker alone never checks in.
5. Choose “Use this artwork as my guess”, then review and formally submit. Teams retain unanimous proposal approval; Blind describers cannot submit.
6. Use the same browser and origin throughout. QR links opened in another browser cannot access the existing game’s local progress.

## Attempt rules

- Borrowed Eyes: difficulty + 1 − players. Existing admission/submission rules handle nonpositive team budgets.
- Blind Eyes: difficulty + 1. Each wrong answer unlocks one clue; the final clue leaves one final submission.
- Maps and check-ins consume zero attempts. Titles and full images are hidden in the map UI.

## Printing and deployment

`classroom-labels.html` contains 18 printable A4 labels. Their URLs point to the existing public site, https://iris0324.github.io/babear_deco3500/. They will only perform classroom check-ins once this implementation is deployed at that address. Adding files to Binyan_Zhang does not publish them there. If using a different host for this branch, regenerate QR labels for that host before printing. Manual BE codes and the in-page scanner remain available.

## Verification

Passed `qa/classroom-checks.mjs` and `qa/classroom-integration.mjs`, plus JavaScript syntax checks. Integration checks execute the actual application functions with a minimal DOM/storage fixture; they are not browser layout tests. Local preview server binding was denied in this environment; the browser also disallows file URLs. Responsive layout, camera permissions, physical QR readability and a real phone walkthrough remain to be verified. Existing team and Blind social matching remain local simulations; this change adds no shared server.
