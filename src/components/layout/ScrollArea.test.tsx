import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ScrollArea } from "./ScrollArea";

describe("ScrollArea", () => {
  it("renders children", () => {
    const { container } = renderWithHarbor(
      <ScrollArea>
        <p>Line 1</p>
        <p>Line 2</p>
      </ScrollArea>,
    );
    expect(container.textContent).toContain("Line 1");
    expect(container.textContent).toContain("Line 2");
  });

  it("applies maxHeight style", () => {
    const { container } = renderWithHarbor(
      <ScrollArea maxHeight={200}>X</ScrollArea>,
    );
    const wrapper = container.querySelector("[style]");
    expect(wrapper?.getAttribute("style")).toContain("200");
  });

  it("applies default maxHeight 280", () => {
    const { container } = renderWithHarbor(<ScrollArea>X</ScrollArea>);
    const wrapper = container.querySelector("[style]");
    expect(wrapper?.getAttribute("style")).toContain("280");
  });

  it("applies string maxHeight", () => {
    const { container } = renderWithHarbor(
      <ScrollArea maxHeight="50vh">X</ScrollArea>,
    );
    const wrapper = container.querySelector("[style]");
    expect(wrapper?.getAttribute("style")).toContain("50vh");
  });

  it("applies rounded-xl class", () => {
    const { container } = renderWithHarbor(<ScrollArea>X</ScrollArea>);
    const wrapper = container.querySelector(".rounded-xl");
    expect(wrapper).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <ScrollArea className="my-scroll">X</ScrollArea>,
    );
    expect(container.querySelector(".my-scroll")).toBeTruthy();
  });

  it("renders scrollbar hiding style inside viewport", () => {
    const { container } = renderWithHarbor(<ScrollArea>X</ScrollArea>);
    const styles = container.querySelectorAll("style");
    const hasScrollbar = Array.from(styles).some((s) =>
      s.textContent?.includes("scrollbar"),
    );
    expect(hasScrollbar).toBe(true);
  });

  it("renders outer wrapper div", () => {
    const { container } = renderWithHarbor(<ScrollArea>X</ScrollArea>);
    const wrapper = container.querySelector(".rounded-xl");
    expect(wrapper).toBeInstanceOf(HTMLDivElement);
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <ScrollArea maxHeight={100}>
        <p>Content</p>
      </ScrollArea>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
