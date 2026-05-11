# ChangelogFeed

`ChangelogFeed` renders release notes as a structured, filterable timeline. It
is built for product changelogs, SDK release pages, internal platform updates,
and versioned documentation. Each version can contain sections, typed items,
links to issues or pull requests, and collapsible older entries.

Use it when the reader cares about release communication. For raw system events,
use `ActivityFeed`; for compliance history, use `AuditLog`.

## Import

```tsx
import { ChangelogFeed } from "@infinibay/harbor/feedback";
```

## Basic Usage

Group changes by version, then by section. Items can be tagged with a `kind` so
the feed can render filter chips.

```tsx
<ChangelogFeed
  entries={[
    {
      version: "0.8.0",
      date: "2026-05-10",
      title: "Documentation systems",
      sections: [
        {
          label: "Components",
          items: [
            { kind: "feature", text: "Added expandable documentation previews." },
            { kind: "fix", text: "Improved keyboard activation in commit cards." },
          ],
        },
      ],
    },
  ]}
/>
```

## Kinds

Supported item kinds are `feature`, `improvement`, `fix`, `security`, and
`breaking`. Harbor maps each kind to a compact label and color treatment. Omit
`kind` for neutral release-note bullets.

```tsx
{
  kind: "security",
  text: "Tightened token refresh handling.",
  href: "https://github.com/acme/app/pull/42",
}
```

## Collapse Behavior

The first entry opens by default and older entries start collapsed. Override that
per entry with `collapsed`.

```tsx
<ChangelogFeed
  entries={[
    { version: "1.0.0", date: date, collapsed: false, sections },
    { version: "0.9.0", date: date, collapsed: true, sections },
  ]}
/>
```

## Props

- `entries`: required release entries.
- `showFilter`: shows or hides kind filter chips; defaults to `true`.
- `className`: wrapper class override.

Each entry includes `version`, `date`, optional `title`, `sections`, and optional
`collapsed`. Each section includes `label` and `items`. Each item includes
`text`, optional `kind`, and optional `href`.

## Accessibility

The version header is a real button with expanded state. Kind filters expose
pressed state so users can tell which filter is active.

Write item text as complete release-note copy. Do not make color the only way to
identify a breaking or security change; the visible kind label is part of the
meaning.

## Gotchas

Filtering hides items inside each section. If a filtered section becomes empty,
the section is not rendered. This keeps the feed compact but means a version can
temporarily show fewer sections than usual.

Use stable version strings. They are used as collapse keys.

## Related

- `ActivityFeed` for recent product events.
- `Banner` for announcing one important release.
- `MarkdownRenderer` for long-form release notes.
- `Timeline` for milestones that are not tied to semantic versions.
