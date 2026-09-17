# Design Process Overview

> **Working draft.** Sections marked **TBD** should be updated when the functional prototype, framework application and later evaluation are completed.

## Project Summary

Our project investigates how social and contextual computing can support engagement in physical art galleries. We focus primarily on casual and less-experienced visitors who may be interested in art but feel uncertain about how to begin interpreting an unfamiliar artwork or expressing their own view.

Rather than using technology mainly to deliver more expert information, we explored how a lightweight interaction could help visitors form a personal interpretation, encounter another visitor's perspective and return attention to the physical artwork.

Our current concept is **Borrowed Eyes**: a cumulative visitor-generated experience in which one visitor leaves a visual detail, clue and interpretation for a future visitor. The later visitor searches for the artwork, interprets it independently, compares perspectives, looks again and then contributes a new trace for somebody else.

## 1. Research and Design Opportunity

### Literature and domain research

Our literature review focused on three connected areas:

1. **Personal interpretation** — less-experienced visitors may need an accessible starting point for forming and expressing their own response.
2. **Social perspectives** — other visitors can become a resource for meaning-making, and social influence does not always require direct face-to-face conversation.
3. **Physical artwork attention** — mobile technology can support engagement, but the screen should not become the main focus of the visit.

The broader domain research identified a tension between providing digital/social support and preserving the direct visitor–artwork relationship. This led to an initial design opportunity around **personal interpretation + other visitors' perspectives + physical artwork attention**.

