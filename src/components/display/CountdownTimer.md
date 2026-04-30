# CountdownTimer

Live countdown to a target date, with flip-style digit transitions.
Days are hidden in compact mode until they reach 1.

## Import

```tsx
import { CountdownTimer } from "@infinibay/harbor/display";
```

## Example

```tsx
<CountdownTimer
  target={Date.now() + 60 * 60 * 1000}
  onComplete={() => toast("Time's up")}
/>

<CountdownTimer target={launchAt} compact />
```

## Props

- **target** — `Date | number`. Required. Timestamp ms or Date.
- **onComplete** — `() => void`. Fires when remaining time reaches `0`.
- **compact** — `boolean`. Hide the days segment when 0.
- **className** — extra classes on the wrapper.

## Notes

- The component re-renders on a 1s interval — pause it server-side by
  not mounting it during SSR if you care about hydration.
- Target in the past renders all zeros and fires `onComplete`.
