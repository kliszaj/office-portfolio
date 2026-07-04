"use client";

import { ThemeProvider, useTheme } from "@/lib/theme";
import { TransitionProvider } from "@/lib/transition";
import { WorkLayoutProvider } from "@/lib/workLayout";
import PageLoader from "@/components/PageLoader";
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
      <PageLoader />
      {children}
    </div>
  );
}

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <WorkLayoutProvider>
        <TransitionProvider>
          <ThemedBody>{children}</ThemedBody>
        </TransitionProvider>
      </WorkLayoutProvider>
    </ThemeProvider>
  );
}
