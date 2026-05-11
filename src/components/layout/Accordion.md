# Accordion

`Accordion` organizes related content into collapsible sections. It is useful
for settings groups, FAQs, billing details, advanced options, inspector panels,
and documentation pages where users should reveal detail on demand.

The component is uncontrolled: it owns the open item values after initialization.

## Import

```tsx
import { Accordion, AccordionItem } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<Accordion defaultValue="general">
  <AccordionItem value="general" title="General">
    Workspace name, locale, and default theme settings.
  </AccordionItem>
  <AccordionItem value="billing" title="Billing">
    Current plan, invoices, and payment method.
  </AccordionItem>
</Accordion>
```

Allow multiple panels:

```tsx
<Accordion multiple defaultValue={["general", "billing"]}>{items}</Accordion>
```

## Props

`Accordion`:

- **defaultValue** - `string | string[]`. Initially open item or items.
- **multiple** - `boolean`. Allows more than one item open. Default `false`.
- **children** - `ReactNode`. Usually `AccordionItem` children.
- **className** - extra classes on the wrapper.

`AccordionItem`:

- **value** - `string`. Required stable item id.
- **title** - `ReactNode`. Required header label.
- **icon** - `ReactNode`. Optional leading icon.
- **children** - `ReactNode`. Panel content.

## Behavior

Clicking an item header toggles its value. In single mode, opening one item
closes the others. In multiple mode, each item can open or close independently.

## Accessibility

Headers are buttons, so they are focusable and clickable. Keep titles concise and
make panel content self-contained. The current implementation does not add
expanded ARIA attributes; add them in a wrapper if your page needs stricter
accordion semantics.

## Gotchas

- Open state is not controlled externally.
- `AccordionItem` must be rendered inside `Accordion`.
- Empty `defaultValue=""` still becomes an initial value string; omit it for all
  collapsed.
- Do not hide required form fields inside collapsed sections without clear
  validation messaging.

## Related

- `Expandable` for one-off morphing content.
- `Disclosure` patterns for simpler show/hide content.
- `FormSection` for settings groups that should stay visible.
- `Tabs` for switching between peer panels.
