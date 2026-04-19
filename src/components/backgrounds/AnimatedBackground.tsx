import { type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { MeshGradient, type MeshGradientProps } from "./MeshGradient";
import { Aurora, type AuroraProps } from "./Aurora";
import { Starfield, type StarfieldProps } from "./Starfield";
import { DotGrid, type DotGridProps } from "./DotGrid";
import { Waves, type WavesProps } from "./Waves";
import { Constellations, type ConstellationsProps } from "./Constellations";
import { Orbs, type OrbsProps } from "./Orbs";
import { PlasmaField, type PlasmaFieldProps } from "./PlasmaField";

export type BackgroundVariant =
  | "mesh"
  | "aurora"
  | "starfield"
  | "dot-grid"
  | "waves"
  | "constellations"
  | "orbs"
  | "plasma";

export type AnimatedBackgroundProps =
  | ({ variant: "mesh" } & MeshGradientProps)
  | ({ variant: "aurora" } & AuroraProps)
  | ({ variant: "starfield" } & StarfieldProps)
  | ({ variant: "dot-grid" } & DotGridProps)
  | ({ variant: "waves" } & WavesProps)
  | ({ variant: "constellations" } & ConstellationsProps)
  | ({ variant: "orbs" } & OrbsProps)
  | ({ variant: "plasma" } & PlasmaFieldProps);

/** Single dispatcher for every animated background variant. Accepts
 *  `variant` + whatever per-variant props that variant exposes.
 *
 *  ```tsx
 *  <AnimatedBackground variant="mesh" blobs={5} speed={0.8} />
 *  <AnimatedBackground variant="constellations" density={0.9} cursorReactive />
 *  ```
 *
 *  You can also import each variant directly for smaller bundles or
 *  for config-time certainty about the prop shape:
 *
 *  ```tsx
 *  import { MeshGradient, Aurora, Starfield, ... } from "@infinibay/harbor";
 *  ``` */
export function AnimatedBackground(props: AnimatedBackgroundProps) {
  switch (props.variant) {
    case "mesh":
      return <MeshGradient {...props} />;
    case "aurora":
      return <Aurora {...props} />;
    case "starfield":
      return <Starfield {...props} />;
    case "dot-grid":
      return <DotGrid {...props} />;
    case "waves":
      return <Waves {...props} />;
    case "constellations":
      return <Constellations {...props} />;
    case "orbs":
      return <Orbs {...props} />;
    case "plasma":
      return <PlasmaField {...props} />;
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
