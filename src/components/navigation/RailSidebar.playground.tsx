import { useState } from "react";
import { RailSidebar } from "./RailSidebar";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const items = [
  { id: "files", label: "Files", icon: <span>📁</span> },
  { id: "search", label: "Search", icon: <span>🔍</span> },
  { id: "git", label: "Git", icon: <span>⎇</span> },
  { id: "debug", label: "Debug", icon: <span>🐛</span> },
  { id: "extensions", label: "Extensions", icon: <span>⊞</span> },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RailSidebarDemo(props: any) {
  const [v, setV] = useState("files");
  return (
    <div className="h-[420px] border border-white/10 rounded-xl overflow-hidden flex">
      <RailSidebar
        {...props}
        items={items}
        value={v}
        onChange={(id: string) => {
          setV(id);
          props.onChange?.(id);
        }}
      />
      <div className="flex-1 p-6 text-sm text-white/60">Active: {v}</div>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: RailSidebarDemo as never,
  importPath: "@infinibay/harbor/navigation",
  controls: {},
  events: [{ name: "onChange", signature: "(id: string) => void" }],
};
