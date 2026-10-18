import { loadArtworkDatabase } from "./data.js";
import { STORAGE_KEYS, readArray, readJson, readObject, removeJson, writeJson } from "./core/storage.js";
import { createScreenNavigation, DESTINATIONS, SCREENS } from "./core/navigation.js";
import { CHALLENGE_DISPLAY_TITLES, normaliseAnswer } from "./features/borrow.js";
import { TEAM_LIMIT, blindAttemptLimit, borrowAttemptLimit, canJoinTeam, canStartTeam, canSubmitTeam, uniqueTeamMembers } from "./features/team.js";
import { advanceBlindWrongGuess, normaliseBlindClueProgress } from "./features/blind.js";
import { CHAT_ROOMS, PUBLIC_PLAYERS, createGroupRecord, createDemoSocial, migrateSocial, requestFriend, resolveFriendRequest, stableDmId } from "./features/chat.js";
import { creatorStarsForRatio, freshCreatorDraft, migrateCreatorDraft, validateCreatorDraft } from "./features/creator.js";
import { escapeHtml, fileAsDataUrl, formatChatTime, loadImage, safeMetadata } from "./ui/shared.js";

import { visitorAvatar } from "./ui/identity.js";

const LOCAL_USER_ID = "local-user-you";
const state = {
  signedIn: false,
  currentScreen: SCREENS.START,
  database: null,
  challenge: null,
  attemptsUsed: 0,
  clueUnlocked: false,
  ownComment: "",
  soloSession: null,
  mode: "solo",
  team: { members: [], comments: {}, cluesUnlocked: 0, proposal: null, chat: [] },
  openTeams: [],
  matchingChallengeId: null,
  exploreDifficulty: 0,
  teamContinuation: null,
  blind: { role: null, partnerRole: null, preferences: null, demoMode: false, challengeId: null, attemptsUsed: 0, chat: [], stars: { describer: 0, guesser: 0 }, result: null },
  galleryChat: { checkedIn: false, currentRoomId: null, rooms: {}, social: { requests: [], friends: [], groups: [], invitations: [] } },
  profile: { id: LOCAL_USER_ID, nickname: "Museum Visitor", bio: "", interests: [] },
  selectedPlayerId: null,
  selectedGroupId: null,
  submissions: [],
  creator: freshCreatorDraft(),
};
const navigation = createScreenNavigation();
let toastTimer;
let authMode = "login";
let creatorSubmitting = false;
let lastSubmittedId = null;
let creatorAutosaveTimer = null;
const CREATOR_QUESTIONS = Object.freeze(["What feeling or memories does this detail make you think of?", "What kind of scene or story does it remind you of?", "What colours, shapes or textures can you see?", "How does this part connect with the surrounding elements?", "What specific visual or location features could help others find the artwork?"]);
function requiredCreatorQuestionIndexes(stars) { return [0,1,2,3,4].slice(5 - Number(stars)); }

function readSubmissions() {
  return readArray(STORAGE_KEYS.submissions).map((item) => ({ ...item, perspectiveVerification: item.perspectiveVerification === "verified" ? "verified" : "unverified" }));
}

function saveSubmissions(next = state.submissions) {
  if (writeJson(STORAGE_KEYS.submissions, next)) return true;
  showToast("Images are too large for local storage. Choose smaller files and try again."); return false;
}

function readCreatorDraft() { return migrateCreatorDraft(readJson(STORAGE_KEYS.creatorDraft, null)); }
function saveCreatorDraft() {
  state.creator.savedAt = new Date().toISOString();
  if (writeJson(STORAGE_KEYS.creatorDraft, state.creator)) return true;
  showToast("Draft images exceed browser storage. The draft was not saved; keep this page open or choose smaller images."); return false;
}
function clearCreatorDraft() { removeJson(STORAGE_KEYS.creatorDraft); }

function approvedLocalRecords() {
  return state.submissions.filter((item) => item.status === "Approved").map((item) => {
    const artworkId = `local-artwork-${item.id}`;
    return {
      artwork: { id: artworkId, title: item.title, artist: item.artist, date: item.year || "Pending verification", fullImage: item.fullImage, metadataStatus: "creator_supplied", artistPerspective: item.perspective ? { text: item.perspective, status: item.perspectiveVerification === "verified" ? "verified_creator_attribution" : "creator_supplied_unverified" } : { text: "", status: "pending_verification" } },
      challenge: { id: `local-challenge-${item.id}`, artworkId, answerArtworkId: artworkId, fragmentImage: item.fragmentImage, fullImage: item.fullImage, stars: item.reviewStars || item.stars, maxFormalAttempts: item.reviewStars || item.stars, comment: item.comment, clues: item.reviewClues || item.clues, localSubmission: true },
    };
  });
}

function syncApprovedSubmissions() {
  if (!state.database) return;
  state.database.challenges = state.database.challenges.filter((item) => !item.localSubmission);
  state.database.artworks = state.database.artworks.filter((item) => !String(item.id).startsWith("local-artwork-"));
  for (const record of approvedLocalRecords()) {
    state.database.artworks.push(record.artwork); state.database.artworkById.set(record.artwork.id, record.artwork); state.database.challenges.push(record.challenge);
  }
}

function readProgress() {
  return readObject(STORAGE_KEYS.progress);
}

function saveProgress(challenge, success, mode = "solo", sessionId = challenge.id, attemptsUsed = state.attemptsUsed) {
  const progress = readProgress();
  const key = mode === "solo" ? challenge.id : `${mode}:${sessionId}`;
  const previous = progress[key] || {};
  const rewardedBefore = Object.entries(progress).some(([storedKey, item]) => (item.challengeId === challenge.id || storedKey === challenge.id) && item.success && Number(item.starsAwarded) > 0);
  progress[key] = {
    completed: true,
    success: previous.success || success,
    starsAwarded: previous.success ? previous.starsAwarded : (success && !rewardedBefore ? challenge.stars : 0),
    attemptsUsed,
    comment: mode === "solo" ? state.ownComment : undefined,
    challengeId: challenge.id,
    mode,
    completedAt: previous.completedAt || new Date().toISOString(),
  };
  writeJson(STORAGE_KEYS.progress, progress);
}

function totalStars() {
  return Object.values(readProgress()).reduce((sum, item) => sum + (Number(item.starsAwarded) || 0), 0);
}

function readTeam() {
  const fallback = { members: [], comments: {}, cluesUnlocked: 0, proposal: null, chat: [], openToPlayers: false, started: false, membershipLocked: false, closed: false };
  const saved = readJson(STORAGE_KEYS.team, fallback);
  if (!saved || !Array.isArray(saved.members)) return fallback;
  const members = [], seen = new Set();
  saved.members.forEach((member) => {
    const id = member.id === LOCAL_USER_ID || member.name === "You" ? LOCAL_USER_ID : member.id;
    if (!id || seen.has(id)) return;
    seen.add(id); members.push({ ...member, id });
  });
  const comments = { ...(saved.comments || {}) };
  const normalizedComments = { ...comments };
  const legacyYouComment = Object.entries(comments).find(([id]) => id.startsWith("you-"))?.[1];
  Object.keys(normalizedComments).filter((id) => id.startsWith("you-")).forEach((id) => delete normalizedComments[id]);
  if (legacyYouComment && members.some((member) => member.id === LOCAL_USER_ID)) normalizedComments[LOCAL_USER_ID] = legacyYouComment;
  const activeIds = new Set(members.map((member) => member.id));
  const proposal = saved.proposal ? { ...saved.proposal, approvals: [...new Set(saved.proposal.approvals || [])].filter((id) => activeIds.has(id)) } : null;
  const started = saved.started ?? Boolean((saved.attemptsUsed || 0) > 0 || Object.keys(normalizedComments).length || saved.completed);
  const chat = (saved.chat || []).map((item) => !item.authorId && item.name === "Museum guide" ? { ...item, authorId: "system" } : item);
  return { ...fallback, ...saved, sessionId: saved.sessionId || `legacy-${saved.challengeId || "team"}`, members, comments: normalizedComments, chat, cluesUnlocked: Number(saved.cluesUnlocked) || Object.keys(normalizedComments).length, proposal, started, membershipLocked: saved.membershipLocked ?? started, openToPlayers: saved.openToPlayers ?? false };
}

function saveTeam() { writeJson(STORAGE_KEYS.team, state.team); }

function readSolo() { return readJson(STORAGE_KEYS.solo, null); }
function saveSolo() {
  if (state.mode !== "solo" || !state.challenge) return;
  state.soloSession = { sessionId: state.soloSession?.sessionId || `solo-${Date.now()}`, challengeId: state.challenge.id, attemptsUsed: state.attemptsUsed, clueUnlocked: state.clueUnlocked, ownComment: state.ownComment, completed: false };
  writeJson(STORAGE_KEYS.solo, state.soloSession);
}
function restoreSolo() {
  const saved = readSolo();
  if (!saved?.challengeId || saved.completed) return;
  const challenge = state.database.challenges.find((item) => item.id === saved.challengeId);
  if (!challenge || saved.attemptsUsed >= borrowAttemptLimit(challenge.stars, 1)) return;
  state.soloSession = saved; state.challenge = challenge; state.attemptsUsed = Number(saved.attemptsUsed) || 0;
  state.clueUnlocked = Boolean(saved.clueUnlocked); state.ownComment = String(saved.ownComment || "");
}
function readOpenTeams() {
  return readArray(STORAGE_KEYS.openTeams).map((room) => {
    const seen = new Set();
    const members = (room.members || []).filter((member) => {
      const id = member.id === LOCAL_USER_ID || member.name === "You" ? LOCAL_USER_ID : member.id;
      if (!id || seen.has(id)) return false;
      seen.add(id); member.id = id; return true;
    });
    const comments = { ...(room.comments || {}) };
    const started = room.started ?? Boolean((room.attemptsUsed || 0) > 0 || Object.keys(comments).length || room.completed);
    const chat = (room.chat || []).map((item) => !item.authorId && item.name === "Museum guide" ? { ...item, authorId: "system" } : item);
    return { ...room, members, comments, chat, cluesUnlocked: Number(room.cluesUnlocked) || Object.keys(comments).length, started, membershipLocked: room.membershipLocked ?? started, openToPlayers: room.openToPlayers ?? !started, closed: Boolean(room.closed) };
  });
}

function saveOpenTeams() { writeJson(STORAGE_KEYS.openTeams, state.openTeams); }

function seedOpenTeams() {
  if (state.openTeams.length || !state.database?.challenges.length) return;
  const picks = [0, 3, 10].map((index) => state.database.challenges[index]).filter(Boolean);
  state.openTeams = picks.map((challenge, index) => ({
    id: `open-${index + 1}`, challengeId: challenge.id,
    members: Array.from({ length: [2, 4, 5][index] }, (_, memberIndex) => ({ id: PUBLIC_PLAYERS[memberIndex].id, name: PUBLIC_PLAYERS[memberIndex].name, stars: 0 })),
    attemptsUsed: 0, comments: {}, cluesUnlocked: 0, proposal: null, chat: [], completed: null,
    openToPlayers: true, started: false, membershipLocked: false, closed: false, simulated: true,
  }));
  saveOpenTeams();
}

function readBlind() {
  const saved = readJson(STORAGE_KEYS.blind, null);
  if (!saved?.stars) return freshBlindState();
  const { comments: _legacyComments, ...compatible } = saved;
  const role = ["describer", "guesser"].includes(saved.role) ? saved.role : null;
  const partnerId = saved.partnerId || null;
  const describerId = saved.describerId || (role === "describer" ? LOCAL_USER_ID : partnerId);
  const guesserId = saved.guesserId || (role === "guesser" ? LOCAL_USER_ID : partnerId);
  const chat = (saved.chat || []).map((item) => item.senderId === "system" && /simulated .* partner joined/i.test(item.message || "") ? { ...item, message: "Your anonymous partner joined the room." } : item);
  return { ...freshBlindState(saved.stars), ...compatible, chat, partnerId, describerId, guesserId, cluesUnlocked: Math.max(0, Number(saved.cluesUnlocked) || 0), role, partnerRole: role ? (role === "describer" ? "guesser" : "describer") : null };
}
function saveBlind() { writeJson(STORAGE_KEYS.blind, state.blind); }

function freshBlindState(stars = state.blind?.stars || { describer: 0, guesser: 0 }) {
  return { sessionId: null, role: null, partnerRole: null, preferences: null, partnerId: null, describerId: null, guesserId: null, pendingChallengeId: null, demoMode: false, challengeId: null, attemptsUsed: 0, cluesUnlocked: 0, chat: [], stars, rewardedChallenges: state.blind?.rewardedChallenges || { describer: [], guesser: [] }, result: null, continueInvite: null };
}

function readGalleryChat() {
  const saved = readJson(STORAGE_KEYS.chat, null);
  const rooms = {};
  CHAT_ROOMS.forEach((room, roomIndex) => { rooms[room.id] = { unread: roomIndex, messages: room.seed.map((text, index) => ({ author: PUBLIC_PLAYERS[(roomIndex + index) % PUBLIC_PLAYERS.length].name, authorId: PUBLIC_PLAYERS[(roomIndex + index) % PUBLIC_PLAYERS.length].id, text, time: "Now" })) }; });
  const initial = saved === null ? createDemoSocial(LOCAL_USER_ID) : null;
  const social = initial?.social || migrateSocial(saved?.social);
  if (!saved?.rooms) return { checkedIn: false, currentRoomId: null, rooms: { ...rooms, ...initial?.rooms }, social };
  const migratedRooms = { ...rooms, ...saved.rooms };
  Object.values(migratedRooms).forEach((room) => room.messages?.forEach((message) => {
    if (message.authorId) return;
    const publicPlayer = PUBLIC_PLAYERS.find((player) => player.name === message.author);
    if (publicPlayer) message.authorId = publicPlayer.id;
    else if (message.author === "You") message.authorId = LOCAL_USER_ID;
  }));
  social.groups.forEach((group) => { if (!migratedRooms[group.id] && migratedRooms[`group-${group.id}`]) migratedRooms[group.id] = migratedRooms[`group-${group.id}`]; });
  social.friends.forEach((userId) => { const stableId = stableDmId(LOCAL_USER_ID, userId); if (!migratedRooms[stableId] && migratedRooms[`dm-${userId}`]) migratedRooms[stableId] = migratedRooms[`dm-${userId}`]; });
  return { ...saved, rooms: migratedRooms, social };
}
function saveGalleryChat() { writeJson(STORAGE_KEYS.chat, state.galleryChat); }

function socialUser(userId) { return PUBLIC_PLAYERS.find((user) => user.id === userId) || state.galleryChat.social.profiles?.[userId]; }
function friendUsers() { return state.galleryChat.social.friends.map(socialUser).filter(Boolean); }
function canDirectMessage(userId) { return Boolean(userId && state.galleryChat.social.friends.includes(userId)); }
function registerSocialProfiles() {
  state.galleryChat.social.profiles ||= {};
  const members = [...state.team.members, ...state.openTeams.flatMap((room) => room.members || [])];
  members.forEach((member) => {
    if (!member?.id || member.id === LOCAL_USER_ID || PUBLIC_PLAYERS.some((player) => player.id === member.id)) return;
    state.galleryChat.social.profiles[member.id] ||= { id: member.id, name: member.name || "Simulated Visitor", initials: String(member.name || "V").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(), interests: ["Looking closely"], bio: "A simulated museum visitor from a local game room." };
  });
}
function ensureSocialRoom(id) {
  if (!state.galleryChat.rooms[id]) state.galleryChat.rooms[id] = { unread: 0, messages: [] };
  return state.galleryChat.rooms[id];
}

function messageRooms() {
  const groups = state.galleryChat.social.groups.map((group) => ({ id: group.id, category: "Private Group", title: group.name, participants: `${group.memberIds.length + 1} members`, onsite: false, group: true }));
  const dms = friendUsers().map((friend) => ({ id: stableDmId(LOCAL_USER_ID, friend.id), category: "Friend DM", title: friend.name, participants: "Confirmed friend · simulated", onsite: false, friendId: friend.id }));
  return [...CHAT_ROOMS, ...groups, ...dms];
}

function openMessages() {
  document.querySelector("#mock-checkin").checked = state.galleryChat.checkedIn;
  showScreen(SCREENS.MESSAGES, true, "chat");
}

function openFriends() {
  renderSocialHub(); showScreen(SCREENS.FRIENDS, true, "chat");
}

function roomEntry(room) {
  const stored = ensureSocialRoom(room.id), recent = stored.messages.at(-1), locked = room.onsite && !state.galleryChat.checkedIn;
  return `<button class="room-entry${locked ? " is-locked" : ""}" type="button" data-room-id="${room.id}" ${locked ? 'aria-disabled="true"' : ""}><span class="room-entry__icon" aria-hidden="true">${room.friendId ? visitorAvatar(socialUser(room.friendId)) : `<img src="assets/ui/${room.group ? "letter" : room.id === "public" ? "room" : "study"}-illustration.jpg" alt="">`}</span><span class="room-entry__copy"><small>${escapeHtml(room.category)}</small><strong>${escapeHtml(room.title)}</strong><span>${locked ? "Check in to enter" : escapeHtml(recent?.text || "Begin a conversation")}</span></span>${stored.unread && !locked ? `<b class="unread-badge">${stored.unread}</b>` : ""}</button>`;
}

function renderArtworkChats() {
  document.querySelector("#artwork-room-list").innerHTML = CHAT_ROOMS.filter((room) => room.id.startsWith("artwork-")).map(roomEntry).join("");
}

function renderMessageList() {
  const privateRooms = messageRooms().filter((room) => room.friendId || room.group);
  document.querySelector("#message-list").innerHTML = privateRooms.map(roomEntry).join("") || '<div class="empty-state"><p>No private correspondence yet.</p><button class="text-button" data-action="open-friends">Find a friend</button></div>';
}

function openChatRoom(roomId) {
  const requestedFriend = [...PUBLIC_PLAYERS, ...Object.values(state.galleryChat.social.profiles || {})].find((user) => stableDmId(LOCAL_USER_ID, user.id) === roomId);
  if (requestedFriend && !canDirectMessage(requestedFriend.id)) { showToast("Private messages open only after a friend request is accepted."); return; }
  const room = messageRooms().find((item) => item.id === roomId);
  if (!room) return;
  if (room.friendId && !canDirectMessage(room.friendId)) { showToast("Private messages open only after a friend request is accepted."); return; }
  if (room.onsite && !state.galleryChat.checkedIn) { showToast("Mock museum check-in is required for Public Chat."); return; }
  state.galleryChat.currentRoomId = roomId;
  ensureSocialRoom(roomId).unread = 0;
  saveGalleryChat();
  document.querySelector("[data-room-category]").textContent = room.category;
  document.querySelector("[data-room-title]").textContent = room.title;
  document.querySelector("[data-room-participants]").textContent = room.participants;
  const actions = document.querySelector("#conversation-actions");
  if (room.friendId) actions.innerHTML = `<button class="text-button" data-player-id="${room.friendId}">View Profile</button><button class="text-button" data-invite-player="${room.friendId}">Invite to Play</button>`;
  else if (room.group) actions.innerHTML = `<button class="text-button" data-group-members="${room.id}">Group Members</button><button class="text-button" data-group-invite="${room.id}">Invite Group to Play</button>`;
  else if (room.id === "public") actions.innerHTML = '<button class="text-button" data-action="find-players">Visitor Profiles</button><button class="text-button" data-route="teams">Find a Team</button>';
  else actions.innerHTML = '<button class="text-button" data-action="find-players">Visitor Profiles</button><button class="text-button" data-route="teams">Discover Teams</button>';
  renderRoomMessages(); showScreen(SCREENS.CHAT_ROOM);
}

