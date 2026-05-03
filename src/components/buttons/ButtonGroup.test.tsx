import { describe, it, expect, vi } from "vitest";
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

  it("renders as a div container", () => {
    const { container } = renderWithHarbor(
      <ButtonGroup>
        <Button>X</Button>
      </ButtonGroup>,
    );
    expect(container.querySelector("div")).toBeTruthy();
  });

  it("renders in attached mode by default", () => {
    const { container } = renderWithHarbor(
      <ButtonGroup>
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
    );
    const group = container.querySelector("div");
    expect(group?.querySelectorAll("button").length).toBe(2);
  });

  it("renders in detached mode with attached=false", () => {
    const { container } = renderWithHarbor(
      <ButtonGroup attached={false}>
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
    );
    const group = container.querySelector("div");
    expect(group?.querySelectorAll("button").length).toBe(2);
  });

  it("passes size prop to children when provided", () => {
    renderWithHarbor(
      <ButtonGroup size="sm" attached={false}>
        <Button>Small</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("button", { name: "Small" })).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <ButtonGroup className="my-group">
        <Button>A</Button>
      </ButtonGroup>,
    );
    expect(container.querySelector("div")).toBeTruthy();
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
