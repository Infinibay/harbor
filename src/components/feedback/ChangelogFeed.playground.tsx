import { ChangelogFeed } from "./ChangelogFeed";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

const sampleEntries = [
  {
    version: "0.4.0",
    date: new Date("2026-04-01"),
    changes: [
      { kind: "feature" as const, title: "Saved filters", body: "Save complex filter expressions and re-apply with one click." },
      { kind: "improvement" as const, title: "Faster initial paint", body: "Hero animations now wait for first frame." },
    ],
  },
  {
    version: "0.3.4",
    date: new Date("2026-03-12"),
    changes: [
      { kind: "fix" as const, title: "Drag handle visible on mobile" },
      { kind: "security" as const, title: "Bump cookie parser", body: "CVE-2025-24678 mitigation." },
    ],
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChangelogFeedDemo(props: any) {
  return <ChangelogFeed {...props} entries={sampleEntries} />;
}

export const playground: PlaygroundManifest = {
  component: ChangelogFeedDemo as never,
  importPath: "@infinibay/harbor/feedback",
  controls: {
    showFilter: { type: "boolean", default: true, description: "Filter chips by change kind." },
  },
  variants: [
    { label: "With filter", props: { showFilter: true } },
    { label: "Plain", props: { showFilter: false } },
  ],
};
