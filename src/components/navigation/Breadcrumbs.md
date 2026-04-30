# Breadcrumbs

Horizontal trail of links showing the current location in a
hierarchy. The last crumb is rendered as the current page (white);
all earlier crumbs are subdued links separated by a `›` glyph.

## Import

```tsx
import { Breadcrumbs } from "@infinibay/harbor/navigation";
```

## Example

```tsx
<Breadcrumbs
  items={[
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "harbor-site", href: "/projects/harbor-site" },
    { label: "src/harbor/pages" },
  ]}
/>
```

## Props

- **items** — `Crumb[]`. Required. Each crumb has:
  - **label** — `ReactNode`. Display text.
  - **href** — `string` (optional). Omit on the last crumb.
  - **icon** — `ReactNode` (optional). Leading icon.
- **className** — extra classes on the `<nav>`.

## Notes

- The component does not detect the current crumb — it just styles
  the last item in the array as active.
- Each crumb truncates with `min-w-0` on the wrapper, so a long
  trail collapses gracefully inside narrow headers.
