"use client";

import { useTheme, useThemeControls } from "@/lib/theme";
import type { TimeOfDay } from "@/lib/time";

const modes: { label: string; value: TimeOfDay | null; icon: string }[] = [
  { label: "Auto", value: null, icon: "⟳" },
  { label: "Morning", value: "morning", icon: "🌅" },
  { label: "Afternoon", value: "afternoon", icon: "☀️" },
  { label: "Evening", value: "evening", icon: "🌇" },
  { label: "Night", value: "night", icon: "🌙" },
];

export default function ThemeDebug() {
  const theme = useTheme();
  const { setOverride, override } = useThemeControls();

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex gap-1.5 rounded-xl p-2 shadow-lg backdrop-blur-md"
      style={{
        backgroundColor: theme.cardBg + "DD",
        borderColor: theme.cardBorder,
        border: `1px solid ${theme.cardBorder}`,
      }}
    >
      {modes.map((mode) => {
        const isActive =
          mode.value === override || (mode.value === null && override === null);
        return (
          <button
            key={mode.label}
            onClick={() => setOverride(mode.value)}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all"
            style={{
              backgroundColor: isActive ? theme.accent + "22" : "transparent",
              color: isActive ? theme.accent : theme.textMuted,
              border: isActive
                ? `1px solid ${theme.accent}44`
                : "1px solid transparent",
            }}
          >
            <span>{mode.icon}</span>
            <span>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
