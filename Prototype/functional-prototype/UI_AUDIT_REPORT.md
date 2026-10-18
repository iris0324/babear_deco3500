# Borrowed Eyes — Consolidated Repair & Browser Acceptance

Audit updated: 18 October 2026. This report supersedes earlier completion/asset-blocked statements. The previous report is preserved at [prior-audit.md](qa/evidence/prior-audit.md).

## Acceptance summary

**Repairs implemented; full exhaustive acceptance is not claimed.** Actual button/form interaction records cover **34 of 35 routes**. The legacy `blind-list` has no entry in the approved automatic-matching workflow and has only DOM-layout/source coverage. Meaningful tested states are listed below; an entry does not imply every possible state passed.

- Chrome responsive testing used an isolated `http://127.0.0.1:5501` origin. Original `5500` saved data was restored; existing user submissions were not deleted.
- [browser-acceptance.json](qa/evidence/browser-acceptance.json) contains **198 recorded interactions** and **105 DOM-layout snapshots**: 35 routes × 320/375/430 px. Later artwork-topic capture is additional evidence.
- Recorded normal interactions reported no horizontal overflow or broken nonempty image URLs. All 105 layout snapshots reported no horizontal control clipping and no final action below the navigation at true scroll end.
- **Important limitation:** layout sweeps temporarily expose existing route DOM without initializing each session. Nine game image snapshots (three screens × three widths) have empty `src` and zero natural dimensions. These are NOT image-load passes. Actual initialized Borrow/Blind/result flows were tested separately. Only 33 of the 42 snapshot images decoded; no snapshot image had zero visible dimensions.
- Selected important compositions were screenshot-reviewed; all 105 route/width combinations were not individually screenshot-reviewed. No untested screen/state is marked PASS.
- A real delegated-review `FormData` runtime error was discovered, fixed and retested. The exported historical error list intentionally retains that discovery. Controlled storage-quota failure was also tested. No subsequent uncaught application error was observed in the targeted retests; this is not a claim of exhaustive error-free operation.

## User-reported defects fixed

1. **Fresh social prototype:** deterministic Maya/Jonah friendships, two stable DMs with three messages each, and three discoverable non-friends. All five simulated users have stable IDs, names, interests and portraits. Existing saves, including intentionally empty friends, are preserved. Removing a friend then refreshing does not reseed them; the existing DM remains saved.
2. **Finished imagery:** new letter, curator-study, shared salon and listening scenes plus five fictional visitor portraits replace the prominent crude card motifs. Chat landing has four distinct narratives; Help and Team entry actions have meaningful thumbnail art. No challenge answer is used decoratively.
3. **Identity consistency:** friends, directory, public profiles, DMs, room lists, invitations, groups and Team member/chat displays reuse the same portrait helper. Known mock visitor names resolve to their stable user IDs. Local users retain deliberate monograms; unknown saved simulated IDs receive deterministic fallback portraits.
4. **Readability/layout:** paper grounds behind inner-page headings/copy, compact heading scales, clear dark-panel actions and check-in text, compact friend actions, correctly proportioned Team rows, readable disabled/full room controls, and compact Creator Replace Photo actions. Blind role copy/image overlap at 320px was found independently and fixed.
5. **Creator lifecycle:** file handlers retain the input before awaiting image processing, instead of reading an expired `event.currentTarget`. Successful uploads replace the large Add Photo panel with previews/crop controls. Starting a fresh draft clears stale image previews.

Earlier Chat number-column/navigation fixes are retained and rechecked; they are not presented as new code changes in this pass. The five approved homepage illustrations and bottom-navigation design remain intact.

## Additional confirmed bugs fixed

| Bug | Cause / fix | Retest |
|---|---|---|
| Saved Creator details lost after reload at preview/submit | Hidden, blank metadata form was recaptured over the saved draft. Preview/submit now use details already captured by step 4. | Saved draft reload retained title, artist, Comment and Clues; Pending submission succeeded. |
| Admin review throws `FormData` error | Delegated submit listener has `currentTarget=document`. Review now reads the submitted form from `event.target`. | Approval, rejection and invalid Clue count exercised. |
| Failed review save mutates in-memory status | Review object was mutated before persistence succeeded. Build a new record/list, save first, then commit state. | Injected storage-quota failure kept stored Approved status and displayed an explicit error. |
| Fresh Creator draft shows previous image | Preview DOM outlived draft state. Synchronize upload, preview, crop and replace visibility from current state. | New empty draft showed Add Photo without stale previews. |
| Team member controls/initials poorly proportioned | Shared full-width actions and wrapping initial chips affected compact rows. Scoped row/action and monogram rules. | One/two/five member screens and active Team chat reviewed. |
| Sixth visitor entry still looked available | Full waiting-room form remained enabled. Disable input/Add at five; existing max-five guard remains authoritative. | Five-member room, disabled form and rejected sixth add checked. |
| Blind 320px role text intrudes into illustration | Mobile right padding differed from the artwork column. Restore consistent 42% text clearance. | [blind-role-320.png](qa/evidence/blind-role-320.png). |

