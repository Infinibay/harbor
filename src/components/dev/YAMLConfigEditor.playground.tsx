import { useState } from "react";
import { YAMLConfigEditor } from "./YAMLConfigEditor";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

const initial = `service: harbor
version: 0.4.2
runtime:
  cpu: 2
  memory: 512Mi
  replicas: 3
ports:
  - 8080
  - 8443
env:
  NODE_ENV: production
  LOG_LEVEL: info
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function YAMLConfigEditorDemo(props: any) {
  const [value, setValue] = useState(initial);
  return (
    <YAMLConfigEditor
      {...props}
      value={value}
      onChange={(next: string) => {
        setValue(next);
        props.onChange?.(next);
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: YAMLConfigEditorDemo as never,
  importPath: "@infinibay/harbor/dev",
  controls: {
    readOnly: { type: "boolean", default: false },
    height: { type: "number", default: 320, min: 160, max: 720, step: 20 },
  },
  events: [{ name: "onChange", signature: "(next: string) => void" }],
};
