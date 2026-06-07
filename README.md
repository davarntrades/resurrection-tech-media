# Resurrection Tech™ — Media

A reusable, branded [Remotion](https://www.remotion.dev) video project for
**Resurrection Tech** — *Runtime Governance for Autonomous Systems*.

It ships with a flagship explainer, **"What is Runtime Governance?"**, and a
data-driven template so new videos are just a folder copy and a text edit.

---

## Quick start

You need **Node 18+** and npm.

```bash
npm install        # install dependencies
npm run dev        # open Remotion Studio in your browser to preview/scrub
```

`npm run dev` (alias `npm run preview`) launches **Remotion Studio**. Pick a
composition on the left, scrub the timeline, and edit live.

### Render an MP4

```bash
npm run render:explainer
# → out/runtime-governance-explainer.mp4
```

> The first render downloads a headless Chrome (one time, ~150 MB). In a
> restricted sandbox without network/Chrome that step is expected to fail —
> previewing in Studio and `npm run build` (bundle) do **not** need Chrome.

### Verify the project

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint src && tsc
npm run build       # remotion bundle (no Chrome required)
```

---

## Brand tokens

Single source of truth: [`src/branding/theme.ts`](src/branding/theme.ts).
Colors mirror the live site (`resurrection-tech-enterprise`).

| Role            | Token                       | Hex                       |
| --------------- | --------------------------- | ------------------------- |
| Base background | `bg`                        | `#08090b`                 |
| Page            | `bg1`                       | `#0b0d10`                 |
| Card panel      | `panel` / `panel2`          | `#0f1216` / `#14181d`     |
| Ink (primary)   | `ink`                       | `#f3f5f7`                 |
| Ink (secondary) | `ink2` / `ink3` / `ink4`    | `#aab2bd` / `#6b7480` / `#474e58` |
| Accent          | `accent` / `accentBright`   | `#4c7dff` / `#6f97ff`     |
| Accent purple   | `accentPurple`              | `#6d5cff`                 |
| Omega / risk    | `omega`                     | `#e5484d`                 |
| OK / safe       | `ok`                        | `#3fb27f`                 |

**Fonts:** Geist (sans) + Geist Mono (mono), **self-hosted** as variable woff2
in `public/branding/fonts/` (sourced from the `geist` npm package) and loaded
via [`@remotion/fonts`](https://www.remotion.dev/docs/fonts-api/load-font) +
`staticFile`. This keeps renders fast, offline, and deterministic — no Google
Fonts network round-trips.
**Video config:** 1920×1080 @ 30fps.

---

## The flagship video

`RuntimeGovernanceExplainer` — ~55s (1650 frames @ 30fps). Five scenes,
composed with `<Series>` in
[`src/templates/ExplainerTemplate.tsx`](src/templates/ExplainerTemplate.tsx):

| Scene        | Frames | What happens                                                              |
| ------------ | ------ | ------------------------------------------------------------------------ |
| **Title**    | 120    | The ℛ(t) mark draws in over a mono tagline.                              |
| **Drift**    | 600    | A system's dot accelerates along its trajectory **into Ω** — red flash. |
| **Solution** | 480    | A purple **governance boundary** sweeps in, intercepts, and corrects the trajectory into the green **SAFE SET**. |
| **Pillars**  | 300    | Three cards — **Monitor / Constrain / Audit**.                          |
| **Outro**    | 150    | ℛ(t) logo, "Resurrection Tech™", CTA, and URL.                          |

All copy and timing live as data in
[`src/videos/runtime-governance-explainer/script.ts`](src/videos/runtime-governance-explainer/script.ts).

---

## Project structure

```
src/
  index.ts                    # registerRoot
  Root.tsx                    # registers each <Composition>
  branding/
    theme.ts                  # colors + fonts (single source of truth)
    Logo.tsx                  # animated ℛ(t) mark
  components/
    Background.tsx            # grid + drifting glow + vignette
    KineticText.tsx           # spring-up + fade-in text
    ReachabilityDiagram.tsx   # SVG: trajectory / Ω / safe set / boundary
    Watermark.tsx             # persistent corner mark
  scenes/
    TitleScene.tsx
    DriftScene.tsx
    SolutionScene.tsx
    PillarsScene.tsx
    OutroScene.tsx
  templates/
    ExplainerTemplate.tsx     # composes scenes with <Series>
  videos/runtime-governance-explainer/
    index.tsx                 # composition wrapper
    script.ts                 # text content (data-driven)
public/branding/{logo,fonts}, public/audio   # asset folders
out/                          # rendered mp4s (git-ignored)
```

---

## Make a new video

The template is data-driven, so a new video means **copy a folder and edit
text** — no component changes:

1. Copy `src/videos/runtime-governance-explainer/` to
   `src/videos/<your-video>/`.
2. Edit `script.ts` — change the copy, the pillars, and per-scene `frames`.
3. In [`src/Root.tsx`](src/Root.tsx), import your wrapper and add another
   `<Composition>` (give it a unique `id` and use `totalDuration(yourScript)`
   for `durationInFrames`).
4. Preview with `npm run dev`; render with
   `npx remotion render <YourId> out/<your-video>.mp4`.

To restyle every video at once, edit `src/branding/theme.ts`.

---

## Remotion best practices

This repo bundles the official Remotion skill at
[`.claude/skills/remotion-best-practices`](.claude/skills/remotion-best-practices)
(from [remotion-dev/skills](https://github.com/remotion-dev/skills)) so an agent
working in this repo follows Remotion conventions automatically.
