import { pgTable, text, timestamp, boolean, index, jsonb, integer, date, numeric } from "drizzle-orm/pg-core";

// IMPORTANT! ID fields should ALWAYS use UUID types or CUIDs as text, EXCEPT the BetterAuth tables which handle their own IDs.

// --- Firms (The CPAs/Offices) ---
export const firm = pgTable("firm", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").unique(), // For vanity URLs e.g. app.com/firm-name
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color").default("#2563eb"), // Default blue
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  address: text("address"),
  isActive: boolean("is_active").default(true).notNull(),
  settings: jsonb("settings").default({}), // For email templates, SMS config, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// --- Auth Tables (Better Auth) ---

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    
    // Admin plugin & Role fields
    role: text("role").default("user"), // 'super_admin', 'firm_admin', 'firm_employee', 'client'
    banned: boolean("banned").default(false),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires"),

    // Relation to Firm
    firmId: text("firm_id").references(() => firm.id),
  },
  (table) => [index("user_email_idx").on(table.email)]
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    // Admin plugin fields
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [
    index("session_user_id_idx").on(table.userId),
    index("session_token_idx").on(table.token),
  ]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("account_user_id_idx").on(table.userId),
    index("account_provider_account_idx").on(table.providerId, table.accountId),
  ]
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// --- Business Logic Tables ---

// Clients: The entities served by the Firm
export const client = pgTable("client", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  firmId: text("firm_id").notNull().references(() => firm.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => user.id), // Link to auth user once registered
  
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  idNumber: text("id_number"), // Teudat Zehut
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  
  status: text("status").default("active"), // 'active', 'inactive', 'lead'
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Declarations: Specific Capital Declaration instances
export const declaration = pgTable("declaration", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  clientId: text("client_id").notNull().references(() => client.id, { onDelete: "cascade" }),
  firmId: text("firm_id").notNull().references(() => firm.id), // Denormalized for query perf
  
  // Basic Info
  year: integer("year"), // The tax year related to the declaration
  declarationDate: timestamp("declaration_date"), // The specific "cut-off" date
  subject: text("subject").default("הצהרת הון"),
  notes: text("notes"),
  
  // Portal Access
  publicToken: text("public_token").unique(), // For public access without login
  portalAccessedAt: timestamp("portal_accessed_at"),
  portalAccessCount: integer("portal_access_count").default(0),
  
  // Assignment & Priority
  priority: text("priority").default("normal"), // 'normal', 'urgent', 'critical'
  assignedTo: text("assigned_to").references(() => user.id), // Firm employee
  assignedAt: timestamp("assigned_at"),

  // Status
  status: text("status").default("draft"), 
  // 'draft', 'sent', 'in_progress', 'waiting_documents', 'documents_received', 
  // 'reviewing', 'in_preparation', 'pending_approval', 'submitted', 'waiting'

  // Deadlines
  taxAuthorityDueDate: date("tax_authority_due_date"),
  internalDueDate: date("internal_due_date"),

  // Submission
  submittedAt: timestamp("submitted_at"),
  submissionScreenshotPath: text("submission_screenshot_path"),
  wasSubmittedLate: boolean("was_submitted_late").default(false),

  // Penalties (if submitted late)
  penaltyAmount: numeric("penalty_amount"),
  penaltyStatus: text("penalty_status"), // 'received', 'appeal_submitted', 'cancelled', 'paid_by_client', 'paid_by_office'
  penaltyReceivedDate: date("penalty_received_date"),
  penaltyNotes: text("penalty_notes"),
  appealDate: date("appeal_date"),
  appealNotes: text("appeal_notes"),
  penaltyPaidDate: date("penalty_paid_date"),
  penaltyPaidAmount: numeric("penalty_paid_amount"),
  penaltyPaidBy: text("penalty_paid_by"), // 'client', 'office'
  
  data: jsonb("data").default({}),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Documents: Files uploaded by client or firm
export const document = pgTable("document", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  declarationId: text("declaration_id").notNull().references(() => declaration.id, { onDelete: "cascade" }),
  uploadedBy: text("uploaded_by").references(() => user.id), // Who uploaded it (null if public portal)
  
  category: text("category").notNull(), // 'bank', 'real_estate', 'insurance', 'vehicles', 'abroad', 'other', 'general'
  type: text("type"), // 'application/pdf', 'image/jpeg', etc. (Mime Type)
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  
  status: text("status").default("pending"), // 'pending', 'approved', 'rejected'
  rejectionReason: text("rejection_reason"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// History: Status changes log
export const declarationStatusHistory = pgTable("declaration_status_history", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  declarationId: text("declaration_id").notNull().references(() => declaration.id, { onDelete: "cascade" }),
  firmId: text("firm_id").notNull().references(() => firm.id),
  
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  notes: text("notes"),
  changedBy: text("changed_by").references(() => user.id), // Null if system/public
  changedAt: timestamp("changed_at").defaultNow().notNull(),
});

// Communication: Log of calls, messages, letters
export const declarationCommunication = pgTable("declaration_communication", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  declarationId: text("declaration_id").notNull().references(() => declaration.id, { onDelete: "cascade" }),
  firmId: text("firm_id").notNull().references(() => firm.id),
  
  type: text("type").notNull(), // 'letter', 'phone_call', 'whatsapp', 'note'
  direction: text("direction").notNull(), // 'outbound', 'inbound'
  subject: text("subject"),
  content: text("content"),
  outcome: text("outcome"),
  
  communicatedAt: timestamp("communicated_at").defaultNow().notNull(),
  createdBy: text("created_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
