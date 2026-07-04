"use client";

import { useTheme } from "@/lib/theme";
import { useProjectTransition } from "@/lib/transition";
import { useWorkLayout } from "@/lib/workLayout";
import { aboutProject } from "@/lib/projects";
import DeskSettingsMenu from "./DeskSettingsMenu";

function Logo({ activeColor, inactiveColor }: { activeColor: string; inactiveColor: string }) {
  // Braille "AK" — 3 rows x 4 cols (two braille cells side by side)
  // A = dot 1 (top-left), K = dots 1,3 (top-left, bottom-left)
  const active = new Set(["0-0", "0-2", "2-2"]);

  return (
    <svg
      width="36"
      height="28"
      viewBox="0 0 36 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => {
          const isActive = active.has(`${row}-${col}`);
          return (
            <circle
              key={`${row}-${col}`}
              cx={4 + col * 9}
              cy={4 + row * 10}
              r="3.2"
              fill={isActive ? activeColor : inactiveColor}
              style={{
                transition: "fill 0.8s ease",
              }}
            >
              {isActive && (
                <animate
                  attributeName="r"
                  values="3.2;3.6;3.2"
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${row * 0.4 + col * 0.2}s`}
                />
              )}
            </circle>
          );
        })
      )}
    </svg>
  );
}

export default function Header() {
  const theme = useTheme();
  const { startTransition } = useProjectTransition();
  const { headerSettings } = useWorkLayout();
  const scale = headerSettings.fontScale;
  const nameSize = `${1.125 * scale}rem`;
  const navSize = `${0.95 * scale}rem`;

  return (
    <header
      className="theme-transition fixed top-0 left-0 right-0 z-50"
      style={{ backgroundColor: theme.background }}
    >
      <div
        className="flex w-full items-center justify-between"
        style={{
          paddingLeft: "5vw",
          paddingRight: "5vw",
          paddingTop: "2vw",
          paddingBottom: "1rem",
        }}
      >
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="group flex cursor-pointer items-center gap-2 sm:gap-3"
      >
        <Logo activeColor={theme.accent} inactiveColor={theme.cardBorder} />
        <span
          className="hidden font-semibold tracking-tight sm:inline"
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            color: theme.accent,
            fontSize: nameSize,
          }}
        >
          Adrian Klisz
        </span>
      </button>

      <nav className="flex items-center gap-3 sm:gap-5 md:gap-8">
        <button
          onClick={() => {
            const el = document.getElementById("work");
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="font-medium tracking-wide transition-opacity hover:opacity-60 cursor-pointer"
          style={{ color: theme.accent, fontSize: navSize }}
        >
          My Work
        </button>
        <button
          onClick={() => startTransition(aboutProject)}
          className="font-medium tracking-wide transition-opacity hover:opacity-60 cursor-pointer"
          style={{ color: theme.accent, fontSize: navSize }}
        >
          About Me
        </button>
        <DeskSettingsMenu />
      </nav>
      </div>
    </header>
  );
}
