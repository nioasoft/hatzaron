/**
 * One-time script to set the super admin user role
 * Run with: npx tsx scripts/set-admin.ts
 */
import "dotenv/config";
import { db } from "../src/lib/db";
import { user } from "../src/lib/schema";
import { eq } from "drizzle-orm";

async function setAdminRole() {
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;

  if (!superAdminEmail) {
    console.error("❌ SUPER_ADMIN_EMAIL environment variable is not set");
    process.exit(1);
  }

  console.log(`🔍 Looking for user with email: ${superAdminEmail}`);

  const existingUsers = await db
    .select()
    .from(user)
    .where(eq(user.email, superAdminEmail))
    .limit(1);

  const targetUser = existingUsers[0];

  if (!targetUser) {
    console.error(`❌ User with email ${superAdminEmail} not found`);
    console.log(
      "📝 Please register a user with this email first, then run this script again."
    );
    process.exit(1);
  }

  if (targetUser.role === "admin") {
    console.log(`✅ User ${targetUser.email} is already an admin`);
    process.exit(0);
  }

  await db
    .update(user)
    .set({ role: "admin" })
    .where(eq(user.email, superAdminEmail));

  console.log(`✅ Successfully set ${targetUser.email} as admin`);
  console.log(`📊 Previous role: ${targetUser.role || "user"} → New role: admin`);
}

setAdminRole()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
