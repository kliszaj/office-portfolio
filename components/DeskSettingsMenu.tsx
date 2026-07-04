"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  editableColorKeys,
  editableColorLabels,
  useTheme,
  useThemeColorControls,
} from "@/lib/theme";
import type { TimeOfDay } from "@/lib/time";
import {
  useWorkLayout,
  type DeskCameraSettings,
  type DeskWindowSettings,
  type LoaderHoverMode,
  type LoaderSettings,
  type NightSettings,
  type NightShadowMode,
  type ProjectOpenMode,
  type SevenSegmentClockSettings,
  type WorkLayout,
} from "@/lib/workLayout";

const layoutOptions: { label: string; value: WorkLayout }[] = [
  { label: "List", value: "list" },
  { label: "Desk", value: "desk" },
];

const openModeOptions: { label: string; value: ProjectOpenMode }[] = [
  { label: "Page", value: "page" },
  { label: "Expanded card", value: "expanded" },
];

const timeOfDayOptions: { label: string; value: TimeOfDay }[] = [
  { label: "Morning", value: "morning" },
  { label: "Afternoon", value: "afternoon" },
  { label: "Evening", value: "evening" },
  { label: "Night", value: "night" },
];

const loaderHoverOptions: { label: string; value: LoaderHoverMode }[] = [
  { label: "Speed up", value: "speedUp" },
  { label: "Slow down", value: "slowDown" },
  { label: "Pause", value: "pause" },
  { label: "Bonkers", value: "goBonkers" },
];

const nightShadowOptions: { label: string; value: NightShadowMode }[] = [
  { label: "Grounded", value: "grounded" },
  { label: "From monitor", value: "monitor" },
  { label: "Moonlight", value: "moonlight" },
];

