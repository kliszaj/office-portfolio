# Handoff — Adrian’s 3D workspace portfolio

Updated: 2026-10-25 (Europe/Stockholm).

## Start here

The active project is **office-portfolio-revision**, not the original room viewer.

- Workspace root: `/Users/aklisz/Documents/Codex/2026-10-23/https-github-com-wesbos-3d-model-2`
- Active checkout: `work/office-portfolio-revision` under that root.
- Repository: https://github.com/kliszaj/office-portfolio
- Branch: `design/workspace-portfolio-revision`
- Last implementation commit: `383dbe5a2f9b1a684604ee2b79afaf20e66cf38d`, confirmed pushed to origin.
- Preview: http://localhost:3003/
- Original checkout: `work/office-portfolio`, main baseline preview http://localhost:3002/.
- Keep the revision separate. Do not merge it into main unless requested.
- At handoff, port 3003 is running the production build (PID 90901). Recheck before stopping anything; PIDs are transient.

The user explicitly requested a handoff. No further design changes were requested in this final turn.

## Most recent requests and status

The user supplied five SketchUp files, then repeatedly pointed out that objects were floating. They particularly want:

1. The original open woven mesh appearance on both the chair back and seat.
2. Keyboard facing correctly, with the **whole keyboard** resting on the mat, not merely feet extended downwards.
3. Key light facing forward and physically clamped to the desk with a bracket.
4. AirPods and macro keypad sitting on the desktop.
5. Photo-matched colors: warm ivory/gray keyboard, white monitor and mic arms, silver Terra with wood front.

### Latest implementation (383dbe5)

- Removed the extra keyboard feet that had been added in an unsuccessful attempt to fix floating.
- Lowered the **entire imported keyboard assembly** to root-local Y **0.7735**, from approximately 0.7835. This moves the case, keys, and original feet together.
- Macro keypad group Y is **0.7765**; shell bottom now meets desktop Y **0.778**.
- AirPods body center Y is **0.7905**; bottom meets Y **0.778**. Lid seam moved with it.
- Replaced the imported key-light bracket with an explicitly fitted C-clamp. Upper contact pad bottom is Y **0.778**; underside pressure pad top is Y **0.734**. Spine is outside the rear edge. The imported pole connects to a new socket.
- Tightened daytime directional shadow camera from ±6 to ±2.5 and increased its map from 2048 to 4096, to improve contact shadows.
- Rebuilt and restarted port 3003; changes are committed and pushed.

**Important limitation:** the user has NOT yet confirmed that the latest whole-keyboard adjustment resolves the visual issue. Earlier bounds checks passed while the user could still see floating. Do not claim that passing a bounding-box test proves visual contact. The keyboard now has some underside geometry below the mat plane; if refining it, inspect the visible case skirt and key positions from the side rather than trusting the minimum vertex. Avoid adding feet again as a substitute for moving the whole object.

Latest screenshot: `outputs/desk-grounded.png` under the workspace root. It shows the last build at night. Prior screenshot `outputs/desk-objects-corrected.png` predates the latest grounding fixes.

## Model sources

Original scan: `/Users/aklisz/Downloads/Room`.

Useful photos:
- `photos/0000.jpg`: front desk, keyboard, chair back, small accessories.
- `photos/0008.jpg`: Terra front/side, white microphone boom and clamp, windscreen, desk edge.
- Contact sheet: `work/contact.jpg` under workspace root.

User-supplied objects: `/Users/aklisz/Desktop/objects`:
- `Ergotron+LX+Monitor+Arm.skp`
- `Glorious+GMMK+Pro+75%+Mechanical+Keyboard+White+(QWERTY).skp`
- `HMI_Aeron_Chair_A_Size_Height_Adjustable_Arms.skp`
- `Terra_Fractal+Design_Mini-ITX.skp`
- `key+light.skp`

Mouse source: `/Users/aklisz/Downloads/MX+Master+3S.skp`. User initially called the real mouse an MX Master 4, but explicitly supplied and authorized this 3S model. Do not label the imported asset a 4.

Other hardware: Sony A6000 on top of the monitor; AT2020 USB microphone; Elgato Key Light Mini. No microphone-arm model was supplied, so its white animated procedural version remains.

Converted runtime models in active checkout `public/models/`:
- `aeron.glb` (~3.1 MB)
- `gmmk-pro.glb` (~1.6 MB)
- `terra.glb` (~3.3 MB)
- `ergotron-lx.glb` (~696 KB)
- `key-light.glb` (~132 KB)
- `mx-master-3s.glb` (~7.2 MB)

Original SKP files remain unchanged. Conversion used installed `work/skp-venv/bin/skptool` (OpenSKP), e.g. `skptool convert INPUT.skp -o OUTPUT.glb`. Raw conversions and diagnostic renders are in `work/object-import`. `work/model-tools/prepare-objects.py` limits embedded texture dimensions to 512px and repacks GLBs without changing topology. Mouse tools are alongside it. These tools are outside the Git checkout; do not assume they are committed.

## Scene architecture

Next.js 16.1.6, React 19, Three.js, React Three Fiber, Drei. No new package dependencies added for these imports.

