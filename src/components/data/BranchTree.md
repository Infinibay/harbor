# BranchTree

`BranchTree` renders a compact Git history graph: commits as rows, branches as
colored tracks, parent links as SVG paths, refs as chips, and commit metadata as
readable text. It is built for repository browsers, release dashboards, code
review tools, deployment history, and desktop Git clients.

Use it when the shape of history matters. If you only need a list of commits,
use `CommitCard` or `DataTable`.

## Import

```tsx
import { BranchTree } from "@infinibay/harbor/data";
```

## Basic Usage

Pass branch definitions and commits in display order, usually newest first.

```tsx
<BranchTree
  branches={[
    { name: "main", color: "#a855f7" },
    { name: "release", color: "#22c55e" },
  ]}
  commits={[
    {
      sha: "6f41c8a",
      parents: ["31af90b"],
      branch: "main",
      message: "Ship documentation previews",
      at: "2026-05-10T18:00:00Z",
      author: "Maya",
      refs: ["v0.8.0"],
    },
  ]}
/>
```

## Interaction

Use `onCommitClick` to open a commit details panel, diff viewer, deployment
trace, or linked pull request.

```tsx
<BranchTree
  branches={branches}
  commits={commits}
  onCommitClick={(commit) => setSelectedCommit(commit)}
/>
```

## Data Model

Each branch definition includes `name` and optional `color`. Each commit
includes:

- `sha`: commit id.
- `parents`: parent commit shas.
- `branch`: branch name used to choose the track.
- `message`: visible commit message.
- `at`: date or already-formatted time value.
- `author`: optional author text.
- `merge`: optional merge marker for your own logic.
- `refs`: branch, tag, or release chips.

## Props

- `commits`: required commit rows.
- `branches`: required track definitions.
- `rowHeight`: row height in pixels; defaults to `32`.
- `trackWidth`: branch lane width in pixels; defaults to `22`.
- `onCommitClick`: called when the user selects a commit marker.
- `maxCommits`: render cap; defaults to `200`.
- `className`: wrapper class override.

## Accessibility

The graph is a visual navigation aid. Keep the commit message, author, timestamp,
and refs visible in text so the history remains understandable without reading
the SVG paths.

If commit selection is central to the workflow, provide a parallel keyboard path
such as a selected row list, command palette, or details table.

## Gotchas

Parent links are drawn only when the parent commit is present in the rendered
window. If `maxCommits` clips history, old parent paths may disappear.

Branch columns are based on the `branches` prop. Unknown commit branch names fall
back to the first track, so keep branch metadata in sync with commit data.

## Related

- `CommitCard` for individual commit summaries.
- `DiffViewer` for selected commit diffs.
- `PullRequestCard` for review context.
- `Timeline` for release milestones without branch topology.