function renderRoomMessages() {
  const roomId = state.galleryChat.currentRoomId;
  const stored = ensureSocialRoom(roomId);
  document.querySelector("#room-messages").innerHTML = stored.messages.map((message) => {
    const teamRoom = message.teamSessionId ? state.openTeams.find((item) => item.sessionId === message.teamSessionId || item.id === message.teamSessionId) : null;
    const recruitment = message.kind === "team-recruitment";
    const status = !teamRoom ? "Unavailable" : teamRoom.started || teamRoom.membershipLocked ? "Started" : teamRoom.completed || teamRoom.closed ? "Closed" : teamRoom.members.length >= TEAM_LIMIT ? "Full" : "Open";
    const action = recruitment ? `<section class="recruitment-card"><p class="field-label">${escapeHtml(message.challengeLabel || "Mystery artwork")} · ${Number(message.stars) || 0}★</p><strong>Looking for fellow explorers to help investigate this artwork.</strong><span>${teamRoom ? `${uniqueTeamMembers(teamRoom.members).length} of ${TEAM_LIMIT} visitors · ${status}` : status}</span><button class="button button--secondary" type="button" data-join-recruitment="${escapeHtml(message.teamSessionId)}" ${status !== "Open" ? "disabled" : ""}>${status === "Open" ? "Join Team" : status}</button></section>` : message.teamSessionId ? `<button class="text-button" data-open-team-session="${escapeHtml(message.teamSessionId)}">Open Team Waiting Room</button>` : "";
    const avatar = message.authorId ? visitorAvatar(message.authorId === LOCAL_USER_ID ? { id: LOCAL_USER_ID, name: state.profile.nickname } : socialUser(message.authorId)) : "";
    return `<article class="message-bubble ${message.authorId === LOCAL_USER_ID ? "is-mine" : ""}"><header>${avatar}${message.authorId && message.authorId !== LOCAL_USER_ID ? `<button class="message-author" data-player-id="${message.authorId}">${escapeHtml(message.author)}</button>` : `<strong>${escapeHtml(message.author)}</strong>`}<time>${escapeHtml(message.time)}</time></header>${recruitment ? "" : `<p>${escapeHtml(message.text)}</p>`}${action}</article>`;
  }).join("") || '<p class="small-note">No messages yet. Begin the correspondence.</p>';
}

function joinRecruitmentFromChat(sessionId) {
  const room = state.openTeams.find((item) => item.sessionId === sessionId || item.id === sessionId);
  if (!room) { showToast("This recruitment is no longer available."); renderRoomMessages(); return; }
  if (!room.members.some((member) => member.id === LOCAL_USER_ID)) { joinOpenTeam(room.id); return; }
  const visitor = PUBLIC_PLAYERS.find((player) => !room.members.some((member) => member.id === player.id));
  const status = canJoinTeam(room, visitor?.id);
  if (!visitor || !status.allowed) { showToast(status.reason || "No simulated visitor is available."); renderRoomMessages(); return; }
  room.members.push({ id: visitor.id, name: visitor.name, stars: 0 });
  room.chat ||= []; room.chat.push({ authorId: visitor.id, name: visitor.name, message: "I joined through Museum Public Chat.", createdAt: new Date().toISOString() });
  state.team = { ...room, members: [...room.members], comments: { ...(room.comments || {}) }, chat: [...room.chat] };
  state.mode = "team"; state.challenge = state.database.challenges.find((item) => item.id === room.challengeId);
  saveOpenTeams(); saveTeam(); renderRoomMessages(); renderTeamLobby(); showScreen(SCREENS.TEAM_WAITING);
  showToast(`${visitor.name} joined the same waiting room in this local simulation.`);
}

function submitRoomMessage(event) {
  event.preventDefault();
  const text = String(new FormData(event.currentTarget).get("message") || "").trim();
  const roomId = state.galleryChat.currentRoomId;
  const room = messageRooms().find((item) => item.id === roomId);
  if (!text || !roomId || (room?.onsite && !state.galleryChat.checkedIn)) { if (room?.onsite) showToast("Public Chat is available only while checked in."); return; }
  state.galleryChat.rooms[roomId].messages.push({ author: state.profile.nickname, authorId: LOCAL_USER_ID, text, time: formatChatTime() });
  saveGalleryChat(); event.currentTarget.reset(); renderRoomMessages();
  document.querySelector("#room-messages").scrollTop = document.querySelector("#room-messages").scrollHeight;
}

function renderSocialHub() {
  const social = state.galleryChat.social;
  document.querySelector("#friends-list").innerHTML = friendUsers().map((friend) => `<article class="social-row"><button class="identity-link" data-player-id="${friend.id}">${visitorAvatar(friend)}<span><strong>${escapeHtml(friend.name)}</strong><small>${escapeHtml(friend.interests.join(" · "))}</small></span></button><button class="text-button" data-room-id="${stableDmId(LOCAL_USER_ID, friend.id)}">Message</button></article>`).join("") || '<p class="small-note">No confirmed friends. Find simulated players to begin.</p>';
  const requestRow = (request, incoming) => { const user = socialUser(request.userId); return `<article class="social-row">${visitorAvatar(user)}<span><strong>${escapeHtml(user?.name || "Simulated visitor")}</strong><small>${incoming ? "Incoming request" : "Request Sent"}</small></span>${incoming ? `<span><button class="text-button" data-friend-decision="Accepted" data-request-id="${request.id}">Accept</button><button class="text-button" data-friend-decision="Declined" data-request-id="${request.id}">Decline</button><button class="text-button" data-friend-decision="Ignored" data-request-id="${request.id}">Ignore</button></span>` : ""}</article>`; };
  document.querySelector("#incoming-requests").innerHTML = social.requests.filter((item) => item.status === "Pending" && item.direction === "incoming").map((item) => requestRow(item, true)).join("") || '<p class="small-note">No incoming requests.</p>';
  document.querySelector("#sent-requests").innerHTML = social.requests.filter((item) => item.status === "Pending" && item.direction === "sent").map((item) => `${requestRow(item, false)}<button class="text-button simulate-response" data-friend-decision="Accepted" data-request-id="${item.id}">Simulate acceptance</button>`).join("") || '<p class="small-note">No sent requests.</p>';
  document.querySelector("#social-invitations").innerHTML = social.invitations.map((invite) => { const user = socialUser(invite.userId); return `<article class="social-row">${visitorAvatar(user)}<span><strong>${escapeHtml(user?.name || "Simulated friend")}</strong><small>${escapeHtml(invite.challengeId)} · ${invite.status}</small></span>${invite.status === "Pending" ? `<span><button class="text-button" data-invite-accept="${invite.id}">Accept</button><button class="text-button" data-invite-decline="${invite.id}">Decline</button><button class="text-button" data-invite-ignore="${invite.id}">Ignore</button></span>` : ""}</article>`; }).join("") || '<p class="small-note">No game invitations.</p>';
}

function sendFriendRequest(userId) {
  if (!socialUser(userId)) return;
  const result = requestFriend(state.galleryChat.social, userId, "sent");
  saveGalleryChat(); if (state.currentScreen === SCREENS.PLAYER_PROFILE) renderPlayerProfile(userId); else renderSocialHub(); showToast(result.status);
}

function decideFriendRequest(requestId, decision) {
  if (!resolveFriendRequest(state.galleryChat.social, requestId, decision)) return;
  saveGalleryChat(); renderSocialHub();
}

function createPrivateGroup(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget), name = String(data.get("name") || "").trim();
  const group = createGroupRecord(name, data.getAll("friendId"), state.galleryChat.social.friends);
  if (!group) { document.querySelector("[data-group-feedback]").textContent = "Choose a name and at least one confirmed friend."; return; }
  state.galleryChat.social.groups.push(group); ensureSocialRoom(group.id);
  state.selectedGroupId = group.id; saveGalleryChat(); event.currentTarget.reset(); openChatRoom(group.id);
}

function renderPlayerDirectory(query = "") {
  const needle = query.trim().toLowerCase();
  const players = PUBLIC_PLAYERS.filter((player) => !needle || player.name.toLowerCase().includes(needle));
  document.querySelector("#player-directory").innerHTML = players.map((player) => `<button class="player-card" data-player-id="${player.id}">${visitorAvatar(player, "visitor-avatar visitor-avatar--large")}<span><small>SIMULATED VISITOR</small><strong>${escapeHtml(player.name)}</strong><em>${escapeHtml(player.interests.join(" · "))}</em></span></button>`).join("") || '<p class="small-note">No simulated visitors match that nickname.</p>';
}

function openPlayerDirectory() { renderPlayerDirectory(); showScreen(SCREENS.PLAYERS, true, "chat"); }

function relationshipFor(userId) {
  if (state.galleryChat.social.friends.includes(userId)) return "friend";
  const request = state.galleryChat.social.requests.find((item) => item.userId === userId && item.status === "Pending");
  return request ? (request.direction === "sent" ? "sent" : "incoming") : "stranger";
}

function renderPlayerProfile(userId) {
  registerSocialProfiles();
  const player = socialUser(userId); if (!player) return;
  state.selectedPlayerId = userId;
  const relationship = relationshipFor(userId);
  const actions = relationship === "friend"
    ? `<button class="button button--primary" data-room-id="${stableDmId(LOCAL_USER_ID, userId)}">Message</button><button class="button button--secondary" data-invite-player="${userId}">Invite to Play</button>`
    : relationship === "sent" ? '<span class="status-seal">Request Sent</span>'
      : relationship === "incoming" ? '<span class="status-seal">Request awaiting your response</span><button class="text-button" data-action="open-friends">Review request</button>'
        : `<button class="button button--primary" data-add-friend="${userId}">Add Friend</button>`;
  document.querySelector("#player-profile-card").innerHTML = `<header>${visitorAvatar(player, "visitor-avatar visitor-avatar--large")}<div><p class="eyebrow">Public profile · Simulated</p><h2>${escapeHtml(player.name)}</h2></div></header><p>${escapeHtml(player.bio)}</p><div class="interest-tags">${player.interests.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div><div class="profile-actions">${actions}</div>`;
  showScreen(SCREENS.PLAYER_PROFILE, true, "chat");
}

function renderGroups() {
  document.querySelector("#groups-list").innerHTML = state.galleryChat.social.groups.map((group) => roomEntry({ id: group.id, category: "Private Group", title: group.name, participants: `${group.memberIds.length + 1} members`, group: true })).join("") || '<p class="small-note">No private groups yet.</p>';
}

function openGroupCreate() {
  document.querySelector("#group-friends").innerHTML = friendUsers().map((friend) => `<label><input type="checkbox" name="friendId" value="${friend.id}"> ${escapeHtml(friend.name)}</label>`).join("") || '<p class="small-note">Add a confirmed friend first.</p>';
  document.querySelector("[data-group-feedback]").textContent = ""; showScreen(SCREENS.GROUP_CREATE);
}

function renderGroupMembers(groupId) {
  const group = state.galleryChat.social.groups.find((item) => item.id === groupId); if (!group) return;
  state.selectedGroupId = groupId;
  document.querySelector("[data-group-members-title]").textContent = group.name;
  document.querySelector("#group-members-list").innerHTML = group.memberIds.map((id) => { const user = socialUser(id); return `<article class="social-row"><button class="identity-link" data-player-id="${id}">${visitorAvatar(user)}<span><strong>${escapeHtml(user?.name || "Simulated visitor")}</strong><small>Group member</small></span></button></article>`; }).join("");
  const eligible = friendUsers().filter((friend) => !group.memberIds.includes(friend.id));
  document.querySelector("#group-add-friend").innerHTML = eligible.map((friend) => `<option value="${friend.id}">${escapeHtml(friend.name)}</option>`).join("") || '<option value="">No eligible friends</option>';
  document.querySelector("#group-add-member-form").hidden = !eligible.length;
  showScreen(SCREENS.GROUP_MEMBERS);
}

function readProfile() {
  const saved = readJson(STORAGE_KEYS.profile, {});
  return { id: LOCAL_USER_ID, nickname: String(saved.nickname || "Museum Visitor"), bio: String(saved.bio || ""), interests: Array.isArray(saved.interests) ? saved.interests : [] };
}
function saveProfile() { writeJson(STORAGE_KEYS.profile, state.profile); }

function syncLocalIdentity() {
  const update = (members = []) => members.forEach((member) => { if (member.id === LOCAL_USER_ID) member.name = state.profile.nickname; });
  update(state.team.members); state.openTeams.forEach((room) => update(room.members));
  Object.values(state.galleryChat.rooms).forEach((room) => room.messages?.forEach((message) => { if (message.authorId === LOCAL_USER_ID) message.author = state.profile.nickname; }));
  saveGalleryChat();
  saveTeam(); saveOpenTeams();
}

function renderMyProfile(remember = true) {
  const progress = Object.values(readProgress()), completed = new Set(progress.filter((item) => item.completed).map((item) => item.challengeId).filter(Boolean)).size;
  const modes = { solo: 0, team: 0, blind: 0 }; progress.forEach((item) => { if (item.completed && modes[item.mode] !== undefined) modes[item.mode] += 1; });
  const initials = state.profile.nickname.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "V";
  document.querySelector("#profile-main").innerHTML = `<section class="visitor-profile"><header class="profile-ledger"><span class="profile-cameo">${escapeHtml(initials)}</span><div><p class="eyebrow">Personal museum folio</p><h2>${escapeHtml(state.profile.nickname)}</h2><p>${escapeHtml(state.profile.bio || "Add a short note about how you look at art.")}</p></div></header><div class="interest-tags">${state.profile.interests.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("") || '<span>No interests selected</span>'}</div><button class="button button--secondary" data-action="edit-profile">Edit Profile</button><div class="profile-stat-grid"><article><span>Earned stars</span><strong>${totalStars()}</strong><small>Awarded once per challenge</small></article><article><span>Completed</span><strong>${completed}</strong><small>${modes.solo} Solo · ${modes.team} Team · ${modes.blind} Blind</small></article><article><span>Friends</span><strong>${state.galleryChat.social.friends.length}</strong><button class="text-button" data-action="open-friends">Friends & requests</button></article><article><span>Created Eyes</span><strong>${state.submissions.length}</strong><small>${state.submissions.filter((item) => item.status === "Approved").length} approved</small></article></div><nav class="profile-folio-links"><button data-profile-detail="history">Game History</button><button data-profile-detail="eyes">My Eyes</button><button data-profile-detail="stars">Stars</button></nav><footer class="profile-session"><span><strong>Local demo session</strong><small>Progress remains saved on this device after logout.</small></span><button class="button button--secondary" type="button" data-action="logout">Logout</button></footer></section>`;
  showScreen(SCREENS.PROFILE, remember, "profile");
}

function renderProfileDetail(type) {
  const title = type === "history" ? "Game History" : type === "eyes" ? "My Eyes" : "Stars";
  document.querySelector("[data-profile-detail-eyebrow]").textContent = "Personal museum folio";
  document.querySelector("[data-profile-detail-title]").textContent = title;
  const progress = Object.values(readProgress());
  document.querySelector("#profile-detail-content").innerHTML = type === "eyes"
    ? state.submissions.map((item) => `<article><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.status)}</span></article>`).join("") || '<p class="small-note">No created Eyes yet.</p>'
    : type === "stars" ? `<article><strong>${totalStars()} stars</strong><span>Awarded once per Challenge ID.</span></article>`
      : progress.map((item) => `<article><strong>${escapeHtml(item.challengeId || "Challenge")}</strong><span>${escapeHtml(item.mode || "solo")} · ${item.success ? "Solved" : "Completed"}</span></article>`).join("") || '<p class="small-note">No completed games yet.</p>';
  showScreen(SCREENS.PROFILE_DETAIL);
}

function sendGameInvitation(userId) {
  const challengeId = state.mode === "team" ? state.team.challengeId : state.mode === "solo" && !state.soloSession?.completed ? state.challenge?.id : null;
  if (!challengeId || !state.galleryChat.social.friends.includes(userId)) { showToast("Open an active Solo or waiting Team challenge first."); return; }
  if (state.mode === "team" && (state.team.started || state.team.membershipLocked || state.team.completed)) { showToast("This Team has already started and cannot accept invitations."); return; }
  if (state.mode === "team" && uniqueTeamMembers(state.team.members).length >= TEAM_LIMIT) { showToast("This Team already has five members."); return; }
  if (state.galleryChat.social.invitations.some((invite) => invite.userId === userId && invite.challengeId === challengeId && invite.status === "Pending")) return;
  state.galleryChat.social.invitations.push({ id: `invite-${Date.now()}`, type: "game", userId, challengeId, status: "Pending", sourceMode: state.mode, teamSessionId: state.mode === "team" ? state.team.sessionId : undefined, sourceSoloSessionId: state.mode === "solo" ? state.soloSession?.sessionId : undefined });
  saveGalleryChat(); renderSocialHub(); showToast("Local game invitation sent.");
}

function createRecruitmentTeamFromSolo(openToPlayers = false) {
  const solo = state.soloSession;
  if (!solo?.sessionId || solo.completed || !state.challenge || solo.challengeId !== state.challenge.id) return null;
  const persisted = state.openTeams.find((room) => room.sourceSoloSessionId === solo.sessionId && room.challengeId === solo.challengeId && !room.closed);
  if (persisted) {
    state.team = { ...persisted, members: [...persisted.members], comments: { ...(persisted.comments || {}) }, chat: [...(persisted.chat || [])] };
    if (openToPlayers && !state.team.started && !state.team.membershipLocked && !state.team.completed) state.team.openToPlayers = true;
    saveTeam(); syncTeamRoom();
    return state.team;
  }
  if (state.team.sourceSoloSessionId === solo.sessionId && state.team.challengeId === solo.challengeId && !state.team.started && !state.team.completed && !state.team.closed) {
    if (openToPlayers) state.team.openToPlayers = true;
    saveTeam(); syncTeamRoom();
    return state.team;
  }
  state.team = {
    sessionId: `team-${Date.now()}`, sourceSoloSessionId: solo.sessionId,
    members: [{ id: LOCAL_USER_ID, name: state.profile.nickname, stars: 0 }],
    challengeId: solo.challengeId, attemptsUsed: Number(solo.attemptsUsed) || 0,
    comments: solo.ownComment ? { [LOCAL_USER_ID]: solo.ownComment } : {}, cluesUnlocked: solo.clueUnlocked ? 1 : 0,
    proposal: null, chat: [], completed: null, openToPlayers: Boolean(openToPlayers),
    started: false, membershipLocked: false, closed: false,
  };
  saveTeam(); syncTeamRoom();
  return state.team;
}

