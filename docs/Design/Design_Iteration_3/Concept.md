# Design Iteration 3 — Borrowed Eyes: From Individual Interpretation to Shared Experiences

## 1. Iteration Overview

Borrowed Eyes explores how artworks can become starting points for conversations between gallery visitors. Rather than focusing only on finding the correct artwork, our project considers how visitors might share personal interpretations, encounter different viewpoints, and develop a better understanding of one another.

Our earlier iterations helped us recognise a tension in gallery participation. Visitors may be curious about how others see an artwork, but this does not necessarily mean they feel comfortable approaching strangers or joining a group discussion. We therefore wanted to create opportunities for social interaction without making direct conversation compulsory.

In Iteration 3, we developed Borrowed Eyes into four parallel main features:

- **Borrow the Eyes:** Visitors explore artwork details and perspectives left by others. They can participate individually or work with a team.
- **Blind Eyes:** Two visitors communicate with different access to visual information. One describes an artwork while the other tries to identify it through conversation.

- **Group Chat:** Visitors communicate, find teammates and coordinate shared activities.
- **Leave Your Eyes:** Visitors create artwork-based challenges and perspectives for future participants.

All four features are equally important parts of the final concept. They are not successive stages or a hierarchy controlled by Group Chat. Their implementation and evaluation status differ. The Gallery Map and entry/account flows support navigation; Face-to-Face refers to an evaluated collaborative activity, not a separate final feature.

> **Design Opportunity:** There is an opportunity to use artworks as shared conversation anchors, helping gallery visitors move beyond discussing art to sharing personal experiences, understanding different backgrounds, and building meaningful human connections.

This remains our design goal. Our formative testing provides evidence of communication and perspective exchange, but it does not yet establish that the experience creates lasting or meaningful interpersonal connections.

## 2. How We Reached This Iteration

### 2.1 From Art Persona to Borrowed Eyes

Our first concept, **Art Persona**, used playful prompts to encourage visitors to observe artworks and form personal interpretations. It provided an accessible way to begin looking at art, but the social interaction between visitors was limited.

In Iteration 2, we introduced **Borrowed Eyes**, an asynchronous experience built around artwork fragments, clues, and visitor comments. One visitor's observation could become part of another visitor's gallery experience.

The paper prototype encouraged participants to interpret artworks, compare perspectives, and return to the original artwork with new questions. However, the interaction between visitors was largely indirect.

This raised a further design question:

**How might we support more direct communication and cooperation while preserving the option to explore art independently?**

Iteration 3 responds to this question by developing different ways of participating within the same project.

### 2.2 Research Informing the Design

Our exploratory survey collected responses from 30 participants. Several findings influenced the direction of the third iteration.

| Survey finding | Design consideration |
| --- | --- |
| 21 of 30 respondents (70%) selected quiet artwork viewing as something they enjoy. | Keep an individual participation option rather than requiring group interaction. |
| 9 of 30 (30%) reported confidence in sharing interpretations with other visitors. | Make social interaction approachable and provide clear expectations. |
| 10 of 30 (33%) indicated that anonymity would increase their comfort. | Explore lower-pressure communication without assuming anonymity solves every social barrier. |
| 13 of 30 (43%) were concerned that a Blind Eyes partner might not respond. | Consider matching, communication expectations, and ways to leave or restart an interaction. |
| 14 of 30 (47%) were concerned that one person might dominate group discussion. | Examine whether each team member can contribute to a shared decision. |
| 22 of 30 (73%) wanted to know an activity's duration before joining. | Explain participation requirements and likely commitment before the activity begins. |

These results suggest that visitors may want opportunities for social engagement while still valuing personal space and control over participation.

The survey was exploratory and involved a small sample. Its results informed our design choices rather than establishing general preferences among all gallery visitors.

### 2.3 Connections to Academic Research

Our literature review also informed the third iteration.

Research on visitor-generated social information suggests that other people's perspectives can offer alternative ways of engaging with artworks (Yi et al., 2022). Work on interpersonal museum experiences highlights the potential of designing encounters in which one person's contribution shapes another person's experience (Ryding et al., 2021).

