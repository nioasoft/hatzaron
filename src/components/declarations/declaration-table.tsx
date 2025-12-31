"use client"

import Link from "next/link"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import {
  DeclarationStatusBadge,
  type DeclarationStatus,
} from "@/components/declarations/declaration-status"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DECLARATIONS, ACTIONS } from "@/lib/constants/hebrew"

export interface Declaration {
  id: string
  clientName: string
  createdAt: string
  deadline: string
  status: DeclarationStatus
  netWorth: number
}

interface DeclarationTableProps {
  declarations: Declaration[]
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("he-IL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString))
}

export function DeclarationTable({ declarations }: DeclarationTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{DECLARATIONS.tableHeaders.client}</TableHead>
          <TableHead>{DECLARATIONS.tableHeaders.createdAt}</TableHead>
          <TableHead>{DECLARATIONS.tableHeaders.deadline}</TableHead>
          <TableHead>{DECLARATIONS.tableHeaders.status}</TableHead>
          <TableHead>{DECLARATIONS.tableHeaders.netWorth}</TableHead>
          <TableHead className="w-[70px]">
            {DECLARATIONS.tableHeaders.actions}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {declarations.map((declaration) => (
          <TableRow key={declaration.id}>
            <TableCell>
              <Link
                href={`/dashboard/declarations/${declaration.id}`}
                className="font-medium hover:underline"
              >
                {declaration.clientName}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground" dir="ltr">
              {formatDate(declaration.createdAt)}
            </TableCell>
            <TableCell className="text-muted-foreground" dir="ltr">
              {formatDate(declaration.deadline)}
            </TableCell>
            <TableCell>
              <DeclarationStatusBadge status={declaration.status} />
            </TableCell>
            <TableCell className="font-medium" dir="ltr">
              {formatCurrency(declaration.netWorth)}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">{ACTIONS.view}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/declarations/${declaration.id}`}>
                      <Eye className="h-4 w-4 me-2" />
                      {ACTIONS.view}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/declarations/${declaration.id}/edit`}
                    >
                      <Edit className="h-4 w-4 me-2" />
                      {ACTIONS.edit}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 me-2" />
                    {ACTIONS.delete}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
