"use client"

import { DocumentUploader } from "@/components/documents/uploader"

export interface DocumentCategory {
  id: string
  label: string
  description?: string
  required?: boolean
  items: {
    id: string
    label: string
    description?: string
  }[]
}

interface StepDocumentsProps {
  category: DocumentCategory
  uploadedFiles: Record<string, boolean> // Map of file ID -> exists
  onUpload: (fileId: string, file: File) => void
}

export function StepDocuments({ category, uploadedFiles, onUpload }: StepDocumentsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{category.label}</h2>
        {category.description && (
          <p className="text-sm text-muted-foreground">{category.description}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {category.items.map((item) => (
          <DocumentUploader
            key={item.id}
            documentType={item.id}
            label={item.label}
            description={item.description}
            existingFile={uploadedFiles[item.id] ? { name: "קובץ הועלה", url: "#" } : null}
            onUpload={async (file) => onUpload(item.id, file)}
          />
        ))}
      </div>
    </div>
  )
}