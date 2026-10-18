# Borrowed Eyes — Visual Asset & Card Completeness Audit

Audit date: 18 October 2026  
Scope: production UI was inspected without modification.  
Browser coverage: live Chrome responsive rendering at 320, 375 and 430 px for Correspondence; 430 px for Team Waiting Room and Blind Eyes role selection. Other entries are explicitly source-inspected or unverified.

## Executive findings

- **35 routed screens** were inventoried from the real `data-screen` markup.
- **3 screen families / 5 viewport states** were visually inspected in Chrome.
- **0 missing files** among the 5 approved UI illustrations and 38 unique imported challenge/full-artwork paths.
- All five UI illustrations decode at useful dimensions: four feature images are 800×533; `museum-hero.jpg` is 1600×533.
- All 20 challenge fragments and 18 referenced full artworks exist. Natural dimensions range from 194×269 to 1084×897. Catalogue images have explicit visible sizes (`154px` high in Borrow; `76×82px` in Explore), but their crop quality was not visually reviewed challenge by challenge.
- Confirmed findings: **0 P0, 8 P1, 7 P2**.

The current main weakness is asset suitability rather than broken paths. Five UI images are reused as page backgrounds and card illustrations throughout 35 screens. Several “illustrations” are CSS geometry, and one shared image crop produces a visibly empty Blind Eyes card.

## Route inventory

| Family | Actual screens |
|---|---|
| Home | `start` |
| Borrow | `play-mode`, `team-lobby`, `team-match`, `team-waiting`, `challenge-list`, `challenge-play`, `solo-help`, `challenge-result` |
| Blind | `blind-role`, `blind-preferences`, `blind-list`, `blind-play` |
| Chat and social | `messages`, `artwork-chats`, `message-list`, `friends`, `find-players`, `player-profile`, `groups`, `group-create`, `group-members`, `chat-room` |
| Profile | `profile`, `profile-edit`, `profile-detail` |
| Creator | `leave-eyes`, `creator-fragment`, `creator-artwork`, `creator-difficulty`, `creator-perspective`, `creator-review`, `creator-status`, `submission-review` |
| Explore / fallback | `destination` |

## Visual Asset Inventory

Statuses describe visual completeness, not merely whether a path exists.

