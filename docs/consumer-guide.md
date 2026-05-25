# Harbor Consumer Guide

Harbor is published as a typed React package. Import from the package
subpaths, not from internal `src/` files.

```tsx
import { Button } from "@infinibay/harbor/buttons";
import { DataWorkspace } from "@infinibay/harbor/data";
import { ProductShell } from "@infinibay/harbor/layout";
import { HarborProvider } from "@infinibay/harbor/theme";
import "@infinibay/harbor/index.css";
```

The root export is useful for small apps and prototypes:

```tsx
import { Button, DataTable, Dialog } from "@infinibay/harbor";
```

Prefer category exports in production apps when you want clearer ownership
and easier bundle inspection.

## Public Subpaths

Application components:

- `@infinibay/harbor/buttons`
- `@infinibay/harbor/inputs`
- `@infinibay/harbor/display`
- `@infinibay/harbor/data`
- `@infinibay/harbor/charts`
- `@infinibay/harbor/feedback`
- `@infinibay/harbor/overlays`
- `@infinibay/harbor/navigation`
- `@infinibay/harbor/layout`
- `@infinibay/harbor/chat`
- `@infinibay/harbor/collab`
- `@infinibay/harbor/media`
- `@infinibay/harbor/dev`
- `@infinibay/harbor/sections`
- `@infinibay/harbor/backgrounds`
- `@infinibay/harbor/motion`
- `@infinibay/harbor/recipes`

Shared systems:

- `@infinibay/harbor/theme`
- `@infinibay/harbor/a11y`
- `@infinibay/harbor/form`
- `@infinibay/harbor/schema`
- `@infinibay/harbor/i18n`
- `@infinibay/harbor/lib/cursor`
- `@infinibay/harbor/lib/z`
- `@infinibay/harbor/lib/cn`
- `@infinibay/harbor/lib/Portal`
- `@infinibay/harbor/lib/responsive`
- `@infinibay/harbor/tokens.css`
- `@infinibay/harbor/index.css`
- `@infinibay/harbor/tailwind-preset`

## Runtime Boundaries

Harbor separates import safety from interaction boundaries:

- **Pure utility exports** can be called from server-only application code.
- **SSR-importable React exports** are safe to import and render with
  `react-dom/server`, but they should live behind a client boundary in
  React Server Component frameworks when the application renders interactive
  UI.
- **Styles and build-time exports** are not JavaScript runtime entry points.

| Export | Contract |
| --- | --- |
| `@infinibay/harbor/schema` | Pure utility export |
| `@infinibay/harbor/i18n` | Pure utility export |
| `@infinibay/harbor/lib/z` | Pure utility export |
| `@infinibay/harbor/lib/cn` | Pure utility export |
| `@infinibay/harbor` | SSR-importable React export |
| `@infinibay/harbor/buttons` | SSR-importable React export |
| `@infinibay/harbor/inputs` | SSR-importable React export |
| `@infinibay/harbor/display` | SSR-importable React export |
| `@infinibay/harbor/data` | SSR-importable React export |
| `@infinibay/harbor/charts` | SSR-importable React export |
| `@infinibay/harbor/feedback` | SSR-importable React export |
| `@infinibay/harbor/overlays` | SSR-importable React export |
| `@infinibay/harbor/navigation` | SSR-importable React export |
| `@infinibay/harbor/layout` | SSR-importable React export |
| `@infinibay/harbor/chat` | SSR-importable React export |
| `@infinibay/harbor/collab` | SSR-importable React export |
| `@infinibay/harbor/media` | SSR-importable React export |
| `@infinibay/harbor/dev` | SSR-importable React export |
| `@infinibay/harbor/sections` | SSR-importable React export |
| `@infinibay/harbor/backgrounds` | SSR-importable React export |
| `@infinibay/harbor/motion` | SSR-importable React export |
| `@infinibay/harbor/recipes` | SSR-importable React export |
| `@infinibay/harbor/theme` | SSR-importable React export |
| `@infinibay/harbor/a11y` | SSR-importable React export |
| `@infinibay/harbor/form` | SSR-importable React export |
| `@infinibay/harbor/lib/cursor` | SSR-importable React export |
| `@infinibay/harbor/lib/Portal` | SSR-importable React export |
| `@infinibay/harbor/lib/responsive` | SSR-importable React export |
| `@infinibay/harbor/tokens.css` | Styles and build-time export |
| `@infinibay/harbor/index.css` | Styles and build-time export |
| `@infinibay/harbor/tailwind-preset` | Styles and build-time export |

