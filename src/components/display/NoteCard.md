# NoteCard

`NoteCard` renders a compact, editorial note with a colored paper-like surface, optional title, author, date, and tilt. Use it for reminders, research notes, review comments, design annotations, internal docs, roadmap callouts, and lightweight collaboration surfaces where the content should feel human rather than system-generated.

It is intentionally more expressive than `Card` and less urgent than `Alert`. Use it when the note supports a workflow without becoming a blocking status message.

## Import

```tsx
import { NoteCard } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<NoteCard
  title="Reminder"
  author="Ana"
  date="Apr 28"
  color="yellow"
  tilt={-2}
>
  Test the email flow in Safari before shipping the invite screen.
</NoteCard>
```

Use it in a review board:

```tsx
<ResponsiveGrid columns={{ base: 1, md: 3 }}>
  {notes.map((note, index) => (
    <NoteCard
      key={note.id}
      title={note.type}
      author={note.author}
      date={note.createdAt}
      color={note.color}
      tilt={index % 2 === 0 ? -1.5 : 1.5}
    >
      {note.body}
    </NoteCard>
  ))}
</ResponsiveGrid>
```

## Props

- **children** - required `ReactNode`. The note body.
- **title** - optional `ReactNode` rendered as a small uppercase label.
- **color** - optional `"yellow"`, `"pink"`, `"sky"`, `"green"`, or `"purple"`. Defaults to `"yellow"`.
- **author** - optional `ReactNode`.
- **date** - optional `ReactNode`.
- **tilt** - optional number of rotation degrees. Defaults to `0`.
- **className** - optional string merged onto the root.

## Content Guidance

Keep note text short and concrete. A note should capture a reminder, insight, decision, or annotation. If the content becomes a full explanation, move it into prose, `Aside`, or a documentation section.

Use `author` and `date` when the note represents collaboration history. Omit them for decorative callouts or static product copy.

## Visual Model

`color` controls background, border, and title accent. `tilt` applies a CSS rotate transform to the whole card. Small tilts create a natural board feel; large tilts can hurt alignment and readability.

## Accessibility

The title is visual text, not a semantic heading. If the note starts a major section, add a real heading outside the card. Do not rely on color to identify note type; use the title or visible text as well.

## Gotchas

- Avoid using `NoteCard` for errors, warnings, or success feedback that requires action.
- Keep `tilt` subtle in dense layouts.
- Long notes with `whitespace-pre-wrap` can become tall quickly.
- The component does not include actions; add buttons outside or use `Card` for interactive workflows.

## Related

- `Aside` for documentation notes.
- `Alert` for actionable feedback.
- `Card` for general app surfaces.
- `QuoteCard` for attributed testimonials or pull quotes.
