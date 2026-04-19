import { type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { MeshGradient, type MeshGradientProps } from "./MeshGradient";
import { Aurora, type AuroraProps } from "./Aurora";
import { Waves, type WavesProps } from "./Waves";
import { Constellations, type ConstellationsProps } from "./Constellations";
import { Orbs, type OrbsProps } from "./Orbs";
import { PlasmaField, type PlasmaFieldProps } from "./PlasmaField";
import { Bubbles, type BubblesProps } from "./Bubbles";
import { MacScape, type MacScapeProps } from "./MacScape";

export type BackgroundVariant =
  | "mesh"
  | "aurora"
  | "waves"
  | "constellations"
  | "orbs"
  | "plasma"
  | "bubbles"
  | "macscape";

export type AnimatedBackgroundProps =
  | ({ variant: "mesh" } & MeshGradientProps)
  | ({ variant: "aurora" } & AuroraProps)
  | ({ variant: "waves" } & WavesProps)
  | ({ variant: "constellations" } & ConstellationsProps)
  | ({ variant: "orbs" } & OrbsProps)
  | ({ variant: "plasma" } & PlasmaFieldProps)
  | ({ variant: "bubbles" } & BubblesProps)
  | ({ variant: "macscape" } & MacScapeProps);

/** Single dispatcher for every animated background variant. Accepts
 *  `variant` + whatever per-variant props that variant exposes.
 *
 *  ```tsx
 *  <AnimatedBackground variant="mesh" blobs={5} speed={0.8} />
 *  <AnimatedBackground variant="bubbles" count={12} gooeyness={20} />
 *  ```
 *
 *  Import each variant directly for smaller bundles / tighter typing:
 *
 *  ```tsx
 *  import { MeshGradient, Bubbles, MacScape, ... } from "@infinibay/harbor";
 *  ``` */
export function AnimatedBackground(props: AnimatedBackgroundProps) {
  switch (props.variant) {
    case "mesh":
      return <MeshGradient {...props} />;
    case "aurora":
      return <Aurora {...props} />;
    case "waves":
      return <Waves {...props} />;
    case "constellations":
      return <Constellations {...props} />;
    case "orbs":
      return <Orbs {...props} />;
    case "plasma":
      return <PlasmaField {...props} />;
    case "bubbles":
      return <Bubbles {...props} />;
    case "macscape":
      return <MacScape {...props} />;
  }
}

/** Convenience: render a full-bleed animated background behind
 *  `children`. Positions relative container + absolute background. */
export function BackgroundScene({
  children,
  bgProps,
  className,
  overlay,
}: {
  children?: ReactNode;
  bgProps: AnimatedBackgroundProps;
  /** Optional color/gradient overlay pane above the background for
   *  contrast with content (e.g. `rgba(10,10,15,0.4)`). */
  overlay?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <AnimatedBackground {...bgProps} />
      {overlay ? (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: overlay }}
        />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}
