import { describe, it, expect, vi } from "vitest";
import { act, fireEvent, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { DataTable } from "./DataTable";
import type { ColumnDef } from "./table/types";

interface Row {
  id: string;
  name: string;
  score: number;
}

const rows: Row[] = [
  { id: "r1", name: "alpha", score: 42 },
  { id: "r2", name: "bravo", score: 17 },
  { id: "r3", name: "charlie", score: 88 },
];

const columns: ColumnDef<Row>[] = [
  { id: "name", header: "Name", sortable: true },
  { id: "score", header: "Score", sortable: true, align: "end" },
];

describe("DataTable — render", () => {
  it("renders header + all rows", () => {
    renderWithHarbor(
      <DataTable rows={rows} columns={columns} rowId={(r) => r.id} />,
    );
    const grid = screen.getByRole("grid");
    const allRows = within(grid).getAllByRole("row");
    // 1 header row + 3 body rows.
    expect(allRows).toHaveLength(4);
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
  });

  it("falls back to String(accessor) when no cell is provided", () => {
    renderWithHarbor(
      <DataTable rows={rows} columns={columns} rowId={(r) => r.id} />,
    );
    expect(screen.getByText("alpha")).toBeInTheDocument();
    expect(screen.getByText("88")).toBeInTheDocument();
  });

  it("renders the empty state when rows are empty", () => {
    renderWithHarbor(
      <DataTable rows={[]} columns={columns} rowId={(r) => r.id} />,
    );
    expect(screen.getByText(/No data/i)).toBeInTheDocument();
  });

  it("sets aria-rowcount + aria-colcount on the grid", () => {
    renderWithHarbor(
      <DataTable rows={rows} columns={columns} rowId={(r) => r.id} />,
    );
    const grid = screen.getByRole("grid");
    expect(grid).toHaveAttribute("aria-rowcount", "3");
    expect(grid).toHaveAttribute("aria-colcount", "2");
  });
});

describe("DataTable — sort", () => {
  it("clicking a sortable header toggles sort + updates aria-sort", async () => {
    const { user } = renderWithHarbor(
      <DataTable rows={rows} columns={columns} rowId={(r) => r.id} />,
    );
    const scoreHeader = screen.getByRole("columnheader", { name: /Score/ });
    expect(scoreHeader).toHaveAttribute("aria-sort", "none");
    await user.click(scoreHeader);
    expect(scoreHeader).toHaveAttribute("aria-sort", "ascending");
    await user.click(scoreHeader);
    expect(scoreHeader).toHaveAttribute("aria-sort", "descending");
    await user.click(scoreHeader);
    expect(scoreHeader).toHaveAttribute("aria-sort", "none");
  });
});

describe("DataTable — pagination", () => {
  it("slices to the page size and exposes navigation", async () => {
    const { user } = renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        defaultPagination={{ pageSize: 2 }}
      />,
    );
    const grid = screen.getByRole("grid");
    expect(within(grid).getAllByRole("row")).toHaveLength(3); // header + 2
    await user.click(screen.getByRole("button", { name: /Next page/ }));
    expect(within(grid).getAllByRole("row")).toHaveLength(2); // header + 1
  });
});

describe("DataTable — selection", () => {
  it("renders the select-all checkbox in the header when selectable", () => {
    renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        selectable
      />,
    );
    // 1 header checkbox + 3 row checkboxes.
    expect(screen.getAllByRole("checkbox")).toHaveLength(4);
  });

  it("fires onSelectionChange when a row checkbox is clicked", async () => {
    const onSelectionChange = vi.fn();
    const { user } = renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );
    const checkboxes = screen.getAllByRole("checkbox");
    // Index 0 is header; pick the first row.
    await user.click(checkboxes[1]);
    expect(onSelectionChange).toHaveBeenCalledWith(["r1"]);
  });

  it("header checkbox selects / clears the current page", async () => {
    const onSelectionChange = vi.fn();
    const { user } = renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );
    await user.click(screen.getAllByRole("checkbox")[0]);
    expect(onSelectionChange).toHaveBeenCalledWith(["r1", "r2", "r3"]);
  });
});

