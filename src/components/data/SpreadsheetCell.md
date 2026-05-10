# SpreadsheetCell

Interactive spreadsheet cell primitive for desktop-style grid editors. It owns
select-vs-edit behavior and renders per-cell formatting.

## Import

```tsx
import {
  SpreadsheetCell,
  type SpreadsheetCellStyle,
} from "@infinibay/harbor/data";
```

## Behavior

- First click selects the cell.
- Second click on the selected cell enters edit mode.
- `Shift` selection is surfaced through `onSelect(id, { extend })`.
- Typing while selected starts editing and replaces the value.
- `Enter`, `Tab`, and arrow keys report navigation through `onNavigate`.

## Styling

`SpreadsheetCellStyle` supports:

- `fontSize`
- `fontFamily`
- `color`
- `backgroundColor`
- `bold`
- `italic`
- `underline`
- `textAlign`
- `border`
- `borders.top/right/bottom/left`

Borders support `solid`, `dashed`, `dotted`, `double`, width, and color.
