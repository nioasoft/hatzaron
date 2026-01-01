"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
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
import { ADMIN, NAV } from "@/lib/constants/hebrew"
import { cn } from "@/lib/utils"

const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: ADMIN.nav.dashboard, icon: LayoutDashboard, exact: true },
  { href: "/admin/firms", label: ADMIN.nav.firms, icon: Building2 },
  { href: "/admin/settings", label: ADMIN.nav.settings, icon: Settings },
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

function AdminSidebarContent({ onNavClick }: { onNavClick?: () => void }) {
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
        <Link href="/admin" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">{ADMIN.title}</span>
        </Link>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {ADMIN_NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={isActive(item.href, item.exact)}
            {...(onNavClick ? { onClick: onNavClick } : {})}
          />
        ))}
      </nav>

      <Separator />

      {/* User Profile Section */}
      {session?.user && (
        <div className="p-4">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={session.user.image || undefined} />
              <AvatarFallback>
                {getInitials(session.user.name || session.user.email || "A")}
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

export function AdminSidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-e bg-background">
      <AdminSidebarContent />
    </aside>
  )
}

export function AdminMobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">פתח תפריט</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64 p-0">
        <SheetTitle className="sr-only">תפריט ניווט אדמין</SheetTitle>
        <AdminSidebarContent />
      </SheetContent>
    </Sheet>
  )
}
