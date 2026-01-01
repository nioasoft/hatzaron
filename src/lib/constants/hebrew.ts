/**
 * Hebrew text constants for the הצהר-הון application
 * All UI text should be defined here for consistency and easy maintenance
 */

// Application branding
export const APP_NAME = "הצהר-הון";
export const APP_TAGLINE = "פלטפורמה חכמה לרואי חשבון";
export const APP_DESCRIPTION = "נהל הצהרות הון בקלות";

// Navigation
export const NAV = {
  home: "בית",
  pricing: "מחירים",
  faq: "שאלות נפוצות",
  login: "התחברות",
  register: "הרשמה",
  dashboard: "לוח בקרה",
  declarations: "הצהרות הון",
  clients: "לקוחות",
  settings: "הגדרות",
  profile: "פרופיל",
  whiteLabel: "מיתוג",
  billing: "חיוב",
  logout: "התנתקות",
} as const;

// Authentication
export const AUTH = {
  login: {
    title: "התחברות",
    subtitle: "התחבר לחשבון שלך",
    email: "כתובת אימייל",
    emailPlaceholder: "your@email.com",
    password: "סיסמה",
    passwordPlaceholder: "הסיסמה שלך",
    submit: "התחבר",
    submitting: "מתחבר...",
    forgotPassword: "שכחת סיסמה?",
    noAccount: "אין לך חשבון?",
    register: "הירשם עכשיו",
    orContinueWith: "או המשך עם",
    loginWithGoogle: "המשך עם Google",
    passwordResetSuccess: "הסיסמה אופסה בהצלחה. התחבר עם הסיסמה החדשה שלך.",
    loading: "טוען...",
  },
  register: {
    title: "הרשמה",
    subtitle: "צור חשבון חדש",
    name: "שם מלא",
    namePlaceholder: "השם שלך",
    firmName: "שם המשרד",
    email: "כתובת אימייל",
    emailPlaceholder: "your@email.com",
    password: "סיסמה",
    passwordPlaceholder: "צור סיסמה",
    confirmPassword: "אימות סיסמה",
    confirmPasswordPlaceholder: "אמת את הסיסמה",
    submit: "צור חשבון",
    submitting: "יוצר חשבון...",
    hasAccount: "יש לך כבר חשבון?",
    login: "התחבר",
    orContinueWith: "או המשך עם",
    continueWithGoogle: "המשך עם Google",
  },
  forgotPassword: {
    title: "שכחת סיסמה?",
    description: "הזן את כתובת האימייל שלך ונשלח לך קישור לאיפוס הסיסמה",
    email: "כתובת אימייל",
    emailPlaceholder: "your@email.com",
    submit: "שלח קישור איפוס",
    submitting: "שולח...",
    backToLogin: "חזרה להתחברות",
    successMessage: "אם קיים חשבון עם כתובת האימייל הזו, נשלח אליו קישור לאיפוס. בדוק את הטרמינל לקישור האיפוס.",
    rememberPassword: "נזכרת בסיסמה?",
  },
  resetPassword: {
    title: "איפוס סיסמה",
    description: "הזן את הסיסמה החדשה שלך",
    newPassword: "סיסמה חדשה",
    newPasswordPlaceholder: "הזן סיסמה חדשה",
    confirmPassword: "אימות סיסמה",
    confirmPasswordPlaceholder: "אמת את הסיסמה החדשה",
    submit: "אפס סיסמה",
    submitting: "מאפס...",
    invalidToken: "קישור האיפוס אינו תקין או שפג תוקפו.",
    noToken: "לא סופק קישור איפוס.",
    requestNewLink: "בקש קישור חדש",
  },
  errors: {
    invalidCredentials: "פרטי התחברות שגויים",
    emailExists: "כתובת האימייל כבר קיימת במערכת",
    unexpectedError: "אירעה שגיאה לא צפויה",
    failedSignIn: "ההתחברות נכשלה",
    failedSignUp: "יצירת החשבון נכשלה",
    failedResetEmail: "שליחת קישור האיפוס נכשלה",
    failedResetPassword: "איפוס הסיסמה נכשל",
  },
} as const;

