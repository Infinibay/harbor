import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Sparkline } from "./Sparkline";

describe("Sparkline", () => {
  const data = [10, 20, 15, 30, 25];

  it("renders an SVG with the given data", () => {
    const { container } = renderWithHarbor(<Sparkline data={data} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute("width")).toBe("100");
    expect(svg?.getAttribute("height")).toBe("28");
  });

  it("returns null when data is empty", () => {
    const { container } = renderWithHarbor(<Sparkline data={[]} />);
    // Only the HarborProvider's style tag should be present
    expect(container.querySelector("svg")).toBeNull();
  });

  it("renders a single data point", () => {
    const { container } = renderWithHarbor(<Sparkline data={[42]} />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders the line path", () => {
    const { container } = renderWithHarbor(<Sparkline data={data} />);
    const paths = container.querySelectorAll("svg path");
    // Area path + line path
    expect(paths.length).toBeGreaterThanOrEqual(2);
  });

  it("renders a dot at the last point by default (showDot=true)", () => {
    const { container } = renderWithHarbor(<Sparkline data={data} />);
    const circle = container.querySelector("svg circle");
    expect(circle).toBeTruthy();
  });

  it("hides the dot when showDot=false", () => {
    const { container } = renderWithHarbor(<Sparkline data={data} showDot={false} />);
    const circle = container.querySelector("svg circle");
    expect(circle).toBeNull();
  });

  it("respects custom width and height", () => {
    const { container } = renderWithHarbor(<Sparkline data={data} width={200} height={50} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("200");
    expect(svg?.getAttribute("height")).toBe("50");
  });

  it("applies custom stroke and fill colors", () => {
    const { container } = renderWithHarbor(
      <Sparkline data={data} stroke="#ff0000" fill="rgba(255,0,0,0.1)" />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    const paths = container.querySelectorAll("svg path");
    // Line path should use the stroke
    const linePath = Array.from(paths).find((p) => p.getAttribute("stroke") === "#ff0000");
    expect(linePath).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<Sparkline data={data} className="my-spark" />);
    const svg = container.querySelector("svg");
    expect(svg?.className.baseVal ?? svg?.getAttribute("class")).toContain("my-spark");
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<Sparkline data={data} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
