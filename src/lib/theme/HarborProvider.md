# HarborProvider

`HarborProvider` is the top-level theme and target provider for Harbor.
Use it once near the root of an app to register themes, activate dark or
light mode, and scope adaptive component tokens for the product target.

## Import

```tsx
import { HarborProvider } from "@infinibay/harbor/theme";
```

## Target

`target` changes density, spacing, radius, shadows, menu sizing, input
height, tab height, toolbar height, and other adaptive CSS variables used
by Harbor components.

```tsx
<HarborProvider target="desktop-app" density="compact">
  <App />
</HarborProvider>
```

Available targets:

- `desktop-app`
- `webapp`
- `website`
- `mobile`
- `tablet`

Available densities:

- `compact`
- `comfortable`
- `spacious`

## Examples

```tsx
<HarborProvider target="desktop-app" density="compact">
  <DesktopShell />
</HarborProvider>

<HarborProvider target="webapp" density="comfortable">
  <Dashboard />
</HarborProvider>

<HarborProvider target="website" density="spacious">
  <MarketingSite />
</HarborProvider>
```

## Token Overrides

Use `adaptiveTokens` when a product needs a local adjustment without
forking components.

```tsx
<HarborProvider
  target="desktop-app"
  density="compact"
  adaptiveTokens={{
    radius: "4px",
    controlHeight: "30px",
    panelPadding: "10px",
  }}
>
  <App />
</HarborProvider>
```
