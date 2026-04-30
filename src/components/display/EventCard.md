# EventCard

Calendar-style event tile — date block on the left, title + meta on
the right, optional RSVP button. The date block auto-formats the day,
month, and weekday from `date`.

## Import

```tsx
import { EventCard } from "@infinibay/harbor/display";
```

## Example

```tsx
<EventCard
  date={new Date("2026-05-12T17:00:00Z")}
  title="Harbor v0.5 launch"
  time="10:00 AM"
  location="Online · Zoom"
  description="Live demo + Q&A on the new component playground."
  attendees={128}
  attending={false}
  onToggleAttending={() => toggle()}
/>
```

## Props

- **date** — `Date | string`. Required. Drives the day / month /
  weekday glyph in the left block.
- **title** — `ReactNode`. Required.
- **time** — `ReactNode`. Pre-formatted ("10:00 AM").
- **location** — `ReactNode`.
- **description** — `ReactNode`. Clamped to 2 lines.
- **attendees** — `number`. Renders "👥 N going".
- **attending** — `boolean`. Drives the RSVP button visual state.
- **onToggleAttending** — `() => void`. When set, renders the RSVP button.
- **className** — extra classes on the wrapper.

## Notes

- Locale-formatted month / weekday come from `Intl.DateTimeFormat`
  with the user's default locale.
- The RSVP button is only rendered when `onToggleAttending` is set.
