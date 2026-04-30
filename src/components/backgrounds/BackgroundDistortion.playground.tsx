import { BackgroundDistortion, type BackgroundDistortionProps } from "./BackgroundDistortion";
import { MeshGradient } from "./MeshGradient";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

function BackgroundDistortionDemo(props: BackgroundDistortionProps) {
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
      <MeshGradient />
      <BackgroundDistortion {...props} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: BackgroundDistortionDemo as never,
  importPath: "@infinibay/harbor/backgrounds",
  controls: {
    preset: {
      type: "select",
      options: [
        "scanlines",
        "crt",
        "grain",
        "vhs",
        "pixel-grid",
        "dither",
        "vignette",
        "bloom",
        "interlace",
      ],
      default: "crt",
    },
    intensity: { type: "number", default: 0.5, min: 0, max: 1 },
    animated: { type: "boolean", default: true },
    opacity: { type: "number", default: 1, min: 0, max: 1 },
    tint: { type: "color", default: "#000000" },
  },
  variants: [
    { label: "CRT", props: { preset: "crt", intensity: 0.6 } },
    { label: "VHS", props: { preset: "vhs", intensity: 0.7 } },
    { label: "Grain", props: { preset: "grain", intensity: 0.5 } },
    { label: "Vignette", props: { preset: "vignette", intensity: 0.7 } },
  ],
};
