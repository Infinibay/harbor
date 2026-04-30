import { AnimatedBackground, type AnimatedBackgroundProps } from "./AnimatedBackground";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AnimatedBackgroundDemo(props: any) {
  const variant = (props.variant ?? "mesh") as AnimatedBackgroundProps["variant"];
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 400,
        overflow: "hidden",
        borderRadius: 12,
        background: "#0a0a14",
      }}
    >
      <AnimatedBackground
        {...({ variant, speed: props.speed, intensity: props.intensity } as AnimatedBackgroundProps)}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: AnimatedBackgroundDemo as never,
  importPath: "@infinibay/harbor/backgrounds",
  controls: {
    variant: {
      type: "select",
      options: ["mesh", "aurora", "waves", "constellations", "orbs", "plasma", "bubbles", "macscape"],
      default: "mesh",
    },
    speed: { type: "number", default: 1, min: 0, max: 3 },
    intensity: { type: "number", default: 0.5, min: 0, max: 1 },
  },
  variants: [
    { label: "Mesh", props: { variant: "mesh" } },
    { label: "Aurora", props: { variant: "aurora" } },
    { label: "Plasma", props: { variant: "plasma" } },
    { label: "Bubbles", props: { variant: "bubbles" } },
  ],
};
