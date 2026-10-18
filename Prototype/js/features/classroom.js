export function stationCode(value) {
  const text = String(value || '').trim().toUpperCase();
  const match = /^(?:BE)?(\d{1,2})$/.exec(text);
  return match && Number(match[1]) >= 1 && Number(match[1]) <= 18 ? `BE${match[1].padStart(2, '0')}` : null;
}
export function stationFromInput(value, pageUrl) {
  const direct = stationCode(value);
  if (direct) return direct;
  try {
    const url = new URL(value), page = new URL(pageUrl);
    if (url.origin !== page.origin || url.pathname !== page.pathname) return null;
    return stationCode(url.searchParams.get('station'));
  } catch { return null; }
}
export function validateClassroom(config, artworks) {
  if (!Array.isArray(config?.stations) || config.stations.length !== 18) throw new Error('18 classroom stations required');
  const ids = new Set(), assigned = new Set();
  for (const s of config.stations) {
    if (stationCode(s.id) !== s.id || ids.has(s.id) || !['A','B','C','D'].includes(s.wall) || !Number.isInteger(s.slot) || s.slot < 1 || s.slot > 6) throw new Error('Invalid classroom station');
    if (!s.artworkId || !artworks.has(s.artworkId)) throw new Error('Unknown classroom artwork');
    if (assigned.has(s.artworkId)) throw new Error('Duplicate classroom artwork');
    assigned.add(s.artworkId); ids.add(s.id);
  }
  for (const wall of ['A','B','C','D']) {
    const slots = config.stations.filter(s => s.wall === wall).map(s => s.slot);
    const expected = ['A','C'].includes(wall) ? 5 : 4;
    if (slots.length !== expected || new Set(slots).size !== expected || slots.some(slot => slot > expected)) throw new Error('Invalid wall slots');
  }
  return config;
}
export function stationPosition(station) {
  const count = ['A','C'].includes(station.wall) ? 5 : 4;
  const along = 18 + (station.slot - 1) * 64 / (count - 1);
  const vertical = 22 + (station.slot - 1) * 56 / (count - 1);
  return { A:[along,8], B:[94,vertical], C:[100-along,92], D:[6,100-vertical] }[station.wall];
}
