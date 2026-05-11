# AuditLog

`AuditLog` renders a chronological stream of system events with actor, verb, target, timestamp, severity, category, and expandable details. It is built for admin panels, security consoles, compliance views, deployment history, and customer-facing activity trails.

You can use the data-driven `entries` prop for simple lists, or compose `AuditEntry` and `AuditDiff` directly when each row needs custom content.

## Import

```tsx
import { AuditLog, AuditEntry, AuditDiff } from "@infinibay/harbor/data";
```

## Basic Usage

```tsx
<AuditLog>
  <AuditEntry
    actor={{ name: "Mila Chen", avatarUrl: "/avatars/mila.png" }}
    verb="disabled"
    target="production deploys"
    at={Date.now()}
    severity="warn"
    kind="policy"
  >
    <AuditDiff from="enabled" to="disabled" />
    <p>Changed during the quarterly access review.</p>
  </AuditEntry>
</AuditLog>
```

## Data Driven Usage

```tsx
<AuditLog
  entries={events}
  kinds={["security", "billing"]}
  empty="No matching audit events."
/>
```

When `entries` is provided, Harbor maps each object into an `AuditEntry` and applies the optional `kinds` filter.

## Props

`AuditLog` accepts `entries`, `empty`, `kinds`, `children`, `className`, and standard `div` attributes.

`AuditEntry` accepts `actor`, `verb`, `target`, `at`, `severity`, `kind`, `expandable`, `children`, `onClick`, and standard `div` attributes.

`AuditDiff` accepts `from`, `to`, and `className`.

## Accessibility

Expandable rows become focusable buttons, support Enter and Space, and expose `aria-expanded`. Keep `verb` short and specific, because the row reads as "actor verb target" before the detail panel.

## Gotchas

`AuditLog` does not group by day yet; `groupBy` is currently accepted for compatibility but not rendered. If compliance requires immutable ordering, sort entries on the server and pass already ordered data.

## Related

Use with `Timeline`, `ActivityFeed`, `Timestamp`, `Avatar`, `QueryBuilder`, and `DataTable`.
