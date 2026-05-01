export type EventType = 'STAY' | 'ACTIVITY' | 'TRAVEL' | 'CHECK_IN' | 'CHECK_OUT';

export interface ItineraryEvent {
  id: string;
  tripId: string;
  type: EventType;
  title: string;
  startTime: string; // ISO 8601
  endTime?: string;  // Required for STAY
  locationName?: string;
  coords?: [number, number];
  bookingLink?: string;
  notes?: string;
  isLocked?: boolean;
}

export interface Trip {
  id: string;
  ownerId: string;
  name: string;
  visibility: 'private' | 'public';
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  tripId: string;
  userId: string;
  role: 'editor' | 'viewer';
  joinedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  provider: 'google' | 'apple';
  createdAt: string;
}

export interface BaseGroup {
  stay: ItineraryEvent;
  items: ItineraryEvent[];
}
