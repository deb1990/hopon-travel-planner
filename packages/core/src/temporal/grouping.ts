import { ItineraryEvent, BaseGroup } from '../types';

/**
 * Groups flat itinerary events into Base Groups.
 * An event is associated with a 'STAY' if its start time falls between 
 * the stay's start and the beginning of the next stay in the timeline.
 * 
 * @param events - The flat list of itinerary events to group.
 * @returns An array of BaseGroups containing each stay and its associated items.
 */
export function groupEventsByBase(events: ItineraryEvent[]): BaseGroup[] {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const stays = sortedEvents.filter(e => e.type === 'STAY');
  
  return stays.map((stay, index) => {
    const nextStay = stays[index + 1];
    
    // An item belongs to this stay if it starts AFTER this stay begins
    // AND BEFORE the next stay begins.
    const items = sortedEvents.filter(e => {
      if (e.id === stay.id || e.type === 'STAY') return false;
      
      const eventTime = new Date(e.startTime).getTime();
      const stayStartTime = new Date(stay.startTime).getTime();
      
      if (nextStay) {
        const nextStayStartTime = new Date(nextStay.startTime).getTime();
        return eventTime >= stayStartTime && eventTime < nextStayStartTime;
      }
      
      return eventTime >= stayStartTime;
    });

    return {
      stay,
      items
    };
  });
}
