import { Breadcrumbs } from "./Breadcrumbs";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

const items = [
  { label: "Home", href: "#" },
  { label: "Projects", href: "#" },
  { label: "harbor-site", href: "#" },
  { label: "src/harbor/pages" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BreadcrumbsDemo(props: any) {
  return <Breadcrumbs {...props} items={items} />;
}

export const playground: PlaygroundManifest = {
  component: BreadcrumbsDemo as never,
  importPath: "@infinibay/harbor/navigation",
  controls: {},
  notes: "The last crumb is the current page; the rest are links.",
};