export default function DeskSettingsMenu() {
  const theme = useTheme();
  const {
    activeName,
    baseThemes,
    colorOverrides,
    resetColorOverrides,
    setColorOverride,
    setColorPreview,
  } = useThemeColorControls();
  const {
    cameraSettings,
    clockSettings,
    deskSettings,
    headerSettings,
    layout,
    loaderSettings,
    nightSettings,
    projectOpenMode,
    resetCameraSettings,
    resetClockSettings,
    resetDeskSettings,
    resetHeaderSettings,
    resetLoaderSettings,
    resetNightSettings,
    setCameraSettings,
    setClockSettings,
    setDeskSettings,
    setHeaderSettings,
    setLayout,
    setLoaderSettings,
    setNightSettings,
    setProjectOpenMode,
  } = useWorkLayout();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [colorTod, setColorTod] = useState<TimeOfDay>(activeName);

  // While the panel is open, preview the palette being edited; clear on close
  // so the theme returns to following the real time of day.
  useEffect(() => {
    setColorPreview(settingsOpen ? colorTod : null);
  }, [settingsOpen, colorTod, setColorPreview]);

  const updateLoaderSetting = <Key extends keyof LoaderSettings>(
    key: Key,
    value: LoaderSettings[Key]
  ) => {
    setLoaderSettings({
      ...loaderSettings,
      [key]: value,
    });
  };

  const updateNightSetting = <Key extends keyof NightSettings>(
    key: Key,
    value: NightSettings[Key]
  ) => {
    setNightSettings({
      ...nightSettings,
      [key]: value,
    });
  };

  const selectColorTod = (tod: TimeOfDay) => {
    // The effect on `colorTod` updates the live preview.
    setColorTod(tod);
  };

  const colorValue = (tod: TimeOfDay, key: (typeof editableColorKeys)[number]) =>
    colorOverrides[tod]?.[key] ?? baseThemes[tod][key];

  const updateDeskSetting = <Key extends keyof DeskWindowSettings>(
    key: Key,
    value: DeskWindowSettings[Key]
  ) => {
    setDeskSettings({
      ...deskSettings,
      [key]: value,
    });
  };

  const updateCameraSetting = <Key extends keyof DeskCameraSettings>(
    key: Key,
    value: DeskCameraSettings[Key]
  ) => {
    setCameraSettings({
      ...cameraSettings,
      [key]: value,
    });
  };

  const updateClockSetting = <Key extends keyof SevenSegmentClockSettings>(
    key: Key,
    value: SevenSegmentClockSettings[Key]
  ) => {
    setClockSettings({
      ...clockSettings,
      [key]: value,
    });
  };

  const renderCameraSlider = (
    label: string,
    key: keyof DeskCameraSettings,
    min: number,
    max: number,
    step: number
  ) => (
    <label className="block">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold">
        <span>{label}</span>
        <span style={{ color: theme.textMuted }}>
          {cameraSettings[key].toFixed(step < 1 ? 2 : 0)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={cameraSettings[key]}
        onChange={(event) =>
          updateCameraSetting(key, Number(event.target.value))
        }
        className="w-full"
        style={{ accentColor: theme.accent }}
      />
    </label>
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setSettingsOpen((open) => !open)}
        aria-expanded={settingsOpen}
        aria-label="Desk settings"
        className="flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-xl transition-transform active:scale-[0.96]"
        style={{
          color: theme.textMuted,
          borderColor: theme.cardBorder,
          backgroundColor:
            theme.name === "night"
              ? "rgba(36,36,64,0.54)"
              : "rgba(255,255,255,0.38)",
          boxShadow:
            theme.name === "night"
              ? "inset 0 1px 0 rgba(255,255,255,0.12)"
              : "inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
        <svg
          aria-hidden="true"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3.1" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.04.04a2 2 0 0 1-2.83 2.83l-.04-.04a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 0 1-4 0v-.06A1.7 1.7 0 0 0 8.97 19.4a1.7 1.7 0 0 0-1.88.34l-.04.04a2 2 0 0 1-2.83-2.83l.04-.04A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 0 1 0-4h.06A1.7 1.7 0 0 0 4.6 8.97a1.7 1.7 0 0 0-.34-1.88l-.04-.04a2 2 0 0 1 2.83-2.83l.04.04A1.7 1.7 0 0 0 8.97 4.6 1.7 1.7 0 0 0 10 3.04V3a2 2 0 0 1 4 0v.06a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.04-.04a2 2 0 0 1 2.83 2.83l-.04.04a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 0 1 0 4h-.06A1.7 1.7 0 0 0 19.4 15Z" />
        </svg>
      </button>

      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            key="desk-settings"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-14 z-50 max-h-[min(76vh,46rem)] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border backdrop-blur-2xl"
            style={{
              color: theme.text,
              borderColor: theme.cardBorder,
              padding: "20px",
              backgroundColor:
                theme.name === "night"
                  ? "rgba(36,36,64,0.82)"
                  : "rgba(255,255,255,0.72)",
              boxShadow:
                theme.name === "night"
                  ? "inset 0 1px 0 rgba(255,255,255,0.12), 0 28px 70px -42px rgba(0,0,0,0.9)"
                  : "inset 0 1px 0 rgba(255,255,255,0.84), 0 28px 70px -42px rgba(78,38,54,0.5)",
            }}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm font-semibold">Desk view</p>
              <button
                type="button"
                onClick={() => {
                  resetDeskSettings();
                  resetCameraSettings();
                }}
                className="text-xs font-semibold transition-opacity hover:opacity-70"
                style={{ color: theme.textMuted }}
              >
                Reset
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <p
                  className="mb-2 text-xs font-bold uppercase tracking-[0.14em]"
                  style={{ color: theme.textMuted }}
                >
                  Layout
                </p>
                <div
                  className="grid grid-cols-2 rounded-full border p-1 backdrop-blur-xl"
                  style={{
                    borderColor: theme.cardBorder,
                    backgroundColor:
                      theme.name === "night"
                        ? "rgba(36,36,64,0.54)"
                        : "rgba(255,255,255,0.38)",
                    boxShadow:
                      theme.name === "night"
                        ? "inset 0 1px 0 rgba(255,255,255,0.12)"
                        : "inset 0 1px 0 rgba(255,255,255,0.7)",
                  }}
                  role="group"
                  aria-label="Work layout"
                >
                  {layoutOptions.map((option) => {
                    const isActive = layout === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setLayout(option.value)}
                        aria-pressed={isActive}
                        className="relative rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-colors active:scale-[0.98]"
                        style={{
                          color: isActive ? theme.cardBg : theme.textMuted,
                        }}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="settings-work-layout-pill"
                            className="absolute inset-0 rounded-full"
                            style={{ backgroundColor: theme.accent }}
                            transition={{
                              type: "spring",
                              stiffness: 420,
                              damping: 34,
                            }}
                          />
                        )}
                        <span className="relative z-[1]">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p
                  className="mb-2 text-xs font-bold uppercase tracking-[0.14em]"
                  style={{ color: theme.textMuted }}
                >
                  Case study
                </p>
                <div className="grid gap-2" role="radiogroup" aria-label="Case study open style">
                  {openModeOptions.map((option) => {
                    const isActive = projectOpenMode === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => setProjectOpenMode(option.value)}
                        className="flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-transform active:scale-[0.98]"
                        style={{
                          borderColor: isActive
                            ? `${theme.accent}66`
                            : theme.cardBorder,
                          backgroundColor: isActive
                            ? `${theme.accent}1F`
                            : "transparent",
                          color: isActive ? theme.accent : theme.textMuted,
                        }}
                      >
                        <span
                          className="grid h-4 w-4 shrink-0 place-items-center rounded-full border"
                          style={{
                            borderColor: isActive
                              ? theme.accent
                              : theme.cardBorder,
                          }}
                        >
                          {isActive && (
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: theme.accent }}
                            />
                          )}
                        </span>
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                className="border-t pt-4"
                style={{ borderColor: theme.cardBorder }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.14em]">
                    Clock
                  </p>
                  <button
                    type="button"
                    onClick={resetClockSettings}
                    className="text-xs font-semibold transition-opacity hover:opacity-70"
                    style={{ color: theme.textMuted }}
                  >
                    Reset clock
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <label className="block">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                      <span>Size</span>
                      <span style={{ color: theme.textMuted }}>
                        {clockSettings.size}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="135"
                      step="5"
                      value={clockSettings.size}
                      onChange={(event) =>
                        updateClockSetting("size", Number(event.target.value))
                      }
                      className="w-full"
                      style={{ accentColor: theme.accent }}
                    />
                  </label>

                  <label className="block">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                      <span>Segment width</span>
                      <span style={{ color: theme.textMuted }}>
                        {clockSettings.segmentWidth.toFixed(1)}×
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={clockSettings.segmentWidth}
                      onChange={(event) =>
                        updateClockSetting(
                          "segmentWidth",
                          Number(event.target.value)
                        )
                      }
                      className="w-full"
                      style={{ accentColor: theme.accent }}
                    />
                  </label>

                  <label className="block">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                      <span>Segment gap</span>
                      <span style={{ color: theme.textMuted }}>
                        {clockSettings.segmentGap.toFixed(1)}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.4"
                      max="4.5"
                      step="0.1"
                      value={clockSettings.segmentGap}
                      onChange={(event) =>
                        updateClockSetting(
                          "segmentGap",
                          Number(event.target.value)
                        )
                      }
                      className="w-full"
                      style={{ accentColor: theme.accent }}
                    />
                  </label>

                  <label className="block">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                      <span>Ghost segments</span>
                      <span style={{ color: theme.textMuted }}>
                        {clockSettings.inactiveOpacity}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="24"
                      step="1"
                      value={clockSettings.inactiveOpacity}
                      onChange={(event) =>
                        updateClockSetting(
                          "inactiveOpacity",
                          Number(event.target.value)
                        )
                      }
                      className="w-full"
                      style={{ accentColor: theme.accent }}
                    />
                  </label>

                  <div className="flex items-center justify-between gap-3 text-xs font-semibold">
                    <span>Ghost color</span>
                    <span className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateClockSetting(
                            "ghostAuto",
                            !clockSettings.ghostAuto
                          )
                        }
                        aria-pressed={clockSettings.ghostAuto}
                        className="rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-transform active:scale-[0.98]"
                        style={{
                          borderColor: clockSettings.ghostAuto
                            ? `${theme.accent}66`
                            : theme.cardBorder,
                          backgroundColor: clockSettings.ghostAuto
                            ? `${theme.accent}1F`
                            : "transparent",
                          color: clockSettings.ghostAuto
                            ? theme.accent
                            : theme.textMuted,
                        }}
                      >
                        Auto
                      </button>
                      {clockSettings.ghostAuto ? (
                        <span
                          className="font-mono text-[11px]"
                          style={{ color: theme.textMuted }}
                        >
                          {theme.text.toUpperCase()}
                        </span>
                      ) : (
                        <>
                          <span
                            className="font-mono text-[11px]"
                            style={{ color: theme.textMuted }}
                          >
                            {clockSettings.ghostColor.toUpperCase()}
                          </span>
                          <input
                            type="color"
                            value={clockSettings.ghostColor}
                            onChange={(event) =>
                              updateClockSetting(
                                "ghostColor",
                                event.target.value
                              )
                            }
                            className="h-7 w-9 cursor-pointer rounded-md border bg-transparent"
                            style={{ borderColor: theme.cardBorder }}
                            aria-label="Ghost segment color"
                          />
                        </>
                      )}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      updateClockSetting("blinkColon", !clockSettings.blinkColon)
                    }
                    aria-pressed={clockSettings.blinkColon}
                    className="flex items-center justify-between rounded-xl border px-3 py-2 text-xs font-semibold transition-transform active:scale-[0.98]"
                    style={{
                      borderColor: clockSettings.blinkColon
                        ? `${theme.accent}66`
                        : theme.cardBorder,
                      backgroundColor: clockSettings.blinkColon
                        ? `${theme.accent}1F`
                        : "transparent",
                      color: clockSettings.blinkColon
                        ? theme.accent
                        : theme.textMuted,
                    }}
                  >
                    <span>Blink colon</span>
                    <span>{clockSettings.blinkColon ? "On" : "Off"}</span>
                  </button>
                </div>
              </div>

              <div
                className="border-t pt-4"
                style={{ borderColor: theme.cardBorder }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.14em]">
                    Colors
                  </p>
                  <button
                    type="button"
                    onClick={resetColorOverrides}
                    className="text-xs font-semibold transition-opacity hover:opacity-70"
                    style={{ color: theme.textMuted }}
                  >
                    Reset colors
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <p
                      className="mb-2 text-[11px] font-semibold"
                      style={{ color: theme.textMuted }}
                    >
                      Time of day
                    </p>
                    <div
                      className="grid grid-cols-4 gap-1 rounded-full border p-1"
                      style={{ borderColor: theme.cardBorder }}
                      role="group"
                      aria-label="Time of day to edit"
                    >
                      {timeOfDayOptions.map((option) => {
                        const isActive = colorTod === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => selectColorTod(option.value)}
                            aria-pressed={isActive}
                            className="relative rounded-full px-1 py-1.5 text-[10px] font-semibold transition-colors active:scale-[0.98]"
                            style={{
                              color: isActive ? theme.cardBg : theme.textMuted,
                            }}
                          >
                            {isActive && (
                              <motion.span
                                layoutId="settings-color-tod-pill"
                                className="absolute inset-0 rounded-full"
                                style={{ backgroundColor: theme.accent }}
                                transition={{
                                  type: "spring",
                                  stiffness: 420,
                                  damping: 34,
                                }}
                              />
                            )}
                            <span className="relative z-[1]">
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {editableColorKeys.map((key) => (
                    <label
                      key={key}
                      className="flex items-center justify-between gap-3 text-xs font-semibold"
                    >
                      <span>{editableColorLabels[key]}</span>
                      <span className="flex items-center gap-2">
                        <span
                          className="font-mono text-[11px]"
                          style={{ color: theme.textMuted }}
                        >
                          {colorValue(colorTod, key).toUpperCase()}
                        </span>
                        <input
                          type="color"
                          value={colorValue(colorTod, key)}
                          onChange={(event) =>
                            setColorOverride(colorTod, key, event.target.value)
                          }
                          className="h-7 w-9 cursor-pointer rounded-md border bg-transparent"
                          style={{ borderColor: theme.cardBorder }}
                          aria-label={editableColorLabels[key]}
                        />
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div
                className="border-t pt-4"
                style={{ borderColor: theme.cardBorder }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.14em]">
                    Loader
                  </p>
                  <button
                    type="button"
                    onClick={resetLoaderSettings}
                    className="text-xs font-semibold transition-opacity hover:opacity-70"
                    style={{ color: theme.textMuted }}
                  >
                    Reset loader
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      updateLoaderSetting("enabled", !loaderSettings.enabled)
                    }
                    aria-pressed={loaderSettings.enabled}
                    className="flex items-center justify-between rounded-xl border px-3 py-2 text-xs font-semibold transition-transform active:scale-[0.98]"
                    style={{
                      borderColor: loaderSettings.enabled
                        ? `${theme.accent}66`
                        : theme.cardBorder,
                      backgroundColor: loaderSettings.enabled
                        ? `${theme.accent}1F`
                        : "transparent",
                      color: loaderSettings.enabled
                        ? theme.accent
                        : theme.textMuted,
                    }}
                  >
                    <span>Show loader</span>
                    <span>{loaderSettings.enabled ? "On" : "Off"}</span>
                  </button>

                  <label className="block">
                    <div className="mb-2 text-xs font-semibold">Text</div>
                    <input
                      type="text"
                      value={loaderSettings.text}
                      onChange={(event) =>
                        updateLoaderSetting("text", event.target.value)
                      }
                      maxLength={40}
                      className="w-full rounded-lg border px-3 py-2 text-xs font-semibold outline-none"
                      style={{
                        borderColor: theme.cardBorder,
                        backgroundColor:
                          theme.name === "night"
                            ? "rgba(36,36,64,0.54)"
                            : "rgba(255,255,255,0.5)",
                        color: theme.text,
                      }}
                    />
                  </label>

                  <label className="block">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                      <span>Spin duration</span>
                      <span style={{ color: theme.textMuted }}>
                        {loaderSettings.spinDuration}s
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="40"
                      step="1"
                      value={loaderSettings.spinDuration}
                      onChange={(event) =>
                        updateLoaderSetting(
                          "spinDuration",
                          Number(event.target.value)
                        )
                      }
                      className="w-full"
                      style={{ accentColor: theme.accent }}
                    />
                  </label>

                  <div>
                    <p
                      className="mb-2 text-[11px] font-semibold"
                      style={{ color: theme.textMuted }}
                    >
                      Hover behavior
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {loaderHoverOptions.map((option) => {
                        const isActive =
                          loaderSettings.onHover === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              updateLoaderSetting("onHover", option.value)
                            }
                            aria-pressed={isActive}
                            className="rounded-lg border px-2 py-2 text-[11px] font-semibold transition-transform active:scale-[0.98]"
                            style={{
                              borderColor: isActive
                                ? `${theme.accent}66`
                                : theme.cardBorder,
                              backgroundColor: isActive
                                ? `${theme.accent}1F`
                                : "transparent",
                              color: isActive ? theme.accent : theme.textMuted,
                            }}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="border-t pt-4"
                style={{ borderColor: theme.cardBorder }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.14em]">
                    Night
                  </p>
                  <button
                    type="button"
                    onClick={resetNightSettings}
                    className="text-xs font-semibold transition-opacity hover:opacity-70"
                    style={{ color: theme.textMuted }}
                  >
                    Reset night
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <p
                      className="mb-2 text-[11px] font-semibold"
                      style={{ color: theme.textMuted }}
                    >
                      Shadow source
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {nightShadowOptions.map((option) => {
                        const isActive =
                          nightSettings.shadowMode === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              updateNightSetting("shadowMode", option.value)
                            }
                            aria-pressed={isActive}
                            className="rounded-lg border px-1 py-2 text-[11px] font-semibold transition-transform active:scale-[0.98]"
                            style={{
                              borderColor: isActive
                                ? `${theme.accent}66`
                                : theme.cardBorder,
                              backgroundColor: isActive
                                ? `${theme.accent}1F`
                                : "transparent",
                              color: isActive ? theme.accent : theme.textMuted,
                            }}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <label className="block">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                      <span>Monitor glow</span>
                      <span style={{ color: theme.textMuted }}>
                        {nightSettings.monitorGlow.toFixed(1)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="6"
                      step="0.1"
                      value={nightSettings.monitorGlow}
                      onChange={(event) =>
                        updateNightSetting(
                          "monitorGlow",
                          Number(event.target.value)
                        )
                      }
                      className="w-full"
                      style={{ accentColor: theme.accent }}
                    />
                  </label>

                  <label className="block">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                      <span>Screen brightness</span>
                      <span style={{ color: theme.textMuted }}>
                        {nightSettings.screenBrightness}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={nightSettings.screenBrightness}
                      onChange={(event) =>
                        updateNightSetting(
                          "screenBrightness",
                          Number(event.target.value)
                        )
                      }
                      className="w-full"
                      style={{ accentColor: theme.accent }}
                    />
                  </label>

                  <label className="block">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                      <span>Glow reach</span>
                      <span style={{ color: theme.textMuted }}>
                        {nightSettings.glowReach.toFixed(1)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="6"
                      step="0.1"
                      value={nightSettings.glowReach}
                      onChange={(event) =>
                        updateNightSetting(
                          "glowReach",
                          Number(event.target.value)
                        )
                      }
                      className="w-full"
                      style={{ accentColor: theme.accent }}
                    />
                  </label>

                  <label className="flex items-center justify-between gap-3 text-xs font-semibold">
                    <span>Glow color</span>
                    <span className="flex items-center gap-2">
                      <span
                        className="font-mono text-[11px]"
                        style={{ color: theme.textMuted }}
                      >
                        {nightSettings.glowColor.toUpperCase()}
                      </span>
                      <input
                        type="color"
                        value={nightSettings.glowColor}
                        onChange={(event) =>
                          updateNightSetting("glowColor", event.target.value)
                        }
                        className="h-7 w-9 cursor-pointer rounded-md border bg-transparent"
                        style={{ borderColor: theme.cardBorder }}
                        aria-label="Glow color"
                      />
                    </span>
                  </label>

                  <label className="block">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                      <span>Floor brightness</span>
                      <span style={{ color: theme.textMuted }}>
                        {nightSettings.floorBrightness}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={nightSettings.floorBrightness}
                      onChange={(event) =>
                        updateNightSetting(
                          "floorBrightness",
                          Number(event.target.value)
                        )
                      }
                      className="w-full"
                      style={{ accentColor: theme.accent }}
                    />
                  </label>

                  <label className="flex items-center justify-between gap-3 text-xs font-semibold">
                    <span>Floor color</span>
                    <span className="flex items-center gap-2">
                      <span
                        className="font-mono text-[11px]"
                        style={{ color: theme.textMuted }}
                      >
                        {nightSettings.floorColor.toUpperCase()}
                      </span>
                      <input
                        type="color"
                        value={nightSettings.floorColor}
                        onChange={(event) =>
                          updateNightSetting("floorColor", event.target.value)
                        }
                        className="h-7 w-9 cursor-pointer rounded-md border bg-transparent"
                        style={{ borderColor: theme.cardBorder }}
                        aria-label="Floor color"
                      />
                    </span>
                  </label>

                  <label className="block">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                      <span>Shadow strength</span>
                      <span style={{ color: theme.textMuted }}>
                        {nightSettings.shadowStrength}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={nightSettings.shadowStrength}
                      onChange={(event) =>
                        updateNightSetting(
                          "shadowStrength",
                          Number(event.target.value)
                        )
                      }
                      className="w-full"
                      style={{ accentColor: theme.accent }}
                    />
                  </label>
                </div>
              </div>

              <div
                className="border-t pt-4"
                style={{ borderColor: theme.cardBorder }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.14em]">
                    Header
                  </p>
                  <button
                    type="button"
                    onClick={resetHeaderSettings}
                    className="text-xs font-semibold transition-opacity hover:opacity-70"
                    style={{ color: theme.textMuted }}
                  >
                    Reset header
                  </button>
                </div>

                <label className="block">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                    <span>Font size</span>
                    <span style={{ color: theme.textMuted }}>
                      {headerSettings.fontScale.toFixed(2)}×
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.85"
                    max="1.8"
                    step="0.05"
                    value={headerSettings.fontScale}
                    onChange={(event) =>
                      setHeaderSettings({
                        ...headerSettings,
                        fontScale: Number(event.target.value),
                      })
                    }
                    className="w-full"
                    style={{ accentColor: theme.accent }}
                  />
                </label>
              </div>

              <label className="block">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                  <span>Cloudiness</span>
                  <span style={{ color: theme.textMuted }}>
                    {deskSettings.cloudiness}%
                  </span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="95"
                  value={deskSettings.cloudiness}
                  onChange={(event) =>
                    updateDeskSetting("cloudiness", Number(event.target.value))
                  }
                  className="w-full"
                  style={{ accentColor: theme.accent }}
                />
              </label>

              <label className="block">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                  <span>Padding</span>
                  <span style={{ color: theme.textMuted }}>
                    {deskSettings.framePadding}px
                  </span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="26"
                  value={deskSettings.framePadding}
                  onChange={(event) =>
                    updateDeskSetting("framePadding", Number(event.target.value))
                  }
                  className="w-full"
                  style={{ accentColor: theme.accent }}
                />
              </label>

              <label className="block">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                  <span>Tilt</span>
                  <span style={{ color: theme.textMuted }}>
                    {Math.round(deskSettings.tilt * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="35"
                  max="145"
                  step="5"
                  value={Math.round(deskSettings.tilt * 100)}
                  onChange={(event) =>
                    updateDeskSetting("tilt", Number(event.target.value) / 100)
                  }
                  className="w-full"
                  style={{ accentColor: theme.accent }}
                />
              </label>

              <button
                type="button"
                onClick={() =>
                  updateDeskSetting("softShadows", !deskSettings.softShadows)
                }
                aria-pressed={deskSettings.softShadows}
                className="flex items-center justify-between rounded-xl border px-3 py-2 text-xs font-semibold transition-transform active:scale-[0.98]"
                style={{
                  borderColor: deskSettings.softShadows
                    ? `${theme.accent}66`
                    : theme.cardBorder,
                  backgroundColor: deskSettings.softShadows
                    ? `${theme.accent}1F`
                    : "transparent",
                  color: deskSettings.softShadows ? theme.accent : theme.textMuted,
                }}
              >
                <span>Soft shadows</span>
                <span>{deskSettings.softShadows ? "On" : "Off"}</span>
              </button>

              <div
                className="border-t pt-4"
                style={{ borderColor: theme.cardBorder }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.14em]">
                    Camera
                  </p>
                  <button
                    type="button"
                    onClick={resetCameraSettings}
                    className="text-xs font-semibold transition-opacity hover:opacity-70"
                    style={{ color: theme.textMuted }}
                  >
                    Reset camera
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {renderCameraSlider("Position X", "positionX", -1, 4, 0.01)}
                  {renderCameraSlider("Position Y", "positionY", 0.8, 3.2, 0.01)}
                  {renderCameraSlider("Position Z", "positionZ", 1.8, 5, 0.01)}
                  {renderCameraSlider("Target X", "targetX", -0.8, 0.8, 0.01)}
                  {renderCameraSlider("Target Y", "targetY", 0, 1.2, 0.01)}
                  {renderCameraSlider("Target Z", "targetZ", -0.2, 1.2, 0.01)}
                  {renderCameraSlider("FOV", "fov", 32, 58, 1)}
                  {renderCameraSlider("Scene height", "sceneHeight", 90, 125, 1)}
                  {renderCameraSlider("Min height", "minHeight", 680, 940, 10)}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
