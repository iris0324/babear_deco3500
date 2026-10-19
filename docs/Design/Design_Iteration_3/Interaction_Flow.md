# Borrowed Eyes Museum — Interaction Flow (Latest Design)

## 1. Overview

Borrowed Eyes Museum is designed around a shared artwork: visitors can explore another person's detail and interpretation, communicate with other visitors, and contribute their own perspective for future challenges. The latest interface contains four main experiences:

- **Borrow the Eyes:** Find the original artwork behind another visitor's cropped detail, either alone or with a team.
- **Blind Eyes:** Two visitors communicate with asymmetric visual access. One sees the artwork (Describer); the other does not (Guesser).
- **Live Gallery Chat:** Visitors verified as being inside the gallery can meet, message, and form teams.
- **Leave Your Eyes:** A visitor creates a new challenge using an artwork, a cropped detail, a Personal Comment, and ordered clues.

The **Gallery Map** supports browsing and location-based clues, while **account and location flows** control access to relevant features.

### High-level navigation

```text
Welcome → Sign Up / Log In → Location Request → Home
                                            ├── Borrow the Eyes → Solo or Team Challenge
                                            ├── Blind Eyes → Role → Tag → Match → Chat / Guess
                                            ├── Live Gallery Chat → Visitor / Team Chat → Challenge
                                            ├── Leave Your Eyes → Create and Publish Task
                                            └── Gallery Map → Browse Areas and Artwork Catalogue
```

## 2. Account, Login and Location Verification (Board 1)

1. **Welcome:** The visitor chooses **Log In** or **Sign Up**.
2. **Sign Up:** Enter display name, email, password and confirmation; agree to Terms of Service and Privacy Policy; create an account.
3. **Log In:** Enter email and password, with a **Remember me** option. **Forgot password?** opens a separate reset flow.
4. **Password reset (branch):** Enter email → request reset link → receive a generic confirmation message → return to Log In.
5. **Enable Location:** The site explains that location is used to verify gallery access for on-site social features. Visitors can choose **Allow Location** or **Not Now**.
6. **Browser permission:** The browser may show a location permission prompt.

**Location outcomes**

| Outcome | Screen / action | Access consequence |
|---|---|---|
| Permission granted and user is inside the gallery | **Inside Gallery (Verified)** → Enter Gallery | On-site features available |
| Permission denied or location unavailable | **Location Unavailable** → Retry / Open Settings / Continue with Limited Access | Verification-dependent features remain limited |
| Permission granted but user is outside the gallery | **Outside Gallery** → Retry Location / Continue Browsing | Visitor can browse online; on-site team play and live chat are unavailable |

The Home screen presents **Borrow the Eyes**, **Blind Eyes**, **Live Gallery Chat**, and **Leave Your Eyes**. Location verification is an *intended product gate*, not a guarantee of reliable real-world indoor positioning.

## 3. Borrow the Eyes — Solo and Team Challenge (Board 2)

### 3.1 Browse and choose

1. **Browse Artwork Fragments:** Explore cropped details left by visitors. The browse screen offers categories such as landscapes, people, and still life.
2. **Task Detail:** View the enlarged fragment, its difficulty rating and the creator's **Personal Comment**. Choose **Play Alone** or **Play Together**.

### 3.2 Solo route

```text
Browse → Task Detail → Play Alone → Use available clue(s)
→ Explore physical artworks / map → Submit answer
→ Success or Retry / No attempts left
```

The five-star example shows **one player, five attempts, and Q1 unlocked**. This is a continuation of the earlier tested solo/asynchronous Borrowed Eyes approach; the *current screens and exact game rules* are the updated design and should not be confused with what was tested in Iteration 2.

### 3.3 Team route

3. **Find / Create Team:** The visitor must be verified as inside the gallery to join an existing team or create a new one.
4. **Team Lobby:** Review members, challenge difficulty, team size and the shared attempts count. Team membership is locked when the challenge starts; the team may not exceed the challenge's star difficulty.
5. **Personal Comment:** Each player writes one original comment about the fragment; a submitted comment unlocks that player's assigned clue. Repeated comments do not unlock extra clues.
6. **Your Clue and Team Clues:** For a five-star task, clues **Q1–Q5** go from abstract to concrete. Members initially see their own assigned clue; other members' clues remain private until shared. Any remaining clues are not automatically revealed to the team.
7. **Team Chat:** Members exchange interpretations and their unlocked clues. The illustrated three-person team has three collective attempts.
8. **Gallery Map:** The team can inspect the gallery's four areas. The artwork's correct area is not highlighted until **Q5** is unlocked.
9. **Submit Your Answer:** Enter the artwork title or catalogue ID; submissions use the team's shared attempts.
10. **Wrong Answer:** Reduce the number of remaining attempts; **no additional clue is awarded for an incorrect answer** in Borrow the Eyes. Return to the task or team chat and reconsider.
11. **Correct Answer:** Reveal the complete artwork. The board specifies **five stars for each player** on successful completion of a five-star challenge (rewards are not split).
12. **Failed (No Attempts Left):** Reveal the correct artwork with no reward, then offer another task or return Home.

