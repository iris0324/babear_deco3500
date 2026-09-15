# Borrowed Eyes — Round 2 Prototype Testing

## Overview

Round 2 tested the **Borrowed Eyes** paper prototype after the project moved away from the earlier **Art Persona** concept.

The purpose of this iteration was to examine whether one visitor's observation could meaningfully shape how another visitor searched for, observed, and interpreted an artwork. The test also explored whether participants could move from receiving another visitor's perspective to leaving a new visual clue and interpretation for a future visitor.

The prototype followed a cumulative asynchronous interaction loop:

**Find → Interpret independently → Reveal another perspective → Re-observe / compare → Contribute for a future visitor**

This iteration focused on the social interaction itself rather than visual polish or technical implementation.

---

## Testing Objectives

Round 2 investigated the following questions:

1. Can participants use a visitor-created visual fragment and clue to locate an artwork?
2. Can participants form their own interpretation before seeing another visitor's perspective?
3. Does revealing another visitor's perspective encourage participants to look again at the physical artwork?
4. Is agreement necessary for another visitor's perspective to be useful?
5. Can participants move naturally from receiving a perspective to contributing one for a future visitor?
6. What usability issues emerge from the clue structure and paper-prototype flow?

---

## Prototype Structure

### Stage 1 — Select a visual fragment

Participants first encountered a cropped visual fragment from an artwork.

The fragment was designed to create curiosity without revealing the complete artwork.

### Stage 2 — Use clues to find the artwork

Participants received a short first clue.

A second clue was available only if the participant needed additional guidance.

The intention was to preserve exploration while still allowing the activity to progress when the first clue was too ambiguous.

### Stage 3 — Interpret independently

Before any previous visitor comment was revealed, participants recorded:

- what they first noticed in the complete artwork;
- what the selected detail made them think or feel.

This sequencing was deliberate. It gave participants an opportunity to form their own interpretation before being influenced by another person's view.

### Stage 4 — Reveal and compare

The facilitator then revealed the previous visitor's interpretation.

Participants could indicate whether they:

- agreed;
- partly agreed;
- disagreed;
- noticed something different;
- noticed something new;
- reconsidered their interpretation;
- kept their interpretation the same.

Participants were also asked whether the previous visitor's perspective changed how they looked at the artwork.

### Stage 5 — Leave Your Eyes

Participants then became contributors.

They selected a different artwork, chose one visual detail, created a short clue, and left an interpretation for a future visitor.

This created the intended cumulative loop:

> one visitor leaves a trace → another visitor follows it → interprets the artwork → leaves a new trace for somebody else.

---

## Evidence Collected

The evidence set included:

- completed participant response sheets;
- completed **Leave Your Eyes** contribution sheets;
- facilitator observation notes;
- photographs of testing in the gallery;
- selected visual details and artwork fragments;
- two fully documented end-to-end interaction loops;
- additional handwritten participant responses.

Where exact participant wording was unavailable, facilitator summaries were treated as **paraphrases rather than direct quotations**.

---

# Key Findings

## Finding 1 — Another visitor's perspective can trigger re-observation of the physical artwork

Several participants returned their attention to the artwork after the previous visitor's perspective was revealed.

In the clearest documented case, a participant initially formed an independent interpretation, then looked back at the artwork after seeing the earlier comment and reported noticing details that had not been central to the first viewing.

Another participant stated that the other person's perspective did not fundamentally change her interpretation, but it made her pay more attention to a specific part of the artwork.

### Interpretation

The social value of Borrowed Eyes may not depend on persuading visitors to change their interpretation.

Instead, another visitor's perspective can act as an **attentional prompt** that encourages a second look.

### Design implication

The next prototype should make **re-observation** an explicit part of the interaction rather than treating the revealed comment as the end of the experience.

A stronger future flow would be:

**Interpret → Reveal perspective → Look again → Reflect**

---

## Finding 2 — Agreement is not necessary for another perspective to be valuable

Participants did not always agree with the interpretation they received.

One participant described an artwork as more tranquil than lonely. Another interpreted a work as mysterious and futuristic rather than restrained or dark.

However, disagreement did not automatically make the previous visitor's contribution useless.

In some cases, participants kept their original interpretation while still reporting that the other perspective gave them a different way to look at or appreciate the artwork.

### Interpretation

Borrowed Eyes should not aim to produce consensus.

Its value is better understood as **perspective expansion**: exposing visitors to another way of seeing while allowing them to retain their own reading.

### Design implication

The interface should avoid framing responses as right/wrong or successful only when people agree.

Future versions should support:

- **agree**;
- **partly agree**;
- **see it differently**;
- **noticed something new**.

The design goal is to broaden interpretation, not resolve it into one shared answer.

---

## Finding 3 — The strongest social effect may be attentional rather than interpretive

Across the results, participants sometimes reported that their interpretation stayed the same even though their attention shifted.

This distinction is important.

A previous visitor's perspective may affect:

- what part of the artwork someone notices;
- where they look next;
- what detail becomes meaningful;
- how long they continue observing;

without necessarily changing their overall interpretation.

### Interpretation

Measuring only whether a participant "changed their interpretation" is too narrow.

Borrowed Eyes may be successful even when a visitor maintains the same interpretation but sees the artwork more carefully.

### Design implication

Future testing should distinguish between:

1. **Interpretive change** — Did your interpretation change?
2. **Attentional change** — Did you look at something differently or notice something new?

Future evaluation could ask participants to point to the part of the artwork they looked at differently after seeing the other visitor's perspective.

---

## Finding 4 — Participants can move from viewer to contributor

The test demonstrated the intended transition from receiving another person's perspective to leaving material for somebody else.

Participants created new Borrowed Eyes contributions by:

- choosing a new artwork;
- selecting a specific visual detail;
- writing a clue;
- recording an interpretation.

