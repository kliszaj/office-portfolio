"use client";

import Image from "next/image";
import type { Project } from "@/lib/projects";
import { useTheme } from "@/lib/theme";

export default function CaseStudyContent({ project }: { project: Project }) {
  const theme = useTheme();
  const caseStudy = project.caseStudy;

  if (!caseStudy) {
    return (
      <div
        className="min-h-[15rem] rounded-2xl border border-dashed p-8"
        style={{ borderColor: theme.cardBorder }}
      >
        <p className="text-sm font-medium" style={{ color: theme.textMuted }}>
          More content coming soon...
        </p>
      </div>
    );
  }

  if (caseStudy.source) {
    const source = caseStudy.source;
    return <article className="revision-case" style={{color:theme.text}}>
      <p className="revision-case-intro">{source.oneLiner ?? source.overview ?? source.blurb}</p>
      <div className="revision-case-facts">{source.facts?.map(fact => <div key={fact.label}><h3>{fact.label}</h3>{(Array.isArray(fact.value) ? fact.value : [fact.value]).map((value,i) => <p key={i}>{typeof value === "string" ? value : <a href={value.href}>{value.label}</a>}</p>)}</div>)}</div>
      {source.videoSrc && <video controls playsInline preload="none" poster={caseStudy.imageSrc} src={source.videoSrc} aria-label={`${source.title} showreel`} />}
      <div className="revision-case-story">{source.sections?.map((section,i) => <section key={i}>
        {section.heading && <h3>{section.heading}</h3>}<p>{section.body}</p>
        {section.bullets && <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}
        <div className="revision-case-links">{[...(section.bodyLinks ?? []), ...(section.bodyLink ? [section.bodyLink] : [])].filter(link => link.href.startsWith("https:")).map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div>
      </section>)}</div>
      <div className="revision-case-media">{source.media?.filter(media => media.src).map(media => <figure key={media.src}>
        {media.kind === "video" ? <video controls playsInline preload="none" src={media.src} aria-label={media.alt}/> : <Image src={media.src!} alt={media.alt} width={1280} height={720} unoptimized={media.src?.endsWith(".gif")} style={{width:"100%",height:"auto"}} />}
        <figcaption>{media.alt}</figcaption>
      </figure>)}</div>
    </article>;
  }

  const imagePanel = (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{
        borderColor: theme.cardBorder,
        backgroundColor:
          theme.name === "night" ? "rgba(255,255,255,0.04)" : "#111111",
      }}
    >
      <Image
        src={caseStudy.imageSrc}
        alt={caseStudy.imageAlt}
        width={1280}
        height={720}
        className="h-full w-full object-cover"
        priority={false}
      />
    </div>
  );

  const copyPanel = (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {caseStudy.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full px-3 py-1 text-[11px] font-semibold"
            style={{
              color: theme.text,
              backgroundColor:
                theme.name === "night"
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.08)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <p
        className="max-w-3xl text-lg font-semibold leading-snug sm:text-xl"
        style={{ color: theme.text }}
      >
        {caseStudy.summary}
      </p>

      <div>
        <p className="mb-3 text-sm font-bold" style={{ color: theme.text }}>
          Impact:
        </p>
        <ul
          className="flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed sm:text-base"
          style={{ color: theme.text }}
        >
          {caseStudy.impact.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      {caseStudy.imagePosition === "left" ? (
        <>
          {imagePanel}
          {copyPanel}
        </>
      ) : (
        <>
          {copyPanel}
          {imagePanel}
        </>
      )}
    </div>
  );
}
