import { useState } from "react";
import { Pagination } from "./Pagination";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PaginationDemo(props: any) {
  const [page, setPage] = useState(props.page ?? 4);
  return (
    <Pagination
      {...props}
      page={page}
      total={props.total ?? 24}
      onChange={(p: number) => {
        setPage(p);
        props.onChange?.(p);
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: PaginationDemo as never,
  importPath: "@infinibay/harbor/navigation",
  controls: {
    page: { type: "number", default: 4, min: 1, max: 100, description: "Initial page (1-indexed)." },
    total: { type: "number", default: 24, min: 1, max: 999 },
  },
  variants: [
    { label: "Few pages", props: { page: 2, total: 5 } },
    { label: "Middle of range", props: { page: 12, total: 24 } },
    { label: "Last page", props: { page: 24, total: 24 } },
  ],
  events: [
    { name: "onChange", signature: "(p: number) => void" },
  ],
};