Two documented interaction loops continued beyond the initial response stage and produced material that could be used by a later visitor.

### Interpretation

This is an important difference from the earlier Art Persona concept.

Rather than simply reading comments, visitors can become part of a growing chain of interpretation.

The system therefore has the potential to support a **cumulative asynchronous social loop**:

**Borrow → Interpret → Leave**

### Design implication

The contribution stage should remain a core part of the next prototype rather than becoming an optional secondary feature.

The value of Borrowed Eyes depends on visitors not only consuming perspectives, but also producing new traces for others.

---

## Finding 5 — Progressive clues are useful, but clue quality strongly affects the experience

Some participants found the intended artwork without additional help, while others required the second clue.

This suggests that the progressive clue structure is useful, but the quality and specificity of the first clue matters.

Very broad clues such as:

- "Beautiful woman"
- "Beautiful land"
- "Black and white"

may preserve ambiguity, but they can also make the search inefficient or unclear.

### Interpretation

The first clue needs to create curiosity without becoming either too vague or too revealing.

### Design implication

The next iteration should use a two-level clue structure:

**Clue 1 — evocative / interpretive**

> A quiet riverside scene where one small figure seems separated from the rest.

**Clue 2 — more concrete visual guidance**

> Look near the lower-left area of a large landscape.

This keeps the first stage exploratory while still providing a practical recovery mechanism.

---

# Experience Requirement Review

The Round 2 results were also used to review the current experience requirements.

| Experience Requirement | Round 2 Status | Evidence / Interpretation |
| --- | --- | --- |
| **ER1. Visitors should form their own interpretation before seeing other visitors' perspectives.** | Implemented; not yet comparatively validated | Participants completed the independent response before the previous visitor's comment was revealed. The test did not compare this sequence with an alternative sequence. |
| **ER2. The experience should encourage visitors to return attention to the physical artwork.** | Supported by early evidence | Several responses showed re-observation or attention shifting after another perspective was revealed. |
| **ER3. Social interaction should remain optional and low-pressure rather than requiring direct conversation with strangers.** | Partially supported | The exchange worked through traces and comments without direct conversation. However, participants' subjective comfort with this format was not directly measured. |
| **ER4. Visitors should be able to encounter both similar and contrasting interpretations.** | Supported | Participants agreed, partly agreed, and disagreed with previous interpretations. Contrasting perspectives could still be valuable. |
| **ER5. Digital interaction should remain brief and redirect attention to the artwork rather than compete with it.** | Not tested in Round 2 | Round 2 used a paper prototype, so mobile-screen distraction has not yet been evaluated. |
| **ER6. Visitors should have control over whether their own interpretation is shared.** | Implemented; not yet validated | The contribution sheet included permission for anonymous sharing, but sharing comfort and privacy expectations were not explored in depth. |

---

# What Round 2 Changed in the Design

Round 2 strengthened the decision to move away from a system that primarily classifies visitors and toward a system where visitors influence one another through accumulated traces.

The results suggest that the next prototype should prioritise:

1. **Re-observation rather than agreement**  
   Another perspective should prompt the visitor to look again.

2. **Perspective expansion rather than a correct interpretation**  
   Contrasting readings should remain visible and valid.

3. **A clear cumulative social loop**  
   Visitors should move from receiving a perspective to leaving one.

4. **Better distinction between attention change and interpretation change**  
   Future evaluation should measure both.

5. **More carefully designed progressive clues**  
   Clue 1 should be evocative; Clue 2 should provide practical guidance.

---

# Proposed Next Iteration

The next prototype should test a refined interaction flow:

1. Visitor chooses a visual fragment.
2. Visitor follows a short clue to find the artwork.
3. Visitor observes and records an independent interpretation.
4. A previous visitor's interpretation is revealed.
5. The interface explicitly asks the visitor to **look again**.
6. The visitor identifies what changed:
   - I noticed something new.
   - I looked at a different detail.
   - I reconsidered my interpretation.
   - My interpretation stayed the same.
7. The visitor creates a new fragment, clue and interpretation for a future visitor.

The digital prototype should then test issues that the paper prototype could not address, particularly:

- screen distraction;
- timing of digital prompts;
- anonymous sharing comfort;
- clarity of consent;
- whether visitors understand that another real visitor created the clue;
- whether the cumulative social connection feels meaningful.

---

# Limitations

The Round 2 findings should be treated as **early qualitative evidence**, not generalisable conclusions.

Key limitations include:

- a small participant sample;
- inconsistent completeness across participant response sheets;
- some handwritten responses being difficult to interpret;
- some participant statements recorded as facilitator paraphrases rather than verbatim quotations;
- no direct comparison between alternative interaction sequences;
- no direct measurement of perceived social connection or sharing comfort;
- use of a paper prototype rather than the intended mobile implementation.

These limitations inform what should be tested in the next iteration.

---

# Round 2 Summary

Round 2 provided early evidence that Borrowed Eyes can create a more meaningful social interaction than the earlier Art Persona concept.

The strongest result was not that participants changed their opinions to match one another. Instead, another visitor's perspective could redirect attention, encourage re-observation, and expand the ways an artwork was appreciated.

The test also demonstrated the core cumulative loop in which visitors can move from **receiver** to **contributor**, leaving a new trace for a future visitor.

The next iteration should therefore focus on strengthening re-observation, preserving interpretive plurality, improving clue quality, and testing whether the same social loop remains effective in a functional digital prototype.

---

## AI Use Note

This documentation was organised and edited with assistance from generative AI based on the team's original prototype materials, participant response sheets, facilitator notes, photographs and testing evidence. The underlying testing data, design decisions and participant responses were produced by the project team and participants. The team should adapt this statement to the course's required AI referencing format before submission.
