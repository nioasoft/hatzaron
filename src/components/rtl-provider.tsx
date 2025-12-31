"use client";

import { createContext, useContext, type ReactNode } from "react";

interface RTLContextValue {
  direction: "rtl" | "ltr";
  isRTL: boolean;
}

const RTLContext = createContext<RTLContextValue>({
  direction: "rtl",
  isRTL: true,
});

export function useRTL() {
  return useContext(RTLContext);
}

interface RTLProviderProps {
  children: ReactNode;
  direction?: "rtl" | "ltr";
}

export function RTLProvider({
  children,
  direction = "rtl",
}: RTLProviderProps) {
  const value: RTLContextValue = {
    direction,
    isRTL: direction === "rtl",
  };

  return <RTLContext.Provider value={value}>{children}</RTLContext.Provider>;
}
