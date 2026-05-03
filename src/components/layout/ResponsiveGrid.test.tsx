import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ResponsiveGrid } from "./ResponsiveGrid";

describe("ResponsiveGrid", () => {
  it("renders children in a grid", () => {
    const { container } = renderWithHarbor(
      <ResponsiveGrid>
        <span>A</span>
        <span>B</span>
      </ResponsiveGrid>,
    );
    expect(container.querySelector(".grid")).toBeTruthy();
    expect(container.textContent).toContain("A");
    expect(container.textContent).toContain("B");
  });

  it("applies 1 column by default", () => {
    const { container } = renderWithHarbor(<ResponsiveGrid>X</ResponsiveGrid>);
    const grid = container.querySelector(".grid");
    expect(grid?.className).toContain("grid-cols-1");
  });

  it("applies custom columns number", () => {
    const { container } = renderWithHarbor(
      <ResponsiveGrid columns={3}>X</ResponsiveGrid>,
    );
    const grid = container.querySelector(".grid");
    expect(grid?.className).toContain("grid-cols-3");
  });

  it("applies responsive columns object", () => {
    const { container } = renderWithHarbor(
      <ResponsiveGrid columns={{ base: 1, md: 2, lg: 3 }}>X</ResponsiveGrid>,
    );
    const grid = container.querySelector(".grid");
    expect(grid?.className).toContain("grid-cols-1");
    expect(grid?.className).toContain("md:grid-cols-2");
    expect(grid?.className).toContain("lg:grid-cols-3");
  });

  it("applies default gap-4", () => {
    const { container } = renderWithHarbor(<ResponsiveGrid>X</ResponsiveGrid>);
    const grid = container.querySelector(".grid");
    expect(grid?.className).toContain("gap-4");
  });

  it("applies custom gap", () => {
    const { container } = renderWithHarbor(
      <ResponsiveGrid gap={6}>X</ResponsiveGrid>,
    );
    const grid = container.querySelector(".grid");
    expect(grid?.className).toContain("gap-6");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <ResponsiveGrid className="my-grid">X</ResponsiveGrid>,
    );
    expect(container.querySelector(".my-grid")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <ResponsiveGrid columns={2}>
        <span>A</span>
        <span>B</span>
      </ResponsiveGrid>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
