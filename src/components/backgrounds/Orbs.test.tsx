import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Orbs } from "./Orbs";

describe("Orbs", () => {
  it("renders without crashing", () => {
    const { unmount, container } = renderWithHarbor(<Orbs />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom count prop", () => {
    const { unmount, container } = renderWithHarbor(<Orbs count={12} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom sizeRange prop", () => {
    const { unmount, container } = renderWithHarbor(
      <Orbs sizeRange={[20, 100]} />,
    );
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom glow prop", () => {
    const { unmount, container } = renderWithHarbor(<Orbs glow={60} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with different blend modes", () => {
    const blends: Orbs["blend"][] = [
      "screen",
      "plus-lighter",
      "lighten",
      "overlay",
      "normal",
    ];
    for (const blend of blends) {
      const { unmount, container } = renderWithHarbor(<Orbs blend={blend} />);
      expect(container.firstElementChild).toBeTruthy();
      unmount();
    }
  });

  it("renders with custom speed prop", () => {
    const { unmount, container } = renderWithHarbor(<Orbs speed={2} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom intensity prop", () => {
    const { unmount, container } = renderWithHarbor(<Orbs intensity={0.8} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom palette prop", () => {
    const { unmount, container } = renderWithHarbor(
      <Orbs palette={["#ff00ff", "#00ffff", "#ffff00"]} />,
    );
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders when paused", () => {
    const { unmount, container } = renderWithHarbor(<Orbs paused />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("is aria-hidden (purely decorative)", () => {
    const { container } = renderWithHarbor(<Orbs />);
    expect(container.querySelector("[aria-hidden]")).not.toBeNull();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithHarbor(<Orbs />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
