import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { TickerTape, type TickerItem } from "./TickerTape";

const items: TickerItem[] = [
  { id: "a", label: "CPU", value: "45%", change: 2.5 },
  { id: "b", label: "RAM", value: "78%", change: -1.2 },
  { id: "c", label: "Disk", value: "30%" },
];

describe("TickerTape", () => {
  it("renders item labels", () => {
    const { container } = renderWithHarbor(<TickerTape items={items} />);
    expect(container.textContent).toContain("CPU");
    expect(container.textContent).toContain("RAM");
    expect(container.textContent).toContain("Disk");
  });

  it("renders values", () => {
    const { container } = renderWithHarbor(<TickerTape items={items} />);
    expect(container.textContent).toContain("45%");
    expect(container.textContent).toContain("78%");
  });

  it("renders positive change arrow", () => {
    const { container } = renderWithHarbor(<TickerTape items={items} />);
    expect(container.textContent).toContain("▲");
  });

  it("renders negative change arrow", () => {
    const { container } = renderWithHarbor(<TickerTape items={items} />);
    expect(container.textContent).toContain("▼");
  });

  it("doubles items for infinite scroll", () => {
    const { container } = renderWithHarbor(<TickerTape items={items} />);
    // Should render items twice (doubled for animation)
    const labels = container.querySelectorAll("span.text-white\\/55");
    expect(labels.length).toBeGreaterThanOrEqual(items.length * 2);
  });

  it("injects ticker keyframe", () => {
    renderWithHarbor(<TickerTape items={items} />);
    const styles = document.querySelectorAll("style");
    const hasKeyframe = Array.from(styles).some((s) =>
      s.textContent?.includes("@keyframes ticker"),
    );
    expect(hasKeyframe).toBe(true);
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <TickerTape items={items} className="my-ticker" />,
    );
    expect(container.querySelector(".my-ticker")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<TickerTape items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
