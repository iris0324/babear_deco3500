
# Design Process Overview

## Project access

- [Open the online prototype](https://iris0324.github.io/babear_deco3500/)

- [Tradeshow poster](https://github.com/iris0324/babear_deco3500/blob/main/docs/Poster/poster.png) · [Poster and promotional materials](https://github.com/iris0324/babear_deco3500/tree/main/docs/Poster)
- [Prototype source and local setup](https://github.com/iris0324/babear_deco3500/tree/main/Prototype/functional-prototype): serve this folder locally, open `index.html`, and use the Guest entry. See [Blind Eyes online setup](https://github.com/iris0324/babear_deco3500/blob/main/supabase/BLIND_EYES_SETUP.md) for multiplayer requirements. The team confirmed on-site online testing with two phones: scanning the QR code opened the prototype, and the two participants successfully matched and could see their partner.
- [Ethical Considerations](https://github.com/iris0324/babear_deco3500/wiki/Ethical-Considerations) · [Internal Meeting Records](https://github.com/iris0324/babear_deco3500/wiki/Internal-Meeting-Records)

## Project summary

**Borrowed Eyes** explores how visitors' observations can help others engage with physical artworks. We investigated interpretation confidence, social comfort and mobile distraction through research, prototypes and formative evaluation.

Our design developed from **Art Persona**, which primarily supported individual interpretation, to **Borrowed Eyes**, which enabled asynchronous communication through visitor-generated perspectives. We subsequently explored collaborative artwork finding and asymmetric paired interaction, leading to a final concept centred on **flexible social participation**.

The final design consists of four parallel main features:

1. **Borrow the Eyes** — independent or team-based artwork exploration through visual fragments, clues and personal interpretations.
2. **Blind Eyes** — paired communication through asymmetric information, descriptions, questions and artwork guessing.
3. **Group Chat** — direct communication between gallery visitors, including finding teammates and coordinating shared activities.
4. **Leave Your Eyes** — creating artwork-based challenges and leaving personal perspectives for future visitors.

These four features are equally important parts of the final design. They are not four successive stages that every visitor must complete, and Group Chat is not a parent system controlling the other features.

Our central design challenge is not simply to increase the quantity of social interaction. It is to explore how different interaction structures might encourage visitors to observe artworks, encounter alternative interpretations, communicate, cooperate and potentially develop a better understanding of other people's perspectives.

**Reciprocal understanding remains a design goal; our formative tests do not establish lasting social connection or deep mutual understanding.**

## 1. Research and experience requirements

Five fully documented semi-structured gallery interviews identified uncertainty about interpreting art, interest in others' viewpoints and discomfort with forced conversation.

Research on visitor-generated contextual information suggests that other visitors' responses can support comparison and alternative ways of appreciating artworks ([Yi et al., 2022](#references)). Work on interpersonal museum experiences also examines how one visitor can shape another person's encounter ([Ryding et al., 2021](#references)). These sources provide a rationale for our concept without validating its exact game rules.

See [research documentation](https://github.com/iris0324/babear_deco3500/tree/main/docs/Research).

Our opportunity became:

**How might visitors exchange interpretations while keeping the physical artwork central?**

As the design developed, this opportunity was further considered in relation to different levels of social participation: how could visitors communicate and collaborate around artworks without requiring everyone to interact in the same way?

### Initial experience requirements

| ID | Initial experience requirement |
|---|---|
| ER1 | Form an independent interpretation before seeing others' perspectives. |
| ER2 | Look back at and notice details in the physical artwork. |
| ER3 | Keep social interaction optional and low-pressure. |
| ER4 | Encounter similar and contrasting interpretations. |
| ER5 | Keep digital interaction brief and redirect attention to the artwork. |
| ER6 | Control whether contributions are shared, with privacy and anonymity considered. |

These requirements provided a basis for developing and evaluating our concepts. They were not treated as a checklist automatically satisfied by adding features. Later testing and implementation revealed tensions between several requirements, particularly independent interpretation, optional participation and contribution-based game mechanics.

### Connecting research findings to design decisions

The following table summarises how research and formative observations informed the development of the experience.

| Research or evaluation evidence | Design implication | Design response | Remaining limitation |
|---|---|---|---|
| Gallery interviews identified uncertainty about interpreting artworks. | Visitors may benefit from accessible prompts rather than requiring art-history expertise. | Art Persona introduced mood, detail and story prompts. | Prompts alone did not create a strong visitor-to-visitor relationship. |
| Interviews and literature suggested value in encountering other visitors' perspectives. | One visitor's interpretation could influence another visitor's observation. | Iteration 2 Borrowed Eyes introduced artwork fragments, clues, interpretation, comparison and contribution. | Asynchronous exchange offered limited immediate follow-up or joint decision-making. |
| Round 2 findings suggested that another perspective could redirect attention to artwork details. | Social perspectives could support re-observation even without agreement. | We retained perspective comparison and the return to the physical artwork as important design principles. | Paper testing did not establish the effectiveness of the final digital experience. |
| Collaborative concept development explored clue sharing and shared decisions. | Different contributions could create interdependence and reasons to communicate. | Borrow the Eyes developed Solo and Team Play, including individual clue unlocking and team discussion. | Exchanging task information does not necessarily produce deeper interpretive discussion. |
| The exploratory survey showed different social preferences and limited confidence in sharing interpretations. | One compulsory social mode would not suit all visitors. | The final concept offers independent, paired, group and creator-based participation through four parallel features. | Providing choices does not prove that each mode is comfortable or accessible. |
| Round 3 Blind Eyes testing recorded explanations, responses, perspective differences and newly noticed details. | Asymmetric information and questioning could create opportunities for interpretive exchange. | Blind Eyes retained complementary roles, descriptions, questions and progressive clues. | Recorded communication events do not establish the depth or long-term impact of understanding. |
| A quieter participant found it difficult to contribute during Face-to-Face testing. | Group structures should consider unequal influence and participation pressure. | We considered structured contributions and lower-pressure interaction opportunities. | Mandatory comments and group decision-making can still create pressure or exclusion. |

This table represents a traceable design rationale, not proof that every feature has been fully validated. Where the evidence is formative or exploratory, we treat the corresponding design response as a hypothesis requiring further evaluation.

## 2. Iteration 1: Art Persona

Art Persona used prompts about mood, detail and story to support interpretation without art-history knowledge. The rationale for accessible prompts draws on ARTeMuse, which explored structured activities for beginning art viewers ([Shaer et al., 2011](#references)); that study did not evaluate our Art Persona concept.

The initial interaction encouraged visitors to observe an artwork, respond to accessible prompts and reflect on their own interpretations. The concept also provided ways to encounter other visitors' responses.

However, design reflection identified a weak social structure: visitors could receive a Persona result without another visitor meaningfully affecting their gallery experience.

Although the concept supported individual reflection, it did not yet provide a strong mechanism through which visitors could communicate, respond to one another or build on another person's contribution.

We therefore shifted from classifying visitors towards making **one visitor's observation shape another's search and attention**.

The important design change was not simply adding more content. It was changing the role of visitor-generated interpretations from passive responses into resources that could influence another visitor's experience.

![Art Persona interaction flow](https://raw.githubusercontent.com/iris0324/babear_deco3500/main/docs/Design/Design_Iteration_2/images/art-persona-flow.png)

*Figure 1. Early prompts supported individual interpretation; the next concept strengthened the visitor-to-visitor relationship.*

[Iteration 1 documentation](https://github.com/iris0324/babear_deco3500/blob/main/docs/Design/Design_Iteration_1.md)

### Reflection and transition

Art Persona helped us explore how to lower the barrier to personal interpretation, but it raised a further question:

**How could one visitor's interpretation become the starting point for another visitor's observation, exploration and response?**

This question informed Iteration 2.

## 3. Iteration 2: Borrowed Eyes

The paper prototype used an asynchronous loop:

**Choose → Find → Interpret → Compare → Re-observe → Contribute**

Visitors followed a fragment and clue, recorded their own interpretation, then encountered a previous perspective and left a trace for someone else.

In this interaction, a creator selected an artwork or artwork fragment and provided a clue and personal perspective. A later visitor used this information to find the artwork, form an interpretation, compare perspectives and contribute a response.

This established an **asynchronous form of visitor-to-visitor communication mediated by the artwork**.

The previous visitor's contribution was not simply background information. It could influence what the next visitor searched for, noticed and considered.

![Borrowed Eyes interaction flow](https://raw.githubusercontent.com/iris0324/babear_deco3500/main/docs/Design/Design_Iteration_2/images/borrowed-eyes-flow.png)

*Figure 2. Independent interpretation precedes the social reveal; contribution continues the exchange across visits.*

### What Iteration 2 achieved

An important outcome of Iteration 2 was that it already supported genuine communication.

Visitors could encounter another person's subjective interpretation, compare it with their own understanding and leave a contribution that could continue the exchange.

The value of this interaction should not be described as an absence of social engagement. Rather, it demonstrated that communication could take place asynchronously without requiring visitors to meet or speak at the same time.

Round 2 findings suggested that another perspective could redirect attention even when the visitor's interpretation stayed the same.

Disagreement could still be useful: visitors did not need to reach the same conclusion for another person's contribution to affect their observations.

This shifted our focus towards **perspective expansion and re-observation**, with clearer progressive clues.

Paper testing could not establish mobile distraction or digital sharing comfort.

See [Round 2 evidence and requirement review](https://github.com/iris0324/babear_deco3500/blob/main/docs/Evaluation/Round_2/Borrowed_Eyes_Round_2_Testing_Findings.md).

### What remained limited

Although Borrowed Eyes supported communication, its asynchronous structure offered relatively limited opportunities for:

- immediate follow-up questions;
- real-time discussion of different interpretations;
- shared decision-making;
- negotiation between participants;
- interdependence during a common task.

These were limitations in the **form and possible depth of interaction**, not evidence that Iteration 2 had failed to create communication.

The next design challenge was therefore:

**How might visitors move from encountering another person's perspective towards actively communicating and working with others, while preserving the value of individual interpretation?**

This question informed the collaborative and paired interaction concepts explored during Iteration 3.

## 4. Iteration 3: Flexible social participation

An exploratory survey of **30 respondents** found that **21/30 (70%)** enjoyed quiet artwork viewing, while **9/30 (30%)** felt confident sharing interpretations.

Communication difficulty, unresponsive partners and dominant members were concerns.

These self-reported preferences informed alternative participation modes; they do not establish their effectiveness.

See [survey findings](https://github.com/iris0324/babear_deco3500/blob/main/docs/Evaluation/Round_3/Survey_Findings.md).

The survey reinforced an important design principle: encouraging social engagement should not mean requiring all visitors to interact with strangers or participate in groups.

At the same time, the limitations identified in earlier concepts encouraged us to explore interaction structures in which visitors' contributions could become more interdependent.

### 4.1 Collaborative Borrowed Eyes: From sharing perspectives to shared tasks

We explored how Borrowed Eyes could support more active cooperation by introducing individual and team-based participation.

In the collaborative concept, participants could contribute observations, receive different clues, share information and work towards a common artwork-finding goal.

This changed the social relationship between participants.

In Iteration 2, a previous visitor's interpretation influenced a later visitor asynchronously.

In collaborative Borrowed Eyes, participants could influence one another during a shared task. Different members could hold complementary information, making communication and coordination useful for progressing together.

This introduced opportunities for:

- **Communication:** exchanging comments, observations and clues;
- **Cooperation:** contributing information towards a common goal;
- **Coordination:** deciding how and when to share information or submit an answer;
- **Collaboration:** jointly discussing possibilities and working towards a shared outcome.

However, the development of collaborative play raised a further limitation.

**Successfully finding the artwork together does not necessarily mean that participants understand one another's interpretations.**

A group may exchange only the clues required to identify the correct artwork. Participants may cooperate effectively while paying relatively little attention to why others noticed particular details or experienced different emotions.

This distinction became important in our subsequent design exploration.

### 4.2 Blind Eyes: Using information asymmetry to encourage interpretation and questioning

Blind Eyes explores a different interaction structure through two complementary roles:

- **Eye / Describer:** Can see the target artwork and communicate its visual details, observations and subjective impressions.
- **Finder / Guesser:** Cannot initially see the target artwork and must ask questions, interpret descriptions and make guesses.

The participants have access to different information and therefore have reasons to communicate.

Unlike an interaction based entirely on fixed clues, the Describer can choose how to explain the artwork, while the Guesser can respond with questions.

The interaction can involve objective descriptions, such as colour or composition, as well as subjective impressions, such as whether an artwork feels warm, tense or peaceful.

These descriptions may be understood differently by different participants.

This creates opportunities to explore not only **what the artwork is**, but also **how and why two people may experience it differently**.

Our design intention was to support more interpretive exchange rather than treating the number of messages or the correct answer as sufficient evidence of meaningful interaction.

However, information asymmetry does not automatically guarantee deeper understanding. Participants may still focus primarily on completing the guessing task.

The effectiveness of this approach therefore requires evaluation of the content and consequences of communication, not simply whether communication occurs.

### 4.3 Face-to-Face collaborative exploration

Face-to-Face testing explored shared clues, negotiation and joint decisions in a small-group setting.

This activity provided a way to examine how participants communicate and coordinate when working towards a common goal.

It also highlighted a limitation of group interaction: some participants may find it harder to contribute when others speak more confidently or take a dominant role.

Face-to-Face was an evaluated collaborative interaction concept. It should not be confused with **Group Chat**, which is one of the four parallel features presented in the final design.

The findings informed our reflection on team play, participation equality and the relationship between shared task completion and interpretive exchange.

### 4.4 Final integration: Four parallel main features

The final design combines different social interaction opportunities into **four parallel main features**.

These features are not a hierarchy and do not require visitors to follow one fixed sequence.

| Main feature | Intended visitor experience | Social and mobile computing focus |
|---|---|---|
| **Borrow the Eyes** | Explore artworks through cropped images, clues and visitor perspectives, independently or in teams. | Asynchronous perspective sharing, observation, communication and collaborative discovery. |
| **Blind Eyes** | Two visitors communicate through asymmetric information, descriptions, questions and artwork guessing. | Paired communication, questioning and opportunities for interpretive exchange. |
| **Group Chat** | Communicate with other gallery visitors, find teammates, organise groups and coordinate shared activities. | Direct social connection, communication and coordination. |
| **Leave Your Eyes** | Create artwork-based challenges by selecting images, leaving clues and interpretations, and setting questions. | Visitor-generated content and asynchronous contribution for future experiences. |

Each feature provides a distinct form of participation.

**Group Chat is one of the four main features, not a central system controlling the other three.**

Likewise, the final four features should not be confused with the three formally documented design iterations.

The iteration structure describes how the design developed; the feature structure describes the final concept.

### 4.5 Borrow the Eyes interaction flow and implemented team mechanics

![Iteration 3 Borrowed Eyes flow](https://raw.githubusercontent.com/iris0324/babear_deco3500/main/docs/Design/Design_Iteration_3/User_Flow_image/Page2.png)

*Figure 3. Solo and team routes expand participation choices. This design flow is not evidence that every feature is implemented or validated.*

In team-based Borrowed Eyes, each participant writes a personal interpretation to unlock one private clue, then shares that clue with the group before a collective guess.

The implementation requires every player to comment before a formal answer.

This creates a functional reason for each participant to contribute, but it also introduces a tension with optional, low-pressure participation.

Requiring an equal number of comments does not necessarily mean that all participants have equal influence over the group's decisions.

See the [Borrowed Eyes interface](https://github.com/iris0324/babear_deco3500/blob/main/Prototype/functional-prototype/src/pages/borrow.js) and [submission checks](https://github.com/iris0324/babear_deco3500/blob/main/Prototype/functional-prototype/src/core/events.js).

[Full interaction flows, including entry and Blind Eyes](https://github.com/iris0324/babear_deco3500/blob/main/docs/Design/Design_Iteration_3/Interaction_Flow.md)

### 4.6 Review of the original experience requirements

The requirements need a mode-specific reading rather than a claim that every requirement has been fully satisfied.

The following assessment distinguishes what is supported by the design, what remains partially addressed, and what has not yet been sufficiently validated.

| Requirement | Current review | Assessment |
|---|---|---|
| **ER1 — Independent interpretation** | Team play requires a personal interpretation before unlocking a clue. However, browsing and detail pages already show the creator's perspective. Comment-before-clue is implemented; the original interpretation-before-any-social-view sequence is not fully preserved. | **Partially supported** |
| **ER2 — Return to physical artwork** | Round 2 findings suggest that other perspectives can prompt re-observation. The final design continues to use artwork finding and observation as central activities. However, actual attention to artworks in the final digital prototype has not been fully measured. | **Partially supported; further digital evaluation needed** |
| **ER3 — Optional, low-pressure social interaction** | Solo offers an alternative to direct interaction, and the final concept includes different participation options. However, comments are still required to unlock clues, and team participation can introduce pressure. Mode choice alone does not establish comfort. | **Partially supported** |
| **ER4 — Similar and contrasting interpretations** | Iteration 2 supported comparison with previous perspectives, while Round 3 recorded differences in perspective and newly noticed details. These findings support the design direction, but the quality and longer-term impact of interpretation exchange remain uncertain. | **Supported by formative observations; not fully validated** |
| **ER5 — Brief digital interaction** | The design intends to redirect attention to artworks through searching, observation and comparison. Actual screen time and attention competition in the final digital prototype have not been sufficiently evaluated. | **Not yet validated** |
| **ER6 — Control over sharing and privacy** | Early paper contribution sheets requested permission for anonymous reuse, and some prototype flows provide guest or anonymous participation. However, contribution requirements, stored messages, sharing consent, retention and withdrawal controls remain incomplete. | **Partially addressed; significant ethical and implementation gaps remain** |

This review shows that the design has progressed towards its original requirements, but several requirements remain in tension with the implemented mechanics.

In particular, ER1 and ER3 reveal that encouraging contribution can conflict with independent interpretation and voluntary participation.

These tensions should inform future refinement rather than being hidden by a claim of complete requirement satisfaction.

## 5. Round 3: What evaluation changed

On **14 October 2026**, **four people** completed four two-player Blind Eyes rounds.

Three also joined one Face-to-Face session.

These overlapping activities were small formative evaluations, not independent comparative trials or validation of the final online build.

### 5.1 Recorded observations

Blind Eyes observations recorded:

| Observation category | Recorded events |
|---|---:|
| Perspective initiations | 17 |
| Interpretive explanations | 17 |
| Substantive responses | 21 |
| Perspective differences | 10 |
| Newly noticed details | 14 |

These are **event counts**, not participant numbers or direct measures of exchange quality.

The observations indicate that the interaction generated communication around artworks, including explanations, responses and differences in perspective.

However, the presence of communication does not automatically establish deeper mutual understanding.

Interpretive questions sometimes served mainly to identify the artwork.

Face-to-Face interviews described negotiation and influence, but a quieter participant found speaking up difficult.

Structured observation and confirmed task-success data were incomplete.

### 5.2 What the evaluation suggested

The testing informed several important reflections.

**Communication occurred, but its purpose varied.**

Participants asked questions and responded to one another, yet some exchanges remained focused on obtaining information needed to guess the artwork.

**Perspective differences created opportunities for further discussion.**

Recorded differences and newly noticed details suggest that the interaction could expose participants to alternative observations. However, the testing did not establish whether these opportunities consistently developed into deeper understanding.

**Group participation was not automatically equal.**

The quieter participant's experience suggested that collaborative activities require attention to participation structure, not simply shared goals.

**Task success and social value should be evaluated separately.**

Finding the correct artwork is one possible outcome. Understanding how another person interprets an artwork is a different outcome and requires different evaluation evidence.

### 5.3 Design implications and proposed refinements

We therefore propose testing:

- an optional post-reveal comparison that invites participants to discuss different interpretations after identifying the artwork;
- clearer opportunities for the Eye / Describer to explain subjective impressions;
- participation structures that support quieter members without requiring equal speaking time;
- ways to evaluate whether another person's contribution changes what a participant notices or how a group makes decisions;
- alternatives when a partner does not respond or a visitor does not wish to continue interacting.

These are **proposed refinements, not validated outcomes**.

In particular, the optional post-reveal comparison should not be presented as a confirmed implemented and tested feature.

Future evaluation should track how contributions change attention or decisions, alongside talk frequency.

See [Round 3 results](https://github.com/iris0324/babear_deco3500/blob/main/docs/Evaluation/Round_3/Testing_Results.md).

### 5.4 Evaluation limitations

The Round 3 activities were formative and involved a small, overlapping group of participants.

The observations were useful for identifying interaction opportunities and problems, but they do not support broad generalisations about gallery visitors.

We did not conduct a controlled comparison demonstrating that one feature produced deeper interpretation or stronger social connection than another.

The testing also did not establish long-term engagement, lasting reciprocal understanding, production-level safety, or the effectiveness of every final online feature.

These limitations define the next questions for evaluation rather than invalidating the design insights gained from the activities.

## 6. Theory and ethical reflection

### 6.1 Social interaction and information asymmetry

As an explicit reading of the current design, the asymmetric-interaction framework of **[Bréhault et al. (2025)](#references)** helps identify who can access which information:

- a previous visitor's trace or interpretation;
- the Eye / Describer's privileged view of an artwork;
- the Finder / Guesser's need to ask questions;
- team members' complementary private clues.

This provides a useful analytical lens for understanding why participants may need to communicate or coordinate.

However, information asymmetry creates an opportunity for interaction; it does not by itself prove that meaningful cooperation or perspective exchange has occurred.

We do not claim the framework guided every earlier decision. It is used here as a retrospective analytical perspective on the current design.

Our [literature synthesis](https://github.com/iris0324/babear_deco3500/blob/main/docs/Research/Iteration3/Literature_And_Findings.md) connects asymmetry with museum coordination and meaning-making research.

### 6.2 Distinguishing communication, cooperation and collaboration

The design process also highlighted the importance of distinguishing different forms of social interaction. The descriptions below are working distinctions used to analyse this project, rather than a validated scale of social depth or a claim that every activity belongs to only one category.

**Communication** can occur when visitors exchange observations or interpretations asynchronously, as demonstrated by the Iteration 2 Borrowed Eyes concept.

**Cooperation** becomes more visible when participants contribute information towards a shared task, such as identifying an artwork together.

**Coordination** is involved when participants organise contributions, exchange clues or agree on actions.

**Collaboration** may involve joint interpretation, discussion and decision-making, but the presence of a team or shared goal does not automatically establish the depth of collaboration.

These distinctions help explain why the design developed beyond simply displaying other people's comments.

They also prevent us from treating message counts, task completion and reciprocal understanding as equivalent outcomes.

### 6.3 Ethical reflection throughout the process

Ethical considerations also constrain the experience.

Round 2 contribution sheets requested permission for anonymous reuse.

Later accounts, location checks and comments require renewed scrutiny of consent, retention and withdrawal.

Early exposure to others' views risks anchoring, while compulsory contribution risks exclusion.

The development of live communication and visitor-generated content introduces further responsibilities relating to privacy, unwanted contact, moderation and safe participation.

Different social preferences also create a tension between encouraging interaction and respecting a visitor's decision not to engage.

These remain linked design and ethics questions; a full ethics-framework assessment belongs on the [dedicated page](https://github.com/iris0324/babear_deco3500/wiki/Ethical-Considerations).

The ethical analysis should be understood as ongoing design reflection rather than proof that all risks have been resolved. The dedicated ethics page applies the Ethical Disclaimer tool, which asks designers to identify affected stakeholders, potential harms and the responsibilities they accept ([Ethics for Designers, n.d.](#references)).

## 7. Prototype scope and limitations

The final prototype demonstrates the main Borrowed Eyes design concept, but its components differ in technical implementation and evaluation status.

The distinction between **conceptual design**, **implemented interaction**, and **validated behaviour** is important when interpreting the final result.

| Component | Documented status |
|---|---|
| **Borrow the Eyes** | Browser-based proof of concept supporting Solo and Team interaction flows. Individual comments, private clues, clue sharing and collective guessing demonstrate the intended mechanics. Local interactions do not establish shared persistence across independent devices. |
| **Blind Eyes** | Iris completed and refined the backend. The online flow includes anonymous sign-in, matching, room-based chat and backend-managed game state. The team confirmed successful on-site online testing with two phones: QR-code access, partner matching and visibility of the matched partner. This confirms the tested connection flow, without claiming every feature or edge case was evaluated. |
| **Group Chat** | One of the four main features in the final design. The gallery communication and group-coordination experience is represented in the prototype, but wider gallery chat should not be described as a validated production-level online service. |
| **Leave Your Eyes** | The creator interface supports constructing artwork-based challenges, including images, comments, clues and questions. Current publication is browser-local and does not automatically add user-created challenges to the live online Blind Eyes dataset. |
| **Accounts and location verification** | Interface flows and guest access are available, but location permission success is not reliable gallery-presence verification. The current prototype should not be described as having secure geofencing. |
| **Reporting, blocking and moderation** | Some safety controls are demonstrated locally. They do not establish operational server-side moderation, enforceable blocking or a complete incident-response process. |

The prototype therefore demonstrates a combination of implemented functionality and interaction concepts.

It should not be described as a fully deployed gallery platform.

### Key limitations

Small samples, self-reported survey preferences, missing observations and no controlled mode comparison limit our conclusions.

Long-term participation, moderation, accessibility and screen attention need further study.

The online Blind Eyes matching test provides evidence for the tested multiplayer connection flow, not for the safety, accessibility or social effectiveness of the entire system.

Similarly, the presence of four main features in the final design does not mean that all four have the same degree of backend implementation or testing.

### Next evaluation priorities

The next evaluation priority is to test whether the implemented social interactions redirect attention to art and support reciprocal exchange.

More specifically, future work should investigate:

1. **Interpretive depth:** Do participants respond to another person's subjective interpretation, or mainly exchange information needed to finish a task?
2. **Physical attention:** Do the interactions encourage visitors to return to the artwork, and how much time do they spend looking at the screen?
3. **Participation comfort:** Can quieter or less socially confident visitors participate without unnecessary pressure?
4. **Mode choice:** Do the four main features support different visitor preferences in practice?
5. **Technical reliability:** How do matching, disconnection, non-response and multi-device interaction behave in realistic conditions?
6. **Ethics and accessibility:** Are consent, privacy, moderation and accessible alternatives sufficient for a real gallery deployment?

These questions reflect the limitations identified through the current design and formative evaluation.

## 8. Team contributions

This summary records the team's contributions, with backend ownership clarified by the team.

Responsibilities overlapped; all members participated in testing and design discussions.

| Member | Main contributions |
|---|---|
| Yunlin Wang (Iris) | Initial website architecture, frontend and UI/UX foundation; completed and refined the full backend used in the final prototype; code integration and repository organisation. |
| Yining Zhu (Ning) | Research documentation, survey design, interview synthesis and evidence organisation; prototype refinement. |
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
