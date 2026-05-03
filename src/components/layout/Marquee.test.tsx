import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Marquee } from "./Marquee";

describe("Marquee", () => {
  it("renders children", () => {
    const { container } = renderWithHarbor(
      <Marquee>
        <span>Item 1</span>
        <span>Item 2</span>
      </Marquee>,
    );
    expect(container.textContent).toContain("Item 1");
    expect(container.textContent).toContain("Item 2");
  });

  it("duplicates children for infinite scroll", () => {
    const { container } = renderWithHarbor(
      <Marquee>
        <span>Unique</span>
      </Marquee>,
    );
    // Children are duplicated at least 2 times
    const allItems = container.querySelectorAll("span");
    let count = 0;
    allItems.forEach((s) => {
      if (s.textContent === "Unique") count++;
    });
    expect(count).toBeGreaterThanOrEqual(2);
  });

  it("applies overflow-hidden class", () => {
    const { container } = renderWithHarbor(
      <Marquee>
        <span>X</span>
      </Marquee>,
    );
    expect(container.querySelector(".overflow-hidden")).toBeTruthy();
  });

  it("applies animation style with duration", () => {
    const { container } = renderWithHarbor(
      <Marquee>
        <span>X</span>
      </Marquee>,
    );
    const animated = container.querySelector("[style*='animation']");
    expect(animated).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <Marquee className="my-marquee">
        <span>X</span>
      </Marquee>,
    );
    expect(container.querySelector(".my-marquee")).toBeTruthy();
  });

  it("renders empty children gracefully", () => {
    const { container } = renderWithHarbor(<Marquee />);
    expect(container.querySelector(".overflow-hidden")).toBeTruthy();
  });

  it("applies group class when pauseOnHover", () => {
    const { container } = renderWithHarbor(
      <Marquee pauseOnHover>
        <span>X</span>
      </Marquee>,
    );
    expect(container.querySelector(".group")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <Marquee>
        <span>Item</span>
      </Marquee>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