describe("DataTable — loading / onRowClick", () => {
  it("renders a loading overlay and hides the body when loading", () => {
    renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        loading
      />,
    );
    expect(screen.queryByText("alpha")).not.toBeInTheDocument();
  });

  it("fires onRowClick", async () => {
    const onRowClick = vi.fn();
    const { user } = renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        onRowClick={onRowClick}
      />,
    );
    await user.click(screen.getByText("alpha"));
    expect(onRowClick).toHaveBeenCalledWith(rows[0]);
  });
});

describe("DataTable — virtualization", () => {
  const manyRows: Row[] = Array.from({ length: 1000 }, (_, i) => ({
    id: `r${i}`,
    name: `row-${i}`,
    score: i,
  }));

  it("only renders the windowed slice when maxHeight is set", () => {
    renderWithHarbor(
      <DataTable
        rows={manyRows}
        columns={columns}
        rowId={(r) => r.id}
        defaultPagination={{ pageSize: 1000 }}
        maxHeight={400}
        rowHeight={40}
        overscan={4}
      />,
    );
    // Viewport ≈ 400/40 = 10 visible + 2*4 overscan = ~18 rendered.
    // Well under 1000.
    const rowEls = screen.getAllByRole("row");
    expect(rowEls.length).toBeLessThan(40);
    expect(rowEls.length).toBeGreaterThan(10);
  });

  it("renders every row when maxHeight is not set", () => {
    renderWithHarbor(
      <DataTable
        rows={manyRows.slice(0, 50)}
        columns={columns}
        rowId={(r) => r.id}
        defaultPagination={{ pageSize: 100 }}
      />,
    );
    // Header + 50 body rows = 51.
    expect(screen.getAllByRole("row")).toHaveLength(51);
  });
});

describe("DataTable — resize handle", () => {
  it("renders a resize handle in each resizable header cell", () => {
    const { container } = renderWithHarbor(
      <DataTable rows={rows} columns={columns} rowId={(r) => r.id} />,
    );
    const handles = container.querySelectorAll(".cursor-col-resize");
    expect(handles.length).toBe(columns.length);
  });

  it("skips the handle for columns with resizable=false", () => {
    const { container } = renderWithHarbor(
      <DataTable
        rows={rows}
        columns={[
          { id: "name", header: "Name", resizable: false },
          ...columns.slice(1),
        ]}
        rowId={(r) => r.id}
      />,
    );
    const handles = container.querySelectorAll(".cursor-col-resize");
    expect(handles.length).toBe(columns.length - 1);
  });
});

describe("DataTable — pinning", () => {
  it("pinned columns render with position: sticky", () => {
    const { container } = renderWithHarbor(
      <DataTable
        rows={rows}
        columns={[
          { id: "name", header: "Name", pinned: "start", width: 150 },
          { id: "score", header: "Score", align: "end", pinned: "end", width: 100 },
        ]}
        rowId={(r) => r.id}
      />,
    );
    const headers = container.querySelectorAll('[role="columnheader"]');
    expect(headers[0].getAttribute("style")).toMatch(/sticky/);
    expect(headers[1].getAttribute("style")).toMatch(/sticky/);
  });
});

