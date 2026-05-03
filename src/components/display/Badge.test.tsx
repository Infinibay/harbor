import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children text", () => {
    const { container } = renderWithHarbor(<Badge>Active</Badge>);
    expect(container.textContent).toContain("Active");
  });

  it("renders neutral tone by default", () => {
    const { container } = renderWithHarbor(<Badge>Default</Badge>);
    const span = container.querySelector("span");
    expect(span?.className).toContain("bg-white/10");
  });

  it("renders success tone", () => {
    const { container } = renderWithHarbor(<Badge tone="success">OK</Badge>);
    const span = container.querySelector("span");
    expect(span?.className).toContain("bg-emerald-500/15");
  });

  it("renders danger tone", () => {
    const { container } = renderWithHarbor(<Badge tone="danger">Error</Badge>);
    const span = container.querySelector("span");
    expect(span?.className).toContain("bg-rose-500/15");
  });

  it("renders pulse dot when pulse=true", () => {
    const { container } = renderWithHarbor(<Badge pulse>Live</Badge>);
    const dot = container.querySelector(".animate-spin, [class*='scale']");
    // Pulse renders a motion.span with animate
    expect(container.querySelector("span.relative.inline-flex")).toBeTruthy();
  });

  it("renders icon when provided", () => {
    const { container } = renderWithHarbor(
      <Badge icon={<span data-testid="icon">⚡</span>}>Fast</Badge>,
    );
    expect(container.querySelector("[data-testid='icon']")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<Badge className="my-badge">Test</Badge>);
    expect(container.querySelector(".my-badge")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<Badge tone="info">Accessible</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
