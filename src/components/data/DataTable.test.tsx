import { describe, it, expect, vi } from "vitest";
import { screen, within } from "@testing-library/react";
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