// Dashboard
export const DASHBOARD = {
  title: "לוח בקרה",
  welcome: "שלום",
  stats: {
    active: "הצהרות פעילות",
    pending: "ממתינות לאישור",
    completedMonth: "הושלמו החודש",
    nearDeadline: "מתקרבות לדדליין",
  },
  recentDeclarations: "הצהרות אחרונות",
  viewAll: "הצג הכל",
} as const;

// Declarations
export const DECLARATIONS = {
  title: "הצהרות הון",
  newDeclaration: "צור הצהרה חדשה",
  status: {
    draft: "טיוטה",
    pending_documents: "ממתין למסמכים",
    in_review: "בבדיקה",
    submitted: "הוגש",
    completed: "הושלם",
  },
  tableHeaders: {
    client: "לקוח",
    createdAt: "תאריך יצירה",
    deadline: "דדליין",
    status: "סטטוס",
    netWorth: "סכום נטו",
    actions: "פעולות",
  },
  wizard: {
    steps: {
      client: "פרטי לקוח",
      assets: "נכסים",
      liabilities: "התחייבויות",
      documents: "מסמכים",
      review: "סיכום",
    },
    next: "הבא",
    previous: "הקודם",
    submit: "שלח הצהרה",
    saveDraft: "שמור טיוטה",
  },
  assetTypes: {
    real_estate: 'נדל"ן',
    vehicle: "כלי רכב",
    bank_account: "חשבון בנק",
    investment: "השקעות",
    other: "אחר",
  },
} as const;

// Clients
export const CLIENTS = {
  title: "לקוחות",
  addClient: "הוסף לקוח",
  tableHeaders: {
    name: "שם",
    idNumber: "ת.ז.",
    phone: "טלפון",
    activeDeclarations: "הצהרות פעילות",
    actions: "פעולות",
  },
  form: {
    firstName: "שם פרטי",
    lastName: "שם משפחה",
    idNumber: "תעודת זהות",
    phone: "טלפון",
    email: "אימייל (אופציונלי)",
    address: "כתובת",
    notes: "הערות",
    submit: "שמור לקוח",
  },
} as const;

// Settings
export const SETTINGS = {
  title: "הגדרות",
  tabs: {
    profile: "פרופיל",
    whiteLabel: "מיתוג",
    billing: "חיוב",
  },
  profile: {
    accountDetails: "פרטי חשבון",
    updateDetails: "עדכן את פרטי החשבון שלך",
    fullName: "שם מלא",
    firmName: "שם המשרד",
    email: "אימייל",
    phone: "טלפון",
    changePassword: "שינוי סיסמה",
    changePasswordDescription: "עדכן את סיסמת החשבון שלך",
    currentPassword: "סיסמה נוכחית",
    newPassword: "סיסמה חדשה",
    confirmPassword: "אימות סיסמה",
    updatePassword: "עדכן סיסמה",
    saving: "שומר...",
  },
  billing: {
    currentPlan: "התוכנית הנוכחית",
    subscribedTo: "אתה מנוי לתוכנית המקצועית",
    nextBilling: "חיוב הבא",
    updatePayment: "עדכן אמצעי תשלום",
    cardEndingWith: "ויזה המסתיימת ב-",
    availablePlans: "תוכניות זמינות",
    popular: "פופולרי",
    currentPlanButton: "התוכנית הנוכחית",
    contactUs: "צור קשר",
    upgradeNow: "שדרג עכשיו",
    billingHistory: "היסטוריית חיובים",
    recentCharges: "החיובים האחרונים שלך",
    paid: "שולם",
    downloadInvoice: "הורד חשבונית",
    planLabel: "תוכנית מקצועית",
    perMonth: "חודש",
  },
  whiteLabel: {
    title: "הגדרות מיתוג",
    logo: "לוגו",
    uploadLogo: "העלה לוגו",
    primaryColor: "צבע ראשי",
    firmName: "שם המשרד",
    contactEmail: "אימייל ליצירת קשר",
    emailSignature: "חתימת אימייל",
    preview: "תצוגה מקדימה",
    save: "שמור שינויים",
  },
} as const;

