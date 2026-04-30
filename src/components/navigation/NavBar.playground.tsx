import { NavBar } from "./NavBar";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const items = [
  { id: "dashboard", label: "Dashboard" },
  { id: "projects", label: "Projects" },
  { id: "activity", label: "Activity" },
  { id: "billing", label: "Billing" },
  { id: "settings", label: "Settings" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NavBarDemo(props: any) {
  return (
    <NavBar
      {...props}
      items={items}
      brand={<span className="font-semibold">Harbor</span>}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: NavBarDemo as never,
  importPath: "@infinibay/harbor/navigation",
  controls: {
    value: { type: "select", options: ["dashboard", "projects", "activity", "billing", "settings"], default: "projects" },
  },
  events: [{ name: "onChange", signature: "(id: string) => void" }],
};
