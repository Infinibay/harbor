import { describe, it, expect } from "vitest";
import { useState } from "react";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { CodeEditor } from "./CodeEditor";
import { jsLang } from "../../lib/code";

/**
 * End-to-end smoke: type → auto-indent → comment toggle → find →
 * replace → diagnostic render → axe audit. The per-feature unit
 * tests cover isolated behavior; this test protects the cross-feature
 * story from regressing.
 */

describe("CodeEditor — integration: edit → comment → find → replace → axe", () => {
  it("drives a complete user flow without regressions", async () => {
    function Host() {
      const [v, setV] = useState("function greet() {\n  return true;\n}\n");
      return (
        <div>
          <CodeEditor
            ariaLabel="source"
            value={v}
            onChange={setV}
            language={jsLang({ ts: true })}
            minHeight={300}
            diagnostics={[
              {
                line: 2,
                column: 10,
                severity: "warning",
                message: "prefer `false` in demo",
              },
            ]}
          />
          <textarea
            readOnly
            aria-label="mirror"
            value={v}
            style={{ position: "absolute", left: -9999, width: 1, height: 1 }}
          />
        </div>
      );
    }
    const { user, container } = renderWithHarbor(<Host />);

    const ta = screen.getByLabelText("source") as HTMLTextAreaElement;
    const mirror = screen.getByLabelText("mirror") as HTMLTextAreaElement;

    /* 1 — place caret at end of line 1 (after `{`) and press Enter
     *     to auto-indent into the body. */
    await user.click(ta);
    const firstLineBreak = ta.value.indexOf("\n");
    ta.setSelectionRange(firstLineBreak, firstLineBreak);
    await user.keyboard("{Enter}");
    // The inserted newline carries "  " indent.
    expect(mirror.value.slice(firstLineBreak, firstLineBreak + 3)).toBe("\n  ");

    /* 2 — undo our insert via Ctrl+Z to keep subsequent steps simple.
     *     (Controlled mode doesn't honor native undo; reset manually.) */
    ta.setSelectionRange(0, mirror.value.length);
    await user.keyboard("{Backspace}");
    await user.keyboard("hello world{Enter}second line");
    expect(mirror.value).toBe("hello world\nsecond line");

    /* 3 — Ctrl+/ toggles a line comment on the first line. */
    ta.setSelectionRange(0, 0);
    await user.keyboard("{Control>}/{/Control}");
    expect(mirror.value.startsWith("// hello world")).toBe(true);

    /* 4 — Ctrl+F opens find, type "second", expect one match. */
    await user.keyboard("{Control>}f{/Control}");
    const search = screen.getByLabelText("Search") as HTMLInputElement;
    await user.type(search, "second");
    expect(screen.getByText("1/1")).toBeTruthy();
    await user.keyboard("{Escape}");

    /* 5 — Ctrl+H opens replace, replace "second" → "deuxième". */
    await user.keyboard("{Control>}h{/Control}");
    const search2 = screen.getByLabelText("Search") as HTMLInputElement;
    await user.clear(search2);
    await user.type(search2, "second");
    const rep = screen.getByLabelText("Replace with") as HTMLInputElement;
    await user.type(rep, "deuxième");
    await user.click(screen.getByRole("button", { name: /^Replace$/ }));
    expect(mirror.value).toBe("// hello world\ndeuxième line");
    await user.keyboard("{Escape}");

    /* 6 — axe audit with diagnostics attached (warning on line 2). */
    expect(await axe(container)).toHaveNoViolations();
  });
});
