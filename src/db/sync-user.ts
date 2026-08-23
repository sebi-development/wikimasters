import db from "@/db/index";
import { usersSync } from "@/db/schema";

export type StackUserPayload = {
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
};

/**
 * Ensures the Stack Auth user exists in our local PostgreSQL database.
 * Call this before creating/updating articles to satisfy the Foreign Key constraint.
 */
export async function ensureUserExists(stackUser: StackUserPayload): Promise<void> {
  await db
    .insert(usersSync)
    .values({
      id: stackUser.id,
      name: stackUser.displayName,
      email: stackUser.primaryEmail,
    })
    .onConflictDoUpdate({
      target: usersSync.id,
      set: {
        name: stackUser.displayName,
        email: stackUser.primaryEmail,
      },
    });
}