## 35-screen acceptance checklist

**BROWSER TESTED** means the stated route/interactions were exercised through real application handlers. It does not certify all possible content/states. **LAYOUT ONLY** is not a workflow pass. All rows also have 320/375/430 DOM-layout measurements; that is separate from visual screenshot acceptance.

| # | Actual screen | Acceptance status and tested scope | Evidence / limits |
|---|---|---|---|
| 1 | `start` | BROWSER TESTED — homepage entries and bottom tabs navigate. | Interaction log; protected original imagery. No pixel-baseline comparison. |
| 2 | `play-mode` | BROWSER TESTED — Solo/Team entry actions. | Log; existing game rules retained. |
| 3 | `team-lobby` | BROWSER TESTED — Find/Create/Invite entry. | Log; finished study/room/letter mapping source-checked. |
| 4 | `team-match` | BROWSER TESTED — open waiting rooms, full disabled room, join. | [375px](qa/evidence/team-match-375.png). |
| 5 | `team-waiting` | BROWSER TESTED — 1 disabled, 2 enabled, 5/full; sixth rejected; invitation accept/decline. | [1](qa/evidence/waiting-1-375.png), [2](qa/evidence/waiting-2-375.png), [5](qa/evidence/waiting-5-375.png). Five-member image precedes final full-form disabling; disabling separately retested. |
| 6 | `challenge-list` | BROWSER TESTED — fragments/list, select, Approved local challenge included then Rejected excluded. | Log. Not all 20 individual crops visually reviewed. |
| 7 | `challenge-play` | BROWSER TESTED — Solo immediate wrong answer, Comment→one Clue, Help; Team proposal/rejection/unanimous wrong/correct. | Log; one five-star challenge. |
| 8 | `solo-help` | BROWSER TESTED — friend invitation/recruitment and return preserve Solo progress. | [375px](qa/evidence/solo-help-375.png). |
| 9 | `challenge-result` | BROWSER TESTED — correct reveals artwork, Team full award, Solo result; dedup retained. | Log and saved Profile statistics. All artwork ratios not checked. |
| 10 | `blind-role` | BROWSER TESTED — both roles, distinct non-spoiler illustrations. | [320px](qa/evidence/blind-role-320.png), [375px](qa/evidence/blind-role-375.png). |
| 11 | `blind-preferences` | BROWSER TESTED — Back, difficulty/interests, complementary simulated match. | Log; selected preferences only, not every combination. |
| 12 | `blind-list` | **LAYOUT ONLY / WORKFLOW UNVERIFIED** — legacy route absent from normal automatic matching. | Source and three DOM snapshots only; not a workflow PASS. No new entry was added. |
| 13 | `blind-play` | BROWSER TESTED — Guesser no art, Describer anonymous art in explicit Demo, both chat, only Guesser answers; wrong, success, failure, rematch and refresh. | Log. No Comment-to-Clue; success both +3, one-star failure no extra stars. |
| 14 | `messages` | BROWSER TESTED — four destination cards and onsite toggle/access. | [320px](qa/evidence/chat-320.png), [430px](qa/evidence/chat-430.png); true-bottom layout measurements. |
| 15 | `artwork-chats` | BROWSER TESTED — topic list and enter/send in artwork room. | [375px](qa/evidence/artwork-conversations-375.png). Topic thumbnails intentionally share study motif. |
| 16 | `message-list` | BROWSER TESTED — saved seeded DMs, new group and private navigation. | [375px](qa/evidence/messages-375.png). |
| 17 | `friends` | BROWSER TESTED — fresh two confirmed friends, DM/invite, accepted simulated request; no-reseed refresh. | [Fresh375px](qa/evidence/friends-fresh-375.png). All incoming request branches not covered. |
| 18 | `find-players` | BROWSER TESTED — directory, search, profile and outgoing request/acceptance simulation. | [430px](qa/evidence/players-430.png); older [375px](qa/evidence/players-375.png) predates fifth user. |
| 19 | `player-profile` | BROWSER TESTED — public profile, DM/invite/request actions. | Log. Long arbitrary user bios not exhaustively tested. |
| 20 | `groups` | BROWSER TESTED — create and open saved group. | Log; private group available offsite. |
| 21 | `group-create` | BROWSER TESTED — name, select friend, create. | Log; selected-friend validation source-checked. |
| 22 | `group-members` | BROWSER TESTED — saved members displayed after create. | Log; all membership-edit combinations not exercised. |
| 23 | `chat-room` | BROWSER TESTED — public/DM/group/artwork messages, Back, portraits, refresh and offsite restriction. | [DM375px](qa/evidence/dm-375.png). Actual OS keyboard-open layout UNVERIFIED. |
| 24 | `profile` | BROWSER TESTED — saved totals: eight earned stars, two unique completions, friends/submission counts. | [320px](qa/evidence/profile-320.png); totals reflect this QA fixture, not fabricated production numbers. |
| 25 | `profile-edit` | BROWSER TESTED — nickname/bio save and return. | Log. All long text/bidi cases not covered. |
| 26 | `profile-detail` | BROWSER TESTED — real history/star/created records opened. | Log; inspected current saved records. |
| 27 | `leave-eyes` | BROWSER TESTED — empty/new draft, saved draft, submission list/status/review links. | Log. Existing user submissions untouched. |
| 28 | `creator-fragment` | BROWSER TESTED — native File/change upload, photo-first preview/Replace, fresh draft removes old image. | Log; small synthetic PNG. Real device camera/HEIC not tested. |
| 29 | `creator-artwork` | BROWSER TESTED — full image second, pointer crop, compact Replace. | [375px](qa/evidence/creator-crop-375.png), [430px](qa/evidence/creator-crop-430.png). Keyboard-only crop UNVERIFIED. |
| 30 | `creator-difficulty` | BROWSER TESTED — selected ~48.4% rectangle yields three stars. | Log; threshold boundaries additionally static-tested. |
| 31 | `creator-perspective` | BROWSER TESTED — English Comment plus exactly three Clues; blank Clue blocks Continue. | Log. Language heuristic is not a translation service. |
| 32 | `creator-review` | BROWSER TESTED — preview, save draft/reload, submit Pending. | Log; reload data-loss regression fixed. |
| 33 | `creator-status` | BROWSER TESTED — Pending, Approved and Rejected, refresh persistence. | Log. Changes Requested state source-checked, not fully traversed. |
| 34 | `submission-review` | BROWSER TESTED — approve/reject, changed-star/Clue-count guard, controlled quota failure. | Log; approval appears in both libraries, rejection removes both. |
| 35 | `destination` | BROWSER TESTED — Explore open rooms/discovery/continue restores active Solo/Team. | Log; full-room and join protections retained. |

