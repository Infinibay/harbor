# Prose

Readable typographic container for long-form content. Constrains line
length to ~55–75 characters, adds vertical rhythm between block
elements, and styles inline markup (`<a>`, `<code>`, `<strong>`,
`<em>`, `<blockquote>`, `<pre>`). Wrap article bodies, changelogs, and
docs pages in this.

## Import

```tsx
import { Prose } from "@infinibay/harbor/sections";
```

## Example

```tsx
<Prose size="md">
  <h2>Getting started</h2>
  <p>
    Install the package, import a component, and you're done. No theme
    provider, no wrapper, no <code>className</code> dance.
  </p>
  <ul>
    <li>Zero-config dark mode</li>
    <li>Tree-shakable</li>
  </ul>
</Prose>
```

## Props

- **children** — `ReactNode`. Required. The HTML content to style.
- **size** — `"sm" | "md" | "lg"`. Default `"md"`. Controls measure and
  base font size (`54ch / 14px`, `66ch / 15px`, `72ch / 16px`).
- **className** — extra classes on the wrapper `<div>`.

## Notes

- Styling targets only direct HTML children (`[&>h2]`, `[&>p]`, etc.) —
  it won't bleed into nested React components, so you can mix custom
  elements freely without resets.
- The container is `mx-auto` by default; pair with a parent that sets
  width if you want it left-aligned.
