"use client"

import { useState } from "react"
import { Building, Car, Wallet, PiggyBank, CreditCard } from "lucide-react"
import { DataEntrySection } from "@/components/portal/data-entry-section"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PORTAL, DECLARATIONS } from "@/lib/constants/hebrew"

// Field configurations for each section
const REAL_ESTATE_FIELDS = [
  {
    id: "address",
    name: "address",
    label: "כתובת הנכס",
    type: "text" as const,
    placeholder: "רחוב, מספר, עיר",
    required: true,
  },
  {
    id: "type",
    name: "type",
    label: "סוג נכס",
    type: "select" as const,
    options: [
      { value: "apartment", label: "דירה" },
      { value: "house", label: "בית פרטי" },
      { value: "land", label: "קרקע" },
      { value: "commercial", label: "נכס מסחרי" },
    ],
    required: true,
  },
  {
    id: "ownership",
    name: "ownership",
    label: "אחוז בעלות",
    type: "number" as const,
    placeholder: "100",
    required: true,
  },
  {
    id: "value",
    name: "value",
    label: "שווי מוערך",
    type: "currency" as const,
    placeholder: "0",
    required: true,
  },
]

const VEHICLE_FIELDS = [
  {
    id: "make",
    name: "make",
    label: "יצרן",
    type: "text" as const,
    placeholder: "לדוגמה: טויוטה",
    required: true,
  },
  {
    id: "model",
    name: "model",
    label: "דגם",
    type: "text" as const,
    placeholder: "לדוגמה: קורולה",
    required: true,
  },
  {
    id: "year",
    name: "year",
    label: "שנת ייצור",
    type: "number" as const,
    placeholder: "2024",
    required: true,
  },
  {
    id: "value",
    name: "value",
    label: "שווי מוערך",
    type: "currency" as const,
    placeholder: "0",
    required: true,
  },
]

const BANK_ACCOUNT_FIELDS = [
  {
    id: "bank",
    name: "bank",
    label: "שם הבנק",
    type: "select" as const,
    options: [
      { value: "hapoalim", label: "בנק הפועלים" },
      { value: "leumi", label: "בנק לאומי" },
      { value: "discount", label: "בנק דיסקונט" },
      { value: "mizrahi", label: "בנק מזרחי" },
      { value: "first", label: "הבנק הבינלאומי" },
      { value: "other", label: "אחר" },
    ],
    required: true,
  },
  {
    id: "accountNumber",
    name: "accountNumber",
    label: "מספר חשבון",
    type: "text" as const,
    placeholder: "123456",
    required: true,
  },
  {
    id: "balance",
    name: "balance",
    label: "יתרה",
    type: "currency" as const,
    placeholder: "0",
    required: true,
  },
]

const INVESTMENT_FIELDS = [
  {
    id: "institution",
    name: "institution",
    label: "בית השקעות",
    type: "text" as const,
    placeholder: "לדוגמה: מיטב דש",
    required: true,
  },
  {
    id: "type",
    name: "type",
    label: "סוג השקעה",
    type: "select" as const,
    options: [
      { value: "pension", label: "קרן פנסיה" },
      { value: "provident", label: "קופת גמל" },
      { value: "study", label: "קרן השתלמות" },
      { value: "stocks", label: "תיק מניות" },
      { value: "bonds", label: "אגרות חוב" },
      { value: "crypto", label: 'מט"ח/קריפטו' },
      { value: "other", label: "אחר" },
    ],
    required: true,
  },
  {
    id: "value",
    name: "value",
    label: "שווי נוכחי",
    type: "currency" as const,
    placeholder: "0",
    required: true,
  },
]

const LIABILITY_FIELDS = [
  {
    id: "type",
    name: "type",
    label: "סוג התחייבות",
    type: "select" as const,
    options: [
      { value: "mortgage", label: "משכנתא" },
      { value: "car_loan", label: "הלוואת רכב" },
      { value: "personal_loan", label: "הלוואה אישית" },
      { value: "credit_card", label: "יתרת כרטיס אשראי" },
      { value: "other", label: "אחר" },
    ],
    required: true,
  },
  {
    id: "institution",
    name: "institution",
    label: "מוסד מלווה",
    type: "text" as const,
    placeholder: "שם הבנק או הגוף המלווה",
    required: true,
  },
  {
    id: "balance",
    name: "balance",
    label: "יתרת חוב",
    type: "currency" as const,
    placeholder: "0",
    required: true,
  },
]

interface DataItem {
  id: string
  values: Record<string, string>
}

interface SectionData {
  items: DataItem[]
  isComplete: boolean
}

type SectionKey = "realEstate" | "vehicles" | "bankAccounts" | "investments" | "liabilities"

type Sections = Record<SectionKey, SectionData>

const initialSections: Sections = {
  realEstate: { items: [], isComplete: false },
  vehicles: { items: [], isComplete: false },
  bankAccounts: { items: [], isComplete: false },
  investments: { items: [], isComplete: false },
  liabilities: { items: [], isComplete: false },
}

