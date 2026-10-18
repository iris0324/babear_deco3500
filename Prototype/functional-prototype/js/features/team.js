export const TEAM_LIMIT = 5;

export function borrowAttemptLimit(stars, teamSize = 1) {
  return Number(stars) + 1 - Number(teamSize);
}

export function blindAttemptLimit(stars) {
  return Number(stars) + 1;
}

export function uniqueTeamMembers(members = []) {
  const seen = new Set();
  return members.filter((member) => member?.id && !seen.has(member.id) && seen.add(member.id));
}

export function isTeamFinished(team = {}) {
  return Boolean(team.completed || team.closed);
}

export function canJoinTeam(team = {}, userId) {
  const members = uniqueTeamMembers(team.members);
  if (members.some((member) => member.id === userId)) return { allowed: false, resume: true, reason: "Already a member" };
  if (!team.openToPlayers) return { allowed: false, reason: "Recruitment is closed" };
  if (team.started || team.membershipLocked) return { allowed: false, reason: "This team has already started" };
  if (isTeamFinished(team)) return { allowed: false, reason: "This team is no longer active" };
  if (members.length >= TEAM_LIMIT) return { allowed: false, reason: "This team is full" };
  return { allowed: true, reason: "Waiting for players" };
}

export function canStartTeam(team = {}) {
  const count = uniqueTeamMembers(team.members).length;
  return Boolean(team.challengeId && !team.started && !isTeamFinished(team) && count >= 2 && count <= TEAM_LIMIT);
}

export function canSubmitTeam(team = {}, challenge) {
  const count = uniqueTeamMembers(team.members).length;
  const limit = challenge ? borrowAttemptLimit(challenge.stars, count) : 0;
  return Boolean(team.started && team.membershipLocked && !isTeamFinished(team) && count >= 2 && challenge && limit > 0 && (team.attemptsUsed || 0) < limit);
}
