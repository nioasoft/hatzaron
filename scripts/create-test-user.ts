/**
 * Create a test user for impersonation testing
 * Run with: npx tsx scripts/create-test-user.ts
 */
import "dotenv/config";
import { db } from "../src/lib/db";
import { user, account } from "../src/lib/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

async function createTestUser() {
  const testEmail = "test-firm@example.com";
  const testName = "משרד רואי חשבון לדוגמה";

  console.log(`🔍 Checking if test user exists: ${testEmail}`);

  const existingUsers = await db
    .select()
    .from(user)
    .where(eq(user.email, testEmail))
    .limit(1);

  const existingUser = existingUsers[0];
  if (existingUser) {
    console.log(`✅ Test user already exists: ${testEmail}`);
    console.log(`   User ID: ${existingUser.id}`);
    return;
  }

  const userId = randomUUID();
  const accountId = randomUUID();

  console.log(`📝 Creating test user: ${testEmail}`);

  await db.insert(user).values({
    id: userId,
    name: testName,
    email: testEmail,
    emailVerified: true,
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Create a credential account (no password needed for impersonation testing)
  await db.insert(account).values({
    id: accountId,
    accountId: userId,
    providerId: "credential",
    userId: userId,
    password: "not-used-for-impersonation",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log(`✅ Test user created successfully`);
  console.log(`   Name: ${testName}`);
  console.log(`   Email: ${testEmail}`);
  console.log(`   User ID: ${userId}`);
}

createTestUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
