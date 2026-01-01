"use client"

import Link from "next/link"
import { Building2, MoreHorizontal, Eye, UserX, UserCheck, LogIn } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PLAN_COLORS, PLAN_NAMES, getMockPlan } from "@/lib/constants/admin"
import { ADMIN } from "@/lib/constants/hebrew"
import { formatDate } from "@/lib/utils"
import { FirmStatusBadge } from "./firm-status-badge"

interface Firm {
  id: string
  name: string
  email: string
  banned: boolean | null
  createdAt: Date
}

interface FirmTableProps {
  firms: Firm[]
}

export function FirmTable({ firms }: FirmTableProps) {
  if (firms.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">אין משרדים רשומים עדיין</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-sm text-muted-foreground">
            <th className="pb-3 text-start font-medium">
              {ADMIN.firms.tableHeaders.firm}
            </th>
            <th className="pb-3 text-start font-medium">
              {ADMIN.firms.tableHeaders.email}
            </th>
            <th className="pb-3 text-start font-medium">
              {ADMIN.firms.tableHeaders.plan}
            </th>
            <th className="pb-3 text-start font-medium">
              {ADMIN.firms.tableHeaders.status}
            </th>
            <th className="pb-3 text-start font-medium">
              {ADMIN.firms.tableHeaders.registeredAt}
            </th>
            <th className="pb-3 text-start font-medium">
              {ADMIN.firms.tableHeaders.actions}
            </th>
          </tr>
        </thead>
        <tbody>
          {firms.map((firm) => {
            const plan = getMockPlan()
            return (
              <tr
                key={firm.id}
                className="border-b last:border-0 hover:bg-muted/50"
              >
                <td className="py-3">
                  <Link
                    href={`/admin/firms/${firm.id}`}
                    className="flex items-center gap-2 font-medium hover:underline"
                  >
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {firm.name}
                  </Link>
                </td>
                <td className="py-3 text-muted-foreground" dir="ltr">
                  {firm.email}
                </td>
                <td className="py-3">
                  <Badge variant="secondary" className={PLAN_COLORS[plan]}>
                    {PLAN_NAMES[plan]}
                  </Badge>
                </td>
                <td className="py-3">
                  <FirmStatusBadge isBanned={firm.banned} />
                </td>
                <td className="py-3 text-muted-foreground" dir="ltr">
                  {formatDate(firm.createdAt)}
                </td>
                <td className="py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">פתח תפריט</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/firms/${firm.id}`}>
                          <Eye className="h-4 w-4 me-2" />
                          {ADMIN.firms.actions.view}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <LogIn className="h-4 w-4 me-2" />
                        {ADMIN.firms.actions.impersonate}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        {firm.banned ? (
                          <>
                            <UserCheck className="h-4 w-4 me-2" />
                            {ADMIN.firms.actions.activate}
                          </>
                        ) : (
                          <>
                            <UserX className="h-4 w-4 me-2" />
                            {ADMIN.firms.actions.suspend}
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
