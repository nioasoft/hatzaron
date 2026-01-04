import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin } from "better-auth/plugins"
import { db } from "./db"
import { firm, user } from "./schema"
import { eq } from "drizzle-orm"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
      impersonationSessionDuration: 3600, // 1 hour
      allowImpersonatingAdmins: false,
    }),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      // Log password reset URL to terminal (no email integration yet)
      // eslint-disable-next-line no-console
      console.log(`\n${"=".repeat(60)}\nPASSWORD RESET REQUEST\nUser: ${user.email}\nReset URL: ${url}\n${"=".repeat(60)}\n`)
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user: emailUser, url }) => {
      // Log verification URL to terminal (no email integration yet)
      // eslint-disable-next-line no-console
      console.log(`\n${"=".repeat(60)}\nEMAIL VERIFICATION\nUser: ${emailUser.email}\nVerification URL: ${url}\n${"=".repeat(60)}\n`)
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (newUser) => {
          // Create a new firm for new users (they become firm_admin)
          const firmName = `המשרד של ${newUser.name}`

          const result = await db.insert(firm).values({
            name: firmName,
          }).returning()

          const newFirm = result[0]
          if (!newFirm) {
            console.error("Failed to create firm for user:", newUser.id)
            return
          }

          // Update user with firmId and role
          await db.update(user)
            .set({
              firmId: newFirm.id,
              role: "firm_admin"
            })
            .where(eq(user.id, newUser.id))
        },
      },
    },
  },
})
