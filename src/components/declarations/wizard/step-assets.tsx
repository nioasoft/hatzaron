"use client"

import { useState } from "react"
import { Plus, Trash2, Building, Car, Wallet, TrendingUp } from "lucide-react"
import { BankAccountForm } from "@/components/forms/bank-account-form"
import { InvestmentForm } from "@/components/forms/investment-form"
import { RealEstateForm } from "@/components/forms/real-estate-form"
import { VehicleForm } from "@/components/forms/vehicle-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DECLARATIONS } from "@/lib/constants/hebrew"
import { formatCurrency } from "@/lib/utils"
import type {
  AssetsData,
  RealEstateAsset,
  VehicleAsset,
  BankAccountAsset,
  InvestmentAsset,
} from "./index"

interface StepAssetsProps {
  data: AssetsData
  onUpdate: (data: Partial<AssetsData>) => void
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function StepAssets({ data, onUpdate }: StepAssetsProps) {
  const [showRealEstateForm, setShowRealEstateForm] = useState(false)
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [showBankAccountForm, setShowBankAccountForm] = useState(false)
  const [showInvestmentForm, setShowInvestmentForm] = useState(false)

  const handleAddRealEstate = (asset: Omit<RealEstateAsset, "id">) => {
    onUpdate({
      realEstate: [...data.realEstate, { ...asset, id: generateId() }],
    })
    setShowRealEstateForm(false)
  }

  const handleRemoveRealEstate = (id: string) => {
    onUpdate({
      realEstate: data.realEstate.filter((a) => a.id !== id),
    })
  }

  const handleAddVehicle = (asset: Omit<VehicleAsset, "id">) => {
    onUpdate({
      vehicles: [...data.vehicles, { ...asset, id: generateId() }],
    })
    setShowVehicleForm(false)
  }

  const handleRemoveVehicle = (id: string) => {
    onUpdate({
      vehicles: data.vehicles.filter((a) => a.id !== id),
    })
  }

  const handleAddBankAccount = (asset: Omit<BankAccountAsset, "id">) => {
    onUpdate({
      bankAccounts: [...data.bankAccounts, { ...asset, id: generateId() }],
    })
    setShowBankAccountForm(false)
  }

  const handleRemoveBankAccount = (id: string) => {
    onUpdate({
      bankAccounts: data.bankAccounts.filter((a) => a.id !== id),
    })
  }

  const handleAddInvestment = (asset: Omit<InvestmentAsset, "id">) => {
    onUpdate({
      investments: [...data.investments, { ...asset, id: generateId() }],
    })
    setShowInvestmentForm(false)
  }

  const handleRemoveInvestment = (id: string) => {
    onUpdate({
      investments: data.investments.filter((a) => a.id !== id),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">נכסים</h2>
        <p className="text-sm text-muted-foreground">
          הוסף את כל הנכסים של הלקוח
        </p>
      </div>

      <Tabs defaultValue="realEstate" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="realEstate" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">
              {DECLARATIONS.assetTypes.real_estate}
            </span>
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            <span className="hidden sm:inline">
              {DECLARATIONS.assetTypes.vehicle}
            </span>
          </TabsTrigger>
          <TabsTrigger value="bankAccounts" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">
              {DECLARATIONS.assetTypes.bank_account}
            </span>
          </TabsTrigger>
          <TabsTrigger value="investments" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">
              {DECLARATIONS.assetTypes.investment}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Real Estate Tab */}
        <TabsContent value="realEstate" className="mt-6 space-y-4">
          {data.realEstate.map((asset) => (
            <Card key={asset.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{asset.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {asset.location}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-medium" dir="ltr">
                    {formatCurrency(asset.value)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveRealEstate(asset.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {showRealEstateForm ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  הוספת {DECLARATIONS.assetTypes.real_estate}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RealEstateForm
                  onSubmit={handleAddRealEstate}
                  onCancel={() => setShowRealEstateForm(false)}
                />
              </CardContent>
            </Card>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowRealEstateForm(true)}
            >
              <Plus className="h-4 w-4 me-2" />
              הוסף {DECLARATIONS.assetTypes.real_estate}
            </Button>
          )}
        </TabsContent>

        {/* Vehicles Tab */}
        <TabsContent value="vehicles" className="mt-6 space-y-4">
          {data.vehicles.map((asset) => (
            <Card key={asset.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{asset.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {asset.model} ({asset.year})
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-medium" dir="ltr">
                    {formatCurrency(asset.value)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveVehicle(asset.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {showVehicleForm ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  הוספת {DECLARATIONS.assetTypes.vehicle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VehicleForm
                  onSubmit={handleAddVehicle}
                  onCancel={() => setShowVehicleForm(false)}
                />
              </CardContent>
            </Card>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowVehicleForm(true)}
            >
              <Plus className="h-4 w-4 me-2" />
              הוסף {DECLARATIONS.assetTypes.vehicle}
            </Button>
          )}
        </TabsContent>

        {/* Bank Accounts Tab */}
        <TabsContent value="bankAccounts" className="mt-6 space-y-4">
          {data.bankAccounts.map((asset) => (
            <Card key={asset.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{asset.bank}</p>
                  <p className="text-sm text-muted-foreground" dir="ltr">
                    ****{asset.accountNumber.slice(-4)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-medium" dir="ltr">
                    {formatCurrency(asset.balance)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveBankAccount(asset.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {showBankAccountForm ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  הוספת {DECLARATIONS.assetTypes.bank_account}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BankAccountForm
                  onSubmit={handleAddBankAccount}
                  onCancel={() => setShowBankAccountForm(false)}
                />
              </CardContent>
            </Card>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowBankAccountForm(true)}
            >
              <Plus className="h-4 w-4 me-2" />
              הוסף {DECLARATIONS.assetTypes.bank_account}
            </Button>
          )}
        </TabsContent>

        {/* Investments Tab */}
        <TabsContent value="investments" className="mt-6 space-y-4">
          {data.investments.map((asset) => (
            <Card key={asset.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{asset.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {asset.institution}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-medium" dir="ltr">
                    {formatCurrency(asset.value)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveInvestment(asset.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {showInvestmentForm ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  הוספת {DECLARATIONS.assetTypes.investment}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InvestmentForm
                  onSubmit={handleAddInvestment}
                  onCancel={() => setShowInvestmentForm(false)}
                />
              </CardContent>
            </Card>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowInvestmentForm(true)}
            >
              <Plus className="h-4 w-4 me-2" />
              הוסף {DECLARATIONS.assetTypes.investment}
            </Button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
