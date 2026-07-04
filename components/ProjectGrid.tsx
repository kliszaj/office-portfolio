"use client";

import { projects } from "@/lib/projects";
import { useWorkLayout } from "@/lib/workLayout";
import ProjectCard from "./ProjectCard";
import ShuffledProjectWindows from "./ShuffledProjectWindows";

export default function ProjectGrid() {
  const { deskSettings, layout } = useWorkLayout();

  return (
    <section id="work" className="w-full pb-12">
      <>
        {layout === "list" ? (
          <div className="flex flex-col gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <div>
            <ShuffledProjectWindows
              projects={projects}
              settings={deskSettings}
            />
          </div>
        )}
      </>
    </section>
  );
}
