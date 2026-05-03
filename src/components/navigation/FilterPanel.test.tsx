import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { FilterPanel, type FilterGroup } from "./FilterPanel";

const groups: FilterGroup[] = [
  {
    id: "status",
    label: "Status",
    options: [
      { value: "active", label: "Active", count: 42 },
      { value: "inactive", label: "Inactive" },
    ],
    defaultExpanded: true,
  },
  {
    id: "role",
    label: "Role",
    type: "radio",
    options: [
      { value: "admin", label: "Admin" },
      { value: "user", label: "User" },
    ],
    defaultExpanded: true,
  },
];

describe("FilterPanel", () => {
  it("renders group labels", () => {
    renderWithHarbor(
      <FilterPanel groups={groups} value={{}} onChange={vi.fn()} />,
    );
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
  });

  it("renders option labels", () => {
    renderWithHarbor(
      <FilterPanel groups={groups} value={{}} onChange={vi.fn()} />,
    );
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("renders counts when provided", () => {
    const { container } = renderWithHarbor(
      <FilterPanel groups={groups} value={{}} onChange={vi.fn()} />,
    );
    expect(container.textContent).toContain("42");
  });

  it("renders checkboxes for checkbox type", () => {
    const { container } = renderWithHarbor(
      <FilterPanel groups={groups} value={{}} onChange={vi.fn()} />,
    );
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBe(2);
  });

  it("renders radios for radio type", () => {
    const { container } = renderWithHarbor(
      <FilterPanel groups={groups} value={{}} onChange={vi.fn()} />,
    );
    const radios = container.querySelectorAll('input[type="radio"]');
    expect(radios.length).toBe(2);
  });

  it("fires onChange when checkbox is toggled", async () => {
    const onChange = vi.fn();
    const { user } = renderWithHarbor(
      <FilterPanel groups={groups} value={{}} onChange={onChange} />,
    );
    await user.click(screen.getByText("Active"));
    expect(onChange).toHaveBeenCalledWith({ status: ["active"] });
  });

  it("fires onChange when radio is selected", async () => {
    const onChange = vi.fn();
    const { user } = renderWithHarbor(
      <FilterPanel groups={groups} value={{}} onChange={onChange} />,
    );
    await user.click(screen.getByText("Admin"));
    expect(onChange).toHaveBeenCalledWith({ role: ["admin"] });
  });

  it("removes checkbox value on second click", async () => {
    const onChange = vi.fn();
    const { user } = renderWithHarbor(
      <FilterPanel groups={groups} value={{ status: ["active"] }} onChange={onChange} />,
    );
    await user.click(screen.getByText("Active"));
    expect(onChange).toHaveBeenCalledWith({ status: [] });
  });

  it("renders Clear button when filters applied and onClear provided", () => {
    renderWithHarbor(
      <FilterPanel
        groups={groups}
        value={{ status: ["active"] }}
        onChange={vi.fn()}
        onClear={vi.fn()}
      />,
    );
    expect(screen.getByText(/Clear/)).toBeInTheDocument();
  });

  it("does not render Clear when no filters applied", () => {
    renderWithHarbor(
      <FilterPanel
        groups={groups}
        value={{}}
        onChange={vi.fn()}
        onClear={vi.fn()}
      />,
    );
    expect(screen.queryByText(/Clear/)).toBeNull();
  });

  it("renders default title Filters", () => {
    renderWithHarbor(
      <FilterPanel groups={groups} value={{}} onChange={vi.fn()} />,
    );
    expect(screen.getByText("Filters")).toBeInTheDocument();
  });

  it("renders custom title", () => {
    renderWithHarbor(
      <FilterPanel
        groups={groups}
        value={{}}
        onChange={vi.fn()}
        title="Refine"
      />,
    );
    expect(screen.getByText("Refine")).toBeInTheDocument();
  });

  it("renders selected count badge", () => {
    renderWithHarbor(
      <FilterPanel
        groups={groups}
        value={{ status: ["active"] }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <FilterPanel
        groups={groups}
        value={{}}
        onChange={vi.fn()}
        className="my-fp"
      />,
    );
    expect(container.querySelector(".my-fp")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <FilterPanel groups={groups} value={{}} onChange={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
