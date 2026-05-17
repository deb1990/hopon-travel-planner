export interface Trip {
  id: string;
  ownerId: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  visibility: 'private' | 'public';
  createdAt: string;
  updatedAt: string;
  events?: ItineraryEvent[];
}

export type AccommodationType = 'Hotel' | 'AirBNB' | 'Camping' | 'Other';

export type TransitMode = 'Flight' | 'Drive' | 'Walk' | 'Boat' | 'Train' | 'Bus';

interface BaseEvent {
  id: string;
  tripId: string;
  parentStayId?: string | null;
  title: string;
  startTime: string;
  endTime?: string | null;
  locationName?: string | null;
  plusCode?: string | null;
  lat?: number | null;
  lng?: number | null;
  routePolyline?: string | null;
  travelTimeMinutes?: number | null;
  notes?: string | null;
  isLocked: boolean;
}

export interface StayEvent extends BaseEvent {
  type: 'STAY';
  accommodationType?: AccommodationType | null;
  bookingLink?: string | null;
}

export interface ActivityEvent extends BaseEvent {
  type: 'ACTIVITY';
}

export interface TransitEvent extends BaseEvent {
  type: 'TRANSIT';
  transitMode: TransitMode;
}

export interface CheckInOutEvent extends BaseEvent {
  type: 'CHECK_IN' | 'CHECK_OUT';
}

export type ItineraryEvent = StayEvent | ActivityEvent | TransitEvent | CheckInOutEvent;

/**
 * Represents a single calendar day in the itinerary.
 */
export interface DayGroup {
  date: string;
  items: ItineraryEvent[];
  activeStays: StayEvent[];
}

export interface BaseGroup {
  stay: StayEvent;
  items: ItineraryEvent[];
}
