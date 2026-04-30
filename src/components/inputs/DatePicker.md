# DatePicker

Anchor button + portal-popover wrapping a `<Calendar>`. Use when the
date input lives inside a form row; reach for `<Calendar>` directly
when you want the grid permanently inline. For ranges or
preset-relative pickers use `<TimeRangePicker>`.

## Import

```tsx
import { DatePicker } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [date, setDate] = useState<Date>();

<DatePicker
  label="Renewal date"
  value={date}
  onChange={setDate}
  placeholder="Pick a date"
/>
```

## Props

- **value** — `Date | undefined`. Currently selected date.
- **onChange** — `(d: Date) => void`. Fires when the user picks a
  day. The popover auto-closes on selection.
- **label** — `string`. Optional label above the anchor.
- **placeholder** — `string`. Default `"Pick a date"`.
- **className** — extra classes on the wrapper.

## Notes

- The anchor formats with the user's locale via
  `toLocaleDateString`.
- Popover position re-syncs on `scroll` (capture) and `resize`.
- `min` / `max` are not exposed on the anchor — wrap `<Calendar>`
  yourself if you need them.
