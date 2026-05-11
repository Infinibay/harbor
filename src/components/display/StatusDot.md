# StatusDot

`StatusDot` displays a compact service, host, job, or connection state with a colored dot, optional pulse ring, and optional label. It is the smallest status primitive in Harbor and works well in dense rows, sidebars, status bars, resource lists, and monitoring cards.

Use it when the status should be visible without taking the space of a full badge. Use `Badge` when the label itself should sit inside a pill.

## Import

```tsx
import { StatusDot } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
import { StatusDot } from "@infinibay/harbor/display";

export function ServiceStatus() {
  return (
    <div className="flex items-center gap-4">
      <StatusDot status="online" />
      <StatusDot status="degraded" labelOverride="Latency high" />
      <StatusDot status="maintenance" pulse={false} size={12} />
    </div>
  );
}
```

## Props

- **status** - `"online" | "degraded" | "offline" | "provisioning" | "maintenance" | "unknown"`. Required.
- **pulse** - `boolean`. Overrides the default pulse behavior.
- **size** - `number`. Dot size in pixels. Default `10`.
- **label** - `ReactNode`. Custom label node. Pass `null` to suppress the default label.
- **labelOverride** - `string`. Replaces the status-derived label text.
- **className** - extra classes on the wrapper.

## Status Model

Each status maps to a label, dot color, text color, glow, and default pulse behavior. `online`, `degraded`, and `provisioning` pulse by default. `offline`, `maintenance`, and `unknown` stay static by default.

`labelOverride` keeps the same visual status mapping while changing the text. `label` replaces the rendered label node entirely.

## Accessibility

Color should not be the only source of meaning. The default label helps, so keep it visible unless nearby text already explains the status. If you pass `label={null}`, make sure the row has another accessible status label.

The pulsing ring is decorative and marked `aria-hidden`.

## Gotchas

- The status color palette is built into the component.
- Rendering many pulsing dots can create unnecessary motion. Disable `pulse` in dense tables.
- `labelOverride=""` renders no useful text. Use `label={null}` intentionally when you want no label.
- `size` affects the dot only, not label typography.

## Related

- `HealthPing` for endpoint health checks.
- `Badge` for pill-style labels.
- `StatusBar` for application-level status regions.
