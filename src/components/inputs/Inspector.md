# Inspector

`Inspector` is the right-rail property panel pattern used by editors, canvas tools, admin builders, and design software. It groups compact controls into collapsible sections so users can inspect and edit the selected object without leaving the workspace.

Use it beside a `Canvas`, table detail panel, schema editor, or visual builder. The component supplies the section chrome; you provide the actual controls.

## Import

```tsx
import {
  Inspector,
  InspectorNumber,
  PropertyRow,
} from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
import { Inspector, InspectorNumber, PropertyRow } from "@infinibay/harbor/inputs";

export function NodeInspector({ node, updateNode }) {
  return (
    <Inspector
      sections={[
        {
          id: "transform",
          title: "Transform",
          children: (
            <>
              <PropertyRow label="X">
                <InspectorNumber
                  value={node.x}
                  onChange={(x) => updateNode({ x })}
                  unit="px"
                />
              </PropertyRow>
              <PropertyRow label="Y">
                <InspectorNumber
                  value={node.y}
                  onChange={(y) => updateNode({ y })}
                  unit="px"
                />
              </PropertyRow>
            </>
          ),
        },
        {
          id: "appearance",
          title: "Appearance",
          collapsed: true,
          children: <PropertyRow label="Opacity">100%</PropertyRow>,
        },
      ]}
    />
  );
}
```

## Composition Model

`Inspector` receives an array of sections. Each section owns an `id`, visible `title`, optional `icon`, optional default `collapsed` state, and arbitrary `children`.

`PropertyRow` gives you the common two-column row: a fixed 90px label column and a flexible control column. `InspectorNumber` is a compact numeric input with optional clamping and a unit suffix.

## Props

### Inspector

- **sections**: `InspectorSection[]`. Required. Each section is `{ id, title, icon?, collapsed?, children }`.
- **className**: custom class on the outer panel.

### PropertyRow

- **label**: `ReactNode`. Left-column label.
- **children**: `ReactNode`. Control or value rendered on the right.
- **className**: custom class on the row.

### InspectorNumber

- **value**: `number`. Controlled numeric value.
- **onChange**: `(v: number) => void`. Called with the parsed number.
- **min** / **max**: `number`. Optional clamp range.
- **step**: `number`. Native number-input step. Defaults to `1`.
- **unit**: `string`. Suffix such as `"px"`, `"%"`, or `"ms"`.

## Accessibility

Section headers are buttons and expose expanded state. Keep each control labelled through `PropertyRow` or through the control's own label. When the inspector edits a selected object, ensure the workspace also communicates what object is selected.

## Gotchas

- Section collapsed state is internal and initialized from `collapsed`. If the `sections` array changes later, the previous open/closed state is preserved by section id.
- `InspectorNumber` clamps on input change. If your model allows temporary invalid values, use your own text or number field.
- Keep inspectors narrow and dense. Long explanatory copy belongs in a drawer, docs panel, or help popover.

## Related

- [`Canvas`](../layout/Canvas.md) for editor workspaces.
- [`SplitPane`](../layout/SplitPane.md) for left/canvas/right layouts.
- [`FieldRow`](./FieldRow.md) for normal forms outside an inspector.
