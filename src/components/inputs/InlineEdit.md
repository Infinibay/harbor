# InlineEdit

`InlineEdit` turns a text label into an editable input in place. Use it for project names, dashboard titles, saved views, file names, tags, note titles, and small settings where opening a full form would interrupt the workflow.

The component owns the editing UI and draft state while the input is open. Your app owns the committed value through `value` and `onChange`.

## Import

```tsx
import { InlineEdit } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
const [name, setName] = useState("Untitled project");

<InlineEdit
  value={name}
  onChange={setName}
  placeholder="Project name"
/>
```

Use heading mode for page titles:

```tsx
<InlineEdit
  as="heading"
  value={dashboardName}
  onChange={renameDashboard}
  placeholder="Untitled dashboard"
/>
```

## Props

- **value** - required string. The committed value.
- **onChange** - required callback `(value: string) => void`.
- **placeholder** - optional string. Defaults to `"Click to edit"`.
- **as** - optional `"text"` or `"heading"`. Defaults to `"text"`.
- **className** - optional string merged onto the root.

## Interaction Model

In read mode, `InlineEdit` renders a button with the value or placeholder. Clicking it enters edit mode, copies `value` into a local draft, and selects the input text. Pressing Enter submits. Blurring the input commits. Pressing Escape cancels and restores the original value.

Before commit, the draft is trimmed. If the trimmed value differs from `value`, `onChange` fires with the trimmed value.

## State And Persistence

Use `onChange` for local state updates, API calls, or optimistic renames. For remote saves, consider showing a pending state elsewhere in the row or header because `InlineEdit` itself closes immediately after commit.

If empty names are not allowed, validate in `onChange` or wrap the component with product-specific rules.

## Accessibility

The read state is a button, so it is keyboard reachable. The edit state is a text input. Provide a contextual placeholder that explains what is editable, especially when the current value is empty.

For critical renames, announce save failures outside the component with `Alert`, toast, or row-level error copy.

## Gotchas

- Empty or whitespace-only drafts commit as an empty string unless your app rejects them.
- Blur commits changes, so be careful when adding adjacent controls inside the same small area.
- The component edits one string only. Use a form for multi-field edits.
- It does not persist to a backend by itself.

## Related

- `TextField` for explicit form editing.
- `FormField` for labelled input rows.
- `EditableDataTable` or `SpreadsheetCell` for grid editing.
- `Toast` or `Alert` for save feedback.
