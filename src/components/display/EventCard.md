# EventCard

`EventCard` displays a dated event with title, time, location, description,
attendee count, and an optional RSVP action. It is designed for product
announcements, webinars, team calendars, launch events, community sessions, and
customer education surfaces.

The component gives the date strong visual weight while keeping the event body
compact enough for lists and dashboards.

## Import

```tsx
import { EventCard } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
const [attending, setAttending] = useState(false);

<EventCard
  date="2026-06-18T10:00:00-03:00"
  title="Harbor v1 launch session"
  time="10:00 AM"
  location="Online"
  description="Live walkthrough of app shells, data components, and theming."
  attendees={128}
  attending={attending}
  onToggleAttending={() => setAttending((value) => !value)}
/>;
```

Use it in a list when the user is deciding which session to join:

```tsx
events.map((event) => (
  <EventCard
    key={event.id}
    date={event.startsAt}
    title={event.title}
    time={event.timeLabel}
    location={event.locationLabel}
    attendees={event.attendeeCount}
  />
));
```

## Props

- **date** - `Date | string`. Required. Parsed and displayed as month, day, and
  weekday.
- **title** - `ReactNode`. Required. Main event title.
- **time** - `ReactNode`. Optional time label.
- **location** - `ReactNode`. Optional location label.
- **description** - `ReactNode`. Optional summary, clamped to two lines.
- **attendees** - `number`. Optional attendee count.
- **attending** - `boolean`. Controls the RSVP visual state.
- **onToggleAttending** - `() => void`. Adds an RSVP button and fires when it is
  clicked.
- **className** - extra classes on the card.

## Behavior

`date` is parsed with JavaScript `Date`, then formatted using the user's locale
for the month and weekday labels. The card does not manage RSVP state internally;
pass `attending` and update it from `onToggleAttending`.

When `onToggleAttending` is omitted, the card becomes read-only and no RSVP
button is rendered.

## Accessibility

The title and metadata render as text, and the RSVP control is a real button.
Use clear event titles and avoid relying on the date tile alone; include time and
timezone in adjacent text when attendance depends on it.

For remote events, make the location label meaningful, such as `Online - Zoom`
or `Customer portal`, instead of only `Online`.

## Gotchas

- String dates are interpreted by the browser. Prefer ISO strings with timezone
  offsets or pass a `Date` object from already-normalized data.
- `attending` is controlled. If you pass it without updating it in
  `onToggleAttending`, the button will not appear to change.
- The description is visually clamped to two lines. Put critical details in a
  detail page, drawer, or expanded event view.

## Related

- `Calendar` for date selection.
- `ActivityFeed` for chronological product events.
- `Card` for custom event layouts.
- `Badge` for event type or status.
