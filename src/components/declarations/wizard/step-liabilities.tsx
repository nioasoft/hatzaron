"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { LiabilityForm } from "@/components/forms/liability-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Liability } from "./index"

interface StepLiabilitiesProps {
  data: Liability[]
  onUpdate: (data: Liability[]) => void
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(amount)
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function StepLiabilities({ data, onUpdate }: StepLiabilitiesProps) {
  const [showForm, setShowForm] = useState(false)

  const handleAdd = (liability: Omit<Liability, "id">) => {
    onUpdate([...data, { ...liability, id: generateId() }])
    setShowForm(false)
  }

  const handleRemove = (id: string) => {
    onUpdate(data.filter((l) => l.id !== id))
  }

  const totalLiabilities = data.reduce((sum, l) => sum + l.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">התחייבויות</h2>
        <p className="text-sm text-muted-foreground">
          הוסף את כל ההתחייבויות של הלקוח (הלוואות, משכנתאות וכו&apos;)
        </p>
      </div>

      {data.length > 0 && (
        <div className="space-y-4">
          {data.map((liability) => (
            <Card key={liability.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{liability.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {liability.institution}
                    {liability.description && ` - ${liability.description}`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-medium text-destructive" dir="ltr">
                    -{formatCurrency(liability.amount)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(liability.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex items-center justify-between border-t pt-4">
            <p className="font-medium">סה&quot;כ התחייבויות</p>
            <p className="font-bold text-destructive" dir="ltr">
              -{formatCurrency(totalLiabilities)}
            </p>
          </div>
        </div>
      )}

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">הוספת התחייבות</CardTitle>
          </CardHeader>
          <CardContent>
            <LiabilityForm
              onSubmit={handleAdd}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-4 w-4 me-2" />
          הוסף התחייבות
        </Button>
      )}
    </div>
  )
}
