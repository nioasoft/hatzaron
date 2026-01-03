"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Menu,
  Shield,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { useSession, signOut } from "@/lib/auth-client"
import { NAV, APP_NAME, ADMIN } from "@/lib/constants/hebrew"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/dashboard", label: NAV.dashboard, icon: LayoutDashboard, exact: true },
  { href: "/dashboard/declarations", label: NAV.declarations, icon: FileText },
  { href: "/dashboard/settings", label: NAV.settings, icon: Settings },
]

function NavItem({
  href,
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  href: string
  label: string
  icon: typeof LayoutDashboard
  isActive: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      {...(onClick ? { onClick } : {})}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  )
}

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">{APP_NAME}</span>
        </Link>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={isActive(item.href, item.exact)}
            {...(onNavClick ? { onClick: onNavClick } : {})}
          />
        ))}

        {/* Admin Link */}
        {(session?.user as any)?.role === "admin" && (
          <>
            <Separator className="my-2" />
            <NavItem
              href="/admin"
              label={ADMIN.title}
              icon={Shield}
              isActive={isActive("/admin")}
              {...(onNavClick ? { onClick: onNavClick } : {})}
            />
          </>
        )}
      </nav>

      <Separator />

      {/* User Profile Section */}
      {session?.user && (
        <div className="p-4">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={session.user.image || undefined} />
              <AvatarFallback>
                {getInitials(session.user.name || session.user.email || "U")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">
                {session.user.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="mt-2 w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/" } } })}
          >
            <LogOut className="h-5 w-5" />
            <span>{NAV.logout}</span>
          </Button>
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:start-0 border-e bg-background">
      <SidebarContent />
    </aside>
  )
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">פתח תפריט</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64 p-0">
        <SheetTitle className="sr-only">תפריט ניווט</SheetTitle>
        <SidebarContent />
      </SheetContent>
    </Sheet>
  )
}
