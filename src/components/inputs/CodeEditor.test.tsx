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

describe("CodeEditor — selection commands", () => {
  it("Ctrl+D first press selects the word under caret", async () => {
    const { user } = renderWithHarbor(
      <CodeEditor
        ariaLabel="source"
        defaultValue="const apple = banana;"
        language={jsLang()}
      />,
    );
    const ta = screen.getByLabelText("source") as HTMLTextAreaElement;
    await user.click(ta);
    // place caret inside `apple`
    ta.setSelectionRange(8, 8);
    await user.keyboard("{Control>}d{/Control}");
    expect(ta.value.slice(ta.selectionStart, ta.selectionEnd)).toBe("apple");
  });

  it("Ctrl+D second press extends to the next occurrence", async () => {
    const { user } = renderWithHarbor(
      <CodeEditor
        ariaLabel="source"
        defaultValue={"fruit = apple;\nother = apple;"}
        language={jsLang()}
      />,
    );
    const ta = screen.getByLabelText("source") as HTMLTextAreaElement;
    await user.click(ta);
    ta.setSelectionRange(10, 10); // inside first "apple"
    await user.keyboard("{Control>}d{/Control}"); // selects apple @0
    await user.keyboard("{Control>}d{/Control}"); // jumps to second "apple"
    const selected = ta.value.slice(ta.selectionStart, ta.selectionEnd);
    expect(selected).toBe("apple");
    // the second "apple" starts at offset 23 in "fruit = apple;\nother = apple;"
    expect(ta.selectionStart).toBe(23);
  });

  it("Ctrl+L selects the current line", async () => {
    const { user } = renderWithHarbor(
      <CodeEditor
        ariaLabel="source"
        defaultValue={"line one\nline two\nline three"}
        language={jsLang()}
      />,
    );
    const ta = screen.getByLabelText("source") as HTMLTextAreaElement;
    await user.click(ta);
    ta.setSelectionRange(10, 10); // inside "line two"
    await user.keyboard("{Control>}l{/Control}");
    expect(ta.value.slice(ta.selectionStart, ta.selectionEnd)).toBe("line two");
  });
});

describe("CodeEditor — line commands", () => {
  function mount(initial: string) {
    let current = initial;
    function Host() {
      const [v, setV] = useState(initial);
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
    const res = renderWithHarbor(<Host />);
    const ta = res.getByLabelText("source") as HTMLTextAreaElement;
    return { ...res, ta, get current() { return current; } };
  }

  it("Ctrl+/ toggles a line comment on the current line", async () => {
    const ctx = mount("hello");
    await ctx.user.click(ctx.ta);
    ctx.ta.setSelectionRange(0, 0);
    await ctx.user.keyboard("{Control>}/{/Control}");
    expect(ctx.current).toBe("// hello");
    await ctx.user.keyboard("{Control>}/{/Control}");
    expect(ctx.current).toBe("hello");
  });

  it("Alt+ArrowUp moves the current line up", async () => {
    const ctx = mount("line one\nline two");
    await ctx.user.click(ctx.ta);
    ctx.ta.setSelectionRange(9, 9); // inside line two
    await ctx.user.keyboard("{Alt>}{ArrowUp}{/Alt}");
    expect(ctx.current).toBe("line two\nline one");
  });

  it("Alt+ArrowDown moves the current line down", async () => {
    const ctx = mount("line one\nline two");
    await ctx.user.click(ctx.ta);
    ctx.ta.setSelectionRange(0, 0);
    await ctx.user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    expect(ctx.current).toBe("line two\nline one");
  });

  it("Ctrl+Shift+K deletes the current line", async () => {
    const ctx = mount("line one\nline two\nline three");
    await ctx.user.click(ctx.ta);
    ctx.ta.setSelectionRange(9, 9);
    await ctx.user.keyboard("{Control>}{Shift>}k{/Shift}{/Control}");
    expect(ctx.current).toBe("line one\nline three");
  });
});

describe("CodeEditor — find & replace", () => {
  it("Ctrl+F opens a find panel", async () => {
    const { user } = renderWithHarbor(
      <CodeEditor
        ariaLabel="source"
        defaultValue="apple banana apple cherry"
        language={jsLang()}
      />,
    );
    const ta = screen.getByLabelText("source") as HTMLTextAreaElement;
    await user.click(ta);
    await user.keyboard("{Control>}f{/Control}");
    expect(screen.getByRole("region", { name: /find and replace/i })).toBeTruthy();
  });

  it("Find + Enter jumps through matches", async () => {
    const { user } = renderWithHarbor(
      <CodeEditor
        ariaLabel="source"
        defaultValue="apple banana apple cherry"
        language={jsLang()}
      />,
    );
    const ta = screen.getByLabelText("source") as HTMLTextAreaElement;
    await user.click(ta);
    await user.keyboard("{Control>}f{/Control}");
    const search = screen.getByLabelText("Search") as HTMLInputElement;
    await user.type(search, "apple");
    // Count: 2 matches (positions 0 and 13).
    expect(screen.getByText("1/2")).toBeTruthy();
    await user.keyboard("{Enter}"); // next → 2/2
    expect(screen.getByText("2/2")).toBeTruthy();
  });

  it("Ctrl+H replaces the current match", async () => {
    let current = "apple banana apple";
    function Host() {
      const [v, setV] = useState(current);
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
    await user.keyboard("{Control>}h{/Control}");
    const search = screen.getByLabelText("Search") as HTMLInputElement;
    await user.type(search, "apple");
    const replace = screen.getByLabelText("Replace with") as HTMLInputElement;
    await user.type(replace, "orange");
    await user.click(screen.getByRole("button", { name: /^Replace$/ }));
    expect(current).toBe("orange banana apple");
    await user.click(screen.getByRole("button", { name: /^All$/ }));
    expect(current).toBe("orange banana orange");
  });
});

describe("CodeEditor — virtualization", () => {
  it("renders far fewer DOM nodes than source lines for a 10k-line file", () => {
    const lines = Array.from({ length: 10_000 }, (_, i) => `const v${i} = ${i};`);
    const source = lines.join("\n");
    const { container } = renderWithHarbor(
      <CodeEditor
        ariaLabel="source"
        defaultValue={source}
        language={jsLang()}
        height={400}
      />,
    );
    const rendered = container.querySelectorAll("[data-line]").length;
    // Viewport is 0 at jsdom render time, but we cap the initial budget
    // so first paint doesn't yield 10k nodes. Real browsers measure the
    // viewport via ResizeObserver and then further shrink the window.
    expect(rendered).toBeLessThan(200);
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
