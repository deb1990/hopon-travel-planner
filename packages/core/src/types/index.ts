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

interface BaseEvent {
  id: string;
  tripId: string;
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

export interface TravelEvent extends BaseEvent {
  type: 'TRAVEL';
}

export interface CheckInOutEvent extends BaseEvent {
  type: 'CHECK_IN' | 'CHECK_OUT';
}

export type ItineraryEvent = StayEvent | ActivityEvent | TravelEvent | CheckInOutEvent;

/**
 * Represents a single calendar day in the itinerary.
 */
export interface DayGroup {
  date: string; // ISO Date at 00:00:00
  items: ItineraryEvent[];
  activeStays: StayEvent[];
}

// Deprecated - will be removed after refactor
export interface BaseGroup {
  stay: StayEvent;
  items: ItineraryEvent[];
}
