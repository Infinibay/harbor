import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Spinner, Dots } from "./Spinner";

describe("Spinner", () => {
  it("renders with default size 18", () => {
    const { container } = renderWithHarbor(<Spinner />);
    const span = container.querySelector("span");
    expect(span).toBeTruthy();
    expect(span?.getAttribute("style")).toContain("18");
  });

  it("renders with custom size", () => {
    const { container } = renderWithHarbor(<Spinner size={32} />);
    const span = container.querySelector("span");
    expect(span?.getAttribute("style")).toContain("32");
  });

  it("has animate-spin class", () => {
    const { container } = renderWithHarbor(<Spinner />);
    const span = container.querySelector("span");
    expect(span?.className).toContain("animate-spin");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<Spinner className="my-spin" />);
    expect(container.querySelector(".my-spin")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<Spinner />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Dots", () => {
  it("renders 3 bouncing dots", () => {
    const { container } = renderWithHarbor(<Dots />);
    const dots = container.querySelectorAll("span.rounded-full");
    expect(dots.length).toBe(3);
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<Dots className="my-dots" />);
    expect(container.querySelector(".my-dots")).toBeTruthy();
  });

  it("injects dotbounce keyframe style", () => {
    renderWithHarbor(<Dots />);
    const styles = document.querySelectorAll("style");
    const hasKeyframe = Array.from(styles).some((s) =>
      s.textContent?.includes("dotbounce"),
    );
    expect(hasKeyframe).toBe(true);
  });
});
