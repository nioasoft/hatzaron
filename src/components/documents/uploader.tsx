"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, X, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PORTAL } from "@/lib/constants/hebrew"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  name: string
  size: number
  progress: number
  status: "uploading" | "success" | "error"
  error?: string
}

interface DocumentUploaderProps {
  documentType: string
  label: string
  description?: string | undefined
  accept?: string
  maxSize?: number // in MB
  onUpload?: (file: File) => Promise<void>
  existingFile?: { name: string; url: string } | null
}

export function DocumentUploader({
  documentType,
  label,
  description,
  accept = "image/*,.pdf",
  maxSize = 10,
  onUpload,
  existingFile,
}: DocumentUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        const newFile: UploadedFile = {
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          progress: 0,
          status: "error",
          error: `הקובץ גדול מדי (מקסימום ${maxSize}MB)`,
        }
        setFiles((prev) => [...prev, newFile])
        return
      }

      const fileId = crypto.randomUUID()
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        progress: 0,
        status: "uploading",
      }
      setFiles((prev) => [...prev, newFile])

      // Simulate upload progress
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId && f.progress < 90
              ? { ...f, progress: f.progress + 10 }
              : f
          )
        )
      }, 200)

      try {
        if (onUpload) {
          await onUpload(file)
        } else {
          // Mock upload delay
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }

        clearInterval(interval)
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress: 100, status: "success" } : f
          )
        )
      } catch {
        clearInterval(interval)
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, status: "error", error: "שגיאה בהעלאה" }
              : f
          )
        )
      }
    },
    [maxSize, onUpload]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFiles = Array.from(e.dataTransfer.files)
      droppedFiles.forEach(handleFile)
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    selectedFiles.forEach(handleFile)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const hasSuccessfulUpload = files.some((f) => f.status === "success") || existingFile

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{label}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {hasSuccessfulUpload && (
          <div className="flex items-center gap-1.5 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm">{PORTAL.documents.uploaded}</span>
          </div>
        )}
      </div>

      {/* Existing File */}
      {existingFile && (
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">{existingFile.name}</p>
            <p className="text-xs text-muted-foreground">קובץ קיים</p>
          </div>
          <Button variant="ghost" size="sm">
            החלף
          </Button>
        </div>
      )}

      {/* Drop Zone */}
      {!existingFile && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
            data-document-type={documentType}
          />
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            {PORTAL.documents.dragDrop}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF, JPG, PNG (עד {maxSize}MB)
          </p>
        </div>
      )}

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg",
                file.status === "error" ? "bg-destructive/10" : "bg-muted/50"
              )}
            >
              {file.status === "uploading" ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : file.status === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-destructive" />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                {file.status === "uploading" ? (
                  <div className="mt-1">
                    <Progress value={file.progress} className="h-1" />
                  </div>
                ) : file.status === "error" ? (
                  <p className="text-xs text-destructive">{file.error}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => removeFile(file.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
