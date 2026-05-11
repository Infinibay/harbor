# Wizard

`Wizard` guides users through a short, ordered flow with a step rail, animated
step body, validation, Back/Next controls, and completion callback. It is useful
for setup flows, account security, deployment creation, imports, checkout, and
configuration tasks that should not be shown as one overwhelming form.

Use it for linear flows. Use `Tabs` when steps can be visited in any order.

## Import

```tsx
import { Wizard } from "@infinibay/harbor/inputs";
```

## Basic Usage

Each step owns its content and optional validation.

```tsx
<Wizard
  steps={[
    {
      id: "project",
      label: "Project",
      description: "Choose where this deployment belongs.",
      content: <ProjectPicker />,
    },
    {
      id: "review",
      label: "Review",
      content: <DeploymentSummary />,
      validate: () => isValid || "Fix the highlighted fields before continuing.",
    },
  ]}
  onComplete={() => createDeployment()}
/>
```

## Validation

`validate` can be synchronous or async. Return `true` to continue, `false` for
the default error, or a string for a custom error.

```tsx
validate={async () => {
  const result = await api.validateConfig(config);
  return result.ok || result.message;
}}
```

## Step Navigation

Completed steps can be clicked to go back. Future steps are disabled until the
user progresses.

## Props

- `steps`: required ordered step definitions.
- `onComplete`: called after the last step validates.
- `className`: wrapper class override.

Each step includes `id`, `label`, optional `description`, `content`, and optional
`validate`.

## Accessibility

The current step is marked with `aria-current="step"`. Navigation controls are
real buttons and validation errors are visible text. Keep each step title clear
and avoid hiding required context in previous steps.

## Gotchas

Step content unmounts as the user advances. Store important form state in the
parent, not inside ephemeral step components.

The wizard does not persist progress. Save progress in your app if the flow can
be interrupted.

## Related

- `MFASetup` uses Wizard for security setup.
- `Form` and `FormField` for fields inside steps.
- `ContentSwap` for the animated step body.
- `Stepper` for status-only step displays.
