# Switch

`Switch` is Harbor's animated on/off control for settings that take effect as a
binary state. It wraps a native checkbox input with a pill track, moving knob,
optional label, and optional description.

Use it for preferences, feature toggles, notification settings, sync settings,
and immediate on/off choices. For independent form selections, use `Checkbox`.

## Import

```tsx
import { Switch } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
const [enabled, setEnabled] = useState(false);

<Switch
  label="Email notifications"
  description="Receive a digest every Monday."
  checked={enabled}
  onChange={(event) => setEnabled(event.target.checked)}
/>;
```

Uncontrolled mode is also supported:

```tsx
<Switch defaultChecked label="Auto-save drafts" />
```

## Props

`Switch` accepts standard checkbox input props except `type` and `size`, plus:

- **label** - `string`. Optional visible label.
- **description** - `string`. Optional helper text.
- **size** - `"sm" | "md"`. Default `"md"`.
- **checked** - `boolean`. Controlled state.
- **defaultChecked** - `boolean`. Initial uncontrolled state.
- **onChange** - `ChangeEventHandler<HTMLInputElement>`.
- **id** - `string`. Optional input id. Generated when omitted.
- **className** - extra classes on the outer label.

## Behavior

In controlled mode, `checked` drives the visual state. In uncontrolled mode,
Harbor stores internal state so the track and knob move when the native input
changes.

The track uses Harbor's animated gradient when on, a muted track when off, and a
subtle cursor-proximity glow.

## Accessibility

The native checkbox input remains in the DOM, so keyboard toggle, labels,
disabled behavior, and form submission work normally. Use a clear `label` that
describes the setting, and use `description` for consequences or cadence.

Avoid switching state unexpectedly on page load. If changing the switch triggers
network work, show saving or error state nearby.

## Gotchas

- A switch communicates immediate on/off state. Do not use it for multi-select
  lists.
- In controlled mode, the parent must update `checked` in response to
  `onChange`.
- The component does not persist settings or handle optimistic rollback.

## Related

- `Checkbox` for independent form selections.
- `ToggleButton` for toolbar modes.
- `FormField` and `FormSection` for settings forms.
- `StatusBar` for compact saved/sync state.
