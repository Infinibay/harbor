import { useState } from "react";
import { FilterPanel } from "./FilterPanel";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

const groups = [
  {
    id: "status",
    label: "Status",
    options: [
      { id: "open", label: "Open", count: 14 },
      { id: "closed", label: "Closed", count: 38 },
      { id: "draft", label: "Draft", count: 3 },
    ],
  },
  {
    id: "owner",
    label: "Owner",
    options: [
      { id: "ana", label: "Ana", count: 7 },
      { id: "bruno", label: "Bruno", count: 4 },
      { id: "diego", label: "Diego", count: 2 },
    ],
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FilterPanelDemo(props: any) {
  const [value, setValue] = useState<Record<string, string[]>>({});
  return (
    <FilterPanel
      {...props}
      groups={groups}
      value={value}
      onChange={(v) => {
        setValue(v);
        props.onChange?.(v);
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: FilterPanelDemo as never,
  importPath: "@infinibay/harbor/navigation",
  controls: {
    title: { type: "text", default: "Filters" },
  },
  events: [
    { name: "onChange", signature: "(v: Record<string, string[]>) => void" },
    { name: "onClear", signature: "() => void" },
  ],
};
