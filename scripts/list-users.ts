/**
 * List all users in the database
 * Run with: npx tsx scripts/list-users.ts
 */
import "dotenv/config";
import { db } from "../src/lib/db";
import { user } from "../src/lib/schema";

async function listUsers() {
  const users = await db.select().from(user);
  console.log("Users in database:");
  users.forEach((u) => {
    console.log(`- ${u.email} (role: ${u.role || "user"})`);
  });
}

listUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
