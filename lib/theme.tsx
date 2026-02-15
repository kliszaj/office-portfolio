"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getStockholmHour, getTimeOfDay, type TimeOfDay } from "./time";

export interface Theme {
  name: TimeOfDay;
  // CSS colors
  background: string;
  backgroundSecondary: string;
  text: string;
  textMuted: string;
  accent: string;
  cardBg: string;
  cardBorder: string;
  // 3D lighting
  lightColor: string;
  lightIntensity: number;
  lightPosition: [number, number, number];
  ambientColor: string;
  ambientIntensity: number;
}

const themes: Record<TimeOfDay, Theme> = {
  morning: {
    name: "morning",
    background: "#FDF0DC",
    backgroundSecondary: "#FDEACA",
    text: "#2D1B0E",
    textMuted: "#8B7355",
    accent: "#E8913A",
    cardBg: "#FFF8EE",
    cardBorder: "#F0D9B5",
    lightColor: "#FFB347",
    lightIntensity: 1.8,
    lightPosition: [-5, 8, 3],
    ambientColor: "#FFE4C4",
    ambientIntensity: 0.6,
  },
  afternoon: {
    name: "afternoon",
    background: "#E4EEF8",
    backgroundSecondary: "#DAE6F2",
    text: "#1A1A2E",
    textMuted: "#5A6B80",
    accent: "#3B82F6",
    cardBg: "#EFF4FA",
    cardBorder: "#C8D8E8",
    lightColor: "#FFF8F0",
    lightIntensity: 2.2,
    lightPosition: [0, 10, 2],
    ambientColor: "#E8F0F8",
    ambientIntensity: 0.7,
  },
  evening: {
    name: "evening",
    background: "#F5E6E0",
    backgroundSecondary: "#F0D8CE",
    text: "#2E1A18",
    textMuted: "#9A7068",
    accent: "#D4856A",
    cardBg: "#FBF0EC",
    cardBorder: "#E8C4B4",
    lightColor: "#F0A888",
    lightIntensity: 1.5,
    lightPosition: [5, 6, -3],
    ambientColor: "#E8BCA8",
    ambientIntensity: 0.4,
  },
  night: {
    name: "night",
    background: "#181828",
    backgroundSecondary: "#222238",
    text: "#E8E8F0",
    textMuted: "#9898BB",
    accent: "#8B7CF6",
    cardBg: "#242440",
    cardBorder: "#36365A",
    lightColor: "#6C63FF",
    lightIntensity: 1.0,
    lightPosition: [-3, 6, 4],
    ambientColor: "#3A3A5A",
    ambientIntensity: 0.4,
  },
};

interface ThemeContextValue {
  theme: Theme;
  setOverride: (timeOfDay: TimeOfDay | null) => void;
  override: TimeOfDay | null;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: themes.afternoon,
  setOverride: () => {},
  override: null,
});

export function useTheme() {
  return useContext(ThemeContext).theme;
}

export function useThemeControls() {
  const { setOverride, override } = useContext(ThemeContext);
  return { setOverride, override };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [autoTheme, setAutoTheme] = useState<Theme>(themes.afternoon);
  const [override, setOverride] = useState<TimeOfDay | null>(null);

  useEffect(() => {
    function updateTheme() {
      const hour = getStockholmHour();
      const timeOfDay = getTimeOfDay(hour);
      setAutoTheme(themes[timeOfDay]);
    }

    updateTheme();
    const interval = setInterval(updateTheme, 60_000);
    return () => clearInterval(interval);
  }, []);

  const theme = override ? themes[override] : autoTheme;

  return (
    <ThemeContext.Provider value={{ theme, setOverride, override }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { themes };
