import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { MetricHeatmap, type HeatmapCell } from "./MetricHeatmap";

const rows = ["Mon", "Tue", "Wed"];
const cols = ["00:00", "06:00", "12:00"];
const cells: HeatmapCell[] = [
  { r: 0, c: 0, v: 0.1 },
  { r: 0, c: 1, v: 0.5 },
  { r: 0, c: 2, v: 0.9 },
  { r: 1, c: 0, v: 0.3 },
  { r: 1, c: 1, v: 0.7 },
  { r: 2, c: 2, v: 0.2 },
];

describe("MetricHeatmap", () => {
  it("renders an SVG with the correct dimensions", () => {
    const { container } = renderWithHarbor(
      <MetricHeatmap rows={rows} cols={cols} cells={cells} />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("renders column headers", () => {
    const { container } = renderWithHarbor(
      <MetricHeatmap rows={rows} cols={cols} cells={cells} />,
    );
    expect(container.textContent).toContain("00:00");
    expect(container.textContent).toContain("06:00");
    expect(container.textContent).toContain("12:00");
  });

  it("renders row headers", () => {
    const { container } = renderWithHarbor(
      <MetricHeatmap rows={rows} cols={cols} cells={cells} />,
    );
    expect(container.textContent).toContain("Mon");
    expect(container.textContent).toContain("Tue");
    expect(container.textContent).toContain("Wed");
  });

  it("renders the min/max summary when no cell is hovered", () => {
    const { container } = renderWithHarbor(
      <MetricHeatmap rows={rows} cols={cols} cells={cells} />,
    );
    expect(container.textContent).toContain("min");
    expect(container.textContent).toContain("max");
  });

  it("uses custom formatV", () => {
    const { container } = renderWithHarbor(
      <MetricHeatmap
        rows={rows}
        cols={cols}
        cells={cells}
        formatV={(v) => `${(v * 100).toFixed(0)}%`}
      />,
    );
    expect(container.textContent).toContain("%");
  });

  it("fires onCellClick when a cell is clicked", async () => {
    const onCellClick = vi.fn();
    const { user } = renderWithHarbor(
      <MetricHeatmap rows={rows} cols={cols} cells={cells} onCellClick={onCellClick} />,
    );
    const rects = document.querySelectorAll("svg rect");
    expect(rects.length).toBeGreaterThan(0);
    await user.click(rects[0]);
    expect(onCellClick).toHaveBeenCalledTimes(1);
  });

  it("renders with custom cellSize", () => {
    const { container } = renderWithHarbor(
      <MetricHeatmap rows={rows} cols={cols} cells={cells} cellSize={32} />,
    );
    const svg = container.querySelector("svg");
    // Width = leftGutter(72) + 3 cols * 32 = 168
    expect(svg?.getAttribute("width")).toBe("168");
  });

  it("renders empty cells gracefully", () => {
    const noDataCells: HeatmapCell[] = [];
    const { container } = renderWithHarbor(
      <MetricHeatmap rows={rows} cols={cols} cells={noDataCells} />,
    );
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <MetricHeatmap rows={rows} cols={cols} cells={cells} className="my-heatmap" />,
    );
    const wrapper = container.querySelector(".my-heatmap");
    expect(wrapper).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <MetricHeatmap rows={rows} cols={cols} cells={cells} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
