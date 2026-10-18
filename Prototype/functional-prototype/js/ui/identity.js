import { escapeHtml } from "./shared.js";

export function visitorAvatar(player, className = "visitor-avatar") {
  const portraits = ["maya", "jonah", "lina", "theo", "amara"];
  const hash = [...String(player?.id || "")].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const avatar = player?.avatar || (player?.id && player.id !== "local-user-you" ? `assets/ui/visitor-${portraits[hash % portraits.length]}.jpg` : null);
  if (avatar) return `<img class="${className}" src="${escapeHtml(avatar)}" alt="" loading="lazy">`;
  const initials = player?.initials || String(player?.name || "Visitor").split(/\s+/).map((part) => part[0]).join("").slice(0, 2);
  return `<span class="visitor-monogram ${className}" aria-hidden="true">${escapeHtml(initials)}</span>`;
}
