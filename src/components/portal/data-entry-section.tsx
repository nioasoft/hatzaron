"use client"

import { useState } from "react"
import { ChevronDown, CheckCircle2, Circle, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface DataField {
  id: string
  name: string
  label: string
  type: "text" | "number" | "select" | "currency"
  placeholder?: string
  options?: Array<{ value: string; label: string }>
  required?: boolean
}

interface DataEntryItem {
  id: string
  values: Record<string, string>
}

interface DataEntrySectionProps {
  title: string
  description?: string
  icon?: React.ReactNode
  fields: DataField[]
  items: DataEntryItem[]
  onAddItem: () => void
  onUpdateItem: (itemId: string, field: string, value: string) => void
  onRemoveItem: (itemId: string) => void
  allowMultiple?: boolean
  isComplete?: boolean
}

export function DataEntrySection({
  title,
  description,
  icon,
  fields,
  items,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  allowMultiple = true,
  isComplete = false,
}: DataEntrySectionProps) {
  const [isOpen, setIsOpen] = useState(!isComplete)

  const renderField = (field: DataField, itemId: string, value: string) => {
    const handleChange = (newValue: string) => {
      onUpdateItem(itemId, field.id, newValue)
    }

    switch (field.type) {
      case "select":
        return (
          <Select value={value} onValueChange={handleChange}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "בחר..."} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "currency":
        return (
          <div className="relative">
            <Input
              type="number"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={field.placeholder || "0"}
              className="pe-12"
              dir="ltr"
            />
            <span className="absolute end-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ₪
            </span>
          </div>
        )
      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            dir="ltr"
          />
        )
      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
          />
        )
    }
  }

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isComplete ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                <div className="flex items-center gap-2">
                  {icon}
                  <CardTitle className="text-lg">{title}</CardTitle>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {items.length} פריטים
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </div>
            </div>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg space-y-4 relative"
              >
                {items.length > 1 && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      פריט {index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  {fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={`${item.id}-${field.id}`}>
                        {field.label}
                        {field.required && (
                          <span className="text-destructive me-1">*</span>
                        )}
                      </Label>
                      {renderField(
                        field,
                        item.id,
                        item.values[field.id] || ""
                      )}
                    </div>
                  ))}
                </div>

                {/* Single item remove button */}
                {items.length === 1 && (
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 me-2" />
                      הסר
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {/* Add Button */}
            {(allowMultiple || items.length === 0) && (
              <Button variant="outline" className="w-full" onClick={onAddItem}>
                <Plus className="h-4 w-4 me-2" />
                הוסף {title}
              </Button>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