- `components/WorkspaceModel.tsx`: loads all GLBs, clones owned resources, calls `buildWorkstation`, then `installDeskAssets`, then `prepareScenes`, then static batching. Handles monitor/camera/coffee clicks, hover labels, steam and scene updates. Do not mutate shared GLTF loader cache or dispose it.
- `lib/workspace/model.ts`: original procedural desk and objects. Dimensions are meters. Root is translated Z +0.4. Desktop top is local Y 0.778, underside 0.734; mat top is 0.7835; rear desk edge local Z -0.3895. It still builds fallback objects before replacements.
- `lib/workspace/imports.ts`: imports, cloned resources, material matching, orientation, whole-object placement, explicit light clamp. Preserve stable named groups for scene animation.
- `lib/workspace/scenes.ts`: time-dependent screen textures, coffee amount/visibility, peripheral/chair/mic movement, key-light glow and monitor backlight.
- `lib/workspace/batch.ts`: merges meshes sharing materials within designated dynamic roots. It can remove original mesh identities. Preserve interaction roots and animated meshes before batching.
- `components/DeskScene.tsx`: camera, sunlight, floor/shadows, monitor glow, WebGL fallback.

### Import specifics

- Aeron geometry is imported but its fabric meshes reuse clones of the **original procedural weave map AND alpha map**. Both maps repeat 5×5, alphaTest 0.5, double-sided. UVs are generated across the seat/back bounds. User strongly prefers this older visible mesh weave.
- Keyboard rotates **-π/2 about Y**. Verified raw source spacebar landmark is `(0.1182, 0.0254, -0.1411)`; function-row landmark is `(0.0182, 0.0373, -0.1825)`. An earlier assumption swapped these and led to a backwards keyboard; use actual key geometry.
- Terra keeps wood material and recolors case surfaces silver with metalness .25, roughness .42. Bottom placed at Y .778.
- Ergotron recolored white, source pose adapted to monitor VESA position and rear clamp location.
- Supplied light is a larger key light; its housing is resized to Mini proportions. It rotates **+π/2**, because the emitting face points -X in the source. Flat imported bracket geometry below Y .071 is discarded; fitted clamp replaces it.
- Mic foam windscreen and Terra vent refinements were based on photo 0008. The imported Terra now supersedes its procedural counterpart.

Stable group names:
- `Mechanical keyboard`
- `Workspace mouse`
- `Colourful macro controller`
- `Herman Miller Aeron • stylized` (name retained despite imported geometry)
- `Fractal Design Terra • silver`
- `Elgato Key Light Mini`
- `Ultrawide monitor`
- `Sony A6000 on monitor mount`
- `Microphone swing pivot` (created by prepareScenes)

## Revision website and case studies

Earlier revision commit: `d3beb9f`. Model-import commit: `c5ba476`.

- `components/RevisionHome.tsx`: editorial intro next to desk, scene caption/clock, three selected case cards, contact footer.
- Monitor click scrolls to work; camera click opens About; coffee gives a steam puff. Hero buttons offer keyboard-accessible equivalents for navigation.
- Retained warm morning, blue afternoon, dark purple night palettes and animated day scenes. Clock arrows explore scenes; camera default FOV is 34.
- Morning: Slack/Figma/Spotify; meeting: Meet/Figma with light on and boom extended; afternoon: Claude Code/prototype; evening: windowed YouTube over wallpaper. Coffee declines during morning, then disappears with a ring and water glass replacing it.
- `lib/portfolio-cases.ts`: authored content imported from https://github.com/kliszaj/textfolio at commit `1d7644c`.
- `lib/projects.ts`: adapts Spotify Jam, Seamless Strategy, Focals by North, plus About to existing navigation.
- `components/CaseStudyContent.tsx`: case facts, prose, linked sources, videos and galleries. Videos preload none.
- Media copied into `public/assets/`. Seamless had no finished gallery media in source, so existing case preview is retained. Placeholder source media is not rendered.
- Current bio and contact links from textfolio; email hello@adrianklisz.com.
- Local read-only source clone: `work/textfolio`.

## Run and verify

Run from the active checkout:

```sh
npm run lint
npm run build
node --experimental-strip-types scripts/check-workspace-clearance.mjs --imported
npm run start -- -p 3003
```

The local preview is **production**, not hot reload. After editing, build AND restart its server. Use `lsof -nP -iTCP:3003 -sTCP:LISTEN` to identify the correct process. Do not kill unrelated preview servers.

Last checks passed:
- ESLint
- Production build / TypeScript
- Geometry regression: 16,036 microphone mesh bounds across 211 poses, with 5 mm expanded Terra clearance.
- Explicit clamp pad contact planes; AirPods/keypad bottoms; keyboard orientation and assembly lowered through the mat plane; original woven material on both chair surfaces.

The script’s keyboard condition is deliberately only a coarse guard. It does not prove the visible shell looks grounded. Test meaningful contact geometry, not a hardcoded position that merely mirrors the implementation.

Repository preference: **Do not use Playwright for verification unless the user asks.** Native CUA screenshots and accessibility controls have been used. Respect the user’s current viewport; do not resize just for prettier screenshots. Browser handles may reset after user steering. Reacquire when stale. Keep the localhost preview marked as a deliverable if opened via CUA.

## Next-agent priorities if user requests further fixes

1. Ask no redundant permissions; user has authorized model integration and local fixes.
2. Inspect the latest build on port 3003, especially the whole keyboard from a side angle and the light clamp against the rear edge. Distinguish old cached build from current build before editing.
3. Preserve photo colors, old chair weave, correct keyboard orientation, and collision-free animated mic.
4. Make actual geometric corrections where needed; avoid repeating claims that bounds checks alone prove no floating.
5. Keep changes on the revision branch. User previously asked to save to GitHub; implementation commits have been pushed there. No PR was created or merged for this revision.
