# NoteCard

Sticky-note style card with optional rotation tilt. Pair several with
slight tilts for an organic "pinned to a board" feel.

## Import

```tsx
import { NoteCard } from "@infinibay/harbor/display";
```

## Example

```tsx
<NoteCard
  title="Reminder"
  color="yellow"
  author="Ana"
  date="Apr 28"
  tilt={-2}
>
  Don't ship before testing the email flow on Safari.
</NoteCard>
```

## Props

- **children** — `ReactNode`. Required. Body text — `whitespace-pre-wrap`
  preserves newlines.
- **title** — `ReactNode`. Small uppercase header.
- **color** — `"yellow" | "pink" | "sky" | "green" | "purple"`. Default `"yellow"`.
- **author** — `ReactNode`. Footer left.
- **date** — `ReactNode`. Footer right.
- **tilt** — `number`. Rotation in degrees. Default `0`. Reasonable
  range `-8` to `8`.
- **className** — extra classes on the wrapper.

## Notes

- The footer divider is only rendered when at least one of `author` /
  `date` is provided.
- The drop shadow is the same regardless of tilt — keep tilts small to
  avoid the shadow looking detached.
