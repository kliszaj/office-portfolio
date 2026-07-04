"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getStockholmDigitalTimeString,
  getStockholmHour,
  getTimeOfDay,
  type TimeOfDay,
} from "@/lib/time";
import { useTheme, useThemeControls } from "@/lib/theme";
import { useWorkLayout } from "@/lib/workLayout";

const periodOrder: TimeOfDay[] = ["morning", "afternoon", "evening", "night"];
// Representative hour to land on when jumping to each time of day.
const periodRepHour: Record<TimeOfDay, number> = {
  morning: 9,
  afternoon: 14,
  evening: 19,
  night: 23,
};

const digitSegments: Record<string, string[]> = {
  "0": ["a", "b", "c", "d", "e", "f"],
  "1": ["b", "c"],
  "2": ["a", "b", "g", "e", "d"],
  "3": ["a", "b", "c", "d", "g"],
  "4": ["f", "g", "b", "c"],
  "5": ["a", "f", "g", "c", "d"],
  "6": ["a", "f", "e", "d", "c", "g"],
  "7": ["a", "b", "c"],
  "8": ["a", "b", "c", "d", "e", "f", "g"],
  "9": ["a", "b", "c", "d", "f", "g"],
};

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Classic seven-segment hexagon geometry on a 10x18 grid (viewBox "-1 -1 12 20").
// Adapted from pouyamer/react-seven-segment-clock; segments are generated from a
// half-thickness `h` so they can be made fatter/thinner, and meet cleanly at
// beveled corners. h = 1 reproduces the original reference geometry.
function buildSegments(h: number): Record<string, number[][]> {
  // Horizontal bar centered on y=cy, spanning x=xL..xR, with pointed ends.
  const horizontal = (cy: number, xL: number, xR: number): number[][] => [
    [xL, cy],
    [xL + h, cy - h],
    [xR - h, cy - h],
    [xR, cy],
    [xR - h, cy + h],
    [xL + h, cy + h],
  ];
  // Vertical bar centered on x=cx, spanning y=yT..yB, with pointed ends.
  const vertical = (cx: number, yT: number, yB: number): number[][] => [
    [cx, yT],
    [cx + h, yT + h],
    [cx + h, yB - h],
    [cx, yB],
    [cx - h, yB - h],
    [cx - h, yT + h],
  ];

  return {
    a: horizontal(1, 1, 9),
    b: vertical(9, 1, 9),
    c: vertical(9, 9, 17),
    d: horizontal(17, 1, 9),
    e: vertical(1, 9, 17),
    f: vertical(1, 1, 9),
    g: horizontal(9, 1, 9),
  };
}

function getSegmentPolygons(
  segmentGap: number,
  segmentWidth: number
): Record<string, string> {
  // segmentWidth is the half-thickness of each bar (1 = original geometry).
  const halfThickness = Math.max(0.5, Math.min(2, segmentWidth));
  // segmentGap widens the notch between neighboring segments by shrinking
  // each polygon toward its own centroid, keeping spacing even.
  const gap = Math.max(0.4, Math.min(4.5, segmentGap));
  const shrink = gap * 0.06;
  const polygons: Record<string, string> = {};

  for (const [segment, pts] of Object.entries(buildSegments(halfThickness))) {
    const cx = pts.reduce((sum, p) => sum + p[0], 0) / pts.length;
    const cy = pts.reduce((sum, p) => sum + p[1], 0) / pts.length;

    polygons[segment] = pts
      .map(
        ([x, y]) =>
          `${(cx + (x - cx) * (1 - shrink)).toFixed(3)},${(
            cy +
            (y - cy) * (1 - shrink)
          ).toFixed(3)}`
      )
      .join(" ");
  }

  return polygons;
}

function getClockDigitGap(segmentGap: number, scale: number) {
  const gap = Math.max(0.4, Math.min(4.5, segmentGap));

  return `clamp(${(0.16 + gap * 0.05) * scale}rem, ${
    (0.45 + gap * 0.12) * scale
  }vw, ${(0.34 + gap * 0.08) * scale}rem)`;
}

