import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Aurora } from "./Aurora";

describe("Aurora", () => {
  it("renders without crashing", () => {
    const { unmount, container } = renderWithHarbor(<Aurora />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom bands prop", () => {
    const { unmount, container } = renderWithHarbor(<Aurora bands={5} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom amplitude prop", () => {
    const { unmount, container } = renderWithHarbor(<Aurora amplitude={0.5} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom resolution prop", () => {
    const { unmount, container } = renderWithHarbor(<Aurora resolution={32} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom bandPhase prop", () => {
    const { unmount, container } = renderWithHarbor(<Aurora bandPhase={1.5} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom speed prop", () => {
    const { unmount, container } = renderWithHarbor(<Aurora speed={2} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom intensity prop", () => {
    const { unmount, container } = renderWithHarbor(<Aurora intensity={0.8} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom palette prop", () => {
    const { unmount, container } = renderWithHarbor(
      <Aurora palette={["#ff0000", "#00ff00", "#0000ff"]} />,
    );
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders when paused", () => {
    const { unmount, container } = renderWithHarbor(<Aurora paused />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with className prop", () => {
    const { unmount, container } = renderWithHarbor(
      <Aurora className="custom-class" />,
    );
    expect(container.firstElementChild).toBeTruthy();
    expect(
      container.querySelector(".custom-class"),
    ).not.toBeNull();
    unmount();
  });

  it("is aria-hidden (purely decorative)", () => {
    const { container } = renderWithHarbor(<Aurora />);
    expect(container.querySelector("[aria-hidden]")).not.toBeNull();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithHarbor(<Aurora />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
