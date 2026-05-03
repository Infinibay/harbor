import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Aside } from "./Aside";

const tones = ["note", "tip", "info", "warning", "danger"] as const;

describe("Aside", () => {
  it("renders children text", () => {
    const { container } = renderWithHarbor(<Aside>Important note</Aside>);
    expect(container.textContent).toContain("Important note");
  });

  it("renders default tone label (Note) when no title", () => {
    renderWithHarbor(<Aside>Content</Aside>);
    expect(screen.getByText("Note")).toBeInTheDocument();
  });

  it("renders custom title", () => {
    renderWithHarbor(<Aside title="Custom Title">Content</Aside>);
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });

  it("renders icon for each tone", () => {
    for (const tone of tones) {
      const { unmount } = renderWithHarbor(<Aside tone={tone}>Content</Aside>);
      expect(screen.getByText("Content")).toBeInTheDocument();
      unmount();
    }
  });

  it("renders tip tone with icon", () => {
    const { container } = renderWithHarbor(<Aside tone="tip">Tip content</Aside>);
    expect(container.textContent).toContain("💡");
    expect(screen.getByText("Tip")).toBeInTheDocument();
  });

  it("renders info tone", () => {
    const { container } = renderWithHarbor(<Aside tone="info">Info content</Aside>);
    expect(container.textContent).toContain("ℹ");
    expect(screen.getAllByText("Info").length).toBeGreaterThanOrEqual(1);
  });

  it("renders warning tone", () => {
    const { container } = renderWithHarbor(<Aside tone="warning">Warning content</Aside>);
    expect(container.textContent).toContain("⚠");
    expect(screen.getAllByText("Warning").length).toBeGreaterThanOrEqual(1);
  });

  it("renders danger tone", () => {
    const { container } = renderWithHarbor(<Aside tone="danger">Danger content</Aside>);
    expect(container.textContent).toContain("⛔");
    expect(screen.getAllByText("Danger").length).toBeGreaterThanOrEqual(1);
  });

  it("renders as aside element", () => {
    const { container } = renderWithHarbor(<Aside>Content</Aside>);
    expect(container.querySelector("aside")).toBeTruthy();
  });

  it("applies tip tone background class", () => {
    const { container } = renderWithHarbor(<Aside tone="tip">Content</Aside>);
    const aside = container.querySelector("aside");
    expect(aside?.className).toContain("bg-fuchsia-500/10");
  });

  it("applies danger tone border class", () => {
    const { container } = renderWithHarbor(<Aside tone="danger">Content</Aside>);
    const aside = container.querySelector("aside");
    expect(aside?.className).toContain("border-rose-400/30");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<Aside className="my-aside">X</Aside>);
    expect(container.querySelector(".my-aside")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <Aside tone="warning" title="Heads up">
        Be careful with this
      </Aside>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
