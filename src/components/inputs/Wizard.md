# Wizard

Multi-step form container with a progress rail, animated content
swap, and async per-step validation. Each step declares its own
content and an optional `validate()` that can return `true` (proceed),
`false` (block with the default error message), or a `string` (block
with a custom message). Use this for setup flows that have a clear
linear order; for non-linear navigation use a `<Tabs>`-driven layout
instead.

## Import

```tsx
import { Wizard } from "@infinibay/harbor/inputs";
import type { WizardStep } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const steps: WizardStep[] = [
  {
    id: "name",
    label: "Name",
    description: "Pick a name for your project.",
    content: <TextField label="Project name" value={name} onChange={(e) => setName(e.target.value)} />,
    validate: () => name.trim().length > 0 || "Name is required.",
  },
  {
    id: "region",
    label: "Region",
    content: <RegionPicker value={region} onChange={setRegion} />,
  },
  {
    id: "review",
    label: "Review",
    content: <ReviewSummary name={name} region={region} />,
  },
];

<Wizard steps={steps} onComplete={() => createProject({ name, region })} />;
```

## Props

- **steps** — `WizardStep[]`. Required. Each step:
  - **id** — `string`. Stable key, also drives the content-swap
    animation.
  - **label** — `string`. Title shown in the rail and step body.
  - **description** — `string`. Optional sub-caption above the content.
  - **content** — `ReactNode`. Body for the step.
  - **validate** — `() => true | false | string | Promise<…>`. Async
    is supported.
- **onComplete** — `() => void`. Fires when the user clicks Finish on
  the last step and validation passes.
- **className** — extra classes on the outer container.

## Notes

- Steps are gated forward — users can click a previous step in the
  rail to jump back, but cannot skip ahead.
- Validation can be async (e.g. server-side uniqueness check); the
  Next button awaits the promise before advancing.
- Labels are pulled from `useT()`: `harbor.action.back`,
  `harbor.action.next`, `harbor.action.finish`,
  `harbor.wizard.stepOfN`, `harbor.wizard.defaultError`.
- The component is fully uncontrolled — there is no `currentStep`
  prop. If you need external control, drive it by remounting the
  wizard with a different `key`.
