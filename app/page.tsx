"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import TimeDisplay from "@/components/TimeDisplay";
import ProjectGrid from "@/components/ProjectGrid";
import {
  clearHomeScrollPosition,
  readHomeScrollPosition,
} from "@/lib/homeScroll";
import { useProjectTransition } from "@/lib/transition";

const DeskScene = dynamic(() => import("@/components/DeskScene"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center" style={{ height: "min(50vh, 500px)" }}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-transparent" />
    </div>
  ),
});

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

      {/* 3D Scene — full viewport width, extends behind content below */}
      <section className="relative w-full pt-16">
        <DeskScene />
      </section>

      <main className="relative z-10 mx-auto w-full max-w-6xl" style={{ marginTop: "-200px", paddingLeft: "24px", paddingRight: "24px" }}>
        <TimeDisplay />

        {/* Spacer between time and cards */}
        <div style={{ height: "60px" }} />

        {/* Project Cards */}
        <ProjectGrid />

        {/* Extra scroll room at the bottom */}
        <div style={{ height: "300px" }} />
      </main>
    </div>
  );
}
