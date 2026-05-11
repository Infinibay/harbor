# CronBuilder

`CronBuilder` is a visual editor for five-field POSIX cron expressions. It gives
users presets, per-field controls, a live expression readout, and an approximate
"next runs" preview while keeping your application in control of the final cron
string.

Use it when the product asks users to schedule backups, reports, sync jobs,
deploy windows, reminders, or maintenance tasks. It is intentionally narrower
than a full cron parser: Harbor optimizes for the common schedules users can
understand and review safely.

## Import

```tsx
import { CronBuilder } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
const [schedule, setSchedule] = useState("0 9 * * 1");

<CronBuilder value={schedule} onChange={setSchedule} />;
```

Use the controlled value as the single source of truth. Persist it to your form,
API, or job configuration the same way you would persist any other input.

## Props

- **value** - `string`. Required. A five-field cron expression:
  `minute hour day-of-month month day-of-week`.
- **onChange** - `(next: string) => void`. Required. Fires whenever the user
  changes a preset or field control.
- **hidePresets** - `boolean`. Removes the preset chip row when the surrounding
  product already provides templates. Default `false`.
- **className** - extra classes on the wrapper.

## Supported Syntax

Each field supports:

- `*` for any value.
- `*/N` for every N units.
- comma-separated numeric lists such as `1,15,30`.

Unsupported or invalid field values fall back to `*` while the UI parses them.
The current component does not support ranges like `1-5`, names like `MON` or
`JAN`, step ranges like `1-20/2`, seconds, years, or Quartz-specific syntax.

## Presets And Preview

Built-in presets cover the schedules most users expect: every minute, every 5
minutes, every 15 minutes, hourly, daily at 3 AM, weekly on Monday at 9 AM, and
monthly on the first day at midnight.

The "next runs" panel is a preview, not a scheduler. Harbor walks forward minute
by minute for up to seven days and shows matching times. Expressions that fire
less often than once a week may show fewer rows or no preview even if a backend
cron engine would eventually run them.

## Accessibility

The builder uses normal form controls, so labels and keyboard navigation remain
available. Keep a plain cron string visible near the controls so technical users
can verify the generated schedule before saving.

Scheduling is high-impact UI. Pair this component with a clear timezone label
from your application, confirmation copy for destructive jobs, and server-side
validation before accepting the cron string.

## Gotchas

- `CronBuilder` is five-field POSIX only. Do not pass six-field Quartz
  expressions with seconds.
- The next-run preview is approximate and limited to seven days.
- Invalid incoming values are made editable by falling back to broad `*` fields;
  validate on submit if your backend accepts a stricter syntax.
- The component does not choose a timezone. Your app should display and persist
  the timezone policy explicitly.

## Related

- `DatePicker` for one-time dates.
- `TimeRangePicker` for bounded windows.
- `FieldSet` and `Form` for schedule configuration forms.
- `Alert` for warnings before saving destructive recurring jobs.
