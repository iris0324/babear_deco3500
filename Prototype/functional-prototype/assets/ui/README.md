# Homepage-only illustrations — Phase 1.6

Generated using the built-in imagegen tool. These are decorative commissioned prototype visuals, not challenge-library artworks. All images were inspected before integration, copied into this project, and resized/compressed to JPEG using macOS sips. The original generated PNGs remain in the generation output folder.

Files: `museum-hero.jpg`, `borrow-illustration.jpg`, `blind-illustration.jpg`, `chat-illustration.jpg`, `leave-illustration.jpg`.

## Prompt set

Each complete prompt is the common style prompt followed by the corresponding subject prompt below.

### Common style prompt

Use case: illustration-story. Asset type: homepage illustration for an elegant museum journal. Create a standalone wide 3:2 fine-art illustration, subtle aged oil paint on linen and antique book illustration, restrained painterly detail, soft chiaroscuro, warm ivory, moss forest green, muted brass, warm stone, quiet museum atmosphere. Sophisticated and natural, no cartoon, no vector look, no text or lettering, no labels, no typography, no watermark, no UI. Keep main subject in middle two thirds so it reads as a small wide card. Do not reproduce any existing artwork. 

### borrow

Subject: Borrow the Eyes. Close view of two anonymous hands holding a small paper crop of a botanical painting and a delicate antique brass magnifying glass, comparing that crop with a larger gold-framed botanical painting hanging on a museum wall behind. Clearly express using another visitor's clue to find the full artwork. One hand and small paper in foreground, framed artwork beyond, meaningful relationship between crop and original. No faces or portraits, no readable handwriting.

### blind

Subject: Blind Eyes, shared two-person looking and interpretation. Two pairs of anonymous hands from opposite sides of a museum reading table, one pair gestures toward a small gilt-framed abstract botanical study while the other holds a card partly covered by a soft dark green ribbon, suggesting one describes and the other guesses. Two visitors implied only through hands and dark sleeve cuffs, no faces or heads. A quiet paired composition with a visual connection between the hands and artwork, atmospheric gallery wall beyond, no writing.

### chat

Subject: Live Gallery Chat. A small group of THREE visitors in a classical art gallery seen from behind and at a distance, clearly gathered in a conversational semicircle with expressive hand gestures as they exchange thoughts about a gold-framed painting. People interacting with each other, one pointing gently toward a picture, the others listening. Figures small, softly painted silhouettes, faces never visible or detailed. Intimate museum community atmosphere, arched doorway and muted green walls, not an empty room.

### leave

Subject: Leave Your Eyes. A warm museum writing desk with a cropped anonymous hand leaving a small handwritten observation card and a sketch of a painting detail pinned to a linen noticeboard, an elegant fountain pen, a small antique brass clip and a botanical sprig. Clearly suggest a personal clue and perspective left behind for the NEXT visitor. No legible text, only small gestural cursive marks. A beautiful tactile still life, ivory paper and deep green journal, no faces or portraits.

### hero

Asset type override: wide horizontal hero painting, 3:1 panoramic composition. Subject: a beautiful atmospheric classical museum arcade with graceful stone arches, warmly lit doorways, antique brass picture frames with subtle abstract botanical studies, a dark moss green wall, an empty wooden viewing bench and a small archival folio. Painterly oil-on-linen texture, not photorealistic, no people or faces. Compose all interesting architectural imagery in the RIGHT half, keep LEFT 45 percent as dark forest green atmospheric wall/shadow with few objects, usable for real HTML text overlay. No actual text.

## Review notes

Reviewed the homepage in Chrome at desktop, 375 × 812 and 320 × 740. At 375px the four CTAs fit above the fixed navigation. At 320px the page needs a short scroll; bottom padding keeps the lower cards and footer reachable above the navigation. All four homepage destinations, Home/Chat/Explore/Profile navigation, Back, and keyboard focus to the first card were checked. Static checks confirm original routes/actions, non-homepage markup and journey styles are preserved. JavaScript, challenge data and storage files were not edited. Explore retains its existing `games` destination and that page's original Games title.

Still worth reviewing on a physical phone: small illustration detail, comfortable text size, and safe-area spacing. The Blind Eyes scene is deliberately symbolic; confirm that its paired hands and partially covered card express the intended two-person game. No new feature logic was implemented.

