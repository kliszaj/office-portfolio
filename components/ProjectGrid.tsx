"use client";

import { projects } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

export default function ProjectGrid() {
  return (
    <section id="work" className="w-full pb-12">
      <div className="flex flex-col gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
