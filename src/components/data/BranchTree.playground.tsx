import { BranchTree } from "./BranchTree";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const now = Date.now();
const sampleBranches = [
  { name: "main", color: "#a855f7" },
  { name: "feat/auth", color: "#38bdf8" },
  { name: "fix/race", color: "#f472b6" },
];
const sampleCommits = [
  { sha: "f0e1d2c4", parents: ["c4d5e6f7", "9988aa01"], branch: "main",
    message: "Merge feat/auth", at: now, author: "ada", merge: true,
    refs: ["HEAD", "main"] },
  { sha: "9988aa01", parents: ["c4d5e6f7"], branch: "feat/auth",
    message: "polish login flow", at: now - 1000 * 60 * 60, author: "lin" },
  { sha: "77ccbb22", parents: ["c4d5e6f7"], branch: "fix/race",
    message: "lock retry path", at: now - 1000 * 60 * 60 * 2, author: "grace" },
  { sha: "c4d5e6f7", parents: ["a1b2c3d4"], branch: "main",
    message: "bump deps", at: now - 1000 * 60 * 60 * 4, author: "ada" },
  { sha: "a1b2c3d4", parents: [], branch: "main",
    message: "initial commit", at: now - 1000 * 60 * 60 * 24, author: "ada" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BranchTreeDemo(props: any) {
  return (
    <div style={{ width: "100%", maxHeight: 480, overflow: "auto" }}>
      <BranchTree
        {...props}
        commits={props.commits ?? sampleCommits}
        branches={props.branches ?? sampleBranches}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: BranchTreeDemo as never,
  importPath: "@infinibay/harbor/data",
  controls: {
    rowHeight: { type: "number", default: 32, min: 20, max: 64, step: 2 },
    trackWidth: { type: "number", default: 22, min: 12, max: 40, step: 2 },
    maxCommits: { type: "number", default: 200, min: 5, max: 1000, step: 5 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Dense", props: { rowHeight: 24, trackWidth: 16 } },
    { label: "Spacious", props: { rowHeight: 44, trackWidth: 30 } },
  ],
  events: [{ name: "onCommitClick", signature: "(c: BranchCommit) => void" }],
};
