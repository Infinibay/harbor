# Accordion

Vertical stack of collapsible panels. Use for FAQs, settings groups, or
any cluster of related sections where only some need to be open at
once. Compose with `<AccordionItem>` children; flip `multiple` to allow
several open simultaneously.

## Import

```tsx
import { Accordion, AccordionItem } from "@infinibay/harbor/layout";
```

## Example

```tsx
<Accordion defaultValue="general" multiple>
  <AccordionItem value="general" title="General">
    Workspace name, locale, default theme.
  </AccordionItem>
  <AccordionItem value="billing" title="Billing" icon={<CardIcon />}>
    Plan, invoices, payment method.
  </AccordionItem>
  <AccordionItem value="danger" title="Danger zone">
    Delete workspace.
  </AccordionItem>
</Accordion>
```

## Props (`<Accordion>`)

- **defaultValue** — `string | string[]`. Initially open item value(s).
- **multiple** — `boolean`. Allow several panels open at once. Default `false`.
- **children** — `ReactNode`. Should be `<AccordionItem>` elements.
- **className** — extra classes on the wrapper.

## Props (`<AccordionItem>`)

- **value** — `string`. Required unique key for the item.
- **title** — `ReactNode`. Required header label.
- **icon** — `ReactNode`. Optional leading icon.
- **children** — `ReactNode`. Body content shown when open.

## Notes

- State is internal; controlled mode is not exposed — use `defaultValue`
  to seed the initial state.
- Open/close animates height + opacity via `framer-motion`.
- The chevron rotates 180° on open with a spring.
