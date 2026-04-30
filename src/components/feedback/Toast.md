# Toast

Transient feedback that animates in from the corner of the viewport.
Toasts are imperative — call `toast(...)` from anywhere instead of
mounting a component.

## Import

```tsx
import { ToastProvider, toast } from "@infinibay/harbor/feedback";
```

## Setup

Mount the provider once near the root of your app so toasts have a
portal target and shared queue.

```tsx
<ToastProvider position="bottom-right">
  <App />
</ToastProvider>
```

## Example

```tsx
toast("Saved");

toast.success("Deployment complete", {
  description: "v0.4.2 is live on staging",
  duration: 4000,
});

toast.error("Couldn't reach the API", {
  action: { label: "Retry", onClick: retry },
});
```

## API

- **toast(message, options?)** — neutral toast.
- **toast.success / .info / .warning / .error** — semantic variants.
- **toast.promise(p, { loading, success, error })** — auto-resolves a
  promise with three messages.
- **toast.dismiss(id?)** — close a specific toast or all of them.

### Options

- **description** — secondary text below the title.
- **duration** — ms before auto-dismiss. `Infinity` keeps it sticky.
- **action** — `{ label, onClick }` shown on the right.

## Notes

- Toasts share one queue per `ToastProvider`, so duplicates are
  collapsed automatically — calling `toast("Saved")` ten times shows
  one toast with a counter.
- The corner position is set on the provider, not per toast.
