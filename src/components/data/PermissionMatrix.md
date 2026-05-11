# PermissionMatrix

`PermissionMatrix` renders principals by resources with tri-state permission
cells: allow, deny, and inherit. It is built for admin panels, IAM tools, team
settings, feature access, environment permissions, and role/resource editors.

Use it when users need to compare many permissions at once. Use simpler switches
or checkboxes for small permission sets.

## Import

```tsx
import { PermissionMatrix } from "@infinibay/harbor/data";
```

## Basic Usage

Values are keyed as `principalId:resourceId`. Missing values behave as inherit.

```tsx
<PermissionMatrix
  principals={[
    { id: "admins", label: "Admins", kind: "role" },
    { id: "maya", label: "Maya Singh", kind: "user" },
  ]}
  resources={[
    { id: "deploy", label: "Deploy", group: "Production" },
    { id: "billing", label: "Billing", group: "Account" },
  ]}
  value={permissions}
  onChange={(principalId, resourceId, next) =>
    setPermission(principalId, resourceId, next)
  }
/>
```

## Bulk Changes

Column and row headers call `onBulkChange` with the changes to apply.

```tsx
<PermissionMatrix
  {...matrix}
  onBulkChange={(changes) => applyPermissionChanges(changes)}
/>
```

## Props

- `principals`: users, teams, roles, or service accounts.
- `resources`: resources or actions.
- `value`: permission map keyed by `principalId:resourceId`.
- `onChange`: called when one cell cycles state.
- `onBulkChange`: called for row/column bulk toggles.
- `density`: `compact` or `expanded`.
- `className`: wrapper class override.

## Accessibility

The matrix is a dense visual editor. For high-stakes access control, provide a
review summary, audit log, or alternative list of changed permissions before
saving.

Do not rely only on color. The cells include symbols, but surrounding copy should
explain the allow/deny/inherit meaning.

## Gotchas

Clicking a cell cycles `inherit -> allow -> deny -> inherit`. Make sure your
backend semantics match that order.

Bulk changes are only emitted through `onBulkChange`; the parent must apply them
to state.

## Related

- `DataTable` for permission audit rows.
- `Switch` and `Checkbox` for simple permissions.
- `AuditLog` for access change history.
- `RoleBadge` for displaying roles.
