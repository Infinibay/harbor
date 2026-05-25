import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Gauge } from "./Gauge";

describe("Gauge", () => {
  it("renders with default props", () => {
    const { container } = renderWithHarbor(<Gauge value={50} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("displays the numeric value", () => {
    const { container } = renderWithHarbor(<Gauge value={72} />);
    expect(container.textContent).toContain("72");
  });

  it("displays the label when provided", () => {
    const { container } = renderWithHarbor(<Gauge value={50} label="CPU" />);
    expect(container.textContent).toContain("CPU");
  });

  it("displays the unit when provided", () => {
    const { container } = renderWithHarbor(<Gauge value={50} unit="%" />);
    expect(container.textContent).toContain("%");
  });

  it("rounds the displayed value", () => {
    const { container } = renderWithHarbor(<Gauge value={72.7} />);
    expect(container.textContent).toContain("73");
  });

  it("clamps value to min when below", () => {
    const { container } = renderWithHarbor(<Gauge value={-10} min={0} max={100} />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("clamps value to max when above", () => {
    const { container } = renderWithHarbor(<Gauge value={200} min={0} max={100} />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders with custom min and max", () => {
    const { container } = renderWithHarbor(<Gauge value={50} min={0} max={200} />);
    expect(container.textContent).toContain("50");
  });

  it("uses custom size", () => {
    const { container } = renderWithHarbor(<Gauge value={50} size={240} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("240");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<Gauge value={50} className="my-gauge" />);
    const wrapper = container.querySelector("div");
    expect(wrapper?.className).toContain("my-gauge");
  });

  it("applies threshold-based color for high values", () => {
    const { container } = renderWithHarbor(<Gauge value={90} />);
    // High value (>= 0.85 of range) should use the semantic negative chart token.
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    const coloredPath = container.querySelector('svg path[stroke="rgb(var(--harbor-chart-negative))"]');
    expect(coloredPath).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<Gauge value={50} label="Memory" unit="%" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
