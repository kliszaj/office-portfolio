"use client";

import { useEffect, useState } from "react";
import { getStockholmTimeString, type TimeOfDay } from "@/lib/time";
import { useTheme, useThemeControls } from "@/lib/theme";

const timeOrder: TimeOfDay[] = ["morning", "afternoon", "evening", "night"];

export default function TimeDisplay() {
  const theme = useTheme();
  const { setOverride, override } = useThemeControls();
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    function updateTime() {
      setTime(getStockholmTimeString());
    }
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const cycleTime = (direction: "prev" | "next") => {
    const currentIndex = override
      ? timeOrder.indexOf(override)
      : timeOrder.indexOf(theme.name);
    const newIndex =
      direction === "next"
        ? (currentIndex + 1) % timeOrder.length
        : (currentIndex - 1 + timeOrder.length) % timeOrder.length;
    setOverride(timeOrder[newIndex]);
  };

  if (!time) return null;

  return (
    <div className="theme-transition flex flex-col items-center gap-0.5 pt-8 pb-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => cycleTime("prev")}
          className="text-xl opacity-50 hover:opacity-100 transition-opacity px-1"
          style={{ color: theme.textMuted }}
          aria-label="Previous time of day"
        >
          ←
        </button>
        <span
          className="text-sm font-medium tracking-widest cursor-pointer hover:opacity-70 transition-opacity"
          style={{ color: theme.textMuted }}
          onClick={() => setOverride(null)}
          title={override ? "Click to reset to auto" : "Currently auto"}
        >
          {time} · Stockholm, Sweden
        </span>
        <button
          onClick={() => cycleTime("next")}
          className="text-xl opacity-50 hover:opacity-100 transition-opacity px-1"
          style={{ color: theme.textMuted }}
          aria-label="Next time of day"
        >
          →
        </button>
      </div>
    </div>
  );
}