Full research documentation: [Research folder](https://github.com/iris0324/babear_deco3500/tree/main/docs/Research).

### Primary user research

The repository currently contains **five fully documented semi-structured interviews at QAGOMA** with visitors who had different ages, gallery experience and visiting styles. The interviews explored interpretation confidence, conversations about art, interest in other visitors' viewpoints, comfort with direct social interaction and mobile-phone use in galleries.

The interviews produced four particularly important design insights:

- visitors can be interested in art while lacking confidence in beginning or expressing an interpretation;
- a short artwork-centred prompt can provide a useful starting point for observation or discussion;
- visitors can be curious about other perspectives while preferring anonymous or indirect interaction to direct communication with strangers;
- digital interaction should remain lightweight and redirect attention to the physical artwork.

These findings refined the design opportunity to:

> **How might we help visitors discover and exchange different interpretations of artworks through lightweight social interaction, without distracting attention from the physical artwork?**

**TBD before final submission:** one separate research summary refers to six interviews. The team should confirm whether a sixth interview record exists and reconcile the participant count before this page is finalised.

## 2. Experience Requirements

Research findings were translated into six experience requirements:

| ID | Experience Requirement |
|---|---|
| **ER1** | Visitors should form their own interpretation before seeing other visitors' perspectives. |
| **ER2** | The experience should encourage visitors to look back at and notice details in the physical artwork. |
| **ER3** | Social interaction should be optional and low-pressure, without requiring direct conversation with strangers. |
| **ER4** | Visitors should be able to encounter both similar and contrasting interpretations. |
| **ER5** | Digital interactions should be brief and should redirect attention back to the artwork rather than compete with it. |
| **ER6** | Visitors should have clear control over whether their own contribution is shared, with privacy/anonymity considered. |

These requirements became criteria for evaluating later concepts rather than a list of interface features.

## 3. Design Iteration 1 — Art Persona

The first concept, **Art Persona**, used playful artwork-specific prompts to help visitors form an interpretation without requiring art-history knowledge. A visitor would observe artworks, select one, answer short questions about details, mood or story, receive a Persona result and then view selected responses from other visitors.

![Art Persona interaction flow](https://raw.githubusercontent.com/iris0324/babear_deco3500/main/docs/Design/images/art-persona-flow.png)

The concept supported individual reflection and retained useful principles from the research: playful prompts, no single correct interpretation and anonymous access to other perspectives.

However, early concept testing and design reflection identified a structural problem: the **social layer remained weak**. A visitor could complete the activity, receive a Persona and leave without another visitor meaningfully affecting how they moved through or observed the gallery. Showing comments also risked turning other visitors into another information feed rather than an active social resource.

This led to a design decision: instead of asking the system to classify the visitor, the next concept would make **one visitor's observation shape another visitor's physical gallery experience**.

[View Design Iteration 1](https://github.com/iris0324/babear_deco3500/blob/main/docs/Design/Design_Iteration_1.md)

## 4. Design Iteration 2 — Borrowed Eyes

**Borrowed Eyes** changes the visitor from a passive reader of social information into both a **user and contributor**.

The interaction follows six stages:

1. Choose a visual fragment.
2. Read a short clue.
3. Find the complete artwork.
4. Respond independently.
5. Reveal and compare another visitor's perspective.
6. Create a new fragment, clue and interpretation for a future visitor.

![Borrowed Eyes interaction flow](https://raw.githubusercontent.com/iris0324/babear_deco3500/main/docs/Design/images/borrowed-eyes-flow.png)

The order is deliberate. The previous visitor's interpretation is hidden until the current visitor records their own response. This implements ER1 by protecting space for independent interpretation before social influence is introduced.

The concept also strengthens the connection between social interaction and the physical gallery: the visitor must search, move, inspect artworks and look again rather than only read comments on a screen.

The core cumulative loop is:

> **Previous visitor leaves a trace → current visitor follows it → interprets and compares → current visitor leaves a new trace → future visitor**

The current paper prototype is best described as a **social, asynchronous and location-specific gallery experience**. A future digital/contextual version can deliver clues based on gallery context, capture visitor-created fragments and pass anonymous perspectives between visitors at different times.

[View Design Iteration 2](https://github.com/iris0324/babear_deco3500/blob/main/docs/Design/Design_Iteration_2/Concept.md)

## 5. Round 2 Prototype Evaluation

Round 2 used a low-fidelity paper prototype in a physical gallery context. The testing focused on the social interaction itself rather than interface polish.

Participants moved through the sequence:

> **Choose → Find → Interpret → Compare → Re-observe → Contribute**

The evaluation examined whether visitor-created fragments and clues could support artwork search, whether visitors could form an independent interpretation, whether another perspective encouraged reflection or re-observation, whether disagreement could still be useful, and whether participants could become contributors for future visitors.

[View the Round 2 testing plan](https://github.com/iris0324/babear_deco3500/blob/main/docs/Evaluation/Round_2/Borrowed_Eyes_Testing_Plan.md).

### Key findings

**1. Another visitor's perspective can trigger re-observation.**  
Some participants returned attention to the physical artwork and noticed details that had not been central to their first viewing.

**2. Agreement is not necessary for another perspective to be valuable.**  
Participants could retain their own interpretation while still gaining another way of looking at or appreciating the work.

**3. The strongest social effect may be attentional rather than interpretive.**  
A visitor's overall interpretation might stay the same even when their attention shifts to a different detail.

**4. Participants can move from viewer to contributor.**  
The prototype demonstrated the intended transition from receiving a previous visitor's trace to creating material for a future visitor.

**5. Progressive clues are useful, but clue quality matters.**  
A two-level clue structure can preserve curiosity while still helping participants recover when the first clue is too ambiguous.

[View full Round 2 findings](https://github.com/iris0324/babear_deco3500/blob/main/docs/Evaluation/Round_2/Borrowed_Eyes_Round_2_Testing_Findings.md).

## 6. What Changed After Evaluation

Round 2 shifted the design focus from **changing a visitor's opinion** to **expanding attention and perspective**.

The next iteration should therefore:

- make **look again / re-observation** an explicit interaction step;
- preserve similar and contrasting interpretations without framing one as correct;
- keep **Leave Your Eyes** as a core part of the experience so that the social loop remains cumulative;
- distinguish between **interpretive change** and **attentional change** during evaluation;
- improve first- and second-level clue design;
- test issues the paper prototype could not address, including screen distraction, sharing comfort, consent and digital timing.

## 7. Design Framework and Social/Mobile Theory

**TBD:** The repository does not yet contain an explicit design-framework application. Before final submission, add the framework selected by the team and show which concrete design decisions it changed.

Relevant project concepts already evident in the design include:

- asynchronous interaction;
- visitor-created traces;
- low-pressure social awareness;
- location-specific interaction in a physical gallery;
- movement between digital/social prompts and physical artwork attention.

These should be connected explicitly to the framework/theory actually used by the team rather than added retrospectively without evidence.

## 8. Current Prototype

The repository currently documents the **paper prototype and its evaluation**. The `Prototype/` folder does not yet contain the functional digital proof-of-concept.

**TBD when implementation is available:**

- prototype type and technology stack;
- live/deployment link;
- run/setup instructions;
- screenshots or short demo;
- features that are functional;
- features that are simulated;
- how the prototype supports multiple visitors/social interaction;
- known technical limitations.

## 9. Limitations and Next Steps

Current limitations include a small qualitative research sample, incomplete preservation of some raw research/evaluation evidence, a paper rather than digital implementation for Round 2, and limited direct measurement of perceived social connection or sharing comfort.

The project should next complete the digital proof-of-concept, evaluate the social loop in that form, test mobile attention and sharing/privacy issues, and document how evaluation changes the final experience.

## 10. Team Contributions

Initial responsibilities recorded in the Team Charter were:

| Team member | Main responsibility |
|---|---|
| **Yunlin Wang (Iris)** | Team Charter, GitHub organisation, research support and shared project activities |
| **Yining Zhu (Ning)** | Domain/literature research and related-work analysis |
| **Binyan Zhang (Zoe)** | User research, interviews, observations and analysis |
| **Muchu Wang (Muchu)** | Interaction/UX design; translating research into concepts and design outcomes; support prototyping/testing |
| **Xinyue Chang (Ivy)** | Team lead/representative; technical prototyping and testing |

**TBD:** Update this section with actual final contributions rather than only initial assigned duties.

## Key Project Links

- [Repository](https://github.com/iris0324/babear_deco3500)
- [Research](https://github.com/iris0324/babear_deco3500/tree/main/docs/Research)
- [Requirements](https://github.com/iris0324/babear_deco3500/tree/main/docs/Requirements)
- [Design](https://github.com/iris0324/babear_deco3500/tree/main/docs/Design)
- [Evaluation](https://github.com/iris0324/babear_deco3500/tree/main/docs/Evaluation)
- [Prototype](https://github.com/iris0324/babear_deco3500/tree/main/Prototype)
- [Poster/Promotional Material](https://github.com/iris0324/babear_deco3500/tree/main/docs/Poster)

## AI Use

> **TBD — adapt to the required UQ/course referencing format:** This Design Process Overview draft was organised and edited with generative AI assistance using the team's existing repository documentation and testing evidence. The underlying research, participant data, design work and project decisions were produced by the team and participants.
