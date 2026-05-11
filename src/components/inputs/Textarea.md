# Textarea

`Textarea` is Harbor's multi-line text input. Use it for descriptions, notes, comments, support messages, changelog entries, release summaries, prompts, bios, and configuration text where users need more space than a single-line `TextField`.

It supports an optional label and optional character counter with a progress bar. It forwards native textarea attributes, so you can still pass `rows`, `placeholder`, `disabled`, `name`, `required`, and form handlers.

## Import

```tsx
import { Textarea } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
<Textarea
  label="Description"
  placeholder="Tell the team what changed..."
  value={description}
  onChange={(event) => setDescription(event.target.value)}
  rows={5}
/>
```

With a character counter:

```tsx
<Textarea
  label="Release summary"
  maxChars={280}
  value={summary}
  onChange={(event) => setSummary(event.target.value)}
/>
```

## Props

`Textarea` extends native `TextareaHTMLAttributes<HTMLTextAreaElement>` and adds:

- **label** - optional string rendered above the editable area inside the field surface.
- **maxChars** - optional number. Shows a visual count and progress bar.

It also accepts native props such as `id`, `value`, `defaultValue`, `onChange`, `rows`, `disabled`, `placeholder`, `name`, and `required`.

## State Model

The component supports controlled and uncontrolled usage. If `value` is provided, the parent owns the value. If only `defaultValue` is provided, Harbor tracks internal text for the counter.

`maxChars` does not enforce a hard limit by itself. It displays `count/maxChars` and turns the progress bar rose after 90 percent. Use native `maxLength` or validation if you need to block longer input.

## Accessibility

When `label` is provided, Harbor connects it with the generated or supplied `id` through `htmlFor`. Prefer visible labels over placeholder-only fields.

For validation, render error text near the field and connect it through your form pattern. The counter is visual, so do not rely on it as the only constraint for assistive technology users.

## Gotchas

- `maxChars` is visual; use `maxLength` to enforce.
- The field has `resize-y`, so users can make it taller.
- Long uncontrolled text still updates internal state for the counter.
- Do not use `Textarea` for code editing; use `CodeEditor` or a specialized editor.

## Related

- `TextField` for single-line input.
- `ChatInput` for chat composition.
- `CodeEditor` for code-like editing.
- `FormField` and `FormSection` for form layout.
