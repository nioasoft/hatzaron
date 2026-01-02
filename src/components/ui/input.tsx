import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  // Auto-detect direction for specific types to ensure numbers/emails display correctly in RTL
  const isLtrType = type === "email" || type === "tel" || type === "number" || type === "url" || type === "password";
  
  return (
    <input
      type={type}
      data-slot="input"
      dir={isLtrType ? "ltr" : props.dir}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        // Force right alignment for LTR inputs in our RTL layout, unless overridden
        isLtrType && "text-right",
        className
      )}
      {...props}
    />
  )
}

export { Input }
