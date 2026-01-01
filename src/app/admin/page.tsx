import { ADMIN } from "@/lib/constants/hebrew"

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">{ADMIN.nav.dashboard}</h1>
      <p className="text-muted-foreground mt-2">בקרוב - דשבורד ניהול מלא</p>
    </div>
  )
}