function decideGameInvitation(inviteId, accepted) {
  const invite = state.galleryChat.social.invitations.find((item) => item.id === inviteId);
  if (!invite || invite.status !== "Pending") return;
  if (!accepted) { invite.status = "Declined"; saveGalleryChat(); renderSocialHub(); return; }
  if (invite.sourceMode === "team" && state.team.challengeId === invite.challengeId && (!invite.teamSessionId || invite.teamSessionId === state.team.sessionId)) {
    const user = socialUser(invite.userId);
    if (!user) { invite.status = "Expired"; saveGalleryChat(); renderSocialHub(); showToast("This invitation is no longer available."); return; }
    if (state.team.started || state.team.membershipLocked || state.team.completed || state.team.closed) { invite.status = "Expired"; saveGalleryChat(); renderSocialHub(); showToast("This team can no longer accept players."); return; }
    if (!state.team.members.some((member) => member.id === invite.userId)) {
      if (uniqueTeamMembers(state.team.members).length >= TEAM_LIMIT) { invite.status = "Expired"; saveGalleryChat(); renderSocialHub(); showToast("This team already has five members."); return; }
      state.team.members.push({ id: invite.userId, name: user.name, stars: 0 });
    }
    state.team.proposal = null; state.team.chat.push({ authorId: "system", name: "Museum guide", message: `${user.name} accepted the invitation.`, createdAt: new Date().toISOString() }); state.mode = "team"; saveTeam();
  } else if (invite.sourceMode === "solo") {
    const user = socialUser(invite.userId);
    if (!user) { invite.status = "Expired"; saveGalleryChat(); renderSocialHub(); showToast("This invitation is no longer available."); return; }
    const sourceSoloId = invite.sourceSoloSessionId || invite.soloSnapshot?.sessionId;
    const activeSolo = state.soloSession && !state.soloSession.completed && state.soloSession.challengeId === invite.challengeId && (!sourceSoloId || state.soloSession.sessionId === sourceSoloId);
    const recruitmentTeam = sourceSoloId && state.team.sourceSoloSessionId === sourceSoloId && state.team.challengeId === invite.challengeId;
    if (!activeSolo && !recruitmentTeam) { invite.status = "Expired"; saveGalleryChat(); renderSocialHub(); showToast("The original Solo challenge is no longer active."); return; }
    if (recruitmentTeam) {
      if (state.team.started || state.team.membershipLocked || state.team.completed || state.team.closed || uniqueTeamMembers(state.team.members).length >= TEAM_LIMIT) { invite.status = "Expired"; saveGalleryChat(); renderSocialHub(); showToast("This team can no longer accept players."); return; }
      if (!state.team.members.some((member) => member.id === user.id)) state.team.members.push({ id: user.id, name: user.name, stars: 0 });
      state.team.chat.push({ authorId: "system", name: "Museum guide", message: `${user.name} accepted the invitation.`, createdAt: new Date().toISOString() });
    } else {
      const solo = state.soloSession;
      state.team = { sessionId: `team-${Date.now()}`, sourceSoloSessionId: solo.sessionId, members: [{ id: LOCAL_USER_ID, name: state.profile.nickname, stars: 0 }, { id: user.id, name: user.name, stars: 0 }], challengeId: invite.challengeId, attemptsUsed: Number(solo.attemptsUsed) || 0, comments: solo.ownComment ? { [LOCAL_USER_ID]: solo.ownComment } : {}, cluesUnlocked: solo.clueUnlocked ? 1 : 0, proposal: null, chat: [{ authorId: "system", name: "Museum guide", message: `${user.name} accepted the invitation.`, createdAt: new Date().toISOString() }], completed: null, openToPlayers: false, started: false, membershipLocked: false, closed: false };
    }
    state.mode = "team"; saveTeam();
  } else { showToast("The referenced game is no longer active."); return; }
  invite.status = "Accepted"; saveGalleryChat(); renderSocialHub(); renderTeamLobby(); showScreen(SCREENS.TEAM_WAITING); showToast("Invitation accepted. The original Solo game remains available separately.");
}


function renderCreatorClues() {
  const area = document.querySelector("#creator-clues");
  if (!state.creator.stars) { area.innerHTML = ""; return; }
  const required = requiredCreatorQuestionIndexes(state.creator.stars);
  state.creator.clueIndex = Math.min(Number(state.creator.clueIndex) || 0, required.length - 1);
  const questionNumber = required[state.creator.clueIndex], existing = state.creator.details.clues?.[questionNumber] || "";
  area.innerHTML = `<p class="eyebrow">Question ${state.creator.clueIndex + 1} of ${required.length} · Q${questionNumber + 1}</p><h3>${CREATOR_QUESTIONS[questionNumber]}</h3><label class="form-field"><span>Your clue</span><textarea id="creator-clue-answer" rows="5" required placeholder="Write one clear English clue.">${escapeHtml(existing)}</textarea></label><div class="clue-step-dots">${required.map((_, index) => `<i class="${index === state.creator.clueIndex ? "is-current" : index < state.creator.clueIndex ? "is-complete" : ""}"></i>`).join("")}</div>`;
  const next = document.querySelector('[data-action="creator-clue-next"]');
  if (next) next.textContent = state.creator.clueIndex === required.length - 1 ? "Confirm & Review" : "Confirm & Next";
}

async function updateCropResult() {
  const crop = state.creator.crop;
  if (!crop || crop.w <= 0 || crop.h <= 0) return;
  state.creator.ratio = crop.w * crop.h * 100;
  state.creator.stars = creatorStarsForRatio(state.creator.ratio);
  const full = await loadImage(state.creator.fullData), fragment = document.createElement("canvas");
  fragment.width = Math.max(1, Math.round(crop.w * full.naturalWidth)); fragment.height = Math.max(1, Math.round(crop.h * full.naturalHeight));
  fragment.getContext("2d").drawImage(full, crop.x * full.naturalWidth, crop.y * full.naturalHeight, crop.w * full.naturalWidth, crop.h * full.naturalHeight, 0, 0, fragment.width, fragment.height);
  state.creator.fragmentData = fragment.toDataURL("image/jpeg", .88);
  document.querySelector("#creator-stars").textContent = `${"★".repeat(state.creator.stars)} ${state.creator.stars}-star challenge`;
  document.querySelector("#creator-clue-requirement").textContent = `Exactly ${state.creator.stars} English ${state.creator.stars === 1 ? "Clue is" : "Clues are"} required.`;
  document.querySelector("#crop-feedback").textContent = "Detail selected. You can still move or resize it.";
  const preview = document.querySelector("#creator-fragment-preview"); if (preview) preview.src = state.creator.fragmentData;
  const live = document.querySelector("#crop-live-preview"); if (live) live.innerHTML = `<img src="${state.creator.fragmentData}" alt="Live selected fragment"><span>Difficulty ${"★".repeat(state.creator.stars)} · ${state.creator.stars} ${state.creator.stars === 1 ? "Clue" : "Clues"} to write</span>`;
}

function drawCrop() {
  const canvas = document.querySelector("#crop-canvas"), image = document.querySelector("#creator-full-preview");
  canvas.width = image.clientWidth; canvas.height = image.clientHeight;
  const context = canvas.getContext("2d"); context.clearRect(0, 0, canvas.width, canvas.height);
  if (!state.creator.crop) return;
  const { x, y, w, h } = state.creator.crop;
  context.fillStyle = "rgba(53,83,67,.18)"; context.strokeStyle = "#b08a3e"; context.lineWidth = 3;
  context.fillRect(x * canvas.width, y * canvas.height, w * canvas.width, h * canvas.height);
  context.strokeRect(x * canvas.width, y * canvas.height, w * canvas.width, h * canvas.height);
  context.fillStyle = "#fff8e9"; context.strokeStyle = "#355343"; context.lineWidth = 2;
  [[x,y],[x+w,y],[x,y+h],[x+w,y+h]].forEach(([hx,hy]) => { context.beginPath(); context.arc(hx * canvas.width, hy * canvas.height, 8, 0, Math.PI * 2); context.fill(); context.stroke(); });
}

function openLeaveEyes() {
  renderSubmissionList();
  document.querySelector("#creator-resume").hidden = !(state.creator.fullData || state.creator.details.comment);
  showScreen(SCREENS.LEAVE, true, "leave");
}

function renderSubmissionList() {
  const list = document.querySelector("#submission-list");
  list.innerHTML = state.submissions.length ? state.submissions.map((item) => `<article class="submission-row"><img src="${item.fragmentImage}" alt=""><span><strong>${escapeHtml(item.title)}</strong><small>${item.status} · ${item.reviewStars || item.stars} stars</small></span><span><button type="button" class="text-button" data-status-id="${item.id}">Status</button><button type="button" class="text-button" data-review-id="${item.id}">Admin review</button>${["Changes Requested", "Approved"].includes(item.status) ? `<button type="button" class="text-button" data-edit-submission="${item.id}">Edit</button>` : ""}</span></article>`).join("") : '<p class="small-note">No local submissions yet.</p>';
}

function captureCreatorDetails() {
  const form = document.querySelector("#creator-details-form"); if (!form) return;
  const data = new FormData(form);
  state.creator.details = { ...state.creator.details, title: String(data.get("title") || "").trim(), artist: String(data.get("artist") || "").trim(), year: String(data.get("year") || "").trim(), comment: String(data.get("comment") || "").trim() };
}

function captureCreatorClue() {
  const required = requiredCreatorQuestionIndexes(state.creator.stars);
  const questionIndex = required[Number(state.creator.clueIndex) || 0];
  const value = document.querySelector("#creator-clue-answer")?.value.trim() || "";
  if (questionIndex !== undefined) state.creator.details.clues[questionIndex] = value;
  return value;
}

function advanceCreatorClue() {
  const required = requiredCreatorQuestionIndexes(state.creator.stars), feedback = document.querySelector('[data-creator-feedback="5"]');
  const value = captureCreatorClue();
  if (!value || !/[A-Za-z]/.test(value)) { feedback.textContent = "Write this Clue in English before continuing."; return; }
  feedback.textContent = "";
  if (state.creator.clueIndex >= required.length - 1) { state.creator.returnToReview = false; saveCreatorDraft(); renderCreatorStep(6); return; }
  state.creator.clueIndex += 1; saveCreatorDraft(); renderCreatorClues();
}

function creatorPreview() {
  const details = state.creator.details, summary = document.querySelector("#creator-summary");
  const clues = requiredCreatorQuestionIndexes(state.creator.stars).map((index) => details.clues[index]);
  summary.innerHTML = `<div class="creator-pair"><figure><img src="${state.creator.fragmentData}" alt="Fragment"><figcaption>Selected detail</figcaption></figure><figure><canvas id="creator-review-canvas" aria-label="Complete artwork with selected area"></canvas><figcaption>Complete artwork with selected detail</figcaption></figure></div><h3>${escapeHtml(details.title || "Untitled")}</h3><p>${escapeHtml(details.artist || "Pending verification")}${details.year ? ` · ${escapeHtml(details.year)}` : ""}</p><p><strong>Difficulty ${"★".repeat(state.creator.stars)}</strong> · ${state.creator.stars} required ${state.creator.stars === 1 ? "Clue" : "Clues"}</p><blockquote><strong>Personal perspective:</strong> ${escapeHtml(details.comment)}</blockquote><ol>${clues.map((clue) => `<li>${escapeHtml(clue)}</li>`).join("")}</ol>${details.perspective ? `<p><strong>Creator-supplied Artist’s Perspective · unverified:</strong> ${escapeHtml(details.perspective)}</p>` : ""}`;
  const canvas = document.querySelector("#creator-review-canvas"); loadImage(state.creator.fullData).then((image) => { canvas.width = image.naturalWidth; canvas.height = image.naturalHeight; const context = canvas.getContext("2d"), crop = state.creator.crop; context.drawImage(image, 0, 0); context.fillStyle = "rgba(53,83,67,.18)"; context.strokeStyle = "#b08a3e"; context.lineWidth = Math.max(3, image.naturalWidth / 180); context.fillRect(crop.x * canvas.width, crop.y * canvas.height, crop.w * canvas.width, crop.h * canvas.height); context.strokeRect(crop.x * canvas.width, crop.y * canvas.height, crop.w * canvas.width, crop.h * canvas.height); });
}

const CREATOR_SCREENS = { 1: SCREENS.CREATOR_FRAGMENT, 2: SCREENS.CREATOR_ARTWORK, 3: SCREENS.CREATOR_DIFFICULTY, 4: SCREENS.CREATOR_PERSPECTIVE, 5: SCREENS.CREATOR_REVIEW, 6: SCREENS.CREATOR_SUBMIT_REVIEW };
function renderCreatorStep(step, remember = true) {
  state.creator.step = step;
  if (step === 1 && state.creator.fullData) { const image = document.querySelector("#creator-full-first-preview"); image.src = state.creator.fullData; document.querySelector("#full-first-preview-frame").hidden = false; document.querySelector("#replace-full-first").hidden = false; }
  if (step === 2 && state.creator.fullData) { const image = document.querySelector("#creator-full-preview"); image.src = state.creator.fullData; image.onload = drawCrop; document.querySelector("#crop-stage").hidden = false; document.querySelector("#replace-full").hidden = false; setTimeout(drawCrop); }
  if (step === 3 && state.creator.stars) { document.querySelector("#creator-fragment-preview").src = state.creator.fragmentData; document.querySelector("#creator-stars").textContent = `Difficulty ${"★".repeat(state.creator.stars)}`; document.querySelector("#creator-clue-requirement").textContent = `${state.creator.stars} ${state.creator.stars === 1 ? "Clue" : "Clues"} to write`; }
  if (step === 4) { const form = document.querySelector("#creator-details-form"), details = state.creator.details; ["title","artist","year","comment"].forEach((name) => { form.elements[name].value = details[name] || ""; }); }
  if (step === 5) renderCreatorClues();
  if (step === 6) creatorPreview();
  syncCreatorPhotoControls();
  saveCreatorDraft();
  showScreen(CREATOR_SCREENS[step], remember, "leave");
}

function submitCreator() {
  if (creatorSubmitting) return;
  const feedback = document.querySelector("#creator-feedback"), error = validateCreatorDraft(state.creator);
  if (error) { feedback.textContent = error; return; }
  creatorSubmitting = true;
  const details = state.creator.details, editing = state.submissions.find((item) => item.id === state.creator.editingSubmissionId && item.status === "Changes Requested");
  const submission = { id: editing?.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`, title: details.title, artist: details.artist, year: details.year, comment: details.comment, perspective: details.perspective, perspectiveVerification: "unverified", fragmentImage: state.creator.fragmentData, fullImage: state.creator.fullData, crop: state.creator.crop, areaPercentage: Number(state.creator.ratio.toFixed(1)), stars: state.creator.stars, clues: requiredCreatorQuestionIndexes(state.creator.stars).map((index) => details.clues[index]), matchFlag: false, status: "Pending", reviewReason: "", createdAt: editing?.createdAt || new Date().toISOString(), resubmittedAt: editing ? new Date().toISOString() : undefined, sourceSubmissionId: state.creator.sourceSubmissionId || undefined };
  const next = editing ? state.submissions.map((item) => item.id === editing.id ? submission : item) : [...state.submissions, submission];
  if (!saveSubmissions(next)) { creatorSubmitting = false; feedback.textContent = "Submission was not saved because browser storage is full."; return; }
  state.submissions = next; lastSubmittedId = submission.id; clearCreatorDraft(); state.creator = freshCreatorDraft(); creatorSubmitting = false; showScreen(SCREENS.CREATOR_THANKS, true, "leave");
}

function renderSubmissionStatus(id) {
  const item = state.submissions.find((entry) => entry.id === id); if (!item) return;
  const editable = item.status === "Changes Requested" || item.status === "Approved";
  document.querySelector("#creator-status-card").innerHTML = `<span class="status-seal status-${item.status.toLowerCase().replaceAll(" ", "-")}">${escapeHtml(item.status)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.reviewReason || "Awaiting local mock review.")}</p>${editable ? `<button class="button button--secondary" data-edit-submission="${item.id}">${item.status === "Approved" ? "Create a revised draft" : "Edit requested changes"}</button>` : ""}`;
}

function editSubmission(id) {
  const item = state.submissions.find((entry) => entry.id === id); if (!item) return;
  state.creator = migrateCreatorDraft({ version: 2, fragmentData: item.fragmentImage, fullData: item.fullImage, crop: item.crop, ratio: item.areaPercentage, stars: item.stars, matchScore: item.matchFlag ? 99 : 0, details: { title: item.title, artist: item.artist, year: item.year, comment: item.comment, perspective: item.perspective, clues: [...item.clues] }, editingSubmissionId: item.status === "Changes Requested" ? item.id : null, sourceSubmissionId: item.status === "Approved" ? item.id : null, step: 1 });
  saveCreatorDraft(); renderCreatorStep(1);
}

function beginNewCreator() {
  const hasDraft = state.creator.fragmentData || state.creator.fullData || state.creator.details.comment;
  if (!hasDraft) { state.creator = freshCreatorDraft(); renderCreatorStep(1); return; }
  const dialog = document.querySelector("#confirmation");
  document.querySelector("#dialog-title").textContent = "Start a new Eye?";
  document.querySelector("#dialog-description").textContent = "Your current saved draft will be replaced.";
  dialog.addEventListener("close", () => { if (dialog.returnValue === "confirm") { clearCreatorDraft(); state.creator = freshCreatorDraft(); renderCreatorStep(1); } }, { once: true });
  dialog.showModal();
}

function creatorStepAllowed(step) {
  if (step === 2 && !state.creator.fullData) return "Add a valid complete artwork photo first.";
  if (step === 3 && (!state.creator.fullData || !state.creator.crop || !state.creator.stars || !state.creator.fragmentData)) return "Mark a valid, non-zero detail on the artwork.";
  if (step === 4 && !state.creator.stars) return "Difficulty cannot be calculated without a valid marked area.";
  if (step === 5) {
    captureCreatorDetails(); const d = state.creator.details;
    if (!d.title) return "Add the artwork title before continuing.";
    if (!d.artist) return "Add the artist or maker before continuing.";
    if (!d.comment) return "Write what this detail means to you before continuing.";
    if (!/[A-Za-z]/.test(d.comment)) return "Write your personal perspective in English before continuing.";
    const required = requiredCreatorQuestionIndexes(state.creator.stars);
    state.creator.clueIndex = Math.max(0, Math.min(Number(state.creator.clueIndex) || 0, required.length - 1));
  }
  if (step === 6) return validateCreatorDraft(state.creator);
  return "";
}

function syncCreatorPhotoControls() {
  for (const [inputId, hasImage, previewId, replaceId, frameId] of [["creator-full-first", Boolean(state.creator.fullData), "creator-full-first-preview", "replace-full-first", "full-first-preview-frame"]]) {
    document.getElementById(inputId).closest(".photo-control").hidden = hasImage;
    document.getElementById(replaceId).hidden = !hasImage;
    document.getElementById(frameId).hidden = !hasImage;
    if (!hasImage) document.getElementById(previewId).removeAttribute("src");
  }
}

async function acceptCreatorImage(file, kind) {
  const feedback = document.querySelector('[data-creator-feedback="1"]') || document.querySelector("#crop-feedback");
  if (!file?.type?.startsWith("image/")) { feedback.textContent = "Choose a valid image file."; return; }
  try {
    const data = await fileAsDataUrl(file), image = await loadImage(data);
    if (!image.naturalWidth || !image.naturalHeight) throw new Error("Invalid image dimensions");
    state.creator.fullData = data; state.creator.fragmentData = ""; state.creator.crop = null; state.creator.ratio = 0; state.creator.stars = 0; document.querySelector("#creator-full-first-preview").src = data;
    const full = document.querySelector("#creator-full-preview"); full.src = data; full.onload = drawCrop;
    feedback.textContent = "Complete artwork ready. Continue to select the detail.";
    syncCreatorPhotoControls();
    saveCreatorDraft();
  } catch { feedback.textContent = "This image could not be read. Choose another photo."; }
}

function openReview(id) {
  const item = state.submissions.find((entry) => entry.id === id); if (!item) return;
  state.creator.reviewingId = id;
  document.querySelector("#review-detail").innerHTML = `<div class="creator-pair"><figure><img src="${item.fragmentImage}" alt="Submitted fragment"><figcaption>Submitted fragment</figcaption></figure><figure><img src="${item.fullImage}" alt="Complete artwork"><figcaption>Complete artwork · crop ${item.areaPercentage}%</figcaption></figure></div><article class="artwork-info-card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.artist)}${item.year ? ` · ${escapeHtml(item.year)}` : ""}</p><p><strong>Creator’s Comment:</strong> ${escapeHtml(item.comment)}</p>${item.perspective ? `<p><strong>Creator-supplied perspective · attribution unverified:</strong> ${escapeHtml(item.perspective)}</p>` : ""}${item.matchFlag ? '<p class="review-warning">Possible fragment mismatch flagged.</p>' : ""}</article><form id="review-form"><label class="form-field"><span>Reviewed star rating</span><select name="stars">${[1,2,3,4,5].map((star) => `<option value="${star}" ${star === (item.reviewStars || item.stars) ? "selected" : ""}>${star} star${star > 1 ? "s" : ""}</option>`).join("")}</select></label><fieldset><legend>Select the Clues retained on approval</legend>${item.clues.map((clue, index) => `<label class="review-clue"><input type="checkbox" name="clueIndex" value="${index}" checked> ${escapeHtml(clue)}</label>`).join("")}</fieldset>${item.perspective ? `<label class="review-clue"><input type="checkbox" name="perspectiveVerified" value="verified" ${item.perspectiveVerification === "verified" ? "checked" : ""}> Attribution source independently verified</label>` : ""}<label class="form-field"><span>Review reason</span><textarea name="reason" rows="3" placeholder="Required for every review decision">${escapeHtml(item.reviewReason || "")}</textarea></label><div class="review-actions"><button class="button button--primary" name="decision" value="Approved" type="submit">Approve</button><button class="button button--secondary" name="decision" value="Changes Requested" type="submit">Request Changes</button><button class="button button--secondary" name="decision" value="Rejected" type="submit">Reject</button></div><p class="game-feedback" data-review-feedback></p></form>`;
  showScreen(SCREENS.REVIEW);
}

