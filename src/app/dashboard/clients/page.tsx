import Link from "next/link"
import { Plus, Search, Filter } from "lucide-react"
import { ClientTable, type Client } from "@/components/clients/client-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CLIENTS, ACTIONS } from "@/lib/constants/hebrew"

// Mock data - will be replaced with real data from database
const mockClients: Client[] = [
  {
    id: "1",
    firstName: "יוסי",
    lastName: "כהן",
    idNumber: "012345678",
    phone: "0501234567",
    email: "yossi@email.com",
    address: "רחוב הרצל 12, תל אביב",
    activeDeclarations: 2,
  },
  {
    id: "2",
    firstName: "שרה",
    lastName: "לוי",
    idNumber: "023456789",
    phone: "0521234567",
    email: "sara@email.com",
    address: "רחוב בן גוריון 45, חיפה",
    activeDeclarations: 1,
  },
  {
    id: "3",
    firstName: "דוד",
    lastName: "אברהמי",
    idNumber: "034567890",
    phone: "0531234567",
    email: "david@email.com",
    address: "רחוב ויצמן 78, ירושלים",
    activeDeclarations: 0,
  },
  {
    id: "4",
    firstName: "רחל",
    lastName: "מזרחי",
    idNumber: "045678901",
    phone: "0541234567",
    email: "rachel@email.com",
    address: "רחוב הנביאים 23, באר שבע",
    activeDeclarations: 1,
  },
  {
    id: "5",
    firstName: "משה",
    lastName: "אבוטבול",
    idNumber: "056789012",
    phone: "0551234567",
    activeDeclarations: 3,
  },
  {
    id: "6",
    firstName: "נורית",
    lastName: "גולדברג",
    idNumber: "067890123",
    phone: "0561234567",
    email: "nurit@email.com",
    activeDeclarations: 0,
  },
  {
    id: "7",
    firstName: "אלי",
    lastName: "ברקוביץ",
    idNumber: "078901234",
    phone: "0571234567",
    email: "eli@email.com",
    address: "רחוב דיזנגוף 100, תל אביב",
    activeDeclarations: 1,
  },
  {
    id: "8",
    firstName: "תמר",
    lastName: "שוורץ",
    idNumber: "089012345",
    phone: "0581234567",
    activeDeclarations: 0,
  },
]

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{CLIENTS.title}</h1>
          <p className="text-muted-foreground">ניהול הלקוחות שלך</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/clients/new">
            <Plus className="h-4 w-4 me-2" />
            {CLIENTS.addClient}
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={`${ACTIONS.search}...`} className="ps-9" />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 me-2" />
          {ACTIONS.filter}
        </Button>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>כל הלקוחות</span>
            <span className="text-sm font-normal text-muted-foreground">
              {mockClients.length} לקוחות
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ClientTable clients={mockClients} />
        </CardContent>
      </Card>
    </div>
  )
}
