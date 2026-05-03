import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Bubbles } from "./Bubbles";

describe("Bubbles", () => {
  it("renders without crashing", () => {
    const { unmount, container } = renderWithHarbor(<Bubbles />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom count prop", () => {
    const { unmount, container } = renderWithHarbor(<Bubbles count={20} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom sizeRange prop", () => {
    const { unmount, container } = renderWithHarbor(
      <Bubbles sizeRange={[10, 50]} />,
    );
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom drift prop", () => {
    const { unmount, container } = renderWithHarbor(<Bubbles drift={60} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom gooeyness prop", () => {
    const { unmount, container } = renderWithHarbor(<Bubbles gooeyness={10} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom mergeRadius prop", () => {
    const { unmount, container } = renderWithHarbor(<Bubbles mergeRadius={8} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with gradient prop", () => {
    const { unmount, container } = renderWithHarbor(<Bubbles gradient />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom backdrop prop", () => {
    const { unmount, container } = renderWithHarbor(
      <Bubbles backdrop="#1a1a2e" />,
    );
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom speed prop", () => {
    const { unmount, container } = renderWithHarbor(<Bubbles speed={2} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom intensity prop", () => {
    const { unmount, container } = renderWithHarbor(<Bubbles intensity={0.8} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom palette prop", () => {
    const { unmount, container } = renderWithHarbor(
      <Bubbles palette={["#ff0000", "#00ff00"]} />,
    );
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders when paused", () => {
    const { unmount, container } = renderWithHarbor(<Bubbles paused />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("is aria-hidden (purely decorative)", () => {
    const { container } = renderWithHarbor(<Bubbles />);
    expect(container.querySelector("[aria-hidden]")).not.toBeNull();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithHarbor(<Bubbles />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
