# LiveMigrationIndicator

`source → destination` migration progress with a pulsing dashed arrow,
progress bar, and ETA. Pure SVG — drop one anywhere. For
deployment-style multi-stage pipelines use `<DeploymentPipeline>`.

## Import

```tsx
import { LiveMigrationIndicator } from "@infinibay/harbor/display";
```

## Example

```tsx
<LiveMigrationIndicator
  sourceHost="vm-prod-01"
  destHost="vm-prod-02"
  progress={0.62}
  etaMs={45_000}
  detail="memory copying… 1.2 GiB / 2.0 GiB"
/>
```

## Props

- **sourceHost** — `ReactNode`. Required. Right-aligned label on the left.
- **destHost** — `ReactNode`. Required. Left-aligned label on the right.
- **progress** — `number`. Required. `0..1` clamped.
- **etaMs** — `number`. Estimated remaining time in ms. When set, the
  component re-renders every 1s to keep the ETA fresh.
- **color** — `string`. Arrow + bar color. Default `"rgb(168 85 247)"`.
- **detail** — `ReactNode`. Small line under the progress bar.
- **className** — extra classes on the wrapper.

## Notes

- Tick interval (1s) only runs when `etaMs` is provided. To freeze the
  card, omit it and update `progress` from the parent.
- The arrow uses an SVG marker — `color` controls both the arrow head
  and the progress line.