| Screen | Card/component | Expected motif | Actual asset or CSS motif | Status | Evidence | Recommended correction |
|---|---|---|---|---|---|---|
| Home | Hero | Panoramic museum exhibition | `assets/ui/museum-hero.jpg`, 1600×533 | COMPLETE | Source path/dimensions; protected approved UI | Preserve. |
| Home | Four feature entries | Four distinct illustrated entries | Four separate 800×533 UI JPGs | COMPLETE | HTML source and file dimensions | Preserve; browser composition outside this focused pass. |
| Borrow mode | Solo / Team exhibition cards | Distinct personal/shared looking scenes | Both crop `borrow-illustration.jpg` at different positions; right motif occupies roughly 30–37% | DUPLICATED | `games.css` background rules | Add a second approved non-spoiler Borrow illustration or a finished engraved team motif. |
| Team entry | Find/Create/Invite cards | Three distinct archival entry motifs | Text-only `.team-entry` with CSS number rule | PLACEHOLDER | DOM/style inspection | Add deliberate hall, room folio and invitation motifs; keep compact. |
| Team match / Explore | Open team card | Museum room record | CSS striped left rule; no illustration | UNVERIFIED | Source inspection only | Use a finished room-number/plaque composition; verify full/disabled states in browser. |
| Team Waiting Room | Header | Shared-looking exhibition scene | `borrow-illustration.jpg`, cover crop | COMPLETE | Live 430px capture | Crop is readable and intentional. |
| Team Waiting Room | Open-to-players plaque | Exhibition access plaque | Dark CSS panel and native square checkbox | UNVERIFIED | Live 430px capture | Visually usable but checkbox remains generic; review at 320/375. |
| Team Waiting Room | Visitor list | Classical visitor medallions | Initial-based CSS medallions; list empty in capture | UNVERIFIED | Source plus empty live state | Render 2–5 long-name members before approval. |
| Team Waiting Room | Local invitation | Antique visitor folio | CSS paper/rules, no illustration | COMPLETE | Live 430px capture | Composition is complete for a form; retain functional focus. |
| Team Waiting Room | Final status/action | Refined start record | CSS status strip and disabled button | COMPLETE | Live bottom-scroll capture | Final action is reachable above nav at 430px. Verify 320/375. |
| Borrow catalogue | Challenge card | Fragment-led museum catalogue record | Real `fragmentImage`; 20 files exist; CSS visible height 154px (122px ≤359px) | UNVERIFIED | Source paths, natural dimensions and CSS | Capture representative portrait, landscape and square fragments at all widths; inspect `object-fit: cover` for destructive crops. |
| Borrow play | Fragment frame | Dominant mystery fragment | Real fragment; `contain`, 230–430px high | UNVERIFIED | DOM/CSS inspection | Browser-check blank bands, contrast and vertical space for extreme aspect ratios. |
| Borrow play | Clues / locked clues | Sealed catalogue notes | CSS paper, left rule and diamond glyph | COMPLETE | Source inspection; imagery is not expected | Keep utilitarian; verify long clue wrapping. |
| Borrow play | Help choices | Visitor assistance correspondence | CSS paper rows and arrow | PLACEHOLDER | Source inspection | Give Invite, Match and Chat distinct small archival marks rather than identical rows. |
| Borrow team play | Members / voting | Visitor records and approval ledger | Initial chips, plain rows and buttons | UNVERIFIED | Source inspection | Browser-check five long names and unanimous-vote wrapping. |
| Borrow result | Artwork/result cards | Revealed collection record | Dynamic full artwork path plus CSS folio | UNVERIFIED | All referenced full images exist | Test portrait and landscape results; verify full artwork uses `contain` and metadata does not overlap. |
| Blind role | Describer | Visitor studying a complete artwork | `blind-illustration.jpg` positioned at 72%; selected crop appears blank | MISSING | **Verified live 430px screenshot** | Supply a distinct Describer crop/asset with a visible observer and artwork. |
| Blind role | Guesser | Listening/interpretation scene | Same `blind-illustration.jpg` positioned at 28%; visible reading figure | DUPLICATED | **Verified live 430px screenshot** | Retain only if paired with a distinct Describer visual; avoid one source pretending to be two complete scenes. |
| Blind preferences | Preference folio | Anonymous matching record | CSS form panel, no image intended | UNVERIFIED | Source inspection | Verify long interest tags and controls at all widths. |
| Blind challenge list | Mystery catalogue records | Anonymous numbered entries | Text-only cards with CSS “B” marker | PLACEHOLDER | Source inspection | Use a finished blindfold/voice/ear engraving system without artwork spoilers. |
| Blind room | Describer artwork | Full mystery artwork without identity | Dynamic `fullImage`, `contain` | UNVERIFIED | Paths exist; privacy logic source-inspected | Render several aspect ratios and ensure no title/artist appears in alt text or adjacent UI. |
| Blind room | Guesser hidden artwork | Deliberately concealed panel | CSS radial dark panel and ✧ glyph | PLACEHOLDER | Source inspection | Replace generic glyph with a finished non-identifying engraved listening motif. |
| Explore | Continue Playing | Collection continuation record | Text-only CSS row and arrow | UNVERIFIED | Source inspection | Browser-check three simultaneous sessions and long challenge IDs. |
| Explore | Discover Challenge | Fragment catalogue entry | Real fragment at fixed 76×82, `cover` | UNVERIFIED | All fragment paths exist | Capture portrait/landscape extremes; fixed crop can obscure the clue subject. |
| Chat landing | Museum Public Chat | Classical gallery/salon | Right crop of `chat-illustration.jpg`, 800×533 source | COMPLETE | **Verified at 320/375/430** | Crop and contrast are acceptable. |
| Chat landing | Artwork Conversations | Framed exhibition-study motif | Same `chat-illustration.jpg` with a nearby crop | DUPLICATED | **Verified at 320/375/430** | Use a distinct approved frame/detail illustration; current card reads as a repeat of Public Chat. |
| Chat landing | My Messages | Finished antique letter | CSS diagonal envelope geometry | PLACEHOLDER | **Verified at 320/375/430** | Replace with a finished local letter/desk illustration or more detailed engraved stationery asset. |
| Chat landing | My Friends | Classical portrait cameo | CSS radial head-and-shoulders icon | PLACEHOLDER | **Verified at 320/375/430** | Replace with a finished classical cameo/botanical engraving asset. |
| Chat landing | Catalogue numbering | Restrained 01–04 markers | Absolutely positioned CSS rule labels | MISSING | **At 320px, 01–04 overlap titles; 03 and 04 visibly collide** | Reserve a fixed number column at 320px or stack marker above copy. |
| Chat landing | Last card / check-in | Fully reachable above bottom nav | Fixed nav covers part of My Friends before bottom scroll; check-in is below initial viewport | MISSING | **Verified at 320/375/430** | Increase effective bottom scroll clearance and validate the true maximum scroll position. |
| Chat landing | Header | Text-safe correspondence folio | Large translucent parchment block over `chat-illustration.jpg` | COMPLETE | Live captures | Readable, though visually tall; P2 reduction may improve rhythm. |
| Chat landing | Museum check-in | Compact exhibition access plaque | CSS green plaque and native checkbox | UNVERIFIED | DOM source; below captured fold | Capture checked/unchecked and locked Public Chat states. |
| Chat room list | Public/artwork/private/group entries | Correspondence records | CSS icon medallions; no room-specific art | PLACEHOLDER | Source inspection | Vary small motifs by room category; do not use the same oval for every thread. |
| Chat conversations | Message bubbles | Readable modern correspondence | CSS bubbles, no image intended | UNVERIFIED | Source inspection | Test long URLs/text, sender names and sticky composer above nav/keyboard. |
| Friends / requests / invitations | Social rows | Compact visitor correspondence | Mini CSS cameo or no portrait for request rows | PLACEHOLDER | Source inspection | Reuse one finished monogram/cameo system consistently and reserve action width. |
| Find Players | Player card | Classical visitor portrait | Both `.profile-cameo` markup and an additional CSS silhouette pseudo-element | DUPLICATED | DOM and CSS inspection | Remove the redundant pseudo portrait; keep one identity medallion. |
| Public player profile | Visitor folio | Large cameo and identity record | Initial cameo plus CSS paper profile | UNVERIFIED | Source inspection | Browser-check long bio, many interests and friend/invite action combinations. |
| Private groups | Group room cards | Sealed private correspondence | Generic `.room-entry` card | PLACEHOLDER | Source inspection | Add a restrained group seal/folio motif distinct from DMs. |
| Profile | Profile ledger | Personal collection cover | CSS dark folio and initial cameo | COMPLETE | Source inspection; no real portrait expected | Browser-check long nickname and bio. |
| Profile | Four statistics | Collection record tiles | CSS numbered folios | UNVERIFIED | Source inspection | Check large values and action text at 320px. |
| Profile details | History / My Eyes / Stars rows | Numbered collection records | CSS counters and alternating paper | UNVERIFIED | Source inspection | Populate every state and inspect empty/long records. |
| Creator landing | Draft/review submission rows | Curator’s submission ledger | User fragment thumbnail when present | UNVERIFIED | Dynamic local data | Test broken/oversized local image data and empty draft states. |
| Creator step 1 | Upload card | Sketchbook photo station | CSS ruled paper and plus sign | PLACEHOLDER | Source inspection | The plus symbol is generic; a finished camera/contact-sheet motif would improve it without affecting input. |
| Creator step 2 | Artwork/crop card | Curator workbench | User image/canvas; dark crop stage | UNVERIFIED | Dynamic local upload | Must be browser-tested with portrait/landscape inputs and touch crop handles. |
| Creator step 3 | Difficulty folio | Museum calculation record | CSS green folio with large watermark V | COMPLETE | Source inspection | Verify 1–5 star strings and scale at 320px. |
| Creator step 4 | Metadata/clue folio | Curator manuscript | CSS form paper; no image intended | UNVERIFIED | Source inspection | Test five clues, long labels, validation and keyboard-safe final action. |
| Creator step 5 | Review card | Submission proof | User fragment plus crop canvas | UNVERIFIED | Dynamic local upload | Verify canvas has non-zero visible size after refresh. |
| Creator status / admin review | Collection status record | Review seal and artwork pair | CSS status seal plus user images | UNVERIFIED | Dynamic local data | Test Pending/Approved/Rejected/Changes Requested and missing stored-image error. |
| Empty states / dialog | Museum notice | Deliberate archival notice | CSS stamp glyph / parchment dialog | PLACEHOLDER | Source inspection | Use as a minor utility only; do not present it as an illustrated feature card. |

