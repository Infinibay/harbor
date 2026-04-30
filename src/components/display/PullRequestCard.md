# PullRequestCard

Pull / merge request summary tile — state chip, title with `#number`,
author, branches, reviewers, CI counts, and a diff stats line. For
single-commit tiles use `<CommitCard>`.

## Import

```tsx
import { PullRequestCard } from "@infinibay/harbor/display";
```

## Example

```tsx
<PullRequestCard
  title="Fix race in token rotation"
  number={1248}
  state="open"
  authorName="Ana Pérez"
  createdAt={Date.now() - 3 * 3600 * 1000}
  fromBranch="fix/token-race"
  toBranch="main"
  reviewers={[
    { id: "u1", name: "Bea", state: "approved" },
    { id: "u2", name: "Carlos", state: "changes-requested" },
    { id: "u3", name: "Diego", state: "pending" },
  ]}
  checks={[
    { id: "lint", name: "lint", state: "passing" },
    { id: "test", name: "unit", state: "passing" },
    { id: "e2e", name: "e2e", state: "pending" },
  ]}
  diff={{ additions: 42, deletions: 11, files: 3 }}
  onClick={() => navigate("/pr/1248")}
/>
```

## Props

- **title** — `string`. Required.
- **number** — `number`. Required. Rendered as `#number`.
- **state** — `"open" | "draft" | "merged" | "closed"`. Required.
  Drives the leading state chip.
- **authorName** — `string`. Required. Used for the avatar initials.
- **authorAvatarUrl** — `string`. Currently ignored — the avatar uses
  initials only.
- **createdAt** — `Date | string | number`. Required. Rendered via
  `<Timestamp>`.
- **fromBranch** / **toBranch** — `string`. Required. Drawn as
  `from → to`.
- **reviewers** — `readonly PRReviewer[]`. Optional. Rendered as an
  `<AvatarStack>` with a status dot strip.
- **checks** — `readonly PRCheck[]`. Optional. Aggregated into
  passing / failing / pending counts.
- **diff** — `{ additions: number; deletions: number; files?: number }`.
  Optional. Right-aligned in the meta row.
- **actions** — `ReactNode`. Slot anchored to the top-right.
- **onClick** — `() => void`. Makes the card focusable as a button-like
  surface (adds hover styling).
- **className** — extra classes on the wrapper.

## `PRReviewer`

- **id** — `string`. Required.
- **name** — `string`. Required.
- **avatarUrl** — `string`. Optional (currently unused — initials only).
- **state** — `"approved" | "changes-requested" | "pending" | "commented"`.

## `PRCheck`

- **id** — `string`. Required.
- **name** — `string`. Required.
- **state** — `"passing" | "failing" | "pending" | "skipped"`.

## Notes

- Skipped checks don't show in the CI count line; only passing,
  failing, and pending counts render.
- The reviewer dot strip mirrors each reviewer's review state via a
  ring colour (emerald / rose / sky / white).
