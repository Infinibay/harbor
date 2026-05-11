# Tag

`Tag` renders a compact labelled token with optional icon and optional remove action. Use it for selected filters, labels, technologies, file metadata, people groups, environment names, and short attributes attached to a larger object.

The component includes Harbor's subtle proximity glow and Framer Motion entrance/exit layout animation, which makes filter chips and tag lists feel responsive when items are added or removed.

## Import

```tsx
import { Tag } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<div className="flex flex-wrap gap-2">
  <Tag icon={<CodeIcon />}>react</Tag>
  <Tag>typescript</Tag>
  <Tag onRemove={() => removeTag("vite")}>vite</Tag>
</div>
```

For selected filters:

```tsx
{filters.map((filter) => (
  <Tag key={filter.id} onRemove={() => clearFilter(filter.id)}>
    {filter.label}
  </Tag>
))}
```

## Props

- **children** - required `ReactNode`. The visible tag label.
- **onRemove** - optional callback. When provided, Harbor renders a small remove button.
- **icon** - optional `ReactNode` rendered before the label.
- **className** - optional string merged onto the tag root.

## Interaction Model

`Tag` itself is a non-interactive token. Only the remove affordance becomes interactive when `onRemove` is provided. If the whole token should be selectable, use a button, checkbox, segmented control, or filter component instead of turning the tag into a hidden button.

When used with animation libraries such as `AnimatePresence`, the tag's layout animation helps lists settle smoothly after removal.

## Accessibility

The remove button currently renders an `x` glyph without a custom label. When a tag is removable and the action matters, prefer wrapping with a labelled control pattern or consider extending the component with an item-specific remove label before using it heavily in production forms.

The visible text should carry the meaning. Icons are useful for scanning but should not be the only distinction between tags.

## Gotchas

- Keep tag labels short. Long values should use a tooltip, details panel, or table cell.
- Do not use tags as primary navigation.
- Removable tags need clear state ownership in the parent list.
- If many tags are interactive, keyboard navigation can become noisy. Consider a filter panel or multi-select.

## Related

- `Badge` for semantic status labels.
- `TagInput` for user-created tag lists.
- `MultiSelect` for selecting many options.
- `FilterBar` and `FilterPanel` for richer filtering workflows.
