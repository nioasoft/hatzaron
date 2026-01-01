"use client"

import { CheckCircle2, Circle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PORTAL } from "@/lib/constants/hebrew"
import { cn } from "@/lib/utils"

export interface DocumentItem {
  type: string
  label: string
  required: boolean
  uploaded: boolean
  fileName?: string
}

interface DocumentChecklistProps {
  documents: DocumentItem[]
  onSelect?: (type: string) => void
  selectedType?: string
}

export function DocumentChecklist({
  documents,
  onSelect,
  selectedType,
}: DocumentChecklistProps) {
  const requiredDocs = documents.filter((d) => d.required)
  const optionalDocs = documents.filter((d) => !d.required)

  const uploadedCount = documents.filter((d) => d.uploaded).length
  const requiredUploadedCount = requiredDocs.filter((d) => d.uploaded).length

  const renderDocItem = (doc: DocumentItem) => {
    const isSelected = selectedType === doc.type
    const isComplete = doc.uploaded

    return (
      <button
        key={doc.type}
        onClick={() => onSelect?.(doc.type)}
        className={cn(
          "w-full flex items-center gap-3 p-3 rounded-lg text-start transition-colors",
          isSelected
            ? "bg-primary/10 border-2 border-primary"
            : "hover:bg-muted border-2 border-transparent"
        )}
      >
        {isComplete ? (
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
        ) : doc.required ? (
          <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "font-medium",
              isComplete && "text-muted-foreground line-through"
            )}
          >
            {doc.label}
          </p>
          {doc.fileName && (
            <p className="text-xs text-muted-foreground truncate">
              {doc.fileName}
            </p>
          )}
        </div>
        {doc.required ? (
          <Badge
            variant="outline"
            className="shrink-0 text-xs border-yellow-500 text-yellow-600"
          >
            {PORTAL.documents.required}
          </Badge>
        ) : (
          <Badge variant="outline" className="shrink-0 text-xs">
            {PORTAL.documents.optional}
          </Badge>
        )}
      </button>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">רשימת מסמכים</CardTitle>
          <Badge variant="secondary">
            {uploadedCount}/{documents.length}
          </Badge>
        </div>
        {requiredUploadedCount < requiredDocs.length && (
          <p className="text-sm text-muted-foreground">
            {requiredDocs.length - requiredUploadedCount} מסמכים נדרשים חסרים
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Required Documents */}
        {requiredDocs.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              מסמכים נדרשים
            </h4>
            <div className="space-y-1">
              {requiredDocs.map(renderDocItem)}
            </div>
          </div>
        )}

        {/* Optional Documents */}
        {optionalDocs.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              מסמכים אופציונליים
            </h4>
            <div className="space-y-1">
              {optionalDocs.map(renderDocItem)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
