# Radio

`RadioGroup` and `Radio` render a controlled single-choice field. The group owns the shared
value, name, orientation, and change handler. Each `Radio` describes one option with a label,
optional description, and disabled state.

Use radio groups when all choices should be visible and the user must choose exactly one:
billing interval, deploy strategy, notification level, privacy mode, export format, or role
template. For long lists or search-heavy choices, use `Select` or `Combobox`.

## Import

```tsx
import { RadioGroup, Radio } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
const [strategy, setStrategy] = useState("rolling");

<RadioGroup value={strategy} onChange={setStrategy} name="deploy-strategy">
  <Radio value="rolling" label="Rolling" description="Replace instances gradually." />
  <Radio value="blue-green" label="Blue-green" description="Cut traffic after verification." />
  <Radio value="manual" label="Manual approval" description="Wait for an operator." />
</RadioGroup>
```

## Selection Model

`RadioGroup` provides context to every child `Radio`. A `Radio` must be rendered inside a
group; otherwise the component throws to catch incorrect composition early. The checked state
is derived from `group.value === radio.value`, and selecting a radio calls `onChange` with its
value.

Pass `name` when multiple groups appear in the same form and you want a predictable native
radio name. When omitted, Harbor creates a stable React id for the group.

## Props

### RadioGroup

- **value** - selected value.
- **onChange** - `(value: string) => void`.
- **name** - optional native radio group name. Auto-generated when omitted.
- **orientation** - `"vertical" | "horizontal"`. Default `"vertical"`.
- **children** - `Radio` items.
- **className** - extra classes on the group wrapper.

### Radio

- **value** - option value.
- **label** - option label.
- **description** - optional secondary text.
- **disabled** - disables the native radio input and dims the option.
- **className** - extra classes on the option label.

## Accessibility

The group renders `role="radiogroup"` and each option contains a native radio input. The input
is visually hidden but still focusable through its label. Focus-visible styling appears on the
custom control.

Add an external field label or legend when the group appears in a form. The component does
not render a group label by itself, so the surrounding `FieldSet`, `FormField`, or page copy
should explain the question being answered.

## Gotchas

- `Radio` cannot be used outside `RadioGroup`.
- Radio groups should represent mutually exclusive options. For independent toggles, use
  `Checkbox` or `Switch`.
- Horizontal orientation wraps, but long descriptions can make rows uneven.
- Disabled radios are still visible so users understand unavailable choices; explain why in
  the description when the reason is not obvious.

## Related

- `Checkbox` for independent multi-choice.
- `Switch` for binary settings.
- `Select` and `Combobox` for longer option sets.
- `FieldSet` and `FormField` for labeled form structure.