// Portal (Client-facing)
export const PORTAL = {
  welcome: "שלום",
  tabs: {
    documents: "מסמכים",
    data: "נתונים",
    status: "סטטוס",
    messages: "הודעות",
  },
  documents: {
    title: "העלאת מסמכים",
    required: "נדרש",
    optional: "אופציונלי",
    dragDrop: "גרור קבצים לכאן או לחץ להעלאה",
    uploading: "מעלה...",
    uploaded: "הועלה בהצלחה",
    types: {
      id_card: "צילום תעודת זהות",
      bank_statements: "דפי בנק",
      mortgage_statement: "אישור יתרת משכנתא",
      vehicle_registration: "רישיון רכב",
      investment_report: "דוח השקעות",
      property_deed: "נסח טאבו",
    },
  },
} as const;

// Common actions
export const ACTIONS = {
  save: "שמור",
  cancel: "ביטול",
  delete: "מחק",
  edit: "ערוך",
  view: "צפה",
  download: "הורד",
  upload: "העלה",
  submit: "שלח",
  confirm: "אישור",
  back: "חזרה",
  next: "הבא",
  close: "סגור",
  search: "חיפוש",
  filter: "סינון",
  export: "ייצוא",
} as const;

// Validation messages
export const VALIDATION = {
  required: "שדה חובה",
  invalidEmail: "כתובת אימייל לא תקינה",
  invalidPhone: "מספר טלפון לא תקין",
  invalidIdNumber: "מספר תעודת זהות לא תקין",
  passwordTooShort: "הסיסמה חייבת להכיל לפחות 8 תווים",
  passwordMismatch: "הסיסמאות אינן תואמות",
} as const;

// Success/Error messages
export const MESSAGES = {
  success: {
    saved: "נשמר בהצלחה",
    deleted: "נמחק בהצלחה",
    uploaded: "הועלה בהצלחה",
    sent: "נשלח בהצלחה",
  },
  error: {
    general: "אירעה שגיאה, נסה שנית",
    notFound: "לא נמצא",
    unauthorized: "אין הרשאה לבצע פעולה זו",
    networkError: "שגיאת רשת, בדוק את החיבור שלך",
  },
} as const;

// Admin section
export const ADMIN = {
  title: "ניהול מערכת",
  nav: {
    dashboard: "סקירה כללית",
    firms: "משרדים",
    settings: "הגדרות",
  },
  stats: {
    totalFirms: "סה״כ משרדים",
    activeSubscriptions: "מנויים פעילים",
    monthlyRevenue: "הכנסה חודשית",
    trialUsers: "בתקופת ניסיון",
  },
  firms: {
    title: "ניהול משרדים",
    subtitle: "ניהול משרדי רואי חשבון",
    tableHeaders: {
      firm: "משרד",
      email: "אימייל",
      plan: "תוכנית",
      status: "סטטוס",
      registeredAt: "תאריך הרשמה",
      actions: "פעולות",
    },
    status: { active: "פעיל", suspended: "מושעה" },
    actions: {
      view: "צפייה בפרטים",
      suspend: "השעה משרד",
      activate: "הפעל משרד",
      delete: "מחק משרד",
      impersonate: "התחבר כמשרד",
    },
    detail: {
      backToList: "חזרה לרשימת המשרדים",
      firmInfo: "פרטי המשרד",
      subscription: "מנוי",
      registeredAt: "תאריך הרשמה",
      status: "סטטוס",
      plan: "תוכנית",
      nextBilling: "חיוב הבא",
      suspending: "משעה...",
      activating: "מפעיל...",
    },
    plans: {
      basic: "בסיסי",
      professional: "מקצועי",
      enterprise: "ארגוני",
    },
  },
  impersonation: {
    banner: "מחובר כ:",
    exit: "יציאה",
    confirmTitle: "התחברות כמשרד",
    confirmDescription: "אתה עומד להתחבר כמשרד זה. תוכל לראות את לוח הבקרה שלהם ולבצע פעולות בשמם.",
    confirm: "התחבר",
    cancel: "ביטול",
  },
} as const;

