"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type WorkLayout = "list" | "desk";
export type ProjectOpenMode = "page" | "expanded";

export interface DeskCameraSettings {
  fov: number;
  minHeight: number;
  positionX: number;
  positionY: number;
  positionZ: number;
  sceneHeight: number;
  targetX: number;
  targetY: number;
  targetZ: number;
}

export type DeskWindowSettings = {
  cloudiness: number;
  framePadding: number;
  softShadows: boolean;
  tilt: number;
};

export type SevenSegmentClockSettings = {
  blinkColon: boolean;
  ghostAuto: boolean;
  ghostColor: string;
  inactiveOpacity: number;
  segmentGap: number;
  segmentWidth: number;
  size: number;
};

export type LoaderHoverMode = "speedUp" | "slowDown" | "pause" | "goBonkers";

export type LoaderSettings = {
  enabled: boolean;
  onHover: LoaderHoverMode;
  spinDuration: number;
  text: string;
};

export type HeaderSettings = {
  fontScale: number;
};

export type NightShadowMode = "grounded" | "monitor" | "moonlight";

export type NightSettings = {
  shadowMode: NightShadowMode; // which light casts the night shadow
  monitorGlow: number; // monitor point-light intensity at night
  screenBrightness: number; // 0-100, emissive screen opacity
  glowReach: number; // monitor light distance
  glowColor: string; // hex
  floorBrightness: number; // 0-100, night floor opacity
  floorColor: string; // hex
  shadowStrength: number; // 0-100, night cast-shadow opacity
};

export const defaultDeskCameraSettings: DeskCameraSettings = {
  fov: 34,
  minHeight: 680,
  positionX: 2.4,
  positionY: 2.3,
  positionZ: 3.5,
  sceneHeight: 90,
  targetX: 0.06,
  targetY: 0.65,
  targetZ: 0.36,
};

export const defaultDeskWindowSettings: DeskWindowSettings = {
  cloudiness: 25,
  framePadding: 16,
  softShadows: true,
  tilt: 1.25,
};

export const defaultSevenSegmentClockSettings: SevenSegmentClockSettings = {
  blinkColon: true,
  ghostAuto: true,
  ghostColor: "#FFFFFF",
  inactiveOpacity: 4,
  segmentGap: 1.8,
  segmentWidth: 1.2,
  size: 60,
};

export const defaultLoaderSettings: LoaderSettings = {
  enabled: true,
  onHover: "speedUp",
  spinDuration: 8,
  text: "LOADING*LOADING*",
};

export const defaultHeaderSettings: HeaderSettings = {
  fontScale: 1.15,
};

export const defaultNightSettings: NightSettings = {
  shadowMode: "moonlight",
  monitorGlow: 0.1,
  screenBrightness: 0,
  glowReach: 1,
  glowColor: "#aacdff",
  floorBrightness: 0,
  floorColor: "#14141f",
  shadowStrength: 45,
};

interface WorkLayoutContextValue {
  cameraSettings: DeskCameraSettings;
  clockSettings: SevenSegmentClockSettings;
  deskSettings: DeskWindowSettings;
  headerSettings: HeaderSettings;
  layout: WorkLayout;
  loaderSettings: LoaderSettings;
  nightSettings: NightSettings;
  projectOpenMode: ProjectOpenMode;
  resetCameraSettings: () => void;
  resetClockSettings: () => void;
  resetDeskSettings: () => void;
  resetHeaderSettings: () => void;
  resetLoaderSettings: () => void;
  resetNightSettings: () => void;
  setCameraSettings: (settings: DeskCameraSettings) => void;
  setClockSettings: (settings: SevenSegmentClockSettings) => void;
  setDeskSettings: (settings: DeskWindowSettings) => void;
  setHeaderSettings: (settings: HeaderSettings) => void;
  setLayout: (layout: WorkLayout) => void;
  setLoaderSettings: (settings: LoaderSettings) => void;
  setNightSettings: (settings: NightSettings) => void;
  setProjectOpenMode: (mode: ProjectOpenMode) => void;
}

const WorkLayoutContext = createContext<WorkLayoutContextValue>({
  cameraSettings: defaultDeskCameraSettings,
  clockSettings: defaultSevenSegmentClockSettings,
  deskSettings: defaultDeskWindowSettings,
  headerSettings: defaultHeaderSettings,
  layout: "desk",
  loaderSettings: defaultLoaderSettings,
  nightSettings: defaultNightSettings,
  projectOpenMode: "expanded",
  resetCameraSettings: () => {},
  resetClockSettings: () => {},
  resetDeskSettings: () => {},
  resetHeaderSettings: () => {},
  resetLoaderSettings: () => {},
  resetNightSettings: () => {},
  setCameraSettings: () => {},
  setClockSettings: () => {},
  setDeskSettings: () => {},
  setHeaderSettings: () => {},
  setLayout: () => {},
  setLoaderSettings: () => {},
  setNightSettings: () => {},
  setProjectOpenMode: () => {},
});

export function useWorkLayout() {
  return useContext(WorkLayoutContext);
}

export function WorkLayoutProvider({ children }: { children: ReactNode }) {
  const [cameraSettings, setCameraSettings] = useState<DeskCameraSettings>(
    defaultDeskCameraSettings
  );
  const [clockSettings, setClockSettings] = useState<SevenSegmentClockSettings>(
    defaultSevenSegmentClockSettings
  );
  const [deskSettings, setDeskSettings] = useState<DeskWindowSettings>(
    defaultDeskWindowSettings
  );
  const [headerSettings, setHeaderSettings] = useState<HeaderSettings>(
    defaultHeaderSettings
  );
  const [layout, setLayout] = useState<WorkLayout>("desk");
  const [loaderSettings, setLoaderSettings] = useState<LoaderSettings>(
    defaultLoaderSettings
  );
  const [nightSettings, setNightSettings] = useState<NightSettings>(
    defaultNightSettings
  );
  const [projectOpenMode, setProjectOpenMode] =
    useState<ProjectOpenMode>("expanded");

  return (
    <WorkLayoutContext.Provider
      value={{
        cameraSettings,
        clockSettings,
        deskSettings,
        headerSettings,
        layout,
        loaderSettings,
        nightSettings,
        projectOpenMode,
        resetCameraSettings: () => setCameraSettings(defaultDeskCameraSettings),
        resetClockSettings: () =>
          setClockSettings(defaultSevenSegmentClockSettings),
        resetDeskSettings: () => setDeskSettings(defaultDeskWindowSettings),
        resetHeaderSettings: () => setHeaderSettings(defaultHeaderSettings),
        resetLoaderSettings: () => setLoaderSettings(defaultLoaderSettings),
        resetNightSettings: () => setNightSettings(defaultNightSettings),
        setCameraSettings,
        setClockSettings,
        setDeskSettings,
        setHeaderSettings,
        setLayout,
        setLoaderSettings,
        setNightSettings,
        setProjectOpenMode,
      }}
    >
      {children}
    </WorkLayoutContext.Provider>
  );
}
