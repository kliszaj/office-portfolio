import { caseStudies } from "./portfolio-cases";
import type { TimeOfDay } from "./time";

export interface Project {
  slug: string;
  title: string;
  company: string;
  year?: number;
  status?: "SHIPPED" | "IN PROGRESS" | "CONCEPT";
  kind?: "project" | "about";
  colors: Record<TimeOfDay, string>;
  description: string;
  caseStudy?: {
    imageAlt: string;
    imagePosition: "left" | "right";
    imageSrc: string;
    impact: string[];
    summary: string;
    tags: string[];
    source?: (typeof caseStudies)[number];
  };
  about?: {
    intro: string[];
    tags: string[];
    links: { label: string; href: string }[];
  };
}

// Content and media imported from kliszaj/textfolio (October 2026).
export const projects: Project[] = caseStudies.filter(c => c.slug !== "projects-and-experiments").map((c, i) => ({
  slug: c.slug,
  title: c.title,
  company: c.slug === "focals-by-north" ? "North" : "Spotify",
  year: [2023, 2021, 2018][i],
  status: "SHIPPED" as const,
  colors: { morning: "#E8A060", afternoon: "#68B5A0", evening: "#C75F86", night: "#7B6CF6" },
  description: String(c.facts?.[0]?.value ?? ""),
  caseStudy: {
    imageAlt: c.slug === "focals-by-north" ? "Focals smart glasses frame styles" : `${c.title} project overview`,
    imagePosition: "right" as const,
    imageSrc: c.slug === "focals-by-north" ? "/assets/focals-frame-styles.jpeg" : `/case-studies/${c.slug}.png`,
    impact: [c.facts?.find(f => f.label === "Impact")?.value ?? ""].flat() as string[],
    summary: c.oneLiner ?? c.overview ?? c.blurb,
    tags: String(c.facts?.find(f => f.label === "Scope")?.value ?? "").split(", "),
    source: c,
  },
}));

projects.push(
  {
    slug: "about-me",
    kind: "about",
    title: "About Me",
    company: "Stockholm, Sweden",
    colors: {
      morning: "#E8B15C",
      afternoon: "#6E86C8",
      evening: "#CF7398",
      night: "#7E6FE0",
    },
    description:
      "Designer and developer based in Stockholm, working at the intersection of design and code.",
    about: {
      intro: ["I'm Adrian, a Staff Product Designer currently working at Spotify. I'm based in Stockholm but I'm originally from Canada.", "I started out as a UX researcher, straight out of my master's \u2014 which is probably why I still can't design anything without wanting to test it first. From there I moved into hardware interaction design, where I properly cut my teeth: nothing forces you to think about real constraints like designing something people have to physically hold and push buttons on. For the last six years I've been at Spotify, where I've helped shape how the design team itself works \u2014 most recently, what design looks like in the age of agentic coding.", "Outside of work I forage in the woods near where I live, ferment the results into hot sauce under my own label, shoot everything on film, and occasionally get far too deep into a game of Magic: The Gathering.", "I care about setting a high bar for craft, and about staying close enough to the work to help others raise theirs too."],
      tags: ["Design", "Development", "3D", "Prototyping"],
      links: [
        { label: "GitHub", href: "https://github.com/kliszaj" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/adrianklisz/" },
        { label: "Email", href: "mailto:hello@adrianklisz.com" },
      ],
    },
  },
);

export const aboutProject: Project = projects.find(
  (p) => p.kind === "about"
)!;

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project {
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextIndex = (currentIndex + 1) % projects.length;
  return projects[nextIndex];
}

export function getPrevProject(slug: string): Project {
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
  return projects[prevIndex];
}
