import { db } from './src/db';
import { users, trips, itineraryEvents } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('Seeding Milestone 6 Demo...');

  // 1. Get the Demo User
  const [user] = await db.select().from(users).where(eq(users.email, 'demo@example.com'));
  if (!user) {
    console.error('Demo user not found. Please run seed-demo.ts first.');
    return;
  }

  // 2. Create the Trip
  const [trip] = await db
    .insert(trips)
    .values({
      ownerId: user.id,
      name: 'Scandinavian Expedition',
      startDate: new Date('2026-06-01T00:00:00Z'),
      endDate: new Date('2026-06-10T00:00:00Z'),
      visibility: 'public',
    })
    .returning();

  console.log(`Created Trip: ${trip!.name} (${trip!.id})`);

  // 3. Add STAY 1 (Oslo - 3 Nights)
  await db.insert(itineraryEvents).values({
    tripId: trip!.id,
    type: 'STAY',
    title: 'Grand Hotel Oslo',
    locationName: 'Oslo, Norway',
    startTime: new Date('2026-06-01T15:00:00Z'),
    endTime: new Date('2026-06-04T11:00:00Z'),
  });

  // 4. Add Nested Activities for STAY 1
  await db.insert(itineraryEvents).values([
    {
      tripId: trip!.id,
      type: 'ACTIVITY',
      title: 'Viking Ship Museum',
      locationName: 'Bygdøy',
      startTime: new Date('2026-06-02T10:00:00Z'),
    },
    {
      tripId: trip!.id,
      type: 'ACTIVITY',
      title: 'Nordic Dinner',
      locationName: 'City Center',
      startTime: new Date('2026-06-02T19:00:00Z'),
    },
    {
      tripId: trip!.id,
      type: 'ACTIVITY',
      title: 'Oslo Fjord Sauna',
      locationName: 'Aker Brygge',
      startTime: new Date('2026-06-03T14:00:00Z'),
    },
  ]);

  // 5. Add STAY 2 (Bergen - After a 2 Day GAP)
  await db.insert(itineraryEvents).values({
    tripId: trip!.id,
    type: 'STAY',
    title: 'Bergen Waterfront Lodge',
    locationName: 'Bergen, Norway',
    startTime: new Date('2026-06-07T15:00:00Z'),
    endTime: new Date('2026-06-09T11:00:00Z'),
  });

  await db.insert(itineraryEvents).values({
    tripId: trip!.id,
    type: 'ACTIVITY',
    title: 'Floibanen Funicular',
    locationName: 'Mount Floyen',
    startTime: new Date('2026-06-08T09:00:00Z'),
  });

  console.log('Seeding complete! Check your dashboard.');
}

seed().catch(console.error);
