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
import type { Project } from "./projects";

interface TransitionState {
  isTransitioning: boolean;
  project: Project | null;
  rect: DOMRect | null;
}

interface TransitionContextValue {
  startTransition: (project: Project, rect: DOMRect) => void;
  isTransitioning: boolean;
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
  const [state, setState] = useState<TransitionState>({
    isTransitioning: false,
    project: null,
    rect: null,
  });

  const startTransition = useCallback(
    (project: Project, rect: DOMRect) => {
      setState({
        isTransitioning: true,
        project,
        rect,
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
    [router]
  );

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
    </TransitionContext.Provider>
  );
}