describe("DataTable — column menu", () => {
  it("each data header gets a menu trigger by default", () => {
    renderWithHarbor(
      <DataTable rows={rows} columns={columns} rowId={(r) => r.id} />,
    );
    expect(
      screen.getAllByRole("button", { name: /Column menu/i }).length,
    ).toBe(columns.length);
  });

  it("opens the menu and fires Sort ascending", async () => {
    const { user } = renderWithHarbor(
      <DataTable rows={rows} columns={columns} rowId={(r) => r.id} />,
    );
    const triggers = screen.getAllByRole("button", { name: /Column menu/i });
    // Score column is the 2nd data header.
    await user.click(triggers[1]);
    await user.click(await screen.findByText(/Sort ascending/i));
    // Ascending sort on score → rows reorder so bravo (17) comes before alpha (42) before charlie (88).
    const grid = screen.getByRole("grid");
    const bodyRows = within(grid).getAllByRole("row").slice(1); // skip header
    const firstCell = within(bodyRows[0]).getAllByRole("gridcell")[0];
    expect(firstCell.textContent).toContain("bravo");
  });

  it("clicking Pin to start pins the column", async () => {
    const { user, container } = renderWithHarbor(
      <DataTable rows={rows} columns={columns} rowId={(r) => r.id} />,
    );
    await user.click(
      screen.getAllByRole("button", { name: /Column menu/i })[0],
    );
    await user.click(await screen.findByText(/Pin to start/i));
    // The name column's header should now have position: sticky.
    const nameHeader = container.querySelector(
      '[role="columnheader"][aria-sort]',
    );
    expect(nameHeader?.getAttribute("style")).toMatch(/sticky/);
  });

  it("clicking Hide column removes the column", async () => {
    const { user } = renderWithHarbor(
      <DataTable rows={rows} columns={columns} rowId={(r) => r.id} />,
    );
    expect(
      screen.getByRole("columnheader", { name: /Score/i }),
    ).toBeInTheDocument();
    await user.click(
      screen.getAllByRole("button", { name: /Column menu/i })[1],
    );
    await user.click(await screen.findByText(/Hide column/i));
    expect(
      screen.queryByRole("columnheader", { name: /Score/i }),
    ).not.toBeInTheDocument();
  });

  it("columnMenu=false hides every trigger", () => {
    renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        columnMenu={false}
      />,
    );
    expect(
      screen.queryAllByRole("button", { name: /Column menu/i }).length,
    ).toBe(0);
  });
});

describe("DataTable — visibility picker", () => {
  it("renders the Columns button when showColumnPicker is true", () => {
    renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        showColumnPicker
      />,
    );
    expect(screen.getByRole("button", { name: /Columns/i })).toBeInTheDocument();
  });

  it("toggles a column from the picker menu", async () => {
    const { user } = renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        showColumnPicker
      />,
    );
    expect(
      screen.getByRole("columnheader", { name: /Score/i }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Columns/i }));
    // The picker renders one menuitem per column. Find the button whose
    // nearest `<button>` is not the columnheader and whose text is exactly
    // the column's header label.
    const scoreHeader = screen.getByRole("columnheader", { name: /Score/i });
    const scoreItem = (await screen.findAllByText(/^Score$/i)).find(
      (el) => !scoreHeader.contains(el),
    );
    expect(scoreItem).toBeTruthy();
    await user.click(scoreItem!);
    expect(
      screen.queryByRole("columnheader", { name: /Score/i }),
    ).not.toBeInTheDocument();
  });
});

