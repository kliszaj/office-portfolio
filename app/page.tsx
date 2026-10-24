"use client";

import { useEffect } from "react";
import RevisionHome from "@/components/RevisionHome";
import Header from "@/components/Header";
import {
  clearHomeScrollPosition,
  readHomeScrollPosition,
} from "@/lib/homeScroll";
import { useProjectTransition } from "@/lib/transition";

export default function Home() {
  const { isTransitioning } = useProjectTransition();

  useEffect(() => {
    const position = readHomeScrollPosition();
    if (!position) return;

    clearHomeScrollPosition();

    let frame = 0;
    let timeoutId: number | null = null;
    let animationFrameId: number | null = null;

    const restore = () => {
      window.scrollTo(position.x, position.y);
      frame += 1;

      if (frame < 12) {
        animationFrameId = window.requestAnimationFrame(restore);
        return;
      }

      timeoutId = window.setTimeout(() => {
        window.scrollTo(position.x, position.y);
      }, 350);
    };

    animationFrameId = window.requestAnimationFrame(restore);

    return () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div
      className="w-full flex flex-col items-center transition-opacity duration-300"
      style={{ opacity: isTransitioning ? 0 : 1 }}
    >
      <Header />

      <RevisionHome />
    </div>
  );
}