## Asset integrity and reuse

### Verified paths and natural dimensions

- `museum-hero.jpg`: 1600×533.
- `borrow-illustration.jpg`, `blind-illustration.jpg`, `chat-illustration.jpg`, `leave-illustration.jpg`: each 800×533.
- Challenge database: 20/20 fragment paths and 18/18 unique full-artwork paths resolve and decode through macOS image metadata.
- No remote image dependencies were found in production CSS.

### Excessive reuse

1. `chat-illustration.jpg` is the background for the Chat/social family and supplies both Public Chat and Artwork Conversations card art. The two live cards look substantially alike.
2. `blind-illustration.jpg` supplies the entire Blind background and both role cards. Its Describer crop is visually empty while Guesser contains the recognizable figure.
3. `borrow-illustration.jpg` supplies Borrow backgrounds, both mode cards and Team Waiting Room. This is coherent within one feature, but the Solo/Team cards lack distinct narrative imagery.
4. CSS cameos are repeated across bottom navigation, Chat destination, visitor lists, player cards and Profile. Several are generic circles/silhouettes rather than finished illustrations.

## Layout findings by severity

### P1 — important

1. **Chat 320px number/title collision — VERIFIED.** The absolute 01–04 marker intrudes into titles; 03/04 visibly overlap.
2. **Chat final-card/navigation obstruction — VERIFIED.** My Friends is partially covered in the 320, 375 and 430 captures before the bottom content is reached; scroll-end clearance needs explicit verification/fix.
3. **Blind Describer missing visual — VERIFIED.** The image region is present but the selected crop is blank, while Guesser is illustrated.
4. **Chat artwork motif duplicated — VERIFIED.** Public Chat and Artwork Conversations show nearly the same gallery scene.
5. **Messages motif is a placeholder — VERIFIED.** It is CSS envelope geometry, not a finished vintage illustration.
6. **Friends motif is a placeholder — VERIFIED.** It is a generic CSS silhouette/cameo.
7. **Find Players double portrait treatment — SOURCE VERIFIED.** The actual markup includes `.profile-cameo`, while `.player-card::before` adds a second silhouette.
8. **Challenge/explore fixed `cover` crops — UNVERIFIED risk.** Widely varying source ratios are forced into 154px or 76×82 boxes and require representative rendering before approval.

