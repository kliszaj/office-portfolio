"use client";

import { useEffect, useState } from "react";
import { getStockholmTimeString } from "@/lib/time";
import { useTheme } from "@/lib/theme";

export default function TimeDisplay() {
  const theme = useTheme();
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    function updateTime() {
      setTime(getStockholmTimeString());
    }
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <div className="theme-transition flex flex-col items-center gap-0.5 pt-8 pb-4">
      <span
        className="text-sm font-medium tracking-widest"
        style={{ color: theme.textMuted }}
      >
        {time} &middot; Stockholm, Sweden
      </span>
    </div>
  );
}
