"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { getProjectBySlug } from "@/lib/projects";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const project = getProjectBySlug(params.slug as string);

  if (!project) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: theme.background, color: theme.text }}
      >
        <p>Project not found.</p>
      </div>
    );
  }

  return (
    <div
      className="theme-transition min-h-screen"
      style={{ backgroundColor: theme.background }}
    >
      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full overflow-hidden"
        style={{
          backgroundColor: project.colors[theme.name],
          borderRadius: "0 0 24px 24px",
          height: "clamp(200px, 40vh, 420px)",
        }}
      >
        {/* Back button */}
        <motion.button
          onClick={() => router.push("/")}
          className="absolute top-5 left-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1A1A1A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </motion.button>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-3xl md:text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-syne), sans-serif" }}
          >
            {project.title}
          </motion.h1>
        </div>

        {/* Subtle gradient overlay at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: `linear-gradient(to top, rgba(0,0,0,0.12), transparent)`,
          }}
        />
      </motion.div>

      {/* Content area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12 md:px-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <span
            className="text-sm font-medium"
            style={{ color: theme.textMuted }}
          >
            {project.company}
          </span>
          <span style={{ color: theme.textMuted }}>&middot;</span>
          <span
            className="text-sm font-medium"
            style={{ color: theme.textMuted }}
          >
            {project.year}
          </span>
          <span style={{ color: theme.textMuted }}>&middot;</span>
          <span
            className="text-[10px] font-bold tracking-[0.15em] uppercase"
            style={{ color: project.colors[theme.name] }}
          >
            {project.status}
          </span>
        </div>

        <p
          className="text-lg leading-relaxed"
          style={{ color: theme.text }}
        >
          {project.description}
        </p>

        <div
          className="mt-12 rounded-2xl border border-dashed p-12 text-center"
          style={{ borderColor: theme.cardBorder }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: theme.textMuted }}
          >
            More content coming soon...
          </p>
        </div>
      </motion.div>
    </div>
  );
}