function submitReview(event) {
  event.preventDefault();
  const item = state.submissions.find((entry) => entry.id === state.creator.reviewingId), data = new FormData(event.target), decision = event.submitter?.value, stars = Number(data.get("stars")), selected = data.getAll("clueIndex").map(Number), feedback = event.target.querySelector("[data-review-feedback]");
  if (!item || !decision) return;
  if (!String(data.get("reason") || "").trim()) { feedback.textContent = "A review reason is required."; return; }
  if (decision === "Approved" && selected.length !== stars) { feedback.textContent = `Select exactly ${stars} Clues for a ${stars}-star approval.`; return; }
  const reviewed = { ...item, status: decision, reviewReason: String(data.get("reason") || "").trim(), reviewStars: stars, reviewClues: selected.map((index) => item.clues[index]), reviewedAt: new Date().toISOString(), perspectiveVerification: data.get("perspectiveVerified") === "verified" ? "verified" : "unverified" };
  const next = state.submissions.map((entry) => entry.id === item.id ? reviewed : entry);
  if (!saveSubmissions(next)) { feedback.textContent = "Review could not be saved because browser storage is full."; return; }
  state.submissions = next;
  syncApprovedSubmissions(); renderChallengeList(); showToast(`Submission ${decision.toLowerCase()}.`); renderSubmissionList(); renderSubmissionStatus(item.id); showScreen(SCREENS.CREATOR_STATUS);
}

function showScreen(name, remember = true, route = navigation.current.route) {
  if (!state.signedIn && name !== SCREENS.LOGIN) name = SCREENS.LOGIN;
  const tab = name === SCREENS.START ? "start"
    : name === SCREENS.MAP ? "map"
    : [SCREENS.MESSAGES, SCREENS.ARTWORK_CHATS, SCREENS.MESSAGE_LIST, SCREENS.CHAT_ROOM, SCREENS.FRIENDS, SCREENS.PLAYERS, SCREENS.PLAYER_PROFILE, SCREENS.GROUPS, SCREENS.GROUP_CREATE, SCREENS.GROUP_MEMBERS].includes(name) ? "chat"
      : [SCREENS.PROFILE, SCREENS.PROFILE_EDIT, SCREENS.PROFILE_DETAIL].includes(name) ? "profile"
      : name === SCREENS.DESTINATION ? route : [SCREENS.LEAVE, SCREENS.REVIEW, SCREENS.CREATOR_FRAGMENT, SCREENS.CREATOR_ARTWORK, SCREENS.CREATOR_DIFFICULTY, SCREENS.CREATOR_PERSPECTIVE, SCREENS.CREATOR_REVIEW, SCREENS.CREATOR_SUBMIT_REVIEW, SCREENS.CREATOR_STATUS, SCREENS.CREATOR_THANKS].includes(name) ? "start" : "games";
  navigation.go(name, { remember, route, tab, context: { challengeId: state.challenge?.id || null, sessionId: state.team.sessionId || state.blind.sessionId || state.soloSession?.sessionId || null, mode: state.mode, roomId: state.galleryChat.currentRoomId || null } });
  state.currentScreen = name;
  document.querySelector(".bottom-nav").hidden = name === SCREENS.LOGIN;
}


function renderChallengeList() {
  const list = document.querySelector("#challenge-list");
  const progress = readProgress();
  list.innerHTML = "";
  orderedChallenges().forEach((challenge, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "challenge-card";
    button.dataset.challengeId = challenge.id;
    const completed = progress[challenge.id], status = completed ? (completed.success ? "Solved" : "Completed") : "Unvisited";
    const memberCount = state.mode === "team" ? uniqueTeamMembers(state.team.members).length : 1;
    const attempts = Math.max(0, borrowAttemptLimit(challenge.stars, memberCount));
    button.innerHTML = `<span class="challenge-card__image"><img src="${challenge.fragmentImage}" alt="Mystery fragment ${index + 1}" loading="lazy"><small>${String(index + 1).padStart(2, "0")}</small></span><span class="challenge-card__body"><span class="challenge-card__kicker">Collection study</span><strong>${escapeHtml(challengeDisplayTitle(challenge))}</strong><span class="star-rating" aria-label="${challenge.stars} of 5 stars">${"★".repeat(challenge.stars)}${"☆".repeat(5 - challenge.stars)}</span><small>${attempts} formal ${attempts === 1 ? "attempt" : "attempts"}<b class="challenge-progress ${completed ? "is-complete" : ""}">${status}</b></small></span>`;
    list.append(button);
  });
}

function challengeDisplayTitle(challenge) {
  return challenge.displayTitle || CHALLENGE_DISPLAY_TITLES[challenge.id] || "An Unnamed Study";
}

function orderedChallenges() {
  const groups = new Map();
  state.database.challenges.forEach((challenge) => {
    if (!groups.has(challenge.artworkId)) groups.set(challenge.artworkId, []);
    groups.get(challenge.artworkId).push(challenge);
  });
  const ordered = [], rows = [...groups.values()];
  for (let index = 0; rows.some((row) => row[index]); index += 1) {
    rows.forEach((row) => { if (row[index]) ordered.push(row[index]); });
  }
  return ordered;
}

function renderBlindMatch() {
  const card = document.querySelector("#blind-match-card");
  const role = state.blind.partnerRole === "describer" ? "Describer" : "Guesser";
  card.innerHTML = `<span class="match-seal" aria-hidden="true">BE</span><p class="eyebrow">Anonymous complementary partner found</p><h3>Match Found</h3><p><strong>${escapeHtml(role)}</strong> · simulated visitor</p><p>${escapeHtml(state.blind.preferences?.interest || "Surprise Me")} · ${Number(state.blind.preferences?.difficulty) || 1}★</p><small>This pairing is simulated locally for the prototype.</small>`;
}

function openBlindGame() {
  if (!state.database) { showToast("The artwork database is still loading."); return; }
  state.mode = "blind";
  if (state.blind.challengeId) {
    state.challenge = state.database.challenges.find((item) => item.id === state.blind.challengeId);
    if (state.challenge) { if (state.blind.result) { renderResult(state.blind.result.success); showScreen(SCREENS.RESULT); } else { renderBlindPlay(); showScreen(SCREENS.BLIND_PLAY); } return; }
  }
  if (state.blind.pendingChallengeId && state.blind.role && state.blind.preferences) { renderBlindMatch(); showScreen(SCREENS.BLIND_LIST); return; }
  state.blind = freshBlindState(); saveBlind(); showScreen(SCREENS.BLIND_ROLE);
}

function chooseBlindRole(role) {
  if (!["describer", "guesser"].includes(role)) return;
  state.blind.role = role;
  state.blind.partnerRole = role === "describer" ? "guesser" : "describer";
  saveBlind(); showScreen(SCREENS.BLIND_PREFS);
}

function matchBlindPartner(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const difficulty = Number(data.get("difficulty"));
  const interest = String(data.get("interest") || "");
  if (!state.blind.role || difficulty < 1 || difficulty > 5 || !interest) return;
  const tags = ["Portraits", "Landscapes", "Abstract", "Historical"];
  const difficultyMatches = state.database.challenges.filter((item) => item.stars === difficulty);
  const taggedMatches = difficultyMatches.filter((item) => tags[state.database.challenges.indexOf(item) % tags.length] === interest);
  const matches = interest === "Surprise Me" || !taggedMatches.length ? difficultyMatches : taggedMatches;
  if (!matches.length) { showToast("No compatible challenge is available for that difficulty."); return; }
  const offset = interest === "Surprise Me" ? Math.floor(Math.random() * matches.length) : 0;
  state.blind.preferences = { difficulty, interest };
  state.blind.pendingChallengeId = matches[offset].id;
  state.blind.partnerId = PUBLIC_PLAYERS[state.database.challenges.indexOf(matches[offset]) % PUBLIC_PLAYERS.length].id;
  saveBlind(); renderBlindMatch(); showScreen(SCREENS.BLIND_LIST);
}

function startBlindMatchedSession() {
  if (state.blind.sessionId && state.blind.challengeId && !state.blind.result) { state.challenge = state.database.challenges.find((item) => item.id === state.blind.challengeId); renderBlindPlay(); showScreen(SCREENS.BLIND_PLAY); return; }
  startBlindChallenge(state.blind.pendingChallengeId);
}

function startBlindChallenge(challengeId) {
  const challenge = state.database.challenges.find((item) => item.id === challengeId);
  if (!challenge) return;
  const { role, partnerRole, preferences, stars, rewardedChallenges } = state.blind;
  const partnerId = state.blind.partnerId || PUBLIC_PLAYERS[state.database.challenges.indexOf(challenge) % PUBLIC_PLAYERS.length].id;
  const describerId = role === "describer" ? LOCAL_USER_ID : partnerId;
  const guesserId = role === "guesser" ? LOCAL_USER_ID : partnerId;
  state.blind = { sessionId: `blind-${Date.now()}`, role, partnerRole, preferences, partnerId, describerId, guesserId, pendingChallengeId: challengeId, demoMode: false, challengeId, attemptsUsed: 0, cluesUnlocked: 0, chat: [{ senderId: "system", role: "Museum guide", message: "Your anonymous partner joined the room.", createdAt: new Date().toISOString() }], stars: stars || { describer: 0, guesser: 0 }, rewardedChallenges: rewardedChallenges || { describer: [], guesser: [] }, result: null, continueInvite: null };
  state.challenge = challenge; saveBlind(); renderBlindPlay(); showScreen(SCREENS.BLIND_PLAY);
}

function renderBlindPlay() {
  const challenge = state.challenge;
  const artwork = state.database.artworkById.get(challenge.answerArtworkId);
  const isDescriber = state.blind.role === "describer";
  document.querySelector("[data-blind-role]").textContent = isDescriber ? "Describer" : "Guesser";
  document.querySelector("[data-blind-partner]").textContent = `Anonymous partner · ${state.blind.partnerRole === "describer" ? "Describer" : "Guesser"}`;
  document.querySelector("[data-blind-stars]").textContent = `${"★".repeat(challenge.stars)} ${challenge.stars}-star challenge`;
  document.querySelector("[data-blind-attempts]").textContent = `${Math.max(0, blindAttemptLimit(challenge.stars) - state.blind.attemptsUsed)} shared attempts left`;
  document.querySelector("#blind-describer-view").hidden = !isDescriber;
  document.querySelector("#blind-guesser-view").hidden = isDescriber;
  document.querySelector('[data-action="blind-open-guess"]').disabled = isDescriber || Boolean(state.blind.result);
  const image = document.querySelector("[data-blind-artwork]");
  if (isDescriber) image.src = artwork.fullImage || challenge.fullImage;
  else { image.removeAttribute("src"); image.alt = ""; }
  if (isDescriber) image.alt = "Complete mystery artwork without identity details";
  document.querySelector("[data-blind-creator-perspective]").textContent = isDescriber ? (String(challenge.comment || "").trim() || "No visitor perspective was provided.") : "";
  document.querySelector('[data-action="switch-blind-role"]').hidden = !state.blind.demoMode;
  document.querySelector("#blind-demo-mode").checked = Boolean(state.blind.demoMode);
  document.querySelector("[data-blind-feedback]").textContent = "";
  const chatLog = document.querySelector("#blind-chat-log"), previousTop = chatLog.scrollTop;
  const viewerId = state.blind.role === "describer" ? state.blind.describerId : state.blind.guesserId;
  chatLog.innerHTML = state.blind.chat.map((item) => { const senderId = item.senderId || (item.role === "Museum guide" ? "system" : item.role?.toLowerCase() === "describer" ? state.blind.describerId : state.blind.guesserId); if (senderId === "system") return `<article class="blind-message is-system"><p>${escapeHtml(item.message)}</p></article>`; const mine = senderId === viewerId, role = senderId === state.blind.describerId ? "Describer" : "Guesser", time = item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""; const avatar = visitorAvatar({ id: senderId, name: `Anonymous ${role}`, initials: role[0] }); return `<article class="blind-message ${mine ? "is-mine" : "is-partner"}">${avatar}<div><header><strong>Anonymous ${role}</strong><time>${escapeHtml(time)}</time></header><p>${escapeHtml(item.message)}</p></div></article>`; }).join("") || '<p class="small-note">No messages yet.</p>';
  chatLog.scrollTop = previousTop;
  document.querySelector("#blind-clue-drawer").innerHTML = state.blind.cluesUnlocked ? `<p class="field-label">Unlocked clues</p>${challenge.clues.slice(0, state.blind.cluesUnlocked).map((clue, index) => `<article><strong>Clue ${index + 1}</strong><p>${escapeHtml(clue)}</p></article>`).join("")}` : "";
}

function renderTeamLobby() {
  state.team.members = uniqueTeamMembers(state.team.members);
  const list = document.querySelector("#team-member-list");
  list.innerHTML = state.team.members.map((member) => {
    const initials = String(member.name || "Visitor").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
    return `<div class="member-row has-portrait" data-initials="${escapeHtml(initials)}">${visitorAvatar(socialUser(member.id) || { id: member.id, name: member.name, initials })}<span><strong>${escapeHtml(member.name)}</strong><small>${member.stars || 0} stars</small></span><button type="button" class="text-button" data-remove-member="${member.id}" aria-label="Remove ${escapeHtml(member.name)}">${member.id === LOCAL_USER_ID ? "Leave" : "Remove"}</button></div>`;
  }).join("");
  const start = document.querySelector('[data-action="team-start"]');
  start.disabled = !canStartTeam(state.team);
  document.querySelector("#team-open-toggle").checked = Boolean(state.team.openToPlayers);
  document.querySelector("#team-open-toggle").disabled = Boolean(state.team.started || state.team.membershipLocked || state.team.completed);
  document.querySelector("#team-member-form").hidden = Boolean(state.team.started || state.team.membershipLocked);
  const memberForm = document.querySelector("#team-member-form"), full = state.team.members.length >= TEAM_LIMIT;
  memberForm.querySelectorAll("input, button").forEach((control) => { control.disabled = full; });
  memberForm.elements.name.placeholder = full ? "Visitor circle is full" : "Add another visitor";
  document.querySelector("[data-team-challenge]").textContent = state.team.challengeId ? `${challengeNumber(state.team.challengeId)} selected` : "No challenge selected";
  document.querySelector("[data-team-lobby-feedback]").textContent = state.team.started ? "Game started · membership locked" : `${state.team.members.length} of 5 members${state.team.members.length < 2 ? " · two required to start" : " · ready to start"}`;
}

function challengeNumber(challengeId) {
  const challenge = state.database.challenges.find((item) => item.id === challengeId);
  return challenge ? challengeDisplayTitle(challenge) : "Unknown challenge";
}

function syncTeamRoom() {
  if (!state.team.sessionId) return;
  const index = state.openTeams.findIndex((room) => room.sessionId === state.team.sessionId || room.id === state.team.id);
  const snapshot = { ...state.team, id: state.team.id || state.team.sessionId, members: state.team.members.map((member) => ({ ...member })), comments: { ...state.team.comments }, chat: [...state.team.chat] };
  if (index >= 0) state.openTeams[index] = snapshot;
  else state.openTeams.unshift(snapshot);
  saveOpenTeams();
}

