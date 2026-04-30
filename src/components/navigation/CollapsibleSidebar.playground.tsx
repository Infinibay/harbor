import { useState } from "react";
import { CollapsibleSidebar } from "./CollapsibleSidebar";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const sections = [
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { id: "overview", label: "Overview", icon: <span>◇</span> },
      { id: "projects", label: "Projects", icon: <span>▣</span> },
      { id: "activity", label: "Activity", icon: <span>≡</span> },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    items: [
      { id: "billing", label: "Billing", icon: <span>$</span> },
      { id: "team", label: "Team", icon: <span>☺</span> },
    ],
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CollapsibleSidebarDemo(props: any) {
  const [value, setValue] = useState("projects");
  return (
    <div className="h-[420px] border border-white/10 rounded-xl overflow-hidden">
      <CollapsibleSidebar
        {...props}
        sections={sections}
        value={value}
        onChange={(id: string) => {
          setValue(id);
          props.onChange?.(id);
        }}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CollapsibleSidebarDemo as never,
  importPath: "@infinibay/harbor/navigation",
  controls: {
    defaultCollapsed: { type: "boolean", default: false, description: "Initial collapsed state." },
  },
  events: [{ name: "onChange", signature: "(id: string) => void" }],
};
