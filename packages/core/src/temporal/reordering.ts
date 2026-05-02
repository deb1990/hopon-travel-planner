import { ItineraryEvent } from '../types';

/**
 * Reorders the entire timeline by moving an active event to a target event's position,
 * and pushing everything after it forward to make room (The Cascade).
 */
export function reorderTimeline(
  events: ItineraryEvent[],
  activeId: string,
  overId: string,
): ItineraryEvent[] {
  // 1. Initial Sort
  const sorted = [...events].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );

  const activeIndex = sorted.findIndex((e) => e.id === activeId);
  const overIndex = sorted.findIndex((e) => e.id === overId);

  if (activeIndex === -1 || overIndex === -1 || activeId === overId) return sorted;

  const active = sorted[activeIndex]!;
  const over = sorted[overIndex]!;

  const activeDuration =
    (active.endTime
      ? new Date(active.endTime).getTime()
      : new Date(active.startTime).getTime() + 60 * 60 * 1000) -
    new Date(active.startTime).getTime();
  const targetStart = new Date(over.startTime).getTime();

  // 2. Reposition the active item
  const updatedActive = {
    ...active,
    startTime: new Date(targetStart).toISOString(),
    endTime: active.endTime ? new Date(targetStart + activeDuration).toISOString() : undefined,
  };

  // Create working list without the active item
  const resultWithoutActive = sorted.filter((e) => e.id !== activeId);

  // Re-insert active item at the target position
  const newOverIndex = resultWithoutActive.findIndex((e) => e.id === overId);
  resultWithoutActive.splice(newOverIndex, 0, updatedActive);

  // 3. Resolve Overlaps (Push Forward Cascade)
  // We iterate through every item starting from the one we just inserted
  for (let i = newOverIndex + 1; i < resultWithoutActive.length; i++) {
    const prev = resultWithoutActive[i - 1]!;
    const current = resultWithoutActive[i]!;

    const prevEnd = prev.endTime
      ? new Date(prev.endTime).getTime()
      : new Date(prev.startTime).getTime() + 60 * 60 * 1000;
    const currentStart = new Date(current.startTime).getTime();

    if (currentStart < prevEnd) {
      const duration =
        (current.endTime ? new Date(current.endTime).getTime() : currentStart + 60 * 60 * 1000) -
        currentStart;
      const newStart = prevEnd;
      const newEnd = newStart + duration;

      resultWithoutActive[i] = {
        ...current,
        startTime: new Date(newStart).toISOString(),
        endTime: current.endTime ? new Date(newEnd).toISOString() : undefined,
      };
    } else {
      // No more overlaps, the ripple is finished
      break;
    }
  }

  return resultWithoutActive;
}

export function calculateDroppedTime(targetDateISO: string): string {
  const target = new Date(targetDateISO);
  target.setUTCHours(9, 0, 0, 0);
  return target.toISOString();
}
