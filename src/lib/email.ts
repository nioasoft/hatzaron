import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

// ============================================================
// Types
// ============================================================

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

// ============================================================
// Reminder Email
// ============================================================

export interface SendReminderEmailParams {
  to: string
  clientName: string
  firmName: string
  firmEmail?: string | undefined
  portalLink: string
  year: number
  reminderType: "documents_request" | "status_update" | "general"
  customMessage?: string | undefined
}

export async function sendReminderEmail({
  to,
  clientName,
  firmName,
  firmEmail,
  portalLink,
  year,
  reminderType,
  customMessage,
}: SendReminderEmailParams) {
  if (!resend) {
    console.log(`[Email Simulation] Reminder to: ${to}, Type: ${reminderType}`)
    return { success: true, simulated: true }
  }

  const fromEmail = "Hatzaron <onboarding@resend.dev>"
  const replyTo = firmEmail || undefined

  const subject = getEmailSubject(reminderType, year, firmName)
  const html = getEmailHtml(reminderType, clientName, firmName, year, portalLink, customMessage)

  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      ...(replyTo && { replyTo }),
      subject,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to send reminder email:", error)
    return { success: false, error }
  }
}

function getEmailSubject(type: string, year: number, firmName: string): string {
  switch (type) {
    case "documents_request":
      return `תזכורת: העלאת מסמכים להצהרת הון ${year} - ${firmName}`
    case "status_update":
      return `עדכון סטטוס הצהרת הון ${year} - ${firmName}`
    default:
      return `הודעה מ${firmName} - הצהרת הון ${year}`
  }
}

function getEmailHtml(
  type: string,
  clientName: string,
  firmName: string,
  _year: number,
  portalLink: string,
  customMessage?: string
): string {
  // Note: _year is available for future use in templates if needed
  const mainMessage = customMessage || getDefaultMessage(type)
  const buttonText = type === "documents_request" ? "העלאת מסמכים" : "צפייה בפורטל"

  return `
    <div dir="rtl" style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #2563eb;">${firmName}</h2>
      <p>שלום ${clientName},</p>
      <p>${mainMessage}</p>

      ${portalLink ? `
      <div style="margin: 30px 0; text-align: center;">
        <a href="${portalLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          ${buttonText}
        </a>
      </div>
      ` : ""}

      <p style="font-size: 14px; color: #666;">
        בכל שאלה, אנחנו לשירותך.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

      <p style="font-size: 12px; color: #888;">
        נשלח באמצעות מערכת הצהרות הון
      </p>
    </div>
  `
}

function getDefaultMessage(type: string): string {
  switch (type) {
    case "documents_request":
      return "אנו מזכירים לך להעלות את המסמכים הנדרשים לצורך הכנת הצהרת ההון שלך. העלאת המסמכים בהקדם תאפשר לנו להתקדם בתהליך."
    case "status_update":
      return "אנו רוצים לעדכן אותך לגבי סטטוס הצהרת ההון שלך. לפרטים נוספים, אנא היכנס לפורטל."
    default:
      return "יש לנו הודעה חשובה עבורך בנוגע להצהרת ההון שלך."
  }
}
