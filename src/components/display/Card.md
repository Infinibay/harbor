# Card

`Card` is Harbor's general framed surface for repeated items, settings modules,
summary panels, inspectors, and compact product sections. It supports variants,
interactive lift, optional tilt, cursor spotlight, glow, selected and disabled
states, header/footer slots, and leading icons.

Use it for actual content containers. Avoid stacking cards inside cards unless a
repeated item genuinely needs its own frame.

## Import

```tsx
import { Card, CardGrid } from "@infinibay/harbor/display";
```

## Basic Usage

Use title and description for compact summaries.

```tsx
<Card
  title="Production"
  description="Current deploy target"
  leadingIcon={<RocketIcon />}
  footer={<Button size="sm">Open</Button>}
>
  <MetricCard label="Requests" value="24.8k" />
</Card>
```

## Variants And States

Choose `default`, `glass`, or `solid`. Add `interactive` for clickable cards and
`selected` for active cards.

```tsx
<Card variant="solid" interactive selected={project.id === activeId} onClick={() => setActiveId(project.id)}>
  {project.name}
</Card>
```

## CardGrid

`CardGrid` gives repeated cards a consistent responsive layout.

```tsx
<CardGrid cols={3}>
  {projects.map((project) => (
    <Card key={project.id} title={project.name} />
  ))}
</CardGrid>
```

## Props

- `variant`: `default`, `glass`, or `solid`.
- `interactive`: hover lift and pointer cursor.
- `tilt`: pointer-based 3D tilt.
- `spotlight`: cursor-following highlight.
- `spotlightStrength`: `quiet`, `soft`, or `strong`.
- `glow`, `selected`, `disabled`, `fullHeight`: visual states.
- `title`, `description`, `header`, `footer`, `leadingIcon`: content slots.
- `leadingIconTone`: icon tile tone.
- Standard `div` attributes, including `onClick` and `className`.

## Accessibility

Cards are containers by default. If the whole card is clickable, make the action
obvious and avoid placing conflicting buttons inside the same click target. For
critical actions, prefer an explicit `Button` in the footer.

Do not rely on glow, tilt, or spotlight to communicate state. Use visible text,
badges, or selected details.

## Gotchas

`tilt` wraps the card in a perspective container. Test layout when using it in
tight grids.

`disabled` suppresses pointer interaction and reduces opacity, but parent state
still owns the actual business rule.

## Related

- `CardGrid` for repeated cards.
- `IconTile` for leading icon visuals.
- `MetricCard` for metric-specific cards.
- `Section` for page-level grouping without card framing.
