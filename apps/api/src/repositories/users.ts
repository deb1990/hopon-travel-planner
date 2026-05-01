import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { users } from '../db/schema';

/**
 * Repository for managing Users.
 */
export class UserRepository {
  constructor(private db: PostgresJsDatabase<typeof schema>) {}

  /**
   * Creates or updates a user (for social login flow).
   */
  async upsert(data: typeof users.$inferInsert) {
    const [result] = await this.db
      .insert(users)
      .values(data)
      .onConflictDoUpdate({
        target: users.email,
        set: {
          name: data.name,
          avatarUrl: data.avatarUrl,
        },
      })
      .returning();

    if (!result) throw new Error('Failed to upsert user');
    return result;
  }

  /**
   * Finds a user by email.
   */
  async findByEmail(email: string) {
    const [user] = await this.db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  /**
   * Finds a user by ID.
   */
  async findById(id: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user || null;
  }
}
