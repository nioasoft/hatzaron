"use client"

import Link from "next/link"
import { MoreHorizontal, Eye, Edit, Trash2, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
import { CLIENTS, ACTIONS } from "@/lib/constants/hebrew"

export interface Client {
  id: string
  firstName: string
  lastName: string
  idNumber: string
  phone: string
  email: string
  address: string | null
  notes: string | null
  activeDeclarations: number
}

interface ClientTableProps {
  clients: Client[]
}

function formatIdNumber(idNumber: string): string {
  // Format as XXX-XXXXXXX for Israeli ID
  if (idNumber.length === 9) {
    return `${idNumber.slice(0, 3)}-${idNumber.slice(3)}`
  }
  return idNumber
}

function formatPhone(phone: string): string {
  // Format as XXX-XXX-XXXX for Israeli phone
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

export function ClientTable({ clients }: ClientTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{CLIENTS.tableHeaders.name}</TableHead>
          <TableHead>{CLIENTS.tableHeaders.idNumber}</TableHead>
          <TableHead>{CLIENTS.tableHeaders.phone}</TableHead>
          <TableHead>{CLIENTS.tableHeaders.activeDeclarations}</TableHead>
          <TableHead className="w-[70px]">
            {CLIENTS.tableHeaders.actions}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell>
              <Link
                href={`/dashboard/clients/${client.id}`}
                className="font-medium hover:underline"
              >
                {client.firstName} {client.lastName}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground" dir="ltr">
              {formatIdNumber(client.idNumber)}
            </TableCell>
            <TableCell className="text-muted-foreground" dir="ltr">
              {formatPhone(client.phone)}
            </TableCell>
            <TableCell>
              {client.activeDeclarations > 0 ? (
                <Badge variant="secondary" className="gap-1">
                  <FileText className="h-3 w-3" />
                  {client.activeDeclarations}
                </Badge>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
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
                    <Link href={`/dashboard/clients/${client.id}`}>
                      <Eye className="h-4 w-4 me-2" />
                      {ACTIONS.view}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/clients/${client.id}/edit`}>
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