For Blind Eyes, research on communication under unequal visual access provided a useful way to think about description, clarification, and perspective-taking (Hawkins et al., 2021). Bréhault et al. (2025) further helped us consider how differences in available information shape collaborative interaction.

Research on group museum visits also informed our team-based experience. Tolmie et al. (2014) and Fosh et al. (2016) draw attention to the practical work involved in coordinating movement, attention, and participation during a shared visit.

Together, these studies helped us frame social interaction as more than simply placing visitors in the same activity. We became interested in whether participants respond to one another, negotiate different interpretations, and use others' contributions in their decisions.

The literature provides a rationale for exploring these mechanisms; it does not validate the effectiveness of our specific prototype.

## 3. Current Design Concept

### 3.1 Borrow the Eyes — Individual and Team Exploration

**Design intention**

Borrow the Eyes builds on the asynchronous interaction introduced in Iteration 2. Visitors begin with a cropped detail of an artwork and explore the gallery to identify the original piece.

The activity offers two participation routes: **Play Alone** and **Play Together**.

#### Solo Experience

In the individual route, a visitor chooses an artwork detail, explores the available clues, searches for the original artwork, and submits an answer.

The detail and its associated personal comment provide a connection to another visitor's way of seeing the artwork, even when the two visitors never meet.

This route allows visitors to engage at their own pace. It is particularly relevant to our survey findings about quiet viewing and limited confidence in speaking with unfamiliar people.

However, asynchronous exposure to another person's comment should not be treated as evidence of reciprocal understanding. The current interface also shows the creator's perspective before the visitor completes the search, which differs from the earlier paper prototype's independent-interpretation-first sequence.

#### Team Experience

The team route introduces direct cooperation.

Each participant begins with the same artwork fragment but contributes a personal comment to unlock an individual clue. Team members can then share their clues, discuss possible artworks, and make a collective decision.

The design distributes information so that participants have a reason to communicate rather than simply search independently.

The current rules also connect challenge difficulty, team size, and the number of available answer attempts. For example, a five-star challenge gives a three-person team three shared attempts.

The team experience is intended to encourage three forms of social interaction:

- **Communication:** Sharing clues, observations, and interpretations.
- **Coordination:** Deciding how to search, exchange information, and approach the task.
- **Cooperation:** Bringing individual contributions together to make a shared decision.

These mechanisms create opportunities for collaboration, but a correct answer does not necessarily mean that every member participated equally or gained a new understanding of the artwork.

**Current implementation:** Solo gameplay and a local demonstration of the team sequence are available in the digital prototype. Team participation is not implemented as the same real-time online multiplayer system used by Blind Eyes.

### 3.2 Blind Eyes — Conversation Through Different Perspectives

**Design intention**

Blind Eyes explores how unequal access to an artwork might create a reason for two visitors to communicate.

The experience involves two complementary roles:

- **Describer:** Can see the target artwork but does not receive its title or location.
- **Guesser:** Cannot see the target artwork and relies on conversation to identify it.

Players can be matched through a shared topic or personal association. The Describer explains what they see, while the Guesser asks questions and considers possible artworks.

The information gap is intended to encourage more than factual description. Questions about atmosphere, meaning, emotions, and personal associations may reveal differences in how people interpret the same image.

#### Development of the Rules

The paper prototype tested on 14 October 2026 used a limit of three factual questions, while allowing unlimited perspective-related questions.

This rule was intended to encourage participants to move beyond straightforward factual identification.

Following the design development, the latest digital flow uses a different mechanism:

1. Players can communicate without a fixed limit on ordinary chat questions.
2. The Guesser submits a formal artwork guess when ready.
3. Incorrect formal guesses consume an attempt and progressively unlock clues.
4. The number of formal attempts depends on the challenge's star difficulty.
5. After the round, the artwork is revealed, allowing the participants to continue discussing it.

For a five-star Blind Eyes challenge, the design specifies six formal answer attempts, with clues released after incorrect submissions.

