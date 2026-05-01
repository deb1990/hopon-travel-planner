import { describe, it, expect, afterAll } from 'vitest';
import { db } from '../db';
import { users } from '../db/schema';
import { UserRepository } from './users';
import { eq } from 'drizzle-orm';

describe('UserRepository', () => {
  const testEmail = `user_${Date.now()}@test.com`;
  let createdUserId: string;

  afterAll(async () => {
    await db.delete(users).where(eq(users.id, createdUserId));
  });

  it('should create and find a user by email', async () => {
    const repo = new UserRepository(db);

    const user = await repo.upsert({
      email: testEmail,
      provider: 'google',
      name: 'Test User',
    });

    createdUserId = user.id;
    expect(user.email).toBe(testEmail);

    const found = await repo.findByEmail(testEmail);
    expect(found?.id).toBe(user.id);
  });
});
