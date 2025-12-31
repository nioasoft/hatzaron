import { Check, CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const PLANS = [
  {
    name: "בסיסי",
    price: "99",
    period: "לחודש",
    features: ["עד 10 הצהרות בחודש", "פורטל לקוח בסיסי", "תמיכה באימייל"],
    current: false,
  },
  {
    name: "מקצועי",
    price: "249",
    period: "לחודש",
    features: [
      "עד 50 הצהרות בחודש",
      "פורטל לקוח מלא",
      "מיתוג בסיסי",
      "תמיכה מועדפת",
    ],
    current: true,
    popular: true,
  },
  {
    name: "ארגוני",
    price: "צור קשר",
    period: "",
    features: ["הצהרות ללא הגבלה", "מיתוג מלא", "API access", "מנהל לקוח ייעודי"],
    current: false,
  },
]

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>התוכנית הנוכחית</CardTitle>
          <CardDescription>אתה מנוי לתוכנית המקצועית</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div>
              <h3 className="font-semibold text-lg">מקצועי</h3>
              <p className="text-sm text-muted-foreground">
                עד 50 הצהרות בחודש
              </p>
            </div>
            <div className="text-end">
              <p className="text-2xl font-bold">
                ₪249<span className="text-sm font-normal">/חודש</span>
              </p>
              <p className="text-xs text-muted-foreground">
                חיוב הבא: 1 בינואר 2025
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>ויזה המסתיימת ב-4242</span>
            </div>
            <Button variant="outline" size="sm">
              עדכן אמצעי תשלום
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-lg font-semibold mb-4">תוכניות זמינות</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.current ? "border-primary ring-1 ring-primary" : ""
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  {plan.popular && <Badge>פופולרי</Badge>}
                </div>
                <div className="pt-2">
                  {plan.price === "צור קשר" ? (
                    <span className="text-2xl font-bold">{plan.price}</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">₪{plan.price}</span>
                      <span className="text-muted-foreground">
                        /{plan.period}
                      </span>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.current ? "outline" : "default"}
                  disabled={plan.current}
                >
                  {plan.current
                    ? "התוכנית הנוכחית"
                    : plan.price === "צור קשר"
                      ? "צור קשר"
                      : "שדרג עכשיו"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>היסטוריית חיובים</CardTitle>
          <CardDescription>החיובים האחרונים שלך</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: "1 דצמבר 2024", amount: "₪249", status: "שולם" },
              { date: "1 נובמבר 2024", amount: "₪249", status: "שולם" },
              { date: "1 אוקטובר 2024", amount: "₪249", status: "שולם" },
            ].map((invoice, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{invoice.date}</p>
                  <p className="text-sm text-muted-foreground">
                    תוכנית מקצועית
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">{invoice.status}</Badge>
                  <span className="font-medium">{invoice.amount}</span>
                  <Button variant="ghost" size="sm">
                    הורד חשבונית
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
