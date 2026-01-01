import { Check, CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MARKETING, SETTINGS } from "@/lib/constants/hebrew"

// Extend marketing plans with current status for billing page
const PLANS = MARKETING.pricing.plans.map((plan, index) => ({
  ...plan,
  current: index === 1, // Professional plan is current
}))

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>{SETTINGS.billing.currentPlan}</CardTitle>
          <CardDescription>{SETTINGS.billing.subscribedTo}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div>
              <h3 className="font-semibold text-lg">{MARKETING.pricing.plans[1].name}</h3>
              <p className="text-sm text-muted-foreground">
                {MARKETING.pricing.plans[1].features[0]}
              </p>
            </div>
            <div className="text-end">
              <p className="text-2xl font-bold">
                {MARKETING.pricing.plans[1].currency}{MARKETING.pricing.plans[1].price}
                <span className="text-sm font-normal">/{SETTINGS.billing.perMonth}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {SETTINGS.billing.nextBilling}: 1 בינואר 2025
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>{SETTINGS.billing.cardEndingWith}4242</span>
            </div>
            <Button variant="outline" size="sm">
              {SETTINGS.billing.updatePayment}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-lg font-semibold mb-4">{SETTINGS.billing.availablePlans}</h2>
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
                  {"popular" in plan && plan.popular && <Badge>{SETTINGS.billing.popular}</Badge>}
                </div>
                <div className="pt-2">
                  {plan.price === MARKETING.pricing.plans[2].price ? (
                    <span className="text-2xl font-bold">{plan.price}</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">{plan.currency}{plan.price}</span>
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
                    ? SETTINGS.billing.currentPlanButton
                    : plan.price === MARKETING.pricing.plans[2].price
                      ? SETTINGS.billing.contactUs
                      : SETTINGS.billing.upgradeNow}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>{SETTINGS.billing.billingHistory}</CardTitle>
          <CardDescription>{SETTINGS.billing.recentCharges}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: "1 דצמבר 2024", amount: "₪249" },
              { date: "1 נובמבר 2024", amount: "₪249" },
              { date: "1 אוקטובר 2024", amount: "₪249" },
            ].map((invoice, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{invoice.date}</p>
                  <p className="text-sm text-muted-foreground">
                    {SETTINGS.billing.planLabel}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">{SETTINGS.billing.paid}</Badge>
                  <span className="font-medium">{invoice.amount}</span>
                  <Button variant="ghost" size="sm">
                    {SETTINGS.billing.downloadInvoice}
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
