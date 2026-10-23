"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getStockholmHour, getTimeOfDay, type TimeOfDay } from "./time";

// Colors the settings panel lets you experiment with, per time of day.
export type EditableColorKey = "accent" | "background" | "text";
export const editableColorKeys: EditableColorKey[] = [
  "accent",
  "background",
  "text",
];
export const editableColorLabels: Record<EditableColorKey, string> = {
  accent: "Accent",
  background: "Background",
  text: "Text",
};
type ColorOverrides = Partial<
  Record<TimeOfDay, Partial<Record<EditableColorKey, string>>>
>;

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
    background: "#FFDEAD",
    backgroundSecondary: "#FDEACA",
    text: "#2D1B0E",
    textMuted: "#8B7355",
    accent: "#FE8420",
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
    background: "#ADD6FF",
    backgroundSecondary: "#DAE6F2",
    text: "#1A1A2E",
    textMuted: "#5A6B80",
    accent: "#2A7BFE",
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
    background: "#F6DDE3",
    backgroundSecondary: "#EFCFD8",
    text: "#321B24",
    textMuted: "#815F68",
    accent: "#E84F8A",
    cardBg: "#FFF0F4",
    cardBorder: "#E9BDC9",
    lightColor: "#FFC2D0",
    lightIntensity: 1.6,
    lightPosition: [4, 7, -2],
    ambientColor: "#F7CDD8",
    ambientIntensity: 0.56,
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
  sceneHour: number;
  setSceneHour: (hour: number) => void;
  theme: Theme;
  activeName: TimeOfDay;
  setOverride: (timeOfDay: TimeOfDay | null) => void;
  override: TimeOfDay | null;
  colorOverrides: ColorOverrides;
  setColorOverride: (
    timeOfDay: TimeOfDay,
    key: EditableColorKey,
    value: string
  ) => void;
  resetColorOverrides: () => void;
  colorPreview: TimeOfDay | null;
  setColorPreview: (timeOfDay: TimeOfDay | null) => void;
  baseThemes: Record<TimeOfDay, Theme>;
}

const ThemeContext = createContext<ThemeContextValue>({
  sceneHour: 14,
  setSceneHour: () => {},
  theme: themes.afternoon,
  activeName: "afternoon",
  setOverride: () => {},
  override: null,
  colorOverrides: {},
  setColorOverride: () => {},
  resetColorOverrides: () => {},
  colorPreview: null,
  setColorPreview: () => {},
  baseThemes: themes,
});

export function useTheme() {
  return useContext(ThemeContext).theme;
}

export function useThemeControls() {
  const { setOverride, override, sceneHour, setSceneHour } = useContext(ThemeContext);
  return { setOverride, override, sceneHour, setSceneHour };
}

export function useThemeColorControls() {
  const {
    activeName,
    colorOverrides,
    setColorOverride,
    resetColorOverrides,
    colorPreview,
    setColorPreview,
    baseThemes,
  } = useContext(ThemeContext);
  return {
    activeName,
    colorOverrides,
    setColorOverride,
    resetColorOverrides,
    colorPreview,
    setColorPreview,
    baseThemes,
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [sceneHour, setSceneHour] = useState(14);
  const [autoName, setAutoName] = useState<TimeOfDay>("afternoon");
  const [override, setOverride] = useState<TimeOfDay | null>(null);
  const [colorPreview, setColorPreview] = useState<TimeOfDay | null>(null);
  const [colorOverrides, setColorOverrides] = useState<ColorOverrides>({});

  useEffect(() => {
    function updateTheme() {
      const hour = getStockholmHour();
      setAutoName(getTimeOfDay(hour));
    }

    updateTheme();
    const interval = setInterval(updateTheme, 60_000);
    return () => clearInterval(interval);
  }, []);

  // colorPreview (settings color editor) wins over the clock's time preview.
  const activeName = colorPreview ?? override ?? autoName;

  const theme = useMemo(() => {
    const base = themes[activeName];
    const overridesForActive = colorOverrides[activeName];
    return overridesForActive ? { ...base, ...overridesForActive } : base;
  }, [activeName, colorOverrides]);

  const setColorOverride = (
    timeOfDay: TimeOfDay,
    key: EditableColorKey,
    value: string
  ) => {
    setColorOverrides((current) => ({
      ...current,
      [timeOfDay]: {
        ...current[timeOfDay],
        [key]: value,
      },
    }));
  };

  const resetColorOverrides = () => setColorOverrides({});

  return (
    <ThemeContext.Provider
      value={{
        theme,
        sceneHour,
        setSceneHour,
        activeName,
        setOverride,
        override,
        colorOverrides,
        setColorOverride,
        resetColorOverrides,
        colorPreview,
        setColorPreview,
        baseThemes: themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export { themes };
