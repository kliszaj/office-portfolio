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
  return <div className="revision-home" style={{ color: theme.text, "--revision-accent": theme.accent, "--revision-border": `${theme.text}24`, "--revision-panel": theme.name === "night" ? "#ffffff08" : "#ffffff35" } as React.CSSProperties}>
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
    <section id="work" className="revision-work" aria-labelledby="work-title">
      <div className="revision-section-heading"><div><p className="revision-eyebrow">SELECTED WORK / 01—03</p><h2 id="work-title">Thoughtful work.<br/>Real-world complexity.</h2></div><p>A few ways I’ve helped teams<br/>bring better experiences to life.</p></div>
      <div className="revision-projects">{featured.map((project,i) => <button key={project.slug} className={`revision-project revision-project-${i}`} onClick={() => startTransition(project)}>
        <div className="revision-project-image" style={{backgroundColor:project.colors[theme.name]}}><Image src={project.caseStudy!.imageSrc} alt={project.caseStudy!.imageAlt} fill sizes="(max-width: 760px) 90vw, 45vw" style={{objectFit:"cover"}}/><span className="revision-project-arrow" aria-hidden="true">↗</span></div>
        <div className="revision-project-copy"><p className="revision-eyebrow">{project.company} · {project.year} <span>{project.status === "SHIPPED" ? "Shipped" : project.status}</span></p><h3>{project.title}</h3><p className="revision-project-outcome">{outcomes[project.slug]}</p><p className="revision-project-role">{project.description}</p><span className="revision-read">Explore the case study <span aria-hidden="true">→</span></span></div>
      </button>)}</div>
    </section>
    <footer className="revision-footer"><p className="revision-eyebrow">THE NEXT GOOD THING STARTS WITH A CONVERSATION</p><a href="mailto:hello@adrianklisz.com">Let’s make something<br/>worth caring about. <span aria-hidden="true">↗</span></a><div><span>Adrian Klisz · Stockholm, Sweden</span><a href="#intro-title">Back to the desk ↑</a></div></footer>
  </div>;
}
