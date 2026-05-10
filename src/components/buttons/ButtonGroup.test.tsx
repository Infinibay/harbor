import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ButtonGroup } from "./ButtonGroup";
import { Button } from "./Button";

/** HarborProvider injects a <style> tag, so container.firstElementChild is
 *  the style tag, not the component div. Use container.querySelector("div")
 *  to get the ButtonGroup wrapper. */

describe("ButtonGroup", () => {
  it("renders grouped buttons", () => {
    renderWithHarbor(
      <ButtonGroup>
        <Button>A</Button>
        <Button>B</Button>
        <Button>C</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("button", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "B" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "C" })).toBeInTheDocument();
  });

  it("attached mode (default) collapses inner borders via the segmented classes", () => {
    const { container } = renderWithHarbor(
      <ButtonGroup>
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole("button", { name: "A" }).parentElement!;
    expect(group.className).toContain("[&>*+*]:-ml-px");
    expect(group.className).toContain("[&>*:first-child]:rounded-l-lg");
    expect(group.className).not.toContain("gap-2");
    expect(container.querySelectorAll("button").length).toBe(2);
  });

  it("detached mode (attached=false) uses gap-2 spacing instead of segmented classes", () => {
    renderWithHarbor(
      <ButtonGroup attached={false}>
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole("button", { name: "A" }).parentElement!;
    expect(group.className).toContain("gap-2");
    expect(group.className).not.toContain("[&>*+*]:-ml-px");
  });

  it("passes size prop to children when set on the group (and child has no own size)", () => {
    renderWithHarbor(
      <ButtonGroup size="sm" attached={false}>
        <Button>Small</Button>
      </ButtonGroup>,
    );
    // Button "sm" derives from adaptive target variables.
    const btn = screen.getByRole("button", { name: "Small" });
    expect(btn.className).toContain("h-[calc(var(--harbor-target-control-height)-8px)]");
    expect(btn.className).toContain("text-xs");
  });

  it("child's own size prop wins over the group's size", () => {
    renderWithHarbor(
      <ButtonGroup size="sm" attached={false}>
        <Button size="lg">Big</Button>
      </ButtonGroup>,
    );
    const btn = screen.getByRole("button", { name: "Big" });
    expect(btn.className).toContain("h-[calc(var(--harbor-target-control-height)+8px)]");
    expect(btn.className).not.toContain("h-[calc(var(--harbor-target-control-height)-8px)]");
  });

  it("applies custom className to the group wrapper", () => {
    renderWithHarbor(
      <ButtonGroup className="my-group">
        <Button>A</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole("button", { name: "A" }).parentElement!;
    expect(group.className).toContain("my-group");
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
