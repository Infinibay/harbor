import { useState } from "react";
import { OTPInput } from "./OTPInput";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function OTPInputDemo(props: any) {
  const [value, setValue] = useState("");
  return (
    <OTPInput
      {...props}
      value={value}
      onChange={(v: string) => {
        setValue(v);
        props.onChange?.(v);
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: OTPInputDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    length: { type: "number", default: 6, min: 4, max: 10 },
  },
  variants: [
    { label: "6-digit", props: { length: 6 } },
    { label: "4-digit", props: { length: 4 } },
  ],
  events: [
    { name: "onChange", signature: "(v: string) => void" },
    { name: "onComplete", signature: "(v: string) => void", description: "Fires once all slots are filled." },
  ],
};
