# Toast

`ToastProvider` and `useToast` provide imperative, stacked notifications for short-lived feedback. Use toasts for confirmations and background updates: saved settings, copied commands, queued deploys, failed API calls with retry, completed exports, and undoable actions.

Toasts should not replace form validation, modal errors, or persistent status regions. They are transient by design.

## Import

```tsx
import { ToastProvider, useToast } from "@infinibay/harbor/feedback";
```

## Basic Usage

```tsx
import { ToastProvider, useToast } from "@infinibay/harbor/feedback";
import { Button } from "@infinibay/harbor/buttons";

function SaveButton() {
  const toast = useToast();

  return (
    <Button
      onClick={() =>
        toast.push({
          tone: "success",
          title: "Saved",
          description: "Your changes are live.",
          action: { label: "Undo", onClick: () => console.log("undo") },
        })
      }
    >
      Save
    </Button>
  );
}

export function App() {
  return (
    <ToastProvider>
      <SaveButton />
    </ToastProvider>
  );
}
```

## API

`useToast()` returns:

- **push** - `(toast) => number`. Adds a toast and returns its generated id.
- **dismiss** - `(id: number) => void`. Removes a toast by id.

`push` accepts `title`, optional `description`, optional `tone`, optional `duration`, and optional `action`.

## Props

`ToastProvider` accepts only **children** - `ReactNode`. It provides the toast context and renders the portal container.

Toast objects passed to `push` accept:

- **title** - `string`. Required short message.
- **description** - `string`. Optional supporting copy.
- **tone** - `"default" | "success" | "warning" | "danger" | "info"`.
- **duration** - `number`. Milliseconds before auto-dismiss.
- **action** - `{ label: string; onClick: () => void }`. Optional inline action.

## Toast Model

`tone` can be `"default"`, `"success"`, `"warning"`, `"danger"`, or `"info"`. `duration` is milliseconds and defaults to `4000`. Pass `duration: 0` to keep the toast visible until the user dismisses it.

An `action` has `{ label, onClick }`. Clicking it runs the callback and dismisses the toast.

## Behavior

Toasts render in a portal at the bottom-right of the viewport with `Z.TOAST`. Each toast animates in, stacks above the previous one, shows a tone bar, and displays a progress strip while auto-dismiss is active.

## Accessibility

The current implementation is visual and does not set `role="status"` or `aria-live`. For critical notifications, mirror the message in an accessible live region or persistent UI. Always keep dangerous failures recoverable outside the toast.

## Gotchas

- `useToast` throws if called outside `ToastProvider`.
- Timers are started when `push` runs and are not paused on hover.
- Toast ids are local to one provider instance.
- The provider should usually live near the app root.

## Related

- `Alert` for inline messages.
- `Banner` for persistent page-level notices.
- `ErrorState` for blocking failures.
