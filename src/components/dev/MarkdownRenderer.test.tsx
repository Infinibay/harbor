import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { MarkdownRenderer } from "./MarkdownRenderer";

describe("MarkdownRenderer", () => {
  it("renders plain text as paragraph", () => {
    const { container } = renderWithHarbor(
      <MarkdownRenderer source="Hello world" />,
    );
    expect(container.textContent).toContain("Hello world");
    expect(container.querySelector("p")).toBeTruthy();
  });

  it("renders headings h1-h3", () => {
    const { container } = renderWithHarbor(
      <MarkdownRenderer source={"# Heading 1\n## Heading 2\n### Heading 3"} />,
    );
    const h1 = container.querySelector("h1");
    const h2 = container.querySelector("h2");
    const h3 = container.querySelector("h3");
    expect(h1).toBeTruthy();
    expect(h2).toBeTruthy();
    expect(h3).toBeTruthy();
  });

  it("renders bold text", () => {
    const { container } = renderWithHarbor(
      <MarkdownRenderer source="This is **bold** text" />,
    );
    const strong = container.querySelector("strong");
    expect(strong).toBeTruthy();
    expect(strong?.textContent).toContain("bold");
  });

  it("renders italic text", () => {
    const { container } = renderWithHarbor(
      <MarkdownRenderer source="This is *italic* text" />,
    );
    const em = container.querySelector("em");
    expect(em).toBeTruthy();
    expect(em?.textContent).toContain("italic");
  });

  it("renders inline code", () => {
    const { container } = renderWithHarbor(
      <MarkdownRenderer source="Use `console.log` here" />,
    );
    const code = container.querySelector("code");
    expect(code).toBeTruthy();
    expect(code?.textContent).toContain("console.log");
  });

  it("renders fenced code blocks", () => {
    const { container } = renderWithHarbor(
      <MarkdownRenderer source={"```js\nconsole.log('hi')\n```"} />,
    );
    const pre = container.querySelector("pre");
    expect(pre).toBeTruthy();
    expect(container.textContent).toContain("console.log('hi')");
    expect(container.textContent).toContain("js");
  });

  it("renders blockquotes", () => {
    const { container } = renderWithHarbor(
      <MarkdownRenderer source="> This is a quote" />,
    );
    const bq = container.querySelector("blockquote");
    expect(bq).toBeTruthy();
    expect(container.textContent).toContain("This is a quote");
  });

  it("renders unordered lists", () => {
    const { container } = renderWithHarbor(
      <MarkdownRenderer source="- item one\n- item two" />,
    );
    const ul = container.querySelector("ul");
    expect(ul).toBeTruthy();
    expect(container.textContent).toContain("item one");
    expect(container.textContent).toContain("item two");
  });

  it("renders ordered lists", () => {
    const { container } = renderWithHarbor(
      <MarkdownRenderer source="1. first\n2. second" />,
    );
    const ol = container.querySelector("ol");
    expect(ol).toBeTruthy();
    expect(container.textContent).toContain("first");
    expect(container.textContent).toContain("second");
  });

  it("renders links", () => {
    const { container } = renderWithHarbor(
      <MarkdownRenderer source="[Harbor](https://example.com)" />,
    );
    const a = container.querySelector("a");
    expect(a).toBeTruthy();
    expect(a?.getAttribute("href")).toBe("https://example.com");
    expect(a?.textContent).toContain("Harbor");
  });

  it("renders horizontal rule", () => {
    const { container } = renderWithHarbor(
      <MarkdownRenderer source={"above\n---\nbelow"} />,
    );
    const hr = container.querySelector("hr");
    expect(hr).toBeTruthy();
  });

  it("renders empty source", () => {
    const { container } = renderWithHarbor(
      <MarkdownRenderer source="" />,
    );
    expect(container.querySelector("div")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <MarkdownRenderer source="text" className="my-md" />,
    );
    expect(container.querySelector(".my-md")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <MarkdownRenderer
        source={"# Title\n\nParagraph with **bold** and *italic*.\n\n- list item"}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
