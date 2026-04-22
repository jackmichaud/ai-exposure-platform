export function formatScore(n: number): string {
  return Math.round(n).toString();
}

export function formatWage(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatWageShort(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${n}`;
}

export function getTextColor(score: number): string {
  return score < 38 || score > 62 ? '#FFFFFF' : '#1E293B';
}

// For net displacement (-100 to +100): light zone is near 0
export function getNdTextColor(nd: number): string {
  return nd < -40 || nd > 40 ? '#FFFFFF' : '#1E293B';
}
