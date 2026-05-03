import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { AppHeader } from "./AppHeader";

describe("AppHeader", () => {
  it("renders left slot", () => {
    renderWithHarbor(<AppHeader left={<span>Left content</span>} />);
    expect(document.querySelector("header")?.textContent).toContain("Left content");
  });

  it("renders right slot", () => {
    renderWithHarbor(<AppHeader right={<span>Right content</span>} />);
    expect(document.querySelector("header")?.textContent).toContain("Right content");
  });

  it("renders both slots", () => {
    renderWithHarbor(
      <AppHeader
        left={<span>Left</span>}
        right={<span>Right</span>}
      />,
    );
    const header = document.querySelector("header");
    expect(header?.textContent).toContain("Left");
    expect(header?.textContent).toContain("Right");
  });

  it("applies sticky class by default", () => {
    renderWithHarbor(<AppHeader />);
    const header = document.querySelector("header");
    expect(header?.className).toContain("sticky");
  });

  it("removes sticky when sticky=false", () => {
    renderWithHarbor(<AppHeader sticky={false} />);
    const header = document.querySelector("header");
    expect(header?.className).not.toContain("sticky");
  });

  it("sets z-index style when sticky", () => {
    renderWithHarbor(<AppHeader />);
    const header = document.querySelector("header");
    expect(header?.getAttribute("style")).toContain("z-index");
  });

  it("does not set z-index when not sticky", () => {
    renderWithHarbor(<AppHeader sticky={false} />);
    const header = document.querySelector("header");
    expect(header?.getAttribute("style")).toBeNull();
  });

  it("applies backdrop-blur class", () => {
    renderWithHarbor(<AppHeader />);
    const header = document.querySelector("header");
    expect(header?.className).toContain("backdrop-blur-md");
  });

  it("renders as header element", () => {
    renderWithHarbor(<AppHeader />);
    expect(document.querySelector("header")).toBeTruthy();
  });

  it("applies custom className", () => {
    renderWithHarbor(<AppHeader className="my-header" />);
    const header = document.querySelector("header");
    expect(header?.className).toContain("my-header");
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <AppHeader left={<span>Back</span>} right={<span>Menu</span>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
