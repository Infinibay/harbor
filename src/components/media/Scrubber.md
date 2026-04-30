# Scrubber

Audio / video playhead control with optional waveform, buffered ring,
chapter markers, and hover preview. Pure controlled — pass
`value` / `duration` and listen to `onSeek`.

## Import

```tsx
import { Scrubber, type ScrubberMarker } from "@infinibay/harbor/media";
```

## Example

```tsx
<Scrubber
  value={current}
  duration={240}
  buffered={120}
  onSeek={setCurrent}
  markers={[
    { time: 30,  label: "Intro" },
    { time: 95,  label: "Chapter 2", color: "rgba(56,189,248,0.85)" },
    { time: 180, label: "Outro" },
  ]}
  waveform={waveformBins}    /* optional: number[] of 0..1 bars */
/>
```

## ScrubberMarker

```ts
{ time: number; label?: string; color?: string }
```

## Props

- **value** — `number`. Required. Current playhead in seconds.
- **duration** — `number`. Required. Total duration in seconds.
- **onSeek** — `(t: number) => void`. Required. Fires on drag, on
  initial pointer-down, and on click.
- **buffered** — `number`. Buffered region end in seconds. Renders a
  faint progress fill behind the playhead.
- **markers** — `ScrubberMarker[]`. Vertical chapter ticks. `color`
  defaults to a fuchsia tint.
- **waveform** — `number[]`. When provided, the rail renders bars
  (0..1 each) instead of the linear track. Filled portion uses the
  fuchsia → sky gradient.
- **className** — extra classes on the wrapper.

## Notes

- Time labels under the rail use `m:ss` (e.g. `2:08`).
- Hover preview floats above the rail with the timestamp at the cursor
  position.
- Pointer capture lets the user drag past the edges; the value is
  clamped to `[0, duration]`.
