"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Building, CreditCard, FileUp, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DECLARATIONS } from "@/lib/constants/hebrew"
import { cn } from "@/lib/utils"
import { StepAssets } from "./step-assets"
import { StepClient } from "./step-client"
import { StepDocuments } from "./step-documents"
import { StepLiabilities } from "./step-liabilities"
import { StepReview } from "./step-review"

const WIZARD_STEPS = [
  { id: "client", label: DECLARATIONS.wizard.steps.client, icon: User },
  { id: "assets", label: DECLARATIONS.wizard.steps.assets, icon: Building },
  {
    id: "liabilities",
    label: DECLARATIONS.wizard.steps.liabilities,
    icon: CreditCard,
  },
  { id: "documents", label: DECLARATIONS.wizard.steps.documents, icon: FileUp },
  { id: "review", label: DECLARATIONS.wizard.steps.review, icon: CheckCircle },
] as const

export type WizardStep = (typeof WIZARD_STEPS)[number]["id"]

export interface ClientData {
  firstName: string
  lastName: string
  idNumber: string
  phone: string
  email: string
  address: string
}

export interface RealEstateAsset {
  id: string
  type: string
  value: number
  location: string
  description: string
}

export interface VehicleAsset {
  id: string
  type: string
  value: number
  model: string
  year: string
  licensePlate: string
}

export interface BankAccountAsset {
  id: string
  bank: string
  accountNumber: string
  balance: number
}

export interface InvestmentAsset {
  id: string
  type: string
  institution: string
  value: number
}

export interface Liability {
  id: string
  type: string
  amount: number
  institution: string
  description: string
}

export interface AssetsData {
  realEstate: RealEstateAsset[]
  vehicles: VehicleAsset[]
  bankAccounts: BankAccountAsset[]
  investments: InvestmentAsset[]
}

export interface DocumentData {
  idCard: boolean
  bankStatements: boolean
  mortgageStatement: boolean
  vehicleRegistration: boolean
  investmentReport: boolean
  propertyDeed: boolean
}

export interface WizardData {
  client: ClientData
  assets: AssetsData
  liabilities: Liability[]
  documents: DocumentData
}

const initialData: WizardData = {
  client: {
    firstName: "",
    lastName: "",
    idNumber: "",
    phone: "",
    email: "",
    address: "",
  },
  assets: {
    realEstate: [],
    vehicles: [],
    bankAccounts: [],
    investments: [],
  },
  liabilities: [],
  documents: {
    idCard: false,
    bankStatements: false,
    mortgageStatement: false,
    vehicleRegistration: false,
    investmentReport: false,
    propertyDeed: false,
  },
}

export function DeclarationWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<WizardStep>("client")
  const [data, setData] = useState<WizardData>(initialData)

  const currentStepIndex = WIZARD_STEPS.findIndex((s) => s.id === currentStep)

  const handleNext = () => {
    const nextStep = WIZARD_STEPS[currentStepIndex + 1]
    if (nextStep) {
      setCurrentStep(nextStep.id)
    }
  }

  const handlePrevious = () => {
    const prevStep = WIZARD_STEPS[currentStepIndex - 1]
    if (prevStep) {
      setCurrentStep(prevStep.id)
    }
  }

  const handleSubmit = () => {
    // TODO: Submit to API
    void data
    router.push("/dashboard/declarations")
  }

  const handleSaveDraft = () => {
    // TODO: Save draft to API
    void data
    router.push("/dashboard/declarations")
  }

  const updateClientData = (clientData: Partial<ClientData>) => {
    setData((prev) => ({
      ...prev,
      client: { ...prev.client, ...clientData },
    }))
  }

  const updateAssetsData = (assetsData: Partial<AssetsData>) => {
    setData((prev) => ({
      ...prev,
      assets: { ...prev.assets, ...assetsData },
    }))
  }

  const updateLiabilitiesData = (liabilities: Liability[]) => {
    setData((prev) => ({
      ...prev,
      liabilities,
    }))
  }

  const updateDocumentsData = (documentsData: Partial<DocumentData>) => {
    setData((prev) => ({
      ...prev,
      documents: { ...prev.documents, ...documentsData },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          {WIZARD_STEPS.map((step, index) => {
            const Icon = step.icon
            const isActive = step.id === currentStep
            const isCompleted = index < currentStepIndex

            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => {
                    if (index <= currentStepIndex) {
                      setCurrentStep(step.id)
                    }
                  }}
                  disabled={index > currentStepIndex}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg p-2 transition-colors",
                    isActive && "text-primary",
                    isCompleted &&
                      "cursor-pointer text-primary hover:bg-muted",
                    !isActive &&
                      !isCompleted &&
                      "cursor-not-allowed text-muted-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                      isActive && "border-primary bg-primary text-primary-foreground",
                      isCompleted && "border-primary bg-primary/10",
                      !isActive && !isCompleted && "border-muted-foreground/30"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium">{step.label}</span>
                </button>
                {index < WIZARD_STEPS.length - 1 && (
                  <div
                    className={cn(
                      "mx-1 h-0.5 w-8",
                      index < currentStepIndex
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {currentStep === "client" && (
            <StepClient data={data.client} onUpdate={updateClientData} />
          )}
          {currentStep === "assets" && (
            <StepAssets data={data.assets} onUpdate={updateAssetsData} />
          )}
          {currentStep === "liabilities" && (
            <StepLiabilities
              data={data.liabilities}
              onUpdate={updateLiabilitiesData}
            />
          )}
          {currentStep === "documents" && (
            <StepDocuments data={data.documents} onUpdate={updateDocumentsData} />
          )}
          {currentStep === "review" && <StepReview data={data} />}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <div>
          {currentStepIndex > 0 && (
            <Button variant="outline" onClick={handlePrevious}>
              {DECLARATIONS.wizard.previous}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={handleSaveDraft}>
            {DECLARATIONS.wizard.saveDraft}
          </Button>
          {currentStep === "review" ? (
            <Button onClick={handleSubmit}>
              {DECLARATIONS.wizard.submit}
            </Button>
          ) : (
            <Button onClick={handleNext}>{DECLARATIONS.wizard.next}</Button>
          )}
        </div>
      </div>
    </div>
  )
}
