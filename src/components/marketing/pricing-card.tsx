import Link from "next/link";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: string;
  currency: string;
  period: string;
  features: string[];
  popular?: boolean;
}

export function PricingCard({
  name,
  price,
  currency,
  period,
  features,
  popular,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col",
        popular && "border-primary border-2"
      )}
    >
      {popular && (
        <Badge className="absolute -top-3 start-1/2 -translate-x-1/2">
          הכי פופולרי
        </Badge>
      )}
      <CardHeader className="text-center pb-2">
        <h3 className="text-xl font-semibold">{name}</h3>
        <div className="mt-4">
          {currency && (
            <span className="text-4xl font-bold">
              {currency}
              {price}
            </span>
          )}
          {!currency && <span className="text-2xl font-bold">{price}</span>}
          {period && (
            <span className="text-muted-foreground me-1">/{period}</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={popular ? "default" : "outline"}
          asChild
        >
          <Link href="/register">
            {currency ? "התחל עכשיו" : "צור קשר"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
