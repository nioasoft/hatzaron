import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export interface SendDeclarationLinkParams {
  to: string
  clientName: string
  firmName: string
  firmEmail?: string
  portalLink: string
  year: number
}

export async function sendDeclarationLink({
  to,
  clientName,
  firmName,
  firmEmail,
  portalLink,
  year,
}: SendDeclarationLinkParams) {
  if (!resend) {
    console.log(`[Email Simulation] To: ${to}, Link: ${portalLink}`)
    return { success: true, simulated: true }
  }

  const fromEmail = "Hatzaron <onboarding@resend.dev>" // In prod this should be verified domain
  const replyTo = firmEmail || undefined

  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      ...(replyTo && { replyTo }),
      subject: `הצהרת הון לשנת ${year} - ${firmName}`,
      html: `
        <div dir="rtl" style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2563eb;">${firmName}</h2>
          <p>שלום ${clientName},</p>
          <p>אנו נערכים להגשת הצהרת ההון שלך לשנת ${year}.</p>
          <p>כדי לייעל את התהליך, פתחנו עבורך אזור אישי מאובטח להעלאת המסמכים הנדרשים.</p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${portalLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              כניסה לפורטל והעלאת מסמכים
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666;">
            הקישור הינו אישי ומאובטח. אין צורך בסיסמה.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          
          <p style="font-size: 12px; color: #888;">
            נשלח באמצעות מערכת הצהרות הון
          </p>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to send email:", error)
    return { success: false, error }
  }
}