**This is a design revision, not a tested finding.** The October paper-prototype results cannot be used to claim that the revised digital rules produce better communication.

#### Social Value and Design Tension

Blind Eyes gives participants a shared task and a reason to ask questions. During testing, participants sometimes described different emotional or symbolic meanings in the same artwork.

At the same time, the guessing objective can narrow the conversation. A question about mood may be asked simply to eliminate candidate artworks rather than to understand the Describer's perspective.

The design therefore needs to balance task progress with opportunities for reflection.

A possible next step is to investigate whether a short post-reveal comparison can encourage participants to explain why they interpreted the artwork differently.

**Current implementation:** The online prototype uses Supabase for anonymous authentication, partner matching, room messaging, and server-side game state. The team has checked QR-code access and successful matching on two phones. These checks do not constitute a complete evaluation of the digital gameplay or its social outcomes.

### 3.3 Group Chat

Group Chat is intended to help visitors find others who are interested in participating and coordinate team activities within the gallery.

The design includes visitor discovery, messaging, team invitations, and access linked to gallery presence.

As a main feature, Group Chat supports direct communication and coordination; it does not control access to the other three features.

This feature responds to practical questions raised during the design process: How do visitors find a partner? How do they decide whether to join a group? How can they communicate before beginning an activity?

The current prototype demonstrates wider gallery chat and related social interfaces using local state. Location permission does not verify that a visitor is physically inside a particular gallery, and reporting or blocking demonstrations should not be described as fully operational safety systems.

These distinctions matter when discussing the current prototype's readiness for use in a real public gallery.

### 3.4 Leave Your Eyes

Leave Your Eyes allows visitors to contribute their own way of seeing an artwork.

A visitor selects an artwork, chooses a cropped detail, writes a personal comment, and creates a sequence of clues. These contributions can then form the basis of challenges for future visitors.

The feature extends the original idea of Borrowed Eyes: visitors are not only consumers of artwork information but potential contributors to other people's experiences.

The current design organises clues from more abstract associations towards more concrete visual or location information. The cropped area also informs challenge difficulty.

In the current prototype, newly created tasks are stored locally in the browser. They are not automatically published to the online matching dataset.

This remains an important implementation limitation, especially if the project is developed further as a visitor-generated platform.

## 4. Formative Evaluation

### 4.1 Evaluation Aim

On 14 October 2026, we conducted formative testing to examine whether the proposed interactions could support communication, coordination, cooperation, and perspective exchange.

We were particularly interested in the difference between **completing an artwork-finding task** and **engaging meaningfully with another person's interpretation**.

The testing included:

- Four rounds of the earlier Blind Eyes paper prototype.
- One three-person Face-to-Face collaborative activity.

Four people participated across the four Blind Eyes rounds, with some switching roles. Three of these people also participated in the Face-to-Face session. The sessions therefore did not involve independent participant samples.

The Face-to-Face activity tested a distributed-clue collaboration mechanism that informed the later team-based Borrow the Eyes design. It should not be presented as a direct evaluation of the final digital Team Mode.

### 4.2 Blind Eyes Findings

Across the four Blind Eyes rounds, the observation records documented:

| Observed interaction | Total recorded events |
| --- | ---: |
| Factual questions | 10 |
| Perspective initiations | 17 |
| Interpretive explanations | 17 |
| Substantive responses | 21 |
| Perspective differences | 10 |
| Newly noticed details | 14 |

These counts indicate that participants did exchange observations and interpretations. However, the number of conversational events does not establish the depth or quality of those exchanges.

Three findings were particularly relevant to the design.

**Finding 1 — Different interpretations created opportunities for discussion.**

Participants sometimes understood the same artwork in noticeably different ways. In one round, the Describer focused on the harmony between people and nature, while the Guesser associated the image with religion and teaching.

These differences suggest that the artwork could provide a starting point for conversation beyond its visible features.

**Finding 2 — Perspective questions were sometimes used mainly to complete the task.**

Participants asked about mood, meaning, and visual impressions, but these questions could also function as tools for eliminating possible artworks.

This distinction matters because asking a subjective question does not automatically demonstrate curiosity about another person's experiences.

