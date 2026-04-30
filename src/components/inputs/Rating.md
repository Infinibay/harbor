# Rating

Star-rating input — used for reviews, satisfaction prompts, or
read-only display of an aggregate score. Supports half-stars and a
non-interactive read-only mode.

## Import

```tsx
import { Rating } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [score, setScore] = useState(4);

<Rating value={score} onChange={setScore} max={5} />
<Rating value={3.5} max={5} allowHalf readOnly />
```

## Props

- **value** — `number`. Default `0`. Current rating (0..max).
- **onChange** — `(v: number) => void`. Fires when the user picks a star.
- **max** — `number`. Default `5`. Total stars rendered.
- **size** — `number`. Default `22`. Star icon size in px.
- **readOnly** — `boolean`. Disables hover/click; renders dimmer empty
  state.
- **allowHalf** — `boolean`. Renders half-fills when the displayed
  value falls between two integers (purely visual — `onChange` still
  emits whole numbers via clicks).
- **className** — extra classes on the wrapper.

## Notes

- Hovering previews the prospective rating; mouse-leave reverts to
  the committed `value`.
- Each star is a `motion.button` that scales/lifts on hover and dips
  on tap.