function getSegmentGapTransition(isCycling: boolean) {
  return isCycling
    ? "fill 0.12s ease, opacity 0.12s ease, transform 0.12s ease"
    : "fill 0.12s ease, opacity 0.12s ease, transform 0.12s ease, points 0.12s ease";
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

function SevenSegmentDigit({
  activeColor,
  inactiveColor,
  isCycling,
  scale,
  segmentGap,
  segmentWidth,
  value,
}: {
  activeColor: string;
  inactiveColor: string;
  isCycling: boolean;
  segmentGap: number;
  segmentWidth: number;
  value: string;
  scale: number;
}) {
  const activeSegments = new Set(digitSegments[value] ?? []);
  const segmentPolygons = getSegmentPolygons(segmentGap, segmentWidth);

  const segmentStyle = (segment: string) => ({
    fill: activeSegments.has(segment) ? activeColor : inactiveColor,
    opacity: isCycling && activeSegments.has(segment) ? 0.82 : 1,
    transform:
      isCycling && activeSegments.has(segment) ? "scale(0.9)" : "scale(1)",
    transformBox: "fill-box" as const,
    transformOrigin: "center",
    transition: getSegmentGapTransition(isCycling),
  });

  return (
    <svg
      aria-hidden="true"
      viewBox="-1 -1 12 20"
      fill="none"
      style={{
        height: `clamp(${3.6 * scale}rem, ${8 * scale}vw, ${
          6.5 * scale
        }rem)`,
        width: `clamp(${2.35 * scale}rem, ${5.15 * scale}vw, ${
          4.15 * scale
        }rem)`,
      }}
    >
      {Object.entries(segmentPolygons).map(([segment, points]) => (
        <polygon key={segment} points={points} style={segmentStyle(segment)} />
      ))}
    </svg>
  );
}

function SevenSegmentColon({
  activeColor,
  inactiveColor,
  isActive,
  scale,
}: {
  activeColor: string;
  inactiveColor: string;
  isActive: boolean;
  scale: number;
}) {
  const dotStyle = {
    backgroundColor: isActive ? activeColor : inactiveColor,
    height: `clamp(${0.42 * scale}rem, ${0.82 * scale}vw, ${
      0.68 * scale
    }rem)`,
    transition: "background-color 0.3s ease",
    width: `clamp(${0.42 * scale}rem, ${0.82 * scale}vw, ${
      0.68 * scale
    }rem)`,
  };

  return (
    <div
      aria-hidden="true"
      className="flex flex-col items-center justify-center"
      style={{
        gap: `clamp(${0.7 * scale}rem, ${1.4 * scale}vw, ${scale}rem)`,
        height: `clamp(${3.6 * scale}rem, ${8 * scale}vw, ${
          6.5 * scale
        }rem)`,
        width: `clamp(${0.7 * scale}rem, ${1.4 * scale}vw, ${scale}rem)`,
      }}
    >
      <span className="block rounded-full" style={dotStyle} />
      <span className="block rounded-full" style={dotStyle} />
    </div>
  );
}

export default function TimeDisplay() {
  const theme = useTheme();
  const { setOverride } = useThemeControls();
  const { clockSettings } = useWorkLayout();
  const animationTimeoutsRef = useRef<number[]>([]);
  const [time, setTime] = useState<string>("");
  const [colonActive, setColonActive] = useState(true);
  const [offsetHours, setOffsetHours] = useState(0);
  const [displayOffsetHours, setDisplayOffsetHours] = useState(0);
  const [isCycling, setIsCycling] = useState(false);

  useEffect(() => {
    function updateTime() {
      const previewDate = new Date(
        Date.now() + displayOffsetHours * 60 * 60 * 1000
      );

      setTime(getStockholmDigitalTimeString(previewDate));
      setColonActive(
        clockSettings.blinkColon ? new Date().getSeconds() % 2 === 0 : true
      );

      if (displayOffsetHours === 0) {
        setOverride(null);
      } else {
        setOverride(getTimeOfDay(getStockholmHour(previewDate)));
      }
    }

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [clockSettings.blinkColon, displayOffsetHours, setOverride]);

  useEffect(() => {
    return () => {
      animationTimeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    };
  }, []);

  const clearClockAnimation = () => {
    animationTimeoutsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    animationTimeoutsRef.current = [];
  };

  const animateToOffset = (targetOffset: number, stepCount: number) => {
    clearClockAnimation();
    setOffsetHours(targetOffset);
    setIsCycling(true);

    const startOffset = displayOffsetHours;
    const steps = Math.max(1, stepCount);

    for (let step = 1; step <= steps; step += 1) {
      const timeoutId = window.setTimeout(() => {
        const progress = step / steps;
        setDisplayOffsetHours(
          Math.round(startOffset + (targetOffset - startOffset) * progress)
        );

        if (step === steps) {
          setIsCycling(false);
        }
      }, step * 110);

      animationTimeoutsRef.current.push(timeoutId);
    }
  };

  const shiftPreview = (nextDirection: "prev" | "next") => {
    const previewDate = new Date(
      Date.now() + displayOffsetHours * 60 * 60 * 1000
    );
    const currentHour = getStockholmHour(previewDate);
    const currentPeriod = getTimeOfDay(currentHour);
    const index = periodOrder.indexOf(currentPeriod);
    const targetPeriod =
      nextDirection === "next"
        ? periodOrder[(index + 1) % periodOrder.length]
        : periodOrder[(index + periodOrder.length - 1) % periodOrder.length];
    const targetHour = periodRepHour[targetPeriod];
    const delta =
      nextDirection === "next"
        ? (targetHour - currentHour + 24) % 24 || 24
        : -((currentHour - targetHour + 24) % 24 || 24);

    animateToOffset(displayOffsetHours + delta, Math.max(1, Math.abs(delta)));
  };

  const returnToNow = () => {
    animateToOffset(0, Math.min(Math.abs(displayOffsetHours), 8));
    setOverride(null);
  };

  if (!time) return null;

  const [hours, minutes] = time.split(":");
  const clockDigits = `${hours}${minutes}`.split("");
  const clockScale = clockSettings.size / 100;
  const inactiveOpacity = Math.max(
    0,
    Math.min(1, clockSettings.inactiveOpacity / 100)
  );
  // Auto mode tracks the time-of-day text colour (dark on the light daytime
  // palettes, light at night) so the ghost segments always read subtly.
  const inactiveSegmentColor = hexToRgba(
    clockSettings.ghostAuto ? theme.text : clockSettings.ghostColor,
    inactiveOpacity
  );

  return (
    <div className="theme-transition relative flex flex-col items-center gap-3 pt-1 pb-4 text-center">
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={() => shiftPreview("prev")}
          className="grid h-14 w-14 place-items-center rounded-full opacity-90 transition-[opacity,transform] hover:opacity-100 active:scale-[0.94]"
          style={{
            color: theme.accent,
          }}
          aria-label="Show previous time of day"
        >
          <ChevronIcon direction="left" />
        </button>

        <div aria-label={`${time} Stockholm, Sweden`} role="timer">
          <div
            className="flex items-center"
            style={{
              gap: getClockDigitGap(clockSettings.segmentGap, clockScale),
            }}
            aria-hidden="true"
          >
            <SevenSegmentDigit
              value={clockDigits[0]}
              activeColor={theme.accent}
              inactiveColor={inactiveSegmentColor}
              isCycling={isCycling}
              segmentGap={clockSettings.segmentGap}
              segmentWidth={clockSettings.segmentWidth}
              scale={clockScale}
            />
            <SevenSegmentDigit
              value={clockDigits[1]}
              activeColor={theme.accent}
              inactiveColor={inactiveSegmentColor}
              isCycling={isCycling}
              segmentGap={clockSettings.segmentGap}
              segmentWidth={clockSettings.segmentWidth}
              scale={clockScale}
            />
            <SevenSegmentColon
              activeColor={theme.accent}
              inactiveColor={inactiveSegmentColor}
              isActive={colonActive}
              scale={clockScale}
            />
            <SevenSegmentDigit
              value={clockDigits[2]}
              activeColor={theme.accent}
              inactiveColor={inactiveSegmentColor}
              isCycling={isCycling}
              segmentGap={clockSettings.segmentGap}
              segmentWidth={clockSettings.segmentWidth}
              scale={clockScale}
            />
            <SevenSegmentDigit
              value={clockDigits[3]}
              activeColor={theme.accent}
              inactiveColor={inactiveSegmentColor}
              isCycling={isCycling}
              segmentGap={clockSettings.segmentGap}
              segmentWidth={clockSettings.segmentWidth}
              scale={clockScale}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => shiftPreview("next")}
          className="grid h-14 w-14 place-items-center rounded-full opacity-90 transition-[opacity,transform] hover:opacity-100 active:scale-[0.94]"
          style={{ color: theme.accent }}
          aria-label="Show next time of day"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>

      {/* Location, or the Back-to-now button when previewing another time.
          They occupy the same centered cell and crossfade. */}
      <div className="grid" style={{ minHeight: "3.5rem" }}>
        <AnimatePresence initial={false}>
          {offsetHours === 0 ? (
            <motion.span
              key="location"
              className="col-start-1 row-start-1 self-center justify-self-center text-xs font-semibold uppercase sm:text-sm"
              style={{ color: theme.accent, letterSpacing: "0.24em" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
            >
              Stockholm, Sweden
            </motion.span>
          ) : (
            <motion.button
              key="back-to-now"
              type="button"
              onClick={returnToNow}
              className="col-start-1 row-start-1 self-center justify-self-center rounded-full border px-9 py-3 text-sm font-semibold transition-transform active:scale-[0.98]"
              style={{
                borderColor: `${theme.accent}66`,
                color: theme.accent,
                backgroundColor:
                  theme.name === "night"
                    ? "rgba(36,36,64,0.42)"
                    : "rgba(255,255,255,0.42)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
            >
              Back to now
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
