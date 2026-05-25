# Product Recipes

Copyable product screens that combine Harbor components into owned application patterns for admin, data, billing, security, AI, and incident workflows.

## Import

```tsx
import {
  AdminCrudRecipe,
  SettingsConsoleRecipe,
  BillingAccountRecipe,
  RbacAdminRecipe,
  AuditComplianceRecipe,
  AiAgentConsoleRecipe,
  DataReviewQueueRecipe,
  IncidentDashboardRecipe,
  productRecipes,
} from "@infinibay/harbor/recipes";
```

## Recipes

- `AdminCrudRecipe`: account administration with `AdminShell`, `DataWorkspace`, saved views, bulk actions, detail panel, breadcrumbs, and status bar.
- `SettingsConsoleRecipe`: settings form using `HarborForm`, schema validation, controlled fields, and field arrays.
- `BillingAccountRecipe`: billing/account dashboard with invoice workspace, metrics, current plan panel, and plan action.
- `RbacAdminRecipe`: role management with `DataWorkspace`, `PermissionMatrix`, role badges, and a side detail summary.
- `AuditComplianceRecipe`: compliance evidence workspace with metrics plus an `AuditLog` trail for control and privacy events.
- `AiAgentConsoleRecipe`: AI/devtools workbench with prompt composer, model picker, timeline, tool trace, approval, citations, and token meter.
- `DataReviewQueueRecipe`: operational review queue with saved views, selected-row bulk actions, and persistent detail inspection.
- `IncidentDashboardRecipe`: incident command dashboard with active incidents, status metrics, and eval results.

## Example

```tsx
import { AdminCrudRecipe } from "@infinibay/harbor/recipes";

export function AccountsPage() {
  return <AdminCrudRecipe />;
}
```

Recipes are meant to be copied into the app and edited. Keep the Harbor component composition, then replace mock rows, event handlers, data fetching, routing, authorization, and persistence with your product code.

## Ownership

Use recipes as implementation starting points, not as sealed templates. A useful recipe should expose the workflow structure:

- app shell and navigation
- primary workspace or form
- operational states and metrics
- bulk or approval actions
- detail surfaces
- audit or evidence context when relevant

After copying a recipe, move data and mutations into the app layer. Harbor should own UI composition and accessibility behavior; the application should own business rules, permissions, queries, cache invalidation, and persistence.

## Gotchas

Recipes intentionally avoid decorative backgrounds, hero sections, and theme-specific hardcoding. If a product screen needs visual distinction, prefer semantic theme tokens or a product preset over per-component color overrides.

The exported recipes are SSR-renderable demos. Production apps should wire real handlers for destructive actions, approvals, billing changes, role edits, incident operations, and compliance evidence updates.
