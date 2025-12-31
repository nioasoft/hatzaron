"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SETTINGS } from "@/lib/constants/hebrew"
import { cn } from "@/lib/utils"

const SETTINGS_NAV = [
  { href: "/dashboard/settings/profile", label: SETTINGS.tabs.profile },
  { href: "/dashboard/settings/white-label", label: SETTINGS.tabs.whiteLabel },
  { href: "/dashboard/settings/billing", label: SETTINGS.tabs.billing },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">{SETTINGS.title}</h1>
        <p className="text-muted-foreground">נהל את הגדרות החשבון שלך</p>
      </div>

      {/* Settings Navigation Tabs */}
      <nav className="flex gap-2 border-b">
        {SETTINGS_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
              pathname === item.href
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Settings Content */}
      <div>{children}</div>
    </div>
  )
}
