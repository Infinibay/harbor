# ChangelogFeed

Versioned release notes, grouped per version with a kind filter at the top.
Use for "What's new" pages and in-app changelog drawers. For who-did-what
audit trails use `<ActivityFeed>` instead.

## Import

```tsx
import { ChangelogFeed } from "@infinibay/harbor/feedback";
```

## Example

```tsx
<ChangelogFeed
  entries={[
    {
      version: "0.4.2",
      date: "2026-04-22",
      title: "Faster boots",
      sections: [
        {
          label: "Highlights",
          items: [
            { kind: "feature", text: "Cloud-init pre-provisioning" },
            { kind: "improvement", text: "30% faster image hydration" },
            { kind: "fix", text: "Snapshots no longer leak descriptors" },
          ],
        },
      ],
    },
  ]}
/>
```

## Props

- **entries** — `readonly ChangelogEntry[]`. Required.
- **showFilter** — show kind chips ("All", "New", "Better", "Fixed", "Security", "Breaking") above the feed. Hidden if no items have a `kind`. Default: `true`.
- **className** — extra classes on the outer container.

### `ChangelogEntry`

- **version** — `string`. Required, used as the collapse key.
- **date** — `Date | string | number`. Required, formatted via `formatAbsolute`.
- **title** — `string`. Optional headline next to the version/date.
- **sections** — `readonly ChangelogSection[]`. `{ label, items }`.
- **collapsed** — initial collapse state. Default: `false` for the first entry, `true` for the rest.

### `ChangelogItem`

- **text** — `string`. Required.
- **kind** — `"feature" | "improvement" | "fix" | "security" | "breaking"`. Drives the colored badge.
- **href** — `string`. When set, the row links out to a commit/issue/PR (opens in a new tab).

## Notes

- Collapse state is local component state keyed by `version` — refreshing
  resets it.
- The kind filter hides matching items per section; sections that end up
  empty are omitted.
