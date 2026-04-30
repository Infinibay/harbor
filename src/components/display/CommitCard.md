# CommitCard

Git commit tile — short SHA, message title (first line), optional body,
author, time, ref chips, and ±/files stats. For PR rollups use
`<PullRequestCard>`.

## Import

```tsx
import { CommitCard } from "@infinibay/harbor/display";
```

## Example

```tsx
<CommitCard
  sha="aB3f7Q1c0d4e9f2a8b5"
  authorName="Ana Pérez"
  authorEmail="ana@infinibay.io"
  message={`Fix race in token rotation\n\nReplaces the global lock with a per-key mutex.`}
  at={Date.now() - 2 * 3600 * 1000}
  refs={["main", "v0.4.2"]}
  stats={{ additions: 42, deletions: 11, files: 3 }}
  onClick={() => navigate(`/commits/${sha}`)}
/>
```

## Props

- **sha** — `string`. Required. Full commit SHA (used to derive `shortSha`).
- **shortSha** — `string`. Override the displayed short SHA.
  Default: first 7 chars of `sha`.
- **authorName** — `string`. Required. Drives the avatar initials too.
- **authorEmail** — `string`. Currently not rendered — reserved for a
  future "View author" hover.
- **avatarUrl** — `string`. Avatar URL override (currently ignored —
  the avatar uses initials only).
- **message** — `string`. Required. First line is the title, the rest
  is the body (clamped to 2 lines).
- **at** — `Date | string | number`. Commit timestamp.
- **stats** — `{ additions?, deletions?, files? }`. Each field is
  rendered only when present.
- **refs** — `string[]`. Branch / tag chips on the right.
- **onClick** — `() => void`.
- **contextMenu** — `ReactNode`. Slot to the right of the commit body
  (typically a `<ContextMenu>` trigger).
- **className** — extra classes on the wrapper.

## Notes

- Commit body lines beyond the first are joined with newlines and
  clamped to 2 visual lines.
- The ref chips are styled with the fuchsia accent — use Markdown-like
  refs (`"main"`, `"v0.4.2"`) rather than full ref paths.
