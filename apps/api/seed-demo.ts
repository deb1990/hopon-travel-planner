import { db } from './src/db';
import { users, trips, itineraryEvents } from './src/db/schema';

async function seed() {
  // Create user
  const [user] = await db
    .insert(users)
    .values({
      id: 'b07bb29b-67de-4f35-8c85-111c8358436b',
      email: 'demo@example.com',
      provider: 'google',
      name: 'Demo User',
    })
    .onConflictDoUpdate({
      target: users.id,
      set: { name: 'Demo User' },
    })
    .returning();

  const userId = user!.id;

  // Create trip
  const [trip] = await db
    .insert(trips)
    .values({
      ownerId: userId,
      name: 'Tokyo Adventure',
    })
    .returning();

  // Create event
  await db.insert(itineraryEvents).values({
    tripId: trip!.id,
    type: 'STAY',
    title: 'Park Hyatt Tokyo',
    startTime: new Date('2026-10-01T15:00:00Z'),
    endTime: new Date('2026-10-05T11:00:00Z'),
  });

  console.log('SEED COMPLETE');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
