import { useState } from "react";
import { SettingsPanel } from "./SettingsPanel";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

const sections = [
  {
    id: "general",
    label: "General",
    items: [
      { id: "profile", label: "Profile", description: "Name, avatar, contact" },
      { id: "appearance", label: "Appearance", description: "Theme and density" },
    ],
  },
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { id: "members", label: "Members", description: "Invitations and roles" },
      { id: "billing", label: "Billing", description: "Plan and invoices" },
    ],
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SettingsPanelDemo(props: any) {
  const [v, setV] = useState("profile");
  return (
    <div className="h-[420px] border border-white/10 rounded-xl overflow-hidden flex">
      <SettingsPanel
        {...props}
        sections={sections}
        value={v}
        onChange={(id: string) => {
          setV(id);
          props.onChange?.(id);
        }}
      />
      <div className="flex-1 p-6 text-sm text-white/60">Showing: {v}</div>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: SettingsPanelDemo as never,
  importPath: "@infinibay/harbor/navigation",
  controls: {},
  events: [{ name: "onChange", signature: "(id: string) => void" }],
};