### 3.4 Borrow the Eyes rules shown on the board

For a **five-star challenge** with a team of size \(N\):

- **Team attempts = 6 − N**.
- **Initially unlocked clues = N**, one per member after their own Personal Comment.
- Team size must not exceed difficulty (in stars).
- One Personal Comment per account is sufficient to unlock one clue.
- **Q5** is the gallery-area clue and becomes available only when unlocked under the relevant mode's rules.

| Players | Team attempts (5-star) | Initially available clues |
|---:|---:|---:|
| 1 | 5 | 1 (Q1) |
| 2 | 4 | 2 (Q1–Q2) |
| 3 | 3 | 3 (Q1–Q3) |
| 4 | 2 | 4 (Q1–Q4) |
| 5 | 1 | 5 (Q1–Q5) |

**Note:** A player can still inspect the public catalogue map, but the **active challenge** must not reveal the target's exact artwork, name, image, or location before the proper reveal. This distinction is part of the proposed design.

## 4. Blind Eyes — Two-Person Asymmetric Challenge (Board 3)

1. **Choose Role:** One player is the **Describer**, who can see the target artwork. The other is the **Guesser**, who cannot see the artwork.
2. **Choose a Matching Tag:** Select a tag derived from creators' Personal Comments in *Leave Your Eyes* (e.g., “Reminds me of my hometown”).
3. **Find a Matching Partner:** Pair players who selected the same tag; both must accept the match.
4. **Match Summary:** Confirm the shared tag, difficulty, number of clues, and attempts before beginning.
5. **Simultaneous Chat:** The Describer sees the artwork without its title or location and can describe it. The Guesser sees only the conversation and asks questions; the Guesser has no artwork image. Discussion is not subject to a fixed question-count limit in this updated design.
6. **Submit a Formal Guess:** The Guesser submits an artwork title or ID. This is a counted attempt, separate from ordinary chat messages.
7. **Incorrect Guess:** One attempt is consumed and the next clue unlocks, starting with **Q1**.
8. **Clue History:** Clues accumulate after wrong formal submissions in order: **Q1 Abstract → Q2 Subject / Story → Q3 Visual / Colour → Q4 Relation / Composition → Q5 Gallery Area**.
9. **Final Attempt:** After the fifth incorrect guess, Q5 becomes visible and there is one final submission.
10. **Success:** Reveal the original artwork; the five-star example awards five stars **to both players**. They may continue chatting or play again.
11. **Failure:** After the sixth incorrect guess, reveal the correct artwork without a reward. Continue Chat or Find New Partner.

### Blind Eyes five-star example

```text
Match and chat → Guess 1
  ├── Correct → Reveal + reward to both
  └── Wrong → Q1 → Guess 2
                    └── Wrong → Q2 → Guess 3
                                      └── Wrong → Q3 → Guess 4
                                                        └── Wrong → Q4 → Guess 5
                                                                          └── Wrong → Q5 (area) → Final Guess 6
                                                                                                      ├── Correct → Reveal + reward
                                                                                                      └── Wrong → Reveal, no reward
```

**Rules:** Five-star Blind Eyes has **six formal submissions** (five clues revealed after failures plus one final guess). Unlike Borrow the Eyes team mode, its attempts do **not** decrease with group size because it is always a two-person mode. This differs from the **three-factual-question limit used in the October 14 paper prototype testing**; the new mechanism is a subsequent design revision, not an observed testing result.

## 5. Live Gallery Chat — Location-Gated Social Interaction (Board 4)

1. **Enter Gallery Chat:** Open from Home or a gallery QR entry point.
2. **Allow Location:** Request location access and explain why in-gallery verification is needed.
3. **Inside Gallery Verified:** Verified visitors may enter Live Gallery Chat.
4. **Outside / Permission Off:** Show that entry is blocked; offer retry, location settings, or return Home.
5. **Gallery Room Visitor List:** Browse visitors, identify who is looking for a team, and view the public gallery room.
6. **Visitor Profile:** View a visitor's public profile and optionally send a message, invite them to a team, report or block.
7. **Create Team:** Select a challenge, set a meeting area and invite participants.
8. **Group Conversation:** Team members discuss, coordinate a meeting, and choose when to enter the challenge.
9. **Borrow the Eyes Lobby:** Transfer into the challenge. Each member must submit a Personal Comment to unlock their own clue.
10. **Location Access Expired:** Once the visitor leaves the gallery, the live conversation becomes **read-only** until their location is verified again.

**Design status:** Live presence, location permissions, private messages, invitations, reporting and blocking are detailed in the interface flow, but should not be described as implemented or validated without corresponding code and test evidence.

## 6. Leave Your Eyes — Creating and Publishing a Challenge (Board 5)

