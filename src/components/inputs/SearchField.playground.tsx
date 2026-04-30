import { SearchField } from "./SearchField";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const sampleResults = [
  { id: "1", title: "Dashboard", subtitle: "Page · /dashboard" },
  { id: "2", title: "Settings · Billing", subtitle: "Page · /settings/billing" },
  { id: "3", title: "Ana Pérez", subtitle: "Member" },
  { id: "4", title: "harbor-cli v0.4.2", subtitle: "Release" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SearchFieldDemo(props: any) {
  return (
    <div className="w-80">
      <SearchField
        {...props}
        onSearch={async (q: string) =>
          q.length === 0
            ? []
            : sampleResults.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()))
        }
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: SearchFieldDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    placeholder: { type: "text", default: "Search…" },
  },
  events: [
    { name: "onSearch", signature: "(q: string) => SearchResult[] | Promise<SearchResult[]>", description: "Caller resolves; debounced internally." },
    { name: "onPick", signature: "(r: SearchResult) => void" },
  ],
};