export default function DataEntryPage() {
  const [sections, setSections] = useState<Sections>(initialSections)

  const createNewItem = (): DataItem => ({
    id: crypto.randomUUID(),
    values: {},
  })

  const handleAddItem = (sectionKey: SectionKey) => {
    setSections((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        items: [...prev[sectionKey].items, createNewItem()],
      },
    }))
  }

  const handleUpdateItem = (
    sectionKey: SectionKey,
    itemId: string,
    field: string,
    value: string
  ) => {
    setSections((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        items: prev[sectionKey].items.map((item) =>
          item.id === itemId
            ? { ...item, values: { ...item.values, [field]: value } }
            : item
        ),
      },
    }))
  }

  const handleRemoveItem = (sectionKey: SectionKey, itemId: string) => {
    setSections((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        items: prev[sectionKey].items.filter((item) => item.id !== itemId),
      },
    }))
  }

  // Calculate progress
  const totalSections = Object.keys(sections).length
  const completedSections = Object.values(sections).filter(
    (s) => s.items.length > 0
  ).length
  const progress = (completedSections / totalSections) * 100

  const handleSave = async () => {
    // Mock save - in production this would save to database
    // eslint-disable-next-line no-console
    console.log("Saving data:", sections)
    alert("הנתונים נשמרו בהצלחה!")
  }

  return (
    <div id="main-content" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{PORTAL.tabs.data}</h1>
          <p className="text-muted-foreground">
            מלא את הנתונים הפיננסיים שלך בכל קטגוריה
          </p>
        </div>
        <Button onClick={handleSave}>שמור שינויים</Button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>התקדמות מילוי נתונים</span>
          <span>
            {completedSections}/{totalSections} קטגוריות
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Data Entry Sections */}
      <div className="space-y-4">
        <DataEntrySection
          title={DECLARATIONS.assetTypes.real_estate}
          description="פרטי דירות, בתים, קרקעות ונכסים מסחריים בבעלותך"
          icon={<Building className="h-5 w-5" />}
          fields={REAL_ESTATE_FIELDS}
          items={sections.realEstate.items}
          onAddItem={() => handleAddItem("realEstate")}
          onUpdateItem={(itemId, field, value) =>
            handleUpdateItem("realEstate", itemId, field, value)
          }
          onRemoveItem={(itemId) => handleRemoveItem("realEstate", itemId)}
          isComplete={sections.realEstate.isComplete}
        />

        <DataEntrySection
          title={DECLARATIONS.assetTypes.vehicle}
          description="פרטי רכבים, אופנועים וכלי רכב אחרים בבעלותך"
          icon={<Car className="h-5 w-5" />}
          fields={VEHICLE_FIELDS}
          items={sections.vehicles.items}
          onAddItem={() => handleAddItem("vehicles")}
          onUpdateItem={(itemId, field, value) =>
            handleUpdateItem("vehicles", itemId, field, value)
          }
          onRemoveItem={(itemId) => handleRemoveItem("vehicles", itemId)}
          isComplete={sections.vehicles.isComplete}
        />

        <DataEntrySection
          title={DECLARATIONS.assetTypes.bank_account}
          description="פרטי חשבונות בנק ויתרות"
          icon={<Wallet className="h-5 w-5" />}
          fields={BANK_ACCOUNT_FIELDS}
          items={sections.bankAccounts.items}
          onAddItem={() => handleAddItem("bankAccounts")}
          onUpdateItem={(itemId, field, value) =>
            handleUpdateItem("bankAccounts", itemId, field, value)
          }
          onRemoveItem={(itemId) => handleRemoveItem("bankAccounts", itemId)}
          isComplete={sections.bankAccounts.isComplete}
        />

        <DataEntrySection
          title={DECLARATIONS.assetTypes.investment}
          description="קרנות פנסיה, קופות גמל, קרנות השתלמות ותיקי השקעות"
          icon={<PiggyBank className="h-5 w-5" />}
          fields={INVESTMENT_FIELDS}
          items={sections.investments.items}
          onAddItem={() => handleAddItem("investments")}
          onUpdateItem={(itemId, field, value) =>
            handleUpdateItem("investments", itemId, field, value)
          }
          onRemoveItem={(itemId) => handleRemoveItem("investments", itemId)}
          isComplete={sections.investments.isComplete}
        />

        <DataEntrySection
          title="התחייבויות"
          description="משכנתאות, הלוואות וחובות אחרים"
          icon={<CreditCard className="h-5 w-5" />}
          fields={LIABILITY_FIELDS}
          items={sections.liabilities.items}
          onAddItem={() => handleAddItem("liabilities")}
          onUpdateItem={(itemId, field, value) =>
            handleUpdateItem("liabilities", itemId, field, value)
          }
          onRemoveItem={(itemId) => handleRemoveItem("liabilities", itemId)}
          isComplete={sections.liabilities.isComplete}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button size="lg" onClick={handleSave}>
          שמור את כל השינויים
        </Button>
      </div>
    </div>
  )
}
