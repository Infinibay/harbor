# Rating

`Rating` renders a star-based score input. Use it for feedback forms, satisfaction surveys, review flows, quality scoring, support ratings, content ratings, and read-only product metrics where a numeric score should be visually scannable.

The component can be controlled by `value` and `onChange`, or rendered read-only. It includes hover/tap motion and optional half-star display.

## Import

```tsx
import { Rating } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
const [score, setScore] = useState(3);

<Rating value={score} onChange={setScore} />
```

Read-only display:

```tsx
<Rating value={4.5} allowHalf readOnly />
```

## Props

- **value** - optional number. Defaults to `0`.
- **onChange** - optional callback `(value: number) => void`.
- **max** - optional number of stars. Defaults to `5`.
- **size** - optional star size in pixels. Defaults to `22`.
- **readOnly** - optional boolean. Disables interaction.
- **allowHalf** - optional boolean. Allows half-star display.
- **className** - optional string merged onto the root.

## Interaction Model

Hovering a star previews that whole-star value. Clicking a star calls `onChange` with the star index, starting at `1`. `readOnly` disables hover and click behavior.

`allowHalf` affects display for fractional `value` values, such as `3.5`. It does not currently add half-step pointer selection; user clicks still choose whole stars.

## State Guidance

Use controlled state for forms:

```tsx
<Rating
  value={form.rating}
  onChange={(rating) => setForm((draft) => ({ ...draft, rating }))}
/>
```

For review summaries, pass `readOnly` so users do not mistake the score for an input.

## Accessibility

The current implementation renders star buttons but does not add per-star accessible labels or radio semantics. For critical production forms, wrap it with a visible label and consider extending it with `aria-label`, `aria-pressed`, or a radio-group pattern.

Do not rely on star color alone. Show the numeric value nearby when precision matters.

## Gotchas

- `allowHalf` displays halves but does not let users click half values.
- No validation is built in.
- `max` values above `5` can become visually noisy.
- Read-only ratings should set `readOnly`, not just omit `onChange`.

## Related

- `FormField` for labelled form layout.
- `Slider` for continuous numeric input.
- `SegmentedControl` for small discrete choices.
- `MetricCard` for read-only score summaries.
