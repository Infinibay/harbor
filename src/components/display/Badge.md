# Badge

Compact status pill for labels, counts, metadata, and lightweight state.
`Badge` is intentionally small: it should annotate nearby content, not become
the main content itself. Use it for states like `Active`, `Beta`, `Trial`,
`Healthy`, `Pending`, `Failed`, or short numeric counts.

For richer status with title, body, and actions, use `Alert`, `Banner`,
`MetricCard`, or a purpose-built display component instead.

## Import

```tsx
import { Badge } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<Badge tone="success">Active</Badge>
<Badge tone="warning" pulse>Deploying</Badge>
<Badge tone="danger" icon={<XIcon />}>Failed</Badge>
```

## Props

- **children** - required label content. Keep it short.
- **tone** - `"neutral" | "success" | "warning" | "danger" | "info" | "purple"`.
  Default `"neutral"`.
- **pulse** - renders a leading animated dot for live or in-progress state.
- **icon** - optional leading icon rendered before the label.
- **className** - applies to the wrapper for local spacing or layout tweaks.

## Tone Guide

Use tones semantically and consistently across a product:

- `neutral` for metadata, passive labels, and non-state categories.
- `info` for informative state such as `Preview`, `Beta`, or `New`.
- `success` for healthy, complete, connected, or active states.
- `warning` for pending, partial, quota, or attention-needed states.
- `danger` for failed, blocked, destructive, or high-risk states.
- `purple` for Harbor accent labels or product-specific categories.

## Composition Notes

Place badges close to the object they describe: in table cells, card headers,
page metadata, activity entries, or toolbar status groups. Avoid long sentences
inside a badge; the shape is optimized for short labels that can be scanned
quickly.

`pulse` is best for live operational state such as connected services,
deployments in progress, or realtime presence. Do not use pulsing badges for
static labels; repeated motion makes dense interfaces harder to scan.

## Accessibility

Badge renders as a `span`, so it does not announce special semantics by
itself. Keep the text meaningful without relying only on color. If the badge
communicates critical state, pair it with nearby text, row labels, or an
accessible status region. Decorative icons should not replace the text label.

## Gotchas

- Badges are not buttons. Do not attach click behavior to them; use `Button`,
  `Menu`, or `Tag` patterns for interactive controls.
- Keep labels short enough to fit in tables and toolbars.
- `pulse` uses continuous animation. Use it sparingly and avoid it for
  low-importance labels.

## Related Components

`Tag`, `StatusDot`, `RoleBadge`, `MetricCard`, `Alert`, `Banner`,
`ActivityFeed`.
