"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type ViewMode = "home" | "about";

interface ViewContextValue {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const ViewContext = createContext<ViewContextValue>({
  viewMode: "home",
  setViewMode: () => {},
});

export function useViewMode() {
  return useContext(ViewContext);
}

export function ViewProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("home");

  return (
    <ViewContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewContext.Provider>
  );
}
