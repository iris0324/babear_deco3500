export const SCREENS = Object.freeze({
  LOGIN: "login",
  START: "start",
  MODE: "play-mode",
  LOBBY: "team-lobby",
  TEAM_MATCH: "team-match",
  TEAM_WAITING: "team-waiting",
  TEAM_GAME: "team-game",
  LIST: "challenge-list",
  PLAY: "challenge-play",
  SOLO_HELP: "solo-help",
  RESULT: "challenge-result",
  BLIND_ROLE: "blind-role",
  BLIND_PREFS: "blind-preferences",
  BLIND_LIST: "blind-list",
  BLIND_PLAY: "blind-play",
  MESSAGES: "messages",
  ARTWORK_CHATS: "artwork-chats",
  MESSAGE_LIST: "message-list",
  FRIENDS: "friends",
  PLAYERS: "find-players",
  PLAYER_PROFILE: "player-profile",
  GROUPS: "groups",
  GROUP_CREATE: "group-create",
  GROUP_MEMBERS: "group-members",
  CHAT_ROOM: "chat-room",
  PROFILE: "profile",
  PROFILE_EDIT: "profile-edit",
  PROFILE_DETAIL: "profile-detail",
  MAP: "museum-map",
  LEAVE: "leave-eyes",
  CREATOR_FRAGMENT: "creator-fragment",
  CREATOR_ARTWORK: "creator-artwork",
  CREATOR_DIFFICULTY: "creator-difficulty",
  CREATOR_PERSPECTIVE: "creator-perspective",
  CREATOR_REVIEW: "creator-review",
  CREATOR_SUBMIT_REVIEW: "creator-submit-review",
  CREATOR_THANKS: "creator-thanks",
  CREATOR_STATUS: "creator-status",
  REVIEW: "submission-review",
  DESTINATION: "destination",
});

export function createScreenNavigation(initialScreen = SCREENS.START) {
  let current = { screen: initialScreen, route: "start", tab: "start", context: {} };
  const stack = [];

  function display(entry, remember = true) {
    if (remember && current.screen !== entry.screen) stack.push({ ...current, context: { ...current.context } });
    current = { ...current, ...entry, context: { ...current.context, ...(entry.context || {}) } };
    document.querySelectorAll(".screen").forEach((screen) => { screen.hidden = screen.dataset.screen !== current.screen; });
    document.querySelectorAll(".bottom-nav button").forEach((button) => {
      if (button.dataset.route === current.tab) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    const headings = [...document.querySelectorAll(`[data-screen="${current.screen}"] h1, [data-screen="${current.screen}"] h2`)];
    const heading = headings.find((candidate) => !candidate.closest("[hidden]")) || headings[0];
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    document.title = `${heading?.textContent || "Gallery"} · Borrowed Eyes`;
    window.scrollTo({ top: 0, behavior: "auto" });
    return current;
  }

  return {
    get current() { return current; },
    go(screen, options = {}) { return display({ screen, route: options.route ?? current.route, tab: options.tab ?? current.tab, context: options.context || {} }, options.remember !== false); },
    back() { return stack.length ? display(stack.pop(), false) : display({ screen: SCREENS.START, route: "start", tab: "start", context: {} }, false); },
    reset(screen, options = {}) { stack.length = 0; return display({ screen, route: options.route || "start", tab: options.tab || "start", context: options.context || {} }, false); },
  };
}

export const DESTINATIONS = Object.freeze({
  blind: ["Blind Eyes", "An anonymous two-person guessing experience. Discover an artwork through each other’s observations."],
  chat: ["Live Gallery Chat", "A place for the museum community, game rooms, and private conversations."],
  leave: ["Leave Your Eyes", "Create artwork challenges and leave your observations for another curious visitor."],
  teams: ["Find Teams", "Discover a challenge, find a simulated team, or return to your active session."],
  profile: ["Your visitor notebook", "An anonymous record of your visit, saved only in this browser. No account needed."],
});
