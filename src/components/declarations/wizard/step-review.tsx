"use client"

import { Check, X, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DECLARATIONS, PORTAL } from "@/lib/constants/hebrew"
import type { WizardData } from "./index"

interface StepReviewProps {
  data: WizardData
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function StepReview({ data }: StepReviewProps) {
  const totalRealEstate = data.assets.realEstate.reduce(
    (sum, a) => sum + a.value,
    0
  )
  const totalVehicles = data.assets.vehicles.reduce(
    (sum, a) => sum + a.value,
    0
  )
  const totalBankAccounts = data.assets.bankAccounts.reduce(
    (sum, a) => sum + a.balance,
    0
  )
  const totalInvestments = data.assets.investments.reduce(
    (sum, a) => sum + a.value,
    0
  )
  const totalAssets =
    totalRealEstate + totalVehicles + totalBankAccounts + totalInvestments

  const totalLiabilities = data.liabilities.reduce(
    (sum, l) => sum + l.amount,
    0
  )

  const netWorth = totalAssets - totalLiabilities

  // Check completeness
  const clientComplete =
    data.client.firstName &&
    data.client.lastName &&
    data.client.idNumber &&
    data.client.phone

  const requiredDocsComplete =
    data.documents.idCard && data.documents.bankStatements

  const isComplete = clientComplete && requiredDocsComplete

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">סיכום ושליחה</h2>
        <p className="text-sm text-muted-foreground">
          בדוק את הפרטים לפני שליחת ההצהרה
        </p>
      </div>

      {!isComplete && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            יש להשלים את כל השדות הנדרשים לפני שליחת ההצהרה
          </AlertDescription>
        </Alert>
      )}

      {/* Client Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <span>פרטי לקוח</span>
            {clientComplete ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <X className="h-5 w-5 text-destructive" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <span className="text-muted-foreground">שם: </span>
              <span className="font-medium">
                {data.client.firstName} {data.client.lastName}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">ת.ז.: </span>
              <span className="font-medium" dir="ltr">
                {data.client.idNumber || "-"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">טלפון: </span>
              <span className="font-medium" dir="ltr">
                {data.client.phone || "-"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">אימייל: </span>
              <span className="font-medium" dir="ltr">
                {data.client.email || "-"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">סיכום נכסים</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>
              {DECLARATIONS.assetTypes.real_estate} (
              {data.assets.realEstate.length})
            </span>
            <span className="font-medium" dir="ltr">
              {formatCurrency(totalRealEstate)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>
              {DECLARATIONS.assetTypes.vehicle} ({data.assets.vehicles.length})
            </span>
            <span className="font-medium" dir="ltr">
              {formatCurrency(totalVehicles)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>
              {DECLARATIONS.assetTypes.bank_account} (
              {data.assets.bankAccounts.length})
            </span>
            <span className="font-medium" dir="ltr">
              {formatCurrency(totalBankAccounts)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>
              {DECLARATIONS.assetTypes.investment} (
              {data.assets.investments.length})
            </span>
            <span className="font-medium" dir="ltr">
              {formatCurrency(totalInvestments)}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between font-medium">
            <span>סה&quot;כ נכסים</span>
            <span dir="ltr">{formatCurrency(totalAssets)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Liabilities Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">סיכום התחייבויות</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.liabilities.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              לא הוזנו התחייבויות
            </p>
          ) : (
            <>
              {data.liabilities.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{l.type}</span>
                  <span className="font-medium text-destructive" dir="ltr">
                    -{formatCurrency(l.amount)}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between font-medium">
                <span>סה&quot;כ התחייבויות</span>
                <span className="text-destructive" dir="ltr">
                  -{formatCurrency(totalLiabilities)}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Documents Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <span>מסמכים</span>
            {requiredDocsComplete ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <X className="h-5 w-5 text-destructive" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2">
              {data.documents.idCard ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-destructive" />
              )}
              <span>{PORTAL.documents.types.id_card}</span>
            </div>
            <div className="flex items-center gap-2">
              {data.documents.bankStatements ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-destructive" />
              )}
              <span>{PORTAL.documents.types.bank_statements}</span>
            </div>
            <div className="flex items-center gap-2">
              {data.documents.mortgageStatement ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground" />
              )}
              <span>{PORTAL.documents.types.mortgage_statement}</span>
            </div>
            <div className="flex items-center gap-2">
              {data.documents.vehicleRegistration ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground" />
              )}
              <span>{PORTAL.documents.types.vehicle_registration}</span>
            </div>
            <div className="flex items-center gap-2">
              {data.documents.investmentReport ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground" />
              )}
              <span>{PORTAL.documents.types.investment_report}</span>
            </div>
            <div className="flex items-center gap-2">
              {data.documents.propertyDeed ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground" />
              )}
              <span>{PORTAL.documents.types.property_deed}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Net Worth */}
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="flex items-center justify-between p-6">
          <span className="text-lg font-bold">שווי נטו</span>
          <span className="text-2xl font-bold text-primary" dir="ltr">
            {formatCurrency(netWorth)}
          </span>
        </CardContent>
      </Card>
    </div>
  )
}
