import { Heebo, Open_Sans } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: {
    default: "הצהר-הון | ניהול הצהרות הון לרואי חשבון",
    template: "%s | הצהר-הון",
  },
  description:
    "פלטפורמה חכמה לניהול הצהרות הון עבור משרדי רואי חשבון. חסכו זמן, שפרו את חוויית הלקוח, ונהלו את כל ההצהרות במקום אחד.",
  keywords: [
    "הצהרת הון",
    "רואי חשבון",
    "רשות המסים",
    "ניהול מסמכים",
    "SaaS",
    "ישראל",
  ],
  authors: [{ name: "הצהר-הון" }],
  creator: "הצהר-הון",
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "הצהר-הון",
    title: "הצהר-הון | ניהול הצהרות הון לרואי חשבון",
    description:
      "פלטפורמה חכמה לניהול הצהרות הון עבור משרדי רואי חשבון",
  },
  twitter: {
    card: "summary_large_image",
    title: "הצהר-הון | ניהול הצהרות הון לרואי חשבון",
    description:
      "פלטפורמה חכמה לניהול הצהרות הון עבור משרדי רואי חשבון",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "הצהר-הון",
  description:
    "פלטפורמה חכמה לניהול הצהרות הון עבור משרדי רואי חשבון",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "ILS",
  },
  author: {
    "@type": "Organization",
    name: "הצהר-הון",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${heebo.variable} ${openSans.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