// Marketing page content
export const MARKETING = {
  hero: {
    headline: "נהל הצהרות הון בקלות",
    subheadline: "פלטפורמה חכמה לרואי חשבון",
    ctaPrimary: "התחל בחינם",
    ctaSecondary: "צפה בהדגמה",
  },
  painPoints: {
    title: "נמאס לך מה...",
    items: [
      "בלאגן במסמכים",
      "עומס עבודה ידני",
      "פספוס דדליינים",
      "חוויית לקוח לא מקצועית",
    ],
  },
  features: {
    title: "הפתרון שלנו",
    items: [
      {
        title: "ניהול הצהרות במקום אחד",
        description: "כל ההצהרות שלך בפלטפורמה אחת מסודרת",
      },
      {
        title: "פורטל לקוח ממותג",
        description: "חוויית לקוח מקצועית עם המיתוג שלך",
      },
      {
        title: "תזכורות אוטומטיות",
        description: "לעולם לא תפספס דדליין",
      },
      {
        title: "מעקב סטטוס בזמן אמת",
        description: "דע תמיד מה מצב כל הצהרה",
      },
      {
        title: "העלאת מסמכים מאובטחת",
        description: "לקוחות מעלים מסמכים בקלות ובבטחה",
      },
      {
        title: "דוחות וסטטיסטיקות",
        description: "קבל תובנות על העסק שלך",
      },
    ],
  },
  howItWorks: {
    title: "איך זה עובד?",
    steps: [
      {
        title: "צור הצהרה חדשה",
        description: "הזן פרטי לקוח וצור הצהרת הון בלחיצה",
      },
      {
        title: "הלקוח מעלה מסמכים",
        description: "הלקוח מקבל קישור להעלאת מסמכים בפורטל הממותג שלך",
      },
      {
        title: "סיים והגש",
        description: "בדוק, אשר והגש - הכל במקום אחד",
      },
    ],
  },
  pricing: {
    title: "תוכניות מחירים",
    plans: [
      {
        name: "בסיסי",
        price: "99",
        currency: "₪",
        period: "לחודש",
        features: ["עד 10 הצהרות בחודש", "פורטל לקוח בסיסי", "תמיכה באימייל"],
      },
      {
        name: "מקצועי",
        price: "249",
        currency: "₪",
        period: "לחודש",
        features: [
          "עד 50 הצהרות בחודש",
          "פורטל לקוח מלא",
          "מיתוג בסיסי",
          "תמיכה מועדפת",
        ],
        popular: true,
      },
      {
        name: "ארגוני",
        price: "צור קשר",
        currency: "",
        period: "",
        features: [
          "הצהרות ללא הגבלה",
          "מיתוג מלא",
          "API access",
          "מנהל לקוח ייעודי",
        ],
      },
    ],
  },
  faq: {
    title: "שאלות נפוצות",
    items: [
      {
        question: "מה זה הצהרת הון?",
        answer:
          "הצהרת הון היא מסמך שמוגש לרשות המסים ומציג תמונת מצב של נכסי אדם בניכוי התחייבויותיו בתאריך מסוים.",
      },
      {
        question: "כמה זמן יש להגיש הצהרת הון?",
        answer:
          "יש להגיש את ההצהרה תוך 120 יום מיום קבלת הדרישה מרשות המסים.",
      },
      {
        question: "האם המערכת מאובטחת?",
        answer:
          "כן, אנו משתמשים בהצפנה מקצה לקצה ועומדים בתקני האבטחה המחמירים ביותר.",
      },
      {
        question: "האם יש תקופת ניסיון?",
        answer: "כן, תוכל לנסות את המערכת חינם למשך 14 יום ללא התחייבות.",
      },
    ],
  },
  cta: {
    title: "מוכנים להתחיל?",
    subtitle: "הצטרפו לעשרות רואי חשבון שכבר משתמשים בהצהר-הון",
    button: "התחל בחינם",
  },
} as const;
