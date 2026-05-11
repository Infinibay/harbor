# ContainerBox

`ContainerBox` declares a CSS container-query context around its children. It is
useful when a component should respond to the space it actually receives instead
of the viewport size.

Use it for cards inside grids, panels inside split panes, dashboard widgets,
drawers, modals, and reusable components that can appear in narrow and wide
containers on the same page.

## Import

```tsx
import { ContainerBox } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<style>{`
  @container project-card (min-width: 480px) {
    .project-card-body {
      grid-template-columns: 1fr auto;
    }
  }
`}</style>

<ContainerBox name="project-card">
  <div className="project-card-body grid gap-3">
    <ProjectSummary />
    <ProjectActions />
  </div>
</ContainerBox>
```

The query reacts to the `ContainerBox` width, not the browser viewport.

## Props

- **children** - `ReactNode`. Required.
- **name** - `string`. Optional CSS container name for named `@container`
  queries.
- **type** - `"inline-size" | "size" | "normal"`. CSS `container-type`. Default
  `"inline-size"`.
- **className** - extra classes on the wrapper.
- **style** - inline styles merged with the container styles.

## Container Query Model

`ContainerBox` renders a normal `div` with:

```tsx
style={{
  containerType: type,
  containerName: name,
}}
```

Use `inline-size` for most responsive components because it tracks horizontal
space. Use `size` when both width and height matter. Use `normal` to keep the
wrapper but disable query containment.

## Accessibility

Container queries are visual layout behavior. They do not change semantics. Make
sure the content order remains logical at every container width, especially when
actions move beside or below content.

Do not hide essential labels only because a card is narrow. Prefer denser labels
or menus when space is constrained.

## Gotchas

- `ContainerBox` does not generate CSS rules. You still need stylesheet,
  Tailwind, or inline style rules that use `@container`.
- Container queries need browser support from the runtime environment.
- Named queries require the same `name` in `ContainerBox` and the CSS rule.
- For JavaScript measurements, use `useContainerSize` or `useContainerAbove`
  instead.

## Related

- `ResponsiveGrid` for viewport-driven grids.
- `ResponsiveStack` for layout direction changes.
- `ReflowList` for wrapping rows with animation.
- `Container` for page width constraints.
