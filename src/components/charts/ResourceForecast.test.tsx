import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ResourceForecast, type ResourceForecastProps } from "./ResourceForecast";
import type { TimeSeries } from "./TimeSeriesChart";

const now = Date.now();
const hour = 3600_000;

const series: TimeSeries[] = [
  {
    id: "disk",
    label: "Disk Usage",
    data: Array.from({ length: 20 }, (_, i) => ({
      t: now - (19 - i) * hour,
      v: 50 + i * 2,
    })),
  },
];

describe("ResourceForecast", () => {
  it("renders an SVG chart", () => {
    const { container } = renderWithHarbor(<ResourceForecast series={series} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("renders the original series data", () => {
    const { container } = renderWithHarbor(<ResourceForecast series={series} />);
    expect(container.textContent).toContain("Disk Usage");
  });

  it("renders forecast series in legend", () => {
    const { container } = renderWithHarbor(<ResourceForecast series={series} />);
    expect(container.textContent).toContain("forecast");
  });

  it("renders quota marker when quota is provided and projection crosses it", () => {
    // With disk growing at +2/hour and quota=100, the forecast should cross
    const { container } = renderWithHarbor(
      <ResourceForecast series={series} quota={100} />,
    );
    // If the forecast crosses quota, it shows a marker label
    expect(container.textContent).toContain("projected quota");
  });

  it("uses custom steps count", () => {
    const { container } = renderWithHarbor(
      <ResourceForecast series={series} steps={10} />,
    );
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("uses custom windowSize", () => {
    const { container } = renderWithHarbor(
      <ResourceForecast series={series} windowSize={5} />,
    );
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("uses custom forecast function", () => {
    const customForecast: ResourceForecastProps["forecast"] = (_s, steps, stepMs) => {
      const lastT = series[0].data[series[0].data.length - 1].t;
      return Array.from({ length: steps }, (_, i) => ({
        t: (typeof lastT === "number" ? lastT : lastT.getTime()) + (i + 1) * stepMs,
        v: 999,
      }));
    };
    const { container } = renderWithHarbor(
      <ResourceForecast series={series} forecast={customForecast} />,
    );
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("passes through additional TimeSeriesChart props", () => {
    const { container } = renderWithHarbor(
      <ResourceForecast series={series} height={300} className="my-forecast" />,
    );
    const wrapper = container.querySelector(".my-forecast");
    expect(wrapper).toBeTruthy();
  });

  it("renders with multiple series", () => {
    const multi: TimeSeries[] = [
      {
        id: "cpu",
        label: "CPU",
        data: Array.from({ length: 10 }, (_, i) => ({
          t: now - (9 - i) * hour,
          v: 30 + i * 3,
        })),
      },
      {
        id: "mem",
        label: "Memory",
        data: Array.from({ length: 10 }, (_, i) => ({
          t: now - (9 - i) * hour,
          v: 60 + i,
        })),
      },
    ];
    const { container } = renderWithHarbor(<ResourceForecast series={multi} />);
    expect(container.textContent).toContain("CPU");
    expect(container.textContent).toContain("Memory");
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<ResourceForecast series={series} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
