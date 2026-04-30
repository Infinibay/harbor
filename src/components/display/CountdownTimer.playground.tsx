import { CountdownTimer } from "./CountdownTimer";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CountdownTimerDemo(props: any) {
  const offsetMs = (props.offsetSeconds ?? 600) * 1000;
  return <CountdownTimer {...props} target={Date.now() + offsetMs} />;
}

export const playground: PlaygroundManifest = {
  component: CountdownTimerDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    offsetSeconds: { type: "number", default: 600, min: 5, max: 86400, description: "Seconds from now until target." },
    compact: { type: "boolean", default: false },
  },
  variants: [
    { label: "10 min", props: { offsetSeconds: 600 } },
    { label: "1 hour", props: { offsetSeconds: 3600 } },
    { label: "Compact", props: { offsetSeconds: 600, compact: true } },
  ],
  events: [{ name: "onComplete", signature: "() => void", description: "Fires once when the countdown hits 0." }],
};
