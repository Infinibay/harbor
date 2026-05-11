# Stepper

`Stepper` shows progress through a known sequence of steps. Use it for onboarding, checkout, setup flows, import wizards, deployment approvals, and any multi-step task where users need to know what is done, what is active, and what remains.

It is a status component, not a router. Your app owns navigation, validation, and step changes through the `current` index.

## Import

```tsx
import { Stepper } from "@infinibay/harbor/navigation";
```

## Basic Usage

```tsx
import { Stepper } from "@infinibay/harbor/navigation";

const steps = [
  { label: "Account", description: "Create your login" },
  { label: "Workspace", description: "Name your team" },
  { label: "Plan", description: "Choose billing" },
  { label: "Confirm", description: "Review and launch" },
];

export function SetupProgress({ current }: { current: number }) {
  return <Stepper steps={steps} current={current} />;
}
```

## Props

- **steps** - `Step[]`. Required ordered list.
- **current** - `number`. Zero-based active step index.
- **orientation** - `"horizontal" | "vertical"`. Default `"horizontal"`.
- **className** - extra classes on the root `<ol>`.

## Step Model

```ts
type Step = {
  label: string;
  description?: string;
};
```

The component computes state from index position. Steps before `current` are done, the step equal to `current` is active, and later steps are pending.

## Behavior

Horizontal mode renders compact dots with labels visible from the `md` breakpoint upward. Connectors animate as steps become complete. Vertical mode shows labels and descriptions beside each dot and draws a vertical connector between steps.

The active dot pulses. Completed dots show a check mark. Pending dots show their one-based step number.

## Accessibility

`Stepper` renders an ordered list, which communicates sequence. It does not expose `aria-current="step"` or interactive navigation behavior. If the stepper is also used as step navigation, wrap labels in real buttons or links in your own flow and add the appropriate ARIA state.

## Gotchas

- `current` is zero-based.
- Values outside the step range are not clamped.
- The component does not validate step completion.
- Horizontal labels are hidden on small screens.

## Related

- `Wizard` for a fuller multi-step flow.
- `Progress` for linear progress without named steps.
- `Breadcrumbs` for location hierarchy.
