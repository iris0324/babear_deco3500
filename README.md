# Borrowed Eyes

**DECO3500 Social & Mobile Computing | Semester 2, 2026 | Team 6: Babear**

Borrowed Eyes explores how visitors' observations can become starting points for engaging with artworks and exchanging perspectives. Research and formative evaluation led from Art Persona to asynchronous visitor traces, then to flexible individual, paired and team participation. Meaningful mutual understanding remains a design goal, not a proven outcome of successful artwork identification.

## Start here

- **[Open the online prototype](https://iris0324.github.io/babear_deco3500/)**
- **[Tradeshow poster](docs/Poster/poster.png)**
- **[Design Process Overview](https://github.com/iris0324/babear_deco3500/wiki/Design-Process-Overview)**
- **[Ethical Considerations](https://github.com/iris0324/babear_deco3500/wiki/Ethical-Considerations)**
- **[Internal Meeting Records](https://github.com/iris0324/babear_deco3500/wiki/Internal-Meeting-Records)**

## Try the core two-person experience

1. Open the online prototype on two phones or in two independent browser sessions. Use **Guest**; Blind Eyes uses anonymous sign-in and does not require an email account.
2. Enter **Blind Eyes** and select the **same topic** on both devices. Choose role preferences as prompted. Matching assigns complementary Describer and Guesser roles.
3. Wait for the real partner match, then choose **Accept Match** and **Start Chat**.
4. The Describer sees the artwork detail; the Guesser asks questions and submits an artwork guess. The implementation supports room chat and progressive clues after incorrect guesses.
5. Use **Leave Conversation / Leave Game** to exit. After a round, **Find a New Partner** returns to topic selection.

**Confirmed field check:** The team tested the online prototype on site with two phones, scanning a QR code to access it, successfully matching and seeing the partner. This confirms those tested steps; it is not a claim that all safety, accessibility or gameplay features underwent a full evaluation. Specific device models and browser versions were not recorded in the supplied test account.

## Functional and simulated scope

| Component | Current scope |
|---|---|
| Blind Eyes | Real Supabase anonymous sign-in, partner matching, room messaging and server-side game state. Iris completed and refined the final backend. |
| Borrowed Eyes solo | Local artwork/detail exploration, personal comments, clues and answer checking. |
| Borrowed Eyes team | Local demonstration of individual comment → private clue → sharing → collective guess. It is not the same backend flow as online Blind Eyes. |
| Leave Your Eyes | Browser-local creator and publication; new tasks do not automatically enter the online matching dataset. |
| Wider gallery profiles/chat, friend requests and blocking | Demonstrations/local state; do not assume real social connections or server-enforced blocking. |
| Reports and mute | Report records and message hiding are local. Reports are not delivered to a moderator. |
| Gallery location access | Permission/demo gate; current code does not check a real gallery boundary. |

See [prototype instructions](Prototype/README.md), [implementation map](Prototype/functional-prototype/README.md) and [online backend setup](supabase/BLIND_EYES_SETUP.md).

## Research, design and evaluation

| Area | Documents |
|---|---|
| Initial domain, literature and interviews | [Iteration 1 research](docs/Research/Iteration1/), [interview records](docs/Research/Iteration1/interview-round-1.md) |
| Targeted literature and later synthesis | [Iteration 2](docs/Research/Iteration2/), [Iteration 3](docs/Research/Iteration3/Literature_And_Findings.md) |
| Design opportunity and requirements | [Opportunity](docs/Requirements/Design_Opportunity.md), [requirements and current review](docs/Requirements/Experience_Requirements.md) |
| Design evolution and flows | [Design index](docs/Design/README.md) |
| Round 2 paper testing | [Plan](docs/Evaluation/Round_2/Borrowed_Eyes_Testing_Plan.md), [findings](docs/Evaluation/Round_2/Borrowed_Eyes_Round_2_Testing_Findings.md), [evidence](docs/Evaluation/Round_2/Testing_evidence/) |
| Exploratory survey, 30 responses | [Questionnaire](docs/Evaluation/Round_3/Survey_Questionnaire.md), [results](docs/Evaluation/Round_3/Survey_Results.md), [findings](docs/Evaluation/Round_3/Survey_Findings.md) |
| Round 3 formative evaluation, 14 October 2026 | [Testing results](docs/Evaluation/Round_3/Testing_Results.md): four people across four paired rounds, with three also joining one group session |
| Poster | [Poster and materials](docs/Poster/README.md) |

The interview documents contain five complete written records and a separate summary reporting six interviews. The overview uses the five fully documented records; the total should be reconciled against the original evidence. The later survey is separate from the initial interview study.

## Run or deploy

The active source is **[Prototype/functional-prototype](Prototype/functional-prototype/)**. Serve that directory with a static server (for example VS Code Live Server or `python3 -m http.server 5500` from that directory), then open the server URL. No npm build is required. Online Blind Eyes additionally needs internet access and the configured Supabase service; see [backend setup](supabase/BLIND_EYES_SETUP.md). Never add server secrets to frontend code.

The [GitHub Actions workflow](.github/workflows/deploy-prototype.yml) deploys this directory. **[Prototype/Final Prototype](Prototype/Final%20Prototype/)** is an earlier standalone/reference build; despite its folder name, it is not the current deployed entry point.

## Team contributions

Responsibilities overlapped; all members participated in testing and design discussions.

| Member | Main contributions |
|---|---|
| Yunlin Wang (Iris) | Initial website architecture, frontend/UI foundation, the completed and refined final backend, and code integration. |
| Yining Zhu (Ning) | Research documentation, survey design, interview synthesis, evidence and repository organisation, and prototype refinement. |
| Binyan Zhang (Zoe) | Interviews, testing and analysis; user flows for both rounds; later website and prototype refinement. |
| Muchu Wang (Muchu) | Wiki/process documentation, interviews, testing, evaluation synthesis and collaborative concept development. |
| Xinyue Chang (Ivy) | Team coordination, concept/interaction design, prototype development, visual refinement and poster design. |

See the published Wiki, meeting records and commit history for context. Files in [Wiki/](Wiki/) mirror or guide the published pages; the linked published Wiki is the assessment-facing version.

## Assessment hand-in

Submit this public repository URL and the combined **Design Process Overview + Ethical Considerations** PDF named **Babear_3DesignPrototype.pdf** through Blackboard. Export after the final Wiki review so both versions match. A repository update is not a Blackboard submission.

## AI use

Generative AI assisted documentation organisation and language editing. Research data, participant records and design decisions belong to the team and participants. The team is responsible for reviewing the final submission and following course AI disclosure requirements.

