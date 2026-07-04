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
  };
  about?: {
    intro: string[];
    tags: string[];
    links: { label: string; href: string }[];
  };
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
      evening: "#C75F86",
      night: "#7B6CF6",
    },
    description:
      "Led design to reimagine Group Sessions as Jam, a social listening experience that allows people to share control of the queue and listen together from anywhere, on any device.",
    caseStudy: {
      imageAlt: "Spotify Jam mobile listening experience shown on a pink presentation slide",
      imagePosition: "right",
      imageSrc: "/case-studies/spotify-jam.png",
      tags: ["Strategy & Execution", "Impact", "Leadership"],
      summary:
        "Led design to reimagine Group Sessions as Jam, a social listening experience that allows people to share control of the queue and listen together from anywhere, on any device.",
      impact: [
        "Audited the former Group Sessions experience and communicated key problems and opportunity areas to Tribe and Mission leadership.",
        "Led the initial design of the core experience that combined IPL listening and RGS experiences, which led to the creation of the Listening Together Bet.",
        "Facilitated collaboration between Core X and PZN across various touchpoints in the experience.",
        "Adapted the core Jam experience to desktop.",
        "Jam improvements led to a significant increase in Social Consumption Time, Total Sessions, and WAU/DAU over previous Group Sessions experiences.",
      ],
    },
  },
  {
    slug: "seamless-strategy",
    title: "Seamless Strategy",
    company: "Spotify",
    year: 2024,
    status: "SHIPPED",
    colors: {
      morning: "#D4B06A",
      afternoon: "#68B5A0",
      evening: "#D97995",
      night: "#6A8FC6",
    },
    description:
      "Co-created the Seamless strategy, a PPX objective focused on simplifying device activation and making social listening feel effortless across devices.",
    caseStudy: {
      imageAlt: "Illustration of Spotify device activation and social listening moments",
      imagePosition: "left",
      imageSrc: "/case-studies/seamless-strategy.png",
      tags: ["Strategy & Execution", "Impact", "Leadership"],
      summary:
        "Co-created the Seamless strategy, now a PPX Objective that aims to deepen Spotify's ubiquity advantage by simplifying device activation, helping users find the right audio for the right device at the right time, and creating more intentional social listening experiences.",
      impact: [
        "Facilitated cross-Tribe collaboration for defining the strategy, including opportunity mapping workshops to help align senior stakeholders across the highest impact areas of work.",
        "Collaborated with data scientists and researchers to define key opportunity areas and a high-level roadmap used every quarter to define squad roadmaps within the Seamless PA.",
        "Designed a strategy deck used to communicate the strategy and design principles across Spotify.",
      ],
    },
  },
  {
    slug: "onboarding-playbook",
    title: "Onboarding Playbook",
    company: "Spotify",
    year: 2024,
    status: "SHIPPED",
    colors: {
      morning: "#8EBB6E",
      afternoon: "#72B486",
      evening: "#C98296",
      night: "#5E9E78",
    },
    description:
      "Created a research and best-practices toolkit that helps teams design continuous onboarding journeys that improve feature engagement, retention, and satisfaction.",
    caseStudy: {
      imageAlt: "Onboarding Playbook presentation and browser mockup on a colorful grain background",
      imagePosition: "right",
      imageSrc: "/case-studies/onboarding-playbook.png",
      tags: ["Strategy & Execution", "Leadership"],
      summary:
        "Effective onboarding should be a continuous journey and not just a single moment of orientation. The Onboarding Playbook is a toolkit created from research and best practices that helps people understand how to design for continuous onboarding.",
      impact: [
        "Led a PPX-wide audit workshop to help different teams understand the current state of their platform's onboarding and how it might be impacting success metrics.",
        "Designed and launched the Onboarding Playbook in the Spotify Design Toolkit to help designers communicate value, define onboarding goals and actions, design a long-term onboarding journey, and evaluate onboarding over time.",
        "Presented this work to Experience Mission designers to encourage everyone to use it.",
        "Collaborated with data scientists to understand how to holistically measure long-term onboarding.",
      ],
    },
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
      evening: "#D85D8B",
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
      evening: "#C76F9B",
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
      evening: "#B96A9A",
      night: "#8868B8",
    },
    description:
      "A real-time audio visualizer that generates reactive 3D landscapes from music frequencies.",
  },
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
      intro: [
        "Hi! I'm Adrian Klisz — a designer and developer based in Stockholm, Sweden. I love building beautiful, interactive experiences at the intersection of design and code.",
        "When I'm not pushing pixels or writing code, you'll find me exploring creative tools, experimenting with 3D, or brewing the perfect cup of coffee.",
      ],
      tags: ["Design", "Development", "3D", "Prototyping"],
      links: [
        { label: "GitHub", href: "#" },
        { label: "LinkedIn", href: "#" },
        { label: "Email", href: "mailto:kliszaj@gmail.com" },
      ],
    },
  },
];

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