For Next.js App Router, add `"use client"` at the boundary that renders
Harbor components or hooks. Pure utility imports can stay in server files.
The package smoke tests still import all JavaScript subpaths in an SSR
environment so module-scope browser APIs do not leak into server startup.

## Vite

Install the package and peer dependencies in the app:

```bash
npm install @infinibay/harbor react react-dom framer-motion
```

Import the CSS once in `src/main.tsx` or `src/App.tsx`:

```tsx
import "@infinibay/harbor/index.css";
```

Wrap the app with `HarborProvider`:

```tsx
import { HarborProvider } from "@infinibay/harbor/theme";

export function App() {
  return (
    <HarborProvider theme="harbor-enterprise-light">
      {/* routes and product shell */}
    </HarborProvider>
  );
}
```

If the app uses Tailwind, include Harbor sources in `content` and optionally
extend from the package preset:

```js
import harborPreset from "@infinibay/harbor/tailwind-preset";

export default {
  presets: [harborPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@infinibay/harbor/src/**/*.{ts,tsx}",
  ],
};
```

## Next.js App Router

Import CSS once in `app/layout.tsx`:

```tsx
import "@infinibay/harbor/index.css";
```

Use a small client provider because `HarborProvider` owns runtime theme state:

```tsx
// app/harbor-provider.tsx
"use client";

import { HarborProvider } from "@infinibay/harbor/theme";

export function AppHarborProvider({ children }: { children: React.ReactNode }) {
  return (
    <HarborProvider
      defaultTheme={{
        dark: "harbor-enterprise-dark",
        light: "harbor-enterprise-light",
      }}
    >
      {children}
    </HarborProvider>
  );
}
```

Then use it from `app/layout.tsx`:

```tsx
import { AppHarborProvider } from "./harbor-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppHarborProvider>{children}</AppHarborProvider>
      </body>
    </html>
  );
}
```

Keep browser APIs out of module scope in application code. Harbor components
are expected to import during SSR; overlays that need `document.body` mount
their portals after hydration.

## Remix

Import CSS from the root stylesheet entry:

```tsx
// app/root.tsx
import harborStyles from "@infinibay/harbor/index.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: harborStyles },
];
```

Wrap the outlet:

```tsx
import { Outlet } from "@remix-run/react";
import { HarborProvider } from "@infinibay/harbor/theme";

export default function App() {
  return (
    <HarborProvider theme="harbor-neutral-light">
      <Outlet />
    </HarborProvider>
  );
}
```

If your Remix setup already imports CSS directly, importing
`@infinibay/harbor/index.css` once from `app/root.tsx` is also fine.

## SSR And Package Contract

The package contract is intentionally tested from the consumer side:

- Every JavaScript `package.json` export publishes an ESM artifact from
  `dist`, a matching `.d.ts` type artifact, and a source pointer used by
  development tooling.
- Every importable subpath is imported through `@infinibay/harbor/...`.
- Core product patterns render with `react-dom/server`.
- Recipes render through `@infinibay/harbor/recipes`.
- Every built-in theme preset renders during SSR.
- Every `target x density` adaptive matrix entry renders during SSR.

Build the publishable package from the Harbor package before packing or
publishing:

```bash
npm run build:package
```

The package build writes ESM, declaration files, source maps, CSS assets and
the Tailwind preset into `dist/`. The app/dev build remains separate.

Run the smoke gate from the Harbor package:

```bash
npm run test:package
```

This builds `dist`, imports every JavaScript subpath through the package export
map with Node's normal ESM resolver, SSR-renders core product patterns, and then
runs the Vitest consumer/export checks. It catches broken export maps,
server-import regressions, missing public barrels, and source-only behavior
before release.

## Product Starting Points

For full application surfaces, start with the workflow-level exports:

```tsx
import { AdminCrudRecipe } from "@infinibay/harbor/recipes";
import { ProductShell } from "@infinibay/harbor/layout";
import { DataWorkspace } from "@infinibay/harbor/data";
import { PromptComposer, AgentTimeline } from "@infinibay/harbor/dev";
```

Use recipes as copyable starting points, then own the code in your app.
Harbor's lower-level components remain available when a workflow needs
custom behavior.
