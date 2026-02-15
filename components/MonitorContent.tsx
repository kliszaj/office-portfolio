"use client";

import type { ReactNode } from "react";
import { Html } from "@react-three/drei";
import { useTheme } from "@/lib/theme";
import { useViewMode } from "@/lib/view";

function MorningScreen() {
  return (
    <div
      style={{
        width: "420px",
        height: "246px",
        background: "#F8F6F2",
        fontFamily: "var(--font-outfit), sans-serif",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontSize: "9px", fontWeight: 700, color: "#E8913A" }}>Inbox</span>
        <span style={{ fontSize: "7px", color: "#8B7355" }}>3 unread</span>
      </div>
      {[
        { from: "Design Team", subject: "New mockups ready for review", color: "#E8913A", unread: true },
        { from: "GitHub", subject: "PR #42 merged into main", color: "#4A90D9", unread: true },
        { from: "Calendar", subject: "Standup in 30 minutes", color: "#5EA87E", unread: true },
        { from: "Spotify", subject: "Your weekly playlist is ready", color: "#1DB954", unread: false },
        { from: "Newsletter", subject: "This week in frontend dev", color: "#8B7355", unread: false },
        { from: "AWS", subject: "Monthly billing summary", color: "#FF9900", unread: false },
        { from: "Figma", subject: "Component updates available", color: "#A259FF", unread: false },
      ].map((email, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "5px 6px",
            borderRadius: "4px",
            background: email.unread ? "rgba(232,145,58,0.08)" : "transparent",
          }}
        >
          <div
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: email.unread ? email.color : "transparent",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: "7px", fontWeight: email.unread ? 600 : 400, color: "#2D1B0E", width: "65px", flexShrink: 0 }}>
            {email.from}
          </span>
          <span style={{ fontSize: "7px", color: email.unread ? "#2D1B0E" : "#8B7355", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {email.subject}
          </span>
        </div>
      ))}
    </div>
  );
}

/* Code line helper — each segment has text + color */
type Seg = { t: string; c: string };
function CodeLine({ segments }: { segments: Seg[] }) {
  return (
    <>
      {segments.map((s, i) => (
        <span key={i} style={{ color: s.c }}>{s.t}</span>
      ))}
    </>
  );
}

const purple = "#C678DD";
const green = "#98C379";
const blue = "#61AFEF";
const orange = "#D19A66";
const red = "#E06C75";
const fg = "#ABB2BF";

