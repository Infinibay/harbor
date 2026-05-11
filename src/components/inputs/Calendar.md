# Calendar

`Calendar` renders a compact month grid for selecting a single date. It supports
controlled selection, previous/next month navigation, optional min/max bounds,
today indication, and animated selected-day movement.

Use it inside date pickers, scheduling forms, report filters, booking flows, and
admin tools where the user needs to choose one calendar day.

## Import

```tsx
import { Calendar } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
const [date, setDate] = useState<Date | undefined>();

<Calendar value={date} onChange={setDate} />;
```

With bounds:

```tsx
<Calendar
  value={deployDate}
  onChange={setDeployDate}
  min={new Date()}
  max={addDays(new Date(), 30)}
/>;
```

## Props

- **value** - `Date`. Selected date. When omitted, the calendar starts with no
  selected day.
- **onChange** - `(date: Date) => void`. Fires when the user selects an enabled
  day.
- **min** - `Date`. Dates before this are disabled.
- **max** - `Date`. Dates after this are disabled.
- **className** - extra classes on the calendar wrapper.

## Calendar Model

The visible month cursor starts at the selected date's month, or today's month
when no value is provided. The grid is Monday-first and always renders 42 cells,
including leading and trailing days from adjacent months.

Month navigation changes the visible cursor only. It does not select a date until
the user clicks a day.

## Accessibility

Each day is a native button and disabled dates use the disabled attribute. Keep a
visible field label around the calendar when it appears in a form, and show the
selected date as text near the trigger when used inside a popover.

The component does not currently implement full arrow-key calendar navigation.
If keyboard-first date selection is critical, wrap it with additional keyboard
behavior or use a dedicated date-picker flow.

## Gotchas

- This is the calendar grid, not a complete input with text parsing, popover
  trigger, or timezone policy.
- Date comparison uses JavaScript `Date` objects. Normalize min/max values to the
  intended local day before passing them.
- The selected value is controlled by the parent. If `onChange` does not update
  `value`, the selected ring will not move.

## Related

- `DatePicker` for a fuller picker flow.
- `TimeRangePicker` for date/time windows.
- `Popover` for trigger-plus-calendar composition.
- `FormField` for labeled date fields.
