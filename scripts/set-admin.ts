import { eq } from "drizzle-orm"
import { db } from "../src/lib/db"
import { user } from "../src/lib/schema"

async function setAdmin() {
  const email = process.argv[2]

  if (!email) {
    console.error("Please provide an email address: npx tsx scripts/set-admin.ts <email>")
    process.exit(1)
  }

  console.log(`Looking for user with email: ${email}...`)

  const foundUser = await db.query.user.findFirst({
    where: eq(user.email, email),
  })

  if (!foundUser) {
    console.error("User not found!")
    process.exit(1)
  }

  console.log(`Found user: ${foundUser.name} (${foundUser.id})`)
  console.log(`Current role: ${foundUser.role}`)

  await db
    .update(user)
    .set({ role: "admin" })
    .where(eq(user.id, foundUser.id))

  console.log("Successfully updated user role to 'admin'")
  process.exit(0)
}

setAdmin().catch((err) => {
  console.error(err)
  process.exit(1)
})