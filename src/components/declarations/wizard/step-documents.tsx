"use client"

import { Check, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { PORTAL } from "@/lib/constants/hebrew"
import type { DocumentData } from "./index"

interface StepDocumentsProps {
  data: DocumentData
  onUpdate: (data: Partial<DocumentData>) => void
}

const DOCUMENT_TYPES: {
  key: keyof DocumentData
  label: string
  required: boolean
}[] = [
  { key: "idCard", label: PORTAL.documents.types.id_card, required: true },
  {
    key: "bankStatements",
    label: PORTAL.documents.types.bank_statements,
    required: true,
  },
  {
    key: "mortgageStatement",
    label: PORTAL.documents.types.mortgage_statement,
    required: false,
  },
  {
    key: "vehicleRegistration",
    label: PORTAL.documents.types.vehicle_registration,
    required: false,
  },
  {
    key: "investmentReport",
    label: PORTAL.documents.types.investment_report,
    required: false,
  },
  {
    key: "propertyDeed",
    label: PORTAL.documents.types.property_deed,
    required: false,
  },
]

export function StepDocuments({ data, onUpdate }: StepDocumentsProps) {
  const requiredDocs = DOCUMENT_TYPES.filter((d) => d.required)
  const optionalDocs = DOCUMENT_TYPES.filter((d) => !d.required)

  const completedRequired = requiredDocs.filter((d) => data[d.key]).length
  const totalRequired = requiredDocs.length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{PORTAL.documents.title}</h2>
        <p className="text-sm text-muted-foreground">
          סמן את המסמכים שהתקבלו מהלקוח
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 rounded-lg border p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          {completedRequired === totalRequired ? (
            <Check className="h-5 w-5 text-primary" />
          ) : (
            <span className="text-sm font-medium text-primary">
              {completedRequired}/{totalRequired}
            </span>
          )}
        </div>
        <div>
          <p className="font-medium">מסמכי חובה</p>
          <p className="text-sm text-muted-foreground">
            {completedRequired === totalRequired
              ? "כל מסמכי החובה התקבלו"
              : `חסרים ${totalRequired - completedRequired} מסמכים`}
          </p>
        </div>
      </div>

      {/* Required Documents */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 font-medium">
          מסמכי חובה
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
            {PORTAL.documents.required}
          </span>
        </h3>
        <div className="space-y-3">
          {requiredDocs.map((doc) => (
            <div
              key={doc.key}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  id={doc.key}
                  checked={data[doc.key]}
                  onCheckedChange={(checked) =>
                    onUpdate({ [doc.key]: checked === true })
                  }
                />
                <Label htmlFor={doc.key} className="cursor-pointer">
                  {doc.label}
                </Label>
              </div>
              <div>
                {data[doc.key] ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Documents */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 font-medium">
          מסמכים נוספים
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {PORTAL.documents.optional}
          </span>
        </h3>
        <div className="space-y-3">
          {optionalDocs.map((doc) => (
            <div
              key={doc.key}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  id={doc.key}
                  checked={data[doc.key]}
                  onCheckedChange={(checked) =>
                    onUpdate({ [doc.key]: checked === true })
                  }
                />
                <Label htmlFor={doc.key} className="cursor-pointer">
                  {doc.label}
                </Label>
              </div>
              <div>
                {data[doc.key] ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
