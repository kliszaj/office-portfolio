"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  motion,
  useDragControls,
  useMotionValue,
  type PanInfo,
} from "framer-motion";
import { useTheme } from "@/lib/theme";
import { useProjectTransition } from "@/lib/transition";
import type { Project } from "@/lib/projects";
import {
  defaultDeskWindowSettings,
  type DeskWindowSettings,
} from "@/lib/workLayout";
import SpotlightCard from "./SpotlightCard";

type WindowLayout = {
  top: string;
  left: string;
  width: string;
  rotation: number;
  aspectRatio: string;
  zIndex: number;
};

const windowLayouts: WindowLayout[] = [
  { top: "5%", left: "-2%", width: "38%", rotation: -2.5, aspectRatio: "4 / 5", zIndex: 3 },
  { top: "0%", left: "46%", width: "28%", rotation: 1.5, aspectRatio: "16 / 9", zIndex: 2 },
  { top: "9%", left: "82%", width: "15%", rotation: -4, aspectRatio: "1 / 1", zIndex: 1 },
  { top: "34%", left: "29%", width: "24%", rotation: 3, aspectRatio: "4 / 5", zIndex: 4 },
  { top: "29%", left: "63%", width: "39%", rotation: 1.8, aspectRatio: "16 / 9", zIndex: 5 },
  { top: "62%", left: "45%", width: "37%", rotation: -1.4, aspectRatio: "5 / 4", zIndex: 2 },
  { top: "64%", left: "2%", width: "32%", rotation: 2.6, aspectRatio: "5 / 4", zIndex: 3 },
];

function WindowVisual({
  project,
  layout,
}: {
  project: Project;
  layout: WindowLayout;
}) {
  const theme = useTheme();
  const color = project.colors[theme.name];

  return (
    <div
      className="relative overflow-hidden rounded-[14px]"
      style={{
        aspectRatio: layout.aspectRatio,
        backgroundColor: color,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: theme.backgroundSecondary,
          opacity: 0.22,
        }}
      />
      <div
        className="absolute h-[58%] w-[42%] rounded-[8px]"
        style={{
          top: "12%",
          left: "10%",
          backgroundColor: theme.cardBg,
          opacity: 0.68,
          transform: "rotate(-11deg)",
        }}
      />
      <div
        className="absolute h-[26%] w-[74%] rounded-[7px]"
        style={{
          right: "-10%",
          bottom: "16%",
          backgroundColor: theme.accent,
          opacity: 0.55,
          transform: "rotate(12deg)",
        }}
      />
      <div
        className="absolute h-[18%] w-[52%] rounded-[6px]"
        style={{
          left: "28%",
          bottom: "8%",
          backgroundColor: theme.text,
          opacity: theme.name === "night" ? 0.2 : 0.08,
          transform: "rotate(-4deg)",
        }}
      />
    </div>
  );
}

