export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export function getStockholmHour(): number {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Stockholm",
    hour: "numeric",
    hour12: false,
  });
  return parseInt(formatter.format(now), 10);
}

export function getStockholmTimeString(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Stockholm",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return formatter.format(now);
}

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}
