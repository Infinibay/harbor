import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDataTable } from "./useDataTable";
import type { ColumnDef } from "./types";

interface Row {
  id: string;
  name: string;
  score: number;
  team: string;
}

const rows: Row[] = [
  { id: "r1", name: "alpha", score: 42, team: "red" },
  { id: "r2", name: "bravo", score: 17, team: "blue" },
  { id: "r3", name: "charlie", score: 88, team: "red" },
  { id: "r4", name: "delta", score: 5, team: "green" },
  { id: "r5", name: "echo", score: 63, team: "blue" },
];

const columns: ColumnDef<Row>[] = [
  { id: "name", header: "Name", sortable: true, filterable: { type: "text" } },
  { id: "score", header: "Score", sortable: true, filterable: { type: "number" } },
  { id: "team", header: "Team", filterable: { type: "select" } },
];

function setup(opts = {}) {
  return renderHook(() =>
    useDataTable<Row>({ rows, columns, rowId: (r) => r.id, ...opts }),
  );
}

describe("useDataTable — core", () => {
  it("returns rows as-is with no sort / filter applied", () => {
    const { result } = setup();
    expect(result.current.processedRows).toEqual(rows);
    expect(result.current.totalCount).toBe(5);
  });

  it("exposes columns + visibleColumns (all visible by default)", () => {
    const { result } = setup();
    expect(result.current.visibleColumns.map((c) => c.id)).toEqual([
      "name",
      "score",
      "team",
    ]);
  });
});

describe("useDataTable — sort", () => {
  it("toggleSort cycles: none → asc → desc → none", () => {
    const { result } = setup();
    act(() => result.current.toggleSort("score"));
    expect(result.current.state.sort).toEqual([
      { id: "score", direction: "asc" },
    ]);
    expect(result.current.processedRows.map((r) => r.score)).toEqual([
      5, 17, 42, 63, 88,
    ]);

    act(() => result.current.toggleSort("score"));
    expect(result.current.state.sort[0].direction).toBe("desc");
    expect(result.current.processedRows.map((r) => r.score)).toEqual([
      88, 63, 42, 17, 5,
    ]);

    act(() => result.current.toggleSort("score"));
    expect(result.current.state.sort).toEqual([]);
  });

  it("multi-column sort with shiftKey", () => {
    const { result } = setup();
    act(() => result.current.toggleSort("team"));
    act(() => result.current.toggleSort("score", true));
    expect(result.current.state.sort).toEqual([
      { id: "team", direction: "asc" },
      { id: "score", direction: "asc" },
    ]);
  });

  it("string sort is locale-aware with numeric collation", () => {
    const { result } = setup();
    act(() => result.current.toggleSort("name"));
    expect(result.current.processedRows.map((r) => r.name)).toEqual([
      "alpha",
      "bravo",
      "charlie",
      "delta",
      "echo",
    ]);
  });
});

describe("useDataTable — filter", () => {
  it("global filter does substring match across all columns", () => {
    const { result } = setup();
    act(() => result.current.setGlobalFilter("blue"));
    expect(result.current.processedRows.map((r) => r.id)).toEqual(["r2", "r5"]);
  });

  it("per-column text filter is case-insensitive", () => {
    const { result } = setup();
    act(() => result.current.setFilter("name", "AL"));
    expect(result.current.processedRows.map((r) => r.id)).toEqual(["r1"]);
  });

  it("number filter with min/max", () => {
    const { result } = setup();
    act(() => result.current.setFilter("score", { min: 40, max: 70 }));
    expect(result.current.processedRows.map((r) => r.score).sort()).toEqual([
      42, 63,
    ]);
  });

  it("select filter with any-of", () => {
    const { result } = setup();
    act(() => result.current.setFilter("team", ["red", "green"]));
    expect(result.current.processedRows.map((r) => r.team).sort()).toEqual([
      "green",
      "red",
      "red",
    ]);
  });

  it("clearFilter removes a specific filter", () => {
    const { result } = setup();
    act(() => result.current.setFilter("name", "al"));
    act(() => result.current.setFilter("team", ["red"]));
    expect(result.current.state.filters).toHaveLength(2);
    act(() => result.current.clearFilter("name"));
    expect(result.current.state.filters).toHaveLength(1);
    expect(result.current.state.filters[0].id).toBe("team");
  });
});

