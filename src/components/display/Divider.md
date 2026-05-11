# Divider

`Divider` separates related blocks without creating a new surface. Use it inside forms, menus, cards, settings panels, onboarding flows, and prose-heavy pages when a change of topic should be visible but not loud. It can render as a plain horizontal rule or as a labelled divider with short text centered between two soft gradient lines.

The component is intentionally small: it does not manage spacing around itself, so the surrounding layout remains in charge of rhythm. Pair it with `Card`, `FormSection`, `Menu`, `Stack`, or simple `space-y-*` composition depending on the density of the page.

## Import

```tsx
import { Divider, Kbd } from "@infinibay/harbor/display";
```

`Kbd` is exported from the same file and renders compact keyboard hints. It is useful beside menu items, command descriptions, and shortcut references.

## Basic Usage

```tsx
<div className="space-y-4">
  <FormSection title="Account">
    <TextField label="Workspace name" />
  </FormSection>

  <Divider>Advanced</Divider>

  <FormSection title="Danger zone">
    <Button variant="destructive">Delete workspace</Button>
  </FormSection>
</div>
```

Use the unlabelled version for quiet separation:

```tsx
<Menu>
  <MenuItem>Rename</MenuItem>
  <MenuItem>Duplicate</MenuItem>
  <Divider />
  <MenuItem tone="danger">Delete</MenuItem>
</Menu>
```

## Props

- **children** - optional `ReactNode`. When present, the divider renders centered content between two gradient rules. Keep it short: `"or"`, `"Advanced"`, `"Danger zone"`, or a shortcut hint.
- **className** - optional string merged onto the root element. Use this for margins, width, or context-specific text color.

The unlabelled divider renders `role="separator"`. The labelled variant is visual content, so provide meaningful text when the label matters.

## Label Guidance

Labelled dividers should name a section boundary, not explain a workflow. Prefer one to three words. If you need a full sentence, use `Aside`, `Alert`, or a regular paragraph above the next section.

Good labels include `"or"`, `"Advanced"`, `"Billing"`, `"Keyboard"`, and `"Danger zone"`. Avoid labels that repeat the heading immediately below the divider; that creates noise without adding hierarchy.

## Accessibility

Do not rely on a divider as the only signal that content changed. Use real headings for major sections and fieldsets for grouped form controls. The divider is a visual separator; it does not replace document structure.

When using `Kbd`, place it next to readable text such as `"Open command palette"` so screen reader users still hear the command meaning.

## Gotchas

- `Divider` does not add vertical margins. Put spacing on the parent or with `className`.
- Keep labels short. Long labels make the line feel like a heading but without heading semantics.
- Do not use many dividers inside a dense table or list. Group rows visually with headers or sections instead.
- The labelled variant does not set `role="separator"` because the children are part of the visual content.

## Related

- `FormSection` for semantic form grouping.
- `MenuSeparator` for menu-specific dividers.
- `Aside` for explanatory notes inside documentation or settings pages.
- `Kbd` for keyboard shortcut chips.
