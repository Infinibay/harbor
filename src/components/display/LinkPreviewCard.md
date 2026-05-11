# LinkPreviewCard

`LinkPreviewCard` renders a rich external link with domain, favicon, title, description, URL, and optional preview image. Use it in docs, release notes, activity feeds, support threads, resource lists, changelog entries, and collaboration surfaces where a plain URL would be hard to evaluate.

The component does not fetch metadata. Pass the preview data your app already has from an API, CMS, Open Graph scraper, or trusted static config.

## Import

```tsx
import { LinkPreviewCard } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<LinkPreviewCard
  url="https://harborui.com/documentation"
  siteName="Harbor UI"
  title="Harbor documentation"
  description="Installation, provider setup, app skeletons, theming, and component reference."
  image="/docs-preview.png"
/>
```

Without an image:

```tsx
<LinkPreviewCard
  url="https://status.acme.com/incidents/123"
  title="Incident report"
  description="Postmortem and remediation checklist."
/>
```

## Props

- **url** - required string. Used for the link target and displayed URL.
- **title** - required `ReactNode`.
- **description** - optional `ReactNode`.
- **image** - optional image URL rendered on the right.
- **favicon** - optional favicon URL.
- **siteName** - optional `ReactNode`. Defaults to the hostname parsed from `url`.
- **className** - optional string merged onto the anchor.

## Behavior

The root is an anchor with `target="_blank"` and `rel="noopener noreferrer"`. If `siteName` is omitted, Harbor tries to parse the hostname and removes a leading `www.`. Invalid URLs fall back to showing the raw string.

Images and favicons are decorative in the current component. The title and description should carry the meaning.

## Accessibility

Write titles that make sense out of context. Avoid using a bare URL as the title. Since the card opens in a new tab, consider making that behavior clear in surrounding copy if your product's link policy requires it.

The fallback favicon is decorative. Do not rely on it to communicate the destination.

## Gotchas

- Metadata is not loaded automatically.
- External images can fail or slow down the card; proxy or cache them if reliability matters.
- Long URLs truncate visually but remain the actual `href`.
- Do not use this component for internal route navigation where `Link` or `NavLink` should preserve SPA behavior.

## Related

- `FeatureCard` for internal product capabilities.
- `ArticleCard` for editorial content.
- `HoverCard` or `Popover` for additional link context.
- `ActivityFeed` for chronological updates containing links.
