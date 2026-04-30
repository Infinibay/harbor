# AppShell

Full-viewport application frame: optional sticky sidebar on the left,
optional top header, and a scrollable main content region sized to at
least the viewport. Use it as the outermost wrapper of authenticated
app routes. For the inner page chrome (centered max-width + section
stack) compose `<Page>` inside.

## Import

```tsx
import { AppShell } from "@infinibay/harbor/layout";
```

## Example

```tsx
<AppShell
  sidebar={<Sidebar />}
  header={<TopBar />}
  contentPadding="lg"
  gutter="md"
>
  <Page>{/* ... */}</Page>
</AppShell>
```

## Props

- **sidebar** — `ReactNode`. Rendered to the left of the main panel.
- **header** — `ReactNode`. Rendered above the scrollable content area.
- **children** — `ReactNode`. Main content.
- **contentPadding** — `"none" | "sm" | "md" | "lg"`. Horizontal/vertical
  padding around the main content. Default `"lg"`.
- **gutter** — `"none" | "sm" | "md" | "lg"`. When non-`"none"`,
  surrounds sidebar and main with an outer gutter so they appear as
  floating islands; the main panel gets a matching rounded card surface.
  Default `"none"` preserves edge-to-edge behavior.
- **className** / **style** — passed through to the outer wrapper.

## Notes

- With `gutter !== "none"` the shell switches from `min-h-screen` to
  `h-screen` and the content region scrolls internally — pick this
  when you want the chrome glued to the viewport edges.
- Without a gutter the page scrolls the document, which is usually
  the right default for content-heavy routes.
