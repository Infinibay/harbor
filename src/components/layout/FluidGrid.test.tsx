import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { FluidGrid } from "./FluidGrid";

describe("FluidGrid", () => {
  it("renders children in a grid", () => {
    const { container } = renderWithHarbor(
      <FluidGrid>
        <span>A</span>
        <span>B</span>
      </FluidGrid>,
    );
    expect(container.querySelector(".grid")).toBeTruthy();
    expect(container.textContent).toContain("A");
    expect(container.textContent).toContain("B");
  });

  it("sets gridTemplateColumns via style", () => {
    const { container } = renderWithHarbor(
      <FluidGrid>
        <span>X</span>
      </FluidGrid>,
    );
    const grid = container.querySelector(".grid");
    expect(grid?.getAttribute("style")).toContain("repeat");
  });

  it("renders with default gap", () => {
    const { container } = renderWithHarbor(
      <FluidGrid>
        <span>X</span>
      </FluidGrid>,
    );
    const grid = container.querySelector(".grid");
    expect(grid?.getAttribute("style")).toContain("16");
  });

  it("renders with custom gap", () => {
    const { container } = renderWithHarbor(
      <FluidGrid gap={8}>
        <span>X</span>
      </FluidGrid>,
    );
    const grid = container.querySelector(".grid");
    expect(grid?.getAttribute("style")).toContain("8");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <FluidGrid className="my-grid">
        <span>X</span>
      </FluidGrid>,
    );
    expect(container.querySelector(".my-grid")).toBeTruthy();
  });

  it("renders empty children gracefully", () => {
    const { container } = renderWithHarbor(<FluidGrid />);
    expect(container.querySelector(".grid")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <FluidGrid>
        <span>A</span>
        <span>B</span>
      </FluidGrid>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
