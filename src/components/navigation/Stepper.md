# Stepper

Linear progress indicator for multi-step flows (onboarding, checkout,
wizards). Renders numbered dots that fill in as the user advances, with
animated connectors between them. Horizontal labels hide on small
screens; switch to `vertical` for sidebars or longer flows where
descriptions matter.

## Import

```tsx
import { Stepper } from "@infinibay/harbor/navigation";
```

## Example

```tsx
const steps = [
  { label: "Account" },
  { label: "Workspace", description: "Pick a name and region" },
  { label: "Plan" },
  { label: "Confirm" },
];

<Stepper steps={steps} current={1} />
<Stepper steps={steps} current={1} orientation="vertical" />
```

## Props

- **steps** — `Step[]`. Required. Each step is
  `{ label, description? }`. `description` only renders in the vertical
  orientation.
- **current** — `number`. Required. Zero-based index of the active
  step. Steps with index `< current` render as completed (checkmark);
  the active dot pulses; later steps are dimmed.
- **orientation** — `"horizontal" | "vertical"`. Default `"horizontal"`.
- **className** — extra classes on the `<ol>`.

## Notes

- Connectors use a fuchsia-to-sky gradient that scales from left as
  steps complete (horizontal) or fills the rail color (vertical).
- The active dot has a looping ping effect; once a flow finishes, set
  `current` past the last index so every dot reads as done.
