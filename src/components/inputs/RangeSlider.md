# RangeSlider

`RangeSlider` captures a numeric interval with two draggable thumbs. Use it for price ranges, duration windows, utilization filters, confidence thresholds, date offsets, zoom limits, and any bounded numeric pair where users adjust both lower and upper values.

It is optimized for pointer interaction and compact filtering UI.

## Import

```tsx
import { RangeSlider } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
import { useState } from "react";
import { RangeSlider } from "@infinibay/harbor/inputs";

export function PriceRange() {
  const [range, setRange] = useState<[number, number]>([25, 75]);

  return (
    <RangeSlider
      label="Price range"
      value={range}
      onChange={setRange}
      min={0}
      max={100}
      step={5}
    />
  );
}
```

## Props

- **value** - `[number, number]`. Controlled lower and upper values.
- **defaultValue** - `[number, number]`. Uncontrolled initial value. Default `[20, 80]`.
- **onChange** - `(value: [number, number]) => void`. Called during pointer updates.
- **min** - `number`. Minimum value. Default `0`.
- **max** - `number`. Maximum value. Default `100`.
- **step** - `number`. Rounding increment. Default `1`.
- **label** - `string`. Optional label above the slider.
- **showValue** - `boolean`. Shows current range text. Default `true`.
- **className** - extra classes on the wrapper.

## Behavior

Pointer down picks the closest thumb, captures the pointer, and updates that thumb as the user drags. The lower thumb cannot pass the upper value, and the upper thumb cannot pass the lower value. Values are clamped into `[min, max]` and rounded to the nearest `step`.

The selected segment animates between the two percentages. While dragging, the active thumb shows a small value tooltip.

## Accessibility

The current implementation is pointer-first and does not expose native range inputs, `role="slider"`, keyboard controls, or ARIA value attributes. For settings that must be fully keyboard accessible, provide paired numeric fields or extend the component with slider semantics.

## Gotchas

- `max` must be greater than `min`.
- `step` should be a positive number.
- Controlled mode requires updating `value` from `onChange`.
- The display uses raw numbers and does not format currency or units.

## Related

- `Slider` for a single numeric value.
- `NumberField` for precise keyboard entry.
- `FilterBar` for range filters inside data-heavy screens.
