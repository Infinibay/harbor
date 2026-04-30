# BranchTree

Compact git-graph: SVG track lines on the left, commit metadata on the
right. Use for commit history; for arbitrary hierarchical data use
`<TreeView>`.

## Import

```tsx
import { BranchTree } from "@infinibay/harbor/data";
```

## Example

```tsx
const branches = [
  { name: "main", color: "#a855f7" },
  { name: "feat/x", color: "#38bdf8" },
];
const commits = [
  { sha: "f0e1d2c", parents: ["a1b2c3d"], branch: "main",
    message: "Merge feat/x", at: Date.now(), author: "ada", merge: true,
    refs: ["HEAD", "main"] },
  { sha: "9988aa0", parents: ["a1b2c3d"], branch: "feat/x",
    message: "wire it up", at: Date.now() - 3600_000, author: "lin" },
  { sha: "a1b2c3d", parents: [], branch: "main",
    message: "init", at: Date.now() - 7200_000, author: "ada" },
];

<BranchTree commits={commits} branches={branches} onCommitClick={(c) => …} />
```

## Props

- **commits** — `readonly BranchCommit[]`. Required. Newest-first.
  `{ sha, parents: string[], branch?, message, at, author?, merge?,
  refs? }`.
- **branches** — `readonly BranchDef[]`. Required. `{ name, color? }`.
  Position in the array determines column index; missing colors fall
  back to a built-in palette.
- **rowHeight** — `number`. Vertical px between commits. Default `32`.
- **trackWidth** — `number`. Horizontal px between branch tracks.
  Default `22`.
- **maxCommits** — `number`. Older commits are clipped from the head.
  Default `200`.
- **onCommitClick** — `(c: BranchCommit) => void`. Click handler on a
  commit dot.
- **className** — extra classes on the root.

## Notes

- Same-track parents draw straight; cross-track parents draw a cubic
  bezier merge curve into the parent track.
- A commit's `branch` must match a `BranchDef.name` for color/track
  assignment; unknown branches collapse to track 0.
- Hovering a commit dot or its row highlights both sides in sync.
