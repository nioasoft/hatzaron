"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { ACTIONS } from "@/lib/constants/hebrew"
import { MobileSidebar } from "./sidebar"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
      {/* Mobile menu button */}
      <MobileSidebar />

      {/* Search */}
      <div className="flex-1" role="search">
        <div className="relative max-w-md">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            placeholder={`${ACTIONS.search}...`}
            className="ps-9 w-full"
            aria-label="חיפוש כללי"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">התראות</span>
          {/* Notification badge */}
          <span className="absolute top-1 end-1 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <ModeToggle />
      </div>
    </header>
  )
}