describe("useDataTable — pagination", () => {
  it("slices processedRows into pages", () => {
    const { result } = setup({ defaultPagination: { pageSize: 2 } });
    expect(result.current.pageRows).toHaveLength(2);
    expect(result.current.state.pagination.page).toBe(0);

    act(() => result.current.setPage(1));
    expect(result.current.pageRows.map((r) => r.id)).toEqual(["r3", "r4"]);

    act(() => result.current.setPage(2));
    expect(result.current.pageRows.map((r) => r.id)).toEqual(["r5"]);
  });

  it("setPageSize resets to page 0", () => {
    const { result } = setup({ defaultPagination: { pageSize: 2 } });
    act(() => result.current.setPage(2));
    act(() => result.current.setPageSize(10));
    expect(result.current.state.pagination.page).toBe(0);
    expect(result.current.state.pagination.pageSize).toBe(10);
  });
});

describe("useDataTable — selection", () => {
  it("toggleRow adds / removes an id", () => {
    const { result } = setup();
    act(() => result.current.toggleRow("r2"));
    expect(result.current.isRowSelected("r2")).toBe(true);
    act(() => result.current.toggleRow("r2"));
    expect(result.current.isRowSelected("r2")).toBe(false);
  });

  it("toggleRowRange selects a contiguous range based on last anchor", () => {
    const { result } = setup();
    act(() => result.current.toggleRow("r1"));
    act(() => result.current.toggleRowRange("r4"));
    expect(
      ["r1", "r2", "r3", "r4"].every((id) => result.current.isRowSelected(id)),
    ).toBe(true);
    expect(result.current.isRowSelected("r5")).toBe(false);
  });

  it("selectAllOnPage toggles selection of visible rows", () => {
    const { result } = setup({ defaultPagination: { pageSize: 2 } });
    act(() => result.current.selectAllOnPage());
    expect(
      result.current.pageRows.every((r) =>
        result.current.isRowSelected(result.current.rowId(r)),
      ),
    ).toBe(true);
    act(() => result.current.selectAllOnPage());
    expect(
      result.current.pageRows.every((r) =>
        !result.current.isRowSelected(result.current.rowId(r)),
      ),
    ).toBe(true);
  });

  it("clearSelection empties the selection set", () => {
    const { result } = setup();
    act(() => result.current.toggleRow("r1"));
    act(() => result.current.toggleRow("r2"));
    act(() => result.current.clearSelection());
    expect(result.current.state.selection.size).toBe(0);
  });
});

describe("useDataTable — column visibility + order", () => {
  it("toggleColumnVisibility hides a column", () => {
    const { result } = setup();
    act(() => result.current.toggleColumnVisibility("score"));
    expect(result.current.visibleColumns.map((c) => c.id)).toEqual([
      "name",
      "team",
    ]);
  });

  it("setColumnOrder reorders visibleColumns", () => {
    const { result } = setup();
    act(() => result.current.setColumnOrder(["team", "name", "score"]));
    expect(result.current.visibleColumns.map((c) => c.id)).toEqual([
      "team",
      "name",
      "score",
    ]);
  });
});

describe("useDataTable — controlled", () => {
  it("respects controlled sort + fires onChange", () => {
    const onSortChange = vi.fn();
    type SortEntry = { id: string; direction: "asc" | "desc" };
    const initialProps: { sort: SortEntry[] } = { sort: [] };
    const { result, rerender } = renderHook(
      ({ sort }: { sort: SortEntry[] }) =>
        useDataTable<Row>({
          rows,
          columns,
          rowId: (r) => r.id,
          sort,
          onSortChange,
        }),
      { initialProps },
    );
    expect(result.current.state.sort).toEqual([]);
    act(() => result.current.toggleSort("score"));
    expect(onSortChange).toHaveBeenCalledWith([
      { id: "score", direction: "asc" },
    ]);
    // Controlled — still `[]` because the caller hasn't pushed the update.
    expect(result.current.state.sort).toEqual([]);
    // Now push the controlled update.
    rerender({ sort: [{ id: "score", direction: "asc" as const }] });
    expect(result.current.state.sort).toEqual([
      { id: "score", direction: "asc" },
    ]);
  });
});

