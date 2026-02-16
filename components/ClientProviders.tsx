"use client";

import { ThemeProvider, useTheme } from "@/lib/theme";
import { ViewProvider } from "@/lib/view";
import { TransitionProvider } from "@/lib/transition";
import type { ReactNode } from "react";

function ThemedBody({ children }: { children: ReactNode }) {
  const theme = useTheme();

  return (
    <div
      className="theme-transition min-h-screen overflow-x-hidden flex flex-col items-center"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      {children}
    </div>
  );
}

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ViewProvider>
        <TransitionProvider>
          <ThemedBody>{children}</ThemedBody>
        </TransitionProvider>
      </ViewProvider>
    </ThemeProvider>
  );
}
