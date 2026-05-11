# LoadingOverlay

`LoadingOverlay` presents a centered loading state with a spinner, optional label, and optional determinate progress bar. Use it when a panel, card, route section, or long-running operation is temporarily unavailable and replacing the content is clearer than showing partially stale UI.

The component is especially useful for batch actions: applying a template, importing records, syncing files, generating previews, deleting many items, or waiting for a slow data fetch.

## Import

```tsx
import { LoadingOverlay } from "@infinibay/harbor/feedback";
```

## Basic Usage

```tsx
<Card title="Import customers">
  {loading ? (
    <LoadingOverlay label="Importing customers..." fill />
  ) : (
    <CustomerImportSummary rows={rows} />
  )}
</Card>
```

Use progress when the app knows the total:

```tsx
<LoadingOverlay
  label="Applying workspace template..."
  progress={{ done: completedSteps, total: totalSteps }}
  fill
/>
```

## Props

- **label** - optional `ReactNode` shown under the spinner.
- **progress** - optional `{ done: number; total: number }`. Renders a numeric counter and proportional bar.
- **fill** - optional boolean. Adds a minimum height and full width for card or panel loading states.
- **size** - optional spinner size in pixels. Defaults to `24`.
- **className** - optional string merged onto the root element.

## Progress Model

When `progress.total` is greater than zero, Harbor computes `done / total`, clamps it between `0` and `100`, and uses that percentage for the bar width. The numeric counter remains visible so users can understand the work in concrete terms.

If the total is unknown, omit `progress` and keep the label specific.

## Accessibility

The root element uses `role="status"` and `aria-live="polite"`. Write labels that describe the operation, not just `"Loading"`. For example, `"Loading invoices"` or `"Generating preview"` gives users better context.

Avoid changing the label every few milliseconds. Polite live regions should update only when the message is useful.

## Gotchas

- `LoadingOverlay` does not block interaction outside its own rendered area. If the whole page must be blocked, place it in the correct layout layer or use a modal workflow.
- Keep `done` and `total` non-negative. Values outside the range are visually clamped, but confusing counters still confuse users.
- Do not hide existing content for tiny fetches that resolve instantly; skeletons or optimistic UI may feel better.
- If users can cancel the work, provide a button near the overlay or in the surrounding header.

## Related

- `Spinner` for inline loading.
- `Skeleton` for initial content placeholders.
- `Progress` for standalone linear progress.
- `Alert` for failed loading or recovery instructions.
