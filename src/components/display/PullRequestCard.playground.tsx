import { PullRequestCard } from "./PullRequestCard";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const reviewers = [
  { id: "u1", name: "Bea Ramírez", state: "approved" as const },
  { id: "u2", name: "Carlos Vega", state: "changes-requested" as const },
  { id: "u3", name: "Diego Soto", state: "pending" as const },
  { id: "u4", name: "Elena Ruiz", state: "commented" as const },
];

const checks = [
  { id: "lint", name: "lint", state: "passing" as const },
  { id: "unit", name: "unit", state: "passing" as const },
  { id: "build", name: "build", state: "passing" as const },
  { id: "e2e", name: "e2e", state: "pending" as const },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PullRequestCardDemo(props: any) {
  return (
    <div className="w-[36rem] max-w-full">
      <PullRequestCard
        title="Fix race in token rotation"
        number={1248}
        authorName="Ana Pérez"
        createdAt={Date.now() - 3 * 3600 * 1000}
        fromBranch="fix/token-race"
        toBranch="main"
        reviewers={reviewers}
        checks={checks}
        diff={{ additions: 42, deletions: 11, files: 3 }}
        {...props}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: PullRequestCardDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    state: {
      type: "select",
      options: ["open", "draft", "merged", "closed"],
      default: "open",
    },
  },
  variants: [
    { label: "Open", props: { state: "open" } },
    { label: "Draft", props: { state: "draft" } },
    { label: "Merged", props: { state: "merged" } },
    { label: "Closed", props: { state: "closed" } },
  ],
  events: [{ name: "onClick", signature: "() => void" }],
};
