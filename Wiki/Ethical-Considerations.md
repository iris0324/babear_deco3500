# Ethical Considerations

## Ethics Framework

We used the **Ethical Disclaimer** from the *Ethics for Designers* toolkit to structure our ethical reflection.

The framework asks designers to consider:

1. the current design context;
2. relevant stakeholders;
3. design intentions;
4. potentially unethical situations created by the design;
5. which consequences and risks the design team should take responsibility for.

Rather than treating ethics as a final checklist, we used these questions to identify risks that became more visible as Borrowed Eyes evolved from anonymous visitor traces into paired, group and live social interaction.

Reference:  
[Ethics for Designers — Ethical Disclaimer](https://www.ethicsfordesigners.com/ethical-disclaimer)

---

## 1. Current Design Context

Borrowed Eyes is designed for use in a physical art gallery.

The design explores different levels of social participation:

- independent exploration of visitor-created perspectives;
- **Blind Eyes**, where two visitors exchange information and interpretations;
- small-group collaborative artwork finding;
- **Live Gallery Chat**;
- **Leave Your Eyes**, where visitors create content for future participants.

The final prototype combines real online Blind Eyes matching and chat with local demonstrations of Borrowed Eyes teams, wider gallery chat and creator publication. These differences matter when assessing which safeguards actually operate. The analysis below separates current measures, their limits and proposed improvements.

---

## 2. Stakeholders

Relevant stakeholders include:

- participating gallery visitors;
- visitors who prefer not to participate;
- quieter or socially anxious visitors;
- children and families;
- visitors with mobility, sensory or cognitive accessibility needs;
- gallery staff and facilitators;
- artists and artwork rights holders;
- the project/design team;
- future visitors who may encounter previously created content.

Ethical decisions therefore need to consider people beyond the immediate user completing the activity.

---

## 3. Design Intentions

Our design intentions are to:

- support personal interpretation without implying that there is one correct meaning;
- help visitors encounter different perspectives;
- encourage closer observation of physical artworks;
- offer different levels of social participation;
- avoid forcing direct interaction with strangers;
- keep digital interaction secondary to the physical gallery experience;
- allow visitors to contribute perspectives for future participants.

These intentions are positive, but they do not guarantee positive outcomes. The following sections identify situations in which the design could create harm, pressure or exclusion.

---

## 4. Social Pressure and Participation

**Risk.** Visitors may feel obliged to share personal experiences, reply to a stranger or continue an uncomfortable activity. Our survey identified low sharing confidence and concerns about communication pressure.

**Current response.** Borrowed Eyes offers Play Alone and Play Together. In Blind Eyes, visitors choose a topic, receive a match, then use Accept Match and Start Chat. Leave Conversation and Leave Game provide an exit. Kindness reminders encourage respectful disagreement. Matching creates an opportunity for contact, not consent to meet physically or disclose personal information.

**Trade-off and further action.** Solo is an alternative to direct conversation, but it also requires a comment to unlock a clue. Team play requires each member's comment before a formal answer. Thus mode choice does not make all contribution optional. Prompts allow a small observation rather than intimate disclosure; we should test a private or skip alternative and explain contribution requirements before starting. Leaving a local team round currently ends it without a reward, so the earlier aspiration of leaving without penalty is not fully achieved. No visitor should be pressured to remain for a game reward.

---

## 5. Unequal Participation and Dominant Voices

**Risk.** A quieter participant in Round 3 Face-to-Face testing reported difficulty speaking up. A dominant member may control decisions even when everybody contributes.

**Current response.** In team-based Borrowed Eyes, each member writes a personal interpretation to unlock one private clue, then chooses to share it with the team. Formal answers require all members' comments and an agreement checkbox. Text-based comments offer a route besides speaking aloud. These mechanisms structure contributions in the local team prototype; they do not prove equal influence or verify every person's consent.

**Remaining concern.** Mandatory comments can create pressure, and the person submitting the answer can tick agreement without genuinely consulting others. We should observe whose clues affect decisions, invite quieter members without requiring equal speaking time, and test accessible alternatives. Host removal from team chat is a local demonstration and could itself exclude minority voices; removal should address harmful behaviour, not interpretive disagreement.

---

## 6. Matching, Partner Dependency and Non-Response

**Risk.** Blind Eyes depends on a partner. Non-response, connection loss or an unwanted match can interrupt the gallery visit and create pressure to wait.

**Current response.** The online backend matches two visitors selecting the same topic and assigns complementary Describer/Guesser roles. The interface displays Anonymous Partner and asks the visitor to accept the match before entering chat. Visitors can leave the conversation; after a round, Find a New Partner returns them to topic selection. Backend heartbeat expiry also handles inactive sessions. The team confirmed on-site testing with two phones: QR-code access, successful matching and visibility of the matched partner.

**Remaining concern.** This test establishes the tested connection flow, not the safety or comfort of every match. Accept Match is an interface step, not a comprehensive server-enforced consent protocol. Leaving may take time to appear on the other device, and locking a phone can expire a session. We should explain waiting and disconnection states, permit an independent alternative, and avoid blaming someone who leaves. Automatic fallback clues after partner non-response are a proposal, not a confirmed feature.

---

## 7. Privacy, Anonymous Speech and Personal Data

**Risk.** Interpretations and chat may reveal identity, beliefs or personal experiences even without a real name. Children and families need particular care: guest access is not age verification or permission to collect children's information.

**Current response.** Blind Eyes uses guest access through Supabase anonymous sign-in, so email registration is not required for this flow. Chat presents the participants as You and Anonymous Partner. Authentication state is held in the tab's sessionStorage. Room messages are stored in the backend, with access restricted to room members through database policies. The interface retrieves the latest 500 messages; older messages remain stored. The backend used in the final prototype was completed and refined by Iris.

**Remaining concern.** This is anonymity towards another visitor, not complete anonymity from the service operator. Technical user identifiers, room membership and messages still exist. Session expiry or leaving a room does not establish deletion of stored messages. Before wider deployment, the team and host must define retention, deletion/withdrawal, authorised administrator access and a plain-language privacy notice. We should minimise identifying details and avoid publicly exposing children's names, images or contact information. These are design responsibilities, not a claim of completed production privacy assurance.

---

## 8. Unwanted Contact, Reporting, Muting and Blocking

**Risk.** Matched chat and future public chat can enable harassment, offensive messages, unwanted contact or pressure to meet. Anonymous display may reduce social pressure while also weakening perceived accountability.

**Current response.** Blind Eyes provides Report Partner and Leave Conversation. Incoming messages expose Report and Mute options. The report form offers reasons including harassment, discrimination, threats, sexual content, privacy violations and spam, with optional details. Sample visitor profiles also provide Block. Community guidelines prohibit harassment and sharing another person's private information.

**Actual scope.** Reports are saved locally in the browser, with a warning that they are not sent to a moderator. Report details can themselves contain sensitive information and may remain on a shared device. Mute hides messages locally; it does not stop a sender transmitting them. Local blocking of sample profiles does not establish server-side blocking or prevent future online rematching. The partner-level report uses the Anonymous Partner label, while message-level reports can capture a sender ID; a reliable moderator workflow still needs implementation.

**Further action.** Before public deployment, connect reports to a restricted moderation queue, define response responsibilities and escalation, and implement enforceable room/user controls. Explain what each safety control actually does. A report is an allegation, not proof of misconduct; moderation needs review and a way to address mistakes. For the current prototype, leaving a live conversation is an available immediate exit, but it is not a substitute for operational moderation.

---

## 9. Sharing Personal Views and Visitor-Generated Content

**Risk.** Leave Your Eyes contributions, clues and chat may contain identifying, harmful, irrelevant or misleading material. Personal interpretation should not be ranked as objectively correct, and unpopular viewpoints should not be removed merely for disagreeing.

**Current response.** Round 2 paper contribution sheets requested permission for anonymous reuse. The digital creator structures contributions around artwork details, short personal responses and clues. Current creator publication stays in browser-local storage; it does not automatically publish a new challenge to the online matching dataset. Existing demonstration perspectives should be distinguished from genuine participant contributions. Reporting controls demonstrate a safety route, with the local-only limits described above.

**Further action.** Paper-study consent does not authorise indefinite public reuse or cover online chat. Wider publication needs clear opt-in sharing, audience information, withdrawal/deletion and a content-review process. Private reflection should be distinguished from publishing. Preserve legitimate disagreement, provide artwork attribution and review sensitive content before public display. No operational server-side moderation or universal content-deletion feature is claimed here.

---

## 10. Interpretive Influence and Anchoring

**Risk.** A prominent earlier comment can anchor a visitor's interpretation or imply that one reading is authoritative.

**Current response and limitation.** Iteration 2 deliberately placed independent interpretation before the social reveal. Current team Borrowed Eyes requires a personal comment before unlocking a clue, but browsing and detail pages already display the creator's perspective. These are different sequences: comment-before-clue does not fully preserve interpretation-before-any-social-view.

**Further action.** Explain this trade-off and test whether delaying or optionally revealing the creator's view better protects interpretive agency. Continue inviting different readings and separating artwork-identification accuracy from the value of a personal interpretation. Difficulty stars describe challenge difficulty, not the quality of a visitor's opinion.

---

## 11. Accessibility and Physical Gallery Space

### Risk

The interaction asks visitors to move through the gallery, inspect artworks, communicate with others and sometimes use a mobile device.

This may disadvantage people with:

- mobility limitations;
- visual impairments;
- hearing impairments;
- cognitive or sensory access needs;
- limited confidence using mobile technology.

Group activity could also contribute to crowding or obstruct non-participating visitors.

### Design response

The experience should:

- avoid requiring one fixed physical route;
- support alternative clue formats;
- allow sufficient time;
- avoid requiring rapid movement;
- consider screen, text and interaction accessibility;
- respect shared gallery space.

### Remaining concern

The current formative testing has not included a sufficiently diverse accessibility sample, so accessibility cannot yet be claimed as validated.

---

## 12. Mobile Attention and Physical Artwork

### Risk

A central project goal is to support engagement with physical artworks.

However, features such as chat, profiles, clues and team interaction could increase screen time and shift attention away from the gallery.

### Design response

Digital interactions should remain brief and should repeatedly return attention to the artwork through:

- searching;
- observation;
- comparison;
- re-observation;
- physical movement.

### Remaining concern

The latest digital interface has not yet been fully evaluated for actual screen time or attention competition.

---

## 13. Location Data and Gallery Safety

**Risk.** Permission requests can suggest precise presence verification, while retaining coordinates or movement histories would create additional privacy risks. A visitor may also feel forced to grant location access to participate socially.

**Current implementation.** The interface offers Allow Location and Not Now, with browsing and solo play available through limited access. The current requestLocation function invokes browser geolocation with high accuracy disabled. Its success callback sets an inside state but does not inspect coordinates or check a gallery boundary. Therefore successful permission is not reliable proof of physical gallery presence. In this function, coordinates are not added to app state or sent to the matching backend; a complete service-level data audit has not been performed.

**Design response and remaining work.** Do not describe this gate as secure geofencing or as protection from off-site users. Explain the prototype behaviour, avoid unnecessary coordinate collection, and consider manual room selection or an appropriately designed venue check. A QR-code link alone is also not proof of physical presence because it can be shared. Future presence verification should retain only what is needed, avoid continuous movement tracking and clearly explain which activities need it.

---

## 14. Artwork Photography and Rights

### Risk

Borrowed Eyes uses visual fragments of artworks.

Photography and image use may be restricted by gallery rules, copyright conditions or artist rights.

### Design response

A public implementation should:

- follow gallery photography policies;
- use authorised images where necessary;
- provide attribution where required;
- avoid assuming that every artwork can legally be photographed or redistributed.

---

## 15. Responsibilities We Accept as Designers

Using the Ethical Disclaimer framework, we consider the following to fall within our design responsibility:

- avoiding unnecessary collection of personal data;
- keeping participation voluntary;
- providing alternatives when social interaction fails or becomes uncomfortable;
- reducing opportunities for harassment and harmful content;
- supporting quieter participants;
- avoiding interface choices that imply one interpretation is correct;
- keeping attention on the physical artwork;
- considering accessibility and non-participating gallery visitors;
- clearly communicating activity expectations;
- documenting known limitations rather than overstating what testing demonstrates.

Some risks, such as institutional gallery policy and final production-level data security, would require collaboration with gallery staff and technical stakeholders. However, identifying these dependencies remains part of our responsibility as designers.

---

## 16. Ethical Principles to Preserve

The following principles should remain visible in future iterations:

1. **Participation is optional.**
2. **Different levels of social engagement should remain available.**
3. **Independent interpretation should be protected where appropriate.**
4. **Disagreement is valid and should not be treated as failure.**
5. **Visitors should control what they share.**
6. **Personal data collection should be minimised.**
7. **Visitor-generated content requires moderation and reporting mechanisms.**
8. **Quieter participants should have meaningful opportunities to contribute.**
9. **Technology should redirect attention to the artwork rather than dominate it.**
10. **Accessibility and the experience of non-participants must be considered.**

---

## Limitations and Ongoing Ethical Review

This ethics analysis reflects the current design and formative evaluation.

The team-confirmed two-phone matching test establishes functional evidence for that flow, not validation of anonymity, reporting effectiveness, equal participation or safety at scale. Remaining work includes an operational reporting process, retention and withdrawal policies, honest location-access messaging, accessibility testing and observation in a busy gallery. The project team owns accurate prototype disclosures and further evaluation; a deployment partner would need to agree moderation duties, data stewardship and incident response before wider use.

The Ethical Disclaimer is therefore treated as a **living document** that should be revisited as the prototype and deployment context change.

---

## AI Use

Generative AI assisted documentation organisation and language editing, including this revision. This analysis uses team research, implementation evidence and the team-confirmed matching test. The team remains responsible for reviewing the final ethical assessment.

## Implementation Evidence

- [Blind Eyes matching and anonymous chat](https://github.com/iris0324/babear_deco3500/blob/main/Prototype/functional-prototype/src/core/blind-online.js)
- [Partner options and match confirmation](https://github.com/iris0324/babear_deco3500/blob/main/Prototype/functional-prototype/src/pages/blind.js)
- [Report form, local safety controls and team interaction](https://github.com/iris0324/babear_deco3500/blob/main/Prototype/functional-prototype/src/pages/borrow.js)
- [Report storage and comment checks](https://github.com/iris0324/babear_deco3500/blob/main/Prototype/functional-prototype/src/core/events.js)
- [Location permission and sample profiles](https://github.com/iris0324/babear_deco3500/blob/main/Prototype/functional-prototype/src/pages/community.js)
- [Backend scope and data-access documentation](https://github.com/iris0324/babear_deco3500/blob/main/supabase/BLIND_EYES_SETUP.md)
- [Design Process Overview](https://github.com/iris0324/babear_deco3500/wiki/Design-Process-Overview)

