"use client";

import type { Project } from "@/lib/projects";
import { useTheme } from "@/lib/theme";

export default function AboutContent({ project }: { project: Project }) {
  const theme = useTheme();
  const about = project.about;

  if (!about) {
    return (
      <div
        className="min-h-[15rem] rounded-2xl border border-dashed p-8"
        style={{ borderColor: theme.cardBorder }}
      >
        <p className="text-sm font-medium" style={{ color: theme.textMuted }}>
          More about me coming soon...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {about.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full px-3 py-1 text-[11px] font-semibold"
            style={{
              color: theme.text,
              backgroundColor:
                theme.name === "night"
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.08)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex max-w-3xl flex-col gap-4">
        {about.intro.map((paragraph, index) => (
          <p
            key={index}
            className={
              index === 0
                ? "text-lg font-semibold leading-snug sm:text-xl"
                : "text-base leading-relaxed"
            }
            style={{ color: index === 0 ? theme.text : theme.textMuted }}
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {about.links.map((link) => {
          const isLink = Boolean(link.href) && link.href !== "#";
          const sharedClass =
            "rounded-full px-4 py-2 text-sm font-semibold transition-transform active:scale-[0.98]";
          const sharedStyle = {
            color: "#FFFFFF",
            backgroundColor: theme.accent,
          } as const;

          return isLink ? (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className={sharedClass}
              style={sharedStyle}
            >
              {link.label}
            </a>
          ) : (
            <span key={link.label} className={sharedClass} style={sharedStyle}>
              {link.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
