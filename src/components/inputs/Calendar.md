# Calendar

A standalone month-view date grid with a sliding month transition and
a spring-animated selection ring. Use `<Calendar>` when you want the
grid inline (settings panels, scheduling sidebars); use
`<DatePicker>` when you want the same grid inside a dropdown anchored
to a button.

## Import

```tsx
import { Calendar } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [date, setDate] = useState<Date>();

<Calendar
  value={date}
  onChange={setDate}
  min={new Date(2025, 0, 1)}
  max={new Date(2026, 11, 31)}
/>
```

## Props

- **value** — `Date | undefined`. Currently selected day.
- **onChange** — `(d: Date) => void`. Fires when the user clicks a
  day cell.
- **min** — `Date`. Days before this are disabled.
- **max** — `Date`. Days after this are disabled.
- **className** — extra classes on the outer card.

## Notes

- The grid is Monday-first regardless of locale — change in the
  source if you need Sunday-first.
- The selection ring uses `layoutId` keyed by a per-instance `useId`
  so two calendars on the same page don't share the animated ring.
- Today is rendered with a small fuchsia dot beneath the date number
  when it isn't the selected day.
