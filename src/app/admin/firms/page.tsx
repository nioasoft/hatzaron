import { desc, ne } from "drizzle-orm"
import { FirmTable } from "@/components/admin/firms/firm-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ADMIN } from "@/lib/constants/hebrew"
import { db } from "@/lib/db"
import { user } from "@/lib/schema"

export default async function FirmsPage() {
  // Query all firms (non-admin users)
  const firmsData = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      banned: user.banned,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(ne(user.role, "admin"))
    .orderBy(desc(user.createdAt))

  // Ensure banned is always boolean (not null)
  const firms = firmsData.map(f => ({
    ...f,
    banned: f.banned ?? false
  }))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">{ADMIN.firms.title}</h1>
        <p className="text-muted-foreground">{ADMIN.firms.subtitle}</p>
      </div>

      {/* Firms Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>כל המשרדים ({firms.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FirmTable firms={firms} />
        </CardContent>
      </Card>
    </div>
  )
}