## Visual Asset Inventory — current card variants

Statuses describe the inspected composition, not global product acceptance. **COMPLETE** applies only to the evidence shown. **UNVERIFIED** is retained where screenshot/composition coverage is insufficient. Shared motif reuse is explicitly disclosed.

| Screens / card variant | Expected visual | Actual asset or motif | Status | Evidence / recommendation |
|---|---|---|---|---|
| Home hero + four feature entries | Five approved museum illustrations | Existing `museum-hero.jpg` and four original `*-illustration.jpg` | COMPLETE (preserved) | No image files changed. No new pixel-baseline comparison. |
| Borrow Solo/Team cards | Personal/shared museum entries | Existing `borrow-illustration.jpg`, two crops | DUPLICATED | Shared source remains. No dedicated second Borrow scene approved/reviewed in this pass. |
| Team entry Find/Create/Invite | Salon / study / invitation | New `room-`, `study-`, `letter-illustration.jpg` | COMPLETE, source checked | Entry handlers tested; no separate close-up screenshot for each. |
| Open-team / Explore room cards | Shared visitor salon | `room-illustration.jpg` | COMPLETE | Team-match screenshot shows waiting/full cards. Reuse within room category intentional. |
| Team waiting header / invitation | Exhibition plus functional invitation folio | Existing Borrow image; CSS paper/rules | COMPLETE | 1/2/5 screenshots. Form needs no fake decorative portrait. |
| Team members / invitations / votes | Stable visitor identities | Five visitor JPGs; local monogram | COMPLETE (tested records) | Waiting and active Team checks. Unknown saved IDs reuse deterministic fallback portraits. |
| Borrow catalogue / Explore challenge cards | Real non-spoiler fragments | Unchanged library `fragmentImage` | UNVERIFIED (all crops) | Working loaded selections; not all 20 crops individually screenshot-reviewed. Keep art/paths unchanged. |
| Borrow active / results | Fragment then correct full artwork | Existing challenge/artwork paths | COMPLETE (tested challenge) | Actual wrong/correct handlers tested. Extreme source ratios remain unreviewed. |
| Clues / locked notes / votes | Readable archival records | Functional paper/rule CSS, no illustration intended | COMPLETE (tested records) | Comment and voting interactions; exhaustive long-content visual QA pending. |
| Solo Help options | Three distinct assistance motifs | Letter / salon / existing Chat illustration | COMPLETE | Solo-help screenshot. |
| Blind role cards | Observer / listener | Existing Chat scene / new listening scene | COMPLETE | 320/375 screenshots; blank crop and narrow overlap repaired. |
| Blind preferences | Anonymous matching form | Functional paper controls | COMPLETE (tested preferences) | Both role paths tested. No identifying painting used. |
| Blind legacy list | Non-spoiler listening motif | `listening-illustration.jpg` replacing CASE label | UNVERIFIED | Legacy route only source/layout checked. |
| Blind Guesser concealment | Finished non-identifying listening scene | `listening-illustration.jpg` plus concealed panel | COMPLETE (tested room) | Guesser sees no target image/fragment. Same category reuse intentional. |
| Blind Describer / result | Anonymous target then completion reveal | Existing selected full artwork | COMPLETE (tested matches) | Alt/visible metadata checked; only Guesser formal answer control. |
| Explore Continue Playing | Compact active-session record | Functional text/arrow folio | COMPLETE (tested records) | Resume tested; no decorative image expected. |
| Chat landing Public / Artwork / Messages / Friends | Four distinct finished motifs | Existing Chat / new Study / Letter / Maya portrait | COMPLETE | Chat320/430 screenshots; no crude envelope/head silhouette. |
| Artwork topic cards | Framed study thumbnail | `study-illustration.jpg` | DUPLICATED (category reuse) | Artwork375 screenshot: both topics share image. Distinct per-area commissioned art could improve variety; not a broken path. |
| Public/group room entries | Salon / correspondence | Room / Letter JPGs | COMPLETE (tested rooms) | Messages375 and room interactions. |
| DMs / friends / requests / directory / profiles | Consistent visitor portraits | `visitor-{maya,jonah,lina,theo,amara}.jpg` | COMPLETE (known users) | Friends/directory/DM screenshots; local user's initial badge intentional. |
| Chat / Team sender avatars | Stable sender identity | Shared portrait helper; local monogram | COMPLETE (tested messages) | DM screenshot and live Team chat. Museum guide/system messages remain text. |
| Profile cover/statistics/detail rows | Personal collection ledger | Existing CSS folio; local initials | COMPLETE (tested profile) | Profile320 screenshot. No fake personal portrait/statistics added. |
| Creator landing / status / review cards | Submitted fragment/full image | Local user uploads/canvas and status typography | COMPLETE (test submission) | Actual Pending→Approved→Rejected and persistence. Missing/corrupt old uploads not exhaustively simulated. |
| Creator upload / crop / preview | Photo-first curator workbench | Uploaded images/canvas; Add Photo utility control | COMPLETE (test files) | Crop375/430; Replace compact. Upload control is a utility, not claimed as finished illustration. |
| Creator difficulty / metadata / Clue fields | Readable calculation/manuscript | Functional parchment CSS | COMPLETE (three-star fixture) | Five steps tested. Five-Clue long-content state not screenshot-reviewed. |
| Empty / disabled / error notices | Deliberate readable functional notices | CSS paper/status text, no illustrative asset expected | UNVERIFIED (all variants) | Tested empty social/new draft, full room, disabled start, validation and quota errors. All variants not exhaustively traversed. |

