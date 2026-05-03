import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { UsageRing } from "./UsageRing";

describe("UsageRing", () => {
  it("renders with value and max", () => {
    const { container } = renderWithHarbor(<UsageRing value={75} max={100} />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders percentage label", () => {
    const { container } = renderWithHarbor(<UsageRing value={75} max={100} />);
    expect(container.textContent).toContain("75%");
  });

  it("renders name", () => {
    const { container } = renderWithHarbor(
      <UsageRing value={50} max={100} name="CPU" />,
    );
    expect(container.textContent).toContain("CPU");
  });

  it("renders caption", () => {
    const { container } = renderWithHarbor(
      <UsageRing value={50} max={100} caption="Projected: 22 Apr" />,
    );
    expect(container.textContent).toContain("Projected: 22 Apr");
  });

  it("renders custom label", () => {
    const { container } = renderWithHarbor(
      <UsageRing value={50} max={100} label={<span>Custom</span>} />,
    );
    expect(container.textContent).toContain("Custom");
  });

  it("uses purple tone when below warning threshold", () => {
    const { container } = renderWithHarbor(
      <UsageRing value={50} max={100} thresholds={[0.75, 0.9]} />,
    );
    const grad = container.querySelector("svg linearGradient");
    expect(grad?.id).toContain("purple");
  });

  it("uses amber tone when above warning threshold", () => {
    const { container } = renderWithHarbor(
      <UsageRing value={80} max={100} thresholds={[0.75, 0.9]} />,
    );
    const grad = container.querySelector("svg linearGradient");
    expect(grad?.id).toContain("amber");
  });

  it("uses rose tone when above danger threshold", () => {
    const { container } = renderWithHarbor(
      <UsageRing value={95} max={100} thresholds={[0.75, 0.9]} />,
    );
    const grad = container.querySelector("svg linearGradient");
    expect(grad?.id).toContain("rose");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <UsageRing value={50} max={100} className="my-ring" />,
    );
    expect(container.querySelector(".my-ring")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <UsageRing value={50} max={100} name="CPU" caption="Test" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
