/**
 * Calculates the inclusive number of days between two ISO dates.
 * Uses UTC normalization to ensure consistent day counting across timezones.
 *
 * @param start - ISO start date string.
 * @param end - ISO end date string.
 * @returns Number of days (minimum 1).
 */
export function calculateTripDuration(start?: string, end?: string): number {
  if (!start || !end) return 1;

  // Normalize both to UTC Date objects at 00:00:00
  const s = new Date(start);
  const e = new Date(end);

  const startUtc = Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate());
  const endUtc = Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate());

  const diffMs = endUtc - startUtc;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

  return Math.max(1, days);
}
