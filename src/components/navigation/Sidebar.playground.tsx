import { useState } from "react";
import { Sidebar } from "./Sidebar";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const sections = [
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { id: "overview", label: "Overview" },
      { id: "projects", label: "Projects" },
      { id: "activity", label: "Activity" },
    ],
  },
  {
    id: "account",
    label: "Account",
    items: [
      { id: "billing", label: "Billing" },
      { id: "team", label: "Team" },
      { id: "settings", label: "Settings" },
    ],
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SidebarDemo(props: any) {
  const [selected, setSelected] = useState("projects");
  return (
    <div className="h-[420px] border border-white/10 rounded-xl overflow-hidden">
      <Sidebar
        {...props}
        sections={sections}
        selected={selected}
        onSelect={(id: string) => {
          setSelected(id);
          props.onSelect?.(id);
        }}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: SidebarDemo as never,
  importPath: "@infinibay/harbor/navigation",
  controls: {
    sticky: { type: "boolean", default: false },
  },
  events: [{ name: "onSelect", signature: "(id: string) => void" }],
};
