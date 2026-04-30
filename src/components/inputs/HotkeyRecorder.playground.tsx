import { useState } from "react";
import { HotkeyRecorder } from "./HotkeyRecorder";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HotkeyRecorderDemo(props: any) {
  const [value, setValue] = useState<string[]>(props.defaultValue ?? ["Meta", "k"]);
  return (
    <HotkeyRecorder
      {...props}
      value={value}
      onChange={(v: string[]) => {
        setValue(v);
        props.onChange?.(v);
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: HotkeyRecorderDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    label: { type: "text", default: "Open palette" },
  },
  variants: [
    { label: "Default", props: { defaultValue: ["Meta", "k"] } },
    { label: "Empty", props: { defaultValue: [] } },
    { label: "Triple combo", props: { defaultValue: ["Meta", "Shift", "p"] } },
  ],
  events: [{ name: "onChange", signature: "(combo: string[]) => void" }],
  notes: "Click the chip, press a key combo. Escape cancels recording.",
};
