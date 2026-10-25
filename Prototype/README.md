# Borrowed Eyes prototype

**[Launch online](https://iris0324.github.io/babear_deco3500/)** · [Active source](functional-prototype/) · [Implementation guide](functional-prototype/README.md) · [Backend setup](../supabase/BLIND_EYES_SETUP.md)

## Two-phone demo

Open the live site on two phones, choose Guest, then Blind Eyes and the same topic. Wait for matching, accept the match and start chat. Roles are complementary: the Describer sees the artwork detail and the Guesser asks questions and submits guesses. Exit through Leave Conversation or Leave Game; after a round, Find a New Partner returns to topic selection.

The team confirmed on-site QR-code access, successful matching and partner visibility on two phones. This is a functional check, separate from the [14 October formative evaluation](../docs/Evaluation/Round_3/Testing_Results.md). Device models/browser versions were not recorded in the supplied account.

## Implemented versus simulated

- **Online Blind Eyes:** Supabase anonymous authentication, matching, room messages and server-side game state. Backend completed and refined by Iris.
- **Local Borrowed Eyes:** solo interactions and a simulated team sequence: personal comment → private clue → share → collective guess. All players must comment before a formal answer.
- **Local creator:** new contributions stay in that browser; they are not automatically published into online matching.
- **Local safety demonstrations:** reports are not submitted to a moderator; mute hides messages locally. Sample blocking/friend features are not server enforcement.
- **Location gate:** browser permission/demo state, without a real gallery-boundary check. Wider gallery chat and sample profiles are local demonstrations.

## Local run and deployment

Serve `functional-prototype/` using a static server. For example, open a terminal in that directory, run `python3 -m http.server 5500`, and visit `http://localhost:5500/`. VS Code Live Server is another option. There is no npm build. Internet access and the configured Supabase backend are needed for online Blind Eyes.

The repository's [deployment workflow](../.github/workflows/deploy-prototype.yml) publishes `functional-prototype/`. Follow the backend setup document when provisioning another environment; do not repeat first-install database migrations on an existing installation.

## Version guide

- `functional-prototype/`: active modular build and deployed entry point.
- `Final Prototype/`: earlier standalone/reference version. Its original README describes that version; use the active build for assessment.

## Known limits

Matching success does not validate all gameplay, accessibility or privacy outcomes. Reports have no operational moderation queue; message retention/deletion still needs a policy; location access is not secure venue verification. See the [Ethical Considerations](https://github.com/iris0324/babear_deco3500/wiki/Ethical-Considerations).

