import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Bento, BentoItem } from "./Bento";

describe("Bento", () => {
  it("renders children in a grid", () => {
    const { container } = renderWithHarbor(
      <Bento>
        <BentoItem>A</BentoItem>
        <BentoItem>B</BentoItem>
      </Bento>,
    );
    expect(container.querySelector(".grid")).toBeTruthy();
    expect(container.textContent).toContain("A");
    expect(container.textContent).toContain("B");
  });

  it("sets gridTemplateColumns via style", () => {
    const { container } = renderWithHarbor(
      <Bento columns={3}>
        <BentoItem>X</BentoItem>
      </Bento>,
    );
    const grid = container.querySelector(".grid");
    expect(grid?.getAttribute("style")).toContain("repeat");
  });

  it("renders with default gap", () => {
    const { container } = renderWithHarbor(
      <Bento>
        <BentoItem>X</BentoItem>
      </Bento>,
    );
    const grid = container.querySelector(".grid");
    expect(grid?.getAttribute("style")).toContain("12");
  });

  it("renders with custom gap", () => {
    const { container } = renderWithHarbor(
      <Bento gap={8}>
        <BentoItem>X</BentoItem>
      </Bento>,
    );
    const grid = container.querySelector(".grid");
    expect(grid?.getAttribute("style")).toContain("8");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <Bento className="my-bento">
        <BentoItem>X</BentoItem>
      </Bento>,
    );
    expect(container.querySelector(".my-bento")).toBeTruthy();
  });

  it("renders BentoItem span", () => {
    const { container } = renderWithHarbor(
      <Bento>
        <BentoItem span={{ col: 2 }}>Wide</BentoItem>
      </Bento>,
    );
    expect(container.textContent).toContain("Wide");
  });

  it("renders empty children gracefully", () => {
    const { container } = renderWithHarbor(<Bento>{null}</Bento>);
    expect(container.querySelector(".grid")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <Bento>
        <BentoItem>A</BentoItem>
        <BentoItem>B</BentoItem>
      </Bento>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
