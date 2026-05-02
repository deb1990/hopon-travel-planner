/**
 * Calculates a new ISO startTime for an event dropped onto a target date.
 *
 * @param targetDateISO - The calendar date where the item was dropped.
 * @param prevTimeISO - Optional: Time of the item immediately preceding the drop.
 * @param nextTimeISO - Optional: Time of the item immediately following the drop.
 * @returns A new ISO string representing the balanced drop time.
 */
export function calculateDroppedTime(
  targetDateISO: string,
  prevTimeISO?: string,
  nextTimeISO?: string,
): string {
  const target = new Date(targetDateISO);

  // Case 1: Dropped between two items
  if (prevTimeISO && nextTimeISO) {
    const prev = new Date(prevTimeISO).getTime();
    const next = new Date(nextTimeISO).getTime();
    return new Date(prev + (next - prev) / 2).toISOString();
  }

  // Case 2: Dropped after an item
  if (prevTimeISO) {
    const prev = new Date(prevTimeISO).getTime();
    return new Date(prev + 30 * 60 * 1000).toISOString(); // Default 30 min after
  }

  // Case 3: Dropped before an item
  if (nextTimeISO) {
    const next = new Date(nextTimeISO).getTime();
    return new Date(next - 30 * 60 * 1000).toISOString(); // Default 30 min before
  }

  // Case 4: Blank day drop - Default to 09:00 AM on that target date
  const defaultTime = new Date(target);
  defaultTime.setUTCHours(9, 0, 0, 0);
  return defaultTime.toISOString();
}
