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

The clock arrows preview six stops (02:00, 09:00, 11:00, 14:00, 19:00, 23:00), including a late-night view of the evening scene. Live scenes follow Stockholm time: sleeping 00–06, Figma 06–11, Meet 11–13, coding 13–18, and YouTube 18–24. Screens are local illustrated canvas textures; no third-party embeds or network requests. Meeting mode lights the key light and moves the coffee; afternoon adds water and a coffee ring; evening adds warm monitor backlighting. Screen changes crossfade and chair/light changes ease, with workspace animation disabled for reduced-motion preferences.
