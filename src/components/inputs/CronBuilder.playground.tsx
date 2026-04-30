import { useState } from "react";
import { CronBuilder } from "./CronBuilder";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CronBuilderDemo(props: any) {
  const [value, setValue] = useState<string>(props.value ?? "0 9 * * 1");
  return (
    <CronBuilder
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        props.onChange?.(next);
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: CronBuilderDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    hidePresets: { type: "boolean", default: false },
  },
  variants: [
    { label: "Weekly Mon 9am", props: { value: "0 9 * * 1" } },
    { label: "Every 5 minutes", props: { value: "*/5 * * * *" } },
    { label: "No presets", props: { value: "0 0 1 * *", hidePresets: true } },
  ],
  events: [{ name: "onChange", signature: "(next: string) => void" }],
  notes: "POSIX 5-field. Each field offers Any / Every N / List modes.",
};
