# Borrowed Eyes — Interaction Flow (Iteration 3)

## 1. Project Structure

Borrowed Eyes uses artworks as **shared conversation anchors**. Finding an artwork is a starting point for exchanging perspectives and, potentially, learning about other visitors' experiences.

The final concept has **four parallel main features**:

| Main feature | Participation and interaction |
|---|---|
| **Borrow the Eyes** | Play Alone or Play Together: explore fragments and perspectives; team members write personal interpretations to unlock and share private clues before a collective guess. |
| **Blind Eyes** | Two matched visitors communicate through complementary Describer and Guesser roles. |
| **Group Chat** | Gallery communication, teammate finding and coordination. |
| **Leave Your Eyes** | Artwork-based challenge creation for future participants. |

These features are equally important conceptually, without a fixed sequence or hierarchy controlled by Group Chat. Their implementation and evaluation status differ. The Gallery Map and account/location flows support navigation. Face-to-Face refers to a tested collaborative activity rather than a fifth main feature.

```text
Welcome → Login / Sign Up → Location Request → Home
    ├── Borrow the Eyes → Play Alone / Play Together
    ├── Blind Eyes → Role → Interest Tag → Match → Private Chat → Formal Guess
    ├── Group Chat → Meet Visitors → Organise Team
    ├── Leave Your Eyes → Create Artwork Challenge
    └── Gallery Map → Browse Catalogue / Areas
```

## 2. Entry, Account and Location (Board 1)

1. Choose Login or Sign Up. The proposed sign-up flow includes a display name, email, password, and agreement to terms.
2. Review the location-permission explanation. Visitors may allow access or continue with limited functionality.
3. The proposed flow distinguishes visitors inside the gallery, outside it, and those whose location is unavailable.
4. The Home screen provides the four parallel main features and navigation tools.

**Implementation boundary:** Browser location permission does not reliably verify physical presence inside the gallery. Account, location and access-control screens should not be presented as a production-ready security system.

## 3. Borrow the Eyes — Play Alone / Play Together (Board 2)

### 3.1 Choose a challenge

1. Browse cropped artwork fragments and categories.
2. Open a task to see its fragment, difficulty, and creator's **Personal Comment**.
3. Choose **Play Alone** or **Play Together**.

A **Personal Comment** is a feeling, association, or interpretation. A **Clue** helps identify the artwork. These serve different purposes.

### 3.2 Play Alone

```text
Browse → Task Detail → Play Alone → Available Clue
→ Explore Gallery / Map → Submit Artwork Title or ID
→ Correct: Reveal / Reward
  or Wrong: Retry if Attempts Remain
  or No Attempts: Reveal Without Reward
```

The five-star example gives one visitor five attempts and starts with Q1. The latest screen shows the creator's comment at the task-detail stage; this differs from the independent-interpretation-first sequence in the earlier Iteration 2 paper prototype.

**Social intention:** An asynchronous encounter with another visitor's way of seeing the artwork, without requiring direct conversation.

### 3.3 Play Together (Face-to-Face / Team)

```text
Select Task → Create / Join Team → Lobby
→ Each Member Writes One Personal Comment
→ Each Member Unlocks One Assigned Clue
→ Share Clues / Discuss / Coordinate Search
→ Submit Shared Answer
   ├── Correct → Reveal + Reward for Each Member
   ├── Wrong, Attempts Remain → Discuss and Retry (No New Clue)
   └── No Attempts → Reveal Without Reward
```

Members initially see their own clue, and the team must exchange information. Team size cannot exceed the star difficulty. Wrong answers consume shared attempts but **do not unlock additional clues**.

For the documented **five-star** example, team attempts = `6 − N` and initial clues = `N`, where `N` is the number of team members:

| Members | Shared attempts | Initially available clues |
| ------: | --------------: | ------------------------- |
|       1 |               5 | Q1                        |
|       2 |               4 | Q1–Q2                     |
|       3 |               3 | Q1–Q3                     |
|       4 |               2 | Q1–Q4                     |
|       5 |               1 | Q1–Q5                     |

The fifth clue, Q5, gives the gallery area rather than the exact artwork position. Lower-difficulty boundary cases should be checked against the actual implementation.

**Social intention:** Communication (sharing interpretations and clues), coordination (planning a search), and cooperation (making a shared decision). The current Team route is a **local interactive demonstration**, not the online multiplayer system used by Blind Eyes.

## 4. Blind Eyes — Anonymous Matched Conversation (Board 3)

1. Choose **Describer** or **Guesser**.
2. Choose an interest tag, based in the design on Personal Comments.
3. Match with a visitor who chose the same tag and the complementary role; both accept.
4. Enter an anonymous **one-to-one private chat**.
5. The Describer sees the artwork but not its title or location. The Guesser sees no target image and asks questions.
6. Ordinary messages are **unlimited** in the latest design. Only a **formal artwork submission** consumes an attempt.
7. Each incorrect formal submission unlocks the next clue; participants can continue chatting.
8. Correct answers reveal the artwork and award the designated reward to both players. Exhausted attempts reveal it without a reward.

Clue sequence:

