# HANDOFF

## Project

Repo: `C:\Users\Adrian\Documents\Coding\office-portfolio`

Next.js 16 (Turbopack) + React 19 portfolio with a 3D desk scene (`@react-three/fiber` / `drei` / `three`), time-of-day theming, and `framer-motion`.

## Running locally

The local preview runs the **production** build (not `next dev`):

```powershell
npm run build
npm run start -- -p 3001
```

Port `3000` is used by another app, so use `3001`.

IMPORTANT: because this is `next start` (a built bundle), **code changes are not hot-reloaded**. After editing, you must `npm run build` **and restart** the `3001` server for changes to appear. If the user says "I still don't see X," first check that the server was rebuilt + restarted, and have them hard-refresh (Ctrl+Shift+R) to clear the cached JS bundle.

## Verification

Always run before handing off:

```powershell
npm run lint     # eslint — must be clean
npm run build    # must succeed
```

Both currently pass.

## Working-preference notes

- **Do NOT use Playwright** browser tools to verify/screenshot unless the user explicitly asks. The Chrome (`claude-in-chrome`) extension was also not connected this session. Rely on lint/build; the user does visual verification.

## Architecture / providers

`components/ClientProviders.tsx` wraps the app:

```
ThemeProvider → WorkLayoutProvider → TransitionProvider → ThemedBody → children
```

- `lib/theme.tsx` — time-of-day themes + live color overrides (see below). `useTheme()`, `useThemeControls()` (clock time preview), `useThemeColorControls()` (settings color editor).
- `lib/workLayout.tsx` — all settings state (clock, loader, header, desk, camera, layout, open mode, color). `useWorkLayout()`.
- `lib/transition.tsx` — case-study open (page route or expanded in-page card). `startTransition(project, rect?)` — `rect` is optional; omitted opens from a centered box (used by the header About link).
- `lib/view.tsx` was **deleted** (the old fullscreen "About" view mode is gone).

## Major changes this session

### Loading screen (React Bits `CircularText`)

- `components/CircularText.tsx` + `components/CircularText.module.css` — React Bits component, adapted to TypeScript and the installed `framer-motion` (its snippet imported `motion/react`; we use `framer-motion`, no new dep). Added a `color` prop.
- `components/PageLoader.tsx` — full-screen overlay (`z-index 200`) showing the spinning text, colored with `theme.accent` (matches time of day). Fades out ~0.5s after load (min ~1.1s, 2.6s max fallback). Rendered inside `ThemedBody`.
- Configurable via settings (see Loader section): enabled, text, spin duration, hover behavior.

### Time-of-day color picker (live)

- `lib/theme.tsx` supports per-time-of-day overrides of **accent / background / text** (`EditableColorKey`). `setColorOverride`, `resetColorOverrides`.
- A separate `colorPreview` override (set while the settings panel is open) previews the palette being edited. It takes precedence over the clock's time preview and is NOT clobbered by `TimeDisplay`'s per-second `setOverride`. Cleared when the panel closes.

### Header

- `components/Header.tsx` — all text (name, "My Work", "About Me") uses `theme.accent`. Font size scales via `headerSettings.fontScale` (default `1.15`). "About Me" opens the About sheet via `startTransition(aboutProject)`.

### About Me → sheet in the messy pile (no more 3D screen)

- Removed the fullscreen 3D zoom-to-monitor About experience entirely: deleted `lib/view.tsx` / `ViewProvider`; removed the monitor About content, back button, and all `viewMode` camera/positioning branches from `DeskScene.tsx`; removed the About guard from `MonitorContent.tsx`.
- `lib/projects.ts` — added an `about-me` entry (`kind: "about"`, optional `year`/`status`, new `about: { intro, tags, links }`). Exported `aboutProject`.
- `components/AboutContent.tsx` — renders bio paragraphs + tags + link pills. GitHub/LinkedIn links are placeholders (`href: "#"`, rendered as non-clickable pills); Email is `mailto:kliszaj@gmail.com`. **TODO:** get real GitHub/LinkedIn URLs from the user.
- Rendered by both the expanded card (`lib/transition.tsx`) and the route (`app/project/[slug]/page.tsx`), which now branch on `project.kind === "about"`. `ShuffledProjectWindows` has a 7th window layout for the About card; card meta tolerates missing `year`/`status`.

### `MonitorContent.tsx`

