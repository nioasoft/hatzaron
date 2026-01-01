"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, User, Building2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { PORTAL } from "@/lib/constants/hebrew"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender: "client" | "accountant"
  senderName: string
  timestamp: Date
  isRead: boolean
}

// Mock messages
const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    content: "שלום ישראל, ברוכים הבאים לפורטל הלקוחות שלנו. אנחנו כאן לעזור לך בהגשת הצהרת ההון.",
    sender: "accountant",
    senderName: "משרד רואי חשבון",
    timestamp: new Date("2024-01-15T10:00:00"),
    isRead: true,
  },
  {
    id: "2",
    content: "תודה רבה! יש לי שאלה לגבי המסמכים הנדרשים. האם צריך להביא דפי בנק מקוריים או שמספיק צילום?",
    sender: "client",
    senderName: "ישראל ישראלי",
    timestamp: new Date("2024-01-15T11:30:00"),
    isRead: true,
  },
  {
    id: "3",
    content: "שאלה מצוינת! צילום או סריקה ברורה של דפי הבנק יספיקו. העיקר שהפרטים יהיו קריאים וברורים. ניתן גם להוריד אותם ישירות מאתר הבנק ולהעלות כקובץ PDF.",
    sender: "accountant",
    senderName: "משרד רואי חשבון",
    timestamp: new Date("2024-01-15T14:00:00"),
    isRead: true,
  },
  {
    id: "4",
    content: "שים לב שהדדליין להגשת ההצהרה הוא בעוד 45 יום. אנא הקפד להעלות את כל המסמכים בזמן.",
    sender: "accountant",
    senderName: "משרד רואי חשבון",
    timestamp: new Date("2024-01-20T09:00:00"),
    isRead: false,
  },
]

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim()) return

    setIsSending(true)

    // Add the new message
    const message: Message = {
      id: crypto.randomUUID(),
      content: newMessage.trim(),
      sender: "client",
      senderName: "ישראל ישראלי",
      timestamp: new Date(),
      isRead: true,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate sending delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return `היום, ${date.toLocaleTimeString("he-IL", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return `אתמול, ${date.toLocaleTimeString("he-IL", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    }
    return date.toLocaleDateString("he-IL", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const unreadCount = messages.filter(
    (m) => !m.isRead && m.sender === "accountant"
  ).length

  return (
    <div id="main-content" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{PORTAL.tabs.messages}</h1>
          <p className="text-muted-foreground">תקשורת עם משרד רואי החשבון</p>
        </div>
        {unreadCount > 0 && (
          <Badge
            className="text-white"
            style={{ backgroundColor: "var(--portal-primary, var(--primary))" }}
          >
            {unreadCount} הודעות חדשות
          </Badge>
        )}
      </div>

      {/* Messages Card */}
      <Card className="flex flex-col h-[calc(100vh-280px)] min-h-[400px]">
        <CardHeader className="border-b shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-muted">
                <Building2 className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">משרד רואי חשבון</CardTitle>
              <p className="text-xs text-muted-foreground">
                זמן תגובה ממוצע: תוך 24 שעות
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            const isClient = message.sender === "client"

            return (
              <div
                key={message.id}
                className={cn("flex gap-3", isClient && "flex-row-reverse")}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback
                    className={cn(
                      isClient
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                    style={
                      isClient
                        ? {
                            backgroundColor:
                              "var(--portal-primary, var(--primary))",
                          }
                        : undefined
                    }
                  >
                    {isClient ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Building2 className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={cn(
                    "flex flex-col max-w-[75%]",
                    isClient && "items-end"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2",
                      isClient
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    )}
                    style={
                      isClient
                        ? {
                            backgroundColor:
                              "var(--portal-primary, var(--primary))",
                          }
                        : undefined
                    }
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 px-1">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Message Input */}
        <div className="border-t p-4 shrink-0">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              title="צרף קובץ"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="הקלד הודעה..."
              className="min-h-[44px] max-h-32 resize-none"
              rows={1}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!newMessage.trim() || isSending}
              style={{ backgroundColor: "var(--portal-primary, var(--primary))" }}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            לחץ Enter לשליחה, Shift+Enter לשורה חדשה
          </p>
        </div>
      </Card>
    </div>
  )
}
