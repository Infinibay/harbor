import { FlameGraph } from "./FlameGraph";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const sampleFrames = [
  { id: "root", label: "request", value: 120 },
  { id: "auth", label: "verifyToken", value: 18, parent: "root" },
  { id: "db", label: "query users", value: 72, parent: "root" },
  { id: "io", label: "fs.readFile", value: 20, parent: "db" },
  { id: "parse", label: "parseRows", value: 30, parent: "db" },
  { id: "tpl", label: "renderTemplate", value: 26, parent: "root" },
  { id: "compile", label: "compile", value: 12, parent: "tpl" },
];

function FlameGraphDemo(props: any) {
  return (
    <div style={{ width: "100%", minHeight: 240 }}>
      <FlameGraph {...props} frames={props.frames ?? sampleFrames} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: FlameGraphDemo as never,
  importPath: "@infinibay/harbor/charts",
  controls: {
    rowHeight: { type: "number", default: 22 },
    minPixelWidth: { type: "number", default: 1 },
  },
  variants: [
    { label: "Default", props: {} },
    {
      label: "Tall rows",
      props: { rowHeight: 32 },
    },
    {
      label: "ms formatter",
      props: { formatValue: (v: number) => `${v.toFixed(1)} ms` },
    },
  ],
};
