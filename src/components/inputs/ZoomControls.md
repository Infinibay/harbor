# ZoomControls

Compact zoom widget — minus / current-percentage / plus, with a
hover-revealed preset menu (25%, 50%, 100%, 200%) and an optional
"Fit to view" entry. Pair with canvas / map / diagram surfaces; for
a continuous slider use `<Slider>` instead.

## Import

```tsx
import { ZoomControls } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [zoom, setZoom] = useState(100);

<ZoomControls
  value={zoom}
  onChange={setZoom}
  presets={[50, 100, 200, 400]}
  onFit={() => fitToContent()}
/>
```

## Props

- **value** — `number`. Required. Current zoom in percent.
- **onChange** — `(v: number) => void`. Required.
- **min** — `number`. Default `10`.
- **max** — `number`. Default `400`.
- **step** — `number`. Default `10`. Used by the −/+ buttons.
- **presets** — `number[]`. Default `[25, 50, 100, 200]`.
- **onFit** — `() => void`. When set, adds a "Fit to view" entry at
  the bottom of the preset menu.
- **className** — extra classes on the wrapper.

## Notes

- Values are percentages (e.g. `100` = 100%), not multipliers — pass
  raw integers, not `1.0`.
- The −/+ buttons clamp to `[min, max]`; presets are not clamped
  (caller is expected to pass sane numbers).
- The preset menu is CSS-hover only — there is no click-to-toggle.
