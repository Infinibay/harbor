# Banner

`Banner` is a full-width notice bar for information that should sit above or inside a page region. Use it for maintenance notices, release announcements, trial status, saved-view prompts, read-only mode, billing warnings, and product-wide updates.

Use `Alert` for inline content messages. Use `Toast` for transient feedback after an action.

## Import

```tsx
import { Banner } from "@infinibay/harbor/feedback";
```

## Basic Usage

```tsx
import { useState } from "react";
import { Banner } from "@infinibay/harbor/feedback";

export function ReadOnlyBanner() {
  const [open, setOpen] = useState(true);

  return (
    <Banner
      open={open}
      tone="warning"
      title="Read-only mode"
      actions={<button>Learn more</button>}
      onClose={() => setOpen(false)}
    >
      Deployments are paused while maintenance is running.
    </Banner>
  );
}
```

## Props

- **open** - `boolean`. Controls visibility. Default `true`.
- **tone** - `"info" | "success" | "warning" | "danger" | "promo"`. Default `"info"`.
- **icon** - `ReactNode`. Optional leading icon.
- **title** - `ReactNode`. Optional emphasized message.
- **children** - `ReactNode`. Body text.
- **actions** - `ReactNode`. Optional action area on the right.
- **onClose** - `() => void`. Shows a dismiss button and calls this callback.
- **sticky** - `boolean`. Makes the banner sticky at the top.
- **className** - extra classes on the wrapper.

## Behavior

`Banner` animates open and closed with `AnimatePresence`. When `title` and `children` are both present, it separates them with a dot. `actions` stay right-aligned and do not collapse into a menu. `sticky` adds `position: sticky`, `top: 0`, and a local z-index.

## Accessibility

The component is visual and does not set `role="status"` or `role="alert"`. For critical warnings, add an accessible role in `className` wrappers or mirror the message in page content. The close button has `aria-label="Dismiss"`.

## Gotchas

- `onClose` does not update `open`; your parent must do that.
- Long body text can compete with actions on small screens.
- Sticky banners are affected by ancestor overflow.
- `promo` uses a gradient tone and should be reserved for announcements.

## Related

- `Alert` for inline notices.
- `Toast` for short-lived feedback.
- `MaintenanceBanner` for maintenance-specific status.
