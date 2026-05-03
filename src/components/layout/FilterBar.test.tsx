import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { FilterBar, type FilterDef, type AppliedFilter } from "./FilterBar";

const filters: FilterDef[] = [
  { id: "status", label: "Status", options: ["Active", "Inactive"] },
  { id: "role", label: "Role", options: ["Admin", "User"] },
];

describe("FilterBar", () => {
  it("renders Add filter button when no filters applied", () => {
    renderWithHarbor(
      <FilterBar filters={filters} applied={[]} onChange={vi.fn()} />,
    );
    expect(screen.getByText(/Add filter/)).toBeInTheDocument();
  });

  it("renders applied filter pills", () => {
    const applied: AppliedFilter[] = [
      { id: "status", label: "Status", value: "Active" },
    ];
    renderWithHarbor(
      <FilterBar filters={filters} applied={applied} onChange={vi.fn()} />,
    );
    expect(screen.getByText("Status:")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders remove × button on applied filters", () => {
    const applied: AppliedFilter[] = [
      { id: "status", label: "Status", value: "Active" },
    ];
    const { container } = renderWithHarbor(
      <FilterBar filters={filters} applied={applied} onChange={vi.fn()} />,
    );
    const removeBtn = container.querySelector("button");
    expect(removeBtn).toBeTruthy();
  });

  it("removes filter on × click", async () => {
    const onChange = vi.fn();
    const applied: AppliedFilter[] = [
      { id: "status", label: "Status", value: "Active" },
    ];
    const { user, container } = renderWithHarbor(
      <FilterBar filters={filters} applied={applied} onChange={onChange} />,
    );
    // Click the × button on the pill
    const removeBtn = screen.getByText("×");
    await user.click(removeBtn);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("opens filter picker on Add filter click", async () => {
    const { user } = renderWithHarbor(
      <FilterBar filters={filters} applied={[]} onChange={vi.fn()} />,
    );
    await user.click(screen.getByText(/Add filter/));
    // Should show filter label and options
    expect(screen.getByText("Status:")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("applies filter on option click", async () => {
    const onChange = vi.fn();
    const { user } = renderWithHarbor(
      <FilterBar filters={filters} applied={[]} onChange={onChange} />,
    );
    await user.click(screen.getByText(/Add filter/));
    await user.click(screen.getByText("Active"));
    expect(onChange).toHaveBeenCalledWith([
      { id: "status", label: "Status", value: "Active" },
    ]);
  });

  it("shows clear all button when filters applied", () => {
    const applied: AppliedFilter[] = [
      { id: "status", label: "Status", value: "Active" },
    ];
    renderWithHarbor(
      <FilterBar filters={filters} applied={applied} onChange={vi.fn()} />,
    );
    expect(screen.getByText("clear all")).toBeInTheDocument();
  });

  it("clears all on clear all click", async () => {
    const onChange = vi.fn();
    const applied: AppliedFilter[] = [
      { id: "status", label: "Status", value: "Active" },
    ];
    const { user } = renderWithHarbor(
      <FilterBar filters={filters} applied={applied} onChange={onChange} />,
    );
    await user.click(screen.getByText("clear all"));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("disables Add filter when all filters applied", () => {
    const applied: AppliedFilter[] = [
      { id: "status", label: "Status", value: "Active" },
      { id: "role", label: "Role", value: "Admin" },
    ];
    renderWithHarbor(
      <FilterBar filters={filters} applied={applied} onChange={vi.fn()} />,
    );
    expect(screen.getByText(/Add filter/).closest("button")).toBeDisabled();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <FilterBar
        filters={filters}
        applied={[]}
        onChange={vi.fn()}
        className="my-filter"
      />,
    );
    expect(container.querySelector(".my-filter")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <FilterBar filters={filters} applied={[]} onChange={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
