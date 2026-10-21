# Exhibition frontend preparation (backend not yet connected)

## Changes in this ZIP
- Fresh navigation / new QR visit opens Welcome and requires Continue as a Guest again.
- A browser **reload** in the same tab can restore its guest and current game from sessionStorage.
- Explicit Logout clears the guest and active game; Blind Eyes Leave Game clears its local active game.
- Local drafts, published artworks, history, and other existing features are preserved.

## Important limitations
- Blind Eyes matchmaking and chat are **still simulated locally**. Two phones cannot match or chat until Supabase is configured and connected.
- Browser tab restoration, duplicate tabs, iOS Safari behavior, and reopening from QR apps can vary. A browser cannot reliably distinguish every close-and-reopen from reload. Test on exhibition phones.
- Reload recovery of the exact screen is best-effort; some temporary role/topic choices are not yet persisted.
- Do not publish this as a functioning multiplayer build until the backend is connected and tested.

## Next backend integration
- Atomic topic-specific pairing, two-person rooms, role coordination, room-specific real-time messages, synchronized guesses/results, and room exit/disconnect handling.
- Remove prototype text about simulated matching and replace sample partner acceptance with real waiting/matching.
