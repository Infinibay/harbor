import { PropertyList } from "./PropertyList";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const items = [
  { key: "id", label: "ID", value: "vm_84a23bf1c0e8", copyable: true },
  { key: "region", label: "Region", value: "us-east-1" },
  { key: "type", label: "Type", value: "c6g.xlarge · 4 vCPU · 8 GB" },
  { key: "created", label: "Created", value: "2026-04-12 14:32" },
  { key: "owner", label: "Owner", value: "ana@infinibay.com", copyable: true },
  { key: "tags", label: "Tags", value: "frontend, prod, react" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PropertyListDemo(props: any) {
  return <div className="w-96"><PropertyList {...props} items={items} /></div>;
}

export const playground: PlaygroundManifest = {
  component: PropertyListDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    variant: { type: "select", options: ["two-col", "cards"], default: "two-col" },
  },
  variants: [
    { label: "Two-column", props: { variant: "two-col" } },
    { label: "Cards", props: { variant: "cards" } },
  ],
};
