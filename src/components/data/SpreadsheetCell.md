# SpreadsheetCell

Interactive cell primitive for spreadsheet-style editors, financial grids,
planning tools, and dense desktop workspaces. `SpreadsheetCell` renders the
cell UI and keyboard contract; your application owns the worksheet model,
selection range, formulas, undo stack, persistence, and clipboard behavior.

Use it when a grid cell must behave like a real spreadsheet cell: selectable,
editable, keyboard-navigable, range-aware, and independently formatted. For
read-only tabular data, use `DataTable` instead.

## Import

```tsx
import {
  SpreadsheetCell,
  type SpreadsheetCellStyle,
} from "@infinibay/harbor/data";
```

## Basic Usage

```tsx
function RevenueCell() {
  const [value, setValue] = useState("=SUM(B2:B8)");
  const [editing, setEditing] = useState(false);

  return (
    <SpreadsheetCell
      id="B1"
      value={value}
      displayValue="$24,800"
      numeric
      formula
      selected
      editing={editing}
      style={{
        bold: true,
        textAlign: "right",
        color: "accent",
        backgroundColor: "muted",
      }}
      onEditStart={() => setEditing(true)}
      onEditEnd={() => setEditing(false)}
      onValueChange={(_id, next) => setValue(next)}
    />
  );
}
```

## Props

- **id** - stable cell identifier such as `"B1"` or `"row-4:cost"`.
- **value** - editable raw value. Formula cells usually keep the formula here.
- **displayValue** - formatted display string used when the cell is not editing.
- **selected** / **inSelection** - active cell and range selection styling.
- **editing** - switches the input from read-only display mode to edit mode.
- **rangeSize** - tells the cell whether a selected click should enter edit mode.
- **numeric** - right-aligns the cell by default.
- **formula** - applies formula-oriented display styling outside edit mode.
- **header** - uses header typography for row and column headings.
- **style** - per-cell formatting through `SpreadsheetCellStyle`.

`SpreadsheetCellStyle` supports font size, font family, color,
background color, bold, italic, underline, text alignment, one shared border,
or individual `top`, `right`, `bottom`, and `left` borders.

## Interaction Model

The component reports intent through callbacks instead of mutating your data
model directly.

- Click selects the cell.
- Click the already selected single cell to start editing.
- Double-click starts editing.
- Typing while selected starts editing and replaces the current value.
- `Enter` and `F2` start editing.
- `Backspace` and `Delete` call `onClear`.
- Arrow keys call `onNavigate` while not editing.
- `Enter`, `Tab`, and `Shift+Tab` commit editing and request navigation.
- `Escape` exits edit mode by blurring the input.
- Dragging across cells starts with `onRangeDragStart` and continues through
  `onRangeDragEnter`.

## Composition Notes

Build the grid around `SpreadsheetCell`; do not ask the cell to own workbook
state. A production spreadsheet surface usually has:

- a worksheet store for raw values, formulas, computed values, and formatting;
- a selection model for active cell, range, fill handle, and clipboard state;
- row and column headers rendered with `header` cells or adjacent layout;
- a formula bar that reads and writes the same `value` as the active cell;
- undo/redo and persistence outside the rendered cell.

Use `displayValue` for formatted numbers, dates, and formula results. Keep the
raw `value` untouched so editing can return to the original formula or typed
source.

## Accessibility

`SpreadsheetCell` renders as an input so keyboard focus, text entry, and native
editing behavior stay predictable. Use stable ids, preserve logical tab order,
and expose surrounding row/column context from the grid container when building
a full worksheet. Do not rely on color alone for formula, warning, or selection
state; pair formatting with labels, headers, or status text elsewhere in the
workspace.

## Gotchas

- `SpreadsheetCell` is intentionally low-level. It does not calculate formulas,
  virtualize rows, manage undo, or persist values.
- Keep `value` and `displayValue` separate. Replacing `value` with a formatted
  string makes formulas and re-editing harder.
- Keep selection state above the cell. Toolbar buttons, formula bars, status
  bars, and cells should all read from the same selection model.
- Do not use it for normal forms. Use `TextField`, `NumberField`, or
  `DataTable` inline editing when the interface is not a spreadsheet.

## Related Components

`DataTable`, `InlineEdit`, `TextField`, `NumberField`, `StatusBar`,
`CanvasToolbar`.