function ShuffledWindow({
  bringToFront,
  project,
  settings,
  index,
  zIndex,
}: {
  bringToFront: (slug: string) => void;
  project: Project;
  settings: DeskWindowSettings;
  index: number;
  zIndex: number;
}) {
  const theme = useTheme();
  const { startTransition } = useProjectTransition();
  const visualRef = useRef<HTMLDivElement>(null);
  const didDragRef = useRef(false);
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const layout = windowLayouts[index % windowLayouts.length];

  const openProject = () => {
    if (!visualRef.current) return;
    startTransition(project, visualRef.current.getBoundingClientRect());
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openProject();
  };

  const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
    if (didDragRef.current) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    openProject();
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    bringToFront(project.slug);
    dragControls.start(event);
  };

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.hypot(info.offset.x, info.offset.y) > 6) {
      didDragRef.current = true;
    }
  };

  const handleDragEnd = () => {
    x.set(Math.round(x.get()));
    y.set(Math.round(y.get()));

    window.setTimeout(() => {
      didDragRef.current = false;
    }, 160);
  };

  const cloud = Math.max(0, Math.min(100, settings.cloudiness)) / 100;
  const lightGlassAlpha = 0.28 + cloud * 0.36;
  const nightGlassAlpha = 0.38 + cloud * 0.32;
  const blur = 10 + cloud * 16;
  const isNight = theme.name === "night";
  const cardText = theme.text;
  const cardMuted = theme.textMuted;

  const style = {
    "--window-top": layout.top,
    "--window-left": layout.left,
    "--window-width": layout.width,
    "--window-rotation": `${layout.rotation * settings.tilt}deg`,
    zIndex,
  } as CSSProperties;

  const surfaceStyle = {
    borderColor: isNight ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.72)",
    backgroundColor: isNight
      ? `rgba(17,17,26,${nightGlassAlpha})`
      : `rgba(255,255,255,${lightGlassAlpha})`,
    backdropFilter: `blur(${blur}px) saturate(${1.08 + cloud * 0.2})`,
    boxShadow:
      settings.softShadows
        ? isNight
          ? "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -18px 40px rgba(255,255,255,0.03), 0 28px 82px -44px rgba(0,0,0,0.9)"
          : "inset 0 1px 0 rgba(255,255,255,0.86), inset 0 -20px 46px rgba(255,255,255,0.18), 0 28px 82px -44px rgba(78,38,54,0.36)"
        : "inset 0 1px 0 rgba(255,255,255,0.42)",
    padding: settings.framePadding,
  } as CSSProperties;

  return (
    <article className="shuffled-window" style={style}>
      <motion.div
        drag
        dragControls={dragControls}
        dragElastic={0.08}
        dragListener={false}
        dragMomentum={false}
        style={{ x, y }}
        onDragStart={() => {
          bringToFront(project.slug);
          didDragRef.current = false;
        }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 22,
        }}
      >
      <SpotlightCard
        className="group cursor-grab active:cursor-grabbing"
        role="button"
        tabIndex={0}
        spotlightColor={`${project.colors[theme.name]}78`}
        style={surfaceStyle}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 24% 18%, rgba(255,255,255,0.72), transparent 34%), radial-gradient(circle at 72% 8%, rgba(255,255,255,0.44), transparent 30%), radial-gradient(circle at 46% 78%, rgba(255,255,255,0.5), transparent 42%)",
            opacity: 0.18 + cloud * 0.5,
          }}
        />
        <div className="relative z-[1]" ref={visualRef}>
          <WindowVisual project={project} layout={layout} />
        </div>

        <div className="relative z-[1] flex items-end justify-between gap-4 px-2 pb-1.5 pt-3">
          <div className="min-w-0">
            <h3
              className="truncate text-base font-semibold tracking-tight"
              style={{
                fontFamily: "var(--font-syne), sans-serif",
                color: cardText,
              }}
            >
              {project.title}
            </h3>
            <p
              className="mt-0.5 truncate text-[11px] font-medium tracking-wide"
              style={{ color: cardMuted }}
            >
              {project.company}
              {project.year ? `, ${project.year}` : ""}
            </p>
          </div>
          {project.status && (
            <span
              className="shrink-0 text-[9px] font-bold uppercase tracking-[0.14em]"
              style={{ color: cardMuted }}
            >
              {project.status}
            </span>
          )}
        </div>
      </SpotlightCard>
      </motion.div>
    </article>
  );
}

export default function ShuffledProjectWindows({
  projects,
  settings = defaultDeskWindowSettings,
}: {
  projects: Project[];
  settings?: DeskWindowSettings;
}) {
  const [stack, setStack] = useState(() => ({
    nextZ: projects.length + 10,
    zBySlug: Object.fromEntries(
      projects.map((project, index) => [
        project.slug,
        windowLayouts[index % windowLayouts.length].zIndex,
      ])
    ) as Record<string, number>,
  }));

  const bringToFront = (slug: string) => {
    setStack((current) => ({
      nextZ: current.nextZ + 1,
      zBySlug: {
        ...current.zBySlug,
        [slug]: current.nextZ,
      },
    }));
  };

  return (
    <div
      className="shuffled-workspace"
    >
      {projects.map((project, index) => (
        <ShuffledWindow
          bringToFront={bringToFront}
          key={project.slug}
          project={project}
          settings={settings}
          index={index}
          zIndex={stack.zBySlug[project.slug] ?? index}
        />
      ))}
    </div>
  );
}
