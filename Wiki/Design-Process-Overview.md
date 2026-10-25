# Design Process Overview

## Project access

- [Tradeshow poster](https://github.com/iris0324/babear_deco3500/blob/main/docs/Poster/poster.png) · [Poster and promotional materials](https://github.com/iris0324/babear_deco3500/tree/main/docs/Poster)
- [Prototype source and local setup](https://github.com/iris0324/babear_deco3500/tree/main/Prototype/functional-prototype): serve this folder locally, open `index.html`, and use the Guest entry. See [Blind Eyes online setup](https://github.com/iris0324/babear_deco3500/blob/main/supabase/BLIND_EYES_SETUP.md) for multiplayer requirements. The team confirmed on-site online testing with two phones: scanning the QR code opened the prototype, and the two participants successfully matched and could see their partner.
- [Ethical Considerations](https://github.com/iris0324/babear_deco3500/wiki/Ethical-Considerations) · [Internal Meeting Records](https://github.com/iris0324/babear_deco3500/wiki/Internal-Meeting-Records)

## Project summary

**Borrowed Eyes** explores how visitors' observations can help others engage with physical artworks. We investigated interpretation confidence, social comfort and mobile distraction through research, prototypes and formative evaluation. Our concepts developed from **Art Persona → Borrowed Eyes → Flexible Social Participation**. Reciprocal understanding remains a design goal; our tests do not establish lasting social connection.

## 1. Research and experience requirements

Five fully documented semi-structured gallery interviews identified uncertainty about interpreting art, interest in others' viewpoints and discomfort with forced conversation. Literature on visitor-generated perspectives and interpersonal museum experiences provided a rationale for letting one visitor influence another's encounter. These sources inform the concept without validating our exact game rules. See [research documentation](https://github.com/iris0324/babear_deco3500/tree/main/docs/Research).

Our opportunity became: **How might visitors exchange interpretations while keeping the physical artwork central?**

| ID | Initial experience requirement |
|---|---|
| ER1 | Form an independent interpretation before seeing others' perspectives. |
| ER2 | Look back at and notice details in the physical artwork. |
| ER3 | Keep social interaction optional and low-pressure. |
| ER4 | Encounter similar and contrasting interpretations. |
| ER5 | Keep digital interaction brief and redirect attention to the artwork. |
| ER6 | Control whether contributions are shared, with privacy and anonymity considered. |

## 2. Iteration 1: Art Persona

Art Persona used prompts about mood, detail and story to support interpretation without art-history knowledge. However, design reflection identified a weak social structure: visitors could receive a Persona result without another visitor affecting their gallery experience. We therefore shifted from classifying visitors towards making **one visitor's observation shape another's search and attention**.

![Art Persona interaction flow](https://raw.githubusercontent.com/iris0324/babear_deco3500/main/docs/Design/Design_Iteration_2/images/art-persona-flow.png)

*Figure 1. Early prompts supported individual interpretation; the next concept strengthened the visitor-to-visitor relationship.*

[Iteration 1 documentation](https://github.com/iris0324/babear_deco3500/blob/main/docs/Design/Design_Iteration_1.md)

## 3. Iteration 2: Borrowed Eyes

The paper prototype used an asynchronous loop: **Choose → Find → Interpret → Compare → Re-observe → Contribute**. Visitors followed a fragment and clue, recorded their own interpretation, then encountered a previous perspective and left a trace for someone else.

![Borrowed Eyes interaction flow](https://raw.githubusercontent.com/iris0324/babear_deco3500/main/docs/Design/Design_Iteration_2/images/borrowed-eyes-flow.png)

*Figure 2. Independent interpretation precedes the social reveal; contribution continues the exchange across visits.*

Round 2 findings suggested that another perspective could redirect attention even when the visitor's interpretation stayed the same. Disagreement could still be useful. This shifted our focus towards **perspective expansion and re-observation**, with clearer progressive clues. Paper testing could not establish mobile distraction or digital sharing comfort. See [Round 2 evidence and requirement review](https://github.com/iris0324/babear_deco3500/blob/main/docs/Evaluation/Round_2/Borrowed_Eyes_Round_2_Testing_Findings.md).

## 4. Iteration 3: Flexible social participation

An exploratory survey of **30 respondents** found that **21/30 (70%)** enjoyed quiet artwork viewing, while **9/30 (30%)** felt confident sharing interpretations. Communication difficulty, unresponsive partners and dominant members were concerns. These self-reported preferences informed alternative participation modes; they do not establish their effectiveness. See [survey findings](https://github.com/iris0324/babear_deco3500/blob/main/docs/Evaluation/Round_3/Survey_Findings.md).

The latest design offers independent or team-based Borrowed Eyes, paired **Blind Eyes**, and **Leave Your Eyes** contributions. Blind Eyes separates the Eye/Describer's information from the Finder/Guesser's, creating a reason to communicate. Face-to-Face testing explored shared clues, negotiation and joint decisions, informing team play. Live Gallery Chat is an additional interface concept.

![Iteration 3 Borrowed Eyes flow](https://raw.githubusercontent.com/iris0324/babear_deco3500/main/docs/Design/Design_Iteration_3/User_Flow_image/Page2.png)

*Figure 3. Solo and team routes expand participation choices. This design flow is not evidence that every feature is implemented or validated.*

In team-based Borrowed Eyes, each participant writes a personal interpretation to unlock one private clue, then shares that clue with the group before a collective guess. The implementation requires every player to comment before a formal answer. See the [Borrowed Eyes interface](https://github.com/iris0324/babear_deco3500/blob/main/Prototype/functional-prototype/src/pages/borrow.js) and [submission checks](https://github.com/iris0324/babear_deco3500/blob/main/Prototype/functional-prototype/src/core/events.js).

The requirements therefore need a mode-specific reading:

| Requirement | Current review |
|---|---|
| ER1 | Team play requires a personal interpretation before unlocking a clue. However, the browsing/detail pages already show the creator’s perspective. Comment-before-clue is implemented; the original interpretation-before-any-social-view sequence is not fully preserved. |
| ER2/ER4 | Round 2 supports testing re-observation and contrasting interpretations further. |
| ER3 | Solo offers an alternative to direct interaction, but requiring comments to unlock team clues may still create pressure. Mode choice alone does not establish comfort. |
| ER5/ER6 | Brief screen use, sharing consent and privacy controls still need digital evaluation. |

[Full interaction flows, including entry and Blind Eyes](https://github.com/iris0324/babear_deco3500/blob/main/docs/Design/Design_Iteration_3/Interaction_Flow.md)

## 5. Round 3: What evaluation changed

On **14 October 2026**, **four people** completed four two-player Blind Eyes rounds. Three also joined one Face-to-Face session. These overlapping activities were small formative evaluations, not independent comparative trials or validation of the final online build.

Blind Eyes observations recorded **17 perspective initiations, 17 interpretive explanations, 21 substantive responses, 10 perspective differences and 14 newly noticed details**. These are event counts, not participant numbers or measures of exchange quality. Interpretive questions sometimes served mainly to identify the artwork. Face-to-Face interviews described negotiation and influence, but a quieter participant found speaking up difficult. Structured observation and confirmed task-success data were incomplete.

We therefore propose testing an optional post-reveal comparison, clearer opportunities for the Eye to explain, and support for quieter members. Future evaluation should track how contributions change attention or decisions, alongside talk frequency. These are proposed refinements, not validated outcomes. See [Round 3 results](https://github.com/iris0324/babear_deco3500/blob/main/docs/Evaluation/Round_3/Testing_Results.md).

## 6. Theory and ethical reflection

As an explicit reading of the current design, the asymmetric-interaction framework of **Bréhault et al. (2025)** helps identify who can access which information: a previous visitor's trace, the Eye's privileged view, or members' complementary clues. This distinguishes opportunities for communication from evidence of cooperation. We do not claim the framework guided every earlier decision. Our [literature synthesis](https://github.com/iris0324/babear_deco3500/blob/main/docs/Research/Iteration3/Literature_And_Findings.md) connects asymmetry with museum coordination and meaning-making research.

Ethical considerations also constrain the experience. Round 2 contribution sheets requested permission for anonymous reuse. Later accounts, location checks and comments require renewed scrutiny of consent, retention and withdrawal. Early exposure to others' views risks anchoring, while compulsory contribution risks exclusion. These remain linked design and ethics questions; a full ethics-framework assessment belongs on the [dedicated page](https://github.com/iris0324/babear_deco3500/wiki/Ethical-Considerations).

## 7. Prototype scope and limitations

| Component | Documented status |
|---|---|
| Borrowed Eyes, creator and gallery interfaces | Browser-based proof of concept; local interactions do not establish shared persistence. |
| Blind Eyes multiplayer | Iris completed and refined the backend. The team confirmed successful on-site online testing with two phones: QR-code access, partner matching and visibility of the matched partner. This confirms that tested flow, without claiming every feature was evaluated. |
| Accounts, location verification and wider chat | Interface flows or demonstrations should not be treated as validated production services. |

Small samples, self-reported survey preferences, missing observations and no controlled mode comparison limit our conclusions. Long-term participation, moderation, accessibility and screen attention need further study. The next evaluation priority is to test whether the implemented social interactions redirect attention to art and support reciprocal exchange.

## 8. Team contributions

This summary records the team’s contributions, with backend ownership clarified by the team. Responsibilities overlapped; all members participated in testing and design discussions.

| Member | Main contributions |
|---|---|
| Yunlin Wang (Iris) | Initial website architecture, frontend and UI/UX foundation; completed and refined the full backend used in the final prototype; code integration and repository organisation. |
| Yining Zhu (Ning) | Research documentation, survey design, interview synthesis and evidence organisation; prototype refinement. |
| Binyan Zhang (Zoe) | Interviews, testing and analysis; user flows for both rounds; later website and final prototype refinement. |
| Muchu Wang (Muchu) | Wiki and process documentation; interviews, testing, evaluation synthesis and collaborative concept development. |
| Xinyue Chang (Ivy) | Team coordination, concept and interaction design, prototype development and visual refinement; poster design. |

See the [repository](https://github.com/iris0324/babear_deco3500), evaluation records and [meeting records](https://github.com/iris0324/babear_deco3500/wiki/Internal-Meeting-Records) for supporting activity.

## AI use

Generative AI assisted documentation organisation and language editing, including this revision. Research data and reported evaluation results come from team records. The team remains responsible for reviewing the revised account and its final submission.

