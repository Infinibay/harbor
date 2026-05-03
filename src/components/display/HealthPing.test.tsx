import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { HealthPing, type PingTone } from "./HealthPing";

const tones: PingTone[] = ["success", "warn", "danger", "info", "neutral"];

describe("HealthPing", () => {
  it("renders with default props", () => {
    const { container } = renderWithHarbor(<HealthPing />);
    const span = container.querySelector("[aria-hidden='true']");
    expect(span).toBeTruthy();
  });

  it("renders for each tone", () => {
    for (const tone of tones) {
      const { container, unmount } = renderWithHarbor(<HealthPing tone={tone} />);
      expect(container.querySelector("[aria-hidden]")).toBeTruthy();
      unmount();
    }
  });

  it("applies success tone class", () => {
    const { container } = renderWithHarbor(<HealthPing tone="success" />);
    expect(container.querySelector(".bg-emerald-400")).toBeTruthy();
  });

  it("applies danger tone class", () => {
    const { container } = renderWithHarbor(<HealthPing tone="danger" />);
    expect(container.querySelector(".bg-rose-400")).toBeTruthy();
  });

  it("uses custom size", () => {
    const { container } = renderWithHarbor(<HealthPing size={16} />);
    const span = container.querySelector("[aria-hidden]");
    expect(span?.getAttribute("style")).toContain("16");
  });

  it("renders 2 rings when rings=2", () => {
    const { container } = renderWithHarbor(<HealthPing rings={2} />);
    const pings = container.querySelectorAll(".animate-ping");
    expect(pings.length).toBe(2);
  });

  it("renders 1 ring by default", () => {
    const { container } = renderWithHarbor(<HealthPing />);
    const pings = container.querySelectorAll(".animate-ping");
    expect(pings.length).toBe(1);
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<HealthPing className="my-ping" />);
    expect(container.querySelector(".my-ping")).toBeTruthy();
  });

  it("a11y: no violations (aria-hidden)", async () => {
    const { container } = renderWithHarbor(<HealthPing />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
