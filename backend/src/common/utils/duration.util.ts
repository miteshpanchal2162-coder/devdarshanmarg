const DURATION_PATTERN = /^(\d+)([dhms])$/;

const MULTIPLIERS = {
  d: 24 * 60 * 60 * 1000,
  h: 60 * 60 * 1000,
  m: 60 * 1000,
  s: 1000,
} as const;

export function addDurationToNow(value: string, fallback = "5m") {
  const normalized = DURATION_PATTERN.test(value) ? value : fallback;
  const match = normalized.match(DURATION_PATTERN);
  const amount = match ? Number(match[1]) : 5;
  const unit = (match?.[2] ?? "m") as keyof typeof MULTIPLIERS;

  return new Date(Date.now() + amount * MULTIPLIERS[unit]);
}
