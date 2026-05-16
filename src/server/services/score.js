export function normalizeScore(value, fallback = 0) {
  const raw = typeof value === "number" ? value : fallback;
  if (Number.isNaN(raw)) return 0;
  const clamped = Math.max(0, Math.min(850, raw));
  return Math.round(clamped);
}
