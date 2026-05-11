# Scrubber

`Scrubber` is a controlled media timeline for seeking through audio, video, or recorded
sessions. It can show elapsed time, total duration, buffered range, timeline markers, hover
time, and an optional waveform.

Use it in players, voice-note UIs, screen recordings, podcast tools, support-session replay,
and timeline editors where dragging to a time is the primary interaction.

## Import

```tsx
import { Scrubber } from "@infinibay/harbor/media";
```

## Basic Usage

```tsx
<Scrubber
  value={currentTime}
  duration={duration}
  buffered={bufferedUntil}
  onSeek={(time) => player.seek(time)}
  markers={[
    { time: 42, label: "Error begins" },
    { time: 91, label: "Deploy completed", color: "#34d399" },
  ]}
/>
```

## Timeline Model

`value`, `duration`, and `buffered` are all measured in seconds. Harbor converts pointer
position into a time and calls `onSeek`. While the pointer hovers, the component shows a
formatted time tooltip. While dragging, it continuously calls `onSeek`.

When `waveform` is provided, each value becomes one vertical bar. Played bars receive Harbor's
gradient, and unplayed bars use a muted surface. Without `waveform`, the component renders a
classic progress track with buffered and played layers.

## Props

- **value** - current time in seconds.
- **duration** - total duration in seconds.
- **onSeek** - `(time: number) => void`.
- **buffered** - buffered time in seconds.
- **markers** - `{ time, label?, color? }[]`.
- **waveform** - `number[]` values used as bar heights.
- **className** - extra classes on the wrapper.

## Accessibility

The current implementation is pointer-first and does not expose a native range input or
keyboard controls. If media seeking is required for keyboard users, provide adjacent skip
buttons or wrap the scrubber in a higher-level player control set with accessible shortcuts.

Markers use `title` for hover labels. Treat those as supplemental; important chapters or
incidents should also be listed outside the scrubber.

## Gotchas

- `duration` should be greater than zero. A zero duration produces invalid percentages.
- `onSeek` can fire many times during drag. Debounce expensive work and keep media APIs fast.
- Waveform values are expected to be normalized-ish numbers. Very large values can create
  awkward bar heights.
- Markers are visual only. They do not create clickable chapter navigation by themselves.

## Related

- `Carousel` and `Lightbox` for media browsing.
- `Timeline` for event history rather than media time.
- `Slider` for generic numeric ranges.
- `Timestamp` for formatted time labels.
