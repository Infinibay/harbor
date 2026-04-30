import { useState } from "react";
import { FilterBar, type AppliedFilter } from "./FilterBar";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const filters = [
  { id: "status", label: "Status", options: ["active", "paused", "archived"] },
  { id: "owner", label: "Owner", options: ["me", "team", "anyone"] },
  { id: "region", label: "Region", options: ["us-east", "eu-west", "ap-south"] },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FilterBarDemo(props: any) {
  const [applied, setApplied] = useState<AppliedFilter[]>([
    { id: "status", label: "Status", value: "active" },
  ]);
  return <FilterBar filters={filters} applied={applied} onChange={setApplied} {...props} />;
}

export const playground: PlaygroundManifest = {
  component: FilterBarDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {},
  variants: [{ label: "Default", props: {} }],
  events: [{ name: "onChange", signature: "(applied: AppliedFilter[]) => void" }],
  notes: "Click + Add filter to pick a category and value. Click × on a chip to remove it.",
};
