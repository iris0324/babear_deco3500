export const PUBLIC_PLAYERS = Object.freeze([
  { id: "sim-user-maya", name: "Maya Chen", initials: "MC", avatar: "assets/ui/visitor-maya.jpg", interests: ["Portraits", "Colour"], bio: "I collect quiet details and changing light." },
  { id: "sim-user-jonah", name: "Jonah Reed", initials: "JR", avatar: "assets/ui/visitor-jonah.jpg", interests: ["Landscapes", "History"], bio: "Usually found near river scenes and old maps." },
  { id: "sim-user-lina", name: "Lina Park", initials: "LP", avatar: "assets/ui/visitor-lina.jpg", interests: ["Abstract", "Texture"], bio: "Looking for unusual surfaces and bold shapes." },
  { id: "sim-user-theo", name: "Theo Ellis", initials: "TE", avatar: "assets/ui/visitor-theo.jpg", interests: ["Historical", "Architecture"], bio: "Following the stories hidden in buildings and objects." },
  { id: "sim-user-amara", name: "Amara Silva", initials: "AS", avatar: "assets/ui/visitor-amara.jpg", interests: ["Portraits", "Historical"], bio: "I enjoy the stories that objects carry between generations." },
]);

export const CHAT_ROOMS = Object.freeze([
  { id: "public", category: "Museum Public Chat", title: "Museum Public Chat", participants: "Simulated visitors onsite", onsite: true, seed: ["The afternoon light in Gallery 3 is beautiful."] },
  { id: "artwork-gallery-3", category: "Artwork Conversations", title: "Gallery 3 · Looking closely", participants: "5 simulated visitors", onsite: false, seed: ["Has anyone noticed the tiny boat in the river scene?"] },
  { id: "artwork-portraits", category: "Artwork Conversations", title: "Portrait Room · Expressions", participants: "3 simulated visitors", onsite: false, seed: ["The pose feels formal, but the hands tell another story."] },
]);

export function stableDmId(firstId, secondId) { return `dm-${[firstId, secondId].sort().join("--")}`; }

export function migrateSocial(saved = {}) {
  saved ||= {};
  return {
    demoSeedVersion: saved.demoSeedVersion || 0,
    requests: Array.isArray(saved.requests) ? saved.requests.map((item) => ({ direction: item.direction || "incoming", ...item })) : [],
    friends: [...new Set(Array.isArray(saved.friends) ? saved.friends : [])],
    groups: Array.isArray(saved.groups) ? saved.groups.map((group) => ({ ...group, memberIds: [...new Set(group.memberIds || [])] })) : [],
    invitations: Array.isArray(saved.invitations) ? saved.invitations : [],
    blindRequests: Array.isArray(saved.blindRequests) ? saved.blindRequests : [],
    profiles: saved.profiles && typeof saved.profiles === "object" ? saved.profiles : {},
  };
}

export function requestFriend(social, userId, direction = "sent") {
  if (!userId || social.friends.includes(userId)) return { changed: false, status: "Friends" };
  const pending = social.requests.find((item) => item.userId === userId && item.status === "Pending");
  if (pending) return { changed: false, status: pending.direction === "incoming" ? "Respond to request" : "Request Sent" };
  social.requests.push({ id: `friend-${userId}-${Date.now()}`, userId, direction, status: "Pending", createdAt: new Date().toISOString() });
  return { changed: true, status: "Request Sent" };
}

export function resolveFriendRequest(social, requestId, decision) {
  const request = social.requests.find((item) => item.id === requestId);
  if (!request || request.status !== "Pending" || !["Accepted", "Declined", "Ignored"].includes(decision)) return false;
  request.status = decision;
  if (decision === "Accepted" && !social.friends.includes(request.userId)) social.friends.push(request.userId);
  return true;
}

export function createGroupRecord(name, memberIds, friendIds) {
  const eligible = [...new Set(memberIds)].filter((id) => friendIds.includes(id));
  if (!name.trim() || !eligible.length) return null;
  return { id: `group-${Date.now()}`, name: name.trim(), memberIds: eligible, createdAt: new Date().toISOString() };
}

// Only a genuinely absent chat store receives initial demo relationships.
// Existing empty friend lists are intentional and must never be repopulated.
export function createDemoSocial(localUserId) {
  const social = migrateSocial({ friends: ["sim-user-maya", "sim-user-jonah"], demoSeedVersion: 1 });
  const rooms = {};
  social.friends.forEach((id, index) => {
    const player = PUBLIC_PLAYERS.find((item) => item.id === id);
    rooms[stableDmId(localUserId, id)] = { unread: 1, messages: [
      { author: player.name, authorId: id, text: index ? "Would you like to compare notes on a landscape challenge?" : "Welcome to the museum! Shall we look closely at a challenge together?", time: "10:15" },
      { author: "You", authorId: localUserId, text: "Yes — I enjoy finding the details others miss.", time: "10:16" },
      { author: player.name, authorId: id, text: "Send me a local invitation whenever you are ready. This is a simulated conversation.", time: "10:18" },
    ] };
  });
  return { social, rooms };
}
