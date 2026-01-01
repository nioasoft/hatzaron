"use client"

import { useState } from "react"
import { DocumentChecklist, type DocumentItem } from "@/components/documents/checklist"
import { DocumentUploader } from "@/components/documents/uploader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PORTAL } from "@/lib/constants/hebrew"

// Document types configuration
const REQUIRED_DOCUMENTS: DocumentItem[] = [
  {
    type: "id_card",
    label: PORTAL.documents.types.id_card,
    required: true,
    uploaded: false,
  },
  {
    type: "bank_statements",
    label: PORTAL.documents.types.bank_statements,
    required: true,
    uploaded: true,
    fileName: "bank_statements_jan2024.pdf",
  },
  {
    type: "mortgage_statement",
    label: PORTAL.documents.types.mortgage_statement,
    required: false,
    uploaded: false,
  },
  {
    type: "vehicle_registration",
    label: PORTAL.documents.types.vehicle_registration,
    required: false,
    uploaded: false,
  },
  {
    type: "investment_report",
    label: PORTAL.documents.types.investment_report,
    required: false,
    uploaded: true,
    fileName: "investment_report_2024.pdf",
  },
  {
    type: "property_deed",
    label: PORTAL.documents.types.property_deed,
    required: false,
    uploaded: false,
  },
]

// Document descriptions
const DOCUMENT_DESCRIPTIONS: Record<string, string> = {
  id_card: "צילום ברור משני צידי תעודת הזהות",
  bank_statements: "דפי חשבון מ-3 החודשים האחרונים מכל חשבונות הבנק",
  mortgage_statement: "אישור יתרת משכנתא עדכני מהבנק",
  vehicle_registration: "רישיון רכב עדכני לכל הרכבים בבעלותך",
  investment_report: "דוח תיק השקעות עדכני מבית ההשקעות",
  property_deed: "נסח טאבו עדכני לכל נכסי הנדל&quot;ן בבעלותך",
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>(REQUIRED_DOCUMENTS)
  const [selectedType, setSelectedType] = useState<string>("id_card")

  const selectedDoc = documents.find((d) => d.type === selectedType)

  const handleUpload = async (file: File) => {
    // Mock upload - in production this would upload to storage
    // eslint-disable-next-line no-console
    console.log("Uploading file:", file.name, "for document type:", selectedType)

    // Simulate successful upload
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update document status
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.type === selectedType
          ? { ...doc, uploaded: true, fileName: file.name }
          : doc
      )
    )
  }

  return (
    <div id="main-content" className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{PORTAL.documents.title}</h1>
        <p className="text-muted-foreground">
          העלה את המסמכים הנדרשים להצהרת ההון שלך
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Checklist - Sidebar */}
        <div className="lg:col-span-1">
          <DocumentChecklist
            documents={documents}
            selectedType={selectedType}
            onSelect={setSelectedType}
          />
        </div>

        {/* Upload Area - Main */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{selectedDoc?.label}</CardTitle>
              <CardDescription>
                {selectedDoc ? DOCUMENT_DESCRIPTIONS[selectedDoc.type] : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDoc && (
                <DocumentUploader
                  documentType={selectedDoc.type}
                  label={selectedDoc.label}
                  description={DOCUMENT_DESCRIPTIONS[selectedDoc.type] ?? ""}
                  onUpload={handleUpload}
                  existingFile={
                    selectedDoc.uploaded && selectedDoc.fileName
                      ? { name: selectedDoc.fileName, url: "#" }
                      : null
                  }
                />
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">טיפים להעלאה מוצלחת</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  ודא שהמסמך ברור וקריא
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  העלה קבצים בפורמט PDF, JPG או PNG
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  גודל מקסימלי: 10MB לקובץ
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  ניתן להעלות מספר קבצים לכל סוג מסמך
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