function renderOpenTeams(challengeId = null, target = "#team-match-list", difficulty = null) {
  const rooms = state.openTeams.filter((room) => {
    const challenge = state.database.challenges.find((item) => item.id === room.challengeId);
    const member = room.members.some((item) => item.id === LOCAL_USER_ID);
    return challenge && (!challengeId || room.challengeId === challengeId) && (!difficulty || challenge.stars === difficulty) && (member || (room.openToPlayers && !room.started && !room.membershipLocked && !room.completed && !room.closed));
  });
  document.querySelector(target).innerHTML = rooms.map((room) => {
    const challenge = state.database.challenges.find((item) => item.id === room.challengeId);
    if (!challenge) return "";
    const member = room.members.some((item) => item.id === LOCAL_USER_ID);
    const status = canJoinTeam(room, LOCAL_USER_ID);
    return `<article class="open-team-card"><div><p class="field-label">${escapeHtml(room.challengeId)} · ${challenge.stars}★</p><strong>${room.members.length} of 5 simulated players</strong><span>${Math.max(0, 5 - room.members.length)} seats · ${room.started ? "Started" : "Waiting room"}</span></div><button class="button button--secondary" type="button" data-join-team="${room.id}" ${!member && !status.allowed ? "disabled" : ""}>${member ? "Resume" : status.allowed ? "Join" : escapeHtml(status.reason)}</button></article>`;
  }).join("") || '<p class="small-note">No simulated teams are open for this challenge.</p>';
}

function joinOpenTeam(roomId) {
  const room = state.openTeams.find((item) => item.id === roomId);
  if (!room) return;
  const status = canJoinTeam(room, LOCAL_USER_ID);
  const existingMember = room.members.find((member) => member.id === LOCAL_USER_ID || member.name === "You");
  if (!existingMember && !status.allowed) { showToast(status.reason); renderExplore(); return; }
  const you = { id: LOCAL_USER_ID, name: "You", stars: 0 };
  state.team = { ...room, sessionId: room.sessionId || `team-${room.id}`, members: existingMember ? [...room.members] : [...room.members, you], comments: { ...room.comments }, chat: [...(room.chat || [])] };
  Object.assign(room, state.team); saveOpenTeams(); saveTeam();
  state.mode = "team"; state.challenge = state.database.challenges.find((item) => item.id === room.challengeId);
  if (state.team.started) { renderTeamPlay(); showScreen(SCREENS.TEAM_GAME); }
  else { renderTeamLobby(); showScreen(SCREENS.TEAM_WAITING); }
  showToast(existingMember ? "Team resumed." : "Joined the waiting room. Shared team progress was preserved.");
}

function createTeam() {
  const now = Date.now();
  const members = [{ id: LOCAL_USER_ID, name: "You", stars: 0 }];
  state.team = { sessionId: `team-${now}`, members, comments: {}, cluesUnlocked: 0, proposal: null, chat: [], attemptsUsed: 0, completed: null, openToPlayers: false, started: false, membershipLocked: false, closed: false };
  state.mode = "team"; saveTeam(); showChallengeList();
  showToast("Private team created. Select a challenge, then gather at least two players.");
}


function startChallenge(challengeId) {
  const challenge = state.database.challenges.find((item) => item.id === challengeId);
  if (!challenge) return;
  state.challenge = challenge;
  state.attemptsUsed = 0;
  state.clueUnlocked = false;
  state.ownComment = "";
  if (state.mode === "solo") {
    state.soloSession = { sessionId: `solo-${Date.now()}`, challengeId: challenge.id, attemptsUsed: 0, clueUnlocked: false, ownComment: "", completed: false };
    saveSolo();
  }
  if (state.mode === "team") {
    state.team.sessionId ||= `team-${Date.now()}`;
    state.team.challengeId = challenge.id;
    state.team.attemptsUsed = 0;
    state.team.comments = {};
    state.team.cluesUnlocked = 0;
    state.team.proposal = null;
    state.team.completed = null;
    state.team.started = false;
    state.team.membershipLocked = false;
    saveTeam();
    syncTeamRoom();
    renderTeamLobby();
    showScreen(SCREENS.TEAM_WAITING);
    return;
  }
  document.querySelector("#clue-comment-form").reset();
  document.querySelector("#answer-form").reset();
  renderPlay();
  showScreen(SCREENS.PLAY);
}

function renderPlay() {
  const challenge = state.challenge;
  if (state.mode === "team") state.attemptsUsed = state.team.attemptsUsed || 0;
  document.querySelectorAll("[data-play-eyebrow]").forEach((label) => { label.textContent = `Borrow the Eyes · ${state.mode === "team" ? "Team" : "Solo"}`; });
  document.querySelector("[data-game-title]").textContent = challengeDisplayTitle(challenge);
  document.querySelector("[data-game-fragment]").src = challenge.fragmentImage;
  document.querySelector("[data-game-comment]").textContent = challenge.comment;
  document.querySelector("[data-game-stars]").textContent = `${"★".repeat(challenge.stars)} ${challenge.stars}-star challenge`;
  document.querySelector("[data-game-attempts]").textContent = `${Math.max(0, borrowAttemptLimit(challenge.stars, 1) - state.attemptsUsed)} attempts left`;
  document.querySelector("[data-game-feedback]").textContent = "";
  const clueArea = document.querySelector("[data-game-clue-area]");
  const clueCount = state.mode === "team" ? state.team.cluesUnlocked : (state.clueUnlocked ? 1 : 0);
  clueArea.innerHTML = challenge.clues.map((clue, index) => index < clueCount ? `<article class="clue-card is-unlocked"><p class="field-label">Clue ${index + 1} · Unlocked</p><p>${escapeHtml(clue)}</p></article>` : `<article class="clue-card is-locked"><span aria-hidden="true">◇</span><p>Clue ${index + 1} remains sealed</p></article>`).join("");
  document.querySelector("#clue-comment-form").hidden = state.mode === "team" || state.clueUnlocked;
  document.querySelector("#answer-form").hidden = state.mode === "team";
  document.querySelector("#solo-help").hidden = state.mode === "team";
}

function renderTeamPlay() {
  const playable = teamCanPlay();
  const memberCount = uniqueTeamMembers(state.team.members).length;
  const limit = borrowAttemptLimit(state.challenge.stars, memberCount);
  const remaining = Math.max(0, limit - (state.team.attemptsUsed || 0));
  const actor = document.querySelector("[data-team-actor]");
  const currentActor = actor.value || LOCAL_USER_ID;
  actor.innerHTML = state.team.members.map((member) => `<option value="${member.id}">${escapeHtml(member.name)}</option>`).join("");
  actor.value = state.team.members.some((member) => member.id === currentActor) ? currentActor : state.team.members[0]?.id || "";
  document.querySelector("#team-game-fragment").src = state.challenge.fragmentImage;
  document.querySelector("#team-game-challenge").textContent = `${state.challenge.id} · Mystery detail`;
  document.querySelector("#team-game-status").textContent = `${"★".repeat(state.challenge.stars)} · ${remaining} of ${Math.max(0, limit)} shared attempts left`;
  document.querySelector("#team-member-count").textContent = memberCount;
  document.querySelector("#team-clue-count").textContent = `${state.team.cluesUnlocked}/${state.challenge.stars}`;
  const banner = document.querySelector("#team-pending-banner");
  banner.hidden = !state.team.proposal;
  if (state.team.proposal) banner.querySelector("span").textContent = `${state.team.proposal.approvals?.length || 0} of ${memberCount} agreed · answer approval pending`;
  document.querySelector('[data-team-panel="agreement"]').disabled = !state.team.proposal;
  const feedback = document.querySelector("[data-team-feedback]");
  feedback.textContent = playable ? "" : state.team.completed ? "This team session is complete." : memberCount < 2 ? "Formal play is paused until the team has at least two active members." : limit <= 0 ? "This team size produces no formal attempts under the current rule." : "No formal attempts remain.";
  const log = document.querySelector("#team-chat-log"), previousTop = log.scrollTop;
  const viewerId = selectedTeamActor()?.id || LOCAL_USER_ID;
  log.innerHTML = state.team.chat.map((item) => { const member = state.team.members.find((entry) => entry.id === item.authorId || entry.name === item.name); const time = item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""; const system = item.authorId === "system" || (!item.authorId && item.name === "Museum guide"); const mine = !system && (item.authorId || member?.id) === viewerId; if (system) return `<article class="team-message is-system"><p>${escapeHtml(item.message)}</p></article>`; if (item.kind === "clue") return `<article class="team-message team-clue-message ${mine ? "is-mine" : ""} ${item.open ? "is-open" : ""}" data-clue-message="${escapeHtml(item.id)}">${member ? visitorAvatar(socialUser(member.id) || member) : ""}<div><header><strong>${escapeHtml(item.name)}</strong><time>${escapeHtml(time)}</time></header><button type="button" class="team-clue-card" data-flip-team-clue="${escapeHtml(item.id)}" aria-expanded="${item.open ? "true" : "false"}"><span class="clue-card-front">Shared Clue ${item.clueIndex + 1}</span><span class="clue-card-back">${escapeHtml(item.clue)}</span></button></div></article>`; return `<article class="team-message ${mine ? "is-mine" : ""}">${member ? visitorAvatar(socialUser(member.id) || member) : ""}<div><header><strong>${escapeHtml(item.name)}</strong><time>${escapeHtml(time)}</time></header><p>${escapeHtml(item.message)}</p></div></article>`; }).join("") || '<p class="small-note">The room is ready. Begin by sharing what you notice.</p>';
  log.scrollTop = previousTop;
}

function selectedTeamActor() {
  const id = document.querySelector("[data-team-actor]")?.value;
  return state.team.members.find((member) => member.id === id) || null;
}

function closeTeamPanel() {
  const sheet = document.querySelector("#team-action-sheet");
  sheet.hidden = true; document.body.classList.remove("has-team-sheet");
}

function openTeamPanel(kind) {
  const sheet = document.querySelector("#team-action-sheet"), content = document.querySelector("#team-sheet-content"), title = document.querySelector("#team-sheet-title");
  const actor = selectedTeamActor(), playable = teamCanPlay();
  if (!sheet || !content) return;
  if (kind === "fragment") {
    title.textContent = "Mystery fragment";
    content.innerHTML = `<figure class="team-expanded-fragment"><img src="${state.challenge.fragmentImage}" alt="Expanded mystery artwork fragment"><figcaption>${escapeHtml(state.challenge.id)} · ${state.challenge.stars} stars</figcaption></figure>`;
  } else if (kind === "members") {
    title.textContent = `Members · ${state.team.members.length}`;
    content.innerHTML = `<div class="team-member-sheet">${state.team.members.map((member) => `<article>${visitorAvatar(socialUser(member.id) || member)}<span><strong>${escapeHtml(member.name)}</strong><small>${member.id === LOCAL_USER_ID ? "You" : "Simulated participant"} · ${member.stars || 0} stars</small></span><b>${state.team.completed ? "Complete" : state.team.members.length < 2 ? "Paused" : "Active"}</b><button class="text-button" type="button" data-remove-member="${member.id}">${member.id === LOCAL_USER_ID ? "Leave team" : "Remove"}</button></article>`).join("")}</div>`;
  } else if (kind === "comment") {
    title.textContent = "Comment";
    const used = actor && state.team.comments[actor.id];
    content.innerHTML = used ? `<p class="sheet-note"><strong>${escapeHtml(actor.name)}</strong> has already contributed a Comment for this challenge.</p>` : `<form id="team-comment-form"><div class="team-sheet-form-body"><p class="sheet-note">Posting as <strong>${escapeHtml(actor?.name || "member")}</strong>. Each eligible member may submit one personal reflection to unlock one Clue.</p><label class="form-field"><span>Personal Comment</span><textarea name="comment" rows="3" required placeholder="What does this detail make you notice or feel?"></textarea></label></div><footer class="team-sheet-footer"><button class="button button--primary" type="submit" ${!playable || state.team.cluesUnlocked >= state.challenge.stars ? "disabled" : ""}>Submit Comment</button></footer></form>`;
  } else if (kind === "clues") {
    title.textContent = `Clues · ${state.team.cluesUnlocked}/${state.challenge.stars}`;
    content.innerHTML = `<div class="clue-list">${state.challenge.clues.map((clue, index) => { const shared = state.team.chat.some((item) => item.kind === "clue" && item.clueIndex === index); return index < state.team.cluesUnlocked ? `<article class="clue-card is-unlocked"><p class="field-label">Clue ${index + 1}</p><p>${escapeHtml(clue)}</p>${shared ? "" : `<button class="text-button" type="button" data-share-team-clue="${index}">Share to Team Chat</button>`}</article>` : `<article class="clue-card is-locked"><p>Clue ${index + 1} remains sealed</p></article>`; }).join("")}</div>`;
  } else if (kind === "proposal") {
    title.textContent = "Propose an answer";
    content.innerHTML = state.team.proposal ? '<p class="sheet-note">A proposal is waiting for team agreement. Open Answer Approval to respond.</p>' : `<form id="team-proposal-form"><p class="sheet-note">Proposing as <strong>${escapeHtml(actor?.name || "member")}</strong>. The answer uses an attempt only after unanimous agreement.</p><label class="form-field"><span>Artwork title</span><input name="answer" required autocomplete="off" placeholder="Enter the gallery-label title"></label><button class="button button--primary" type="submit" ${!playable ? "disabled" : ""}>Submit Proposal</button></form>`;
  } else if (kind === "agreement") {
    title.textContent = "Answer Approval";
    content.innerHTML = '<div id="team-proposal" class="proposal-card"></div>';
    renderProposal();
  } else if (kind === "new-clue") {
    const index = state.team.pendingClueShare?.index ?? Math.max(0, state.team.cluesUnlocked - 1), clue = state.challenge.clues[index];
    title.textContent = `Clue ${index + 1} unlocked`;
    content.innerHTML = `<article class="clue-card is-unlocked focused-clue"><p>${escapeHtml(clue)}</p></article><button class="button button--primary" type="button" data-share-team-clue="${index}">Share to Team Chat</button>`;
  } else return;
  sheet.hidden = false; document.body.classList.add("has-team-sheet");
}

function submitClueComment(event) {
  event.preventDefault();
  const comment = String(new FormData(event.currentTarget).get("comment") || "").trim();
  if (!comment || !state.challenge || state.clueUnlocked) return;
  state.ownComment = comment;
  state.clueUnlocked = true;
  saveSolo();
  renderPlay();
  showToast("Your Comment was saved for this challenge. One clue unlocked.");
}

function shareHelpToGallery() {
  if (state.mode !== "solo" || !state.challenge) return;
  const recruitment = createRecruitmentTeamFromSolo(true);
  if (!recruitment) { showToast("The Solo challenge is no longer active."); return; }
  const roomId = "public";
  const room = ensureSocialRoom(roomId);
  const existing = room.messages.find((message) => message.kind === "team-recruitment" && message.teamSessionId === recruitment.sessionId);
  if (!existing) room.messages.push({ kind: "team-recruitment", author: state.profile.nickname, authorId: LOCAL_USER_ID, time: formatChatTime(), challengeId: state.challenge.id, challengeLabel: challengeNumber(state.challenge.id), stars: state.challenge.stars, teamSessionId: recruitment.sessionId, sourceSoloSessionId: state.soloSession.sessionId });
  saveGalleryChat();
  state.mode = "team";
  if (recruitment.started) { renderTeamPlay(); showScreen(SCREENS.TEAM_GAME); }
  else { renderTeamLobby(); showScreen(SCREENS.TEAM_WAITING); }
  showToast(existing ? "Your existing Public Chat recruitment was reopened." : "Recruitment posted to Museum Public Chat. Your Solo game remains separately resumable.");
}

function submitAnswer(event) {
  event.preventDefault();
  const answer = String(new FormData(event.currentTarget).get("answer") || "").trim();
  if (!answer || !state.challenge) return;
  state.attemptsUsed += 1;
  const success = isCorrectAnswer(answer);
  const limit = borrowAttemptLimit(state.challenge.stars, 1);
  if (success || state.attemptsUsed >= limit) {
    saveProgress(state.challenge, success);
    state.soloSession = { ...(state.soloSession || {}), challengeId: state.challenge.id, attemptsUsed: state.attemptsUsed, clueUnlocked: state.clueUnlocked, ownComment: state.ownComment, completed: true, success };
    writeJson(STORAGE_KEYS.solo, state.soloSession);
    renderResult(success);
    showScreen(SCREENS.RESULT);
    return;
  }
  saveSolo();
  document.querySelector("[data-game-attempts]").textContent = `${Math.max(0, limit - state.attemptsUsed)} attempts left`;
  document.querySelector("[data-game-feedback]").textContent = "That is not the match. Look again before using another formal attempt.";
  event.currentTarget.reset();
}

function resolveArtworkId(answer) {
  if (state.database.artworkById.has(answer)) return answer;
  const normalized = normaliseAnswer(answer);
  return state.database.artworks.find((artwork) => normaliseAnswer(artwork.title) === normalized)?.id || null;
}

function isCorrectAnswer(answer) {
  return resolveArtworkId(answer) === state.challenge.answerArtworkId;
}

function submitTeamComment(event) {
  event.preventDefault();
  const form = event.target, data = new FormData(form);
  const memberId = selectedTeamActor()?.id || "";
  const comment = String(data.get("comment") || "").trim();
  if (!teamCanPlay() || !state.team.members.some((member) => member.id === memberId) || !comment || state.team.comments[memberId] || state.team.cluesUnlocked >= state.challenge.stars) return;
  state.team.comments[memberId] = comment;
  state.team.cluesUnlocked = Math.min(state.challenge.stars, state.team.cluesUnlocked + 1);
  state.team.pendingClueShare = { index: state.team.cluesUnlocked - 1, memberId };
  saveTeam(); syncTeamRoom(); form.reset(); renderTeamPlay(); openTeamPanel("new-clue");
}

function shareTeamClue(index) {
  const actorId = state.team.pendingClueShare?.index === index ? state.team.pendingClueShare.memberId : selectedTeamActor()?.id;
  const actor = state.team.members.find((member) => member.id === actorId);
  const clue = state.challenge?.clues?.[index];
  if (!actor || !clue || index < 0 || index >= state.team.cluesUnlocked) return;
  const id = `clue-${state.challenge.id}-${index}`;
  if (!state.team.chat.some((item) => item.id === id)) state.team.chat.push({ id, kind: "clue", clueIndex: index, clue, open: true, authorId: actor.id, name: actor.name, createdAt: new Date().toISOString() });
  state.team.pendingClueShare = null; saveTeam(); syncTeamRoom(); closeTeamPanel(); renderTeamPlay();
  const log = document.querySelector("#team-chat-log"); log.scrollTop = log.scrollHeight;
}

function flipTeamClue(id) {
  const message = state.team.chat.find((item) => item.kind === "clue" && item.id === id);
  if (!message) return;
  message.open = !message.open; saveTeam(); syncTeamRoom(); renderTeamPlay();
}

