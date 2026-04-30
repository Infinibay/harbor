import { useState } from "react";
import { InfiniteScroll } from "./InfiniteScroll";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InfiniteScrollDemo(props: any) {
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const hasMore = count < 60;

  function loadMore() {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      setCount((n) => Math.min(60, n + 10));
      setLoading(false);
    }, 600);
  }

  return (
    <div
      style={{
        width: "100%",
        height: 400,
        overflow: "auto",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        padding: 12,
      }}
    >
      <InfiniteScroll
        {...props}
        onLoadMore={loadMore}
        hasMore={hasMore}
        loading={loading}
      >
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            style={{
              padding: "12px 14px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: 8,
              color: "rgba(255,255,255,0.85)",
              fontSize: 13,
            }}
          >
            Item #{i + 1}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: InfiniteScrollDemo as never,
  importPath: "@infinibay/harbor/data",
  controls: {
    threshold: { type: "number", default: 200, min: 0, max: 800, step: 20 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Eager (early load)", props: { threshold: 600 } },
    { label: "Strict (load at edge)", props: { threshold: 0 } },
  ],
  events: [{ name: "onLoadMore", signature: "() => void" }],
};
