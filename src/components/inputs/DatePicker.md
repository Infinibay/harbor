# DatePicker

`DatePicker` lets users choose a single date from a Harbor calendar popover. Use it for billing dates, renewal dates, scheduling, due dates, maintenance windows, reports, filters, and settings where typing a date manually would be slower or more error-prone.

The picker is controlled: your app passes the selected `Date` through `value` and updates it in `onChange`.

## Import

```tsx
import { DatePicker } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
const [renewalDate, setRenewalDate] = useState<Date>();

<DatePicker
  label="Renewal date"
  value={renewalDate}
  onChange={setRenewalDate}
/>
```

With placeholder copy:

```tsx
<DatePicker
  label="Maintenance window"
  placeholder="Select start date"
  value={startsAt}
  onChange={setStartsAt}
/>
```

## Props

- **value** - optional `Date`. The currently selected date.
- **onChange** - optional callback `(date: Date) => void`.
- **label** - optional string rendered above the trigger.
- **placeholder** - optional string. Defaults to `"Pick a date"`.
- **className** - optional string merged onto the root container.

## Interaction Model

Clicking the trigger opens a calendar in a portal positioned under the button. Selecting a date calls `onChange` and closes the popover. Clicking outside also closes the popover. While open, the component listens for scroll and resize events to keep the popover aligned with the trigger.

The displayed value uses `toLocaleDateString` with year, long month, and day.

## State And Data

Store `Date` values deliberately. If the backend uses ISO strings, convert at the API boundary and be clear about timezone expectations. For date-only fields, avoid accidentally shifting days when serializing through UTC.

The current component does not expose min date, max date, disabled dates, ranges, or manual text entry. Build those constraints at the form level or extend the picker when the workflow requires them.

## Accessibility

Always provide a visible label or an equivalent surrounding form label. The trigger is a button, and the calendar handles date selection. For production scheduling flows, verify keyboard behavior in the full form and provide validation messages for unavailable dates.

## Gotchas

- The component does not validate business rules like "must be after today."
- `onChange` is optional, but without it selection will not persist in controlled usage.
- Locale formatting comes from the user's environment.
- Use a dedicated date range picker for start/end workflows rather than two ambiguous standalone pickers without labels.

## Related

- `Calendar` for inline date selection.
- `TimeRangePicker` for time window filters.
- `FormField` and `FieldRow` for labelled form layout.
- `Select` for fixed date presets.
