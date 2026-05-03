import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { MacScape } from "./MacScape";

describe("MacScape", () => {
  it("renders without crashing", () => {
    const { unmount, container } = renderWithHarbor(<MacScape />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom layers prop", () => {
    const { unmount, container } = renderWithHarbor(<MacScape layers={6} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom baseY prop", () => {
    const { unmount, container } = renderWithHarbor(
      <MacScape baseY={[0.1, 0.2, 0.3, 0.4, 0.5, 0.6]} />,
    );
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom blur prop", () => {
    const { unmount, container } = renderWithHarbor(<MacScape blur={12} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom resolution prop", () => {
    const { unmount, container } = renderWithHarbor(<MacScape resolution={32} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom speed prop", () => {
    const { unmount, container } = renderWithHarbor(<MacScape speed={2} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom intensity prop", () => {
    const { unmount, container } = renderWithHarbor(<MacScape intensity={0.8} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom palette prop", () => {
    const { unmount, container } = renderWithHarbor(
      <MacScape palette={["#0000ff", "#00ffff"]} />,
    );
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders when paused", () => {
    const { unmount, container } = renderWithHarbor(<MacScape paused />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("is aria-hidden (purely decorative)", () => {
    const { container } = renderWithHarbor(<MacScape />);
    expect(container.querySelector("[aria-hidden]")).not.toBeNull();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithHarbor(<MacScape />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
