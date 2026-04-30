import { RoleBadge } from "./RoleBadge";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: RoleBadge as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    role: { type: "select", options: ["owner", "admin", "editor", "viewer", "guest", "custom"], default: "admin" },
    icon: { type: "boolean", default: true },
    size: { type: "select", options: ["xs", "sm", "md"], default: "md" },
    label: { type: "text", default: "" },
  },
  variants: [
    { label: "Owner", props: { role: "owner" } },
    { label: "Admin", props: { role: "admin" } },
    { label: "Editor", props: { role: "editor" } },
    { label: "Viewer · sm", props: { role: "viewer", size: "sm" } },
    { label: "Custom", props: { role: "custom", label: "Billing" } },
    { label: "No icon", props: { role: "admin", icon: false } },
  ],
};
