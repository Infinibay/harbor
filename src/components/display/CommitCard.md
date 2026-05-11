# CommitCard

`CommitCard` presents one Git commit as a polished, clickable product surface:
avatar, title, short SHA, author, timestamp, stats, refs, and an optional context
menu slot. It works well in repository dashboards, deployment timelines,
release-note builders, and code-review side panels.

Use it when one commit deserves context. Use `BranchTree` when topology matters
or `DataTable` when the user needs sorting and bulk actions.

## Import

```tsx
import { CommitCard } from "@infinibay/harbor/display";
```

## Basic Usage

Pass the full SHA and commit message. The first line becomes the title; the rest
of the message becomes body copy.

```tsx
<CommitCard
  sha="6f41c8a56e8d01f75d05fb1b91db50f6a8b23321"
  authorName="Maya Singh"
  avatarUrl="/avatars/maya.png"
  message={`Improve Harbor documentation previews

Adds expanded preview mode and stronger app skeleton examples.`}
  at="2026-05-10T18:00:00Z"
  stats={{ additions: 420, deletions: 38, files: 12 }}
  refs={["main", "v0.8.0"]}
/>
```

## Interaction

Add `onClick` when the card should open a diff, drawer, pull request, or commit
details route. The card supports pointer and keyboard activation.

```tsx
<CommitCard
  {...commit}
  onClick={() => openCommit(commit.sha)}
  contextMenu={<CommitActions commit={commit} />}
/>
```

## Props

- `sha`: required full commit SHA.
- `shortSha`: optional override; defaults to the first seven characters.
- `authorName`: visible author name and avatar fallback text.
- `authorEmail`: optional tooltip/title metadata.
- `avatarUrl`: optional avatar image.
- `message`: full commit message.
- `at`: commit date or timestamp.
- `stats`: optional additions, deletions, and file count.
- `refs`: branch or tag chips.
- `onClick`: turns the card into an interactive item.
- `contextMenu`: right-side action/menu slot owned by the caller.
- `className`: wrapper class override.

## Accessibility

When `onClick` is present, the wrapper exposes button semantics and supports
Enter and Space. The visible title, SHA, author, and timestamp should describe
the action well enough for assistive technology.

Do not put destructive actions directly on the whole card. Use `contextMenu`,
`Menu`, or a confirmation `Dialog` for those workflows.

## Gotchas

`message` is split on the first newline. Keep the first line short and
descriptive; long details belong in the body or in the expanded commit view.

The `contextMenu` prop is a slot. Harbor renders it, but you own the menu state,
right-click behavior, and action handlers.

## Related

- `BranchTree` for graph-shaped history.
- `DiffViewer` for changed files.
- `PullRequestCard` for review workflows.
- `Timestamp` for standalone time formatting.
