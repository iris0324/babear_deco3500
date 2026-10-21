# Borrowed Eyes — Final Prototype

Borrowed Eyes is a museum exploration prototype with artwork detail challenges, cooperative play, and visitor conversations. This version connects the tested frontend to a Node.js backend, allowing real users to share rooms, messages, submissions, and rewards.

## Project structure

- `frontend/`: the approved interface, bilingual content, visual assets, and backend integration script.
- `server/`: HTTP routes, authentication, room logic, persistence, and moderation.
- `private/`: server-side artwork resources and prepared detail images.
- `test/`: service, HTTP, interface compatibility, and two-client integration tests.
- `API.md`: endpoint documentation and multiplayer rules.
- `.env.example`: example environment settings; not automatically loaded.

The original HTML, application script, styles, artwork catalog, and translations are preserved. The server appends `backend-bridge.js` to connect existing controls to real data and enforce permissions. The bridge also supplies the requested matching, approval, location status, and artwork detail behavior without redesigning the interface.

## Run locally

Requires **Node.js 22 or later**. No third-party npm packages are required.

Run from this project directory:

```sh
npm start
```

Alternatively, run `node server/main.mjs`. Keep the server running and open **http://127.0.0.1:8787/**.

A macOS launcher, `Start Local Server.command`, is included. It uses an installed Node.js runtime, with a machine-specific bundled runtime fallback if available.

Use the HTTP address for backend features. Opening the original HTML directly with a `file://` URL does not load the server-injected integration layer.

## Accounts

Use the existing login, registration, or visitor entry screens. Registration creates an independent server-side account. Passwords are stored as salted scrypt hashes, never as plaintext. Selecting **Remember me** during login enables a persistent browser cookie. The visitor option creates a separate guest identity.

Password reset remains a preview flow and does not send email; SMTP is not configured.

## Test with two users

Use different browsers, or a regular window and a private browsing window. Log in with different accounts or create separate visitors. Two regular tabs in the same browser normally share a session cookie and do not represent independent users.

### Team

Choose **Play Together**, verify access, create or join a team, and wait in the lobby. Only the host can start, and at least two current members are required. Each member writes one personal reflection to unlock their own clue. Members can explicitly share clues, chat, and submit an agreed answer.

Team lists and participants come from real rooms. The server checks capacity, membership, host permissions, and submission eligibility. It also supports member removal, leaving, and host transfer.

### Blind Eyes

Both players select the same tag and complementary roles: one describer and one guesser. Matching requires a real distinct partner with a recent heartbeat. Both players must accept before starting.

The describer sees the selected **artwork detail**, using the same crop as Borrow the Eyes. The guesser relies on the conversation and unlocked clues. The guesser proposes an answer; the describer approves it or requests further discussion. After approval, the guesser formally submits the agreed answer. Proposals and rejections do not use attempts.

Both clients receive the same result, remaining attempts, and unlocked clues. After a wrong answer they can continue chatting and try again. Completed rounds retain the full-artwork reveal. Original role preview controls cannot be used to impersonate a teammate.

### Chat and safety

Public conversations, private visitor conversations, and team chat use server-stored messages. Blocking, muting, and reporting use server-side records. Reports preserve evidence from stored messages, and users can access their own report history. Administrators can review reports through a protected API or command-line tool.

Solo play uses server-side answer validation, attempts, and rewards, without adding reporting controls.

### Location access during testing

**Allow Location** requests browser geolocation permission. Successfully obtaining a position grants four hours of Team and gallery-chat access. No coordinates are sent to or stored by the server.

There is **no fixed address or five-kilometre boundary**. This is a testing access policy, not a verified geographical restriction. Denied or unavailable location callbacks remain restricted. Existing **Inside Gallery** and **Outside Gallery** classroom controls provide test states when browser location is unavailable.

Setting `ALLOW_CLASSROOM_LOCATION=0` rejects the current inside-access assertions. A production location policy requires a separate implementation.

## Other connected features

The backend supports saved contacts, private drafts, artwork check-in records, and publishing tasks that synchronize between accounts. Server-sent event notifications and polling synchronize state. Refreshing restores room state. Idempotent submissions prevent duplicate attempt charges, and repeated completion of the same challenge does not grant duplicate rewards.

## Access from other devices

The server defaults to `127.0.0.1`, which is accessible only from the host computer. For another device on the same Wi-Fi network, explicitly configure a network listener and add the computer's LAN address and port to `ALLOWED_HOSTS`. The other device then opens `http://YOUR-LAN-IP:8787/`. Keep the host and server running and allow the connection through the firewall. Browser geolocation may require a secure context; classroom controls remain available for testing.

A remote participant cannot use a `127.0.0.1` link to reach your computer. Deploy the frontend and backend together on a host supporting a persistent Node.js process and persistent storage. Serve the pages and `/api` from the same HTTPS origin.

**GitHub stores source code. GitHub Pages alone cannot run this backend or provide the multiplayer features.** Uploading the project does not deploy a running service.

## Data and uploads

Runtime `data/` contains identities, password hashes, sessions, drafts, messages, reports, rewards, and uploaded images. It is excluded by `.gitignore` and omitted from the upload package. Do not upload runtime data, real `.env` files, administrator secrets, or local QA database backups.

Include `private/` when uploading: it contains required artwork resources, not personal account data. The original public `data.js` catalog is retained and is not a confidential answer vault. Full-artwork endpoints and active Blind guesser requests for target catalog images are subject to server-side role checks.

Do not overwrite the database while the server is running. Writes use temporary files and atomic replacement, with rollback on failure. Only one process can own a database file at a time.

## Tests

```sh
npm test
```

Alternatively, run `node --test test/*.test.mjs`.

Tests cover original frontend compatibility, permissions, persistence, HTTP transport, cookies, server-sent events, and two-client Team, Blind Eyes, chat, reporting, and location flows. Some frontend compatibility checks depend on the original reference frontend directory in the development workspace; consult the test sources for expected paths.

## Deployment and limitations

Configure HTTPS, `ALLOWED_HOSTS`, `SECURE_COOKIE=1`, persistent `DATA_FILE` storage, and `UPLOAD_DIR`. The application reads environment variables; `.env.example` is documentation only.

This prototype uses a single-process JSON store rather than a shared production database. Further production work includes shared persistence where needed, email delivery, a real location policy, moderation appeals, backups, and two-device testing on the target host.

Some original interface copy still refers to local or simulated behavior. Review those statements before public release, especially claims about accounts, storage, invitations, and privacy. They should not be treated as formal privacy commitments for the connected version.

Administrator review is disabled unless `ADMIN_TOKEN` is configured. With the same token available to the command-line tool, use:

```sh
node server/review.mjs list
node server/review.mjs resolve REPORT_ID resolved "Review note"
node server/review.mjs resolve REPORT_ID dismissed "Review note"
```

See [API.md](API.md) for endpoint details.