**Finding 3 — The reveal stage offered another opportunity for reflection.**

Participants sometimes recognised interpretive differences more clearly after the artwork was revealed. The interviews also brought out ideas that had not necessarily been expressed during gameplay.

This suggests that post-reveal reflection deserves further investigation. However, we cannot assume that interview responses would have emerged spontaneously during the activity.

The three-factual-question limit was not compared with an unrestricted condition. We therefore cannot conclude that the limit caused more meaningful conversation.

### 4.3 Face-to-Face Findings

The Face-to-Face activity involved three participants who received different perspective clues and searched for an artwork together without assigned roles.

Interview accounts described a process of sharing clues, examining candidate artworks, discussing disagreements, and reaching a collective choice.

Three findings informed our thinking about team-based interaction.

**Finding 1 — Different clues gave participants a reason to contribute.**

Participants described combining information from different members and reconsidering possible answers when someone offered another interpretation.

This supported our decision to retain individual clues in the later Team Mode.

**Finding 2 — Coordination emerged during the activity, but was not always understood in the same way.**

One participant recalled dividing the search into different areas, while the others did not describe an explicit division of responsibilities.

Rather than treating this as a contradiction to resolve, we see it as a reminder that coordination can be informal and may be experienced differently by group members.

**Finding 3 — Participation comfort varied.**

One participant reported feeling comfortable expressing disagreement, while another found it difficult to speak up at times.

This finding matters because a group can reach a shared answer without providing an equally comfortable experience for everyone.

The Face-to-Face observation-count fields were incomplete, and the recorded task outcome did not confirm whether the selected artwork was correct. We therefore do not report an interaction frequency or success rate for this session.

### 4.4 What the Testing Changed in Our Thinking

The testing helped us distinguish three outcomes that had previously been closely connected in our design discussions:

1. **Task completion:** Whether visitors identify the correct artwork.
2. **Social interaction:** Whether visitors exchange information, respond, and coordinate.
3. **Perspective exchange:** Whether visitors engage with, question, or reconsider another person's interpretation.

These outcomes may occur together, but they should not be treated as interchangeable.

For Borrow the Eyes, this means that sharing different clues is a starting point for cooperation rather than proof of meaningful collaboration.

For Blind Eyes, the challenge is to support conversation that goes beyond narrowing down the correct answer.

These findings informed our subsequent design decisions. They do not establish that the revised digital mechanics have already solved these problems.

For the detailed methodology and evidence, see [Round 3 Testing Results](../../Evaluation/Round_3/Testing_Results.md).

## 5. Design Principles

The third iteration is guided by five principles developed from our research and evaluation.

### 5.1 Keep the Artwork Central

The digital experience should encourage visitors to look closely at physical artworks rather than spend the entire activity interacting with a screen.

Artwork fragments, questions, and clues are intended to direct attention back to the exhibition.

### 5.2 Allow Different Levels of Participation

Visitors should be able to choose between independent exploration and direct social interaction.

The design should not assume that everyone wants to speak with strangers or join a team.

### 5.3 Make Individual Contributions Matter

In collaborative activities, each participant should have an opportunity to offer information or an interpretation that can influence the shared decision.

Distributing clues is one way to support this, although its effect on balanced participation still requires evaluation.

### 5.4 Support Interpretation, Not Only Correct Answers

Identifying an artwork can motivate exploration, but the project also values personal interpretation and engagement with different viewpoints.

We should evaluate whether participants explain, question, or reconsider perspectives rather than measuring task success alone.

### 5.5 Respect Comfort, Privacy, and Choice

Personal interpretations may reveal sensitive feelings or experiences. Visitors should have control over what they share and whether they continue an interaction.

Anonymity, clear expectations, and exit options can support this goal, but technical safeguards and moderation require further development before real-world deployment.

## 6. Current Prototype and Implementation Scope

The latest prototype brings together the four parallel features in a mobile-oriented web interface, with different levels of backend implementation.

