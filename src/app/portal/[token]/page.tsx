import { notFound } from "next/navigation"
import { getPortalData } from "@/app/portal/actions"
import { DeclarationWizard } from "@/components/declarations/wizard"

interface PortalPageProps {
  params: Promise<{ token: string }>
}

export default async function PortalPage({ params }: PortalPageProps) {
  const { token } = await params
  const data = await getPortalData(token)

  if (!data) {
    notFound()
  }

  return (
    <DeclarationWizard
      initialUploadedFiles={data.uploadedFiles}
      declarationId={data.declaration.id}
      publicToken={data.declaration.publicToken}
    />
  )
}
