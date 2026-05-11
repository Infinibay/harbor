# PullRequestCard

`PullRequestCard` is a compact review surface for source-control dashboards, release workbenches, deployment approval flows, and internal developer portals. It summarizes status, branches, author, reviewers, CI checks, diff size, and row actions in a single scannable card.

Use it when a pull request is one item in a queue. For a full review screen, use the card as the entry point and route to the detail page on click.

## Import

```tsx
import { PullRequestCard } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<PullRequestCard
  title="Add usage limits to workspace plans"
  number={1842}
  state="open"
  authorName="Ana Ramos"
  authorAvatarUrl="/avatars/ana.png"
  createdAt="2026-05-11T14:30:00Z"
  fromBranch="feature/usage-limits"
  toBranch="main"
  reviewers={[
    { id: "mila", name: "Mila Chen", avatarUrl: "/avatars/mila.png", state: "approved" },
    { id: "leo", name: "Leo Silva", state: "pending" },
  ]}
  checks={[
    { id: "unit", name: "Unit tests", state: "passing" },
    { id: "e2e", name: "E2E", state: "pending" },
  ]}
  diff={{ additions: 248, deletions: 39, files: 8 }}
  onClick={() => navigate("/pulls/1842")}
  actions={<Button size="sm">Review</Button>}
/>
```

## States

`state` can be `open`, `draft`, `merged`, or `closed`. The state controls the leading chip, color, and icon. Reviewers expose their own status through a small indicator strip so a queue can show "approved", "changes requested", and "pending" without opening the PR.

## Props

- `title`, `number`, `state`: required PR identity.
- `authorName`, `authorAvatarUrl`, `createdAt`: author metadata.
- `fromBranch`, `toBranch`: branch summary.
- `reviewers`: array of `{ id, name, avatarUrl?, state }`.
- `checks`: array of `{ id, name, state }`.
- `diff`: `{ additions, deletions, files? }`.
- `actions`: right-side action slot.
- `onClick`: makes the whole card interactive.

## Accessibility

When `onClick` is provided, the card behaves as a keyboard-focusable button and responds to Enter and Space. Keep the `actions` slot for true nested controls, such as review or merge buttons.

## Gotchas

The component does not fetch repository data or run permission checks. Normalize provider-specific statuses from GitHub, GitLab, or your own system before passing props.

## Related

Use with `CommitCard`, `BranchTree`, `ActivityFeed`, `AvatarStack`, `Button`, and `DataTable`.
