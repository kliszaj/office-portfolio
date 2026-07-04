"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./theme";
import { getNextProject, type Project } from "./projects";
import { saveHomeScrollPosition } from "./homeScroll";
import { useWorkLayout } from "./workLayout";
import CaseStudyContent from "@/components/CaseStudyContent";
import AboutContent from "@/components/AboutContent";

interface TransitionState {
  isTransitioning: boolean;
  project: Project | null;
  rect: DOMRect | null;
}

interface ExpandedProjectState {
  project: Project;
  rect: DOMRect;
}

interface TransitionContextValue {
  startTransition: (project: Project, rect?: DOMRect) => void;
  isTransitioning: boolean;
}

// Fallback rect for opens that aren't anchored to a card (e.g. the header
// "About Me" link) — a small box centered in the viewport to scale from.
function centeredRect(): DOMRect {
  const width = 320;
  const height = 420;
  const vw = typeof window === "undefined" ? 1280 : window.innerWidth;
  const vh = typeof window === "undefined" ? 800 : window.innerHeight;
  return new DOMRect((vw - width) / 2, (vh - height) / 2, width, height);
}

const TransitionContext = createContext<TransitionContextValue>({
  startTransition: () => {},
  isTransitioning: false,
});

export function useProjectTransition() {
  return useContext(TransitionContext);
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const theme = useTheme();
  const { projectOpenMode } = useWorkLayout();
  const [state, setState] = useState<TransitionState>({
    isTransitioning: false,
    project: null,
    rect: null,
  });
  const [expandedProject, setExpandedProject] =
    useState<ExpandedProjectState | null>(null);

  const startTransition = useCallback(
    (project: Project, rect?: DOMRect) => {
      const openRect = rect ?? centeredRect();

      if (projectOpenMode === "expanded") {
        setExpandedProject({ project, rect: openRect });
        return;
      }

      saveHomeScrollPosition();

      setState({
        isTransitioning: true,
        project,
        rect: openRect,
      });

      // Navigate after animation starts
      setTimeout(() => {
        router.push(`/project/${project.slug}`);
      }, 400);

      // Clear transition state after navigation completes
      setTimeout(() => {
        setState({
          isTransitioning: false,
          project: null,
          rect: null,
        });
      }, 800);
    },
    [projectOpenMode, router]
  );

  const closeExpandedProject = useCallback(() => {
    setExpandedProject(null);
  }, []);

  const showNextExpandedProject = useCallback(() => {
    setExpandedProject((current) => {
      if (!current) return current;
      return {
        project: getNextProject(current.project.slug),
        rect: current.rect,
      };
    });
  }, []);

  return (
    <TransitionContext.Provider
      value={{ startTransition, isTransitioning: state.isTransitioning }}
    >
      {children}

      {/* Transition overlay */}
      <AnimatePresence>
        {state.isTransitioning && state.project && state.rect && (
          <motion.div
            initial={{
              position: "fixed",
              top: state.rect.top,
              left: state.rect.left,
              width: state.rect.width,
              height: state.rect.height,
              borderRadius: 12,
              zIndex: 100,
            }}
            animate={{
              top: 0,
              left: 0,
              width: "100vw",
              height: "clamp(200px, 40vh, 420px)",
              borderRadius: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.32, 0.72, 0, 1],
            }}
            style={{
              backgroundColor: state.project.colors[theme.name],
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expandedProject && (
          <>
            <motion.button
              type="button"
              aria-label="Close expanded case study"
              className="fixed inset-0 z-[110] cursor-default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{
                backgroundColor:
                  theme.name === "night"
                    ? "rgba(12,12,22,0.46)"
                    : "rgba(255,255,255,0.34)",
                backdropFilter: "blur(10px)",
              }}
              onClick={closeExpandedProject}
            />

            <motion.article
              key={expandedProject.project.slug}
              className="fixed z-[120] flex max-h-[calc(100dvh-2rem)] flex-col gap-5 overflow-hidden rounded-[22px] border p-4 sm:p-5"
              initial={{
                top: expandedProject.rect.top,
                left: expandedProject.rect.left,
                width: expandedProject.rect.width,
                height: expandedProject.rect.height,
                borderRadius: 18,
                opacity: 0.96,
              }}
              animate={{
                top: "1rem",
                left: "50%",
                width: "min(78rem, calc(100vw - 2rem))",
                height: "calc(100dvh - 2rem)",
                x: "-50%",
                borderRadius: 22,
                opacity: 1,
              }}
              exit={{
                top: expandedProject.rect.top,
                left: expandedProject.rect.left,
                width: expandedProject.rect.width,
                height: expandedProject.rect.height,
                x: 0,
                borderRadius: 18,
                opacity: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 190,
                damping: 24,
                mass: 0.9,
              }}
              style={{
                color: theme.text,
                borderColor: theme.cardBorder,
                padding: "20px",
                backgroundColor:
                  theme.name === "night"
                    ? "rgba(20,20,34,0.94)"
                    : "rgba(255,255,255,0.9)",
                boxShadow:
                  theme.name === "night"
                    ? "inset 0 1px 0 rgba(255,255,255,0.12), 0 34px 100px -44px rgba(0,0,0,0.9)"
                    : "inset 0 1px 0 rgba(255,255,255,0.92), 0 34px 100px -44px rgba(78,38,54,0.5)",
                backdropFilter: "blur(22px) saturate(1.12)",
              }}
            >
              <div
                className="relative shrink-0 overflow-hidden rounded-[17px]"
                style={{
                  height: "clamp(12rem, 32vh, 19rem)",
                  backgroundColor: expandedProject.project.colors[theme.name],
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.16), transparent)",
                  }}
                />
                <button
                  type="button"
                  aria-label="Close expanded case study"
                  onClick={closeExpandedProject}
                  className="absolute right-5 top-5 z-[1] flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-sm backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
                >
                  <svg
                    aria-hidden="true"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-0 left-0 right-0 z-[1] p-6 sm:p-8">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/78">
                    {expandedProject.project.company}
                    {expandedProject.project.year
                      ? ` / ${expandedProject.project.year}`
                      : ""}
                  </p>
                  <h2
                    className="max-w-[13ch] text-3xl font-bold leading-none text-white sm:text-4xl"
                    style={{ fontFamily: "var(--font-syne), sans-serif" }}
                  >
                    {expandedProject.project.title}
                  </h2>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-2 pb-2 sm:px-4 sm:pb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.textMuted }}
                  >
                    {expandedProject.project.company}
                  </span>
                  {expandedProject.project.year && (
                    <>
                      <span style={{ color: theme.textMuted }}>/</span>
                      <span
                        className="text-sm font-medium"
                        style={{ color: theme.textMuted }}
                      >
                        {expandedProject.project.year}
                      </span>
                    </>
                  )}
                  {expandedProject.project.status && (
                    <span
                      className="rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{
                        color: expandedProject.project.colors[theme.name],
                        borderColor: `${expandedProject.project.colors[theme.name]}66`,
                        backgroundColor: `${expandedProject.project.colors[theme.name]}18`,
                      }}
                    >
                      {expandedProject.project.status}
                    </span>
                  )}
                </div>

                {expandedProject.project.kind === "about" ? (
                  <AboutContent project={expandedProject.project} />
                ) : (
                  <CaseStudyContent project={expandedProject.project} />
                )}

                <div
                  className="mt-auto flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-end"
                  style={{ borderColor: theme.cardBorder }}
                >
                  <button
                    type="button"
                    onClick={showNextExpandedProject}
                    className="rounded-full border px-4 py-2.5 text-sm font-semibold transition-transform active:scale-[0.98]"
                    style={{
                      color: theme.text,
                      borderColor: theme.cardBorder,
                    }}
                  >
                    Next project
                  </button>
                </div>
              </div>
            </motion.article>
          </>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
