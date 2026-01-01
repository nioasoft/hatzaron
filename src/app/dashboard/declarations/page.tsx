import Link from "next/link"
import { Plus, Search, Filter, FileText } from "lucide-react"
import {
  DeclarationTable,
  type Declaration,
} from "@/components/declarations/declaration-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { DECLARATIONS, ACTIONS } from "@/lib/constants/hebrew"

// Mock data - will be replaced with real data from database
const mockDeclarations: Declaration[] = [
  {
    id: "1",
    clientName: "יוסי כהן",
    createdAt: "2024-12-15",
    deadline: "2025-04-15",
    status: "pending_documents",
    netWorth: 2500000,
  },
  {
    id: "2",
    clientName: "שרה לוי",
    createdAt: "2024-12-10",
    deadline: "2025-04-10",
    status: "in_review",
    netWorth: 1800000,
  },
  {
    id: "3",
    clientName: "דוד אברהמי",
    createdAt: "2024-12-05",
    deadline: "2025-04-05",
    status: "draft",
    netWorth: 3200000,
  },
  {
    id: "4",
    clientName: "רחל מזרחי",
    createdAt: "2024-11-28",
    deadline: "2025-03-28",
    status: "submitted",
    netWorth: 950000,
  },
  {
    id: "5",
    clientName: "משה אבוטבול",
    createdAt: "2024-11-20",
    deadline: "2025-03-20",
    status: "completed",
    netWorth: 4100000,
  },
  {
    id: "6",
    clientName: "נורית גולדברג",
    createdAt: "2024-11-15",
    deadline: "2025-03-15",
    status: "in_review",
    netWorth: 2750000,
  },
  {
    id: "7",
    clientName: "אלי ברקוביץ",
    createdAt: "2024-11-10",
    deadline: "2025-03-10",
    status: "pending_documents",
    netWorth: 1200000,
  },
  {
    id: "8",
    clientName: "תמר שוורץ",
    createdAt: "2024-11-05",
    deadline: "2025-03-05",
    status: "completed",
    netWorth: 5600000,
  },
]

export default function DeclarationsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{DECLARATIONS.title}</h1>
          <p className="text-muted-foreground">
            ניהול הצהרות הון של הלקוחות שלך
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/declarations/new">
            <Plus className="h-4 w-4 me-2" />
            {DECLARATIONS.newDeclaration}
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row" role="search">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder={`${ACTIONS.search}...`}
            className="ps-9"
            aria-label="חיפוש הצהרות"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 me-2" aria-hidden="true" />
          {ACTIONS.filter}
        </Button>
      </div>

      {/* Declarations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>כל ההצהרות</span>
            <span className="text-sm font-normal text-muted-foreground">
              {mockDeclarations.length} הצהרות
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockDeclarations.length > 0 ? (
            <DeclarationTable declarations={mockDeclarations} />
          ) : (
            <EmptyState
              icon={FileText}
              title="אין הצהרות עדיין"
              description="צור את ההצהרה הראשונה שלך כדי להתחיל לנהל הצהרות הון עבור הלקוחות שלך."
              action={
                <Button asChild>
                  <Link href="/dashboard/declarations/new">
                    <Plus className="h-4 w-4 me-2" />
                    {DECLARATIONS.newDeclaration}
                  </Link>
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
