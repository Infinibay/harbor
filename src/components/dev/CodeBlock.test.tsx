import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { CodeBlock } from "./CodeBlock";

const code = `function hello() {
  return "world";
}`;

describe("CodeBlock", () => {
  it("renders code lines", () => {
    const { container } = renderWithHarbor(<CodeBlock code={code} />);
    expect(container.textContent).toContain("function hello()");
    expect(container.textContent).toContain('return "world"');
  });

  it("renders line numbers by default (showLineNumbers=true)", () => {
    const { container } = renderWithHarbor(<CodeBlock code={code} />);
    expect(container.textContent).toContain("1");
    expect(container.textContent).toContain("2");
    expect(container.textContent).toContain("3");
  });

  it("hides line numbers when showLineNumbers=false", () => {
    const { container } = renderWithHarbor(
      <CodeBlock code={code} showLineNumbers={false} />,
    );
    // The line-number spans should not be present
    const lineNumSpans = container.querySelectorAll("span.text-white\\/25");
    expect(lineNumSpans.length).toBe(0);
  });

  it("renders title in header bar", () => {
    renderWithHarbor(<CodeBlock code={code} title="index.ts" />);
    expect(screen.getByText("index.ts")).toBeInTheDocument();
  });

  it("renders lang badge in header bar", () => {
    renderWithHarbor(<CodeBlock code={code} lang="typescript" />);
    expect(screen.getByText("typescript")).toBeInTheDocument();
  });

  it("renders both title and lang", () => {
    renderWithHarbor(<CodeBlock code={code} title="app.tsx" lang="tsx" />);
    expect(screen.getByText("app.tsx")).toBeInTheDocument();
    expect(screen.getByText("tsx")).toBeInTheDocument();
  });

  it("shows CopyButton in header when title or lang provided", () => {
    renderWithHarbor(<CodeBlock code="x" title="test" />);
    // CopyButton renders a button
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows CopyButton in corner when no title or lang", () => {
    renderWithHarbor(<CodeBlock code="hello" />);
    // CopyButton is positioned absolute top-right
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("highlights specified line numbers", () => {
    const { container } = renderWithHarbor(
      <CodeBlock code={code} highlight={[1, 3]} />,
    );
    const highlighted = container.querySelectorAll(".bg-fuchsia-500\\/10");
    expect(highlighted.length).toBe(2);
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <CodeBlock code="x" className="my-block" />,
    );
    const el = container.querySelector(".my-block");
    expect(el).toBeTruthy();
  });

  it("renders empty code string", () => {
    const { container } = renderWithHarbor(<CodeBlock code="" />);
    expect(container.querySelector("pre")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <CodeBlock code={code} title="test.ts" lang="ts" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
