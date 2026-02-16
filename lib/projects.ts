import type { TimeOfDay } from "./time";

export interface Project {
  slug: string;
  title: string;
  company: string;
  year: number;
  status: "SHIPPED" | "IN PROGRESS" | "CONCEPT";
  colors: Record<TimeOfDay, string>;
  description: string;
}

export const projects: Project[] = [
  {
    slug: "spotify-jam",
    title: "Spotify Jam",
    company: "Spotify",
    year: 2024,
    status: "SHIPPED",
    colors: {
      morning: "#E8A060",
      afternoon: "#5B9BD5",
      evening: "#D4856A",
      night: "#7B6CF6",
    },
    description:
      "A collaborative listening experience that lets friends queue songs together in real-time.",
  },
  {
    slug: "design-system",
    title: "Design System",
    company: "Company Name",
    year: 2024,
    status: "SHIPPED",
    colors: {
      morning: "#D4B06A",
      afternoon: "#68B5A0",
      evening: "#C8947A",
      night: "#6A8FC6",
    },
    description:
      "A comprehensive design system powering consistent UI across multiple product teams.",
  },
  {
    slug: "green-energy",
    title: "Green Energy",
    company: "Company Name",
    year: 2024,
    status: "SHIPPED",
    colors: {
      morning: "#8EBB6E",
      afternoon: "#72B486",
      evening: "#B8907C",
      night: "#5E9E78",
    },
    description:
      "A sustainability dashboard helping users track and reduce their carbon footprint.",
  },
  {
    slug: "ai-assistant",
    title: "AI Assistant",
    company: "Company Name",
    year: 2025,
    status: "IN PROGRESS",
    colors: {
      morning: "#C89070",
      afternoon: "#7E8FC8",
      evening: "#E09878",
      night: "#9070C0",
    },
    description:
      "An intelligent assistant that learns user patterns to provide proactive, contextual help.",
  },
  {
    slug: "travel-app",
    title: "Travel Companion",
    company: "Company Name",
    year: 2025,
    status: "CONCEPT",
    colors: {
      morning: "#D4A878",
      afternoon: "#5AABBF",
      evening: "#CC8A6E",
      night: "#5E80B0",
    },
    description:
      "A travel planning app that curates personalized itineraries based on your interests and pace.",
  },
  {
    slug: "music-visualizer",
    title: "Music Visualizer",
    company: "Personal",
    year: 2025,
    status: "CONCEPT",
    colors: {
      morning: "#C0A060",
      afternoon: "#A085C8",
      evening: "#D8A080",
      night: "#8868B8",
    },
    description:
      "A real-time audio visualizer that generates reactive 3D landscapes from music frequencies.",
  },
];

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
