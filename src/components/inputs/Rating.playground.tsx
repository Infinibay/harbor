import { useState } from "react";
import { Rating } from "./Rating";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RatingDemo(props: any) {
  const [value, setValue] = useState(Number(props.value ?? 3));
  return (
    <Rating
      {...props}
      value={value}
      onChange={(v: number) => {
        setValue(v);
        props.onChange?.(v);
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: RatingDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    max: { type: "number", default: 5, min: 3, max: 10 },
    size: { type: "number", default: 24, min: 12, max: 48 },
    readOnly: { type: "boolean", default: false },
    allowHalf: { type: "boolean", default: false },
  },
  variants: [
    { label: "5 stars", props: { max: 5 } },
    { label: "10 stars · half", props: { max: 10, allowHalf: true } },
    { label: "Read-only", props: { readOnly: true } },
  ],
  events: [{ name: "onChange", signature: "(v: number) => void" }],
};
