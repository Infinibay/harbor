import { useState } from "react";
import { ReactionsBar } from "./ReactionsBar";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ReactionsBarDemo(props: any) {
  const [reactions, setReactions] = useState([
    { emoji: "👍", count: 4, byMe: false },
    { emoji: "🎉", count: 2, byMe: true },
  ]);
  return (
    <ReactionsBar
      {...props}
      reactions={reactions}
      onToggle={(emoji: string) => {
        setReactions((prev) => {
          const i = prev.findIndex((r) => r.emoji === emoji);
          if (i >= 0) {
            const r = prev[i];
            const next = r.byMe ? r.count - 1 : r.count + 1;
            const updated = next > 0
              ? [...prev.slice(0, i), { ...r, count: next, byMe: !r.byMe }, ...prev.slice(i + 1)]
              : [...prev.slice(0, i), ...prev.slice(i + 1)];
            return updated;
          }
          return [...prev, { emoji, count: 1, byMe: true }];
        });
        props.onToggle?.(emoji);
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: ReactionsBarDemo as never,
  importPath: "@infinibay/harbor/collab",
  controls: {},
  events: [
    { name: "onToggle", signature: "(emoji: string) => void", description: "Fires when user adds or removes their reaction." },
  ],
};
