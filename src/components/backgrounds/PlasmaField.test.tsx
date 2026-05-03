import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { PlasmaField } from "./PlasmaField";

describe("PlasmaField", () => {
  it("renders without crashing", () => {
    const { unmount, container } = renderWithHarbor(<PlasmaField />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom scale prop", () => {
    const { unmount, container } = renderWithHarbor(<PlasmaField scale={4} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom frequency prop", () => {
    const { unmount, container } = renderWithHarbor(<PlasmaField frequency={0.04} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom blur prop", () => {
    const { unmount, container } = renderWithHarbor(<PlasmaField blur={30} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom speed prop", () => {
    const { unmount, container } = renderWithHarbor(<PlasmaField speed={2} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom intensity prop", () => {
    const { unmount, container } = renderWithHarbor(<PlasmaField intensity={0.8} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom palette prop", () => {
    const { unmount, container } = renderWithHarbor(
      <PlasmaField palette={["#ff0000", "#0000ff"]} />,
    );
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders when paused", () => {
    const { unmount, container } = renderWithHarbor(<PlasmaField paused />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("is aria-hidden (purely decorative)", () => {
    const { container } = renderWithHarbor(<PlasmaField />);
    expect(container.querySelector("[aria-hidden]")).not.toBeNull();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithHarbor(<PlasmaField />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
