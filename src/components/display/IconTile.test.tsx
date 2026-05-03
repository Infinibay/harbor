import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { IconTile } from "./IconTile";

describe("IconTile", () => {
  it("renders icon content", () => {
    const { container } = renderWithHarbor(<IconTile icon={<span>📦</span>} />);
    expect(container.textContent).toContain("📦");
  });

  it("applies neutral tone by default", () => {
    const { container } = renderWithHarbor(<IconTile icon={<span>X</span>} />);
    const span = container.querySelector("[aria-hidden]");
    expect(span?.className).toContain("bg-white/8");
  });

  it("applies sky tone", () => {
    const { container } = renderWithHarbor(<IconTile icon={<span>X</span>} tone="sky" />);
    const span = container.querySelector("[aria-hidden]");
    expect(span?.className).toContain("bg-sky-500/15");
  });

  it("applies md size by default", () => {
    const { container } = renderWithHarbor(<IconTile icon={<span>X</span>} />);
    const span = container.querySelector("[aria-hidden]");
    expect(span?.className).toContain("w-10");
  });

  it("applies sm size", () => {
    const { container } = renderWithHarbor(<IconTile icon={<span>X</span>} size="sm" />);
    const span = container.querySelector("[aria-hidden]");
    expect(span?.className).toContain("w-8");
  });

  it("has aria-hidden", () => {
    const { container } = renderWithHarbor(<IconTile icon={<span>X</span>} />);
    const span = container.querySelector("[aria-hidden='true']");
    expect(span).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <IconTile icon={<span>X</span>} className="my-tile" />,
    );
    expect(container.querySelector(".my-tile")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<IconTile icon={<span>X</span>} tone="green" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
