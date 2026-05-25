import { describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { DataWorkspace } from "./DataWorkspace";
import type { ColumnDef } from "./table/types";

interface Row {
  id: string;
  name: string;
  status: "open" | "closed";
}

const rows: Row[] = [
  { id: "r1", name: "Alpha", status: "open" },
  { id: "r2", name: "Bravo", status: "closed" },
];

const columns: ColumnDef<Row>[] = [
  { id: "name", header: "Name", sortable: true },
  {
    id: "status",
    header: "Status",
    sortable: true,
    filterable: {
      type: "select",
      options: [
        { value: "open", label: "Open" },
        { value: "closed", label: "Closed" },
      ],
    },
  },
];

describe("DataWorkspace", () => {
  it("renders workspace chrome around the DataTable", () => {
    renderWithHarbor(
      <DataWorkspace
        title="Accounts"
        description="Customer account review"
        actions={<button type="button">New account</button>}
        metrics={[
          { label: "Open", value: "12", tone: "success" },
          { label: "Blocked", value: "2", tone: "danger" },
        ]}
        rows={rows}
        columns={columns}
        rowId={(row) => row.id}
      />,
    );

    expect(screen.getByRole("heading", { name: "Accounts" })).toBeInTheDocument();
    expect(screen.getByText("Customer account review")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New account" })).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByText("Blocked")).toBeInTheDocument();
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("renders saved views as tabs and reports changes", async () => {
    const onViewChange = vi.fn();
    const { user } = renderWithHarbor(
      <DataWorkspace
        savedViews={[
          { id: "all", label: "All", count: 2 },
          { id: "open", label: "Open", count: 1 },
        ]}
        activeViewId="all"
        onViewChange={onViewChange}
        rows={rows}
        columns={columns}
        rowId={(row) => row.id}
      />,
    );

    expect(screen.getByRole("tablist", { name: "Saved views" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /All/ })).toHaveAttribute("aria-selected", "true");

    await user.click(screen.getByRole("tab", { name: /Open/ }));

    expect(onViewChange).toHaveBeenCalledWith("open");
  });

  it("defaults saved views to the first tab and keeps zero counts visible", () => {
    renderWithHarbor(
      <DataWorkspace
        savedViews={[
          { id: "all", label: "All", count: 0 },
          { id: "open", label: "Open", count: 1 },
        ]}
        rows={rows}
        columns={columns}
        rowId={(row) => row.id}
      />,
    );

    expect(screen.getByRole("tab", { name: /All/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("keeps saved view selection internally when activeViewId is not controlled", async () => {
    const onViewChange = vi.fn();
    const { user } = renderWithHarbor(
      <DataWorkspace
        savedViews={[
          { id: "all", label: "All" },
          { id: "open", label: "Open" },
        ]}
        onViewChange={onViewChange}
        rows={rows}
        columns={columns}
        rowId={(row) => row.id}
      />,
    );

    expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await user.click(screen.getByRole("tab", { name: "Open" }));

    expect(screen.getByRole("tab", { name: "Open" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(onViewChange).toHaveBeenCalledWith("open");
  });

  it("keeps server saved view selection internally when query is not controlled", async () => {
    const onQueryChange = vi.fn();
    const { user } = renderWithHarbor(
      <DataWorkspace
        savedViews={[
          { id: "all", label: "All" },
          { id: "open", label: "Open" },
        ]}
        dataSource={{
          rows,
          totalCount: rows.length,
          defaultQuery: { viewId: "all" },
          onQueryChange,
        }}
        columns={columns}
        rowId={(row) => row.id}
      />,
    );

    expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await user.click(screen.getByRole("tab", { name: "Open" }));

    expect(screen.getByRole("tab", { name: "Open" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(onQueryChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        viewId: "open",
        pagination: { page: 0, pageSize: 25 },
      }),
    );
  });

  it("supports keyboard navigation across saved view tabs", async () => {
    const onViewChange = vi.fn();
    const { user } = renderWithHarbor(
      <DataWorkspace
        savedViews={[
          { id: "all", label: "All" },
          { id: "open", label: "Open" },
          { id: "closed", label: "Closed" },
        ]}
        activeViewId="open"
        onViewChange={onViewChange}
        rows={rows}
        columns={columns}
        rowId={(row) => row.id}
      />,
    );

    screen.getByRole("tab", { name: "Open" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Closed" })).toHaveFocus();
    expect(onViewChange).toHaveBeenLastCalledWith("closed");

    await user.keyboard("{Home}");

    expect(screen.getByRole("tab", { name: "All" })).toHaveFocus();
    expect(onViewChange).toHaveBeenLastCalledWith("all");

    await user.keyboard("{End}");

    expect(screen.getByRole("tab", { name: "Closed" })).toHaveFocus();
    expect(onViewChange).toHaveBeenLastCalledWith("closed");
  });

  it("renders a bulk action bar when rows are selected", async () => {
    const onArchive = vi.fn();
    const { user } = renderWithHarbor(
      <DataWorkspace
        selectedCount={2}
        bulkActions={[{ id: "archive", label: "Archive", onClick: onArchive }]}
        rows={rows}
        columns={columns}
        rowId={(row) => row.id}
      />,
    );

    const toolbar = screen.getByRole("toolbar", { name: "Bulk actions" });
    expect(toolbar).toHaveTextContent("2 selected");

    await user.click(within(toolbar).getByRole("button", { name: "Archive" }));

    expect(onArchive).toHaveBeenCalledTimes(1);
  });

  it("derives the bulk action count from table selection", async () => {
    const onArchive = vi.fn();
    const onSelectionChange = vi.fn();
    const { user } = renderWithHarbor(
      <DataWorkspace
        bulkActions={[{ id: "archive", label: "Archive", onClick: onArchive }]}
        onSelectionChange={onSelectionChange}
        rows={rows}
        columns={columns}
        rowId={(row) => row.id}
      />,
    );

    expect(screen.queryByRole("toolbar", { name: "Bulk actions" })).not.toBeInTheDocument();

    await user.click(screen.getAllByRole("checkbox")[1]);

    expect(onSelectionChange).toHaveBeenLastCalledWith(["r1"]);
    const toolbar = screen.getByRole("toolbar", { name: "Bulk actions" });
    expect(toolbar).toHaveTextContent("1 selected");

    await user.click(within(toolbar).getByRole("button", { name: "Archive" }));
    expect(onArchive).toHaveBeenCalledTimes(1);
  });

  it("renders an optional detail panel alongside the table", () => {
    renderWithHarbor(
      <DataWorkspace
        detailPanelLabel="Account details"
        detailPanel={<div>Selected account</div>}
        rows={rows}
        columns={columns}
        rowId={(row) => row.id}
      />,
    );

    expect(screen.getByRole("complementary", { name: "Account details" })).toHaveTextContent("Selected account");
  });

  it("enables table workspace tools by default", () => {
    renderWithHarbor(
      <DataWorkspace rows={rows} columns={columns} rowId={(row) => row.id} />,
    );

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Columns/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Export/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Compact/i })).toBeInTheDocument();
  });

  it("renders workspace facets and filters client-side rows", async () => {
    const onFiltersChange = vi.fn();
    const { user } = renderWithHarbor(
      <DataWorkspace
        rows={rows}
        columns={columns}
        rowId={(row) => row.id}
        onFiltersChange={onFiltersChange}
        facets={[
          {
            id: "status",
            label: "Status",
            columnId: "status",
            options: [
              { value: "open", label: "Open", count: 1 },
              { value: "closed", label: "Closed", count: 1 },
            ],
          },
        ]}
      />,
    );

    expect(screen.getByLabelText("Workspace filters")).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Bravo")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Open1/ }));

    expect(onFiltersChange).toHaveBeenLastCalledWith([
      { id: "status", value: ["open"] },
    ]);
    expect(screen.getByRole("button", { name: /Open1/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Bravo")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Open1/ }));

    expect(onFiltersChange).toHaveBeenLastCalledWith([]);
    expect(screen.getByText("Bravo")).toBeInTheDocument();
  });

  it("wires server data source query state into sort, pagination, search and views", async () => {
    const onQueryChange = vi.fn();
    const { user } = renderWithHarbor(
      <DataWorkspace
        savedViews={[
          { id: "all", label: "All" },
          { id: "open", label: "Open" },
        ]}
        activeViewId="all"
        dataSource={{
          rows: [rows[1], rows[0]],
          totalCount: 42,
          defaultQuery: { pagination: { page: 1, pageSize: 2 } },
          onQueryChange,
        }}
        columns={columns}
        rowId={(row) => row.id}
        globalSearchDebounce={0}
      />,
    );

    expect(screen.getByText("Bravo")).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText(/Showing 3–4 of 42/)).toBeInTheDocument();

    await user.click(screen.getByRole("columnheader", { name: /Name/ }));
    expect(onQueryChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        sort: [{ id: "name", direction: "asc" }],
        pagination: { page: 0, pageSize: 2 },
      }),
    );

    await user.clear(screen.getByRole("searchbox"));
    await user.type(screen.getByRole("searchbox"), "alpha");
    expect(onQueryChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        globalFilter: "alpha",
        pagination: { page: 0, pageSize: 2 },
      }),
    );

    await user.click(screen.getByRole("tab", { name: "Open" }));
    expect(onQueryChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        viewId: "open",
        pagination: { page: 0, pageSize: 2 },
      }),
    );
  });

  it("wires workspace facets into server query state", async () => {
    const onQueryChange = vi.fn();
    const { user } = renderWithHarbor(
      <DataWorkspace
        dataSource={{
          rows,
          totalCount: 42,
          defaultQuery: { pagination: { page: 2, pageSize: 25 } },
          onQueryChange,
        }}
        columns={columns}
        rowId={(row) => row.id}
        facets={[
          {
            id: "status",
            label: "Status",
            columnId: "status",
            options: [{ value: "closed", label: "Closed" }],
          },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Closed" }));

    expect(onQueryChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filters: [{ id: "status", value: ["closed"] }],
        pagination: { page: 0, pageSize: 25 },
      }),
    );
  });

  it("renders product-ready empty and error states", async () => {
    const onRetry = vi.fn();
    const { rerender } = renderWithHarbor(
      <DataWorkspace
        rows={[]}
        columns={columns}
        rowId={(row) => row.id}
        emptyStateContent={{
          title: "No accounts yet",
          description: "Create a member or adjust filters.",
          action: <button type="button">Invite member</button>,
        }}
      />,
    );

    expect(screen.getByText("No accounts yet")).toBeInTheDocument();
    expect(screen.getByText("Create a member or adjust filters.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Invite member" })).toBeInTheDocument();

    rerender(
      <DataWorkspace
        rows={rows}
        columns={columns}
        rowId={(row) => row.id}
        error="failed"
        errorStateContent={{
          title: "Could not load accounts",
          description: "The server rejected the request.",
        }}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Could not load accounts");
    expect(screen.getByText("The server rejected the request.")).toBeInTheDocument();
    await screen.findByRole("button", { name: "Retry" });
  });

  it("renders a controlled detail drawer and closes it with keyboard", async () => {
    const onClose = vi.fn();
    const { user } = renderWithHarbor(
      <DataWorkspace
        detailDrawerOpen
        detailDrawerLabel="Account drawer"
        detailDrawer={<button type="button">Focus target</button>}
        onDetailDrawerClose={onClose}
        rows={rows}
        columns={columns}
        rowId={(row) => row.id}
      />,
    );

    const dialog = await screen.findByRole("dialog", { name: "Account drawer" });
    expect(dialog).toHaveTextContent("Focus target");

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("adds workspace-level inline edit commit handlers", async () => {
    const onCommit = vi.fn();
    const { user } = renderWithHarbor(
      <DataWorkspace
        rows={rows}
        columns={columns}
        rowId={(row) => row.id}
        inlineEdit={{
          columns: {
            name: {
              type: "text",
              validate: (value) =>
                typeof value === "string" && value.length >= 2
                  ? true
                  : "Too short",
            },
          },
          onCommit,
        }}
      />,
    );

    await user.dblClick(screen.getByText("Alpha"));
    const input = screen.getByDisplayValue("Alpha");
    await user.clear(input);
    await user.type(input, "Alicia");
    await user.keyboard("{Enter}");

    expect(onCommit).toHaveBeenCalledWith(rows[0], "name", "Alicia");
  });

  it("a11y: no violations for a composed data workspace", async () => {
    const { container } = renderWithHarbor(
      <DataWorkspace
        title="Review queue"
        savedViews={[{ id: "all", label: "All" }]}
        activeViewId="all"
        selectedCount={1}
        bulkActions={[{ id: "assign", label: "Assign", onClick: () => {} }]}
        detailPanel={<section aria-label="Record details">Details</section>}
        detailDrawerOpen
        detailDrawerLabel="Record drawer"
        detailDrawer={<button type="button">Close-ready content</button>}
        onDetailDrawerClose={() => {}}
        rows={rows}
        columns={columns}
        rowId={(row) => row.id}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