| Component | Current status |
| --- | --- |
| Borrow the Eyes — Solo | Local interactive gameplay |
| Borrow the Eyes — Team | Local demonstration of individual comments, clue sharing, and collective guessing |
| Blind Eyes | Online anonymous matching, room chat, and game state supported by Supabase |
| Group Chat | Local demonstration of visitor and team communication |
| Leave Your Eyes | Browser-local challenge creation and publication |
| Gallery Map | Interactive catalogue and area-based clue interface |
| Location verification | Permission and demonstration flow; no reliable gallery-boundary verification |
| Reporting and blocking | Demonstration/local behaviour; no complete operational moderation system |

The active deployed version is located in [`Prototype/functional-prototype/`](../../../Prototype/functional-prototype/).

The directory named `Prototype/Final Prototype/` contains an earlier reference build and is not the current deployed source.

The final digital interface has not undergone a comprehensive evaluation of usability, accessibility, privacy, or the revised game rules. Implementation progress should therefore be distinguished from the findings of the earlier formative testing.

## 7. Limitations and Further Development

Although Iteration 3 helped clarify the social mechanisms we want to explore, several questions remain open.

First, the formative evaluation involved a small number of participants, with repeated participation across sessions. The findings are useful for identifying design opportunities but cannot establish broader effectiveness.

Second, the Blind Eyes and Face-to-Face activities were not controlled comparisons. They differed in structure, roles, and information distribution, and the evidence does not support claims that one was more effective than the other.

Third, the revised digital game rules were developed after the paper-prototype evaluation. Further testing is needed to understand how unrestricted conversation, progressive clues, and difficulty-based attempts affect participants' behaviour.

Fourth, the current team experience has not yet demonstrated that distributing clues produces balanced participation. Future observation should examine whose contributions influence decisions and whether quieter members have meaningful opportunities to participate.

Finally, the broader social and location-based features remain partly simulated. Before real-world deployment, the system would need stronger privacy controls, reliable moderation, clearer data-handling procedures, and accessibility testing.

Our next evaluation would therefore focus on:

- Whether participants understand the current game rules and joining process.
- Whether conversations move beyond factual identification towards interpretation.
- Whether a post-reveal comparison encourages reflection on different viewpoints.
- How team members coordinate and use one another's contributions.
- Whether participants feel comfortable contributing, disagreeing, or leaving.
- Whether mobile interactions direct attention back to physical artworks.

## 8. Reflection and Conclusion

Iteration 3 marked a shift in how we understood social engagement in galleries.

At the beginning of the project, we were mainly concerned with helping visitors notice artworks and express their own interpretations. Through research and testing, we became more interested in what happens when those interpretations are shared with someone else.

This led us to develop two complementary games. Borrow the Eyes connects visitors through artwork fragments, personal comments, and collaborative clues. Blind Eyes uses different access to visual information to create a reason for direct conversation.

The testing showed that these mechanisms can prompt communication, comparison, and collective decision-making. It also revealed that participants may remain focused on solving the task, and that opportunities to speak do not guarantee equal participation or mutual understanding.

For us, this is an important distinction. The aim of Borrowed Eyes is not simply to make art viewing more interactive. It is to investigate how artworks might help people share different ways of seeing and create opportunities for more meaningful encounters.

The current prototype represents a step towards that goal, while leaving clear questions for future design and evaluation.

---

## Related Project Documentation

- [Design Iteration 2 — Concept](../Design_Iteration_2/Concept.md)
- [Iteration 3 — Interaction Flow](Interaction_Flow.md)
- [Iteration 3 — Literature and Findings](../../Research/Iteration3/Literature_And_Findings.md)
- [Design Opportunity](../../Requirements/Design_Opportunity.md)
- [Survey Results](../../Evaluation/Round_3/Survey_Results.md)
- [Survey Findings](../../Evaluation/Round_3/Survey_Findings.md)
- [Round 3 Prototype Testing Results](../../Evaluation/Round_3/Testing_Results.md)
- [Active Prototype](../../../Prototype/functional-prototype/)
- [Ethical Considerations](https://github.com/iris0324/babear_deco3500/wiki/Ethical-Considerations)
