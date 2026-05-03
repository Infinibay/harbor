import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { FacetedSearch, type FilterGroup } from "./FacetedSearch";

const groups: FilterGroup[] = [
  {
    id: "status",
    label: "Status",
    options: [
      { value: "active", label: "Active" },
      { value: "archived", label: "Archived" },
    ],
    defaultExpanded: true,
  },
];

describe("FacetedSearch", () => {
  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};
    vi.stubGlobal("localStorage", {
      getItem: vi.fn((k: string) => storage[k] ?? null),
      setItem: vi.fn((k: string, v: string) => { storage[k] = v; }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders search input", () => {
    renderWithHarbor(
      <FacetedSearch groups={groups} value={{}} onChange={vi.fn()} />,
    );
    expect(screen.getByPlaceholderText("Search…")).toBeInTheDocument();
  });

  it("renders Views button", () => {
    renderWithHarbor(
      <FacetedSearch groups={groups} value={{}} onChange={vi.fn()} />,
    );
    expect(screen.getByText(/Views/)).toBeInTheDocument();
  });

  it("renders FilterPanel below", () => {
    const { container } = renderWithHarbor(
      <FacetedSearch groups={groups} value={{}} onChange={vi.fn()} />,
    );
    expect(container.textContent).toContain("Status");
    expect(container.textContent).toContain("Active");
  });

  it("renders active filter chips", () => {
    const { container } = renderWithHarbor(
      <FacetedSearch
        groups={groups}
        value={{ status: ["active"] }}
        onChange={vi.fn()}
      />,
    );
    // "Active" appears in both the chip and the FilterPanel
    const allActive = screen.getAllByText("Active");
    expect(allActive.length).toBeGreaterThanOrEqual(2);
  });

  it("fires onChange when chip is removed", async () => {
    const onChange = vi.fn();
    const { user } = renderWithHarbor(
      <FacetedSearch
        groups={groups}
        value={{ status: ["active"] }}
        onChange={onChange}
      />,
    );
    // Chip has a × button
    const chipCloseBtns = screen.getAllByText("×");
    // The last × is the chip close button (first is Views dropdown if open)
    await user.click(chipCloseBtns[0]);
    expect(onChange).toHaveBeenCalledWith({ status: [] });
  });

  it("renders Clear all button when filters or query present", () => {
    renderWithHarbor(
      <FacetedSearch
        groups={groups}
        value={{ status: ["active"] }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Clear all")).toBeInTheDocument();
  });

  it("fires onQueryChange when typing", async () => {
    const onQueryChange = vi.fn();
    const { user } = renderWithHarbor(
      <FacetedSearch
        groups={groups}
        value={{}}
        onChange={vi.fn()}
        query=""
        onQueryChange={onQueryChange}
      />,
    );
    const input = screen.getByPlaceholderText("Search…");
    await user.type(input, "test");
    expect(onQueryChange).toHaveBeenCalled();
  });

  it("renders group label in chip", () => {
    const { container } = renderWithHarbor(
      <FacetedSearch
        groups={groups}
        value={{ status: ["active"] }}
        onChange={vi.fn()}
      />,
    );
    // Chip shows group label — the label text is uppercase in the chip
    const chips = container.querySelectorAll(".bg-fuchsia-500\\/15");
    expect(chips.length).toBeGreaterThan(0);
  });
  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <FacetedSearch
        groups={groups}
        value={{}}
        onChange={vi.fn()}
        className="my-search"
      />,
    );
    expect(container.querySelector(".my-search")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <FacetedSearch groups={groups} value={{}} onChange={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