### P2 — visual polish

1. Team entry cards use text plus numbers without finished motifs.
2. Blind challenge cards use a generic “B” marker.
3. Blind hidden-art panel uses a generic star glyph.
4. Help choices remain three nearly identical rows.
5. Room entries reuse generic oval icons across unrelated conversation categories.
6. Creator upload relies on a generic plus symbol.
7. Correspondence header is readable but occupies a large paper block relative to the first card.

## Mobile and bottom-navigation coverage

| Width | Verified screens | Result |
|---|---|---|
| 320px | Correspondence | Number/title overlap and fourth-card obstruction confirmed. Other screens unverified. |
| 375px | Correspondence | Cards render, but My Friends is partly behind nav in the captured viewport. Other screens unverified. |
| 430px | Correspondence, Team Waiting Room, Blind role selection | Team final action is reachable after scrolling. Blind Describer is blank. Chat fourth card is obstructed in the captured viewport. |

The shared content padding suggests intended nav clearance, but source rules alone are insufficient evidence. All remaining screens and keyboard-open creator/chat states remain **UNVERIFIED**.

## Recommended repair order

1. Correct the Blind role assets/crops so both cards have complete, distinct images.
2. Rebuild Chat destination motifs: a distinct artwork-study image, finished letter, and finished cameo.
3. Fix the Chat 320px number column and verify true scroll-end clearance above the bottom navigation.
4. Remove the duplicate portrait layer from Find Players.
5. Screenshot representative challenge aspect ratios and populated dynamic states before changing their crop rules.
6. Add dedicated non-spoiler engraving assets only where a significant card currently uses a placeholder; keep utilitarian controls image-free.

