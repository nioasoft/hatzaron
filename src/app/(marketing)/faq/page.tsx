import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MARKETING } from "@/lib/constants/hebrew";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "שאלות נפוצות",
  description: "תשובות לשאלות הנפוצות ביותר על הצהר-הון",
};

export default function FAQPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {MARKETING.faq.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            מצא תשובות לשאלות הנפוצות ביותר
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {MARKETING.faq.items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-start text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            לא מצאת את התשובה שחיפשת?
          </p>
          <a
            href="mailto:support@hatzar-hon.co.il"
            className="text-primary hover:underline font-medium"
          >
            צור איתנו קשר
          </a>
        </div>
      </div>
    </div>
  );
}
