"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { APP_NAME, NAV } from "@/lib/constants/hebrew";

const navItems = [
  { href: "/", label: NAV.home },
  { href: "/pricing", label: NAV.pricing },
  { href: "/faq", label: NAV.faq },
];

export function MarketingHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:start-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:border focus:rounded-md"
      >
        דלג לתוכן הראשי
      </a>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav
          className="container mx-auto px-4 h-16 flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 text-primary hover:text-primary/80 transition-colors"
            aria-label={`${APP_NAME} - דף הבית`}
          >
            <Image
              src="/logo.png"
              alt=""
              width={40}
              height={40}
              className="rounded-lg"
              aria-hidden="true"
            />
            <span className="text-xl font-bold">{APP_NAME}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/login">{NAV.login}</Link>
              </Button>
              <Button asChild>
                <Link href="/register">{NAV.register}</Link>
              </Button>
              <ModeToggle />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            <ModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="פתח תפריט">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-6 mt-6">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/logo.png"
                      alt=""
                      width={32}
                      height={32}
                      className="rounded-lg"
                    />
                    <span className="text-lg font-bold">{APP_NAME}</span>
                  </div>
                  <nav className="flex flex-col gap-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="flex flex-col gap-3 pt-4 border-t">
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        {NAV.login}
                      </Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        {NAV.register}
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
    </>
  );
}
