import { PricingCard } from "@/components/marketing/pricing-card";
import { MARKETING } from "@/lib/constants/hebrew";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מחירים",
  description: "בחר את התוכנית המתאימה לך - מבסיסי ועד ארגוני",
};

export default function PricingPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {MARKETING.pricing.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            בחר את התוכנית המתאימה לגודל המשרד שלך
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {MARKETING.pricing.plans.map((plan) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              price={plan.price}
              currency={plan.currency}
              period={plan.period}
              features={[...plan.features]}
              popular={"popular" in plan ? plan.popular : false}
            />
          ))}
        </div>

        <div className="mt-12 text-center text-muted-foreground">
          <p>כל התוכניות כוללות תקופת ניסיון של 14 יום ללא התחייבות</p>
        </div>
      </div>
    </div>
  );
}
