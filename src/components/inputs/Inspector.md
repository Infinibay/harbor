# Inspector

A collapsible property panel — the After Effects / Figma right-rail
pattern. Each section has a title (with optional icon), animates
open/closed, and contains arbitrary children. Pair with the
`PropertyRow` and `InspectorNumber` helpers for compact label + control
rows that match the inspector's visual scale.

## Import

```tsx
import {
  Inspector,
  PropertyRow,
  InspectorNumber,
} from "@infinibay/harbor/inputs";
```

## Example

```tsx
<Inspector
  sections={[
    {
      id: "transform",
      title: "Transform",
      children: (
        <>
          <PropertyRow label="X">
            <InspectorNumber value={x} onChange={setX} unit="px" />
          </PropertyRow>
          <PropertyRow label="Y">
            <InspectorNumber value={y} onChange={setY} unit="px" />
          </PropertyRow>
        </>
      ),
    },
    {
      id: "appearance",
      title: "Appearance",
      collapsed: true,
      children: <PropertyRow label="Opacity"><Slider /></PropertyRow>,
    },
  ]}
/>
```

## Props (`<Inspector>`)

- **sections** — `InspectorSection[]`. Each section is
  `{ id, title, icon?, collapsed?, children }`.
- **className** — extra classes on the outer card.

## Props (`<PropertyRow>`)

- **label** — `ReactNode`. Left column.
- **children** — `ReactNode`. Right column (control).
- **className** — extra classes.

The row is a 90px label column + flexible control column, sized for
inspector density (12px text).

## Props (`<InspectorNumber>`)

- **value** — `number`. Controlled value.
- **onChange** — `(v: number) => void`.
- **min** / **max** — `number`. Clamp range.
- **step** — `number`. Default `1`.
- **unit** — `string`. Suffix shown after the input (e.g. `"px"`,
  `"%"`).

## Notes

- Section open/closed state is internal — pass `collapsed: true` on
  a section to make it default-collapsed.
- The chevron rotates with a spring; the body height animates on
  open/close.
