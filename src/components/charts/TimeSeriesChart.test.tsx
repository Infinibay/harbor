import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { TimeSeriesChart, TimeSeriesMarker, type TimeSeries } from "./TimeSeriesChart";

const now = Date.now();
const hour = 3600_000;

const series: TimeSeries[] = [
  {
    id: "cpu",
    label: "CPU",
    data: [
      { t: now - 4 * hour, v: 20 },
      { t: now - 3 * hour, v: 45 },
      { t: now - 2 * hour, v: 30 },
      { t: now - hour, v: 60 },
      { t: now, v: 50 },
    ],
  },
];

describe("TimeSeriesChart", () => {
  it("renders an SVG chart", () => {
    const { container } = renderWithHarbor(<TimeSeriesChart series={series} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("renders series label in legend for multi-series", () => {
    const multi: TimeSeries[] = [
      { id: "cpu", label: "CPU", data: [{ t: now, v: 10 }] },
      { id: "mem", label: "Memory", data: [{ t: now, v: 20 }] },
    ];
    const { container } = renderWithHarbor(<TimeSeriesChart series={multi} />);
    expect(container.textContent).toContain("CPU");
    expect(container.textContent).toContain("Memory");
  });

  it("renders area fill by default (area=true)", () => {
    const { container } = renderWithHarbor(<TimeSeriesChart series={series} />);
    const gradient = container.querySelector("svg linearGradient");
    expect(gradient).toBeTruthy();
  });

  it("omits area fill when area=false", () => {
    const { container } = renderWithHarbor(
      <TimeSeriesChart series={series} area={false} />,
    );
    const gradient = container.querySelector("svg linearGradient");
    expect(gradient).toBeNull();
  });

  it("renders with custom height", () => {
    const { container } = renderWithHarbor(
      <TimeSeriesChart series={series} height={300} />,
    );
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("viewBox")).toContain("300");
  });

  it("uses formatY to format axis values", () => {
    const { container } = renderWithHarbor(
      <TimeSeriesChart series={series} formatY={(v) => `${v}%`} />,
    );
    expect(container.textContent).toContain("%");
  });

  it("renders markers as vertical annotation lines", () => {
    const { container } = renderWithHarbor(
      <TimeSeriesChart series={series}>
        <TimeSeriesMarker at={now - 2 * hour} label="Deploy" color="#ff0000" />
      </TimeSeriesChart>,
    );
    // Marker label text should appear in the SVG
    expect(container.textContent).toContain("Deploy");
  });

  it("renders with explicit xDomain", () => {
    const { container } = renderWithHarbor(
      <TimeSeriesChart
        series={series}
        xDomain={{ from: new Date(now - 5 * hour), to: new Date(now) }}
      />,
    );
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders with explicit yDomain", () => {
    const { container } = renderWithHarbor(
      <TimeSeriesChart series={series} yDomain={[0, 100]} />,
    );
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders with empty series", () => {
    const { container } = renderWithHarbor(<TimeSeriesChart series={[]} />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <TimeSeriesChart series={series} className="my-ts" />,
    );
    const wrapper = container.querySelector(".my-ts");
    expect(wrapper).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<TimeSeriesChart series={series} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