- No longer rendered (the on-screen monitor content — emails/code/YouTube/terminal — was removed at the user's request). File kept in repo in case they want it back.

### Seven-segment clock (`components/TimeDisplay.tsx`)

- Geometry rewritten from `pouyamer/react-seven-segment-clock` as a **parametric** generator `buildSegments(h)` (`h` = half-thickness). `h = 1` reproduces the reference. viewBox `-1 -1 12 20`.
- Settings (in `SevenSegmentClockSettings`): `size`, `segmentWidth` (0.5–2.0×, half-thickness), `segmentGap` (centroid-shrink notch), `inactiveOpacity` (ghost segments), `blinkColon`.
- Current defaults: size **75%**, width **1.2×**, gap **1.8px**, ghost **4%**, blink on.
- Chevron arrows: larger (56px buttons, 30px icons), use `theme.accent`, and are in the **same row as the digits** so they center on the display.
- "Back to now" button (appears when time is previewed away from real Stockholm time): accent-colored, generous padding, absolutely positioned above the digits (`bottom-full pb-3`, `pointer-events-none` wrapper) so it floats in without shifting layout; gap matches the digits↔location gap.
- Location label "Stockholm, Sweden" uses `theme.accent`.

### Lighting / shadows (`components/DeskScene.tsx`)

- `SceneLighting` eases the directional light's **position, color, intensity** (and ambient) toward the current time-of-day target each frame, so the shadow **sweeps** across the desk on transitions.
- **Crossfade (not sweep) for evening↔night and morning↔night:** these freeze the light position and blend values over a fixed **`CROSSFADE_SECONDS = 0.75`** with `easeInOut`, so the shadow fades in place instead of sliding. All other transitions use exponential easing (`SWEEP_DAMP = 0.06`). Both `SceneLighting` and `DeskScene3D` (shadow opacity) run this crossfade logic in sync via `isNightCrossfade()`.
- **Night shadow:** the cast ground shadow (`ShadowMaterial` on the floor plane) eases to `NIGHT_SHADOW_OPACITY = 0.45` at night vs `DAY_SHADOW_OPACITY = 0.25` in daytime. Night needs higher opacity because a black shadow on the dark night background (`#181828`) is otherwise invisible (dark-on-dark).
- **Only one shadow caster now:** the desk lamp's `pointLight` in `components/DeskProps.tsx` had `castShadow` (a second shadow). Removed it — the lamp is now a fill light only, so the directional light is the sole shadow source.

### Accent colors (`lib/theme.tsx`)

Updated to: morning `#FE8420`, afternoon `#2A7BFE`, evening `#E84F8A`, night `#8B7CF6`.

### Misc

- `app/page.tsx` — clock moved up (removed `pt-8`, now `pt-1`); added a 300px bottom spacer for extra scroll room.

## Settings panel (`components/DeskSettingsMenu.tsx`)

Gear icon in the header. Sections: Layout, Case study, Clock (size / segment width / segment gap / ghost / blink), Colors (time-of-day accent/background/text pickers), Loader (enabled / text / spin duration / hover), Header (font size), Cloudiness / Padding / Tilt / Soft shadows, Camera. Each group has its own reset.

## Key files

```text
app/page.tsx
app/project/[slug]/page.tsx
components/AboutContent.tsx
components/CaseStudyContent.tsx
components/CircularText.tsx  (+ .module.css)
components/ClientProviders.tsx
components/DeskProps.tsx
components/DeskScene.tsx
components/DeskSettingsMenu.tsx
components/Header.tsx
components/MonitorContent.tsx  (unused — no longer rendered)
components/PageLoader.tsx
components/ProjectCard.tsx
components/ProjectGrid.tsx
components/ShuffledProjectWindows.tsx
components/SpotlightCard.tsx  (+ .module.css)
components/TimeDisplay.tsx
lib/homeScroll.ts
lib/projects.ts
lib/theme.tsx
lib/time.ts
lib/transition.tsx
lib/workLayout.tsx
public/case-studies/
```

## Corner radii reference (case study cards)

- Expanded case-study sheet: **22px** (`rounded-[22px]`, animates open 18→22). Hero image inside: 17px.
- `CaseStudyContent` image panels: 16px (`rounded-2xl`).
- `SpotlightCard` surface (pile + list cards): 24px (`1.5rem`). Pile thumbnail 14px, list thumbnail 12px.

## Open items / next steps

1. Get real **GitHub / LinkedIn URLs** for `about-me` in `lib/projects.ts` (currently `#` placeholders).
2. The **backgrounds** from the user's color-picker screenshots were NOT applied (only accents were): Morning `#FFE9C7`, Afternoon `#D6EBFF`, Evening `#FFD6E0`, Night `#181828`. Ask if they want these applied as defaults.
3. Night shadow contrast is inherently limited (black-on-dark). If a crisper night ground shadow is wanted, consider adding a subtle lit floor disc for the shadow to darken. `NIGHT_SHADOW_OPACITY` (0.45) is the tuning knob.
4. Consider whether `components/MonitorContent.tsx` and `components/ThemeDebug.tsx` (both unused) should be deleted.
5. Untracked/generated cruft in the repo root: `nul`, `next-start*.log` files, `blender/office_remix.blend1`.
