"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ACTIONS } from "@/lib/constants/hebrew"

interface BankAccountFormData {
  bank: string
  accountNumber: string
  balance: number
}

interface BankAccountFormProps {
  onSubmit: (data: BankAccountFormData) => void
  onCancel: () => void
}

const BANKS = [
  { value: "leumi", label: "בנק לאומי" },
  { value: "hapoalim", label: "בנק הפועלים" },
  { value: "discount", label: "בנק דיסקונט" },
  { value: "mizrahi", label: "בנק מזרחי-טפחות" },
  { value: "benleumi", label: "הבנק הבינלאומי" },
  { value: "yahav", label: "בנק יהב" },
  { value: "merkantil", label: "בנק מרכנתיל" },
  { value: "massad", label: "בנק מסד" },
  { value: "otsar", label: "בנק אוצר החייל" },
  { value: "jerusalem", label: "בנק ירושלים" },
  { value: "other", label: "אחר" },
]

export function BankAccountForm({ onSubmit, onCancel }: BankAccountFormProps) {
  const [bank, setBank] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [balance, setBalance] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const bankLabel = BANKS.find((b) => b.value === bank)?.label || bank
    onSubmit({
      bank: bankLabel,
      accountNumber,
      balance: Number(balance) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bank">בנק</Label>
          <Select value={bank} onValueChange={setBank}>
            <SelectTrigger>
              <SelectValue placeholder="בחר בנק" />
            </SelectTrigger>
            <SelectContent>
              {BANKS.map((b) => (
                <SelectItem key={b.value} value={b.value}>
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber">מספר חשבון</Label>
          <Input
            id="accountNumber"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="123456"
            dir="ltr"
            className="text-start"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="balance">יתרה (₪)</Label>
          <Input
            id="balance"
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="100,000"
            dir="ltr"
            className="text-start"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {ACTIONS.cancel}
        </Button>
        <Button type="submit" disabled={!bank || !accountNumber || !balance}>
          {ACTIONS.save}
        </Button>
      </div>
    </form>
  )
}
