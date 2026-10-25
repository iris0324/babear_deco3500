# Design Process Overview

## Project access

[Online prototype](https://iris0324.github.io/babear_deco3500/) · [Source and setup](https://github.com/iris0324/babear_deco3500/tree/main/Prototype/functional-prototype) · [Poster](https://github.com/iris0324/babear_deco3500/blob/main/docs/Poster/poster.png) · [Meeting records](https://github.com/iris0324/babear_deco3500/wiki/Internal-Meeting-Records) · [Ethical Considerations](https://github.com/iris0324/babear_deco3500/wiki/Ethical-Considerations)

## 1. Research and design direction

**Borrowed Eyes** explores how visitors' observations can help others engage with physical artworks. Five semi-structured gallery interviews identified uncertainty about interpreting art, interest in others' perspectives and discomfort with forced conversation. Research on visitor-generated information ([Yi et al., 2022](#references)) and interpersonal museum experiences ([Ryding et al., 2021](#references)) informed our question: **How might visitors exchange interpretations while keeping the physical artwork central?** These studies supported the concept's rationale without validating its game rules.

Our six experience requirements were: **ER1**, independent interpretation before viewing others' perspectives; **ER2**, returning attention to physical artworks; **ER3**, optional, low-pressure social interaction; **ER4**, encountering similar and contrasting interpretations; **ER5**, brief digital interaction; and **ER6**, control over sharing and privacy. These requirements guided three iterations: **Art Persona → Borrowed Eyes → Flexible Social Participation**.

The process shifted from supporting individual reflection to asynchronous perspective sharing, then towards shared tasks and paired communication. We retained alternatives for visitors with different social preferences. Reciprocal understanding remains a design goal; our formative evaluations do not establish lasting social connection.

The design responses addressed different research concerns. Accessible prompts responded to interpretation uncertainty; visitor-generated traces provided another perspective; complementary clues gave participants a reason to communicate. Participation choices responded to differences in social confidence. These relationships explain our decisions, while the requirement review below identifies where the mechanics still conflict with the intended experience.

## 2. Iteration 1: Art Persona

Art Persona used mood, detail and story prompts to support interpretation without art-history knowledge. Accessible prompts drew on ARTeMuse's structured activities for beginning viewers ([Shaer et al., 2011](#references)); that study did not evaluate our concept.

Visitors could reflect and encounter others' responses, but could also receive a Persona result without another visitor affecting their experience. We therefore shifted towards making **one visitor's observation shape another's search and attention**. Interpretations became resources for someone else's exploration, strengthening the visitor-to-visitor relationship.

![Art Persona interaction flow](https://raw.githubusercontent.com/iris0324/babear_deco3500/main/docs/Design/Design_Iteration_2/images/art-persona-flow.png)

*Figure 1. Art Persona supported individual reflection.*

## 3. Iteration 2: Borrowed Eyes

The paper prototype used **Choose → Find → Interpret → Compare → Re-observe → Contribute**. A creator supplied an artwork fragment, clue and personal perspective. A later visitor found the artwork, recorded an independent interpretation, compared perspectives and contributed a response.

This enabled asynchronous communication through the artwork. Round 2 findings suggested that another perspective could redirect attention even when a visitor's interpretation remained unchanged. Agreement was unnecessary for a contribution to encourage re-observation. We retained perspective comparison and refined progressive clues.

However, asynchronous exchange limited immediate questions, negotiation and shared decisions. Paper testing also could not establish mobile distraction or digital sharing comfort. The next iteration extended existing communication towards active cooperation while preserving individual interpretation. See [Round 2 findings](https://github.com/iris0324/babear_deco3500/blob/main/docs/Evaluation/Round_2/Borrowed_Eyes_Round_2_Testing_Findings.md).

![Borrowed Eyes interaction flow](https://raw.githubusercontent.com/iris0324/babear_deco3500/main/docs/Design/Design_Iteration_2/images/borrowed-eyes-flow.png)

*Figure 2. Interpretation precedes comparison and contribution in the paper concept.*

## 4. Iteration 3: Flexible social participation

An exploratory survey of **30 respondents** found that **21/30 (70%)** enjoyed quiet viewing and **9/30 (30%)** felt confident sharing interpretations. Concerns included communication difficulty, unresponsive partners and dominant members. These preferences informed participation choices, without establishing their effectiveness.

### Collaborative and paired exploration

Borrow the Eyes introduced Solo and Team Play. In the implemented team flow, **each participant writes a personal interpretation to unlock one private clue, then shares it before a collective guess**. Every player must comment before a formal answer. Complementary clues encourage coordination, but required comments can create pressure, and equal contribution counts do not ensure equal influence.

Blind Eyes introduced **Eye / Describer** and **Finder / Guesser** roles. The Describer explains privileged information about the target artwork, including visual details and subjective impressions. The Guesser asks questions and makes guesses. This creates opportunities to discuss different experiences, although communication may remain focused on identification.

Face-to-Face testing separately explored shared clues, negotiation and group decisions. It raised concerns about quieter participants' influence. Face-to-Face was an evaluated concept, distinct from the final Group Chat feature.

![Iteration 3 Borrowed Eyes flow](https://raw.githubusercontent.com/iris0324/babear_deco3500/main/docs/Design/Design_Iteration_3/User_Flow_image/Page2.png)

*Figure 3. Solo and team routes offer participation choices; the diagram does not establish validation.*

The distinction between task cooperation and interpretation became central. Participants may combine clues successfully without considering why another person noticed a detail or felt differently about an artwork. Blind Eyes therefore opened space for subjective explanations and follow-up questions. Its value still depends on how participants use that space, which informed the evaluation focus on explanations, responses and differences in perspective.

### Four parallel final features

| Feature | Intended experience |
|---|---|
| **Borrow the Eyes** | Independent or team artwork discovery through fragments, clues and visitor perspectives. |
| **Blind Eyes** | Paired descriptions, questions and guessing through asymmetric information. |
| **Group Chat** | Gallery communication, teammate finding and activity coordination. |
| **Leave Your Eyes** | Creating challenges with images, clues, interpretations and questions for future visitors. |

These are equally important conceptual features, not successive stages or a hierarchy controlled by Group Chat. Their implementation and evaluation differ. The three iterations describe development; the four features describe the final concept.

## 5. Evaluation and requirement review

On **14 October 2026**, **four people** completed four two-player Blind Eyes rounds; three also joined one Face-to-Face session. Blind Eyes recorded **17 perspective initiations, 17 interpretive explanations, 21 substantive responses, 10 perspective differences and 14 newly noticed details**. These are event counts, not participant totals or exchange-quality measures.

Some questions mainly helped identify artworks. Face-to-Face interviews described negotiation, but a quieter participant struggled to speak. Small overlapping samples, incomplete observations and task-success data, and no controlled comparison limit generalisation. These activities did not validate the final online build. See [Round 3 results](https://github.com/iris0324/babear_deco3500/blob/main/docs/Evaluation/Round_3/Testing_Results.md).

| Requirement | Current assessment |
|---|---|
| **ER1** | Partially supported: comments precede clues, but browsing already exposes the creator's perspective. |
| **ER2** | Paper findings suggest re-observation; digital attention needs measurement. |
| **ER3** | Solo provides choice; mandatory comments and team decisions may create pressure. |
| **ER4** | Formative observations support perspective comparison; depth and lasting effects remain uncertain. |
| **ER5** | Screen time and competition with artwork viewing remain unvalidated. |
| **ER6** | Anonymous reuse permission and guest access offer some controls; consent, retention and withdrawal remain incomplete. |

Differences and newly noticed details were relevant to our aim of expanding observation. They need not produce agreement to be useful. However, counting these events cannot establish whether participants explored another viewpoint or used it only as a guessing clue. Following the response to a contribution would better connect observed communication to the project's social aims.

We propose an optional post-reveal comparison, opportunities to explain subjective impressions, support for quieter members and alternatives for non-response or withdrawal. These are future refinements, not confirmed tested features. Evaluation should distinguish successful guessing from changes in attention, interpretation or group decisions.

## 6. Theory, ethics and prototype scope

We retrospectively apply [Bréhault et al.'s (2025)](#references) asymmetric-interaction framework to previous visitors' traces, complementary clues and the Describer's privileged information. Asymmetry creates opportunities for communication and coordination without establishing meaningful cooperation. Our working distinctions separate exchanging information, contributing to shared tasks, organising actions and jointly interpreting artworks; these forms can overlap.

Ethical responsibilities expanded from permission for anonymous paper contributions to consent, message retention, withdrawal, unwanted contact and moderation. Early exposure to others' views risks anchoring; compulsory contributions risk exclusion. The [ethics analysis](https://github.com/iris0324/babear_deco3500/wiki/Ethical-Considerations) uses the Ethical Disclaimer tool to examine stakeholders, harms and responsibilities ([Ethics for Designers, n.d.](#references)).

| Component | Implementation and evidence boundary |
|---|---|
| **Borrow the Eyes** | Local Solo/Team mechanics; independent-device shared persistence is not established. |
| **Blind Eyes** | Iris completed the adopted backend: anonymous sign-in, matching, room chat and game state. Two-phone field testing confirmed QR access, matching and partner visibility, not every feature or edge case. |
| **Group Chat** | Communication and coordination are represented; wider gallery chat is not a validated production service. |
| **Leave Your Eyes** | Creator publication is browser-local and does not automatically populate the online Blind Eyes dataset. |
| **Location and safety** | Location permission does not establish secure geofencing. Local reporting, muting and blocking do not establish server-side moderation or enforceable blocking. |

Priorities are interpretive depth, physical attention, participation comfort, accessibility and realistic multi-device reliability. The successful connection test does not establish the safety or social effectiveness of the entire system.

## 7. Team contributions

Responsibilities overlapped; all members participated in testing and design discussions.

| Member | Main contributions |
|---|---|
| Yunlin Wang (Iris) | Initial website architecture, frontend and UI/UX foundation; completed the backend used in the final prototype; code integration and repository organisation. |
| Yining Zhu (Ning) | Research documentation, survey design and interview synthesis; GitHub, Wiki and submission organisation and review; developed an earlier backend version not adopted in the final prototype. |
| Binyan Zhang (Zoe) | Interviews, testing and analysis; user flows for both rounds; later website and final prototype refinement. |
| Muchu Wang (Muchu) | Wiki and process documentation; interviews, testing, evaluation synthesis and collaborative concept development. |
| Xinyue Chang (Ivy) | Team coordination, concept and interaction design, prototype development and visual refinement; poster design. |

See the [repository](https://github.com/iris0324/babear_deco3500), evaluation records and [meeting records](https://github.com/iris0324/babear_deco3500/wiki/Internal-Meeting-Records) for supporting activity.

## References

Bréhault, V., Dubois, E., Prouzeau, A., & Serrano, M. (2025). A systematic literature review to characterize asymmetric interaction in collaborative systems. In *Proceedings of the 2025 CHI Conference on Human Factors in Computing Systems*. Association for Computing Machinery. [https://doi.org/10.1145/3706598.3713129](https://doi.org/10.1145/3706598.3713129)

Ethics for Designers. (n.d.). *Ethical disclaimer*. [https://www.ethicsfordesigners.com/ethical-disclaimer](https://www.ethicsfordesigners.com/ethical-disclaimer)

Ryding, K., Spence, J., Løvlie, A. S., & Benford, S. (2021). Interpersonalizing intimate museum experiences. *International Journal of Human–Computer Interaction, 37*(12), 1151–1172. [https://doi.org/10.1080/10447318.2020.1870829](https://doi.org/10.1080/10447318.2020.1870829)

Shaer, O., Olson, J., Edwards, M., & Valdes, C. (2011). Art App-reciation: Fostering engagement and reflection in museums through a social-mobile application. In *Museums and the Web 2011*. [Conference paper](https://museumsandtheweb.com/mw2011/papers/art_app_reciation_fostering_engagement_and_ref.html)

Yi, T., Lee, H.-Y., Yum, J., & Lee, J.-H. (2022). The influence of visitor-based social contextual information on visitors’ museum experience. *PLOS ONE, 17*(5), Article e0266856. [https://doi.org/10.1371/journal.pone.0266856](https://doi.org/10.1371/journal.pone.0266856)

### Project evidence

Interview findings, survey percentages and prototype observation counts reported above are the team's primary research, not findings from the publications listed here. Their evidence is available in the [five interview records](https://github.com/iris0324/babear_deco3500/blob/main/docs/Research/Iteration1/interview-round-1.md), [survey findings](https://github.com/iris0324/babear_deco3500/blob/main/docs/Evaluation/Round_3/Survey_Findings.md), [Round 2 findings](https://github.com/iris0324/babear_deco3500/blob/main/docs/Evaluation/Round_2/Borrowed_Eyes_Round_2_Testing_Findings.md) and [Round 3 testing results](https://github.com/iris0324/babear_deco3500/blob/main/docs/Evaluation/Round_3/Testing_Results.md).

## AI use

Generative AI assisted documentation organisation and language editing, including this revision.

Research data and reported evaluation results come from team records.

The team remains responsible for reviewing the revised account and its final submission.
