# ProductShell

Composable application chrome for SaaS, admin, workbench, and editor surfaces.

## Import

```tsx
import {
  ProductShell,
  DashboardShell,
  AdminShell,
  WorkbenchShell,
  EditorShell,
} from "@infinibay/harbor/layout";
```

## Example

```tsx
<ProductShell
  kind="admin"
  sidebar={<PrimaryNav />}
  mobileNavigation={<MobileNav />}
  topbar={<Topbar />}
  breadcrumbs="Acme / Production / Customers"
  toolbar={<CustomerToolbar />}
  detailPanel={<CustomerDetails />}
  mobileDetailPanel={<CustomerSummary />}
  statusBar={<StatusBar />}
>
  <CustomerWorkspace />
</ProductShell>
```

## Props

- `kind`: visual/layout preset. Use `dashboard`, `admin`, `workbench`, or `editor`.
- `sidebar`, `topbar`, `breadcrumbs`, `toolbar`, `detailPanel`, `statusBar`, `footer`: optional slots for product chrome.
- `mobileNavigation`: compact navigation slot rendered below the topbar on small screens.
- `mobileDetailPanel`: compact detail slot rendered after the main content on small screens.
- `commandPalette`: render an app command palette alongside the shell.
- `mainLabel`, `sidebarLabel`, `mobileNavigationLabel`, `detailPanelLabel`, `mobileDetailPanelLabel`: accessible landmark labels.
- `sidebarClassName`, `mobileNavigationClassName`, `detailPanelClassName`, `mobileDetailPanelClassName`, `mainClassName`, `contentClassName`, `className`, `style`: scoped layout overrides.

## Presets

Use the named presets when the shell role is fixed:

```tsx
<DashboardShell sidebar={<Nav />}>
  <MetricsDashboard />
</DashboardShell>
```

`DashboardShell`, `AdminShell`, `WorkbenchShell`, and `EditorShell` are thin wrappers over `ProductShell` with the matching `kind`.

## Notes

`ProductShell` owns app-level structure, not page content. Keep data tables, forms, and workflow panels inside the main slot, and use shell slots only for persistent navigation, commands, detail surfaces, and status. The component includes a skip link and landmark labels; keep custom slot content keyboard-accessible.

Desktop sidebars hide below the `md` breakpoint and desktop detail panels hide below `lg`. Provide `mobileNavigation` and `mobileDetailPanel` when those surfaces are required on smaller screens instead of forcing desktop chrome into a narrow viewport.
