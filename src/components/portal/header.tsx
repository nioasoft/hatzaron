"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, User, LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface PortalHeaderProps {
  logo?: string
  firmName: string
  clientName: string
  navItems: Array<{ href: string; label: string }>
}

export function PortalHeader({
  logo,
  firmName,
  clientName,
  navItems,
}: PortalHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
  }

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
          aria-label="Portal navigation"
        >
          {/* Logo / Firm Name */}
          <Link
            href="/portal"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            aria-label={`${firmName} - פורטל לקוחות`}
            style={{ color: "var(--portal-primary, var(--primary))" }}
          >
            {logo ? (
              <Image
                src={logo}
                alt=""
                width={40}
                height={40}
                className="rounded-lg object-contain"
                aria-hidden="true"
              />
            ) : (
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: "var(--portal-primary, var(--primary))" }}
              >
                {firmName.charAt(0)}
              </div>
            )}
            <span className="text-xl font-bold hidden sm:inline">{firmName}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/portal"
                    ? pathname === "/portal"
                    : pathname.startsWith(item.href)

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                      style={
                        isActive
                          ? {
                              backgroundColor: "color-mix(in oklch, var(--portal-primary, var(--primary)) 10%, transparent)",
                              color: "var(--portal-primary, var(--primary))",
                            }
                          : undefined
                      }
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div className="flex items-center gap-3">
              <ModeToggle />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback
                        className="text-white text-sm"
                        style={{ backgroundColor: "var(--portal-primary, var(--primary))" }}
                      >
                        {getInitials(clientName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline text-sm font-medium">
                      {clientName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium">{clientName}</p>
                    <p className="text-muted-foreground text-xs">{firmName}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="me-2 h-4 w-4" />
                    הפרופיל שלי
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <LogOut className="me-2 h-4 w-4" />
                    התנתקות
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                  {/* User Info */}
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback
                        className="text-white"
                        style={{ backgroundColor: "var(--portal-primary, var(--primary))" }}
                      >
                        {getInitials(clientName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{clientName}</p>
                      <p className="text-sm text-muted-foreground">{firmName}</p>
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                      const isActive =
                        item.href === "/portal"
                          ? pathname === "/portal"
                          : pathname.startsWith(item.href)

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "px-4 py-2 rounded-lg text-base transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                          style={
                            isActive
                              ? {
                                  backgroundColor: "color-mix(in oklch, var(--portal-primary, var(--primary)) 10%, transparent)",
                                  color: "var(--portal-primary, var(--primary))",
                                }
                              : undefined
                          }
                        >
                          {item.label}
                        </Link>
                      )
                    })}
                  </nav>

                  {/* Logout */}
                  <div className="pt-4 border-t mt-auto">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="me-2 h-4 w-4" />
                      התנתקות
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
    </>
  )
}
