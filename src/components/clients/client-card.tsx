import Link from "next/link"
import { User, Phone, Mail, MapPin, FileText, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ACTIONS } from "@/lib/constants/hebrew"
import type { Client } from "./client-table"

interface ClientCardProps {
  client: Client
  showActions?: boolean
}

function formatIdNumber(idNumber: string): string {
  if (idNumber.length === 9) {
    return `${idNumber.slice(0, 3)}-${idNumber.slice(3)}`
  }
  return idNumber
}

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

export function ClientCard({ client, showActions = true }: ClientCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">
              {client.firstName} {client.lastName}
            </CardTitle>
            <p className="text-sm text-muted-foreground" dir="ltr">
              ת.ז. {formatIdNumber(client.idNumber)}
            </p>
          </div>
        </div>
        {showActions && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/clients/${client.id}/edit`}>
              <Edit className="h-4 w-4 me-2" />
              {ACTIONS.edit}
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span dir="ltr">{formatPhone(client.phone)}</span>
          </div>
          {client.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span dir="ltr">{client.email}</span>
            </div>
          )}
          {client.address && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{client.address}</span>
            </div>
          )}
        </div>

        {client.activeDeclarations > 0 && (
          <div className="pt-2 border-t">
            <Badge variant="secondary" className="gap-1">
              <FileText className="h-3 w-3" />
              {client.activeDeclarations} הצהרות פעילות
            </Badge>
          </div>
        )}

        {client.notes && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">{client.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
