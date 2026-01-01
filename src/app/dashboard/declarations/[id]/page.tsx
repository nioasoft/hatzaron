import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowRight,
  Edit,
  FileText,
  Building,
  Car,
  Wallet,
  TrendingUp,
  CreditCard,
} from "lucide-react"
import { DeclarationStatusBadge } from "@/components/declarations/declaration-status"
import { Timeline, type TimelineStep } from "@/components/declarations/timeline"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DECLARATIONS, ACTIONS } from "@/lib/constants/hebrew"
import { formatDateLong, formatCurrency } from "@/lib/utils"

// Mock data - will be replaced with real data from database
const mockDeclarations = [
  {
    id: "1",
    clientName: "יוסי כהן",
    clientId: "123456789",
    clientPhone: "050-1234567",
    clientEmail: "yossi@example.com",
    createdAt: "2024-12-15",
    deadline: "2025-04-15",
    status: "pending_documents" as const,
    netWorth: 2500000,
    assets: {
      realEstate: [
        { type: "דירת מגורים", value: 2000000, location: "תל אביב" },
      ],
      vehicles: [{ type: "רכב פרטי", value: 150000, model: "טויוטה קורולה 2022" }],
      bankAccounts: [
        { bank: "בנק לאומי", balance: 250000 },
        { bank: "בנק הפועלים", balance: 100000 },
      ],
      investments: [{ type: "קרן השתלמות", value: 180000 }],
    },
    liabilities: [{ type: "משכנתא", amount: 800000, institution: "בנק לאומי" }],
    timeline: [
      { id: "1", label: "הצהרה נוצרה", status: "completed", date: "15/12/2024" },
      {
        id: "2",
        label: "פרטי לקוח הוזנו",
        status: "completed",
        date: "16/12/2024",
      },
      { id: "3", label: "ממתין למסמכים", status: "current" },
      { id: "4", label: "בדיקה סופית", status: "upcoming" },
      { id: "5", label: "הגשה לרשות המסים", status: "upcoming" },
    ] as TimelineStep[],
  },
]

interface DeclarationDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function DeclarationDetailPage({
  params,
}: DeclarationDetailPageProps) {
  const { id } = await params
  const declaration = mockDeclarations.find((d) => d.id === id)

  if (!declaration) {
    notFound()
  }

  const totalAssets =
    declaration.assets.realEstate.reduce((sum, a) => sum + a.value, 0) +
    declaration.assets.vehicles.reduce((sum, a) => sum + a.value, 0) +
    declaration.assets.bankAccounts.reduce((sum, a) => sum + a.balance, 0) +
    declaration.assets.investments.reduce((sum, a) => sum + a.value, 0)

  const totalLiabilities = declaration.liabilities.reduce(
    (sum, l) => sum + l.amount,
    0
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/declarations">
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">{ACTIONS.back}</span>
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{declaration.clientName}</h1>
              <DeclarationStatusBadge status={declaration.status} />
            </div>
            <p className="text-muted-foreground">
              הצהרת הון - נוצרה ב-{formatDateLong(declaration.createdAt)}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/declarations/${id}/edit`}>
            <Edit className="h-4 w-4 me-2" />
            {ACTIONS.edit}
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                פרטי לקוח
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">שם מלא</p>
                <p className="font-medium">{declaration.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">תעודת זהות</p>
                <p className="font-medium" dir="ltr">
                  {declaration.clientId}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">טלפון</p>
                <p className="font-medium" dir="ltr">
                  {declaration.clientPhone}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">אימייל</p>
                <p className="font-medium" dir="ltr">
                  {declaration.clientEmail}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Assets Summary */}
          <Card>
            <CardHeader>
              <CardTitle>סיכום נכסים והתחייבויות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Real Estate */}
              {declaration.assets.realEstate.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Building className="h-4 w-4" />
                    {DECLARATIONS.assetTypes.real_estate}
                  </div>
                  {declaration.assets.realEstate.map((asset, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b py-2 last:border-0"
                    >
                      <div>
                        <p className="font-medium">{asset.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {asset.location}
                        </p>
                      </div>
                      <p className="font-medium" dir="ltr">
                        {formatCurrency(asset.value)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              {/* Vehicles */}
              {declaration.assets.vehicles.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Car className="h-4 w-4" />
                    {DECLARATIONS.assetTypes.vehicle}
                  </div>
                  {declaration.assets.vehicles.map((asset, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b py-2 last:border-0"
                    >
                      <div>
                        <p className="font-medium">{asset.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {asset.model}
                        </p>
                      </div>
                      <p className="font-medium" dir="ltr">
                        {formatCurrency(asset.value)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              {/* Bank Accounts */}
              {declaration.assets.bankAccounts.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Wallet className="h-4 w-4" />
                    {DECLARATIONS.assetTypes.bank_account}
                  </div>
                  {declaration.assets.bankAccounts.map((account, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b py-2 last:border-0"
                    >
                      <p className="font-medium">{account.bank}</p>
                      <p className="font-medium" dir="ltr">
                        {formatCurrency(account.balance)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              {/* Investments */}
              {declaration.assets.investments.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    {DECLARATIONS.assetTypes.investment}
                  </div>
                  {declaration.assets.investments.map((investment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b py-2 last:border-0"
                    >
                      <p className="font-medium">{investment.type}</p>
                      <p className="font-medium" dir="ltr">
                        {formatCurrency(investment.value)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              {/* Liabilities */}
              {declaration.liabilities.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    התחייבויות
                  </div>
                  {declaration.liabilities.map((liability, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b py-2 last:border-0"
                    >
                      <div>
                        <p className="font-medium">{liability.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {liability.institution}
                        </p>
                      </div>
                      <p className="font-medium text-destructive" dir="ltr">
                        -{formatCurrency(liability.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">סה&quot;כ נכסים</p>
                  <p className="font-medium" dir="ltr">
                    {formatCurrency(totalAssets)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">סה&quot;כ התחייבויות</p>
                  <p className="font-medium text-destructive" dir="ltr">
                    -{formatCurrency(totalLiabilities)}
                  </p>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <p className="font-bold">שווי נטו</p>
                  <p className="text-lg font-bold text-primary" dir="ltr">
                    {formatCurrency(totalAssets - totalLiabilities)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Key Dates */}
          <Card>
            <CardHeader>
              <CardTitle>תאריכים חשובים</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">תאריך יצירה</p>
                <p className="font-medium" dir="ltr">
                  {formatDateLong(declaration.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">דדליין להגשה</p>
                <p className="font-medium" dir="ltr">
                  {formatDateLong(declaration.deadline)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>מצב ההצהרה</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline steps={declaration.timeline} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
