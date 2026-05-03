import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { MiniMap, type MiniMapRect } from "./MiniMap";

const world = { w: 2000, h: 1500 };
const viewport: MiniMapRect = { x: 200, y: 150, w: 600, h: 400 };
const items: MiniMapRect[] = [
  { x: 100, y: 100, w: 200, h: 150, label: "Node A", color: "rgba(168,85,247,0.4)" },
  { x: 500, y: 300, w: 300, h: 200, label: "Node B" },
];

describe("MiniMap", () => {
  it("renders the minimap container", () => {
    const { container } = renderWithHarbor(
      <MiniMap world={world} viewport={viewport} />,
    );
    const map = container.querySelector(".rounded-lg");
    expect(map).toBeTruthy();
  });

  it("sets width and height via style", () => {
    const { container } = renderWithHarbor(
      <MiniMap world={world} viewport={viewport} width={200} height={100} />,
    );
    const map = container.querySelector("[style]");
    expect(map?.getAttribute("style")).toContain("200");
    expect(map?.getAttribute("style")).toContain("100");
  });

  it("renders items as spans", () => {
    const { container } = renderWithHarbor(
      <MiniMap world={world} viewport={viewport} items={items} />,
    );
    const spans = container.querySelectorAll("span");
    // 2 items + 1 viewport indicator = 3 spans
    expect(spans.length).toBeGreaterThanOrEqual(3);
  });

  it("renders viewport indicator with border", () => {
    const { container } = renderWithHarbor(
      <MiniMap world={world} viewport={viewport} />,
    );
    const viewportSpan = container.querySelector("span[style*='border']");
    expect(viewportSpan).toBeTruthy();
  });

  it("applies cursor-crosshair class", () => {
    const { container } = renderWithHarbor(
      <MiniMap world={world} viewport={viewport} />,
    );
    expect(container.querySelector(".cursor-crosshair")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <MiniMap world={world} viewport={viewport} className="my-map" />,
    );
    expect(container.querySelector(".my-map")).toBeTruthy();
  });

  it("renders without items", () => {
    const { container } = renderWithHarbor(
      <MiniMap world={world} viewport={viewport} />,
    );
    expect(container.querySelector(".rounded-lg")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <MiniMap world={world} viewport={viewport} items={items} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
