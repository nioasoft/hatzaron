"use client"

import Link from "next/link"
import { MoreHorizontal, Eye, Edit, Trash2, AlertCircle, Clock } from "lucide-react"
import {
  DeclarationStatusBadge,
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
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { DeclarationWithClient } from "@/app/dashboard/declarations/actions"

interface DeclarationTableProps {
  declarations: DeclarationWithClient[]
}

function PriorityBadge({ priority }: { priority: string }) {
  if (priority === 'critical') {
    return <Badge variant="destructive" className="flex w-fit items-center gap-1"><AlertCircle className="h-3 w-3" /> קריטי</Badge>
  }
  if (priority === 'urgent') {
    return <Badge variant="outline" className="flex w-fit items-center gap-1 border-orange-500 text-orange-500"><Clock className="h-3 w-3" /> דחוף</Badge>
  }
  return <span className="text-muted-foreground text-sm">רגיל</span>
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
          <TableHead>עדיפות</TableHead>
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
              {formatDate(declaration.createdAt.toISOString())}
            </TableCell>
            <TableCell className="text-muted-foreground" dir="ltr">
              {declaration.deadline ? formatDate(declaration.deadline.toISOString()) : "-"}
            </TableCell>
            <TableCell>
              <DeclarationStatusBadge status={declaration.status} />
            </TableCell>
            <TableCell>
              <PriorityBadge priority={declaration.priority} />
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