All nine new JPGs were visually inspected and integrated locally. New scenes are 900×600; portraits 384×384. Prompts/provenance and exact paths: [GENERATED_ASSETS.md](assets/ui/GENERATED_ASSETS.md). No known missing required asset blocks the repaired normal entry cards; legacy/dedicated per-card variety and unreviewed compositions remain as disclosed above.

## Focused verification and preservation

- `node qa/static-checks.mjs`: PASS — five stable players/portraits, fresh seeded friends/DMs, existing empty friends preserved, symmetric DM IDs, ten crop threshold boundaries, exact Clue count, 35 routes and eight stylesheet imports.
- `node --check`: PASS for 13 production/QA JavaScript files. Local CSS URL references resolve.
- Browser: five-star Team proposal rejection consumed zero attempts; unanimous wrong submission consumed exactly one; unanimous correct awarded five stars to each member. Joining/invitation preserved attempts/Clues. Declining left Team JSON unchanged.
- Browser: Blind normal role privacy, explicit Demo-only role switch, unrestricted chat, Guesser-only attempts, success/failure/rematch, no Comment-to-Clue and refresh persistence.
- Browser: Creator native File/change uploads, pointer crop, required fields, draft reload, Pending/Approved/playable in Borrow and Blind libraries, Rejected hidden, quota error. Approval integration was checked by presence in both game libraries; a separate full playthrough of this synthetic challenge was not performed.
- Browser: public check-in restricts public chat; private DM/group persists outside museum; saved friends are not automatically restored after removal.
- No production data JSON, imported artwork image, manifest, game scoring rule, localStorage key/format, homepage illustration or bottom-tab design was changed. No dependencies added.

