import { PlasmaField, type PlasmaFieldProps } from "./PlasmaField";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

function PlasmaFieldDemo(props: PlasmaFieldProps) {
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
      <PlasmaField {...props} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: PlasmaFieldDemo as never,
  importPath: "@infinibay/harbor/backgrounds",
  controls: {
    scale: { type: "number", default: 8, min: 1, max: 32 },
    frequency: { type: "number", default: 0.02, min: 0.001, max: 0.2 },
    blur: { type: "number", default: 18, min: 0, max: 60 },
    speed: { type: "number", default: 1, min: 0, max: 3 },
    intensity: { type: "number", default: 0.5, min: 0, max: 1 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Sharp", props: { scale: 3, blur: 4 } },
    { label: "Cheap & dreamy", props: { scale: 16, blur: 30 } },
  ],
};
