import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Divider, Kbd } from "./Divider";

describe("Divider", () => {
  it("renders plain separator without children", () => {
    const { container } = renderWithHarbor(<Divider />);
    const sep = container.querySelector("[role='separator']");
    expect(sep).toBeTruthy();
  });

  it("renders with text label when children provided", () => {
    const { container } = renderWithHarbor(<Divider>or</Divider>);
    expect(container.textContent).toContain("or");
    expect(container.querySelector("[role='separator']")).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<Divider className="my-div" />);
    expect(container.querySelector(".my-div")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<Divider />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Kbd", () => {
  it("renders children in kbd element", () => {
    const { container } = renderWithHarbor(<Kbd>⌘P</Kbd>);
    const kbd = container.querySelector("kbd");
    expect(kbd).toBeTruthy();
    expect(kbd?.textContent).toContain("⌘P");
  });

  it("has correct styling classes", () => {
    const { container } = renderWithHarbor(<Kbd>X</Kbd>);
    const kbd = container.querySelector("kbd");
    expect(kbd?.className).toContain("font-mono");
    expect(kbd?.className).toContain("bg-white/10");
  });
});
