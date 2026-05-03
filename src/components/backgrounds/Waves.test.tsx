import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Waves } from "./Waves";

describe("Waves", () => {
  it("renders without crashing", () => {
    const { unmount, container } = renderWithHarbor(<Waves />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom count prop", () => {
    const { unmount, container } = renderWithHarbor(<Waves count={6} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom amplitude prop", () => {
    const { unmount, container } = renderWithHarbor(<Waves amplitude={0.2} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom frequency prop", () => {
    const { unmount, container } = renderWithHarbor(<Waves frequency={4} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom resolution prop", () => {
    const { unmount, container } = renderWithHarbor(<Waves resolution={40} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom speed prop", () => {
    const { unmount, container } = renderWithHarbor(<Waves speed={2} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom intensity prop", () => {
    const { unmount, container } = renderWithHarbor(<Waves intensity={0.8} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom palette prop", () => {
    const { unmount, container } = renderWithHarbor(
      <Waves palette={["#0000ff", "#00ffff"]} />,
    );
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders when paused", () => {
    const { unmount, container } = renderWithHarbor(<Waves paused />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("is aria-hidden (purely decorative)", () => {
    const { container } = renderWithHarbor(<Waves />);
    expect(container.querySelector("[aria-hidden]")).not.toBeNull();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithHarbor(<Waves />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
