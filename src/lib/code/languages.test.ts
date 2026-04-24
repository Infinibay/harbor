import { describe, it, expect } from "vitest";
import { tokenizeLine } from "./highlight";
import { cssLang } from "./languages/css";
import { htmlLang } from "./languages/html";
import { markdownLang } from "./languages/markdown";
import { bashLang } from "./languages/bash";
import { yamlLang } from "./languages/yaml";
import type { Token } from "./types";

function typesOf(tokens: Token[]): string[] {
  return tokens.filter((t) => t.text.trim()).map((t) => `${t.type ?? "_"}:${t.text}`);
}

describe("cssLang", () => {
  const css = cssLang();

  it("classifies selector, property, value", () => {
    const lines = [".btn {", "  color: red;", "}"];
    let state = css.startState();
    const out: string[][] = [];
    for (const line of lines) {
      const r = tokenizeLine(line, css, state);
      out.push(typesOf(r.tokens));
      state = r.endState;
    }
    expect(out[0]).toContain("type:.btn");
    expect(out[1]).toContain("property:color");
    expect(out[1]).toContain("variable:red");
  });

  it("block comment continues across lines", () => {
    let state = css.startState();
    const a = tokenizeLine("/* top", css, state);
    state = a.endState;
    const b = tokenizeLine("still comment */ body {", css, state);
    const comment = b.tokens.filter((t) => t.type === "comment");
    expect(comment.length).toBeGreaterThan(0);
  });

  it("at-rules", () => {
    const { tokens } = tokenizeLine("@media (min-width: 600px) {", css, css.startState());
    expect(tokens.some((t) => t.type === "keyword" && t.text === "@media")).toBe(true);
  });
});

describe("htmlLang", () => {
  const html = htmlLang();

  it("tags and attributes", () => {
    const { tokens } = tokenizeLine('<a href="#">text</a>', html, html.startState());
    const kinds = typesOf(tokens);
    expect(kinds).toContain("tag:a");
    expect(kinds).toContain("attribute:href");
    expect(kinds.some((k) => k.startsWith("string:"))).toBe(true);
  });

  it("comments", () => {
    const { tokens } = tokenizeLine("<!-- hi -->", html, html.startState());
    expect(tokens.some((t) => t.type === "comment")).toBe(true);
  });

  it("script tag switches to rawText mode", () => {
    let state = html.startState();
    const a = tokenizeLine("<script>", html, state);
    state = a.endState;
    const b = tokenizeLine("const x = 1;", html, state);
    // Inside script, the whole line is classified as raw.
    expect(b.tokens.some((t) => t.type === "string")).toBe(true);
  });
});

describe("markdownLang", () => {
  const md = markdownLang();

  it("headings", () => {
    const { tokens } = tokenizeLine("## hello", md, md.startState());
    expect(tokens[0].type).toBe("heading");
  });

  it("bold and italic", () => {
    const bold = tokenizeLine("**strong**", md, md.startState()).tokens;
    expect(bold[0].type).toBe("strong");
    const ital = tokenizeLine("*em*", md, md.startState()).tokens;
    expect(ital[0].type).toBe("emphasis");
  });

  it("fenced code block persists across lines", () => {
    let state = md.startState();
    const a = tokenizeLine("```js", md, state);
    state = a.endState;
    const b = tokenizeLine("const x = 1;", md, state);
    expect(b.tokens[0].type).toBe("meta");
    const c = tokenizeLine("```", md, b.endState);
    expect(c.tokens[0].type).toBe("meta");
  });

  it("link syntax", () => {
    const { tokens } = tokenizeLine("see [docs](https://example.com)", md, md.startState());
    expect(tokens.some((t) => t.type === "link")).toBe(true);
  });
});

describe("bashLang", () => {
  const bash = bashLang();

  it("comments", () => {
    const { tokens } = tokenizeLine("# hello", bash, bash.startState());
    expect(tokens[0].type).toBe("comment");
  });

  it("variables", () => {
    const { tokens } = tokenizeLine("echo $HOME", bash, bash.startState());
    expect(tokens.some((t) => t.type === "variable" && t.text === "$HOME")).toBe(true);
  });

  it("keywords", () => {
    const { tokens } = tokenizeLine("if [ -f x ]; then", bash, bash.startState());
    const kinds = typesOf(tokens);
    expect(kinds).toContain("keyword:if");
    expect(kinds).toContain("keyword:then");
  });
});

describe("yamlLang", () => {
  const yaml = yamlLang();

  it("keys and values", () => {
    const { tokens } = tokenizeLine("name: ada", yaml, yaml.startState());
    expect(typesOf(tokens)).toContain("property:name");
    expect(tokens.some((t) => t.type === "string")).toBe(true);
  });

  it("anchors and refs", () => {
    const { tokens } = tokenizeLine("base: &a 1", yaml, yaml.startState());
    expect(tokens.some((t) => t.type === "meta" && t.text === "&a")).toBe(true);
  });

  it("comments", () => {
    const { tokens } = tokenizeLine("# note", yaml, yaml.startState());
    expect(tokens[0].type).toBe("comment");
  });

  it("block scalar swallows indented body", () => {
    let state = yaml.startState();
    const a = tokenizeLine("script: |", yaml, state);
    state = a.endState;
    const b = tokenizeLine("  first line", yaml, state);
    expect(b.tokens[0].type).toBe("string");
  });
});