## Exact files changed or created by this repair

Production changes:

- `index.html` — local favicon only.
- `js/app.js` — social/avatar orchestration, Creator lifecycle/review fixes, waiting-room controls.
- `js/features/chat.js` — stable five-user directory and first-run demo data.
- `js/ui/identity.js` — new shared escaped portrait/monogram renderer.
- `css/chat.css`, `css/games.css`, `css/forms.css`, `css/explore.css`, `css/layout.css` — scoped visual/layout corrections.
- New images under `assets/ui/`: `letter-illustration.jpg`, `study-illustration.jpg`, `room-illustration.jpg`, `listening-illustration.jpg`, `visitor-maya.jpg`, `visitor-jonah.jpg`, `visitor-lina.jpg`, `visitor-theo.jpg`, `visitor-amara.jpg`.
- `assets/ui/GENERATED_ASSETS.md` — generated-art provenance/prompt specifications.

Verification/report files (not loaded by production):

- `UI_AUDIT_REPORT.md`.
- `qa/acceptance.js`, `qa/layout-sweep.js`, `qa/static-checks.mjs`.
- `qa/evidence/browser-acceptance.json`, `qa/evidence/prior-audit.md`.
- Screenshots: `artwork-conversations-375.png`, `blind-role-320.png`, `blind-role-375.png`, `chat-320.png`, `chat-430.png`, `creator-crop-375.png`, `creator-crop-430.png`, `dm-375.png`, `friends-fresh-375.png`, `messages-375.png`, `players-375.png`, `players-430.png`, `profile-320.png`, `solo-help-375.png`, `team-match-375.png`, `waiting-1-375.png`, `waiting-2-375.png`, `waiting-5-375.png` (all in `qa/evidence/`).

## Evidence interpretation, cleanup and remaining limitations

Full-page Chrome captures can place the fixed bottom navigation at the original viewport fold inside the stitched image. That alone does not demonstrate an unreachable action. True maximum-scroll clearance was measured separately. The pink translation overlay visible in some captures is an installed browser extension, not production application markup.

QA messages/submissions and synthetic images were created only on the isolated QA origin. After exporting evidence, all temporary `borrowedEyes.*` state on `5501` was removed and the app reloaded. Cleanup verification showed zero submissions, an empty Team and the intended two fresh demo friends; the test nickname, completions and game awards were removed. Original-origin saves were restored and were not touched during cleanup. Evidence excludes original user-save contents.

Still **UNVERIFIED / INCOMPLETE**: legacy Blind list workflow; exhaustive screenshot inspection of all 35 routes at all three widths; all long/empty/error/request/review combinations; each of the 20 fragment crops; actual mobile keyboard, real camera/HEIC uploads, keyboard-only crop interaction and screen-reader traversal. Generated portrait fallbacks repeat for unknown custom IDs, and artwork topic cards intentionally share one study image. No claim of full-site unconditional completion is made. No additional phase was started.
