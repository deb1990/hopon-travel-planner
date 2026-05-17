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
  lat?: number | null;
  lng?: number | null;
  routePolyline?: string | null; // For spatial paths
  travelTimeMinutes?: number | null; // From previous item
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

export interface BaseGroup {
  stay: StayEvent;
  items: ItineraryEvent[];
}
