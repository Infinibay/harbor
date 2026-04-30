# AuditLog

A vertical stream of audit events. `<AuditLog>` is the styled stack;
`<AuditEntry>` is one row. Each entry takes a regular `onClick` (and
any other HTML attribute), so consumers attach navigation, telemetry,
or context-menu handlers per row.

## Import

```tsx
import {
  AuditLog,
  AuditEntry,
  AuditDiff,
} from "@infinibay/harbor/data";
```

## Example

```tsx
<AuditLog>
  <AuditEntry
    actor={{ name: "Ana" }}
    verb="deleted"
    target="auth-service"
    at={Date.now() - 30 * 60 * 1000}
    severity="warn"
    kind="security"
    onClick={() => navigate(`/audit/svc-auth`)}
  >
    <AuditDiff from="enabled" to="disabled" />
    <p>Reason: rotation policy required regenerating credentials.</p>
  </AuditEntry>

  <AuditEntry
    actor={{ name: "system" }}
    verb="ran"
    target="nightly migration"
    at={Date.now() - 26 * 3600 * 1000}
    kind="job"
  />
</AuditLog>;
```

Children inside an `<AuditEntry>` become the expanded detail panel,
revealed when the row is clicked.

## Subcomponents

- **`<AuditEntry>`** — one row. Accepts the actor / verb / target /
  timestamp data plus all standard HTML attributes (e.g. `onClick`,
  `onMouseEnter`, `id`, `data-*`).
- **`<AuditDiff>`** — standardized red→green from/to chip pair for
  diff-style entries. Use as a child of `<AuditEntry>`.

## Props (`<AuditLog>`)

- **empty** — `ReactNode`. Rendered when there are no entries. Default
  `"No entries."`
- **className**, plus any other `HTMLDivElement` attribute.

## Props (`<AuditEntry>`)

- **actor** — `{ id?, name, avatarUrl? }`. Required.
- **verb** — `string`. Short imperative ("deleted", "rolled back").
- **target** — `ReactNode`. The object the action was performed on.
- **at** — `Date | string | number`. Timestamp.
- **severity** — `"info" | "warn" | "critical"`. Default `"info"`.
  Drives row tint and verb color.
- **kind** — `string`. Optional category tag rendered in the header.
- **expandable** — `boolean`. Force the click-to-expand caret on/off.
  Defaults to `true` when there are children.
- **children** — detail content revealed on expand.
- **onClick** — fires alongside the expand toggle. Use it for
  navigation, telemetry, or row-level menus.
- Plus any other `HTMLDivElement` attribute (`onMouseEnter`, `id`,
  `data-*`, etc.).

## Props (`<AuditDiff>`)

- **from** — `ReactNode`. Old value (red chip).
- **to** — `ReactNode`. New value (green chip).
- **className** — extra classes on the wrapper.

## Notes

- `<AuditEntry>` is keyboard-accessible: when it has `onClick` or is
  expandable, it gets `role="button"`, `tabIndex={0}`, and responds to
  Enter/Space.
- For grouped views (by day / actor / kind), group at the consumer
  level and render multiple `<AuditLog>` blocks with headings — the
  component intentionally stays a flat container.
