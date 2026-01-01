# Requirements: Super User Admin System

## Overview

מערכת Super User/Admin עבור ניהול מערכת הצהרות ההון. המנהל (Super User יחיד) יוכל לנהל את כל המשרדים שנרשמו למערכת, לעקוב אחרי מנויים והכנסות, ולהתחבר כמשרד לצורך בדיקות (Impersonation).

## Problem Statement

המערכת הנוכחית מיועדת למשרדי רואי חשבון שמנהלים הצהרות הון ללקוחותיהם. אין כרגע מערכת ניהול למנהל המערכת (בעל האפליקציה) שיוכל:
- לראות את כל המשרדים שנרשמו
- לעקוב אחרי תשלומים והכנסות
- להשעות או למחוק משרדים
- לבדוק את המערכת מנקודת מבט של משרד

## User Stories

### As the Super User, I want to:
1. **ראות סקירה כללית** של כל המשרדים, מנויים והכנסות
2. **לנהל משרדים** - לצפות, לערוך, להשעות, למחוק, לשנות תוכנית מנוי
3. **להתחבר כמשרד** (Impersonation) כדי לראות מה הלקוח רואה ולבצע בדיקות
4. **לראות סיכומים פיננסיים** - הכנסה חודשית/שנתית, מנויים פעילים לפי תוכנית

## Functional Requirements

### FR-1: Admin Authentication
- זיהוי Super User לפי משתנה סביבה `SUPER_ADMIN_EMAIL`
- שימוש ב-BetterAuth Admin Plugin לניהול roles
- רק משתמש עם role=admin יכול לגשת ל-`/admin`

### FR-2: Admin Dashboard
- דשבורד נפרד ב-`/admin` עם sidebar וניווט ייעודי
- 4 כרטיסי סטטיסטיקה: סה"כ משרדים, מנויים פעילים, הכנסה חודשית, בתקופת ניסיון
- טבלת משרדים אחרונים (5 אחרונים)

### FR-3: Firms Management
- דף רשימת משרדים עם search/filter
- דף פרטי משרד עם: פרטים, מנוי, סטטיסטיקות פעילות
- פעולות: צפייה, עריכה, השעיה/הפעלה, מחיקה, שינוי תוכנית, Impersonation

### FR-4: Impersonation System
- כפתור "התחבר כמשרד" עם dialog אישור
- באנר צהוב קבוע בראש המסך כשב-Impersonation
- כפתור "יציאה" שמחזיר לדשבורד Admin
- Session נפרד עם timeout של שעה

### FR-5: Financial Summary
- סיכומים בלבד (לא היסטוריה מפורטת)
- הכנסה חודשית כוללת
- מספר מנויים פעילים לפי תוכנית

## Non-Functional Requirements

### NFR-1: Security
- Admin routes מוגנים בצד השרת (layout-level check)
- אי אפשר לעשות Impersonation למשתמשי admin אחרים
- Audit trail דרך שדה `impersonatedBy` ב-session

### NFR-2: UI/UX
- תמיכה ב-RTL (עברית)
- עקביות עם עיצוב הדשבורד הקיים
- שימוש בקומפוננטות shadcn/ui קיימות
- תמיכה ב-dark mode

## Acceptance Criteria

### AC-1: Super User Access
- [ ] רק משתמש עם email תואם ל-`SUPER_ADMIN_EMAIL` יכול לגשת ל-`/admin`
- [ ] משתמשים רגילים מנותבים ל-`/dashboard` אם מנסים לגשת ל-`/admin`
- [ ] Super User יכול לגשת גם ל-`/admin` וגם ל-`/dashboard`

### AC-2: Firms Management
- [ ] רשימת כל המשרדים מוצגת עם פרטים בסיסיים
- [ ] אפשר לחפש ולסנן משרדים
- [ ] אפשר להשעות/להפעיל משרד
- [ ] אפשר למחוק משרד (עם dialog אישור)

### AC-3: Impersonation
- [ ] לחיצה על "התחבר כמשרד" מציגה dialog אישור
- [ ] אחרי אישור, המשתמש מועבר לדשבורד הרגיל עם באנר צהוב
- [ ] הבאנר מציג את שם המשרד והמייל
- [ ] לחיצה על "יציאה" מחזירה לדשבורד Admin

### AC-4: Financial Summary
- [ ] מוצגת הכנסה חודשית כוללת
- [ ] מוצג מספר מנויים פעילים
- [ ] הנתונים הפיננסיים הם mock עד הוספת טבלת subscriptions

## Dependencies

- **BetterAuth** - כבר מותקן ומוגדר
- **BetterAuth Admin Plugin** - צריך להוסיף לקונפיגורציה
- **PostgreSQL + Drizzle ORM** - כבר מוגדר

## Out of Scope

- היסטוריית תשלומים מפורטת
- מערכת הרשאות מרובת admins
- ניהול תוכניות מנוי (pricing) דרך ה-UI
- התראות email לאדמין
- Audit log מלא של פעולות admin
