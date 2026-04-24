import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { useState } from "react";
import { CodeEditor } from "./CodeEditor";
import { jsLang, jsonLang } from "../../lib/code";

describe("CodeEditor — rendering + highlighting", () => {
  it("renders the provided value", () => {
    renderWithHarbor(
      <CodeEditor
        ariaLabel="source"
        value={"const x = 1;"}
        language={jsLang()}
        onChange={() => {}}
      />,
    );
    expect(screen.getByLabelText("source")).toHaveValue("const x = 1;");
  });

  it("emits highlight spans for keywords", () => {
    const { container } = renderWithHarbor(
      <CodeEditor
        ariaLabel="source"
        defaultValue="const x = 1;"
        language={jsLang()}
      />,
    );
    // keyword class applied on the highlighted `const`
    expect(
      container.querySelector(".text-\\[rgb\\(var\\(--harbor-syntax-keyword\\)\\)\\]"),
    ).not.toBeNull();
  });

  it("renders line numbers by default", () => {
    const { container } = renderWithHarbor(
      <CodeEditor
        ariaLabel="source"
        defaultValue={"line 1\nline 2\nline 3"}
        language={jsLang()}
      />,
    );
    const gutter = container.querySelector(
      "[aria-hidden].border-r",
    ) as HTMLElement;
    expect(gutter).toBeTruthy();
    const numbers = Array.from(gutter.querySelectorAll("div")).map((d) =>
      d.textContent?.trim(),
    );
    expect(numbers).toContain("1");
    expect(numbers).toContain("2");
    expect(numbers).toContain("3");
  });

  it("accepts `showLineNumbers=false`", () => {
    const { container } = renderWithHarbor(
      <CodeEditor
        ariaLabel="source"
        defaultValue={"line 1\nline 2"}
        language={jsLang()}
        showLineNumbers={false}
      />,
    );
    // gutter div should not exist
    const texts = Array.from(container.querySelectorAll("div")).map((d) => d.textContent);
    expect(texts.filter((t) => t === "1" || t === "2").length).toBeLessThan(2);
  });
});

describe("CodeEditor — editing", () => {
  it("typing characters updates the value", async () => {
    let current = "";
    function Host() {
      const [v, setV] = useState("");
      current = v;
      return (
        <CodeEditor
          ariaLabel="source"
          value={v}
          onChange={(n) => {
            setV(n);
          }}
          language={jsLang()}
        />
      );
    }
    const { user } = renderWithHarbor(<Host />);
    const ta = screen.getByLabelText("source") as HTMLTextAreaElement;
    await user.click(ta);
    await user.keyboard("abc");
    expect(current).toBe("abc");
  });

  it("Tab inserts configurable indent (2 spaces default)", async () => {
    let current = "";
    function Host() {
      const [v, setV] = useState("");
      current = v;
      return (
        <CodeEditor
          ariaLabel="source"
          value={v}
          onChange={setV}
          language={jsLang()}
        />
      );
    }
    const { user } = renderWithHarbor(<Host />);
    const ta = screen.getByLabelText("source") as HTMLTextAreaElement;
    await user.click(ta);
    await user.keyboard("{Tab}");
    expect(current).toBe("  ");
  });

  it("Shift+Tab dedents the current line", async () => {
    let current = "    const x = 1;";
    function Host() {
      const [v, setV] = useState("    const x = 1;");
      current = v;
      return (
        <CodeEditor
          ariaLabel="source"
          value={v}
          onChange={setV}
          language={jsLang()}
        />
      );
    }
    const { user } = renderWithHarbor(<Host />);
    const ta = screen.getByLabelText("source") as HTMLTextAreaElement;
    await user.click(ta);
    ta.setSelectionRange(0, 0);
    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(current).toBe("  const x = 1;");
  });

  it("Enter after `{` indents one extra level", async () => {
    let current = "if (x) {";
    function Host() {
      const [v, setV] = useState("if (x) {");
      current = v;
      return (
        <CodeEditor
          ariaLabel="source"
          value={v}
          onChange={setV}
          language={jsLang()}
        />
      );
    }
    const { user } = renderWithHarbor(<Host />);
    const ta = screen.getByLabelText("source") as HTMLTextAreaElement;
    await user.click(ta);
    ta.setSelectionRange(ta.value.length, ta.value.length);
    await user.keyboard("{Enter}");
    expect(current).toBe("if (x) {\n  ");
  });

  it("Enter between `{}` splits and aligns both rows", async () => {
    let current = "if (x) {}";
    function Host() {
      const [v, setV] = useState("if (x) {}");
      current = v;
      return (
        <CodeEditor
          ariaLabel="source"
          value={v}
          onChange={setV}
          language={jsLang()}
        />
      );
    }
    const { user } = renderWithHarbor(<Host />);
    const ta = screen.getByLabelText("source") as HTMLTextAreaElement;
    await user.click(ta);
    // place caret between `{` and `}`
    ta.setSelectionRange(8, 8);
    await user.keyboard("{Enter}");
    expect(current).toBe("if (x) {\n  \n}");
  });

  it("typing `(` auto-closes to `()`", async () => {
    let current = "";
    function Host() {
      const [v, setV] = useState("");
      current = v;
      return (
        <CodeEditor
          ariaLabel="source"
          value={v}
          onChange={setV}
          language={jsLang()}
        />
      );
    }
    const { user } = renderWithHarbor(<Host />);
    const ta = screen.getByLabelText("source") as HTMLTextAreaElement;
    await user.click(ta);
    await user.keyboard("(");
    expect(current).toBe("()");
  });

  it("readOnly: refuses edits", async () => {
    let current = "const x = 1;";
    function Host() {
      const [v, setV] = useState("const x = 1;");
      current = v;
      return (
        <CodeEditor
          ariaLabel="source"
          value={v}
          onChange={setV}
          language={jsLang()}
          readOnly
        />
      );
    }
    const { user } = renderWithHarbor(<Host />);
    const ta = screen.getByLabelText("source") as HTMLTextAreaElement;
    await user.click(ta);
    await user.keyboard("x");
    expect(current).toBe("const x = 1;");
  });

  it("uncontrolled mode with defaultValue + onChange", async () => {
    const changes: string[] = [];
    const { user } = renderWithHarbor(
      <CodeEditor
        ariaLabel="source"
        defaultValue="a"
        language={jsonLang()}
        onChange={(v) => changes.push(v)}
      />,
    );
    const ta = screen.getByLabelText("source") as HTMLTextAreaElement;
    await user.click(ta);
    await user.keyboard("b");
    expect(ta.value).toBe("ab");
    expect(changes.at(-1)).toBe("ab");
  });
});

describe("CodeEditor — a11y", () => {
  it("passes axe with label + default content", async () => {
    const { container } = renderWithHarbor(
      <CodeEditor
        ariaLabel="source"
        defaultValue={"const x = 1;\nconst y = 2;"}
        language={jsLang()}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("does not fire onKeyDown twice when we intercept Tab", async () => {
    const onKeyDown = vi.fn();
    const { user } = renderWithHarbor(
      <CodeEditor
        ariaLabel="source"
        defaultValue=""
        language={jsLang()}
        onKeyDown={onKeyDown}
      />,
    );
    const ta = screen.getByLabelText("source") as HTMLTextAreaElement;
    await user.click(ta);
    await user.keyboard("{Tab}");
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });
});
