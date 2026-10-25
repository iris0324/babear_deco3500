# Design — Borrowed Eyes

This folder records how our DECO3500 project developed from individual artwork interpretation towards **human connection through art**.

Our design opportunity is to use artworks as **shared conversation anchors**. Art gives visitors a starting point to exchange interpretations and, potentially, share feelings, memories, and personal experiences. The deeper ambition is to understand **the people behind the perspectives**. This is a design goal, not an outcome already established by testing.

Our iterative process is:

**Research → Concept → Prototype → Evaluation → Revision**

## Design Iterations

| Iteration | Concept                      | Main development                                             |
| --------- | ---------------------------- | ------------------------------------------------------------ |
| **1**     | Art Persona                  | Playful prompts encouraged observation and personal interpretation; direct social interaction was limited. |
| **2**     | Borrowed Eyes (asynchronous) | Artwork fragments, clues, comments, and contributions allowed one visitor's perspective to shape another's experience. |
| **3**     | Borrow the Eyes + Blind Eyes | Two core games support individual/team artwork exploration and anonymous paired conversation, with supporting social and creation features. |

### Iteration 1 — Art Persona

Art Persona encouraged visitors to observe artwork details and develop their own interpretations without pressure to find a single correct meaning. Early evaluation suggested that the experience supported reflection but offered limited visitor-to-visitor interaction.

- [Iteration 1 Design](Design_Iteration_1.md)

### Iteration 2 — Borrowed Eyes

The second iteration introduced asynchronous visitor contributions through a **Visual Fragment**, **Clue**, **Visitor Perspective**, and a new **Contribution** for future visitors.

The earlier paper-prototype sequence was:

**Choose → Find → Interpret → Compare → Re-observe → Contribute**

It enabled indirect interaction across time without requiring strangers to talk.

- [Iteration 2 Concept](Design_Iteration_2/Concept.md)
- [Low-Fidelity Prototype](Design_Iteration_2/Low_Fidelity_Prototype.md)
- `Design_Iteration_2/Borrowed_Eyes_Paper_Prototype_Testing_Pack.pdf` — testing materials

### Iteration 3 — Two Core Games

**1. Borrow the Eyes**

- **Play Alone:** Visitors explore a cropped artwork and another visitor's Personal Comment independently.
- **Play Together (Face-to-Face / Team):** Members write Personal Comments to unlock different clues, share information, coordinate their search, and make a collective decision.

**2. Blind Eyes**

Two visitors choose a shared interest tag and complementary roles, then communicate through an anonymous private chat. The **Describer** sees the target artwork; the **Guesser** asks questions and submits formal artwork guesses.

The latest design allows unrestricted ordinary chat, while incorrect formal submissions consume attempts and unlock clues. This differs from the **three-factual-question limit** used during the 14 October paper testing.

**Supporting features:** **Live Gallery Chat** helps visitors find partners and form teams; **Leave Your Eyes** supports creating challenges for future visitors; the **Gallery Map** supports browsing and area-based clues. These are not additional core games.

#### Iteration 3 Files

- [**Concept**](Design_Iteration_3/Concept.md) — research rationale, design choices, testing findings, limitations, and implementation scope
- [**Interaction Flow**](Design_Iteration_3/Interaction_Flow.md) — current gameplay, supporting features, rules, and version boundaries
- [Round 3 Testing Results](../Evaluation/Round_3/Testing_Results.md)
- [Survey Results](../Evaluation/Round_3/Survey_Results.md) and [Survey Findings](../Evaluation/Round_3/Survey_Findings.md)
- [Iteration 3 Research](../Research/Iteration3/Literature_And_Findings.md)
- [Design Opportunity](../Requirements/Design_Opportunity.md)

## What Testing Told Us

Four Blind Eyes paper-prototype rounds and one three-person Face-to-Face session on 14 October 2026 explored communication, interpretation, and cooperation. Participants exchanged clues and perspectives, but some conversations remained focused on finding the correct artwork. Participation comfort also varied.

**Finding the artwork is not the same as understanding another person.** These formative findings informed later design choices, but do not validate the revised digital rules or demonstrate lasting social connection.

## Current Prototype

The active build is [`Prototype/functional-prototype/`](../../Prototype/functional-prototype/).

| Feature                | Current implementation                                       |
| ---------------------- | ------------------------------------------------------------ |
| Borrow the Eyes — Solo | Local interactive gameplay                                   |
| Borrow the Eyes — Team | Local demonstration, not the Blind Eyes online multiplayer system |
| Blind Eyes             | Supabase-backed anonymous matching, private room chat, and game state |
| Live Gallery Chat      | Local demonstration of wider social features                 |
| Leave Your Eyes        | Browser-local challenge creation                             |
| Location verification  | Permission/demo flow; no reliable physical gallery-boundary check |

`Prototype/Final Prototype/` is an earlier reference build despite its folder name.

See [Prototype README](../../Prototype/README.md) and [active build README](../../Prototype/functional-prototype/README.md).

## Next Steps

Future evaluation should investigate whether visitors respond to others' perspectives, feel comfortable sharing or disagreeing, and continue talking after an artwork is revealed. Real-world deployment would also require stronger accessibility, privacy, location-verification, and moderation safeguards.

## Related Folders

- [Research](../Research/)
- [Requirements](../Requirements/)
- [Evaluation](../Evaluation/)
- [Poster](../Poster/)
- [Prototype](../../Prototype/)
