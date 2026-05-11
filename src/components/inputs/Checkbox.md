# Checkbox

`Checkbox` is Harbor's animated checkbox control for boolean form values. It
wraps a native checkbox input with a custom visual square, optional label, and
optional description while preserving standard input props.

Use it for independent choices, consent checkboxes, table row options, settings,
and form booleans where multiple options may be selected.

## Import

```tsx
import { Checkbox } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
const [weeklyDigest, setWeeklyDigest] = useState(false);

<Checkbox
  label="Email me a weekly digest"
  description="Sent every Monday at 9am UTC."
  checked={weeklyDigest}
  onChange={(event) => setWeeklyDigest(event.target.checked)}
/>;
```

Uncontrolled usage works for simple native forms:

```tsx
<Checkbox name="terms" defaultChecked label="I accept the terms" />
```

## Props

`Checkbox` accepts standard checkbox input props except `type` and `size`, plus:

- **label** - `string`. Optional visible label.
- **description** - `string`. Optional helper text below the label.
- **checked** - `boolean`. Controlled checked state.
- **defaultChecked** - `boolean`. Initial uncontrolled checked state.
- **onChange** - `ChangeEventHandler<HTMLInputElement>`. Fires from the native
  input.
- **id** - `string`. Optional input id. Generated automatically when omitted.
- **className** - extra classes on the outer label.

## Behavior

The actual input is visually hidden with `sr-only`; the custom square reflects
the checked state with animated background, border, and checkmark. The outer
label is clickable, so clicking the text toggles the input.

Focus styling is driven by the hidden input's `focus-visible` state.

## Accessibility

Because the native checkbox remains in the DOM, browser form behavior, keyboard
toggle, disabled state, and labels work normally. Provide a visible `label` in
most forms. Use `description` for constraints or consequences, not repeated
label text.

For mutually exclusive choices, use radio buttons or segmented controls instead.

## Gotchas

- In controlled mode, the parent must update `checked` from `onChange`.
- The current visual check state follows the `checked` prop. If you use only
  `defaultChecked`, the native input changes but the custom animation may not
  reflect subsequent uncontrolled changes in every case.
- This component is for boolean form values. Use `Switch` for settings that feel
  like immediate on/off toggles.

## Related

- `Switch` for immediate settings toggles.
- `ToggleButton` for toolbar modes.
- `FormField` and `FieldSet` for form layout.
- `MultiSelect` for choosing several options from a list.
