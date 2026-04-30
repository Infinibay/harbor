import { useState } from "react";
import { FindBar } from "./FindBar";
import { Button } from "../buttons/Button";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FindBarDemo(props: any) {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex flex-col gap-3 items-start">
      {!open ? (
        <Button onClick={() => setOpen(true)}>Open find bar</Button>
      ) : null}
      <FindBar
        {...props}
        open={open}
        onClose={() => {
          setOpen(false);
          props.onClose?.();
        }}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: FindBarDemo as never,
  importPath: "@infinibay/harbor/dev",
  controls: {
    total: { type: "number", default: 42, min: 0, max: 999, step: 1, description: "Total match count fed back from the parent." },
    current: { type: "number", default: 7, min: 0, max: 999, step: 1, description: "1-based index of the active match." },
    showReplace: { type: "boolean", default: false, description: "Initial visibility of the Replace row (toggled with ⇅)." },
    caseSensitive: { type: "boolean", default: false, description: "Match-case toggle state." },
    regex: { type: "boolean", default: false, description: "Regex toggle state." },
  },
  events: [
    { name: "onClose", signature: "() => void", description: "Fires from the × button or Esc key." },
    { name: "onChange", signature: "(q: string) => void", description: "Fires on every keystroke in the find input." },
    { name: "onNext", signature: "() => void", description: "Step to next match (Enter or ↓)." },
    { name: "onPrev", signature: "() => void", description: "Step to previous match (Shift+Enter or ↑)." },
    { name: "onReplace", signature: "(find: string, replace: string) => void", description: "Replace / Replace All — both call the same handler." },
    { name: "onCaseToggle", signature: "(value: boolean) => void" },
    { name: "onRegexToggle", signature: "(value: boolean) => void" },
  ],
  notes:
    "FindBar is presentational — search, navigation, and replace are wired by the parent. The bar only renders the input, counters, and toggles.",
};