describe("DataTable — keyboard navigation", () => {
  it("grid is focusable and responds to Arrow keys", async () => {
    const { user } = renderWithHarbor(
      <DataTable rows={rows} columns={columns} rowId={(r) => r.id} />,
    );
    const grid = screen.getByRole("grid");
    grid.focus();
    expect(document.activeElement).toBe(grid);
    await user.keyboard("{ArrowDown}");
    // After ArrowDown from default activeCell null → {0,0} then the
    // handler clamps to (0,0) since null defaults to that. Press again
    // to move to row 1.
    await user.keyboard("{ArrowDown}");
    expect(grid.getAttribute("aria-activedescendant")).toMatch(/r2/);
  });

  it("Space toggles selection on the focused row", async () => {
    const onSelectionChange = vi.fn();
    const { user } = renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );
    const grid = screen.getByRole("grid");
    grid.focus();
    await user.keyboard("{ArrowDown}"); // activeCell → (0,0)
    await user.keyboard(" ");
    expect(onSelectionChange).toHaveBeenCalledWith(["r1"]);
  });

  it("Cmd+A selects the whole current page", async () => {
    const onSelectionChange = vi.fn();
    const { user } = renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );
    const grid = screen.getByRole("grid");
    grid.focus();
    await user.keyboard("{Control>}a{/Control}");
    expect(onSelectionChange).toHaveBeenCalledWith(["r1", "r2", "r3"]);
  });

  it("Escape clears selection + active cell", async () => {
    const onSelectionChange = vi.fn();
    const { user } = renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        selectable
        defaultSelected={["r1", "r2"]}
        onSelectionChange={onSelectionChange}
      />,
    );
    const grid = screen.getByRole("grid");
    grid.focus();
    await user.keyboard("{Escape}");
    expect(onSelectionChange).toHaveBeenCalledWith([]);
  });

  it("keyboardNavigation=false skips the handler wiring", () => {
    renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        keyboardNavigation={false}
      />,
    );
    const grid = screen.getByRole("grid");
    // With keyboardNavigation=false, tabIndex is omitted and the grid
    // drops out of the tab order.
    expect(grid).not.toHaveAttribute("tabindex");
  });
});

describe("DataTable — loading + error", () => {
  it("renders N skeleton rows when loading", () => {
    renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        loading
        skeletonRows={7}
      />,
    );
    // Skeleton rows are aria-hidden (screen readers skip them) — include
    // them explicitly with `hidden: true`. Header + 7 skeletons = 8.
    expect(screen.getAllByRole("row", { hidden: true })).toHaveLength(8);
    // Real data is not rendered.
    expect(screen.queryByText("alpha")).not.toBeInTheDocument();
  });

  it("defaults skeleton count to min(pageSize, 10)", () => {
    renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        loading
        defaultPagination={{ pageSize: 3 }}
      />,
    );
    expect(screen.getAllByRole("row", { hidden: true })).toHaveLength(4);
  });

  it("renders the error panel when error is set and onRetry fires", async () => {
    const onRetry = vi.fn();
    const { user } = renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        error="Upstream unavailable"
        onRetry={onRetry}
      />,
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(/Upstream unavailable/);
    await user.click(screen.getByRole("button", { name: /Retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    // Data rows suppressed.
    expect(screen.queryByText("alpha")).not.toBeInTheDocument();
  });

  it("error takes priority over loading", () => {
    renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        error="Nope"
        loading
      />,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    // No skeleton rows when error is shown.
    expect(screen.getAllByRole("row")).toHaveLength(1); // only header
  });

  it("a custom ReactNode error replaces the whole panel", () => {
    renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        error={<p data-testid="custom-err">my custom node</p>}
      />,
    );
    expect(screen.getByTestId("custom-err")).toBeInTheDocument();
    // No default Retry button.
    expect(
      screen.queryByRole("button", { name: /Retry/i }),
    ).not.toBeInTheDocument();
  });
});

