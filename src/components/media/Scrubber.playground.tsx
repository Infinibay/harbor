import { useEffect, useState } from "react";
import { Scrubber } from "./Scrubber";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ScrubberDemo(props: any) {
  const [value, setValue] = useState(props.value ?? 42);
  useEffect(() => {
    if (typeof props.value === "number") setValue(props.value);
  }, [props.value]);
  return (
    <Scrubber
      {...props}
      value={value}
      duration={props.duration ?? 240}
      onSeek={(t: number) => {
        setValue(t);
        props.onSeek?.(t);
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: ScrubberDemo as never,
  importPath: "@infinibay/harbor/media",
  controls: {
    duration: { type: "number", default: 240, min: 30, max: 3600, step: 10, description: "Duration in seconds." },
    buffered: { type: "number", default: 90, min: 0, max: 3600 },
  },
  events: [
    { name: "onSeek", signature: "(t: number) => void", description: "Drag the head; fires the new time in seconds." },
  ],
};
