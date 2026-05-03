import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ResponsiveStack } from "./ResponsiveStack";

describe("ResponsiveStack", () => {
  it("renders children in a flex container", () => {
    const { container } = renderWithHarbor(
      <ResponsiveStack>
        <span>A</span>
        <span>B</span>
      </ResponsiveStack>,
    );
    expect(container.querySelector(".flex")).toBeTruthy();
    expect(container.textContent).toContain("A");
    expect(container.textContent).toContain("B");
  });

  it("applies flex-col by default", () => {
    const { container } = renderWithHarbor(<ResponsiveStack>X</ResponsiveStack>);
    const div = container.querySelector(".flex");
    expect(div?.className).toContain("flex-col");
  });

  it("applies direction row", () => {
    const { container } = renderWithHarbor(
      <ResponsiveStack direction="row">X</ResponsiveStack>,
    );
    const div = container.querySelector(".flex");
    expect(div?.className).toContain("flex-row");
  });

  it("applies responsive direction", () => {
    const { container } = renderWithHarbor(
      <ResponsiveStack direction={{ base: "col", md: "row" }}>X</ResponsiveStack>,
    );
    const div = container.querySelector(".flex");
    expect(div?.className).toContain("flex-col");
    expect(div?.className).toContain("md:flex-row");
  });

  it("applies gap-3 by default", () => {
    const { container } = renderWithHarbor(<ResponsiveStack>X</ResponsiveStack>);
    const div = container.querySelector(".flex");
    expect(div?.className).toContain("gap-3");
  });

  it("applies custom gap", () => {
    const { container } = renderWithHarbor(
      <ResponsiveStack gap={6}>X</ResponsiveStack>,
    );
    const div = container.querySelector(".flex");
    expect(div?.className).toContain("gap-6");
  });

  it("applies align class", () => {
    const { container } = renderWithHarbor(
      <ResponsiveStack align="center">X</ResponsiveStack>,
    );
    const div = container.querySelector(".flex");
    expect(div?.className).toContain("items-center");
  });

  it("applies justify class", () => {
    const { container } = renderWithHarbor(
      <ResponsiveStack justify="between">X</ResponsiveStack>,
    );
    const div = container.querySelector(".flex");
    expect(div?.className).toContain("justify-between");
  });

  it("applies wrap class", () => {
    const { container } = renderWithHarbor(
      <ResponsiveStack wrap>X</ResponsiveStack>,
    );
    const div = container.querySelector(".flex");
    expect(div?.className).toContain("flex-wrap");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <ResponsiveStack className="my-stack">X</ResponsiveStack>,
    );
    expect(container.querySelector(".my-stack")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <ResponsiveStack direction="row" gap={4}>
        <span>A</span>
        <span>B</span>
      </ResponsiveStack>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
