# Babear DECO3500 — Repository Audit and Wiki Content Map

> Audit based on the repository ZIP supplied on 17 September 2026. This is a working project-management document, not a final assessment page.

## 1. Overall status

The repository already contains a strong evidence chain for the middle of the design process:

**domain/literature research → user research → experience requirements → Art Persona → Borrowed Eyes → Round 2 testing → findings**

The main gaps are not a lack of content, but **documentation consistency, missing final prototype information, missing ethics/framework documentation, and missing Wiki/meeting records**.

## 2. What is already strong

| Area | Status | Main source |
|---|---|---|
| Domain/problem space | Strong | `docs/Research/DomainResearch.md` |
| Academic literature | Strong | `docs/Research/Academic_Literature_and_Related_Work.md` |
| Stakeholders | Strong | `docs/Research/Stakeholder_Analysis.md` |
| Primary user research | Strong but needs reconciliation | `docs/Research/interview-round-1.md` |
| Research findings | Strong | `docs/Research/interview-round-1.md` |
| Experience requirements | Present | `docs/Requirements/Experience Requirements` |
| Design Iteration 1 | Present | `docs/Design/Design_Iteration_1.md` |
| Design Iteration 2 | Present | `docs/Design/Design_Iteration_2/Concept.md` |
| Round 2 testing plan | Strong | `docs/Evaluation/Round_2/Borrowed_Eyes_Testing_Plan.md` |
| Round 2 findings | Strong | `docs/Evaluation/Round_2/Borrowed_Eyes_Round_2_Testing_Findings.md` |
| Team roles | Present | `teamcharter/Babear_Charter.pdf` |
| Final/digital prototype | Not yet documented | `Prototype/README.md` is still a placeholder |
| Ethics Wiki page | Missing | No ethics document found |
| Design Process Overview Wiki | Missing | No final Wiki page found in ZIP |
| Meeting/stand-up records | Missing from ZIP | No records found |
| Explicit design-framework application | Missing | No framework analysis file found |

## 3. High-priority inconsistencies to fix

### A. User research participant count

Two repository documents conflict:

- `interview-round-1.md` documents **5 QAGOMA participants** with P1–P5 evidence.
- `User reaserch` states that **6 participant interviews** were conducted.

**Action:** Confirm whether a sixth interview exists. Until it is verified, use the five fully documented interviews as the primary evidence base. Do not report six as a final fact without recovering the sixth record.

### B. Borrowed Eyes prototype status is outdated

`docs/Design/Design_Iteration_2/Concept.md` still states that Round 1 and Round 2 field testing have not been completed.

**Action:** Update the status to reflect completed paper-prototype testing and the current transition toward a digital proof-of-concept.

### C. Round 2 raw evidence is incomplete/poorly placed in the repository

The testing plan expects a larger participant set, and the findings discuss several participants. However:

- `docs/Evaluation/Round_2/Testing_evidence/README.md` is empty;
- only one JPG is currently stored there;
- `Borrowed_Eyes_Round_2_Testing_P2_Evidence.docx` is stored under `docs/Design/images/`, which is not the logical evidence location.

**Action:** Move/copy all de-identified Round 2 evidence into:

```text
docs/Evaluation/Round_2/Testing_evidence/
```

Then create an index explaining each evidence file and whether statements are verbatim, written participant responses, facilitator observations, or paraphrases.

### D. Prototype folder is still a placeholder

`Prototype/README.md` has no actual prototype link, feature list, implementation status, or run instructions.

**Action:** Once the technical member has a working version, add:

- prototype type/stack;
- live link or build location;
- setup/run instructions;
- core interaction supported;
- what is functional vs simulated;
- screenshots/GIF/video;
- current limitations.

### E. README is incomplete

The root README still has empty sections for:

- Design Opportunity;
- Prototype;
- How to Use the Prototype;
- Project Documentation;
- Team table.

**Action:** Fill these once the Wiki/prototype links are available.

## 4. Repository hygiene issues

