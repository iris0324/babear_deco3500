# Borrowed Eyes — Phase 1.5

A mobile-first, vanilla HTML/CSS/JavaScript museum prototype. No build step or dependencies.

## Preview in VS Code

Open this folder in VS Code. Use **Live Server → Open with Live Server** on `index.html`, or run:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000. Serve over HTTP because the JavaScript uses ES modules.

## Phase 1 changes

- Four-entry homepage, framed existing artwork, parchment palette, serif headings, walnut buttons, forest accents, and ornamental details.
- Persistent Home / Chat / Games / Profile navigation, contextual Back buttons, keyboard focus, selected navigation states, and safe-area spacing.
- Consistent future-feature pages for Blind Eyes, Live Gallery Chat, and Leave Your Eyes.
- Games connects to the preserved solo journey. Profile shows locally saved view and contribution counts.
- Shared card, form, empty-state, loading-state, difficulty, dialog, confirmation, and toast styles. Difficulty remains unrated; no game rules were added. Loading styles are available for later asynchronous features.
- Reusable native confirmation dialog demonstrated in Profile → About this notebook; save failures now show feedback.

## Preserved

All six seed artworks and fragments; fragment selection and pagination; both clues; artwork confirmation; My View forms and local saves; comparison reactions; re-observation; artist context; optional contribution with photo previews; completion and restart. Existing `js/data.js` and `js/storage.js` remain unchanged.

## Manual review

Check at 320, 390, 768, and 1280 pixels wide. Open each homepage entry, use Back and bottom navigation, switch between destination pages, and verify the selected navigation item. Complete the solo journey with and without a contribution. Check pagination, second-clue retention, keyboard focus, the notebook dialog, and saved counts after refresh. Photos preview only during the current session.

JavaScript syntax and static route/asset checks were completed. Browser rendering and touch interactions could not be verified automatically in the available environment.

## Prototype limits

New multiplayer, chat, and standalone challenge creation experiences are placeholders. No backend, accounts, real-time communication, recognition API, or invented difficulty/reward rules. Existing contributions save text and image filenames locally; uploaded image content is not persisted. Current journey position and unsaved form content are not restored after refresh. Native dialog support requires a modern browser.

## Phase 2 proposal — pending review

Agree on solo/team challenge rules and screen flows, then extend Borrow the Eyes. Define mock partner behavior for Blind Eyes, chat/room navigation, and standalone challenge authoring. Connect shared states and accessibility checks as each feature is implemented. Do not begin Phase 2 until Phase 1 is approved.


## Phase 1.5 — premium vintage redesign

Changed `index.html` and `css/style.css`; updated this README. Game JavaScript, data, storage, and all existing action/route bindings are unchanged. No dependencies or external images were added.

The homepage now features a custom eye wordmark, an artwork-led exhibition hero, four illustrated exhibit entries, editorial serif typography, ivory paper, espresso text, forest-green controls, and muted brass/terracotta details. The floating bottom navigation uses consistent inline SVG icons. The solo journey, forms, clues, artwork frames, reactions, and placeholder pages share the same styling. Hover, pressed, focus, and disabled states are defined; reduced-motion preferences disable animation and transforms.

### Verification

- Reviewed the desktop layout and mobile layout at 375 × 812 in Chrome responsive mode. All four entries remain visible above the bottom navigation, with no overlapping primary controls.
- Opened Blind Eyes and Live Gallery Chat and verified Back returns to Home.
- Static checks confirmed every original HTML action, route, and ID remains present and unchanged; all referenced local assets exist. `js/app.js` is byte-for-byte unchanged from Phase 1, and its syntax check passes.
- The 430px layout has dedicated responsive sizing, but its browser review was interrupted when the browser switched away from the preview. An attempt to use a separate review browser timed out. Full end-to-end solo-journey, upload, hover/pressed/focus, and reduced-motion behavior were not re-tested in the browser during this visual-only pass.
- Remaining review: check 430 × 932 and a physical phone; walk through the solo journey and the remaining navigation entries. Confirm appearance in browsers without the local Iowan/Baskerville/Avenir fonts (built-in fallbacks are supplied).

Phase 1.5 stops here. Phase 2 has not begun.
