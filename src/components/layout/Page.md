# Page

Common page chrome: a centered `<Container>` plus a vertical
`<ResponsiveStack>` for sections, in one component. Replaces the
recurring `Container > ResponsiveStack` pair you'd otherwise hand-roll
on every route. Reach for `<Container>` directly when you need to
control the inner layout yourself.

## Import

```tsx
import { Page } from "@infinibay/harbor/layout";
```

## Example

```tsx
<Page size="xl" gap="lg">
  <PageHeader title="Dashboard" />
  <StatsRow />
  <RecentActivity />
</Page>
```

## Props

- **children** — `ReactNode`. Required. Each top-level child becomes
  a stacked section.
- **size** — `"sm" | "md" | "lg" | "xl" | "2xl" | "prose" | "full"`.
  Max-width preset, forwarded to `<Container size>`. Default `"xl"`.
- **gap** — `"none" | "sm" | "md" | "lg" | "xl"`. Vertical gap between
  direct children. Default `"lg"`.
- **padded** — `boolean`. Forwarded to `<Container padded>`. Default
  `true`.
- **className** — extra classes on the container.

## Notes

- Adds `py-6 md:py-8` automatically, so you don't have to remember
  vertical breathing room.
- The `gap` scale maps to `ResponsiveStack` numeric gaps (sm=3, md=5,
  lg=6, xl=8).