describe("useDataTable — server mode", () => {
  it("skips local sort/filter; trusts rows + totalCount from caller", () => {
    const { result } = renderHook(() =>
      useDataTable<Row>({
        rows: rows.slice(0, 2),
        columns,
        rowId: (r) => r.id,
        mode: "server",
        totalCount: 25,
      }),
    );
    expect(result.current.processedRows).toHaveLength(2);
    expect(result.current.totalCount).toBe(25);
    // Local sort wouldn't re-sort — order is preserved from input.
    act(() => result.current.toggleSort("score"));
    expect(result.current.processedRows.map((r) => r.id)).toEqual(["r1", "r2"]);
  });
});

describe("useDataTable — column widths", () => {
  it("resizeColumn writes to state.columnWidths", () => {
    const { result } = setup();
    act(() => result.current.resizeColumn("name", 240));
    expect(result.current.state.columnWidths.name).toBe(240);
  });

  it("clamps width to the column's min/max bounds", () => {
    const { result } = renderHook(() =>
      useDataTable<Row>({
        rows,
        columns: [
          { id: "name", header: "Name", minWidth: 100, maxWidth: 300 },
          { id: "score", header: "Score" },
          { id: "team", header: "Team" },
        ],
        rowId: (r) => r.id,
      }),
    );
    act(() => result.current.resizeColumn("name", 50));
    expect(result.current.state.columnWidths.name).toBe(100);
    act(() => result.current.resizeColumn("name", 9999));
    expect(result.current.state.columnWidths.name).toBe(300);
  });

  it("resetColumnWidth removes the committed width", () => {
    const { result } = setup();
    act(() => result.current.resizeColumn("name", 240));
    act(() => result.current.resetColumnWidth("name"));
    expect(result.current.state.columnWidths.name).toBeUndefined();
  });

  it("seeds initial widths from ColumnDef.width", () => {
    const { result } = renderHook(() =>
      useDataTable<Row>({
        rows,
        columns: [
          { id: "name", header: "Name", width: 250 },
          { id: "score", header: "Score" },
          { id: "team", header: "Team" },
        ],
        rowId: (r) => r.id,
      }),
    );
    expect(result.current.state.columnWidths.name).toBe(250);
  });
});

describe("useDataTable — pinning", () => {
  it("pinColumn('start') puts the id in pinning.start", () => {
    const { result } = setup();
    act(() => result.current.pinColumn("team", "start"));
    expect(result.current.state.columnPinning.start).toContain("team");
    expect(result.current.state.columnPinning.end).not.toContain("team");
  });

  it("pinColumn('end') puts the id in pinning.end", () => {
    const { result } = setup();
    act(() => result.current.pinColumn("team", "end"));
    expect(result.current.state.columnPinning.end).toContain("team");
  });

  it("pinColumn(null) removes from both sides", () => {
    const { result } = setup();
    act(() => result.current.pinColumn("team", "start"));
    act(() => result.current.pinColumn("team", null));
    expect(result.current.state.columnPinning.start).not.toContain("team");
    expect(result.current.state.columnPinning.end).not.toContain("team");
  });

  it("switching sides doesn't leave stale entries", () => {
    const { result } = setup();
    act(() => result.current.pinColumn("team", "start"));
    act(() => result.current.pinColumn("team", "end"));
    expect(result.current.state.columnPinning.start).not.toContain("team");
    expect(result.current.state.columnPinning.end).toContain("team");
  });

  it("seeds from ColumnDef.pinned", () => {
    const { result } = renderHook(() =>
      useDataTable<Row>({
        rows,
        columns: [
          { id: "name", header: "Name", pinned: "start" },
          { id: "score", header: "Score" },
          { id: "team", header: "Team", pinned: "end" },
        ],
        rowId: (r) => r.id,
      }),
    );
    expect(result.current.state.columnPinning.start).toEqual(["name"]);
    expect(result.current.state.columnPinning.end).toEqual(["team"]);
  });
});
