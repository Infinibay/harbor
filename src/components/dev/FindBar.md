# FindBar

`FindBar` is the floating Cmd/Ctrl+F panel for editor-like surfaces. Use it when the content area owns the searchable text but the chrome needs a compact, familiar find/replace control.

The component does not compute matches. It owns only the input text, replace text, local replace-row visibility, focus behavior, and keyboard shortcuts. Your editor, document viewer, code pane, or table owns the search algorithm and feeds the bar the current match count.

## Import

```tsx
import { FindBar } from "@infinibay/harbor/dev";
```

## Basic Usage

```tsx
import { useMemo, useState } from "react";
import { FindBar } from "@infinibay/harbor/dev";

export function EditorSearch({ source }: { source: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  const matches = useMemo(() => {
    if (!query) return [];
    return [...source.matchAll(new RegExp(query, "gi"))];
  }, [source, query]);

  return (
    <>
      <button onClick={() => setOpen(true)}>Find</button>
      <FindBar
        open={open}
        onClose={() => setOpen(false)}
        total={matches.length}
        current={matches.length ? index + 1 : 0}
        onChange={(next) => {
          setQuery(next);
          setIndex(0);
        }}
        onNext={() => setIndex((value) => (value + 1) % matches.length)}
        onPrev={() => setIndex((value) => (value - 1 + matches.length) % matches.length)}
      />
    </>
  );
}
```

## Replace Flow

Pass `onReplace` when the surface supports editing. Harbor shows the replace toggle and replace row, then calls your handler with the current `find` and `replace` strings.

```tsx
<FindBar
  open={findOpen}
  onClose={() => setFindOpen(false)}
  total={matchCount}
  current={activeMatch}
  onChange={runSearch}
  onNext={goToNextMatch}
  onPrev={goToPreviousMatch}
  onReplace={(find, replace) => replaceActiveMatch(find, replace)}
  caseSensitive={caseSensitive}
  onCaseToggle={setCaseSensitive}
  regex={regex}
  onRegexToggle={setRegex}
/>
```

Both `Replace` and `All` currently call `onReplace(find, replace)`. If your product needs separate single-match and replace-all behavior, wrap the bar with surrounding actions or split the handler by local state.

## Props

- **open**: `boolean`. Controls whether the panel is mounted.
- **onClose**: `() => void`. Called by the close button and `Escape`.
- **total**: `number`. Total matches found by the parent. Defaults to `0`.
- **current**: `number`. Current match display value. Use a 1-based number for user-facing counts.
- **onChange**: `(q: string) => void`. Fires on each find-input change.
- **onNext** / **onPrev**: `() => void`. Called by arrow buttons and by `Enter` / `Shift+Enter` in the find input.
- **onReplace**: `(find: string, replace: string) => void`. Enables the replace UI.
- **showReplace**: `boolean`. Initial replace-row state.
- **caseSensitive** / **onCaseToggle**: controlled match-case toggle.
- **regex** / **onRegexToggle**: controlled regex toggle.
- **className**: custom class on the floating panel.

## Accessibility

The find input is focused automatically when `open` becomes true. The icon buttons expose labels through their titles, and the case/regex toggles expose pressed state.

Mount `FindBar` near the searchable region and keep the trigger button reachable. If opening the bar changes the visible match selection, announce that selection in the editor or document surface, not inside the bar.

## Gotchas

- `FindBar` is intentionally search-engine agnostic. It will not parse text, scroll matches into view, or highlight content.
- Keep `total` and `current` synchronized with the active query. Stale counts make the UI feel broken even if the input works.
- Guard empty match arrays before wrapping next/previous indexes.
- Regex errors should be handled by the parent. Show validation near the editor or disable stepping until the expression is valid.

## Related

- [`CodeEditor`](./CodeEditor.md) for editable code buffers.
- [`SearchField`](../inputs/SearchField.md) for ordinary form search.
- [`CommandPalette`](../overlays/CommandPalette.md) for command search.