describe("DataTable — global search", () => {
  it("renders a search input when showGlobalSearch is true", () => {
    renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        showGlobalSearch
      />,
    );
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("debounces before committing to state.globalFilter", () => {
    vi.useFakeTimers();
    try {
      const onGlobalFilterChange = vi.fn();
      renderWithHarbor(
        <DataTable
          rows={rows}
          columns={columns}
          rowId={(r) => r.id}
          showGlobalSearch
          globalSearchDebounce={300}
          onGlobalFilterChange={onGlobalFilterChange}
        />,
      );
      const input = screen.getByRole("searchbox") as HTMLInputElement;
      // Fake timers + user-event don't mix cleanly, so drive the input
      // via direct change events.
      fireEvent.change(input, { target: { value: "a" } });
      fireEvent.change(input, { target: { value: "ab" } });
      fireEvent.change(input, { target: { value: "abc" } });
      expect(onGlobalFilterChange).not.toHaveBeenCalled();
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(onGlobalFilterChange).toHaveBeenCalledWith("abc");
      expect(onGlobalFilterChange).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("DataTable — server mode", () => {
  it("trusts totalCount from the caller and fires onSortChange", async () => {
    const onSortChange = vi.fn();
    const { user } = renderWithHarbor(
      <DataTable
        mode="server"
        totalCount={999}
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        onSortChange={onSortChange}
      />,
    );
    // Pagination shows totalCount 999, not local count 3.
    expect(
      screen.getByText(/of\s+999|de\s+999/i),
    ).toBeInTheDocument();
    // Clicking a sortable header fires onSortChange.
    await user.click(screen.getByRole("columnheader", { name: /Score/i }));
    expect(onSortChange).toHaveBeenCalled();
  });
});

describe("DataTable — grouping + aggregation", () => {
  interface GRow {
    id: string;
    team: string;
    score: number;
  }
  const gRows: GRow[] = [
    { id: "r1", team: "red", score: 10 },
    { id: "r2", team: "red", score: 20 },
    { id: "r3", team: "blue", score: 5 },
    { id: "r4", team: "blue", score: 15 },
  ];
  const gCols: ColumnDef<GRow>[] = [
    { id: "team", header: "Team" },
    { id: "score", header: "Score", aggregate: "sum" },
  ];

  it("renders one group header per partition; rows collapse by default", () => {
    renderWithHarbor(
      <DataTable
        rows={gRows}
        columns={gCols}
        rowId={(r) => r.id}
        defaultGrouping={["team"]}
      />,
    );
    // Two group headers: red + blue.
    expect(screen.getAllByRole("row", { expanded: false }).length).toBe(2);
    // Leaf rows collapsed.
    expect(screen.queryByText("r1")).not.toBeInTheDocument();
  });

  it("clicking a group header expands its rows", async () => {
    const { user } = renderWithHarbor(
      <DataTable
        rows={gRows}
        columns={gCols}
        rowId={(r) => r.id}
        defaultGrouping={["team"]}
      />,
    );
    // Before expand — leaf r1's score "10" shouldn't be present.
    expect(screen.queryByText("10")).not.toBeInTheDocument();
    // Click the red group row.
    const redHeader = screen.getByText("red").closest('[role="row"]')!;
    await user.click(redHeader as HTMLElement);
    // Leaf score for r1 appears in the body.
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("computes and renders aggregates in the group header", () => {
    renderWithHarbor(
      <DataTable
        rows={gRows}
        columns={gCols}
        rowId={(r) => r.id}
        defaultGrouping={["team"]}
      />,
    );
    // Score sum for red = 30, for blue = 20.
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });
});

describe("DataTable — renderExpanded detail rows", () => {
  it("adds an expand caret per row; clicking shows the detail", async () => {
    const { user } = renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        renderExpanded={(row) => (
          <div data-testid={`detail-${row.id}`}>detail · {row.name}</div>
        )}
      />,
    );
    expect(screen.queryByTestId("detail-r1")).not.toBeInTheDocument();
    const toggles = screen.getAllByRole("button", { name: /Expand row/i });
    expect(toggles.length).toBe(rows.length);
    await user.click(toggles[0]);
    expect(screen.getByTestId("detail-r1")).toBeInTheDocument();
    expect(screen.getByText("detail · alpha")).toBeInTheDocument();
  });

  it("toggling a second time collapses the row", async () => {
    const { user } = renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        renderExpanded={(row) => <div data-testid={`detail-${row.id}`} />}
      />,
    );
    const toggle = screen.getAllByRole("button", { name: /Expand row/i })[0];
    await user.click(toggle);
    expect(screen.getByTestId("detail-r1")).toBeInTheDocument();
    // Role changes to "Collapse row" when expanded — query by fresh name.
    await user.click(screen.getByRole("button", { name: /Collapse row/i }));
    expect(screen.queryByTestId("detail-r1")).not.toBeInTheDocument();
  });
});

describe("DataTable — inline cell editing", () => {
  interface ERow {
    id: string;
    name: string;
    count: number;
  }
  const eRows: ERow[] = [
    { id: "r1", name: "alpha", count: 10 },
    { id: "r2", name: "bravo", count: 20 },
  ];

  it("double-clicking an editable cell enters edit mode", async () => {
    const onCommit = vi.fn();
    const cols: ColumnDef<ERow>[] = [
      {
        id: "name",
        header: "Name",
        editable: { type: "text", onCommit },
      },
      { id: "count", header: "Count" },
    ];
    const { user } = renderWithHarbor(
      <DataTable rows={eRows} columns={cols} rowId={(r) => r.id} />,
    );
    await user.dblClick(screen.getByText("alpha"));
    const input = screen.getByDisplayValue("alpha") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(document.activeElement).toBe(input);
  });

  it("Enter commits the new value", async () => {
    const onCommit = vi.fn();
    const cols: ColumnDef<ERow>[] = [
      {
        id: "name",
        header: "Name",
        editable: { type: "text", onCommit },
      },
    ];
    const { user } = renderWithHarbor(
      <DataTable rows={eRows} columns={cols} rowId={(r) => r.id} />,
    );
    await user.dblClick(screen.getByText("alpha"));
    const input = screen.getByDisplayValue("alpha");
    await user.clear(input);
    await user.type(input, "zeta");
    await user.keyboard("{Enter}");
    expect(onCommit).toHaveBeenCalledWith(eRows[0], "zeta");
    // Cell exited edit mode.
    expect(screen.queryByDisplayValue("zeta")).not.toBeInTheDocument();
  });

  it("Escape cancels without calling onCommit", async () => {
    const onCommit = vi.fn();
    const cols: ColumnDef<ERow>[] = [
      {
        id: "name",
        header: "Name",
        editable: { type: "text", onCommit },
      },
    ];
    const { user } = renderWithHarbor(
      <DataTable rows={eRows} columns={cols} rowId={(r) => r.id} />,
    );
    await user.dblClick(screen.getByText("alpha"));
    const input = screen.getByDisplayValue("alpha");
    await user.clear(input);
    await user.type(input, "nope");
    await user.keyboard("{Escape}");
    expect(onCommit).not.toHaveBeenCalled();
  });

  it("validate() blocks commit and shows the error", async () => {
    const onCommit = vi.fn();
    const cols: ColumnDef<ERow>[] = [
      {
        id: "name",
        header: "Name",
        editable: {
          type: "text",
          onCommit,
          validate: (v) =>
            typeof v === "string" && v.length >= 3 ? true : "Too short",
        },
      },
    ];
    const { user } = renderWithHarbor(
      <DataTable rows={eRows} columns={cols} rowId={(r) => r.id} />,
    );
    await user.dblClick(screen.getByText("alpha"));
    const input = screen.getByDisplayValue("alpha");
    await user.clear(input);
    await user.type(input, "ab");
    await user.keyboard("{Enter}");
    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Too short");
    // Still in edit mode.
    expect(screen.getByDisplayValue("ab")).toBeInTheDocument();
  });

  it("Enter from keyboard nav enters edit mode on an editable cell", async () => {
    const onCommit = vi.fn();
    const cols: ColumnDef<ERow>[] = [
      {
        id: "name",
        header: "Name",
        editable: { type: "text", onCommit },
      },
    ];
    const { user } = renderWithHarbor(
      <DataTable rows={eRows} columns={cols} rowId={(r) => r.id} />,
    );
    const grid = screen.getByRole("grid");
    grid.focus();
    await user.keyboard("{ArrowDown}"); // activeCell → (0,0)
    await user.keyboard("{Enter}");
    expect(screen.getByDisplayValue("alpha")).toBeInTheDocument();
  });
});

describe("DataTable — a11y", () => {
  it("has no violations in a basic rendered state", async () => {
    const { container } = renderWithHarbor(
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        selectable
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