| Clue | Information                   |
| ---- | ----------------------------- |
| Q1   | Abstract atmosphere / feeling |
| Q2   | Subject / story               |
| Q3   | Visual features / colour      |
| Q4   | Relation / composition        |
| Q5   | Gallery area                  |

For a **five-star challenge**, the design specifies **six formal submissions**: an initial guess, five clues released after successive incorrect guesses, and one final guess after Q5. The broader intended formula is `difficulty + 1` formal submissions.

**Version distinction:** The **14 October paper testing** used a **three-factual-question limit**, with unlimited perspective questions. The current unrestricted-chat and formal-guess system is a later design revision, **not a tested finding**.

**Social intention:** A shared interest and an information gap encourage explanation and discussion. Whether this leads to personal understanding requires further evaluation.

**Implementation boundary:** Blind Eyes uses Supabase for anonymous sign-in, online matching, room chat, and server-side game state. Successful two-phone matching does not validate all usability, privacy, or social outcomes.

## 5. Group Chat (Board 4)

```text
Home / Gallery QR → Request Location
→ Proposed Gallery Verification → Visitor List / Gallery Room
→ Message / Invite → Form Team → Borrow the Eyes Lobby
```

The design includes visitor profiles, team invitations, meeting areas, and proposed report/block and access-expiry behaviour.

**Purpose:** Provide direct gallery communication, partner finding and activity coordination as one of the four main features.

**Implementation boundary:** Wider visitor chat, profiles, team invitations, and related safety controls are local demonstrations. Reliable gallery-boundary verification and operational moderation are not established.

## 6. Leave Your Eyes (Board 5)

```text
Select / Upload Artwork → Enter Title and Catalogue ID
→ Choose Crop → Review Difficulty
→ Write Personal Comment / Matching Tag
→ Write Relevant Clues → Select Q5 Gallery Area
→ Preview → Publish Locally
```

Clues move from abstract associations towards more concrete visual and location information.

| Crop proportion            | Difficulty | Clues                       |
| -------------------------- | ---------- | --------------------------- |
| 0%                         | Invalid    | Must select a non-zero crop |
| Greater than 0%, below 20% | 5 stars    | Q1–Q5                       |
| 20%, below 40%             | 4 stars    | Q2–Q5                       |
| 40%, below 60%             | 3 stars    | Q3–Q5                       |
| 60%, below 80%             | 2 stars    | Q4–Q5                       |
| 80%–100%                   | 1 star     | Q5                          |

Exactly 20% belongs to the four-star band. Smaller crops are assigned higher difficulty in the current design.

**Implementation boundary:** User-created tasks are saved **locally in the browser**, not automatically published to a shared online challenge dataset.

## 7. Gallery Map — Supporting Tool (Board 6)

The map has three roles:

1. **Public catalogue:** Browse four gallery areas and artwork listings.
2. **Creator workflow:** Assign the target's area as Q5.
3. **Active challenge:** Keep the target area hidden until Q5 unlocks; then show the area, not the exact artwork position or answer.

The public catalogue and active challenge's answer-reveal rules must be distinguished.

## 8. Social Design Rationale

| Experience             | Intended social mechanism                                 | Evaluation question                                          |
| ---------------------- | --------------------------------------------------------- | ------------------------------------------------------------ |
| Borrow the Eyes — Solo | Asynchronous encounter with another visitor's perspective | Does it encourage reflection and re-observation?             |
| Borrow the Eyes — Team | Shared clues, self-coordination, collective decisions     | Whose contributions influence the outcome?                   |
| Blind Eyes             | Anonymous interest matching and conversation              | Do players respond to interpretations, or use them only to solve the task? |
| Group Chat      | Finding partners and organising participation             | Can visitors join, decline, and leave comfortably?           |
| Leave Your Eyes        | Personal contributions for future visitors                | Do comments express meaningful associations and provide useful clues? |

The deeper design goal is **understanding people through art**, not only understanding artworks through other people. Personal sharing should remain voluntary.

## 9. Evidence and Version Boundaries

- **Iteration 2:** The asynchronous paper prototype was tested, but its exact sequence differs from the latest interface.
- **14 October 2026:** Four Blind Eyes paper-prototype rounds and one three-person Face-to-Face activity examined conversation and cooperation. Face-to-Face informed **Borrow the Eyes Team**, not a third independent mode.
- **Latest design:** Revised guessing rules, rewards, location gating, gallery chat, and publishing should be described according to what is actually implemented or simulated.
- **Task success ≠ social success:** Finding an artwork does not prove personal sharing, mutual understanding, or meaningful human connection.

See [Iteration 3 Concept](Concept.md) and [Round 3 Testing Results](../../Evaluation/Round_3/Testing_Results.md).

## 10. Next Evaluation Questions

1. Do visitors understand the four main features and their participation routes?
2. Does each team member have a meaningful opportunity to contribute?
3. Does the revised Blind Eyes guessing mechanism encourage interpretation beyond factual identification?
4. Do visitors discuss different perspectives after the artwork is revealed?
5. Are privacy, consent, and the ability to leave an interaction sufficiently clear?
6. Are clue and attempt rules consistent across difficulty levels?
7. Can the map help navigation without revealing the answer too early?
8. What would be needed for reliable location verification, accessibility, and moderation?
