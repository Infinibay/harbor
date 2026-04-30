import { useState } from "react";
import { MentionInput, type MentionUser } from "./MentionInput";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const users: MentionUser[] = [
  { id: "1", name: "Andrés Bermúdez", handle: "andres" },
  { id: "2", name: "Jules Lambert", handle: "jules" },
  { id: "3", name: "Mira Okafor", handle: "mira" },
  { id: "4", name: "Tomás Rivera", handle: "tomas" },
  { id: "5", name: "Yuki Tanaka", handle: "yuki" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MentionInputDemo(props: any) {
  const [value, setValue] = useState("Hey @");
  return (
    <div className="w-[520px]">
      <MentionInput
        {...props}
        users={users}
        value={value}
        onChange={(v: string) => {
          setValue(v);
          props.onChange?.(v);
        }}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: MentionInputDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    placeholder: { type: "text", default: "Type @ to mention someone…" },
    rows: { type: "number", default: 3, min: 1, max: 10 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Tall", props: { rows: 6 } },
  ],
  events: [
    { name: "onChange", signature: "(v: string) => void" },
    { name: "onSubmit", signature: "(v: string) => void", description: "Fires on Cmd/Ctrl+Enter." },
  ],
  notes: "Type @ to open the picker. ↑/↓ to navigate, Enter/Tab to insert, Esc to dismiss.",
};
