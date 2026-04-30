# ErrorState

The dedicated error tile — rose-tinted panel with title, description,
optional error code, retry button, and an action slot. Use it when
something went wrong; for "nothing here yet" use `<EmptyState>`.

## Import

```tsx
import { ErrorState } from "@infinibay/harbor/display";
```

## Example

```tsx
<ErrorState
  title="Project not found"
  description="The project you're looking for doesn't exist or was deleted."
  code="404"
  onRetry={() => refetch()}
/>
```

## Props

- **title** — `ReactNode`. Default `"Something went wrong"`.
- **description** — `ReactNode`. Default — generic apology line.
- **code** — `string`. Small monospace chip ("503", "ECONNREFUSED").
- **onRetry** — `() => void`. When set, renders a "Try again" button.
- **actions** — `ReactNode`. Slot next to the retry button (e.g.
  "Report issue").
- **icon** — `ReactNode`. Default `"✕"`.
- **className** — extra classes on the wrapper.
