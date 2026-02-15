"use client";

import dynamic from "next/dynamic";
import Header from "@/components/Header";
import TimeDisplay from "@/components/TimeDisplay";
import ProjectGrid from "@/components/ProjectGrid";
import ThemeDebug from "@/components/ThemeDebug";

const DeskScene = dynamic(() => import("@/components/DeskScene"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center" style={{ height: "min(50vh, 500px)" }}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-transparent" />
    </div>
  ),
});

export default function Home() {
  return (
    <>
      <Header />

      {/* 3D Scene — full viewport width, extends behind content below */}
      <section className="relative w-full pt-16">
        <DeskScene />
      </section>

      <main className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 md:px-8" style={{ marginTop: "-120px" }}>
        <TimeDisplay />

        {/* Spacer between time and cards */}
        <div style={{ height: "60px" }} />

        {/* Project Cards */}
        <ProjectGrid />
      </main>
      <ThemeDebug />
    </>
  );
}
