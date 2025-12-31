import Image from "next/image";
import Link from "next/link";
import { APP_NAME, NAV, MARKETING } from "@/lib/constants/hebrew";

const footerLinks = {
  product: [
    { href: "/pricing", label: NAV.pricing },
    { href: "/faq", label: NAV.faq },
  ],
  legal: [
    { href: "/privacy", label: "מדיניות פרטיות" },
    { href: "/terms", label: "תנאי שימוש" },
  ],
};

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/hatzaron_logo.png"
                alt=""
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-xl font-bold">{APP_NAME}</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              {MARKETING.hero.subheadline}. פלטפורמה מתקדמת לניהול הצהרות הון עבור משרדי רואי חשבון בישראל.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">מוצר</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">משפטי</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {currentYear} {APP_NAME}. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}
