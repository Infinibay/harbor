import { useState } from "react";
import { MorphBar, MorphItem } from "./MorphBar";
import { ExpandingSearch } from "./ExpandingSearch";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MorphBarDemo(props: any) {
  const [searching, setSearching] = useState(false);
  const Btn = ({ children }: { children: string }) => (
    <button className="h-9 px-3 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 whitespace-nowrap">
      {children}
    </button>
  );
  return (
    <div className="w-full max-w-xl">
      <MorphBar {...props}>
        <MorphItem id="filter" hidden={searching}>
          <Btn>Filter</Btn>
        </MorphItem>
        <MorphItem id="sort" hidden={searching}>
          <Btn>Sort</Btn>
        </MorphItem>
        <MorphItem id="group" hidden={searching}>
          <Btn>Group by</Btn>
        </MorphItem>
        <MorphItem id="search" grow={searching ? 1 : 0}>
          <ExpandingSearch open={searching} onOpenChange={setSearching} />
        </MorphItem>
      </MorphBar>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: MorphBarDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    gap: { type: "number", default: 8, min: 0, max: 32, step: 2 },
    align: { type: "select", options: ["start", "center", "end", "stretch"], default: "center" },
  },
  variants: [{ label: "Default", props: {} }],
  events: [],
  notes: "Click the magnifier — siblings exit and the search grows to fill the bar.",
};
