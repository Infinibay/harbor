import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { MorphBar, MorphItem } from "./MorphBar";

describe("MorphBar", () => {
  it("renders children", () => {
    const { container } = renderWithHarbor(
      <MorphBar>
        <MorphItem>Item 1</MorphItem>
        <MorphItem>Item 2</MorphItem>
      </MorphBar>,
    );
    expect(container.textContent).toContain("Item 1");
    expect(container.textContent).toContain("Item 2");
  });

  it("applies flex classes", () => {
    const { container } = renderWithHarbor(
      <MorphBar>
        <MorphItem>X</MorphItem>
      </MorphBar>,
    );
    const div = container.querySelector(".flex");
    expect(div).toBeTruthy();
  });

  it("applies gap style", () => {
    const { container } = renderWithHarbor(
      <MorphBar gap={16}>
        <MorphItem>X</MorphItem>
      </MorphBar>,
    );
    const bar = container.querySelector(".flex");
    expect(bar?.getAttribute("style")).toContain("16");
  });

  it("applies align class", () => {
    const { container } = renderWithHarbor(
      <MorphBar align="end">
        <MorphItem>X</MorphItem>
      </MorphBar>,
    );
    const bar = container.querySelector(".flex");
    expect(bar?.className).toContain("items-end");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <MorphBar className="my-bar">
        <MorphItem>X</MorphItem>
      </MorphBar>,
    );
    expect(container.querySelector(".my-bar")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <MorphBar>
        <MorphItem>Visible</MorphItem>
      </MorphBar>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("MorphItem", () => {
  it("renders children when visible", () => {
    const { container } = renderWithHarbor(
      <MorphBar>
        <MorphItem>Shown</MorphItem>
      </MorphBar>,
    );
    expect(container.textContent).toContain("Shown");
  });

  it("does not render when hidden=true", () => {
    const { container } = renderWithHarbor(
      <MorphBar>
        <MorphItem hidden>Hidden</MorphItem>
      </MorphBar>,
    );
    expect(container.textContent).not.toContain("Hidden");
  });

  it("applies grow style", () => {
    const { container } = renderWithHarbor(
      <MorphBar>
        <MorphItem grow={1}>Growing</MorphItem>
      </MorphBar>,
    );
    const item = container.querySelector("[style*='flex']");
    expect(item).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <MorphBar>
        <MorphItem className="my-item">X</MorphItem>
      </MorphBar>,
    );
    expect(container.querySelector(".my-item")).toBeTruthy();
  });
});