1. **Create Task:** Upload an image of the complete artwork (PNG/JPG, up to 10 MB in the mock-up).
2. **Artwork Information:** Enter the artwork title and a unique catalogue ID, which are hidden from players during active challenges.
3. **Select Crop Area:** Choose the detail to share; the selected area determines difficulty.
4. **Difficulty Preview:** Review the crop percentage, star difficulty, clue count and answer-attempt rules.
5. **Personal Comment:** Write an original association or interpretation. This becomes the **task name** and a matching tag used in Blind Eyes.
6. **Q1 Abstract:** Describe a feeling, atmosphere or memory.
7. **Q2 Story:** Describe a scene or story it evokes.
8. **Q3 Visual:** Describe colours, shapes or textures.
9. **Q4 Relation:** Explain how the detail relates to surrounding elements.
10. **Q5 Gallery Area:** Select one of four gallery areas on the floor plan. This is the required most concrete location clue.
11. **Preview Task:** Check the artwork, crop, title/tag, questions and location area.
12. **Publish Success:** Make the challenge available for others to explore.

### Crop-to-difficulty rules

| Crop proportion of full artwork | Difficulty | Questions available |
|---|---|---|
| 0% | Invalid | Crop must be greater than zero |
| Greater than 0% and less than 20% | 5 stars | Q1–Q5 |
| 20% to less than 40% | 4 stars | Q2–Q5 |
| 40% to less than 60% | 3 stars | Q3–Q5 |
| 60% to less than 80% | 2 stars | Q4–Q5 |
| 80% to 100% | 1 star | Q5 only |

Exactly **20%** counts as **4 stars**. Smaller cropped details reveal more clues in the current rules. In the one-star alternate flow, the experience skips Q1–Q4 and proceeds from Personal Comment directly to the required gallery-area clue (Q5).

### Attempt formulas described by the designs

- **Blind Eyes:** difficulty \(D\) stars → **\(D+1\) formal guesses** (e.g., five stars → six submissions).
- **Borrow the Eyes:** number of players and difficulty jointly determine attempts. The five-star design explicitly shows **6 − team size**, and its published example uses **difficulty + 1 − players**. Apply a valid lower bound and team-size restrictions in implementation; the boards should be treated as the authority for each stated example until edge cases are specified.

## 7. Gallery Map — Catalogue and Location Clue (Board 6)

The map has **three distinct purposes**, which must not be conflated:

### A. Public gallery catalogue

1. Open the full gallery map divided into **four areas**.
2. Select an area to browse artwork listings.
3. Open an artwork detail page with its catalogue information.
4. Return to the map.

This is a **browsing** experience, not an automatic answer reveal within an active game.

### B. Publisher assigns Q5

During *Leave Your Eyes*, the creator selects and saves the area containing the artwork. The saved area becomes **Q5**, the final location clue for Borrow the Eyes or Blind Eyes challenges.

### C. Active challenge uses Q5

1. **Before Q5:** The active game map shows the four areas but does not highlight the target or reveal its name/image.
2. **When Q5 unlocks:** Highlight the correct **quarter/area**, not the exact hanging position.
3. **Final submission:** Player enters the name or catalogue ID. The gallery area narrows the search but does not give the solution.

## 8. Relation to the Design Opportunity

The interface is intended to use artworks as **shared conversation anchors**, with three complementary paths:

| Experience | Intended social mechanism | What should be evaluated |
|---|---|---|
| Solo Borrow the Eyes | Explore a past visitor's detail and Personal Comment asynchronously | Close looking, reflection and comparison |
| Team Borrow the Eyes | Different members contribute comments and share separate clues | Information sharing, coordination and balanced contributions |
| Blind Eyes | Describer and Guesser resolve an information gap through dialogue | Explanation, clarification, perspective exchange and post-reveal reflection |
| Live Gallery Chat | Meet others and form teams while on site | Social comfort, consent, coordination and participation |
| Leave Your Eyes | Turn an interpretation into a challenge for later visitors | Quality and diversity of personal contributions |

## 9. Evidence and Version Boundaries

- **Iteration 2:** The earlier Borrowed Eyes Solo / asynchronous Card–Clue–Comment concept underwent prototype testing. Its evidence supports the earlier approach, not automatic validation of every screen or rule in these updated boards.
- **14 October 2026:** Blind Eyes was tested in four rounds and Face-to-Face in one three-person session. The paper-test question limit and interaction differed from the current digitally designed flows.
- **Latest boards:** Account management, location verification, matchmaking, live chat, staged clue release, star rewards, upload/publishing and gallery-area logic are presented here as **intended design flows**. Functional implementation and usability must be confirmed separately.
- **Design-to-test distinction:** Observed communication, coordination and task performance are not equivalent to demonstrated long-term or meaningful human connection.

## 10. Open Questions for the Next Evaluation

1. Do players understand the different rules for **Solo**, **Borrow the Eyes team**, and **Blind Eyes**?
2. Does sharing unique clues lead every team member to contribute, or can one participant still dominate?
3. After a reveal, do visitors discuss *why* they saw the artwork differently, rather than only celebrating a correct answer?
4. Are area clues useful without prematurely revealing the target artwork?
5. Are crop-based difficulty and attempt counts predictable and fair, especially at boundary values and smaller difficulties?
6. Can on-site location gating, privacy explanations and limited-access paths be understood and used reliably?
7. Is the publishing flow clear enough to produce useful Personal Comments and distinct Q1–Q5 clues?