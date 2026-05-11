# QuoteCard

`QuoteCard` presents a customer quote, testimonial, editorial pull quote, or highlighted comment inside a polished Harbor figure. It combines a soft surface, accent quote mark, readable blockquote text, and optional author metadata.

Use it on marketing-adjacent product pages, case studies, release notes, internal culture pages, and documentation sections where a real voice helps explain why a pattern matters.

## Import

```tsx
import { QuoteCard } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<QuoteCard
  quote="Harbor gave our team one shared UI language for dashboards, settings, and support tools."
  author={{
    name: "Ana Perez",
    role: "Engineering Lead, Acme",
  }}
  accent="sky"
/>
```

Use it without an author for editorial callouts:

```tsx
<QuoteCard
  quote="The fastest interface is the one users can understand before they need instructions."
  accent="amber"
/>
```

## Props

- **quote** - required `ReactNode`. The main quote content.
- **author** - optional object with `name`, optional `role`, and optional `avatar`.
- **accent** - optional `"fuchsia"`, `"sky"`, `"emerald"`, or `"amber"`. Defaults to `"fuchsia"`.
- **className** - optional string merged onto the root `<figure>`.

The current rendering uses the author's name and role. The avatar slot is part of the author shape, but the displayed avatar is generated from the name.

## Content Guidance

Keep quotes specific. Strong quotes mention an outcome, workflow, or product quality. Weak quotes say only that something is "great." If the quote is long, split the surrounding section instead of forcing a paragraph-sized testimonial into one card.

Use `accent` to support context, not to decorate every card differently. A page with multiple testimonials usually feels cleaner when all quote cards share one accent.

## Structure

`QuoteCard` renders semantic `<figure>`, `<blockquote>`, and `<figcaption>` elements. That makes it appropriate for real quotations and attribution. The large quote mark is decorative and hidden from assistive technology.

## Accessibility

Do not put essential context only in the accent color or decorative quote mark. The quote text and author text should stand on their own. If the quote is user-generated content, preserve the author's intended meaning and avoid truncating in a way that changes it.

## Gotchas

- `quote` accepts any React node, but plain text is easiest to read and localize.
- The `avatar` field is accepted by the prop type but is not currently rendered as an image.
- Avoid using `QuoteCard` for warnings or operational feedback. Use `Alert`, `Aside`, or `Banner`.
- Do not stack many quote cards inside dense app screens; they are intentionally editorial.

## Related

- `Card` for general content surfaces.
- `Avatar` for standalone people display.
- `Aside` for documentation notes.
- `FeatureCard` for product feature summaries.
