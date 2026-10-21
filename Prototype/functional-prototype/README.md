# Borrowed Eyes — VS Code friendly frontend

This is a **structure-only refactor** of the uploaded frontend. It keeps the original HTML rendering, CSS rules, artwork assets, bilingual content, and browser-local interactions. **No React, Node.js build, database, or backend is required.**

## Quick start / 如何运行

1. Unzip the folder and open the **whole folder** in VS Code (File → Open Folder).
2. Install the VS Code **Live Server** extension (Ritwick Dey).
3. Right-click `index.html` → **Open with Live Server**, or click **Go Live**.
4. Edit files and save. Refresh the browser if necessary.

Alternative if you have Python: `python3 -m http.server 5500`, then visit `http://localhost:5500/`.

## Where to edit / 文件位置

| Want to change | File |
| --- | --- |
| HTML shell, script loading | `index.html` |
| Overall appearance, colors, mobile layout | `src/styles/main.css` |
| Welcome, login, home, menus | `src/pages/entry.js` |
| Browse, artwork details, Borrow game | `src/pages/borrow.js` |
| Blind Eyes game | `src/pages/blind.js` |
| Chats, visitors, location access | `src/pages/community.js` |
| Gallery map, catalogue | `src/pages/gallery.js` |
| Leave Your Eyes / task creator | `src/pages/creator.js` |
| Profile and credits | `src/pages/account.js` |
| State, helpers, UI shell | `src/core/state.js` |
| Route-to-page mapping and rendering | `src/core/router.js` |
| Action handlers and form validation | `src/core/events.js` |
| Game/save helper actions | `src/core/actions.js` |
| Artwork and challenge data | `src/data/artworks.js` |
| English / Chinese translation data | `src/data/translations.js` |
| Photos and UI illustrations | `assets/` |

## Important technical notes

- Scripts are intentionally **classic JavaScript scripts**, not ES modules. This preserves shared top-level `const`/`let` and original behavior. **Keep their order in `index.html`.**
- The refactor separates functionality into named files without rewriting game logic. Some functions are still long and can be incrementally cleaned up later.
- Artwork and illustration paths remain `assets/...`; do not move `assets/` without updating references.
- Existing localStorage key `borrowedEyes.frontend.v3` remains unchanged, so browser-local state should remain accessible when using the same origin.
- Accounts, chat, matchmaking, reports and uploaded challenges remain **local demonstrations**. Deploying these static files does not make them multi-user.
- For deployment, upload `index.html`, `src/`, and `assets/` together to any static host. No build step is required.

## Suggested test checklist

- Welcome → guest/login → location → home
- Browse artworks, detail cards, gallery map and credits
- Borrow Eyes game, hints, guesses, results
- Blind Eyes flow and chat
- Visitor chats and profile
- Create task, preview, publish locally
- 中文 / English switch, responsive/mobile layout

The original functionality has not been intentionally altered; test in a browser before deploying publicly.