- `.DS_Store` files are tracked even though `.gitignore` includes `.DS_Store`. Remove the tracked files from the repository.
- Rename `docs/Requirements/Experience Requirements` to something like `Experience_Requirements.md`.
- Rename `docs/Research/User reaserch` to something clearer, e.g. `User_Research_Summary.md` (and fix the spelling).
- Keep raw testing evidence out of `docs/Design/images/`; place it in `docs/Evaluation/.../Testing_evidence/`.
- Add a short README/index in each evidence folder.

## 5. Conceptual/documentation issue to refine

`Concept.md` currently states that Borrowed Eyes is mobile because participants move through the gallery. Movement alone is not a sufficient description of mobile computing.

A more accurate framing is:

> The current paper prototype is a **social, asynchronous and location-specific gallery experience**. A later mobile/contextual version can use the visitor's gallery context to deliver relevant clues, capture visual fragments and pass anonymous interpretations between visitors at different times.

This better connects the project to social/mobile/contextual computing theory.

## 6. Wiki content map

### Page 1 — Home

**Already available:** domain, project overview, current concept name, repo structure.

**Still needed:** prototype link/status, Wiki navigation, final poster link later.

### Page 2 — Design Process Overview

Use these sources:

| Wiki section | Repository source | Status |
|---|---|---|
| Project summary | root `README.md` | Ready |
| Domain/problem space | `DomainResearch.md` | Ready |
| Literature insights | `Academic_Literature_and_Related_Work.md` | Ready |
| User research | `interview-round-1.md` | Ready, participant count must be reconciled |
| Research findings | `interview-round-1.md` | Ready |
| Experience requirements | `Experience Requirements` | Ready |
| Art Persona | `Design_Iteration_1.md` | Ready |
| Why Art Persona changed | `Design_Iteration_1.md` | Ready, raw early-test evidence not separately stored |
| Borrowed Eyes | `Concept.md` | Ready |
| Borrowed Eyes interaction flow | `Concept.md` + images | Ready |
| Round 2 method | `Borrowed_Eyes_Testing_Plan.md` | Ready |
| Round 2 findings | `Borrowed_Eyes_Round_2_Testing_Findings.md` | Ready |
| Design changes after testing | Round 2 findings | Ready |
| Design framework | — | **TBD** |
| Current digital prototype | `Prototype/` | **TBD** |
| Final evaluation | — | **TBD** |
| Limitations | research + evaluation docs | Ready for current stage |
| Who did what | Team Charter | Ready for initial roles; final contribution record still needed |
| Poster/promotional links | `docs/Poster` | **TBD** |

### Page 3 — Ethical Considerations

Current repository evidence already supports discussion of:

- anonymity and privacy;
- consent to share visitor contributions;
- interpretive influence/anchoring;
- moderation and inappropriate content;
- minimal personal data/account requirements;
- children/family contexts;
- non-participating visitors and shared-space effects;
- accessibility and movement;
- mobile distraction;
- future location/context data;
- artwork photography/gallery policy.

**Missing:** explicit application of the ethics framework required by the brief. Select the framework with the team and map the identified risks to it before final submission.

### Page 4 — Internal Meeting / Stand-up Records

No meeting records were found in the ZIP even though the Team Charter says the team meets Tuesday after class and Thursday before studio.

**Action:** Recover or reconstruct only from actual records (notes, WeChat decisions, GitHub issues/commits). Do not invent past meetings. Use the supplied template for future internal meetings.

> The Week 9 assessed stand-up has a no-GenAI condition. This draft does not generate the assessed stand-up content.

## 7. Recommended priority order

1. Reconcile the **5 vs 6 interview** discrepancy.
2. Move/index all **Round 2 raw evidence** under Evaluation.
3. Update the **Borrowed Eyes current status**.
4. Create the GitHub Wiki **Home**, **Design Process Overview**, and **Ethical Considerations** pages from the drafts.
5. Add the selected **design framework** and its design consequences.
6. Add the **digital prototype** details when the technical work is ready.
7. Add final evaluation, poster, tradeshow material and final contribution record later.
8. Finish the root README and remove repository hygiene issues.

## 8. AI-use documentation

The assessment brief permits AI for the artefacts/documentation component but requires each use to be referenced. Keep a record of which Wiki/repository sections were AI-assisted and adapt the disclosure to the course/UQ required format before final submission.
