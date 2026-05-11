# HealthPing

`HealthPing` is a decorative pulsing dot for "alive" signals. Use it beside live previews, connected devices, running workers, active deployments, streaming sessions, realtime cursors, and compact system cards where motion helps communicate activity.

It is intentionally different from a semantic status component. `HealthPing` is visual only and sets `aria-hidden`; when the state matters, pair it with text, `Badge`, `StatusDot`, or a table column label.

## Import

```tsx
import { HealthPing } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<div className="flex items-center gap-2">
  <HealthPing tone="success" />
  <span>Realtime sync connected</span>
</div>
```

Use two rings for busier or more urgent live states:

```tsx
<HealthPing tone="danger" rings={2} speed={1.1} />
```

## Props

- **tone** - optional `"success"`, `"warn"`, `"danger"`, `"info"`, or `"neutral"`. Defaults to `"success"`.
- **size** - optional dot size in pixels. Defaults to `8`.
- **rings** - optional `1` or `2`. Defaults to `1`.
- **speed** - optional animation cycle in seconds. Defaults to `1.6`.
- **className** - optional string merged onto the root element.

## Tone Guide

Use `success` for active and healthy, `warn` for degraded or delayed, `danger` for down or failing, `info` for live but neutral, and `neutral` when activity is purely decorative. Keep the meaning consistent across the product; users learn color faster than copy.

## Interaction Model

`HealthPing` has no state and no event handlers. It renders one solid dot plus one or two CSS `animate-ping` rings. This makes it cheap enough for lists and dashboards, but it should still be used sparingly. A page full of pulsing dots becomes hard to scan.

## Accessibility

The component is hidden from assistive technology. Always include adjacent text for meaningful state:

```tsx
<HealthPing tone="warn" />
<span>Sync delayed</span>
```

Do not use motion as the only indicator of urgency. Pair dangerous or degraded states with words, icons, or explicit status cells.

## Gotchas

- `rings={2}` is visually strong. Reserve it for states that deserve attention.
- Very high `speed` values can feel frantic. Keep most product UI between `1.2` and `2.4` seconds.
- The dot is decorative; it will not announce status changes.
- If you need a labelled, semantic status marker, use `StatusDot` or `Badge`.

## Related

- `StatusDot` for labelled status.
- `Badge` for compact semantic labels.
- `Presence` for collaborative user presence.
- `ActivityFeed` for chronological operational updates.
