# AppHeader

`AppHeader` is a thin top chrome bar for application pages. It gives you a
backdrop-blurred, bordered header with a flexible left slot and a compact right
slot. Use it for breadcrumbs, page titles, back buttons, environment labels,
notifications, account menus, and page-level actions.

Unlike `NavBar`, it does not render navigation tabs or links. It is a passive
frame that lets your app decide what belongs in each slot.

## Import

```tsx
import { AppHeader } from "@infinibay/harbor/navigation";
```

## Basic Usage

```tsx
<AppHeader
  left={<Breadcrumbs items={breadcrumbItems} />}
  right={
    <>
      <Button variant="secondary">Invite</Button>
      <Avatar name="Ada Lovelace" />
    </>
  }
/>
```

Inside an app shell:

```tsx
<AppShell
  header={
    <AppHeader
      left={<strong>Settings</strong>}
      right={<Button>Save</Button>}
    />
  }
>
  <SettingsPage />
</AppShell>
```

## Props

- **left** - `ReactNode`. Content in the flexible left area.
- **right** - `ReactNode`. Content in the shrink-wrapped right area.
- **sticky** - `boolean`. Pins the header to the top with Harbor's sticky z-index.
  Default `true`.
- **className** - extra classes on the header.

## Layout Model

The left slot uses `flex-1 min-w-0`, so breadcrumbs and titles can truncate
instead of pushing actions off screen. The right slot uses `shrink-0`, keeping
actions available while the left side adapts.

When `sticky` is enabled, the header uses Harbor's shared `Z.STICKY` layer so it
stays above page content without fighting dialogs, popovers, or menus.

## Accessibility

`AppHeader` renders a semantic `header`. Put meaningful landmarks, headings, or
navigation controls inside it; the component does not invent them. If the right
slot contains icon-only actions, give those buttons accessible labels.

Keep the header concise. Repeated sticky chrome should help users orient and act,
not duplicate the whole page.

## Gotchas

- `AppHeader` is not a router or menu system. Use `NavBar`, `Sidebar`, or
  `Tabs` when users need navigation.
- Sticky behavior depends on the scroll container. In nested scroll layouts,
  place the header in the container that actually scrolls.
- Avoid long unbreakable text in the right slot; it is intentionally
  shrink-wrapped.

## Related

- `AppShell` for full application frames.
- `PageHeader` for content-level page titles and actions.
- `Sidebar` and `NavBar` for navigation.
- `Breadcrumbs` for route hierarchy in the left slot.
