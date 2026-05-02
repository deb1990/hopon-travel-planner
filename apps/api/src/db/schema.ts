import {
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
  boolean,
  doublePrecision,
} from 'drizzle-orm/pg-core';

export const visibilityEnum = pgEnum('visibility', ['private', 'public']);
export const roleEnum = pgEnum('role', ['editor', 'viewer']);
export const eventTypeEnum = pgEnum('event_type', [
  'STAY',
  'ACTIVITY',
  'TRAVEL',
  'CHECK_IN',
  'CHECK_OUT',
]);

export const accommodationTypeEnum = pgEnum('accommodation_type', [
  'Hotel',
  'AirBNB',
  'Camping',
  'Other',
]);

/**
 * Users table - Auth managed via Google/Apple
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  provider: text('provider', { enum: ['google', 'apple'] }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Trips table
 */
export const trips = pgTable('trips', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id')
    .references(() => users.id)
    .notNull(),
  name: text('name').notNull(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  visibility: visibilityEnum('visibility').default('private').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Permissions table for sharing private trips
 */
export const permissions = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id')
    .references(() => trips.id)
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  role: roleEnum('role').default('viewer').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

/**
 * Itinerary Events - The core temporal data
 */
export const itineraryEvents = pgTable('itinerary_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id')
    .references(() => trips.id)
    .notNull(),
  type: eventTypeEnum('type').notNull(),
  title: text('title').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  locationName: text('location_name'),
  lat: doublePrecision('lat'),
  lng: doublePrecision('lng'),
  bookingLink: text('booking_link'),
  accommodationType: accommodationTypeEnum('accommodation_type'),
  notes: text('notes'),
  isLocked: boolean('is_locked').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
