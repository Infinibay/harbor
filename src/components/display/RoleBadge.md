# RoleBadge

`RoleBadge` is a compact chip for showing a member's permission role in a team,
workspace, organization, or audit surface. It gives common roles a consistent
tone and label so user tables, member drawers, and approval flows communicate
authority quickly.

This component is presentational. It does not enforce permissions, hide actions,
or decide what a user can do. Keep authorization logic in your app and use
`RoleBadge` to display the result.

## Import

```tsx
import { RoleBadge } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<DataTable
  rows={members}
  columns={[
    { id: "name", header: "Member", accessor: "name" },
    {
      id: "role",
      header: "Role",
      cell: (member) => <RoleBadge role={member.role} />,
    },
  ]}
/>
```

Use `icon` when the badge appears in dense tables or audit rows where shape helps
users scan faster:

```tsx
<RoleBadge role="owner" icon />
<RoleBadge role="custom" label="Billing" size="sm" />
```

## Props

- **role** - `"owner" | "admin" | "editor" | "viewer" | "guest" | "custom"`.
  Required. Selects the default label, tone, and optional glyph.
- **label** - `string`. Overrides the default label. Useful for `custom` roles
  or product-specific role names.
- **icon** - `boolean`. Shows the role glyph before the label. Default `false`.
- **size** - `"xs" | "sm" | "md"`. Controls padding and text size. Default
  `"md"`.
- **className** - extra classes on the badge wrapper.

## Role Model

The built-in roles cover the permission vocabulary most SaaS products need:
`owner`, `admin`, `editor`, `viewer`, `guest`, and `custom`. The label is
rendered uppercase for consistency, so pass human-readable words rather than
preformatted acronyms unless that is what you want users to see.

Use `custom` plus `label` for roles that come from your backend:

```tsx
<RoleBadge role="custom" label={workspaceRole.name} />
```

## Accessibility

`RoleBadge` renders text, not just color. That makes it readable in screen
readers and for users who cannot distinguish the tones. When showing icons, keep
the label visible; the glyph should support recognition, not replace the role
name.

If the role affects what the user can do, explain that in nearby UI. A badge
alone should not be the only way a user learns why an action is disabled.

## Gotchas

- `RoleBadge` is not a generic status pill. For states like `Active`, `Invited`,
  `Blocked`, or `Pending`, use `Badge`.
- The tone is fixed by `role`. If you need arbitrary colors or semantic status
  mapping, build that mapping in your app or use `Badge`.
- Passing `label` changes the displayed text only; it does not change the role
  tone or icon.

## Related

- `Badge` for generic statuses and labels.
- `DataTable` for member and admin lists.
- `Avatar` and `Presence` for identity rows.
- `AuditLog` for permission-change history.