The initial audit above was read-only. The repair pass below subsequently changed the production HTML, CSS and JavaScript files listed in its repair record; artwork data and assets remain unchanged.

## Full-site repair acceptance checklist

Updated 18 October 2026 after the proactive repair pass. `BROWSER PASS` means the route was opened in Chrome and its principal interaction or populated state was exercised. `RENDERED CHECK` means the real route was rendered by the automated 35-screen DOM/layout probe and its bindings were source-checked, but every dynamic state was not exercised. `INCOMPLETE` is never counted as a pass.

| # | Routed screen | Status | Evidence and remaining scope |
|---:|---|---|---|
| 1 | `start` | BROWSER PASS | Visually checked at 320, 375 and 430 px; four entries and bottom navigation remain usable. |
| 2 | `play-mode` | BROWSER PASS | Opened at 375 px; Solo and Team controls render with 44 px-plus targets. |
| 3 | `team-lobby` | RENDERED CHECK | Three entry actions have handlers and no horizontal overflow; full state combinations source-checked. |
| 4 | `team-match` | RENDERED CHECK | Open/full team rules and join handler source-checked; route rendered without overflow. |
| 5 | `team-waiting` | BROWSER PASS | Empty/disabled state checked at 375 and populated layout previously checked at 430; final action has bottom-nav clearance. |
| 6 | `challenge-list` | BROWSER PASS | All 20 real fragments rendered at 375 px with non-spoiler titles and difficulty. |
| 7 | `challenge-play` | BROWSER PASS | Comment unlocked exactly one clue; a wrong answer consumed one attempt and revealed no identity. |
| 8 | `solo-help` | RENDERED CHECK | All three help actions map to handlers; compact route passed layout probe. |
| 9 | `challenge-result` | RENDERED CHECK | Success/failure rendering and result controls source-checked; route passed layout probe. |
| 10 | `blind-role` | BROWSER PASS | Both role cards visually checked at 375/430; Describer image is now visible. |
| 11 | `blind-preferences` | BROWSER PASS | Guesser preference submission and simulated complementary match completed. |
| 12 | `blind-list` | INCOMPLETE | Legacy routed screen is no longer in the approved automatic-match path and still uses a typographic CASE motif; no dedicated approved non-spoiler engraving exists. |
| 13 | `blind-play` | BROWSER PASS | Guesser had no artwork/fragment and had the formal-answer form; Describer privacy/source path and both role views checked. |
| 14 | `messages` | INCOMPLETE | Layout/check-in behavior passed at 320/375/430, but Artwork Conversations, My Messages and My Friends still lack three dedicated finished illustrations. |
| 15 | `artwork-chats` | RENDERED CHECK | Dynamic room list and room-opening handler source-checked; route passed layout probe. |
| 16 | `message-list` | RENDERED CHECK | Empty/private-room variants and group entry handler source-checked; route passed layout probe. |
| 17 | `friends` | RENDERED CHECK | Empty, request, accepted and invitation render branches source-checked; route passed layout probe. |
| 18 | `find-players` | RENDERED CHECK | Directory/search/profile bindings source-checked; duplicate portrait layer removed. |
| 19 | `player-profile` | RENDERED CHECK | Stranger, sent, incoming and friend action branches source-checked; route passed layout probe. |
| 20 | `groups` | RENDERED CHECK | Empty/populated group list and create action source-checked; route passed layout probe. |
| 21 | `group-create` | RENDERED CHECK | Friend validation and persistence handler source-checked; form fits the mobile probe. |
| 22 | `group-members` | RENDERED CHECK | Eligible/no-eligible friend branches and leave action source-checked. |
| 23 | `chat-room` | BROWSER PASS | Public-chat lock then check-in entry completed; message composer visible above nav. Header action contrast fixed globally. |
| 24 | `profile` | BROWSER PASS | Real saved totals rendered at 320 px with no overlap. |
| 25 | `profile-edit` | BROWSER PASS | Six real interest checkboxes now render; the previously literal template text is removed. |
| 26 | `profile-detail` | RENDERED CHECK | History, Eyes and Stars branches source-checked; route passed layout probe. |
| 27 | `leave-eyes` | BROWSER PASS | Empty submissions and saved-draft states rendered at 375 px. |
| 28 | `creator-fragment` | RENDERED CHECK | Empty/upload/error branches source-checked; route passed layout probe. No new file upload was performed in this pass. |
| 29 | `creator-artwork` | RENDERED CHECK | Crop pointer handlers, zero-area rejection and image-error branch source-checked; route passed layout probe. |
| 30 | `creator-difficulty` | RENDERED CHECK | Star calculation display and all thresholds source-checked; route passed layout probe. |
| 31 | `creator-perspective` | RENDERED CHECK | Metadata, comment and exact-clue validation source-checked; long form has bottom-nav clearance. |
| 32 | `creator-review` | RENDERED CHECK | Preview canvas, edit links, save and submit bindings source-checked; route passed layout probe. |
| 33 | `creator-status` | RENDERED CHECK | Pending/Approved/Rejected/Changes Requested render branches source-checked. |
| 34 | `submission-review` | RENDERED CHECK | Review reason, clue-count, star adjustment and persistence branches source-checked. |
| 35 | `destination` | BROWSER PASS | Explore rendered active Solo/Blind sessions, open/full teams and all 20 discovery records at 375 px. |

