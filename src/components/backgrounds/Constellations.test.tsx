import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Constellations } from "./Constellations";

describe("Constellations", () => {
  it("renders without crashing", () => {
    const { unmount, container } = renderWithHarbor(<Constellations />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom density prop", () => {
    const { unmount, container } = renderWithHarbor(
      <Constellations density={1.2} />,
    );
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom maxDistance prop", () => {
    const { unmount, container } = renderWithHarbor(
      <Constellations maxDistance={200} />,
    );
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom nodeSize prop", () => {
    const { unmount, container } = renderWithHarbor(
      <Constellations nodeSize={3} />,
    );
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom drift prop", () => {
    const { unmount, container } = renderWithHarbor(<Constellations drift={30} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom lineColor prop", () => {
    const { unmount, container } = renderWithHarbor(
      <Constellations lineColor="#ffffff" />,
    );
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with cursorReactive prop", () => {
    const { unmount, container } = renderWithHarbor(
      <Constellations cursorReactive />,
    );
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom cursorRadius prop", () => {
    const { unmount, container } = renderWithHarbor(
      <Constellations cursorReactive cursorRadius={100} />,
    );
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom speed prop", () => {
    const { unmount, container } = renderWithHarbor(<Constellations speed={2} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom intensity prop", () => {
    const { unmount, container } = renderWithHarbor(
      <Constellations intensity={0.8} />,
    );
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom palette prop", () => {
    const { unmount, container } = renderWithHarbor(
      <Constellations palette={["#00ffff", "#ff00ff"]} />,
    );
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders when paused", () => {
    const { unmount, container } = renderWithHarbor(<Constellations paused />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("is aria-hidden (purely decorative)", () => {
    const { container } = renderWithHarbor(<Constellations />);
    expect(container.querySelector("[aria-hidden]")).not.toBeNull();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithHarbor(<Constellations />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
