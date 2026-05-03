import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { FeatureCard } from "./FeatureCard";

describe("FeatureCard", () => {
  it("renders title and description", () => {
    const { container } = renderWithHarbor(
      <FeatureCard title="Fast" description="Blazing fast" />,
    );
    expect(container.textContent).toContain("Fast");
    expect(container.textContent).toContain("Blazing fast");
  });

  it("renders icon", () => {
    const { container } = renderWithHarbor(
      <FeatureCard title="Test" description="Desc" icon={<span data-testid="ic">⚡</span>} />,
    );
    expect(container.querySelector("[data-testid='ic']")).toBeTruthy();
  });

  it("renders link when href provided", () => {
    const { container } = renderWithHarbor(
      <FeatureCard title="Test" description="Desc" href="/docs" />,
    );
    const link = container.querySelector("a");
    expect(link).toBeTruthy();
    expect(link?.getAttribute("href")).toBe("/docs");
    expect(container.textContent).toContain("Learn more →");
  });

  it("uses custom linkLabel", () => {
    const { container } = renderWithHarbor(
      <FeatureCard title="Test" description="Desc" href="/docs" linkLabel="Read" />,
    );
    expect(container.textContent).toContain("Read");
  });

  it("does not render link when no href", () => {
    const { container } = renderWithHarbor(
      <FeatureCard title="Test" description="Desc" />,
    );
    expect(container.querySelector("a")).toBeNull();
  });

  it("applies fuchsia accent by default", () => {
    const { container } = renderWithHarbor(
      <FeatureCard title="Test" description="Desc" icon={<span>X</span>} />,
    );
    expect(container.querySelector(".bg-fuchsia-500\\/10")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <FeatureCard title="X" description="D" className="my-card" />,
    );
    expect(container.querySelector(".my-card")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <FeatureCard title="Feature" description="A feature" href="/docs" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