function submitProposal(event) {
  event.preventDefault();
  const form = event.target, data = new FormData(form);
  const memberId = selectedTeamActor()?.id || "";
  const answer = String(data.get("answer") || "").trim();
  if (!teamCanPlay() || !state.team.members.some((member) => member.id === memberId) || !answer || state.team.proposal) return;
  state.team.proposal = { memberId, answer, answerArtworkId: resolveArtworkId(answer), approvals: [memberId], resolved: false };
  saveTeam(); syncTeamRoom(); form.reset(); renderTeamPlay(); openTeamPanel("agreement");
}

function renderProposal() {
  const panel = document.querySelector("#team-proposal");
  const proposal = state.team.proposal;
  if (!panel) return;
  panel.hidden = !proposal;
  if (!proposal) { panel.innerHTML = ""; return; }
  proposal.approvals ||= [];
  if (!proposal.approvals.includes(proposal.memberId)) proposal.approvals.unshift(proposal.memberId);
  const proposer = state.team.members.find((member) => member.id === proposal.memberId);
  const actor = selectedTeamActor(), proposerViewing = actor?.id === proposal.memberId;
  document.querySelector("#team-sheet-title").textContent = proposerViewing ? "Waiting for Teammates" : "Answer Approval";
  panel.innerHTML = `<div class="proposal-author">${proposer ? visitorAvatar(socialUser(proposer.id) || proposer) : ""}<p><span class="field-label">Proposed by</span><strong>${escapeHtml(proposer?.name || "Team member")}</strong></p></div><p class="proposal-answer">“${escapeHtml(proposal.answer)}”</p><p><strong>${proposal.approvals.length} of ${state.team.members.length} agreed</strong></p><div class="approval-list">${state.team.members.map((member) => proposal.approvals.includes(member.id) ? `<span class="member-chip is-approved">${escapeHtml(member.name)} · ${member.id === proposal.memberId ? "Proposed / Agreed" : "Agreed"}</span>` : `<span class="member-chip">${escapeHtml(member.name)} · Waiting</span>`).join("")}</div>${actor && !proposal.approvals.includes(actor.id) ? `<div class="agreement-actions"><p>Responding as <strong>${escapeHtml(actor.name)}</strong></p><button type="button" class="button button--secondary" data-team-agree>Agree</button><button type="button" class="text-button" data-team-disagree>Disagree</button></div>` : ""}<div class="proposal-navigation">${actor?.id === proposal.memberId ? '<button type="button" class="text-button" data-team-cancel>Cancel Proposal</button>' : ""}<button type="button" class="button button--secondary" data-team-panel-close>Return to Chat</button></div>`;
}

function approveProposal(memberId) {
  const proposal = state.team.proposal;
  if (!teamCanPlay() || !proposal || !state.team.members.some((member) => member.id === memberId)) return;
  if (!proposal.approvals.includes(memberId)) proposal.approvals.push(memberId);
  if (proposal.approvals.length === state.team.members.length) {
    const answerArtworkId = proposal.answerArtworkId ?? resolveArtworkId(proposal.answer);
    state.team.proposal = null;
    state.team.attemptsUsed = (state.team.attemptsUsed || 0) + 1;
    state.attemptsUsed = state.team.attemptsUsed;
    const success = answerArtworkId === state.challenge.answerArtworkId;
    if (success) {
      const localRewarded = Object.entries(readProgress()).some(([key, item]) => (item.challengeId === state.challenge.id || key === state.challenge.id) && item.success && Number(item.starsAwarded) > 0);
      state.team.members.forEach((member) => {
        member.completedChallengeIds ||= [];
        if (!member.completedChallengeIds.includes(state.challenge.id)) {
          if (member.id !== LOCAL_USER_ID || !localRewarded) member.stars = (member.stars || 0) + state.challenge.stars;
          member.completedChallengeIds.push(state.challenge.id);
        }
      });
    }
    const limit = borrowAttemptLimit(state.challenge.stars, uniqueTeamMembers(state.team.members).length);
    const finished = success || state.team.attemptsUsed >= limit;
    state.team.completed = finished ? { challengeId: state.challenge.id, success, attemptsUsed: state.team.attemptsUsed } : null;
    if (finished) state.team.openToPlayers = false;
    saveTeam(); syncTeamRoom();
    if (finished) {
      saveProgress(state.challenge, success, "team", state.team.sessionId || state.team.challengeId, state.team.attemptsUsed);
      renderResult(success); showScreen(SCREENS.RESULT); return;
    }
    closeTeamPanel(); renderTeamPlay();
    document.querySelector("[data-team-feedback]").textContent = "The unanimous answer was not the match. One shared attempt was used.";
    return;
  }
  saveTeam(); syncTeamRoom(); renderProposal();
}

function rejectProposal() {
  state.team.proposal = null;
  saveTeam(); syncTeamRoom(); closeTeamPanel(); renderTeamPlay();
  document.querySelector("[data-team-feedback]").textContent = "Proposal rejected. No formal attempt was used.";
}

function cancelProposal() {
  state.team.proposal = null;
  saveTeam(); syncTeamRoom(); closeTeamPanel(); renderTeamPlay();
  document.querySelector("[data-team-feedback]").textContent = "Proposal cancelled by its proposer. No formal attempt was used.";
}

function submitTeamChat(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const member = selectedTeamActor();
  const message = String(data.get("message") || "").trim();
  if (!member || !message) return;
  state.team.chat.push({ authorId: member.id, name: member.name, message, createdAt: new Date().toISOString() });
  state.team.chat = state.team.chat.slice(-50);
  saveTeam(); syncTeamRoom(); event.currentTarget.reset(); renderTeamPlay();
  const log = document.querySelector("#team-chat-log"); log.scrollTop = log.scrollHeight;
}

function submitBlindAnswer(event) {
  event.preventDefault();
  if (state.blind.role !== "guesser" || state.blind.result) return;
  const answer = String(new FormData(event.currentTarget).get("answer") || "").trim();
  if (!answer) return;
  state.blind.attemptsUsed += 1;
  const success = isCorrectAnswer(answer);
  if (success) {
    const localRewarded = Object.entries(readProgress()).some(([key, item]) => (item.challengeId === state.challenge.id || key === state.challenge.id) && item.success && Number(item.starsAwarded) > 0);
    state.blind.rewardedChallenges ||= { describer: [], guesser: [] };
    ["describer", "guesser"].forEach((role) => {
      state.blind.rewardedChallenges[role] ||= [];
      if (!state.blind.rewardedChallenges[role].includes(state.challenge.id)) {
        if (role !== state.blind.role || !localRewarded) state.blind.stars[role] += state.challenge.stars;
        state.blind.rewardedChallenges[role].push(state.challenge.id);
      }
    });
  }
  if (success || state.blind.attemptsUsed >= blindAttemptLimit(state.challenge.stars)) {
    state.blind.result = { success, attemptsUsed: state.blind.attemptsUsed, challengeId: state.challenge.id };
    saveProgress(state.challenge, success, "blind", state.blind.sessionId || state.blind.challengeId, state.blind.attemptsUsed);
    saveBlind(); document.querySelector("#blind-guess-dialog").close(); renderResult(success); showScreen(SCREENS.RESULT); return;
  }
  const clueProgress = advanceBlindWrongGuess(state.blind, state.challenge.clues.length);
  state.blind.cluesUnlocked = clueProgress.cluesUnlocked;
  saveBlind(); event.currentTarget.reset(); document.querySelector("#blind-guess-dialog").close(); renderBlindPlay();
  const dialog = document.querySelector("#blind-feedback-dialog");
  const remaining = blindAttemptLimit(state.challenge.stars) - state.blind.attemptsUsed;
  document.querySelector("[data-blind-feedback-title]").textContent = "Not Quite!";
  document.querySelector("[data-blind-feedback-copy]").textContent = `${remaining} formal ${remaining === 1 ? "attempt" : "attempts"} remaining. No stars were deducted.`;
  document.querySelector("[data-blind-new-clue]").innerHTML = clueProgress.newlyUnlocked ? `<article class="clue-card is-unlocked"><p class="field-label">Clue ${clueProgress.cluesUnlocked}</p><p>${escapeHtml(state.challenge.clues[clueProgress.clueIndex])}</p></article>` : "";
  dialog.showModal();
}

function submitBlindChat(event) {
  event.preventDefault();
  const message = String(new FormData(event.currentTarget).get("message") || "").trim();
  if (!message) return;
  const role = state.blind.role === "describer" ? "Describer" : "Guesser";
  const senderId = state.blind.role === "describer" ? state.blind.describerId : state.blind.guesserId;
  state.blind.chat.push({ senderId, role, message, createdAt: new Date().toISOString() });
  saveBlind(); event.currentTarget.reset(); renderBlindPlay();
}

function renderResult(success, reveal = false) {
  const challenge = state.challenge;
  const artwork = state.database.artworkById.get(challenge.answerArtworkId);
  const metadataStatus = artwork.metadataStatus;
  const perspective = artwork.artistPerspective || {};
  document.querySelector("[data-result-reveal]").hidden = !reveal;
  document.querySelector("[data-result-heading]").textContent = success ? "A shared discovery" : "The detail remains unresolved";
  document.querySelector("[data-result-summary]").textContent = success ? (state.mode === "team" ? `${challenge.stars} ${challenge.stars === 1 ? "star" : "stars"} awarded to every team member.` : state.mode === "blind" ? `${challenge.stars} ${challenge.stars === 1 ? "star" : "stars"} awarded to both Describer and Guesser.` : `${challenge.stars} ${challenge.stars === 1 ? "star" : "stars"} added to your notebook.`) : "All formal attempts have been used. No stars were awarded. You may reveal the answer when you are ready.";
  const image = document.querySelector("[data-result-image]");
  if (reveal) image.src = artwork.fullImage || challenge.fullImage;
  else image.removeAttribute("src");
  document.querySelector("[data-result-title]").textContent = reveal ? safeMetadata(artwork.title, metadataStatus) : "";
  document.querySelector("[data-result-artist]").textContent = reveal ? safeMetadata(artwork.artist, metadataStatus) : "";
  document.querySelector("[data-result-date]").textContent = reveal ? safeMetadata(artwork.date, metadataStatus) : "";
  const perspectiveText = perspective.status === "verified_creator_attribution"
    ? perspective.text
    : perspective.status === "creator_supplied_unverified" && perspective.text
      ? `Creator-supplied perspective (attribution unverified): ${perspective.text}`
      : perspective.status === "pending_verification" || !perspective.text ? "Pending verification" : perspective.text;
  document.querySelector("[data-result-perspective]").textContent = reveal ? perspectiveText : "";
  const actions = document.querySelector("#result-actions");
  const revealAction = reveal ? "" : `<button class="button button--primary" type="button" data-action="result-reveal">${success ? "See Full Artwork" : "See the Correct Answer"}</button>`;
  const primaryReturn = `<button class="button button--secondary" type="button" data-action="back-to-browse">${success ? "Back to Browse" : "Try Another Detail"}</button>`;
  const extras = state.mode === "blind"
    ? '<section class="blind-next-actions"><p class="field-label">What’s Next?</p><div><button type="button" data-action="blind-return-chat">Continue Chat</button><button type="button" data-action="blind-continue">Continue Together</button><button type="button" data-action="blind-new-partner">Find a New Partner</button><button type="button" data-action="blind-change-tag">Choose Another Tag</button><button type="button" data-action="leave-result">Back to Home</button></div></section>'
    : state.mode === "team"
      ? `<button class="text-button" type="button" data-action="team-continue">Continue Together</button>${state.team.members.filter((member) => member.id !== LOCAL_USER_ID).map((member) => `<button class="text-button" type="button" data-player-id="${member.id}">View ${escapeHtml(member.name)}'s Profile</button>`).join("")}<button class="text-button" type="button" data-action="leave-result">Leave</button>`
      : '<button class="text-button" type="button" data-action="play-again">Play Again</button><button class="text-button" type="button" data-action="open-friends">Add Friend</button><button class="text-button" type="button" data-action="leave-result">Leave</button>';
  actions.innerHTML = revealAction + primaryReturn + extras;
  document.querySelector("#result-invitation").innerHTML = "";
}

function showChallengeList() {
  if (!state.database) { showToast("The artwork database is still loading."); return; }
  document.querySelectorAll("[data-play-eyebrow]").forEach((label) => { label.textContent = `Borrow the Eyes · ${state.mode === "team" ? "Team" : "Solo"}`; });
  renderChallengeList();
  showScreen(SCREENS.LIST);
}

function teamCanPlay() {
  return state.mode === "team" && state.challenge?.id === state.team.challengeId && canSubmitTeam(state.team, state.challenge);
}

function hasResumableTeam() {
  return Boolean(state.team.challengeId && !state.team.completed && !state.team.closed && state.team.members.some((member) => member.id === LOCAL_USER_ID));
}

function showModeChoice() {
  const resume = document.querySelector('[data-action="resume-team"]');
  resume.hidden = !hasResumableTeam();
  showScreen(SCREENS.MODE);
}

function renderMuseumMap() {
  const records = state.database.challenges.filter((challenge, index) => index % 4 === 0).slice(0, 5);
  const positions = [[24,30],[67,27],[82,63],[48,72],[20,72]];
  document.querySelector("#museum-map").innerHTML = `<div class="map-canvas"><svg viewBox="0 0 420 520" role="img" aria-labelledby="map-title map-desc"><title id="map-title">Borrowed Eyes conceptual museum map</title><desc id="map-desc">An illustrated two-wing museum floor plan with gallery and artwork markers.</desc><defs><pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line y2="7" stroke="#a68d5b" stroke-opacity=".16"/></pattern></defs><path class="map-building" d="M34 54h352v153h-42v70h42v187H34V277h42v-70H34Z"/><path class="map-court" d="M151 182h118v148H151Z"/><path class="map-room" d="M55 76h132v88H55Zm178 0h132v88H233ZM55 345h132v95H55Zm178 0h132v95H233Z"/><path class="map-corridor" d="M76 207h268v70H76Z"/><path class="map-route" d="M210 471V242H97m113 0h112"/><g class="map-labels"><text x="121" y="119">PORTRAIT GALLERY</text><text x="299" y="119">LANDSCAPE HALL</text><text x="121" y="395">HISTORICAL ROOM</text><text x="299" y="395">MODERN STUDIES</text><text x="210" y="255">CENTRAL ARCADE</text><text x="210" y="505">ENTRANCE</text></g><g class="you-marker" transform="translate(210 468)"><path d="M0 20S-15 5-15-7A15 15 0 0 1 15-7C15 5 0 20 0 20Z"/><circle cy="-7" r="5"/></g></svg>${records.map((challenge,index)=>{const [x,y]=positions[index];return `<button class="map-art-marker" data-map-challenge="${challenge.id}" aria-label="Artwork marker ${index+1}" style="--x:${x}%;--y:${y}%"><span>${index+1}</span></button>`}).join("")}</div>`;
  document.querySelector("#map-panel").innerHTML = '<p>Select an artwork marker to view its gallery information.</p>';
}

function showMapRecord(challengeId) {
  const challenge = state.database.challenges.find((item) => item.id === challengeId); if (!challenge) return;
  const active = (state.mode === "solo" && !state.soloSession?.completed && state.challenge?.id === challenge.id)
    || (!state.team.completed && !state.team.closed && state.team.challengeId === challenge.id)
    || (!state.blind.result && state.blind.challengeId === challenge.id);
  const artwork = state.database.artworkById.get(challenge.answerArtworkId);
  document.querySelector("#map-panel").innerHTML = `<p class="eyebrow">Conceptual location · ${escapeHtml(challenge.id)}</p><h3>${active ? "Mystery artwork location" : escapeHtml(safeMetadata(artwork?.title))}</h3><p>${active ? "Identity hidden while this challenge is active." : `${challenge.stars}★ collection record · Fictional gallery placement`}</p>`;
}

function openDestination(route, remember = true) {
  if (route === "start") { showScreen(SCREENS.START, remember, "start"); return; }
  if (route === "blind") { openBlindGame(); return; }
  if (route === "chat") { openMessages(); return; }
  if (route === "map") { renderMuseumMap(); showScreen(SCREENS.MAP, remember, "map"); return; }
  if (route === "teams") { const content = document.querySelector("#destination-content"); document.querySelector("#destination-title").textContent = DESTINATIONS.teams[0]; document.querySelector("#destination-description").textContent = DESTINATIONS.teams[1]; renderExplore(content); showScreen(SCREENS.DESTINATION, remember, "chat"); return; }
  if (route === "profile") { renderMyProfile(); return; }
  if (route === "leave") { openLeaveEyes(); return; }
  if (!DESTINATIONS[route]) return;
  const [title, description] = DESTINATIONS[route];
  document.querySelector("#destination-title").textContent = title;
  document.querySelector("#destination-description").textContent = description;
  const content = document.querySelector("#destination-content");
  if (route !== "teams") {
    content.innerHTML = '<div class="empty-state"><span class="stamp" aria-hidden="true">❧</span><p class="card-label">A little more wonder awaits</p><h3>Coming in a future phase</h3><p>For now, explore Borrow the Eyes in solo mode.</p></div><button class="button button--secondary" type="button" data-action="start">Try Borrow the Eyes →</button>';
  }
  showScreen(SCREENS.DESTINATION, remember, route);
}

function hasActiveChallenge() {
  const activeSolo = Boolean(state.soloSession?.challengeId && !state.soloSession.completed);
  const activeTeam = hasResumableTeam();
  const activeBlind = Boolean(state.blind.challengeId && !state.blind.result);
  return activeSolo || activeTeam || activeBlind;
}

function renderExplore(content = document.querySelector("#destination-content")) {
  const challengeId = state.matchingChallengeId;
  const continues = [
    state.soloSession?.challengeId && !state.soloSession.completed ? `<button class="continue-card" type="button" data-resume-session="solo"><strong>Solo</strong><span>${escapeHtml(state.soloSession.challengeId)} · ${state.soloSession.attemptsUsed || 0} attempts used</span></button>` : "",
    hasResumableTeam() ? `<button class="continue-card" type="button" data-resume-session="team"><strong>Team</strong><span>${escapeHtml(state.team.challengeId)} · ${state.team.members.length} members</span></button>` : "",
    state.blind.challengeId && !state.blind.result ? `<button class="continue-card" type="button" data-resume-session="blind"><strong>Blind Eyes</strong><span>${escapeHtml(state.blind.challengeId)} · anonymous room</span></button>` : "",
  ].filter(Boolean).join("");
  content.innerHTML = `<section class="explore-section"><div class="section-heading"><h3>Continue Playing</h3></div><div class="continue-list">${continues || '<p class="small-note">No active sessions.</p>'}</div></section><section class="explore-section"><div class="section-heading"><h3>Find a Team</h3></div>${challengeId ? `<p class="small-note">Exact challenge filter: ${escapeHtml(challengeId)}.</p>` : '<p class="small-note">Only public, simulated waiting rooms appear here.</p>'}<div class="explore-filters" role="group" aria-label="Difficulty filter"><button class="text-button" data-explore-difficulty="0">All</button>${[1,2,3,4,5].map((n) => `<button class="text-button" data-explore-difficulty="${n}">${n}★</button>`).join("")}</div><div id="explore-team-list" class="open-team-list"></div><div class="explore-empty-actions"><button class="button button--secondary" type="button" data-action="explore-create-team">Create Team</button><button class="text-button" type="button" data-action="explore-invite">Invite Friends</button></div></section><section class="explore-section"><div class="section-heading"><h3>Discover Challenges</h3></div><div class="explore-challenges">${state.database.challenges.map((challenge, index) => `<article class="explore-challenge"><img src="${challenge.fragmentImage}" alt="Mystery fragment ${index + 1}" loading="lazy"><div><strong>Mystery ${String(index + 1).padStart(2, "0")}</strong><span class="star-rating">${"★".repeat(challenge.stars)}${"☆".repeat(5 - challenge.stars)}</span><button type="button" class="text-button" data-find-challenge-team="${challenge.id}">Find a team</button></div></article>`).join("")}</div></section>`;
  renderOpenTeams(challengeId, "#explore-team-list", state.exploreDifficulty || null);
}

