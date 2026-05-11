# IconTile

`IconTile` gives an icon a consistent Harbor container: fixed square dimensions, rounded corners, subtle border, and tone-aware color treatment. Use it in feature lists, settings rows, activity cards, onboarding steps, command results, and dashboard summaries where an icon should help scanning without becoming a button.

The component is decorative by default. It sets `aria-hidden`, so the surrounding label or heading must carry the meaning.

## Import

```tsx
import { IconTile } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<Card>
  <div className="flex items-start gap-3">
    <IconTile tone="sky" icon={<CloudIcon />} />
    <div>
      <h3 className="font-medium">Deployments</h3>
      <p className="text-sm text-fg-muted">
        Monitor releases, rollbacks, and environment health.
      </p>
    </div>
  </div>
</Card>
```

Use the size prop to match density:

```tsx
<IconTile size="sm" tone="amber" icon={<ShieldAlertIcon />} />
<IconTile size="md" tone="green" icon={<CheckIcon />} />
<IconTile size="lg" tone="purple" icon={<SparklesIcon />} />
```

## Props

- **icon** - required `ReactNode`. Pass a Lucide icon, product glyph, emoji, or any small visual.
- **tone** - optional tone: `"neutral"`, `"sky"`, `"green"`, `"purple"`, `"amber"`, or `"rose"`. Defaults to `"neutral"`.
- **size** - optional size: `"sm"`, `"md"`, or `"lg"`. Defaults to `"md"`.
- **className** - optional string merged onto the root element.

## Tone Guide

Use tones semantically when the tile represents state: `green` for healthy, `amber` for attention, `rose` for destructive or failing, `sky` for informational, and `purple` for creative or AI-assisted features. For neutral navigation or repeated feature grids, use `neutral` to avoid turning the page into a rainbow.

## Composition Notes

`IconTile` is not interactive. If the whole row is clickable, put the click handler on the row, card, or link and keep the tile decorative. If the icon itself is the action, use `Button`, `IconButton`, or another interactive primitive instead.

The tile has `shrink-0` so it stays aligned beside multi-line text. This makes it useful in compact rows where labels wrap.

## Accessibility

Because `IconTile` uses `aria-hidden`, screen readers skip the icon. That is correct for decorative support icons. Make sure the neighboring text says the thing the icon implies:

```tsx
<IconTile tone="rose" icon={<AlertTriangleIcon />} />
<span>Production deployment failed</span>
```

Do not rely on color alone for critical status. Pair the icon with explicit copy, `Badge`, or `StatusDot`.

## Gotchas

- Do not use `IconTile` as a button. It has no keyboard behavior or pressed state.
- Keep icons visually centered. Very wide custom SVGs may need their own sizing class.
- Avoid mixing many tones in one dense list unless each tone has a clear semantic meaning.
- The icon is hidden from assistive technology, so do not put essential text inside it.

## Related

- `Badge` for compact status labels.
- `StatusDot` for labelled system state.
- `FeatureCard` for larger feature presentation.
- `Button` or `MoreButton` for interactive icon actions.
