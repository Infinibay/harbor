# Breadcrumbs

`Breadcrumbs` shows the user's location inside a hierarchy. Use it for admin areas, project settings, file browsers, documentation pages, nested resources, and any workflow where users can move back to a parent context without losing orientation.

Each crumb can render text, an optional icon, and an optional `href`. Harbor handles truncation, spacing, separators, and current-page styling.

## Import

```tsx
import { Breadcrumbs } from "@infinibay/harbor/navigation";
```

## Basic Usage

```tsx
<Breadcrumbs
  items={[
    { label: "Projects", href: "/projects" },
    { label: "Harbor Cloud", href: "/projects/harbor-cloud" },
    { label: "Deployments" },
  ]}
/>
```

With icons:

```tsx
<Breadcrumbs
  items={[
    { label: "Workspace", href: "/", icon: <HomeIcon /> },
    { label: "Settings", href: "/settings" },
    { label: "Billing" },
  ]}
/>
```

## Props

- **items** - required array of crumbs.
- **className** - optional string merged onto the root `<nav>`.

Each crumb supports:

- **label** - required `ReactNode`.
- **href** - optional string.
- **icon** - optional `ReactNode`.

## Navigation Model

The final item is styled as the current location. Earlier crumbs should usually have `href` values so users can move upward. The component renders anchor elements for all crumbs; when `href` is omitted, the anchor is not navigable.

Keep the trail short. Breadcrumbs work best when they show stable hierarchy, not every transient tab or filter.

## Accessibility

Place breadcrumbs near the page title or app header. The root is a `<nav>`, but the current implementation does not add an explicit `aria-label`, so add surrounding context or consider extending it if your page has multiple nav landmarks.

Use readable labels. Icons should support scanning, not replace the text.

## Gotchas

- Do not use breadcrumbs as the primary navigation for an app.
- Avoid putting query state, sort order, or temporary filters into crumbs.
- Long labels truncate visually. Keep names concise or provide a nearby title with the full value.
- The component does not integrate with React Router automatically; pass real `href` values or wrap at the app layer if needed.

## Related

- `Sidebar` for persistent app navigation.
- `Tabs` for sibling views within one page.
- `PageHeader` for the current page title and actions.
- `TOC` for in-page documentation navigation.
