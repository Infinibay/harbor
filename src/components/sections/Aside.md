# Aside

`Aside` renders an inline callout block for prose. Use it in documentation, guides, settings explanations, onboarding copy, release notes, and long-form product pages when a note needs to interrupt the reading flow without becoming a modal or alert.

It is similar to MDN-style note blocks: a tone, icon, title, and body inside a bordered side accent.

## Import

```tsx
import { Aside } from "@infinibay/harbor/sections";
```

## Basic Usage

```tsx
<Aside tone="tip" title="Provider placement">
  Put HarborProvider near the root of the app so overlays, portals, and target
  tokens share the same runtime configuration.
</Aside>
```

For warnings:

```tsx
<Aside tone="warning" title="Server rendering">
  Keep browser-only APIs out of module scope when using Next.js.
</Aside>
```

## Props

- **tone** - optional `"note"`, `"tip"`, `"info"`, `"warning"`, or `"danger"`. Defaults to `"note"`.
- **title** - optional `ReactNode`. Defaults to the tone label.
- **children** - required `ReactNode`.
- **className** - optional string merged onto the root `<aside>`.

## Tone Guide

Use `note` for neutral context, `tip` for a better way to do something, `info` for background knowledge, `warning` for risks that can break a workflow, and `danger` for destructive or security-sensitive guidance.

If the message requires immediate user action inside an app, use `Alert` or `Banner` instead.

## Composition Guidance

Keep asides short. They should support the main flow, not replace it. If an aside grows beyond a couple of paragraphs, promote it into its own section.

Use one clear title. The tone icon and label are there for scanning; the body should contain the actual advice.

## Accessibility

The component renders semantic `<aside>`, which is appropriate for tangential content. Do not put essential instructions only in an aside if users must read them to complete the task. Color and emoji support scanning but should not carry the only meaning.

## Gotchas

- Too many asides make documentation feel fragmented.
- `danger` asides are still prose, not confirmation dialogs.
- The component includes vertical margin (`my-6`), so account for that inside compact layouts.
- Tone icons are built into the component and are not configurable today.

## Related

- `Alert` for app feedback.
- `Banner` for page-level announcements.
- `Callout` for stronger highlighted content.
- `Prose` for long-form documentation rendering.
