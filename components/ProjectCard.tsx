"use client";

import { useRef, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { useProjectTransition } from "@/lib/transition";
import type { Project } from "@/lib/projects";
import SpotlightCard from "./SpotlightCard";

export default function ProjectCard({ project }: { project: Project }) {
  const theme = useTheme();
  const { startTransition } = useProjectTransition();
  const thumbnailRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (thumbnailRef.current) {
      const rect = thumbnailRef.current.getBoundingClientRect();
      startTransition(project, rect);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    handleClick();
  };

  const isNight = theme.name === "night";
  const cardText = theme.text;
  const cardMuted = theme.textMuted;

  return (
    <div className="w-full">
      <motion.div
        className="w-full"
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
      <SpotlightCard
        className="theme-transition group w-full cursor-pointer"
        role="button"
        tabIndex={0}
        spotlightColor={`${project.colors[theme.name]}66`}
        style={{
          backgroundColor: isNight ? "rgba(17,17,26,0.92)" : "rgba(255,255,255,0.72)",
          borderColor: isNight ? "rgba(255,255,255,0.13)" : theme.cardBorder,
          boxShadow:
            isNight
              ? "inset 0 1px 0 rgba(255,255,255,0.08), 0 28px 80px -50px rgba(0,0,0,0.92)"
              : "inset 0 1px 0 rgba(255,255,255,0.82), 0 24px 70px -50px rgba(78,38,54,0.34)",
          padding: "12px",
        }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {/* Color thumbnail */}
        <div
          ref={thumbnailRef}
          className="relative overflow-hidden rounded-xl"
          style={{
            backgroundColor: project.colors[theme.name],
            aspectRatio: "16/10",
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* Card info */}
        <div className="flex items-end justify-between px-4 pb-4 pt-1">
          <div>
            <h3
              className="text-lg font-semibold tracking-tight"
              style={{
                fontFamily: "var(--font-syne), sans-serif",
                color: cardText,
              }}
            >
              {project.title}
            </h3>
            <p
              className="text-xs font-medium tracking-wide mt-0.5"
              style={{ color: cardMuted }}
            >
              {project.company}
              {project.year ? `, ${project.year}` : ""}
            </p>
          </div>
          {project.status && (
            <span
              className="text-[10px] font-bold tracking-[0.15em] uppercase"
              style={{ color: cardMuted }}
            >
              {project.status}
            </span>
          )}
        </div>
      </SpotlightCard>
      </motion.div>
    </div>
  );
}
