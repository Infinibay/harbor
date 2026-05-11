# Timestamp

`Timestamp` renders a date/time value as relative or absolute text, optionally
refreshing on an interval and showing the alternate format in a tooltip.

Use it for activity feeds, audit logs, "last seen" labels, deployment history,
messages, billing periods, and any timestamp where users benefit from both human
relative context and exact time.

## Import

```tsx
import { Timestamp } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<Timestamp value={deployment.createdAt} />
```

Absolute date:

```tsx
<Timestamp
  value={invoice.createdAt}
  relative={false}
  absoluteOptions={{ preset: "date" }}
/>;
```

## Props

- **value** - `Date | string | number | null | undefined`. Required timestamp.
- **relative** - `boolean`. Renders relative text when true. Default `true`.
- **refreshMs** - `number`. Re-render cadence for relative text. Default
  `15000`; set `0` to disable.
- **noTooltip** - `boolean`. Hides the alternate-format tooltip.
- **relativeOptions** - `FormatRelativeOptions`. Passed to `formatRelative`.
- **absoluteOptions** - `FormatAbsoluteOptions`. Passed to `formatAbsolute`.
- **className** and other span attributes are forwarded to the rendered span.

## Behavior

Relative timestamps tick on an interval so labels such as `2m ago` stay fresh.
When tooltips are enabled, the tooltip shows the alternate representation:
absolute for relative primary text, relative for absolute primary text.

Null or invalid values are formatted by Harbor's format helpers.

## Accessibility

The primary timestamp is plain text. Do not rely on hover tooltip content for
critical information; show exact times inline when precision matters.

## Gotchas

- Many live timestamps can create many intervals. Disable refresh in very large
  lists or virtualize rows.
- Tooltip requires the rendered span to be a valid tooltip child.
- Timezone behavior comes from the formatting helpers and runtime locale.

## Related

- `DurationPill` for elapsed intervals.
- `ActivityFeed` and `AuditLog` for timestamped records.
- `Tooltip` for alternate time display.
- `DatePicker` for date input.
