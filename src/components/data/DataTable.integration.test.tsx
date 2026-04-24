import { describe, it, expect, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { DataTable, type ColumnDef } from "./DataTable";

/**
 * End-to-end integration test. Wires a realistic subset of features
 * together and drives them in sequence, so regressions in how features
 * interact (rather than each feature in isolation) get caught early.
 *
 * The per-feature unit tests live in `DataTable.test.tsx` —
 * this file is the "smoke flow" that protects the cross-feature story.
 */

interface Service {
  id: string;
  name: string;
  team: string;
  cpu: number;
  requests: number;
}

const services: Service[] = [
  { id: "s1", name: "api-gateway", team: "platform", cpu: 42, requests: 12400 },
  { id: "s2", name: "auth-service", team: "identity", cpu: 88, requests: 4200 },
  { id: "s3", name: "billing", team: "payments", cpu: 18, requests: 620 },
  { id: "s4", name: "notifier", team: "platform", cpu: 2, requests: 0 },
  { id: "s5", name: "worker-pool", team: "platform", cpu: 31, requests: 8900 },
  { id: "s6", name: "ingester", team: "data", cpu: 55, requests: 1200 },
  { id: "s7", name: "search-api", team: "search", cpu: 67, requests: 9700 },
];

const columns: ColumnDef<Service>[] = [
  { id: "name", header: "Name", sortable: true, filterable: { type: "text" } },
  { id: "team", header: "Team", sortable: true },
  {
    id: "cpu",
    header: "CPU",
    sortable: true,
    align: "end",
    aggregate: "avg",
  },
  {
    id: "requests",
    header: "Requests",
    sortable: true,
    align: "end",
    aggregate: "sum",
  },
];

describe("DataTable — integration: sort → filter → paginate → select → export → axe", () => {
  it("drives a complete user flow without regressions", async () => {
    const onExport = vi.fn();
    const createObjectURL = vi.spyOn(URL, "createObjectURL").mockImplementation(
      (() => {
        onExport();
        return "blob:mock";
      }) as typeof URL.createObjectURL,
    );
    const revokeObjectURL = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});

    const onSelectionChange = vi.fn();
    const onRowAction = vi.fn();

    const { user, container } = renderWithHarbor(
      <DataTable
        rows={services}
        columns={columns}
        rowId={(r) => r.id}
        selectable
        onSelectionChange={onSelectionChange}
        defaultPagination={{ pageSize: 3 }}
        showGlobalSearch
        globalSearchDebounce={0}
        showDensityToggle
        showExport
        showColumnPicker
        rowActions={(row) => [
          { label: "Restart", onClick: () => onRowAction("restart", row.id) },
          { label: "Delete", danger: true, onClick: () => onRowAction("delete", row.id) },
        ]}
      />,
    );

    /* 1 — grid renders with the expected skeleton */
    expect(screen.getByRole("grid")).toHaveAttribute("aria-rowcount", "7");

    /* 2 — sort CPU descending via header click */
    await user.click(screen.getByRole("columnheader", { name: /CPU/i }));
    await user.click(screen.getByRole("columnheader", { name: /CPU/i }));
    // Now the first visible row should be the highest CPU (auth-service 88).
    const firstVisibleRow = within(screen.getByRole("grid"))
      .getAllByRole("row")
      .find(
        (r) =>
          r.getAttribute("aria-rowindex") &&
          Number(r.getAttribute("aria-rowindex")) > 1,
      );
    expect(firstVisibleRow?.textContent).toContain("auth-service");

    /* 3 — use the global search to filter to team "platform" */
    const searchbox = screen.getByRole("searchbox");
    await user.type(searchbox, "platform");
    // Debounce=0 commits immediately. Three platform rows: api-gateway,
    // notifier, worker-pool.
    const rowsAfterFilter = within(screen.getByRole("grid"))
      .getAllByRole("row")
      .filter((r) => Number(r.getAttribute("aria-rowindex") ?? 0) > 1);
    expect(rowsAfterFilter.length).toBe(3);
    expect(rowsAfterFilter.every((r) => r.textContent?.includes("platform"))).toBe(
      true,
    );

    /* 4 — bulk-select current page via the header checkbox */
    await user.click(screen.getAllByRole("checkbox")[0]);
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.arrayContaining(["s1", "s4", "s5"]),
    );

    /* 5 — clear the filter, flip density to compact */
    await user.clear(searchbox);
    await user.click(screen.getByRole("button", { name: /Compact/i }));
    // Density button now has aria-pressed=true for compact.
    expect(
      screen.getByRole("button", { name: /Compact/i }),
    ).toHaveAttribute("aria-pressed", "true");

    /* 6 — fire a row action on the first visible row */
    const actionButtons = screen.getAllByRole("button", {
      name: /Row actions/i,
    });
    await user.click(actionButtons[0]);
    await user.click(await screen.findByText("Restart"));
    expect(onRowAction).toHaveBeenCalledWith("restart", expect.any(String));

    /* 7 — export as CSV; download hook ran */
    await user.click(screen.getByRole("button", { name: /Export/i }));
    await user.click(await screen.findByText(/Export as CSV/i));
    expect(onExport).toHaveBeenCalled();

    /* 8 — axe audit on the final state, with filters cleared +
     *      selection present + row-actions column visible. */
    expect(await axe(container)).toHaveNoViolations();

    createObjectURL.mockRestore();
    revokeObjectURL.mockRestore();
  });
});
