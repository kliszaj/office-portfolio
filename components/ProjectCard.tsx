"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";
import type { Project } from "@/lib/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const theme = useTheme();

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Link href={`/project/${project.slug}`} className="block w-full">
        <motion.div
          className="theme-transition group cursor-pointer overflow-hidden rounded-2xl border w-full"
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.cardBorder,
          }}
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {/* Color thumbnail */}
          <div
            className="relative overflow-hidden rounded-xl m-3"
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
                  color: theme.text,
                }}
              >
                {project.title}
              </h3>
              <p
                className="text-xs font-medium tracking-wide mt-0.5"
                style={{ color: theme.textMuted }}
              >
                {project.company}, {project.year}
              </p>
            </div>
            <span
              className="text-[10px] font-bold tracking-[0.15em] uppercase"
              style={{ color: theme.textMuted }}
            >
              {project.status}
            </span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
