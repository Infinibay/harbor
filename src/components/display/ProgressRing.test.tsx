import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ProgressRing } from "./ProgressRing";

describe("ProgressRing", () => {
  it("renders SVG with default size 96", () => {
    const { container } = renderWithHarbor(<ProgressRing value={50} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("96");
    expect(svg?.getAttribute("height")).toBe("96");
  });

  it("renders with custom size", () => {
    const { container } = renderWithHarbor(<ProgressRing value={50} size={120} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("120");
  });

  it("displays percentage label by default", () => {
    const { container } = renderWithHarbor(<ProgressRing value={50} />);
    expect(container.textContent).toContain("50%");
  });

  it("displays custom label", () => {
    const { container } = renderWithHarbor(<ProgressRing value={50} label="OK" />);
    expect(container.textContent).toContain("OK");
  });

  it("renders with custom stroke", () => {
    const { container } = renderWithHarbor(<ProgressRing value={50} stroke={12} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("clamps value to max", () => {
    const { container } = renderWithHarbor(<ProgressRing value={200} max={100} />);
    expect(container.textContent).toContain("100%");
  });

  it("applies tone gradient", () => {
    const { container } = renderWithHarbor(<ProgressRing value={50} tone="green" />);
    const grad = container.querySelector("svg linearGradient");
    expect(grad).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<ProgressRing value={75} label="Test" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
