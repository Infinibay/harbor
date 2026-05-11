# Spinner

`Spinner` is Harbor's smallest loading primitive: a current-color ring with a transparent leading edge. Use it when an action is already in progress and the surrounding UI still has enough context to explain what is happening, such as a saving button, a compact toolbar action, or a single pending cell in a table.

For conversational or prose-like loading, the same module also exports `Dots`, a three-dot animated indicator. Use `Dots` in chat, assistant, activity feeds, and "thinking" states where a mechanical ring would feel too heavy.

## Import

```tsx
import { Spinner, Dots } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<Button disabled={saving}>
  {saving ? <Spinner size={14} className="mr-2" /> : null}
  Save changes
</Button>
```

Use `Dots` for compact message composition:

```tsx
<ChatBubble author="Harbor Assistant">
  <span className="inline-flex items-center gap-2">
    Generating answer <Dots />
  </span>
</ChatBubble>
```

## Props

`Spinner` accepts:

- **size** - optional number in pixels. Defaults to `18`. Use `12-16` inside buttons, `18-24` in inline content, and larger sizes only inside centered loading states.
- **className** - optional string merged onto the root element. The spinner uses `currentColor`, so set text color on the spinner or its parent.

`Dots` accepts:

- **className** - optional string merged onto the root element. Like `Spinner`, it inherits `currentColor`.

## Interaction Model

`Spinner` renders visual progress only. It does not disable controls, block clicks, announce loading, or own async state. Your app should keep the pending boolean and apply it consistently to the action, label, and surrounding region.

```tsx
<Button disabled={isSubmitting} aria-busy={isSubmitting}>
  {isSubmitting ? <Spinner size={14} /> : null}
  {isSubmitting ? "Sending..." : "Send invite"}
</Button>
```

## Accessibility

Use visible text next to the spinner whenever possible. If the spinner is the only content in a region, add an accessible label on the parent:

```tsx
<div role="status" aria-label="Loading invoices">
  <Spinner size={24} />
</div>
```

Avoid repeatedly announcing every small loading state. A button that changes from `"Save"` to `"Saving..."` is usually enough.

## Gotchas

- A spinner without text can look like a stuck UI. Pair it with an action label or status copy.
- Do not show a spinner for optimistic actions that complete instantly; use a disabled state or toast after completion.
- Because the ring inherits `currentColor`, a low-contrast parent color can make it hard to see.
- `Dots` injects its keyframes locally. Use it for small counts, not thousands of list rows.

## Related

- `LoadingOverlay` for blocking a whole panel while data refreshes.
- `Skeleton` and `SkeletonText` for initial page loading.
- `ProgressRing` for determinate or dashboard-like progress.
- `Button` for action-level pending states.
