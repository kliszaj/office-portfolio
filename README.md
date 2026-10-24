This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Personal workspace scene

The main scene uses `components/WorkspaceModel.tsx` and editable Three.js geometry in
`lib/workspace/model.ts`. It includes the desk, Aeron-style chair, Fractal Terra,
monitor with a mounted Sony A6000, microphone, key light, peripherals and coffee.
The coffee steam animates in place and respects reduced-motion preferences.
No room walls, cabinets, scan files or reference photos are included.

Procedural canvas textures retain the illustrated display, key legends, cutting
mat and woven chair surfaces. Static geometry is batched for rendering; the
original parts remain editable in source. Existing theme lighting and settings
remain active, with monitor glow aligned to the new screen.

The batching helper is adapted from the MIT-licensed
[3d-model-anything](https://github.com/wesbos/3d-model-anything) runtime; its license
is included in `lib/workspace/LICENSE`. Product shapes are stylized approximations.

Validate with `npm run lint` and `npm run build`. Run the production preview with
`npm run start -- -p 3002` if port 3001 is occupied.

### Workspace day scenes

The clock arrows preview six stops (02:00, 09:00, 11:00, 14:00, 19:00, 23:00), including a late-night view of the evening scene. Live scenes follow Stockholm time: sleeping 00–06, Slack + Figma + a Spotify mini-player 06–11, Meet + Figma 11–13, Claude Code + a mobile prototype 13–18, and windowed YouTube over desktop wallpaper 18–24. Screens are local illustrated canvas textures; no third-party embeds or network requests. Meeting mode lights the key light and moves the coffee; afternoon adds water and a coffee ring; evening adds warm monitor backlighting. Screen changes crossfade and chair/light changes ease, with workspace animation disabled for reduced-motion preferences.

Scene palettes follow the workflow: warm morning, soft blue meetings, richer blue afternoon, warm dusk and dark purple night. The camera defaults to 34° FOV. The boom arm pivots at its fixed clamp for meetings; keyboard, mouse, mat, controller and chair gently change pose between scenes.

Hardware detail: the microphone arm now stays in front of the Terra during its entire swing. Run `node --experimental-strip-types scripts/check-workspace-clearance.mjs` (Node 22+) to check 211 poses against the computer's bounds plus 5 mm clearance. The displayed mouse is the user-supplied MX Master 3S, converted locally from `MX+Master+3S.skp` using OpenSKP/skptool. `public/models/mx-master-3s.glb` preserves the mesh, UVs and surface maps, uses 1024px textures, and is centered at the tabletop footprint in metres. It contains 69,869 triangles and is about 7.6 MB. The original SketchUp file remains outside the repository. The procedural MX Master 4 remains only as a fallback for geometry-only checks.

## Workspace portfolio revision

Branch `design/workspace-portfolio-revision` adds an editorial introduction,
selected case studies, and monitor/camera/coffee interactions. Preview separately
with `npm run build` then `npm run start -- -p 3003`.

Case content, bio, and Jam/Focals media are imported from `kliszaj/textfolio`
(commit `1d7644c`). `lib/portfolio-cases.ts` retains the authored source data;
`lib/projects.ts` adapts it to the existing portfolio navigation. Videos load on
demand. Seamless has no finished media in the source, so its existing preview
image is retained. No placeholder projects appear in this revision.

Scan photo `Room/photos/0008.jpg` informed the foam microphone windscreen,
staggered Terra side vents, and front-panel control positions. The existing
stylized Aeron is retained; no external chair asset has been imported.