function AfternoonScreen() {
  const lines: { num: number; segs: Seg[] }[] = [
    { num: 1, segs: [{ t: "import", c: purple }, { t: " { useEffect } ", c: fg }, { t: "from", c: purple }, { t: ' "react"', c: green }, { t: ";", c: fg }] },
    { num: 2, segs: [{ t: "import", c: purple }, { t: " { Canvas } ", c: fg }, { t: "from", c: purple }, { t: ' "@react-three/fiber"', c: green }, { t: ";", c: fg }] },
    { num: 3, segs: [] },
    { num: 4, segs: [{ t: "export default function", c: purple }, { t: " Scene", c: blue }, { t: "() {", c: fg }] },
    { num: 5, segs: [{ t: "  const", c: purple }, { t: " [loaded, setLoaded] = ", c: fg }, { t: "useState", c: blue }, { t: "(", c: fg }, { t: "false", c: orange }, { t: ");", c: fg }] },
    { num: 6, segs: [] },
    { num: 7, segs: [{ t: "  ", c: fg }, { t: "useEffect", c: blue }, { t: "(() => {", c: fg }] },
    { num: 8, segs: [{ t: "    ", c: fg }, { t: "loadModel", c: blue }, { t: '("', c: fg }, { t: "/desk.glb", c: green }, { t: '")', c: fg }] },
    { num: 9, segs: [{ t: "      .", c: fg }, { t: "then", c: blue }, { t: "(() => ", c: fg }, { t: "setLoaded", c: blue }, { t: "(", c: fg }, { t: "true", c: orange }, { t: "));", c: fg }] },
    { num: 10, segs: [{ t: "  }, []);", c: fg }] },
    { num: 11, segs: [] },
    { num: 12, segs: [{ t: "  return", c: purple }, { t: " (", c: fg }] },
    { num: 13, segs: [{ t: "    <", c: fg }, { t: "Canvas", c: red }, { t: " ", c: fg }, { t: "shadows", c: orange }, { t: ">", c: fg }] },
    { num: 14, segs: [{ t: "      <", c: fg }, { t: "ambientLight", c: red }, { t: " />", c: fg }] },
    { num: 15, segs: [{ t: "      {loaded && <", c: fg }, { t: "DeskModel", c: red }, { t: " />}", c: fg }] },
    { num: 16, segs: [{ t: "    </", c: fg }, { t: "Canvas", c: red }, { t: ">", c: fg }] },
  ];

  return (
    <div
      style={{
        width: "420px",
        height: "246px",
        background: "#282C34",
        fontFamily: "monospace",
        padding: "10px 0",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <div style={{ width: "28px", textAlign: "right", paddingRight: "8px", flexShrink: 0 }}>
        {lines.map((l) => (
          <div key={l.num} style={{ fontSize: "7px", lineHeight: "13px", color: "#636D83" }}>{l.num}</div>
        ))}
      </div>
      <div style={{ width: "1px", background: "#3E4451", flexShrink: 0 }} />
      <div style={{ paddingLeft: "10px", flex: 1 }}>
        {lines.map((l) => (
          <div key={l.num} style={{ fontSize: "7px", lineHeight: "13px", color: fg }}>
            {l.segs.length > 0 ? <CodeLine segments={l.segs} /> : "\u00A0"}
          </div>
        ))}
      </div>
    </div>
  );
}

function EveningScreen() {
  return (
    <div
      style={{
        width: "420px",
        height: "246px",
        background: "#0F0F0F",
        fontFamily: "var(--font-outfit), sans-serif",
        padding: "0",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            flex: 1,
            background: "#1A1A1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "20px",
              borderRadius: "4px",
              background: "rgba(255,0,0,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "8px solid white",
                borderTop: "5px solid transparent",
                borderBottom: "5px solid transparent",
                marginLeft: "2px",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "8px",
              left: "10px",
              right: "10px",
              height: "2px",
              background: "#333",
              borderRadius: "1px",
            }}
          >
            <div style={{ width: "35%", height: "100%", background: "#FF0000", borderRadius: "1px" }} />
          </div>
        </div>
        <div style={{ padding: "6px 10px" }}>
          <div style={{ fontSize: "7px", fontWeight: 600, color: "#F1F1F1" }}>lofi hip hop radio - beats to relax/study to</div>
          <div style={{ fontSize: "6px", color: "#AAA", marginTop: "2px" }}>Lofi Girl &middot; 45K watching</div>
        </div>
      </div>
      <div style={{ width: "120px", padding: "8px 6px", display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { color: "#2D4A3E", title: "Chill Coding Mix", views: "1.2M" },
          { color: "#3A2D4A", title: "Synthwave Retro", views: "890K" },
          { color: "#4A3A2D", title: "Jazz & Coffee", views: "2.1M" },
          { color: "#2D3A4A", title: "Rain Sounds 10h", views: "5.4M" },
        ].map((vid, i) => (
          <div key={i} style={{ display: "flex", gap: "4px" }}>
            <div style={{ width: "44px", height: "26px", borderRadius: "2px", background: vid.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "5px", fontWeight: 500, color: "#F1F1F1", lineHeight: 1.3 }}>{vid.title}</div>
              <div style={{ fontSize: "5px", color: "#AAA" }}>{vid.views}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NightScreen() {
  const termLines: { prompt?: boolean; text: string; cursor?: boolean }[] = [
    { prompt: true, text: "neofetch" },
    { text: "       ___       adrian@workstation" },
    { text: "      (.. |      OS: Arch Linux x86_64" },
    { text: "      (<> |      Shell: zsh 5.9" },
    { text: "     / __  \\     WM: Hyprland" },
    { text: "    ( /  \\ /|    Terminal: kitty" },
    { text: "   _/\\ __)/_)    Uptime: 14 hours" },
    { text: "   \\/_____\\/     Packages: 1,247" },
    { text: "" },
    { prompt: true, text: "git log --oneline -5" },
    { text: "a3f2c1d add time-based desk props" },
    { text: "8b1e4a7 fix monitor material override" },
    { text: "c92d3f0 update evening color palette" },
    { text: "1e7a8b2 add shadow-catching floor plane" },
    { text: "f4c6d9e initial 3D desk scene setup" },
    { prompt: true, text: "", cursor: true },
  ];

  return (
    <div
      style={{
        width: "420px",
        height: "246px",
        background: "#0A0A0A",
        fontFamily: "monospace",
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: "1px",
        overflow: "hidden",
      }}
    >
      {termLines.map((line, i) => (
        <div key={i} style={{ fontSize: "7px", lineHeight: "12px", color: "#7A7A9A" }}>
          {line.prompt && <span style={{ color: "#5EA87E" }}>~/portfolio</span>}
          {line.prompt && <span style={{ color: "#8B7CF6" }}> $ </span>}
          <span style={{ color: line.prompt ? "#E8E8F0" : "#7A7A9A" }}>{line.text}</span>
          {line.cursor && (
            <span
              style={{
                display: "inline-block",
                width: "5px",
                height: "9px",
                background: "#8B7CF6",
                marginLeft: "1px",
                animation: "blink 1s step-end infinite",
              }}
            />
          )}
        </div>
      ))}
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </div>
  );
}

export default function MonitorContent() {
  const theme = useTheme();
  const { viewMode } = useViewMode();

  if (viewMode === "about") return null;

  const screens: Record<string, ReactNode> = {
    morning: <MorningScreen />,
    afternoon: <AfternoonScreen />,
    evening: <EveningScreen />,
    night: <NightScreen />,
  };

  return (
    <Html
      position={[0, 0.94, 0.43]}
      transform
      distanceFactor={0.5}
      style={{
        width: "420px",
        height: "246px",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {screens[theme.name]}
    </Html>
  );
}
