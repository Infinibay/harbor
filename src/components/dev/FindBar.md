# FindBar

Floating find/replace bar — modeled after the IDE Cmd+F panel. Stateless
on the search query: the parent owns the matching logic and feeds back
`total`/`current` so the bar only renders.

## Import

```tsx
import { FindBar } from "@infinibay/harbor/dev";
```

## Example

```tsx
const [open, setOpen] = useState(false);
const [matches, setMatches] = useState({ total: 0, current: 0 });

<FindBar
  open={open}
  onClose={() => setOpen(false)}
  total={matches.total}
  current={matches.current}
  onChange={(q) => runSearch(q)}
  onNext={() => stepMatch(+1)}
  onPrev={() => stepMatch(-1)}
  onReplace={(find, replace) => applyReplace(find, replace)}
  caseSensitive={caseSensitive}
  onCaseToggle={setCaseSensitive}
/>;
```

## Props

- **open** — `boolean`. Required.
- **onClose** — `() => void`. Required. Also fires on `Esc`.
- **total** — `number`. Match count. Default `0`.
- **current** — `number`. 1-based current match. Default `0`.
- **onChange** — `(q: string) => void`. Fires on every keystroke.
- **onNext** / **onPrev** — `() => void`. Stepping. Enter / Shift+Enter
  in the input also call these.
- **onReplace** — `(find: string, replace: string) => void`. When set,
  the replace toggle (`⇅`) is shown. Both "Replace" and "All" buttons
  call this — the parent decides scope.
- **showReplace** — `boolean`. Initial visibility of the replace row.
- **caseSensitive** / **onCaseToggle** — controlled toggle pair.
- **regex** / **onRegexToggle** — controlled toggle pair.
- **className** — extra classes on the bar.

## Notes

- Auto-focuses the input on open.
- The bar does not own the match list — wire `onChange` to your own
  search routine and feed the totals back via `total`/`current`.