### Repairs confirmed in this pass

- Replaced broken literal template markup in Profile editing with six functional checkboxes.
- Prevented closed or memberless legacy team records from hijacking Borrow entry, resume, or Explore continuation.
- Corrected conversation-header action contrast on the forest-green header.
- Made document titles choose the visible role heading, so Guesser rooms are no longer labelled with the hidden Describer heading.
- Re-ran the 35-screen rendered layout probe: no route produced horizontal overflow at the checked mobile widths, all route content retains 164 px bottom clearance, and every declared action/route/destination has a JavaScript handler.

### Exact visual assets still required

The following finished, locally approved assets are required before the affected entries can be marked complete. They were not replaced with CSS placeholders:

1. Artwork Conversations: a distinct vintage artwork-study/gallery-detail illustration, separate from `chat-illustration.jpg`.
2. My Messages: a finished antique letter or correspondence-desk illustration.
3. My Friends: a finished classical cameo or visitor-portrait illustration.
4. Blind legacy catalogue: a non-spoiler listening/voice engraving only if the unused `blind-list` route is retained.

## Earlier consolidated repair closure — 18 October 2026

This section records the narrower repair pass that preceded the full-site acceptance checklist above. Where its status differs, the newer 35-screen checklist is authoritative.

Production CSS was subsequently repaired under the approved audit-driven repair task. Statuses below use browser evidence only for `FIXED`; source-only changes remain `UNVERIFIED`.