function continuePlaying(session = null) {
  if (!session) session = state.soloSession?.challengeId && !state.soloSession.completed ? "solo" : hasResumableTeam() ? "team" : state.blind.challengeId && !state.blind.result ? "blind" : null;
  if (session === "blind") { state.mode = "blind"; state.challenge = state.database.challenges.find((item) => item.id === state.blind.challengeId); if (state.challenge) { renderBlindPlay(); showScreen(SCREENS.BLIND_PLAY); } return; }
  state.mode = session;
  if (session === "team" && !hasResumableTeam()) { showToast("That saved team is no longer active."); showModeChoice(); return; }
  const challengeId = session === "team" ? state.team.challengeId : state.soloSession?.challengeId;
  const challenge = state.database.challenges.find((item) => item.id === challengeId);
  if (!challenge) { showToast("No active challenge was found."); return; }
  state.challenge = challenge;
  if (session === "solo") { state.attemptsUsed = state.soloSession.attemptsUsed || 0; state.clueUnlocked = Boolean(state.soloSession.clueUnlocked); state.ownComment = state.soloSession.ownComment || ""; }
  if (session === "team" && !state.team.started) { renderTeamLobby(); showScreen(SCREENS.TEAM_WAITING); return; }
  if (session === "team") { renderTeamPlay(); showScreen(SCREENS.TEAM_GAME); return; }
  renderPlay(); showScreen(SCREENS.PLAY);
}

function startTeamGame() {
  if (!canStartTeam(state.team)) { showToast("Select a challenge and gather at least two unique players first."); return; }
  state.team.started = true;
  state.team.membershipLocked = true;
  state.team.openToPlayers = false;
  state.team.startedAt = new Date().toISOString();
  state.mode = "team";
  state.challenge = state.database.challenges.find((item) => item.id === state.team.challengeId);
  saveTeam(); syncTeamRoom(); renderTeamPlay(); showScreen(SCREENS.TEAM_GAME);
}

function setTeamRecruitment(open) {
  if (state.team.started || state.team.membershipLocked || state.team.completed) return;
  state.team.openToPlayers = Boolean(open);
  saveTeam(); syncTeamRoom(); renderTeamLobby();
}

function rematchBlind(continueTogether = false) {
  const { role, partnerRole, stars, rewardedChallenges } = state.blind;
  state.blind = { ...freshBlindState(stars), role, partnerRole, rewardedChallenges, continueInvite: continueTogether ? { status: "Pending" } : null };
  saveBlind();
  if (!continueTogether) { showScreen(SCREENS.BLIND_PREFS); return; }
  document.querySelector("#result-invitation").innerHTML = '<p class="field-label">Continue Together · simulated invitation</p><p>Your anonymous partner may accept, decline or ignore this invitation.</p><div class="inline-actions"><button class="button button--secondary" data-action="blind-continue-accept">Accept</button><button class="text-button" data-action="blind-continue-decline">Decline</button><button class="text-button" data-action="blind-continue-ignore">Ignore</button></div>';
}

function prepareTeamContinuation() {
  const previous = state.team.members.filter((member) => member.id !== LOCAL_USER_ID).map((member) => ({ ...member }));
  state.teamContinuation = { previous, accepted: [] };
  document.querySelector("#result-invitation").innerHTML = `<p class="field-label">Invite previous members to a new challenge</p>${previous.map((member) => `<div class="member-row"><span><strong>${escapeHtml(member.name)}</strong><small>Invitation pending</small></span><button class="button button--secondary" data-team-next-accept="${member.id}">Accept</button></div>`).join("") || '<p class="small-note">No previous members are available.</p>'}<button class="button button--primary" data-action="team-next-select" disabled>Select next challenge</button>`;
}

function acceptTeamContinuation(memberId) {
  const continuation = state.teamContinuation;
  const member = continuation?.previous.find((item) => item.id === memberId);
  if (!member || continuation.accepted.some((item) => item.id === memberId)) return;
  continuation.accepted.push(member);
  const button = document.querySelector(`[data-team-next-accept="${memberId}"]`);
  if (button) { button.disabled = true; button.textContent = "Accepted"; }
  document.querySelector('[data-action="team-next-select"]').disabled = continuation.accepted.length < 1;
}

function beginContinuedTeam() {
  if (!state.teamContinuation?.accepted.length) return;
  const you = state.team.members.find((member) => member.id === LOCAL_USER_ID) || { id: LOCAL_USER_ID, name: "You", stars: 0 };
  state.team = { sessionId: `team-${Date.now()}`, members: [you, ...state.teamContinuation.accepted], comments: {}, cluesUnlocked: 0, proposal: null, chat: [], attemptsUsed: 0, completed: null, openToPlayers: false, started: false, membershipLocked: false, closed: false };
  state.teamContinuation = null; state.mode = "team"; saveTeam(); showChallengeList();
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 4500);
}

function setAuthMode(mode) {
  authMode = ["login", "signup", "qr"].includes(mode) ? mode : "login";
  document.querySelectorAll("[data-auth-mode]").forEach((button) => button.setAttribute("aria-selected", String(button.dataset.authMode === authMode)));
  document.querySelector("#auth-form").hidden = authMode === "qr";
  document.querySelector(".auth-qr").hidden = authMode !== "qr";
  document.querySelector(".auth-name").hidden = authMode !== "signup";
  document.querySelector(".auth-confirm").hidden = authMode !== "signup";
  document.querySelector('#auth-form input[name="password"]').autocomplete = authMode === "signup" ? "new-password" : "current-password";
  document.querySelector(".login-enter").textContent = authMode === "signup" ? "Create Account" : "Log In";
  document.querySelector(".auth-feedback").textContent = "";
}

function submitAuth(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget), email = String(data.get("email") || "").trim(), password = String(data.get("password") || ""), feedback = document.querySelector(".auth-feedback");
  if (!/^\S+@\S+\.\S+$/.test(email)) { feedback.textContent = "Enter a valid email address."; return; }
  if (password.length < 8) { feedback.textContent = "Password must contain at least 8 characters."; return; }
  if (authMode === "signup") {
    if (!String(data.get("name") || "").trim()) { feedback.textContent = "Enter a display name."; return; }
    if (password !== String(data.get("confirm") || "")) { feedback.textContent = "Passwords do not match."; return; }
  }
  feedback.textContent = "Account authentication requires a configured backend. No password was saved. Use Preview access to enter this local prototype.";
}

