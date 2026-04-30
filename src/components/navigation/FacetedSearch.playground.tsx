import { useState } from "react";
import { FacetedSearch } from "./FacetedSearch";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const groups = [
  {
    id: "type",
    label: "Type",
    options: [
      { value: "issue", label: "Issue", count: 102 },
      { value: "pr", label: "Pull request", count: 48 },
    ],
  },
  {
    id: "label",
    label: "Label",
    options: [
      { value: "bug", label: "bug", count: 22 },
      { value: "feature", label: "feature", count: 18 },
      { value: "docs", label: "docs", count: 7 },
    ],
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FacetedSearchDemo(props: any) {
  const [value, setValue] = useState<Record<string, string[]>>({});
  const [query, setQuery] = useState("");
  return (
    <FacetedSearch
      {...props}
      groups={groups}
      value={value}
      onChange={(v) => {
        setValue(v);
        props.onChange?.(v);
      }}
      query={query}
      onQueryChange={(q: string) => {
        setQuery(q);
        props.onQueryChange?.(q);
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: FacetedSearchDemo as never,
  importPath: "@infinibay/harbor/navigation",
  controls: {
    title: { type: "text", default: "Search" },
  },
  events: [
    { name: "onChange", signature: "(v: Record<string, string[]>) => void" },
    { name: "onQueryChange", signature: "(q: string) => void" },
  ],
};