| Original finding | Status | Repair / evidence |
|---|---|---|
| P1 · Chat 320px number/title collision | FIXED | Catalogue markers now occupy a real grid column. Browser-checked with all four real titles at 320, 375 and 430 px. |
| P1 · Chat final-card/navigation obstruction | FIXED | Shared inner screens now reserve 164px plus the safe-area inset. At the true 320px scroll end, My Friends and Museum check-in are completely above the fixed navigation. Also checked at 375 and 430 px. |
| P1 · Blind Describer missing visual | FIXED | Describer now uses a dedicated right-side crop of the existing non-spoiler gallery illustration; Guesser retains the distinct interpretation scene. Both were browser-checked together at 430 px. |
| P1 · Chat artwork motif duplicated | ASSET-BLOCKED | Existing crops were retained rather than substituting challenge art. Needed asset: 800×533, non-identifying framed artwork-study or gallery-detail scene, composed for a right-side 4:3 crop. |
| P1 · Messages motif placeholder | ASSET-BLOCKED | No suitable finished letter artwork exists locally. Needed asset: 800×533 antique letter on a curator desk, ivory/walnut/gold, composed for a right-side crop. |
| P1 · Friends motif placeholder | ASSET-BLOCKED | No suitable finished portrait artwork exists locally. Needed asset: 800×533 anonymous classical cameo or botanical portrait engraving, composed for a right-side crop. |
| P1 · Find Players double portrait | UNVERIFIED | Removed `.player-card::before`; the existing `.profile-cameo` is now the sole identity medallion. Source verified; populated directory was not browser-captured. |
| P1 · Challenge/Explore fixed cover crops | UNVERIFIED | No blanket crop change was made. Representative portrait, landscape and unusual-ratio live cards were not completed in this pass. |
| P2 · Team entry text-only motifs | UNVERIFIED | Added coordinated OPEN ROOM / NEW FOLIO / PRIVATE POST archival plaques without changing buttons or handlers. Source verified only. |
| P2 · Blind challenge generic “B” | UNVERIFIED | Replaced the unexplained glyph with a compact CASE catalogue label. Source verified only. |
| P2 · Blind hidden-art star glyph | UNVERIFIED | Replaced the glyph visually with a framed LISTEN seal; hidden-art semantics and privacy are unchanged. Source verified only. |
| P2 · Identical Borrow Help rows | UNVERIFIED | Added distinct POST / ROOM / SALON archival marks through existing `data-help-method` values. Source verified only. |
| P2 · Generic chat-room oval motifs | UNVERIFIED | Public, artwork and private room icons now use distinct plaque, frame and correspondence silhouettes. Source verified only. |
| P2 · Creator upload plus symbol | UNVERIFIED | Replaced the generic plus with a compact PHOTO contact-sheet mark. Source verified only. |
| P2 · Oversized Correspondence header | FIXED | Reduced header padding, title scale, folio size and mobile gaps. Browser-checked at 320, 375 and 430 px. |

Closure count: **4 FIXED · 3 ASSET-BLOCKED · 8 UNVERIFIED · 0 OPEN**.

Browser coverage for this repair was deliberately focused: Correspondence at 320/375/430 px (including the true 320px scroll end) and Blind role selection at 430 px. Chrome reported no application console errors; the only visible console message came from an installed browser extension. The full 35-route visual regression and populated Team Waiting Room states were not browser-verified in this repair pass.