function setupEvents() {
  document.addEventListener("click", (event) => {
    const authTab = event.target.closest("[data-auth-mode]");
    if (authTab) { setAuthMode(authTab.dataset.authMode); return; }
    if (event.target.closest("[data-password-toggle]")) { const inputs = document.querySelectorAll('#auth-form input[name="password"], #auth-form input[name="confirm"]'); const reveal = [...inputs].some((input) => input.type === "password"); inputs.forEach((input) => { input.type = reveal ? "text" : "password"; }); event.target.closest("[data-password-toggle]").textContent = reveal ? "Hide" : "Show"; return; }
    if (event.target.closest('[data-auth-help="forgot"]')) { document.querySelector(".auth-feedback").textContent = "Password recovery requires a configured identity service. No password is stored by this prototype."; return; }
    const mapMarker = event.target.closest("[data-map-challenge]");
    if (mapMarker) { showMapRecord(mapMarker.dataset.mapChallenge); return; }
    const creatorNext = event.target.closest("[data-creator-next]");
    if (creatorNext) { const step = Number(creatorNext.dataset.creatorNext), error = creatorStepAllowed(step); if (error) { const feedback = document.querySelector(`[data-creator-feedback="${Math.max(1, step - 1)}"]`) || document.querySelector("#creator-feedback") || document.querySelector("#crop-feedback"); if (feedback) feedback.textContent = error; return; } if (state.creator.returnToReview && state.currentScreen === SCREENS.CREATOR_ARTWORK) { const fullError = validateCreatorDraft(state.creator); if (!fullError) { state.creator.returnToReview = false; renderCreatorStep(6); return; } } if (state.creator.returnToReview && state.currentScreen === SCREENS.CREATOR_PERSPECTIVE) { const fullError = validateCreatorDraft(state.creator); if (!fullError) { state.creator.returnToReview = false; renderCreatorStep(6); return; } } renderCreatorStep(step); return; }
    const creatorBack = event.target.closest("[data-creator-back]");
    if (creatorBack) { if (state.currentScreen === SCREENS.CREATOR_PERSPECTIVE) captureCreatorDetails(); if (state.currentScreen === SCREENS.CREATOR_REVIEW) captureCreatorClue(); renderCreatorStep(Number(creatorBack.dataset.creatorBack)); return; }
    const creatorEdit = event.target.closest("[data-creator-edit]");
    if (creatorEdit) { const step = Number(creatorEdit.dataset.creatorEdit); state.creator.returnToReview = true; if (step === 5) state.creator.clueIndex = 0; saveCreatorDraft(); renderCreatorStep(step); return; }
    const editSavedSubmission = event.target.closest("[data-edit-submission]");
    if (editSavedSubmission) { editSubmission(editSavedSubmission.dataset.editSubmission); return; }
    const statusLink = event.target.closest("[data-status-id]");
    if (statusLink) { renderSubmissionStatus(statusLink.dataset.statusId); showScreen(SCREENS.CREATOR_STATUS); return; }
    const photoTarget = event.target.closest("[data-photo-target]");
    if (photoTarget) { document.querySelector(`#${photoTarget.dataset.photoTarget}`).click(); return; }
    const chatDestination = event.target.closest("[data-chat-destination]")?.dataset.chatDestination;
    if (chatDestination === "public") { openChatRoom("public"); return; }
    if (chatDestination === "artwork") { renderArtworkChats(); showScreen(SCREENS.ARTWORK_CHATS); return; }
    if (chatDestination === "messages") { renderMessageList(); showScreen(SCREENS.MESSAGE_LIST); return; }
    if (chatDestination === "friends") { openFriends(); return; }
    if (chatDestination === "teams") { openDestination("teams"); return; }
    const playerLink = event.target.closest("[data-player-id]");
    if (playerLink) { renderPlayerProfile(playerLink.dataset.playerId); return; }
    const addFriend = event.target.closest("[data-add-friend]");
    if (addFriend) { sendFriendRequest(addFriend.dataset.addFriend); return; }
    const friendDecision = event.target.closest("[data-friend-decision]");
    if (friendDecision) { decideFriendRequest(friendDecision.dataset.requestId, friendDecision.dataset.friendDecision); return; }
    const groupMembers = event.target.closest("[data-group-members]");
    if (groupMembers) { renderGroupMembers(groupMembers.dataset.groupMembers); return; }
    const invitePlayer = event.target.closest("[data-invite-player]");
    if (invitePlayer) { sendGameInvitation(invitePlayer.dataset.invitePlayer); return; }
    const groupInvite = event.target.closest("[data-group-invite]");
    if (groupInvite) { const group = state.galleryChat.social.groups.find((item) => item.id === groupInvite.dataset.groupInvite); group?.memberIds.forEach(sendGameInvitation); return; }
    const helpMethod = event.target.closest("[data-help-method]")?.dataset.helpMethod;
    if (helpMethod === "gallery") { shareHelpToGallery(); return; }
    if (helpMethod === "invite") { openFriends(); showToast("Choose an accepted friend and send a local game invitation."); return; }
    if (helpMethod === "match") { state.matchingChallengeId = state.challenge.id; openDestination("teams"); return; }
    const joinTeam = event.target.closest("[data-join-team]");
    if (joinTeam) { joinOpenTeam(joinTeam.dataset.joinTeam); return; }
    const linkedTeam = event.target.closest("[data-open-team-session]");
    if (linkedTeam) {
      const room = state.openTeams.find((item) => item.sessionId === linkedTeam.dataset.openTeamSession || item.id === linkedTeam.dataset.openTeamSession);
      if (!room) { showToast("This Team waiting room is no longer available."); return; }
      joinOpenTeam(room.id); return;
    }
    const recruitmentJoin = event.target.closest("[data-join-recruitment]");
    if (recruitmentJoin) { joinRecruitmentFromChat(recruitmentJoin.dataset.joinRecruitment); return; }
    const findChallengeTeam = event.target.closest("[data-find-challenge-team]");
    if (findChallengeTeam) { state.matchingChallengeId = findChallengeTeam.dataset.findChallengeTeam; renderExplore(); return; }
    const resumeSession = event.target.closest("[data-resume-session]");
    if (resumeSession) { continuePlaying(resumeSession.dataset.resumeSession); return; }
    const difficultyFilter = event.target.closest("[data-explore-difficulty]");
    if (difficultyFilter) { state.exploreDifficulty = Number(difficultyFilter.dataset.exploreDifficulty) || 0; renderOpenTeams(state.matchingChallengeId, "#explore-team-list", state.exploreDifficulty || null); return; }
    const teamEntry = event.target.closest("[data-team-entry]")?.dataset.teamEntry;
    if (teamEntry === "find") { renderOpenTeams(); showScreen(SCREENS.TEAM_MATCH); return; }
    if (teamEntry === "create") { createTeam(); return; }
    if (teamEntry === "invite") { openFriends(); showToast("Add or choose a friend, then send a local game invitation."); return; }
    const inviteAccept = event.target.closest("[data-invite-accept]");
    if (inviteAccept) { decideGameInvitation(inviteAccept.dataset.inviteAccept, true); return; }
    const inviteDecline = event.target.closest("[data-invite-decline]");
    if (inviteDecline) { decideGameInvitation(inviteDecline.dataset.inviteDecline, false); return; }
    const inviteIgnore = event.target.closest("[data-invite-ignore]");
    if (inviteIgnore) { const invite = state.galleryChat.social.invitations.find((item) => item.id === inviteIgnore.dataset.inviteIgnore); if (invite?.status === "Pending") { invite.status = "Ignored"; saveGalleryChat(); renderSocialHub(); } return; }
    const reviewButton = event.target.closest("[data-review-id]");
    if (reviewButton) { openReview(reviewButton.dataset.reviewId); return; }
    const roomButton = event.target.closest("[data-room-id]");
    if (roomButton) { openChatRoom(roomButton.dataset.roomId); return; }
    const teamPanel = event.target.closest("[data-team-panel]");
    if (teamPanel) { openTeamPanel(teamPanel.dataset.teamPanel); return; }
    if (event.target.closest("[data-team-panel-close]")) { closeTeamPanel(); return; }
    const challengeButton = event.target.closest("[data-challenge-id]");
    if (challengeButton) { startChallenge(challengeButton.dataset.challengeId); return; }
    const blindRole = event.target.closest("[data-blind-role-choice]")?.dataset.blindRoleChoice;
    if (blindRole) { chooseBlindRole(blindRole); return; }
    const blindChallenge = event.target.closest("[data-blind-challenge]");
    if (blindChallenge) { startBlindChallenge(blindChallenge.dataset.blindChallenge); return; }
    const routeButton = event.target.closest("[data-route]");
    if (routeButton) { if (state.currentScreen === SCREENS.CREATOR_PERSPECTIVE) captureCreatorDetails(); if (state.currentScreen === SCREENS.CREATOR_REVIEW) captureCreatorClue(); if (state.currentScreen?.startsWith("creator-")) saveCreatorDraft(); if (routeButton.dataset.route === "teams") state.matchingChallengeId = null; openDestination(routeButton.dataset.route); return; }
    if (event.target.closest('[data-action="back"]')) {
      if (state.currentScreen === SCREENS.CREATOR_PERSPECTIVE) captureCreatorDetails();
      if (state.currentScreen === SCREENS.CREATOR_REVIEW) captureCreatorClue();
      if (state.currentScreen?.startsWith("creator-")) saveCreatorDraft();
      const previous = navigation.back();
      state.currentScreen = previous.screen;
      if (previous.screen === SCREENS.DESTINATION) openDestination(previous.route, false);
      return;
    }
    const removeMember = event.target.closest("[data-remove-member]");
    if (removeMember) {
      const departingId = removeMember.dataset.removeMember;
      state.team.members = state.team.members.filter((member) => member.id !== departingId);
      if (state.team.proposal?.memberId === departingId) state.team.proposal = null;
      else if (state.team.proposal) state.team.proposal.approvals = state.team.proposal.approvals.filter((id) => id !== departingId);
      if (departingId === LOCAL_USER_ID) state.team.closed = true;
      saveTeam(); syncTeamRoom();
      if (state.currentScreen === SCREENS.TEAM_GAME) { closeTeamPanel(); renderTeamPlay(); } else renderTeamLobby();
      return;
    }
    if (event.target.closest("[data-team-agree]")) { const actor = selectedTeamActor(); if (actor) approveProposal(actor.id); return; }
    if (event.target.closest("[data-team-disagree]")) { const actor = selectedTeamActor(); if (actor && state.team.proposal && actor.id !== state.team.proposal.memberId) rejectProposal(); return; }
    const shareClue = event.target.closest("[data-share-team-clue]");
    if (shareClue) { shareTeamClue(Number(shareClue.dataset.shareTeamClue)); return; }
    const flipClue = event.target.closest("[data-flip-team-clue]");
    if (flipClue) { flipTeamClue(flipClue.dataset.flipTeamClue); return; }
    if (event.target.closest("[data-team-cancel]")) { cancelProposal(); return; }
    const nextMember = event.target.closest("[data-team-next-accept]");
    if (nextMember) { acceptTeamContinuation(nextMember.dataset.teamNextAccept); return; }
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "demo-login") {
      state.signedIn = true;
      writeJson(STORAGE_KEYS.session, { signedIn: true, userId: LOCAL_USER_ID });
      navigation.reset(SCREENS.START, { route: "start", tab: "start" });
      state.currentScreen = SCREENS.START;
      document.querySelector(".bottom-nav").hidden = false;
      return;
    }
    if (action === "logout") {
      state.signedIn = false;
      writeJson(STORAGE_KEYS.session, { signedIn: false, userId: LOCAL_USER_ID });
      navigation.reset(SCREENS.LOGIN, { route: "start", tab: "start" });
      state.currentScreen = SCREENS.LOGIN;
      document.querySelector(".bottom-nav").hidden = true;
      return;
    }
    if (action === "resume-team") {
      const challenge = state.database?.challenges.find((item) => item.id === state.team.challengeId);
      if (!challenge) { showToast("The saved challenge is unavailable."); return; }
      state.mode = "team"; state.challenge = challenge; state.attemptsUsed = state.team.attemptsUsed || 0;
      if (state.team.completed) { renderResult(state.team.completed.success); showScreen(SCREENS.RESULT); }
      else if (!state.team.started) { renderTeamLobby(); showScreen(SCREENS.TEAM_WAITING); }
      else { renderTeamPlay(); showScreen(SCREENS.TEAM_GAME); }
      return;
    }
    if (action === "preview-submission") { creatorPreview(); return; }
    if (action === "creator-new") { beginNewCreator(); return; }
    if (action === "creator-resume") { renderCreatorStep(state.creator.step || 1); return; }
    if (action === "creator-save") { if (state.currentScreen === SCREENS.CREATOR_PERSPECTIVE) captureCreatorDetails(); if (state.currentScreen === SCREENS.CREATOR_REVIEW) captureCreatorClue(); if (saveCreatorDraft()) showToast("Draft saved on this device."); return; }
    if (action === "creator-clue-next") { advanceCreatorClue(); return; }
    if (action === "creator-clue-back") { captureCreatorClue(); if (state.creator.clueIndex > 0) { state.creator.clueIndex -= 1; saveCreatorDraft(); renderCreatorClues(); } else renderCreatorStep(4); return; }
    if (action === "creator-submit") { submitCreator(); return; }
    if (action === "view-last-submission") { if (lastSubmittedId) { renderSubmissionStatus(lastSubmittedId); showScreen(SCREENS.CREATOR_STATUS, true, "leave"); } return; }
    if (action === "invite-team-friend") { openFriends(); showToast("Choose an accepted friend and send a local game invitation."); return; }
    if (action === "open-solo-help") { showScreen(SCREENS.SOLO_HELP); return; }
    if (action === "open-friends") { openFriends(); return; }
    if (action === "find-players") { openPlayerDirectory(); return; }
    if (action === "open-groups") { renderGroups(); showScreen(SCREENS.GROUPS); return; }
    if (action === "create-group") { openGroupCreate(); return; }
    if (action === "leave-group") { const index = state.galleryChat.social.groups.findIndex((item) => item.id === state.selectedGroupId); if (index >= 0) state.galleryChat.social.groups.splice(index, 1); saveGalleryChat(); renderGroups(); showScreen(SCREENS.GROUPS); return; }
    if (action === "edit-profile") { const form = document.querySelector("#profile-edit-form"); form.elements.nickname.value = state.profile.nickname; form.elements.bio.value = state.profile.bio; form.querySelectorAll('[name="interest"]').forEach((input) => { input.checked = state.profile.interests.includes(input.value); }); showScreen(SCREENS.PROFILE_EDIT); return; }
    if (action === "blind-add-friend") {
      if (!state.blind.partnerId) return;
      const existing = state.galleryChat.social.blindRequests.find((item) => item.sessionId === state.blind.sessionId);
      if (existing) { showToast(existing.status === "Accepted" ? "You are already friends." : `Anonymous request ${existing.status.toLowerCase()}.`); return; }
      state.galleryChat.social.blindRequests.push({ id: `blind-friend-${Date.now()}`, sessionId: state.blind.sessionId, partnerId: state.blind.partnerId, status: "Pending" }); saveGalleryChat();
      const requestUi = 'Anonymous friend request sent. <button class="text-button" data-blind-friend-decision="Accepted">Simulate Accept</button> <button class="text-button" data-blind-friend-decision="Declined">Decline</button> <button class="text-button" data-blind-friend-decision="Ignored">Ignore</button>';
      if (state.currentScreen === SCREENS.RESULT) document.querySelector("#result-invitation").innerHTML = requestUi;
      else document.querySelector("[data-blind-feedback]").innerHTML = requestUi;
      return;
    }
    if (action === "continue-playing") { continuePlaying(); return; }
    if (action === "explore-create-team") { createTeam(); return; }
    if (action === "explore-invite") { openFriends(); return; }
    if (action === "team-start") { startTeamGame(); return; }
    if (action === "result-reveal") { renderResult(Boolean(state.mode === "blind" ? state.blind.result?.success : state.mode === "team" ? state.team.completed?.success : state.soloSession?.success), true); return; }
    if (action === "back-to-browse") { if (state.mode === "blind") { rematchBlind(false); } else { state.mode = state.mode === "team" ? "team" : "solo"; showChallengeList(); } return; }
    if (action === "play-again") { state.mode === "team" ? createTeam() : showChallengeList(); return; }
    if (action === "team-continue") { prepareTeamContinuation(); return; }
    if (action === "team-next-select") { beginContinuedTeam(); return; }
    if (action === "blind-start-chat") { startBlindMatchedSession(); return; }
    if (action === "blind-open-guess" && state.blind.role === "guesser" && !state.blind.result) { document.querySelector("#blind-guess-dialog").showModal(); setTimeout(() => document.querySelector('#blind-answer-form input[name="answer"]')?.focus()); return; }
    if (action === "blind-close-guess") { document.querySelector("#blind-guess-dialog").close(); document.querySelector('[data-action="blind-open-guess"]')?.focus(); return; }
    if (action === "blind-feedback-continue") { document.querySelector("#blind-feedback-dialog").close(); document.querySelector('#blind-chat-form input[name="message"]')?.focus(); return; }
    if (action === "blind-expand-art" && state.blind.role === "describer") { const dialog = document.querySelector("#blind-art-dialog"), source = document.querySelector("[data-blind-artwork]"); document.querySelector("[data-blind-expanded-art]").src = source.src; dialog.showModal(); return; }
    if (action === "blind-close-art") { document.querySelector("#blind-art-dialog").close(); document.querySelector('[data-action="blind-expand-art"]')?.focus(); return; }
    if (action === "blind-return-chat") {
      state.mode = "blind";
      state.challenge = state.database.challenges.find((item) => item.id === state.blind.challengeId);
      if (!state.challenge) { showToast("This Blind Eyes session is no longer available."); return; }
      renderBlindPlay(); showScreen(SCREENS.BLIND_PLAY, true, "blind"); return;
    }
    if (action === "blind-new-partner") { const { role, stars } = state.blind; state.blind = freshBlindState(stars); state.blind.role = role; state.blind.partnerRole = role === "describer" ? "guesser" : "describer"; saveBlind(); showScreen(SCREENS.BLIND_PREFS); return; }
    if (action === "blind-change-tag") { const { role, stars } = state.blind; state.blind = freshBlindState(stars); state.blind.role = role; state.blind.partnerRole = role === "describer" ? "guesser" : "describer"; saveBlind(); showScreen(SCREENS.BLIND_PREFS); return; }
    if (action === "blind-rematch") { rematchBlind(false); return; }
    if (action === "blind-continue") { rematchBlind(true); return; }
    if (action === "blind-continue-accept") { state.blind.continueInvite = { status: "Accepted" }; saveBlind(); showScreen(SCREENS.BLIND_PREFS); return; }
    if (action === "blind-continue-decline" || action === "blind-continue-ignore") { state.blind.continueInvite = { status: action.endsWith("decline") ? "Declined" : "Ignored" }; saveBlind(); document.querySelector("#result-invitation").innerHTML = '<p class="small-note">The invitation was dismissed. You may leave or find another partner.</p>'; return; }
    if (action === "blind-leave" || action === "leave-result") { showScreen(SCREENS.START); return; }
    if (action === "start") {
      if (state.currentScreen === SCREENS.RESULT && state.mode === "blind") {
        const { role, stars } = state.blind;
        state.blind = freshBlindState(stars);
        if (role) {
          state.blind.role = role;
          state.blind.partnerRole = role === "describer" ? "guesser" : "describer";
        }
        saveBlind(); showScreen(role ? SCREENS.BLIND_PREFS : SCREENS.BLIND_ROLE);
      } else if (state.currentScreen === SCREENS.START && hasActiveChallenge()) continuePlaying();
      else showModeChoice();
    }
    if (action === "choose-solo") { state.mode = "solo"; showChallengeList(); }
    if (action === "choose-team") { state.mode = "team"; showScreen(SCREENS.LOBBY); }
    if (action === "switch-blind-role" && state.blind.demoMode) { const previousRole = state.blind.role; state.blind.role = state.blind.partnerRole; state.blind.partnerRole = previousRole; saveBlind(); renderBlindPlay(); }
    const profileDetail = event.target.closest("[data-profile-detail]");
    if (profileDetail) { renderProfileDetail(profileDetail.dataset.profileDetail); return; }
    const blindFriendDecision = event.target.closest("[data-blind-friend-decision]");
    if (blindFriendDecision) {
      const request = state.galleryChat.social.blindRequests.find((item) => item.sessionId === state.blind.sessionId && item.status === "Pending");
      if (!request) return; request.status = blindFriendDecision.dataset.blindFriendDecision;
      if (request.status === "Accepted" && !state.galleryChat.social.friends.includes(request.partnerId)) state.galleryChat.social.friends.push(request.partnerId);
      const message = request.status === "Accepted" ? `Friendship accepted. ${socialUser(request.partnerId)?.name || "Public profile"} is now visible in My Friends.` : `Friend request ${request.status.toLowerCase()}. The match remains anonymous.`;
      saveGalleryChat();
      if (state.currentScreen === SCREENS.RESULT) document.querySelector("#result-invitation").textContent = message;
      else document.querySelector("[data-blind-feedback]").textContent = message;
      return;
    }
  });
  document.querySelector("#team-member-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name") || "").trim();
    if (!name || state.team.members.length >= TEAM_LIMIT || state.team.started || state.team.membershipLocked) return;
    if (state.team.members.some((member) => member.name.toLowerCase() === name.toLowerCase())) { showToast("Team member names must be unique."); return; }
    const player = PUBLIC_PLAYERS.find((item) => item.name.toLowerCase() === name.toLowerCase());
    state.team.members.push({ id: player?.id || `member-${Date.now()}-${Math.random().toString(16).slice(2)}`, name: player?.name || name, stars: 0 });
    saveTeam(); syncTeamRoom(); event.currentTarget.reset(); renderTeamLobby();
  });
  document.querySelector("#team-open-toggle")?.addEventListener("change", (event) => setTeamRecruitment(event.currentTarget.checked));
  document.querySelector("[data-team-actor]")?.addEventListener("change", () => { const pending = Boolean(state.team.proposal); renderTeamPlay(); if (pending) openTeamPanel("agreement"); });
  document.querySelector("#clue-comment-form")?.addEventListener("submit", submitClueComment);
  document.querySelector("#answer-form")?.addEventListener("submit", submitAnswer);
  document.querySelector("#team-chat-form")?.addEventListener("submit", submitTeamChat);
  document.querySelector("#blind-answer-form")?.addEventListener("submit", submitBlindAnswer);
  document.querySelector("#blind-chat-form")?.addEventListener("submit", submitBlindChat);
  document.querySelector("#blind-preferences-form")?.addEventListener("submit", matchBlindPartner);
  document.querySelector("#blind-demo-mode")?.addEventListener("change", (event) => { state.blind.demoMode = event.currentTarget.checked; saveBlind(); renderBlindPlay(); });
  document.querySelector("#room-message-form")?.addEventListener("submit", submitRoomMessage);
  document.querySelector("#private-group-form")?.addEventListener("submit", createPrivateGroup);
  document.querySelector("#mock-checkin")?.addEventListener("change", (event) => {
    state.galleryChat.checkedIn = event.currentTarget.checked; saveGalleryChat();
    if (!state.galleryChat.checkedIn && state.galleryChat.currentRoomId === "public" && state.currentScreen === SCREENS.CHAT_ROOM) showToast("You left the simulated onsite area. Public posting is now disabled.");
  });
  document.querySelector("#player-search")?.addEventListener("input", (event) => renderPlayerDirectory(event.currentTarget.value));
  document.querySelector("#group-add-member-form")?.addEventListener("submit", (event) => { event.preventDefault(); const group = state.galleryChat.social.groups.find((item) => item.id === state.selectedGroupId), userId = String(new FormData(event.currentTarget).get("userId") || ""); if (group && state.galleryChat.social.friends.includes(userId) && !group.memberIds.includes(userId)) { group.memberIds.push(userId); saveGalleryChat(); renderGroupMembers(group.id); } });
  document.querySelector("#profile-edit-form")?.addEventListener("submit", (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); state.profile = { ...state.profile, nickname: String(data.get("nickname") || "Museum Visitor").trim(), bio: String(data.get("bio") || "").trim(), interests: data.getAll("interest") }; saveProfile(); syncLocalIdentity(); renderMyProfile(false); showToast("Profile saved across Chat, Explore and Team."); });
  document.querySelector("#creator-full-first")?.addEventListener("change", async (event) => {
    const input = event.currentTarget, file = input.files[0]; if (file) await acceptCreatorImage(file, "full"); input.value = "";
  });
  document.querySelector("#creator-details-form")?.addEventListener("input", () => { captureCreatorDetails(); clearTimeout(creatorAutosaveTimer); creatorAutosaveTimer = setTimeout(saveCreatorDraft, 450); });
  document.querySelector("#creator-clues")?.addEventListener("input", () => { captureCreatorClue(); clearTimeout(creatorAutosaveTimer); creatorAutosaveTimer = setTimeout(saveCreatorDraft, 450); });
  document.querySelector("#auth-form")?.addEventListener("submit", submitAuth);
  const cropCanvas = document.querySelector("#crop-canvas"); let cropDrag = null;
  const cropPoint = (event) => { const rect = cropCanvas.getBoundingClientRect(); return { x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)) }; };
  cropCanvas?.addEventListener("pointerdown", (event) => {
    const point = cropPoint(event), crop = state.creator.crop, threshold = 18 / Math.max(cropCanvas.clientWidth, 1); let mode = "new", handle = null;
    if (crop) { const handles = { nw:[crop.x,crop.y], ne:[crop.x+crop.w,crop.y], sw:[crop.x,crop.y+crop.h], se:[crop.x+crop.w,crop.y+crop.h] }; handle = Object.entries(handles).find(([,p]) => Math.hypot(point.x-p[0],point.y-p[1]) < threshold)?.[0] || null; if (handle) mode = "resize"; else if (point.x >= crop.x && point.x <= crop.x+crop.w && point.y >= crop.y && point.y <= crop.y+crop.h) mode = "move"; }
    cropDrag = { start: point, original: crop ? { ...crop } : null, mode, handle }; cropCanvas.setPointerCapture(event.pointerId);
  });
  cropCanvas?.addEventListener("pointermove", (event) => {
    if (!cropDrag) return; const point = cropPoint(event), { start, original, mode, handle } = cropDrag;
    if (mode === "new") state.creator.crop = { x: Math.min(start.x,point.x), y: Math.min(start.y,point.y), w: Math.abs(point.x-start.x), h: Math.abs(point.y-start.y) };
    else if (mode === "move") state.creator.crop = { ...original, x: Math.max(0,Math.min(1-original.w,original.x+point.x-start.x)), y: Math.max(0,Math.min(1-original.h,original.y+point.y-start.y)) };
    else { const right = original.x+original.w, bottom=original.y+original.h, left = handle.includes("w") ? point.x : original.x, top = handle.includes("n") ? point.y : original.y, nextRight = handle.includes("e") ? point.x : right, nextBottom = handle.includes("s") ? point.y : bottom; state.creator.crop = { x: Math.min(left,nextRight), y: Math.min(top,nextBottom), w: Math.abs(nextRight-left), h: Math.abs(nextBottom-top) }; }
    drawCrop();
  });
  cropCanvas?.addEventListener("pointerup", async () => { cropDrag = null; if (!state.creator.crop || state.creator.crop.w * state.creator.crop.h < .0001) { state.creator.crop = null; document.querySelector("#crop-feedback").textContent = "Select a larger, non-zero rectangle."; drawCrop(); return; } await updateCropResult(); saveCreatorDraft(); });
  window.addEventListener("resize", drawCrop);
  document.addEventListener("submit", (event) => {
    if (event.target.id === "review-form") submitReview(event);
    if (event.target.id === "team-comment-form") submitTeamComment(event);
    if (event.target.id === "team-proposal-form") submitProposal(event);
  });
}

async function init() {
  const developmentToolsEnabled = localStorage.getItem("borrowedEyesDevelopmentMode") === "true";
  const demoTools = document.querySelector(".demo-tools");
  if (demoTools) demoTools.hidden = !developmentToolsEnabled;
  const teamActorTools = document.querySelector(".team-simulation-control");
  if (teamActorTools) teamActorTools.hidden = !developmentToolsEnabled;
  document.querySelectorAll('.screen:not([data-screen="start"]) .screen__content').forEach((content) => {
    if (content.querySelector(":scope > .back-button")) return;
    const back = document.createElement("button");
    back.type = "button";
    back.className = "back-button";
    back.dataset.action = "back";
    back.textContent = "← Back";
    content.prepend(back);
  });
  setupEvents();
  state.team = readTeam();
  state.openTeams = readOpenTeams();
  state.blind = readBlind();
  if (!developmentToolsEnabled) state.blind.demoMode = false;
  state.galleryChat = readGalleryChat();
  state.profile = readProfile();
  state.submissions = readSubmissions();
  state.creator = readCreatorDraft();
  state.signedIn = readJson(STORAGE_KEYS.session, {}).signedIn === true;
  registerSocialProfiles(); saveGalleryChat(); syncLocalIdentity();
  navigation.reset(state.signedIn ? SCREENS.START : SCREENS.LOGIN, { route: "start", tab: "start" });
  state.currentScreen = state.signedIn ? SCREENS.START : SCREENS.LOGIN;
  document.querySelector(".bottom-nav").hidden = !state.signedIn;
  try {
    state.database = await loadArtworkDatabase(); syncApprovedSubmissions(); seedOpenTeams(); restoreSolo();
    if (state.blind.challengeId) { const index = state.database.challenges.findIndex((item) => item.id === state.blind.challengeId); if (index >= 0) { const challenge = state.database.challenges[index]; if (!state.blind.partnerId) state.blind.partnerId = PUBLIC_PLAYERS[index % PUBLIC_PLAYERS.length].id; state.blind.describerId ||= state.blind.role === "describer" ? LOCAL_USER_ID : state.blind.partnerId; state.blind.guesserId ||= state.blind.role === "guesser" ? LOCAL_USER_ID : state.blind.partnerId; if (!state.blind.result?.success) state.blind.cluesUnlocked = normaliseBlindClueProgress(state.blind, challenge.clues.length); saveBlind(); } }
    const teamChallenge = state.database.challenges.find((item) => item.id === state.team.challengeId);
    if (teamChallenge) state.team.cluesUnlocked = Math.min(Object.keys(state.team.comments || {}).length, teamChallenge.stars);
    saveTeam(); saveOpenTeams();
  }
  catch (error) { console.error(error); showToast("The artwork database could not be loaded. Use a local web server and try again."); }
}

init();
