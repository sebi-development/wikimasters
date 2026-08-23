"use client";

import * as React from "react";
import { StackTheme } from "@stackframe/stack";

// React 19 introduces strict warnings about rendering <script> tags inside component trees.
// @stackframe/stack (like next-themes) uses an inline script to prevent theme FOUC.
// This is a false positive error that functions correctly but clutters the console.
// This interceptor suppresses only this specific warning during development.
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return;
    }
    origError.apply(console, args);
  };
}

export function StackThemeWrapper({ children }: { children: React.ReactNode }) {
  return <StackTheme>{children}</StackTheme>;
}
