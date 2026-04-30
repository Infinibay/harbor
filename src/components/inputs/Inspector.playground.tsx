import { useState } from "react";
import { Inspector, PropertyRow, InspectorNumber } from "./Inspector";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InspectorDemo(_props: any) {
  const [x, setX] = useState(120);
  const [y, setY] = useState(64);
  const [w, setW] = useState(320);
  const [h, setH] = useState(180);
  const [opacity, setOpacity] = useState(100);

  return (
    <div className="w-[280px]">
      <Inspector
        sections={[
          {
            id: "transform",
            title: "Transform",
            children: (
              <>
                <PropertyRow label="X">
                  <InspectorNumber value={x} onChange={setX} unit="px" />
                </PropertyRow>
                <PropertyRow label="Y">
                  <InspectorNumber value={y} onChange={setY} unit="px" />
                </PropertyRow>
                <PropertyRow label="Width">
                  <InspectorNumber value={w} onChange={setW} min={0} unit="px" />
                </PropertyRow>
                <PropertyRow label="Height">
                  <InspectorNumber value={h} onChange={setH} min={0} unit="px" />
                </PropertyRow>
              </>
            ),
          },
          {
            id: "appearance",
            title: "Appearance",
            children: (
              <PropertyRow label="Opacity">
                <InspectorNumber value={opacity} onChange={setOpacity} min={0} max={100} unit="%" />
              </PropertyRow>
            ),
          },
          {
            id: "advanced",
            title: "Advanced",
            collapsed: true,
            children: <p className="text-xs text-white/50">Nothing to see here yet.</p>,
          },
        ]}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: InspectorDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {},
  variants: [{ label: "Default", props: {} }],
  notes: "Click section headers to collapse. Numbers are controlled and clamped.",
};
