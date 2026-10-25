"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useTheme, useThemeControls } from "@/lib/theme";
import { useProjectTransition } from "@/lib/transition";
import { projects, aboutProject } from "@/lib/projects";
import { sceneForHour } from "@/lib/workspace/scenes";
import TimeDisplay from "./TimeDisplay";

const DeskScene = dynamic(() => import("./DeskScene"), { ssr: false,
  loading: () => <div className="revision-loading" role="status">Setting the desk…</div> });
const sceneCopy = {
  design: ["Morning focus", "A little music. A fresh canvas."],
  meeting: ["Design catch-up", "Good ideas get better together."],
  coding: ["Making it real", "From an idea to something you can try."],
  video: ["After hours", "A slower pace. A little inspiration."],
  sleep: ["Away from the desk", "Good work needs a little rest, too."],
};
const outcomes: Record<string, string> = {
  "spotify-jam": "50M+ people listening together every month.",
  "seamless-strategy": "A cross-device strategy reaching 500M+ users.",
  "focals-by-north": "An interface for looking up, not looking down.",
};
export default function RevisionHome() {
  const theme = useTheme();
  const { sceneHour } = useThemeControls();
  const { startTransition } = useProjectTransition();
  const [sceneTitle, sceneDescription] = sceneCopy[sceneForHour(sceneHour)];
  const featured = projects.filter(project => project.caseStudy).slice(0,3);
  return <div className="revision-home paper-home" style={{ color: theme.text, "--paper-atmosphere": theme.background, "--revision-accent": theme.accent, "--revision-border": `${theme.text}24`, "--revision-panel": theme.name === "night" ? "#ffffff08" : "#ffffff35" } as React.CSSProperties}>
    <section className="revision-hero" aria-labelledby="intro-title">
      <div className="revision-intro">
        <p className="revision-eyebrow"><span className="revision-status-dot" /> ADRIAN KLISZ · STAFF PRODUCT DESIGNER</p>
        <h1 id="intro-title">A little curiosity.<br/>A lot of <em>care.</em></h1>
        <p className="revision-lede">I turn complex problems into experiences that feel simple. From shaping the big picture to getting the small things right.</p>
        <div className="revision-actions">
          <a className="revision-primary" href="#work">Explore my work <span aria-hidden="true">↗</span></a>
          <button className="revision-secondary" onClick={() => startTransition(aboutProject)}>A little about me <span aria-hidden="true">→</span></button>
        </div>
        <p className="revision-footnote">Based in Stockholm. Made with curiosity.</p>
      </div>
      <div className="revision-studio">
        <div className="revision-scene"><DeskScene /></div>
        <div className="revision-scene-meta">
          <p className="revision-eyebrow">A DAY AT MY DESK</p>
          <p className="revision-scene-title" aria-live="polite">{sceneTitle}</p>
          <p className="revision-scene-description">{sceneDescription}</p>
          <div className="revision-clock"><TimeDisplay /></div>
          <p className="revision-hint">Use the arrows to explore my day · Try the monitor or camera</p>
        </div>
      </div>
    </section>
    <nav className="paper-index" aria-label="Selected work index">
      <span className="revision-eyebrow">A FEW THINGS I’VE HELPED SHAPE</span>
      {featured.map((project, i) => <a key={project.slug} href={`#sheet-${project.slug}`}><span>0{i+1}</span>{project.title}<span aria-hidden="true">↘</span></a>)}
    </nav>
    <section id="work" className="paper-stack" aria-label="Selected work">
      {featured.map((project, i) => <article id={`sheet-${project.slug}`} key={project.slug} className={`paper-sheet paper-sheet-${i}`} style={{"--sheet-index":i} as React.CSSProperties}>
        <div className="paper-sheet-tab"><span>0{i+1} / SELECTED WORK</span><span>{project.company} · {project.year}</span><span>{project.status === "SHIPPED" ? "Shipped" : project.status}</span></div>
        <button className="paper-project" onClick={event => startTransition(project, event.currentTarget.closest("article")!.getBoundingClientRect())} aria-label={`Read ${project.title} case study`}>
          <div className="paper-project-heading"><h2>{project.title}</h2><span className="paper-open" aria-hidden="true">↗</span></div>
          <div className="paper-project-body"><div className="paper-project-story"><p className="paper-outcome">{outcomes[project.slug]}</p><p className="paper-role">{project.description}</p><span className="paper-read">Open the story <span aria-hidden="true">↗</span></span></div>
          <div className="paper-image" style={{backgroundColor:project.colors[theme.name]}}><Image src={project.caseStudy!.imageSrc} alt={project.caseStudy!.imageAlt} fill sizes="(max-width: 760px) 90vw, 55vw" style={{objectFit:"cover"}}/></div></div>
        </button>
        <div className="paper-sheet-bottom"><span>From the desk of Adrian Klisz</span><span>0{i+1} — 03</span></div>
      </article>)}
    </section>
    <footer className="revision-footer"><p className="revision-eyebrow">THE NEXT GOOD THING STARTS WITH A CONVERSATION</p><a href="mailto:hello@adrianklisz.com">Let’s make something<br/>worth caring about. <span aria-hidden="true">↗</span></a><div><span>Adrian Klisz · Stockholm, Sweden</span><a href="#intro-title">Back to the desk ↑</a></div></footer>
  </div>;
}
